// components/editor/blocknote-editor.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Block, PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { useEditor, useAutoSave, useEditorShortcuts } from '@/lib/hooks';
import { BLOCKNOTE_CONFIG } from '@/lib/config/editor-config';
import { cn } from '@/lib/utils/cn';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';

// BlockNoteEditor를 다른 이름으로 import하여 충돌 방지
import type { BlockNoteEditor as BNEditor } from '@blocknote/core';

interface BlockNoteEditorComponentProps {
  className?: string;
  initialContent?: PartialBlock[];
  editable?: boolean;
  placeholder?: string;
  onContentChange?: (content: PartialBlock[]) => void;
  onSelectionChange?: (selection: any) => void;
}

export function BlockNoteEditor({
  className,
  initialContent,
  editable = true,
  placeholder,
  onContentChange,
  onSelectionChange,
}: BlockNoteEditorComponentProps) {
  const {
    editorRef,
    handleContentChange,
    focusEditor,
    isInitialized,
    initializeEditor,
  } = useEditor();

  const { lastSaved } = useAutoSave();
  useEditorShortcuts();

  const mountRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // BlockNote 에디터 설정
  const editor = useCreateBlockNote({
    initialContent: initialContent || [
      {
        type: 'paragraph',
        content: [],
      },
    ],
    uploadFile: async (file: File) => {
      // 파일 업로드 로직 (추후 구현)
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    },
  });

  // 에디터 마운트
  useEffect(() => {
    if (editor && mountRef.current && !isMounted) {
      try {
        // DOM에 에디터 마운트
        const container = mountRef.current;
        container.innerHTML = ''; // 기존 내용 제거
        
        // 에디터 DOM 요소를 컨테이너에 추가
        if (editor.domElement) {
          container.appendChild(editor.domElement);
          setIsMounted(true);
          
          // 에디터 참조 설정
          editorRef.current = editor as any;
          initializeEditor();
        }
      } catch (error) {
        console.warn('Failed to mount BlockNote editor:', error);
      }
    }
  }, [editor, isMounted, editorRef, initializeEditor]);

  // 콘텐츠 변경 감지
  useEffect(() => {
    if (!editor) return;

    const handleChange = () => {
      const blocks = editor.document;
      
      // 콘텐츠를 JSON 문자열로 변환하여 저장
      const content = JSON.stringify(blocks);
      handleContentChange(content);
      onContentChange?.(blocks);
    };

    // 에디터 변경 이벤트 리스너 등록
    editor.onChange(handleChange);

    return () => {
      // 정리 함수에서 이벤트 리스너 제거는 BlockNote에서 자동으로 처리됨
    };
  }, [editor, handleContentChange, onContentChange]);

  // 선택 변경 감지
  useEffect(() => {
    if (!editor) return;

    const handleSelectionChange = () => {
      try {
        const selection = editor.getTextCursorPosition();
        onSelectionChange?.(selection);
      } catch (error) {
        // 선택 변경 에러 무시
      }
    };

    editor.onSelectionChange(handleSelectionChange);
  }, [editor, onSelectionChange]);

  // 외부에서 콘텐츠 변경시 에디터 업데이트
  useEffect(() => {
    if (editor && initialContent && isInitialized) {
      try {
        editor.replaceBlocks(editor.document, initialContent);
      } catch (error) {
        console.warn('Failed to update editor content:', error);
      }
    }
  }, [editor, initialContent, isInitialized]);

  // 정리
  useEffect(() => {
    return () => {
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
      setIsMounted(false);
    };
  }, []);

  if (!editor) {
    return (
      <div className={cn('flex h-64 items-center justify-center', className)}>
        <div className="text-gray-500">에디터를 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={cn('blocknote-editor', className)}>
      {/* 에디터 상태 표시 */}
      {editable && lastSaved && (
        <div className="mb-2 text-xs text-gray-500">
          마지막 저장: {new Date(lastSaved).toLocaleTimeString()}
        </div>
      )}

      {/* BlockNote 에디터 마운트 포인트 */}
      <div 
        ref={mountRef}
        className="min-h-[500px] border border-gray-200 rounded-lg overflow-hidden"
        style={{ 
          minHeight: '500px',
          background: 'white'
        }}
      />

      {/* 에디터 하단 툴바 */}
      {editable && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>블록 {editor.document.length}개</span>
            <span>단어 {getWordCount(editor.document)}개</span>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
              S
            </kbd>
            <span>저장</span>
          </div>
        </div>
      )}
    </div>
  );
}

// 단어 수 계산 헬퍼 함수
function getWordCount(blocks: Block[]): number {
  let wordCount = 0;

  const extractTextFromInlineContent = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }
    
    if (content && typeof content === 'object') {
      // 스타일링된 텍스트인 경우
      if ('text' in content && typeof content.text === 'string') {
        return content.text;
      }
      
      // 링크인 경우
      if ('content' in content && Array.isArray(content.content)) {
        return content.content.map(extractTextFromInlineContent).join('');
      }
    }
    
    return '';
  };

  const countWordsInBlock = (block: Block) => {
    try {
      // 블록의 콘텐츠가 인라인 콘텐츠 배열인 경우
      if (block.content && Array.isArray(block.content)) {
        const text = block.content.map(extractTextFromInlineContent).join(' ');
        if (text.trim()) {
          const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0);
          wordCount += words.length;
        }
      }

      // 자식 블록들도 카운트
      if (block.children && Array.isArray(block.children)) {
        block.children.forEach(countWordsInBlock);
      }
    } catch (error) {
      // 블록 처리 에러 무시
    }
  };

  blocks.forEach(countWordsInBlock);
  return wordCount;
}

// 간단한 에디터 컴포넌트 (BlockNote가 없는 경우 fallback)
export function SimpleEditor({
  className,
  initialContent,
  editable = true,
  placeholder = "내용을 입력하세요...",
  onContentChange,
}: BlockNoteEditorComponentProps) {
  const [content, setContent] = React.useState(
    typeof initialContent === 'string' ? initialContent : ''
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange?.([{ type: 'paragraph', content: newContent } as any]);
  };

  return (
    <div className={cn('simple-editor', className)}>
      <textarea
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={!editable}
        className={cn(
          "w-full min-h-[500px] p-4 border border-gray-200 rounded-lg resize-none",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "font-mono text-sm leading-relaxed",
          !editable && "bg-gray-50 cursor-not-allowed"
        )}
      />
    </div>
  );
}

// 에디터 스타일 커스터마이징
const editorStyles = `
  .blocknote-editor {
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .bn-container {
    border: none;
    background: transparent;
  }

  .bn-editor {
    padding: 24px;
    line-height: 1.6;
    min-height: 400px;
  }

  .bn-block-outer {
    margin: 4px 0;
  }

  .bn-block-outer[data-node-type="paragraph"] {
    margin: 8px 0;
  }

  .bn-block-outer[data-node-type="heading"] {
    margin: 16px 0 8px 0;
  }

  .bn-block-outer[data-node-type="heading"][data-level="1"] .bn-block-content {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 24px;
  }

  .bn-block-outer[data-node-type="heading"][data-level="2"] .bn-block-content {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 20px;
  }

  .bn-block-outer[data-node-type="heading"][data-level="3"] .bn-block-content {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 16px;
  }

  .bn-block-outer[data-node-type="bulletListItem"],
  .bn-block-outer[data-node-type="numberedListItem"] {
    margin: 2px 0;
  }

  .bn-block-outer[data-node-type="checkListItem"] {
    margin: 4px 0;
  }

  .bn-block-outer[data-node-type="codeBlock"] {
    margin: 16px 0;
  }

  .bn-block-outer[data-node-type="codeBlock"] .bn-block-content {
    background: #f8f9fa;
    border-radius: 6px;
    padding: 16px;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
  }

  .dark .bn-block-outer[data-node-type="codeBlock"] .bn-block-content {
    background: #1f2937;
  }

  /* 슬래시 메뉴 스타일링 */
  .bn-suggestion-menu {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
  }

  .dark .bn-suggestion-menu {
    background: #1f2937;
    border-color: #374151;
  }

  .bn-suggestion-menu-item {
    padding: 8px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    transition: background-color 0.1s;
  }

  .bn-suggestion-menu-item:hover,
  .bn-suggestion-menu-item[data-selected="true"] {
    background: #f3f4f6;
  }

  .dark .bn-suggestion-menu-item:hover,
  .dark .bn-suggestion-menu-item[data-selected="true"] {
    background: #374151;
  }

  /* 포맷팅 툴바 */
  .bn-formatting-toolbar {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .dark .bn-formatting-toolbar {
    background: #1f2937;
    border-color: #374151;
  }
`;

// 스타일 주입
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('blocknote-custom-styles');
  if (!existingStyle) {
    const styleElement = document.createElement('style');
    styleElement.id = 'blocknote-custom-styles';
    styleElement.textContent = editorStyles;
    document.head.appendChild(styleElement);
  }
}