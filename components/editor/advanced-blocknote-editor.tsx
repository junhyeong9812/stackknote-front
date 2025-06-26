// components/editor/advanced-blocknote-editor.tsx
'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { Block, PartialBlock } from '@blocknote/core';
import {
  BlockNoteView,
  useCreateBlockNote,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  DefaultReactSuggestionItem,
} from '@blocknote/react';
import {
  HiOutlineGlobeAlt,
  HiOutlinePhotograph,
  HiOutlineTable,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineCode,
  HiOutlineMinus,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi';
import { cn } from '@/lib/utils/cn';
import { BLOCKNOTE_CONFIG } from '@/lib/config/editor-config';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';

// 커스텀 블록 타입 정의
interface CustomBlockConfig {
  callout: {
    type: 'callout';
    propSchema: {
      type: { default: 'info' };
      backgroundColor: { default: 'default' };
    };
    content: 'inline';
  };
  table: {
    type: 'table';
    propSchema: {
      rows: { default: 3 };
      cols: { default: 3 };
    };
    content: 'none';
  };
  checkList: {
    type: 'checkListItem';
    propSchema: {
      checked: { default: false };
    };
    content: 'inline';
  };
  divider: {
    type: 'divider';
    propSchema: {};
    content: 'none';
  };
}

interface AdvancedBlockNoteEditorProps {
  className?: string;
  initialContent?: PartialBlock[];
  editable?: boolean;
  placeholder?: string;
  onContentChange?: (content: PartialBlock[]) => void;
  onSelectionChange?: (selection: any) => void;
  theme?: 'light' | 'dark';
  showToolbar?: boolean;
  showSlashMenu?: boolean;
  autoFocus?: boolean;
}

// 커스텀 슬래시 메뉴 아이템들
const getCustomSlashMenuItems = () => [
  ...getDefaultReactSlashMenuItems(),
  {
    name: '콜아웃',
    execute: (editor: any) => {
      const calloutBlock = {
        type: 'paragraph',
        props: {
          backgroundColor: 'blue',
        },
        content: '💡 여기에 중요한 내용을 입력하세요',
      };

      editor.insertBlocks(
        [calloutBlock],
        editor.getTextCursorPosition().block,
        'after'
      );
    },
    aliases: ['callout', '콜아웃', '알림'],
    group: '고급 블록',
    icon: <HiOutlineExclamationCircle size={16} />,
    subtext: '중요한 내용을 강조하여 표시',
  },
  {
    name: '체크리스트',
    execute: (editor: any) => {
      const checkListBlock = {
        type: 'checkListItem',
        content: '할 일 항목',
      };

      editor.insertBlocks(
        [checkListBlock],
        editor.getTextCursorPosition().block,
        'after'
      );
    },
    aliases: ['checklist', '체크리스트', 'todo', '할일'],
    group: '고급 블록',
    icon: <HiOutlineCheckCircle size={16} />,
    subtext: '체크 가능한 할 일 목록',
  },
  {
    name: '테이블',
    execute: (editor: any) => {
      // 간단한 테이블 대신 마크다운 테이블 형태로 삽입
      const tableBlocks = [
        {
          type: 'paragraph',
          content: '| 헤더 1 | 헤더 2 | 헤더 3 |',
        },
        {
          type: 'paragraph',
          content: '|--------|--------|--------|',
        },
        {
          type: 'paragraph',
          content: '| 데이터 1 | 데이터 2 | 데이터 3 |',
        },
        {
          type: 'paragraph',
          content: '| 데이터 4 | 데이터 5 | 데이터 6 |',
        },
      ];

      editor.insertBlocks(
        tableBlocks,
        editor.getTextCursorPosition().block,
        'after'
      );
    },
    aliases: ['table', '테이블', '표'],
    group: '고급 블록',
    icon: <HiOutlineTable size={16} />,
    subtext: '데이터를 표 형태로 정리',
  },
  {
    name: '구분선',
    execute: (editor: any) => {
      const dividerBlock = {
        type: 'paragraph',
        content: '---',
      };

      editor.insertBlocks(
        [dividerBlock],
        editor.getTextCursorPosition().block,
        'after'
      );
    },
    aliases: ['divider', '구분선', '선', 'hr'],
    group: '고급 블록',
    icon: <HiOutlineMinus size={16} />,
    subtext: '섹션을 나누는 구분선',
  },
  {
    name: '이미지',
    execute: (editor: any) => {
      const imageBlock = {
        type: 'image',
        props: {
          url: '',
          caption: '이미지 설명을 입력하세요',
        },
      };

      editor.insertBlocks(
        [imageBlock],
        editor.getTextCursorPosition().block,
        'after'
      );
    },
    aliases: ['image', '이미지', '사진', 'img'],
    group: '미디어',
    icon: <HiOutlinePhotograph size={16} />,
    subtext: '이미지를 삽입합니다',
  },
  {
    name: '링크',
    execute: (editor: any) => {
      const linkBlock = {
        type: 'paragraph',
        content: [
          {
            type: 'link',
            href: 'https://example.com',
            content: '링크 텍스트를 입력하세요',
          },
        ],
      };

      editor.insertBlocks(
        [linkBlock],
        editor.getTextCursorPosition().block,
        'after'
      );
    },
    aliases: ['link', '링크', 'url'],
    group: '미디어',
    icon: <HiOutlineGlobeAlt size={16} />,
    subtext: '외부 링크를 삽입합니다',
  },
];

// 포맷팅 툴바 컴포넌트
const FormattingToolbar = ({ editor }: { editor: any }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const colors = [
    { name: '기본', value: 'default', color: '#000000' },
    { name: '회색', value: 'gray', color: '#6B7280' },
    { name: '빨간색', value: 'red', color: '#EF4444' },
    { name: '주황색', value: 'orange', color: '#F97316' },
    { name: '노란색', value: 'yellow', color: '#EAB308' },
    { name: '초록색', value: 'green', color: '#22C55E' },
    { name: '파란색', value: 'blue', color: '#3B82F6' },
    { name: '보라색', value: 'purple', color: '#A855F7' },
    { name: '분홍색', value: 'pink', color: '#EC4899' },
  ];

  const backgroundColors = [
    { name: '기본', value: 'default', color: 'transparent' },
    { name: '회색', value: 'gray', color: '#F3F4F6' },
    { name: '빨간색', value: 'red', color: '#FEF2F2' },
    { name: '주황색', value: 'orange', color: '#FFF7ED' },
    { name: '노란색', value: 'yellow', color: '#FEFCE8' },
    { name: '초록색', value: 'green', color: '#F0FDF4' },
    { name: '파란색', value: 'blue', color: '#EFF6FF' },
    { name: '보라색', value: 'purple', color: '#FAF5FF' },
    { name: '분홍색', value: 'pink', color: '#FDF2F8' },
  ];

  const formatText = (format: string) => {
    try {
      switch (format) {
        case 'bold':
          editor.toggleBold();
          break;
        case 'italic':
          editor.toggleItalic();
          break;
        case 'underline':
          editor.toggleUnderline();
          break;
        case 'strikethrough':
          editor.toggleStrike();
          break;
        case 'code':
          editor.toggleCode();
          break;
        default:
          break;
      }
    } catch (error) {
      console.warn('Formatting error:', error);
    }
  };

  const setTextColor = (color: string) => {
    try {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        props: { textColor: color },
      });
    } catch (error) {
      console.warn('Color setting error:', error);
    }
  };

  const setBackgroundColor = (color: string) => {
    try {
      editor.updateBlock(editor.getTextCursorPosition().block, {
        props: { backgroundColor: color },
      });
    } catch (error) {
      console.warn('Background color setting error:', error);
    }
  };

  return (
    <div className='flex items-center gap-1 rounded-lg border bg-white p-2 shadow-lg dark:bg-gray-800'>
      {/* 기본 포맷팅 */}
      <button
        onClick={() => formatText('bold')}
        className={cn(
          'rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
          activeFormats.has('bold') && 'bg-gray-200 dark:bg-gray-600'
        )}
        title='굵게 (Ctrl+B)'
      >
        <strong className='text-sm'>B</strong>
      </button>

      <button
        onClick={() => formatText('italic')}
        className={cn(
          'rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
          activeFormats.has('italic') && 'bg-gray-200 dark:bg-gray-600'
        )}
        title='기울임 (Ctrl+I)'
      >
        <em className='text-sm'>I</em>
      </button>

      <button
        onClick={() => formatText('underline')}
        className={cn(
          'rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
          activeFormats.has('underline') && 'bg-gray-200 dark:bg-gray-600'
        )}
        title='밑줄 (Ctrl+U)'
      >
        <span className='text-sm underline'>U</span>
      </button>

      <button
        onClick={() => formatText('strikethrough')}
        className={cn(
          'rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
          activeFormats.has('strikethrough') && 'bg-gray-200 dark:bg-gray-600'
        )}
        title='취소선'
      >
        <span className='text-sm line-through'>S</span>
      </button>

      <button
        onClick={() => formatText('code')}
        className={cn(
          'rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
          activeFormats.has('code') && 'bg-gray-200 dark:bg-gray-600'
        )}
        title='코드 (Ctrl+E)'
      >
        <code className='text-sm'>&lt;/&gt;</code>
      </button>

      <div className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600' />

      {/* 색상 선택기 */}
      <div className='relative'>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className='rounded p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700'
          title='텍스트 색상'
        >
          <div className='h-4 w-4 rounded bg-gradient-to-r from-red-500 to-blue-500'></div>
        </button>

        {showColorPicker && (
          <div className='absolute top-10 left-0 z-50 rounded-lg border bg-white p-3 shadow-xl dark:bg-gray-800'>
            <div className='mb-3'>
              <p className='mb-2 text-xs font-medium'>텍스트 색상</p>
              <div className='grid grid-cols-5 gap-1'>
                {colors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setTextColor(color.value)}
                    className='h-6 w-6 rounded border-2 border-gray-200 transition-colors hover:border-gray-400'
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className='mb-2 text-xs font-medium'>배경 색상</p>
              <div className='grid grid-cols-5 gap-1'>
                {backgroundColors.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setBackgroundColor(color.value)}
                    className='h-6 w-6 rounded border-2 border-gray-200 transition-colors hover:border-gray-400'
                    style={{ backgroundColor: color.color }}
                    title={color.name}
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
  showSlashMenu = true,
  autoFocus = false,
}: AdvancedBlockNoteEditorProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });

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
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    },
    slashMenuItems: showSlashMenu ? getCustomSlashMenuItems() : [],
  });

  // 에디터 이벤트 핸들러
  const handleContentChange = useCallback(() => {
    if (!editor) return;

    try {
      const blocks = editor.document;
      onContentChange?.(blocks);
    } catch (error) {
      console.warn('Content change error:', error);
    }
  }, [editor, onContentChange]);

  const handleSelectionChange = useCallback(() => {
    if (!editor) return;

    try {
      const selection = editor.getTextCursorPosition();
      onSelectionChange?.(selection);

      // 텍스트가 선택되어 있으면 포맷팅 툴바 표시
      const hasSelection = editor.getSelectedText().length > 0;
      setShowFormattingToolbar(hasSelection);

      // 툴바 위치 계산 (간단한 예시)
      if (hasSelection) {
        setToolbarPosition({ x: 100, y: 100 });
      }
    } catch (error) {
      console.warn('Selection change error:', error);
    }
  }, [editor, onSelectionChange]);

  // 에디터 이벤트 등록
  useEffect(() => {
    if (!editor) return;

    editor.onChange(handleContentChange);
    editor.onSelectionChange(handleSelectionChange);

    setIsInitialized(true);
  }, [editor, handleContentChange, handleSelectionChange]);

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S: 저장
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // 저장 로직 (추후 구현)
        console.log('저장 단축키 감지');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!editor) {
    return (
      <div className={cn('flex h-64 items-center justify-center', className)}>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <div className='text-gray-500'>에디터를 로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* 포맷팅 툴바 (텍스트 선택시) */}
      {showFormattingToolbar && showToolbar && (
        <div
          className='fixed z-50'
          style={{
            left: toolbarPosition.x,
            top: toolbarPosition.y - 50,
          }}
        >
          <FormattingToolbar editor={editor} />
        </div>
      )}

      {/* 메인 에디터 */}
      <div
        className={cn(
          'blocknote-editor',
          theme === 'dark' && 'dark',
          'min-h-[400px] w-full'
        )}
      >
        <BlockNoteView
          editor={editor}
          editable={editable}
          theme={theme}
          autoFocus={autoFocus}
        />
      </div>

      {/* 에디터 하단 정보 */}
      {isInitialized && (
        <div className='mt-4 flex items-center justify-between text-xs text-gray-500'>
          <div className='flex items-center gap-4'>
            <span>블록 {editor.document.length}개</span>
            <span>단어 {getWordCount(editor.document)}개</span>
          </div>

          <div className='flex items-center gap-2'>
            <kbd className='rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800'>
              Ctrl
            </kbd>
            <span>+</span>
            <kbd className='rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800'>
              S
            </kbd>
            <span>저장</span>
          </div>
        </div>
      )}
    </div>
  );
}

// 단어 수 계산 헬퍼 함수 (이전과 동일)
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
