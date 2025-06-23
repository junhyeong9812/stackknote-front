/**
 * 에디터 관련 커스텀 훅
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePageStore } from '@/lib/stores';
import { env } from '@/lib/config/env';

/**
 * 에디터 상태 관리 훅
 */
export function useEditor() {
  const {
    currentPage,
    hasUnsavedChanges,
    isSaving,
    saveError,
    updatePageContent,
    saveCurrentPage,
    setUnsavedChanges,
    clearSaveError,
  } = usePageStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [selection, setSelection] = useState<{
    from: number;
    to: number;
    blockId?: string;
  } | null>(null);

  // 에디터 인스턴스 참조
  const editorRef = useRef<any>(null);

  // 에디터 초기화
  const initializeEditor = useCallback(() => {
    setIsInitialized(true);
  }, []);

  // 콘텐츠 변경 처리
  const handleContentChange = useCallback(
    (content: string) => {
      updatePageContent(content);
    },
    [updatePageContent]
  );

  // 수동 저장
  const handleSave = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    try {
      await saveCurrentPage();
    } catch (error) {
      console.error('Save error:', error);
    }
  }, [hasUnsavedChanges, saveCurrentPage]);

  // 에디터 포커스
  const focusEditor = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  // 블록 선택
  const selectBlock = useCallback((blockId: string) => {
    setFocusedBlockId(blockId);
  }, []);

  // 선택 영역 설정
  const setEditorSelection = useCallback(
    (from: number, to: number, blockId?: string) => {
      setSelection({ from, to, blockId });
    },
    []
  );

  return {
    // 상태
    currentPage,
    hasUnsavedChanges,
    isSaving,
    saveError,
    isInitialized,
    focusedBlockId,
    selection,

    // 참조
    editorRef,

    // 액션
    initializeEditor,
    handleContentChange,
    handleSave,
    focusEditor,
    selectBlock,
    setEditorSelection,
    setUnsavedChanges,
    clearSaveError,
  };
}

/**
 * 자동 저장 훅
 */
export function useAutoSave() {
  const { hasUnsavedChanges, saveCurrentPage } = usePageStore();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 저장 실행
  const performAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    try {
      await saveCurrentPage();
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto save error:', error);
    }
  }, [hasUnsavedChanges, saveCurrentPage]);

  // 자동 저장 스케줄링
  const scheduleAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, env.EDITOR_AUTO_SAVE_INTERVAL);
  }, [performAutoSave]);

  // 콘텐츠 변경시 자동 저장 스케줄링
  useEffect(() => {
    if (hasUnsavedChanges) {
      scheduleAutoSave();
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, scheduleAutoSave]);

  // 컴포넌트 언마운트시 정리
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    lastSaved,
    isAutoSaveEnabled: env.EDITOR_AUTO_SAVE_INTERVAL > 0,
    performAutoSave,
  };
}

/**
 * 에디터 단축키 훅
 */
export function useEditorShortcuts() {
  const { handleSave } = useEditor();
  const [activeShortcuts, setActiveShortcuts] = useState<Set<string>>(
    new Set()
  );

  // 단축키 처리
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const { key, metaKey, ctrlKey, shiftKey, altKey } = event;

      // 모디파이어 키 조합 생성
      const modifiers: string[] = [];
      if (metaKey || ctrlKey) modifiers.push('Mod');
      if (shiftKey) modifiers.push('Shift');
      if (altKey) modifiers.push('Alt');

      const shortcut = [...modifiers, key].join('+');

      // 단축키 처리
      switch (shortcut) {
        case 'Mod+s':
        case 'Mod+S':
          event.preventDefault();
          handleSave();
          break;

        case 'Mod+z':
        case 'Mod+Z':
          event.preventDefault();
          // Undo 처리
          break;

        case 'Mod+y':
        case 'Mod+Y':
          event.preventDefault();
          // Redo 처리
          break;

        default:
          break;
      }

      setActiveShortcuts(prev => new Set([...Array.from(prev), shortcut]));
    },
    [handleSave]
  );

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    const { key, metaKey, ctrlKey, shiftKey, altKey } = event;

    const modifiers: string[] = [];
    if (metaKey || ctrlKey) modifiers.push('Mod');
    if (shiftKey) modifiers.push('Shift');
    if (altKey) modifiers.push('Alt');

    const shortcut = [...modifiers, key].join('+');

    setActiveShortcuts(prev => {
      const next = new Set(Array.from(prev));
      next.delete(shortcut);
      return next;
    });
  }, []);

  // 이벤트 리스너 등록
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return {
    activeShortcuts: Array.from(activeShortcuts),
    isShortcutActive: (shortcut: string) => activeShortcuts.has(shortcut),
  };
}

/**
 * 에디터 히스토리 관리 훅
 */
export function useEditorHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // 히스토리 추가
  const pushHistory = useCallback(
    (state: any) => {
      setHistory(prev => {
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(state);

        // 히스토리 제한
        if (newHistory.length > env.EDITOR_HISTORY_LIMIT) {
          newHistory.shift();
          return newHistory;
        }

        return newHistory;
      });

      setCurrentIndex(prev => Math.min(prev + 1, env.EDITOR_HISTORY_LIMIT - 1));
    },
    [currentIndex]
  );

  // Undo
  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [canUndo, history, currentIndex]);

  // Redo
  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [canRedo, history, currentIndex]);

  // 상태 업데이트
  useEffect(() => {
    setCanUndo(currentIndex > 0);
    setCanRedo(currentIndex < history.length - 1);
  }, [currentIndex, history.length]);

  // 히스토리 초기화
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    pushHistory,
    clearHistory,
    historyLength: history.length,
    currentIndex,
  };
}

/**
 * 블록 관리 훅
 */
export function useBlocks() {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<Set<string>>(new Set());

  // 블록 추가
  const addBlock = useCallback((block: any, index?: number) => {
    setBlocks(prev => {
      const newBlocks = [...prev];
      if (index !== undefined) {
        newBlocks.splice(index, 0, block);
      } else {
        newBlocks.push(block);
      }
      return newBlocks;
    });
  }, []);

  // 블록 제거
  const removeBlock = useCallback((blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setSelectedBlocks(prev => {
      const next = new Set(Array.from(prev));
      next.delete(blockId);
      return next;
    });
  }, []);

  // 블록 이동
  const moveBlock = useCallback((blockId: string, newIndex: number) => {
    setBlocks(prev => {
      const blockIndex = prev.findIndex(block => block.id === blockId);
      if (blockIndex === -1) return prev;

      const newBlocks = [...prev];
      const [block] = newBlocks.splice(blockIndex, 1);
      newBlocks.splice(newIndex, 0, block);

      return newBlocks;
    });
  }, []);

  // 블록 복제
  const duplicateBlock = useCallback((blockId: string) => {
    setBlocks(prev => {
      const blockIndex = prev.findIndex(block => block.id === blockId);
      if (blockIndex === -1) return prev;

      const block = prev[blockIndex];
      const duplicatedBlock = {
        ...block,
        id: `${block.id}-copy-${Date.now()}`,
      };

      const newBlocks = [...prev];
      newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);

      return newBlocks;
    });
  }, []);

  // 블록 선택
  const selectBlock = useCallback((blockId: string, multiSelect = false) => {
    setSelectedBlocks(prev => {
      if (multiSelect) {
        const next = new Set(Array.from(prev));
        if (next.has(blockId)) {
          next.delete(blockId);
        } else {
          next.add(blockId);
        }
        return next;
      } else {
        return new Set([blockId]);
      }
    });
  }, []);

  // 모든 블록 선택 해제
  const clearSelection = useCallback(() => {
    setSelectedBlocks(new Set());
  }, []);

  // 선택된 블록들 제거
  const removeSelectedBlocks = useCallback(() => {
    setBlocks(prev => prev.filter(block => !selectedBlocks.has(block.id)));
    setSelectedBlocks(new Set());
  }, [selectedBlocks]);

  return {
    blocks,
    selectedBlocks: Array.from(selectedBlocks),
    selectedBlocksSet: selectedBlocks,
    addBlock,
    removeBlock,
    moveBlock,
    duplicateBlock,
    selectBlock,
    clearSelection,
    removeSelectedBlocks,
    setBlocks,
  };
}

/**
 * 에디터 포맷팅 훅
 */
export function useEditorFormatting() {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  // 포맷 적용
  const applyFormat = useCallback((format: string, value?: any) => {
    // BlockNote 에디터의 포맷팅 API 호출
    console.log('Applying format:', format, value);

    setActiveFormats(prev => {
      const next = new Set(Array.from(prev));
      if (next.has(format)) {
        next.delete(format);
      } else {
        next.add(format);
      }
      return next;
    });
  }, []);

  // 포맷 제거
  const removeFormat = useCallback((format: string) => {
    setActiveFormats(prev => {
      const next = new Set(Array.from(prev));
      next.delete(format);
      return next;
    });
  }, []);

  // 포맷 토글
  const toggleFormat = useCallback(
    (format: string, value?: any) => {
      if (activeFormats.has(format)) {
        removeFormat(format);
      } else {
        applyFormat(format, value);
      }
    },
    [activeFormats, applyFormat, removeFormat]
  );

  // 활성 포맷 확인
  const isFormatActive = useCallback(
    (format: string) => {
      return activeFormats.has(format);
    },
    [activeFormats]
  );

  return {
    activeFormats: Array.from(activeFormats),
    applyFormat,
    removeFormat,
    toggleFormat,
    isFormatActive,
  };
}

/**
 * 에디터 검색 훅
 */
export function useEditorSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 검색 실행
  const search = useCallback((query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setCurrentResultIndex(-1);
      return;
    }

    // 검색 로직 구현 (추후)
    console.log('Searching for:', query);

    // 임시 결과
    setSearchResults([]);
    setCurrentResultIndex(-1);
  }, []);

  // 다음 결과로 이동
  const goToNext = useCallback(() => {
    if (searchResults.length === 0) return;

    setCurrentResultIndex(prev =>
      prev >= searchResults.length - 1 ? 0 : prev + 1
    );
  }, [searchResults.length]);

  // 이전 결과로 이동
  const goToPrevious = useCallback(() => {
    if (searchResults.length === 0) return;

    setCurrentResultIndex(prev =>
      prev <= 0 ? searchResults.length - 1 : prev - 1
    );
  }, [searchResults.length]);

  // 검색 닫기
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setCurrentResultIndex(-1);
  }, []);

  // 검색 열기
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  return {
    searchQuery,
    searchResults,
    currentResultIndex,
    isSearchOpen,
    search,
    goToNext,
    goToPrevious,
    closeSearch,
    openSearch,
    hasResults: searchResults.length > 0,
    totalResults: searchResults.length,
  };
}

/**
 * 에디터 이벤트 훅
 */
export function useEditorEvents() {
  const [events, setEvents] = useState<
    Array<{
      type: string;
      data: any;
      timestamp: number;
    }>
  >([]);

  // 이벤트 발생
  const emitEvent = useCallback((type: string, data: any) => {
    const event = {
      type,
      data,
      timestamp: Date.now(),
    };

    setEvents(prev => [...prev.slice(-99), event]); // 최대 100개 이벤트 유지

    // 커스텀 이벤트 발생
    const customEvent = new CustomEvent(type, { detail: data });
    document.dispatchEvent(customEvent);
  }, []);

  // 이벤트 리스너 등록
  const addEventListener = useCallback(
    (type: string, handler: (data: any) => void) => {
      const listener = (event: CustomEvent) => {
        handler(event.detail);
      };

      document.addEventListener(type, listener as EventListener);

      return () => {
        document.removeEventListener(type, listener as EventListener);
      };
    },
    []
  );

  // 이벤트 히스토리 초기화
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    emitEvent,
    addEventListener,
    clearEvents,
  };
}
