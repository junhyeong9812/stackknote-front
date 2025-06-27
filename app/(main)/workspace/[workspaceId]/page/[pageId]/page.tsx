// components/editor/advanced-blocknote-editor.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Block, PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Palette,
  Type,
  Image,
  Link,
  Table,
  CheckSquare,
  AlertCircle,
  Minus,
  Globe,
  Quote,
  Hash,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

interface AdvancedBlockNoteEditorProps {
  className?: string;
  initialContent?: PartialBlock[];
  editable?: boolean;
  placeholder?: string;
  onContentChange?: (content: PartialBlock[]) => void;
  onSelectionChange?: (selection: any) => void;
  theme?: 'light' | 'dark';
  showToolbar?: boolean;
  showSlashMenu?: boolean; // 추가된 prop
  autoFocus?: boolean;
}

// 포맷팅 툴바 컴포넌트
const FormattingToolbar = ({ 
  editor, 
  position, 
  onClose 
}: { 
  editor: any; 
  position: { x: number; y: number };
  onClose: () => void;
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    { name: '기본', value: 'default' },
    { name: '회색', value: 'gray' },
    { name: '빨간색', value: 'red' },
    { name: '주황색', value: 'orange' },
    { name: '노란색', value: 'yellow' },
    { name: '초록색', value: 'green' },
    { name: '파란색', value: 'blue' },
    { name: '보라색', value: 'purple' },
    { name: '분홍색', value: 'pink' },
  ];

  const formatText = (format: string) => {
    try {
      if (!editor) return;

      switch (format) {
        case 'bold':
          editor.addStyles({ bold: true });
          break;
        case 'italic':
          editor.addStyles({ italic: true });
          break;
        case 'underline':
          editor.addStyles({ underline: true });
          break;
        case 'strikethrough':
          editor.addStyles({ strike: true });
          break;
        case 'code':
          editor.addStyles({ code: true });
          break;
        default:
          break;
      }
    } catch (error) {
      console.warn('Formatting error:', error);
    }
  };

  const setBlockColor = (color: string, type: 'text' | 'background') => {
    try {
      if (!editor) return;
      const currentBlock = editor.getTextCursorPosition().block;
      const props = type === 'text' 
        ? { textColor: color }
        : { backgroundColor: color };
        
      editor.updateBlock(currentBlock, {
        props: { ...currentBlock.props, ...props }
      });
    } catch (error) {
      console.warn('Color setting error:', error);
    }
  };

  return (
    <div 
      className="fixed z-50 flex items-center gap-1 rounded-lg border bg-white p-2 shadow-lg dark:bg-gray-800"
      style={{ left: position.x, top: position.y - 60 }}
      onMouseLeave={onClose}
    >
      {/* 기본 포맷팅 */}
      <button
        onClick={() => formatText('bold')}
        className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        title="굵게 (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </button>
      
      <button
        onClick={() => formatText('italic')}
        className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        title="기울임 (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </button>
      
      <button
        onClick={() => formatText('underline')}
        className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        title="밑줄 (Ctrl+U)"
      >
        <Underline className="h-4 w-4" />
      </button>
      
      <button
        onClick={() => formatText('strikethrough')}
        className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        title="취소선"
      >
        <Strikethrough className="h-4 w-4" />
      </button>
      
      <button
        onClick={() => formatText('code')}
        className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        title="코드 (Ctrl+E)"
      >
        <Code className="h-4 w-4" />
      </button>

      <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

      {/* 색상 선택기 */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          title="색상 설정"
        >
          <Palette className="h-4 w-4" />
        </button>

        {showColorPicker && (
          <div className="absolute top-10 left-0 z-50 rounded-lg border bg-white p-3 shadow-xl dark:bg-gray-800">
            <div className="mb-3">
              <p className="mb-2 text-xs font-medium">텍스트 색상</p>
              <div className="grid grid-cols-3 gap-1">
                {colors.map((color) => (
                  <button
                    key={`text-${color.value}`}
                    onClick={() => setBlockColor(color.value, 'text')}
                    className={cn(
                      "w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors",
                      color.value === 'default' ? 'bg-gray-900' : `bg-${color.value}-500`
                    )}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <p className="mb-2 text-xs font-medium">배경 색상</p>
              <div className="grid grid-cols-3 gap-1">
                {colors.map((color) => (
                  <button
                    key={`bg-${color.value}`}
                    onClick={() => setBlockColor(color.value, 'background')}
                    className={cn(
                      "w-6 h-6 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors",
                      color.value === 'default' ? 'bg-white' : `bg-${color.value}-100`
                    )}
                    title={`${color.name} 배경`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 빠른 블록 삽입 툴바
const QuickInsertToolbar = ({ 
  editor, 
  onClose 
}: { 
  editor: any;
  onClose: () => void;
}) => {
  const insertBlock = (blockData: any) => {
    try {
      if (!editor) return;
      const currentBlock = editor.getTextCursorPosition().block;
      editor.insertBlocks([blockData], currentBlock, 'after');
      onClose();
    } catch (error) {
      console.warn('Block insertion error:', error);
    }
  };

  const quickBlocks = [
    {
      name: '제목 1',
      icon: Heading1,
      block: { type: 'heading', props: { level: 1 }, content: '제목 1' }
    },
    {
      name: '제목 2', 
      icon: Heading2,
      block: { type: 'heading', props: { level: 2 }, content: '제목 2' }
    },
    {
      name: '제목 3',
      icon: Heading3,
      block: { type: 'heading', props: { level: 3 }, content: '제목 3' }
    },
    {
      name: '목록',
      icon: List,
      block: { type: 'bulletListItem', content: '• 목록 항목' }
    },
    {
      name: '번호 목록',
      icon: ListOrdered,
      block: { type: 'numberedListItem', content: '1. 번호 목록' }
    },
    {
      name: '인용문',
      icon: Quote,
      block: { type: 'paragraph', props: { backgroundColor: 'gray' }, content: '💬 인용문을 입력하세요' }
    },
    {
      name: '콜아웃',
      icon: AlertCircle,
      block: { type: 'paragraph', props: { backgroundColor: 'blue' }, content: '💡 중요한 정보를 입력하세요' }
    },
  ];

  const insertTable = () => {
    const tableBlocks = [
      { type: 'paragraph', content: '| 헤더 1 | 헤더 2 | 헤더 3 |' },
      { type: 'paragraph', content: '|--------|--------|--------|' },
      { type: 'paragraph', content: '| 데이터 1 | 데이터 2 | 데이터 3 |' },
      { type: 'paragraph', content: '| 데이터 4 | 데이터 5 | 데이터 6 |' },
    ];
    
    try {
      const currentBlock = editor.getTextCursorPosition().block;
      editor.insertBlocks(tableBlocks, currentBlock, 'after');
      onClose();
    } catch (error) {
      console.warn('Table insertion error:', error);
    }
  };

  const insertDivider = () => {
    const dividerBlock = {
      type: 'paragraph',
      content: '---'
    };
    insertBlock(dividerBlock);
  };

  const insertCodeBlock = () => {
    const codeBlock = {
      type: 'paragraph',
      props: { backgroundColor: 'gray' },
      content: '```javascript\nconsole.log("Hello World");\n```'
    };
    insertBlock(codeBlock);
  };

  return (
    <div className="mb-4 rounded-lg border bg-white p-3 shadow-lg dark:bg-gray-800">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium">빠른 삽입</h3>
        <button
          onClick={onClose}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <EyeOff className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {quickBlocks.map((item) => (
          <button
            key={item.name}
            onClick={() => insertBlock(item.block)}
            className="flex flex-col items-center gap-1 rounded p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
            title={item.name}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </button>
        ))}
        
        {/* 테이블 특별 처리 */}
        <button
          onClick={insertTable}
          className="flex flex-col items-center gap-1 rounded p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
          title="테이블"
        >
          <Table className="h-4 w-4" />
          <span>테이블</span>
        </button>
        
        {/* 구분선 */}
        <button
          onClick={insertDivider}
          className="flex flex-col items-center gap-1 rounded p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
          title="구분선"
        >
          <Minus className="h-4 w-4" />
          <span>구분선</span>
        </button>

        {/* 코드 블록 */}
        <button
          onClick={insertCodeBlock}
          className="flex flex-col items-center gap-1 rounded p-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
          title="코드 블록"
        >
          <Code className="h-4 w-4" />
          <span>코드</span>
        </button>
      </div>
    </div>
  );
};

// 메인 에디터 컴포넌트
export function AdvancedBlockNoteEditor({
  className,
  initialContent,
  editable = true,
  placeholder = '내용을 입력하세요...',
  onContentChange,
  onSelectionChange,
  theme = 'light',
  showToolbar = true,
  showSlashMenu = true, // 추가된 prop
  autoFocus = false,
}: AdvancedBlockNoteEditorProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false);
  const [showQuickInsert, setShowQuickInsert] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [wordCount, setWordCount] = useState(0);
  const [blockCount, setBlockCount] = useState(0);

  // BlockNote 에디터 생성
  const editor = useCreateBlockNote({
    initialContent: initialContent || [
      {
        type: 'paragraph',
        content: '',
      },
    ],
    uploadFile: async (file: File) => {
      // 파일 업로드 로직 (추후 구현)
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    },
  });

  // 에디터 이벤트 핸들러
  const handleContentChange = useCallback(() => {
    if (!editor) return;

    try {
      const blocks = editor.document;
      onContentChange?.(blocks);
      
      // 통계 업데이트
      setBlockCount(blocks.length);
      setWordCount(getWordCount(blocks));
    } catch (error) {
      console.warn('Content change error:', error);
    }
  }, [editor, onContentChange]);

  // 에디터 이벤트 등록
  useEffect(() => {
    if (!editor) return;

    // 변경 사항 감지
    const unsubscribe = editor.onChange(handleContentChange);
    setIsInitialized(true);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [editor, handleContentChange]);

  // 텍스트 선택 감지
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setToolbarPosition({
          x: rect.left + rect.width / 2 - 150, // 툴바 너비 절반만큼 이동
          y: rect.top
        });
        setShowFormattingToolbar(true);
      } else {
        setShowFormattingToolbar(false);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: 저장
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        console.log('저장 단축키 감지');
      }
      
      // Ctrl/Cmd + /: 빠른 삽입 토글
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowQuickInsert(!showQuickInsert);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showQuickInsert]);

  if (!editor) {
    return (
      <div className={cn('flex h-64 items-center justify-center', className)}>
        <div className="text-center">
          <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <div className="text-gray-500">에디터를 로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* 빠른 삽입 툴바 */}
      {showQuickInsert && showToolbar && (
        <QuickInsertToolbar 
          editor={editor} 
          onClose={() => setShowQuickInsert(false)} 
        />
      )}

      {/* 포맷팅 툴바 (텍스트 선택시) */}
      {showFormattingToolbar && showToolbar && (
        <FormattingToolbar
          editor={editor}
          position={toolbarPosition}
          onClose={() => setShowFormattingToolbar(false)}
        />
      )}

      {/* 메인 에디터 */}
      <div
        className={cn(
          'blocknote-editor',
          theme === 'dark' && 'dark',
          'min-h-[400px] w-full'
        )}
      >
        {/* @ts-ignore - BlockNote 0.17.0 타입 호환성 임시 해결 */}
        <BlockNoteView editor={editor} />
      </div>

      {/* 상단 액션 바 */}
      {showToolbar && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuickInsert(!showQuickInsert)}
              className={cn(
                "flex items-center gap-2 rounded px-3 py-1 text-sm transition-colors",
                showQuickInsert 
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              )}
              title="빠른 삽입 (Ctrl+/)"
            >
              <Eye className="h-4 w-4" />
              빠른 삽입
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              블록 {blockCount}개 • 단어 {wordCount}개
            </div>
          </div>
        </div>
      )}

      {/* 에디터 하단 정보 */}
      {isInitialized && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>마지막 수정: {new Date().toLocaleTimeString()}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
                Ctrl
              </kbd>
              <span>+</span>
              <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
                /
              </kbd>
              <span>빠른 삽입</span>
            </div>
            
            <div className="flex items-center gap-1">
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
        </div>
      )}
    </div>
  );
}

// 단어 수 계산 헬퍼 함수
function getWordCount(blocks: Block[]): number {
  let wordCount = 0;

  const extractTextFromContent = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content.map(extractTextFromContent).join(' ');
    }

    if (content && typeof content === 'object') {
      if ('text' in content && typeof content.text === 'string') {
        return content.text;
      }

      if ('content' in content) {
        return extractTextFromContent(content.content);
      }
    }

    return '';
  };

  const countWordsInBlock = (block: Block) => {
    try {
      if (block.content) {
        const text = extractTextFromContent(block.content);
        if (text.trim()) {
          const words = text
            .trim()
            .split(/\s+/)
            .filter((word: string) => word.length > 0);
          wordCount += words.length;
        }
      }

      if (block.children && Array.isArray(block.children)) {
        block.children.forEach(countWordsInBlock);
      }
    } catch (error) {
      console.warn('Word count error:', error);
    }
  };

  blocks.forEach(countWordsInBlock);
  return wordCount;
}

// 기본 export
export default AdvancedBlockNoteEditor;