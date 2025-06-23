/**
 * 에디터 관련 설정
 */

import { env } from './env';

// BlockNote 에디터 설정
export const BLOCKNOTE_CONFIG = {
  // 기본 에디터 설정
  placeholder: '페이지 내용을 입력하세요...',

  // 자동 저장 설정
  autoSave: {
    enabled: true,
    interval: env.EDITOR_AUTO_SAVE_INTERVAL, // 5초
    debounceDelay: 1000, // 1초 디바운스
  },

  // 히스토리 설정
  history: {
    limit: env.EDITOR_HISTORY_LIMIT, // 50개
    mergeTimeout: 500, // 500ms 내 변경사항은 하나로 병합
  },

  // 업로드 설정
  upload: {
    maxFileSize: env.MAX_FILE_SIZE * 1024 * 1024, // MB to bytes
    allowedTypes: env.ALLOWED_FILE_TYPES,
    acceptedImageTypes: env.ALLOWED_IMAGE_TYPES,
  },

  // 협업 설정
  collaboration: {
    enabled: env.ENABLE_REALTIME,
    cursorTimeout: 30000, // 30초
    awareness: {
      showCursors: true,
      showNames: true,
      showSelections: true,
    },
  },
} as const;

// 지원되는 블록 타입
export const BLOCK_TYPES = {
  // 텍스트 블록
  paragraph: {
    name: 'Paragraph',
    icon: '¶',
    description: '일반 텍스트 단락',
    shortcut: 'Mod+Alt+0',
  },
  heading1: {
    name: 'Heading 1',
    icon: 'H1',
    description: '대제목',
    shortcut: 'Mod+Alt+1',
  },
  heading2: {
    name: 'Heading 2',
    icon: 'H2',
    description: '중제목',
    shortcut: 'Mod+Alt+2',
  },
  heading3: {
    name: 'Heading 3',
    icon: 'H3',
    description: '소제목',
    shortcut: 'Mod+Alt+3',
  },

  // 목록 블록
  bulletList: {
    name: 'Bullet List',
    icon: '•',
    description: '글머리 기호 목록',
    shortcut: 'Mod+Shift+8',
  },
  numberedList: {
    name: 'Numbered List',
    icon: '1.',
    description: '번호 매기기 목록',
    shortcut: 'Mod+Shift+7',
  },
  checkList: {
    name: 'Check List',
    icon: '☑',
    description: '체크리스트',
    shortcut: 'Mod+Shift+9',
  },

  // 특수 블록
  quote: {
    name: 'Quote',
    icon: '"',
    description: '인용문',
    shortcut: 'Mod+Shift+.',
  },
  code: {
    name: 'Code',
    icon: '</>',
    description: '코드 블록',
    shortcut: 'Mod+Alt+C',
  },
  divider: {
    name: 'Divider',
    icon: '—',
    description: '구분선',
    shortcut: 'Mod+Shift+-',
  },

  // 미디어 블록
  image: {
    name: 'Image',
    icon: '🖼',
    description: '이미지',
    shortcut: 'Mod+Alt+I',
  },
  file: {
    name: 'File',
    icon: '📎',
    description: '파일 첨부',
    shortcut: 'Mod+Alt+F',
  },
  embed: {
    name: 'Embed',
    icon: '🔗',
    description: '외부 콘텐츠 삽입',
    shortcut: 'Mod+Alt+E',
  },

  // 데이터베이스 블록 (추후 구현)
  table: {
    name: 'Table',
    icon: '⊞',
    description: '테이블',
    shortcut: 'Mod+Alt+T',
  },
  kanban: {
    name: 'Kanban',
    icon: '📋',
    description: '칸반 보드',
    shortcut: 'Mod+Alt+K',
  },
  calendar: {
    name: 'Calendar',
    icon: '📅',
    description: '캘린더',
    shortcut: 'Mod+Alt+L',
  },
} as const;

// 슬래시 명령어 설정
export const SLASH_COMMANDS = {
  '/': '모든 블록 타입 표시',
  '/p': '단락',
  '/h1': '대제목',
  '/h2': '중제목',
  '/h3': '소제목',
  '/ul': '글머리 기호 목록',
  '/ol': '번호 매기기 목록',
  '/todo': '체크리스트',
  '/quote': '인용문',
  '/code': '코드 블록',
  '/divider': '구분선',
  '/image': '이미지',
  '/file': '파일',
  '/embed': '외부 콘텐츠',
  '/table': '테이블',
  '/kanban': '칸반 보드',
  '/calendar': '캘린더',
} as const;

// 에디터 테마 설정
export const EDITOR_THEMES = {
  light: {
    primary: '#000000',
    secondary: '#6b7280',
    background: '#ffffff',
    surface: '#f9fafb',
    border: '#e5e7eb',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  dark: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    background: '#111827',
    surface: '#1f2937',
    border: '#374151',
    accent: '#60a5fa',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
  },
} as const;

// 코드 하이라이팅 언어 설정
export const CODE_LANGUAGES = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'tsx', label: 'TSX' },
  { value: 'jsx', label: 'JSX' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'dart', label: 'Dart' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'xml', label: 'XML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'nginx', label: 'Nginx' },
  { value: 'apache', label: 'Apache' },
  { value: 'plaintext', label: 'Plain Text' },
] as const;

// 임베드 지원 서비스
type EmbedProvider = {
  name: string;
  pattern: RegExp;
  embedUrl: (...args: string[]) => string;
  icon: string;
};

export const EMBED_PROVIDERS: Record<string, EmbedProvider> = {
  youtube: {
    name: 'YouTube',
    pattern: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/,
    embedUrl: (id: string) => `https://www.youtube.com/embed/${id}`,
    icon: '📺',
  },
  vimeo: {
    name: 'Vimeo',
    pattern: /vimeo\.com\/(\d+)/,
    embedUrl: (id: string) => `https://player.vimeo.com/video/${id}`,
    icon: '🎬',
  },
  codepen: {
    name: 'CodePen',
    pattern: /codepen\.io\/([^\/]+)\/pen\/([a-zA-Z0-9]+)/,
    embedUrl: (user: string, id: string) =>
      `https://codepen.io/${user}/embed/${id}?theme-id=dark&default-tab=result`,
    icon: '🖊',
  },
  figma: {
    name: 'Figma',
    pattern: /figma\.com\/file\/([a-zA-Z0-9]+)/,
    embedUrl: (id: string) =>
      `https://www.figma.com/embed?embed_host=stacknote&url=https://www.figma.com/file/${id}`,
    icon: '🎨',
  },
  github: {
    name: 'GitHub Gist',
    pattern: /gist\.github\.com\/([^\/]+)\/([a-zA-Z0-9]+)/,
    embedUrl: (user: string, id: string) =>
      `https://gist.github.com/${user}/${id}.js`,
    icon: '📄',
  },
  twitter: {
    name: 'Twitter',
    pattern: /twitter\.com\/[^\/]+\/status\/(\d+)/,
    embedUrl: (id: string) =>
      `https://platform.twitter.com/embed/Tweet.html?id=${id}`,
    icon: '🐦',
  },
} as const;

// 드래그 앤 드롭 설정
export const DRAG_DROP_CONFIG = {
  // 드래그 감도
  dragThreshold: 5,

  // 자동 스크롤 설정
  autoScroll: {
    enabled: true,
    threshold: 50, // 가장자리 50px에서 스크롤 시작
    speed: 10, // 스크롤 속도
  },

  // 드롭존 하이라이트
  dropZone: {
    showIndicator: true,
    indicatorColor: '#3b82f6',
    indicatorThickness: 2,
  },

  // 미리보기 설정
  preview: {
    enabled: true,
    opacity: 0.8,
    scale: 0.95,
  },
} as const;

// 텍스트 포맷팅 설정
export const TEXT_FORMATTING = {
  // 기본 포맷
  bold: { shortcut: 'Mod+B', marker: '**' },
  italic: { shortcut: 'Mod+I', marker: '*' },
  underline: { shortcut: 'Mod+U', marker: '<u>' },
  strikethrough: { shortcut: 'Mod+Shift+X', marker: '~~' },
  code: { shortcut: 'Mod+E', marker: '`' },

  // 링크
  link: { shortcut: 'Mod+K', pattern: /\[([^\]]+)\]\(([^\)]+)\)/ },

  // 색상 (추후 구현)
  textColor: {
    enabled: true,
    defaultColors: [
      '#000000',
      '#dc2626',
      '#ea580c',
      '#d97706',
      '#65a30d',
      '#059669',
      '#0891b2',
      '#2563eb',
      '#7c3aed',
      '#c026d3',
    ],
  },
  backgroundColor: {
    enabled: true,
    defaultColors: [
      'transparent',
      '#fef2f2',
      '#fff7ed',
      '#fffbeb',
      '#f7fee7',
      '#ecfdf5',
      '#f0fdfa',
      '#eff6ff',
      '#f3e8ff',
      '#fdf2f8',
    ],
  },
} as const;

// 수식 설정 (KaTeX)
export const MATH_CONFIG = {
  enabled: true,
  inline: { delimiter: '$' },
  block: { delimiter: '$$' },
  katexOptions: {
    displayMode: false,
    throwOnError: false,
    errorColor: '#cc0000',
    strict: false,
    macros: {
      '\\RR': '\\mathbb{R}',
      '\\NN': '\\mathbb{N}',
      '\\ZZ': '\\mathbb{Z}',
      '\\QQ': '\\mathbb{Q}',
      '\\CC': '\\mathbb{C}',
    },
  },
} as const;

// 접근성 설정
export const ACCESSIBILITY_CONFIG = {
  // 키보드 네비게이션
  keyboard: {
    enabled: true,
    shortcuts: {
      focus: 'Tab',
      blur: 'Escape',
      selectAll: 'Mod+A',
      undo: 'Mod+Z',
      redo: 'Mod+Y',
      save: 'Mod+S',
    },
  },

  // 스크린 리더 지원
  screenReader: {
    enabled: true,
    announceChanges: true,
    announceSelections: true,
  },

  // 색상 대비
  contrast: {
    enabled: true,
    highContrast: false,
    minimumRatio: 4.5,
  },

  // 포커스 표시
  focus: {
    enabled: true,
    outlineWidth: 2,
    outlineStyle: 'solid',
    outlineOffset: 2,
  },
} as const;

// 에디터 성능 설정
export const PERFORMANCE_CONFIG = {
  // 가상화 (긴 문서용)
  virtualization: {
    enabled: false, // 추후 구현
    threshold: 1000, // 1000개 블록 이상일 때 활성화
    bufferSize: 100, // 화면 밖 렌더링할 블록 수
  },

  // 이미지 지연 로딩
  lazyLoading: {
    enabled: true,
    threshold: 200, // 200px 전에 로딩 시작
    placeholder: 'blur', // 블러 플레이스홀더
  },

  // 디바운스 설정
  debounce: {
    input: 300, // 입력 디바운스
    scroll: 100, // 스크롤 디바운스
    resize: 250, // 리사이즈 디바운스
  },
} as const;

// 내보내기 설정
export const EXPORT_CONFIG = {
  formats: ['markdown', 'html', 'pdf', 'docx', 'json'],

  markdown: {
    preserveFormatting: true,
    includeMetadata: true,
    frontMatter: true,
    codeBlockLanguage: true,
  },

  html: {
    includeCSS: true,
    standalone: true,
    sanitize: true,
    preserveClasses: true,
  },

  pdf: {
    format: 'A4',
    margin: '20mm',
    includePageNumbers: true,
    includeHeader: true,
    includeFooter: true,
  },

  docx: {
    includeImages: true,
    preserveFormatting: true,
    pageSize: 'A4',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
  },
} as const;

// 에디터 단축키
export const EDITOR_SHORTCUTS = {
  // 텍스트 포맷
  'Mod+B': 'bold',
  'Mod+I': 'italic',
  'Mod+U': 'underline',
  'Mod+Shift+X': 'strikethrough',
  'Mod+E': 'code',
  'Mod+K': 'link',

  // 블록 타입
  'Mod+Alt+0': 'paragraph',
  'Mod+Alt+1': 'heading1',
  'Mod+Alt+2': 'heading2',
  'Mod+Alt+3': 'heading3',
  'Mod+Shift+8': 'bulletList',
  'Mod+Shift+7': 'numberedList',
  'Mod+Shift+9': 'checkList',
  'Mod+Shift+.': 'quote',
  'Mod+Alt+C': 'code',
  'Mod+Shift+-': 'divider',

  // 미디어
  'Mod+Alt+I': 'image',
  'Mod+Alt+F': 'file',
  'Mod+Alt+E': 'embed',

  // 에디터 액션
  'Mod+Z': 'undo',
  'Mod+Y': 'redo',
  'Mod+A': 'selectAll',
  'Mod+S': 'save',
  'Mod+P': 'print',
  'Mod+F': 'search',
  'Mod+G': 'findNext',
  'Mod+Shift+G': 'findPrevious',
  Escape: 'blur',
  Tab: 'indent',
  'Shift+Tab': 'outdent',

  // 블록 조작
  'Mod+Shift+D': 'duplicateBlock',
  'Mod+Shift+Backspace': 'deleteBlock',
  'Mod+Shift+Up': 'moveBlockUp',
  'Mod+Shift+Down': 'moveBlockDown',
  'Mod+Enter': 'insertBlockAfter',
  'Mod+Shift+Enter': 'insertBlockBefore',

  // 뷰 조작
  'Mod+\\': 'toggleSidebar',
  F11: 'toggleFullscreen',
  'Mod+0': 'resetZoom',
  'Mod+=': 'zoomIn',
  'Mod+-': 'zoomOut',
} as const;

// 에디터 제한사항
export const EDITOR_LIMITS = {
  // 블록 제한
  maxBlocks: 10000,
  maxBlockDepth: 10, // 중첩 깊이

  // 텍스트 제한
  maxTextLength: 100000, // 100KB
  maxLinkLength: 2000,

  // 미디어 제한
  maxImageWidth: 4000,
  maxImageHeight: 4000,
  maxEmbedWidth: 1200,
  maxEmbedHeight: 800,

  // 테이블 제한
  maxTableRows: 1000,
  maxTableCols: 50,

  // 목록 제한
  maxListItems: 1000,
  maxListDepth: 10,
} as const;

// 에디터 이벤트
export const EDITOR_EVENTS = {
  // 콘텐츠 변경
  CONTENT_CHANGED: 'content:changed',
  BLOCK_ADDED: 'block:added',
  BLOCK_REMOVED: 'block:removed',
  BLOCK_MOVED: 'block:moved',
  BLOCK_SELECTED: 'block:selected',

  // 포맷팅
  FORMAT_APPLIED: 'format:applied',
  FORMAT_REMOVED: 'format:removed',

  // 파일 처리
  FILE_UPLOADED: 'file:uploaded',
  FILE_UPLOAD_ERROR: 'file:upload-error',
  IMAGE_INSERTED: 'image:inserted',

  // 에디터 상태
  EDITOR_FOCUSED: 'editor:focused',
  EDITOR_BLURRED: 'editor:blurred',
  SELECTION_CHANGED: 'selection:changed',

  // 자동 저장
  AUTO_SAVE_START: 'autosave:start',
  AUTO_SAVE_SUCCESS: 'autosave:success',
  AUTO_SAVE_ERROR: 'autosave:error',

  // 협업
  USER_JOINED: 'collaboration:user-joined',
  USER_LEFT: 'collaboration:user-left',
  CURSOR_MOVED: 'collaboration:cursor-moved',
} as const;

/**
 * 에디터 초기화 옵션 생성
 */
export function createEditorConfig(
  overrides?: Partial<typeof BLOCKNOTE_CONFIG>
) {
  return {
    ...BLOCKNOTE_CONFIG,
    ...overrides,
  };
}

/**
 * 블록 타입 검증
 */
export function isValidBlockType(type: string): boolean {
  return Object.keys(BLOCK_TYPES).includes(type);
}

/**
 * 단축키 파싱
 */
export function parseShortcut(shortcut: string): {
  key: string;
  modifiers: string[];
} {
  const parts = shortcut.split('+');
  const key = parts.pop() || '';
  const modifiers = parts.map(mod => mod.toLowerCase());

  return { key, modifiers };
}

/**
 * 에디터 상태 검증
 */
export function validateEditorContent(content: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(content)) {
    errors.push('콘텐츠는 배열 형태여야 합니다.');
    return { isValid: false, errors };
  }

  if (content.length > EDITOR_LIMITS.maxBlocks) {
    errors.push(`최대 ${EDITOR_LIMITS.maxBlocks}개의 블록까지 허용됩니다.`);
  }

  for (let i = 0; i < content.length; i++) {
    const block = content[i];

    if (!block.id) {
      errors.push(`블록 ${i + 1}: ID가 필요합니다.`);
    }

    if (!block.type || !isValidBlockType(block.type)) {
      errors.push(`블록 ${i + 1}: 유효하지 않은 블록 타입입니다.`);
    }

    if (block.content && typeof block.content === 'string') {
      if (block.content.length > EDITOR_LIMITS.maxTextLength) {
        errors.push(`블록 ${i + 1}: 텍스트가 너무 깁니다.`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 슬래시 명령어 매칭
 */
export function matchSlashCommand(input: string): Array<{
  command: string;
  description: string;
  blockType?: keyof typeof BLOCK_TYPES;
}> {
  const matches: Array<{
    command: string;
    description: string;
    blockType?: keyof typeof BLOCK_TYPES;
  }> = [];

  const query = input.toLowerCase();

  for (const [command, description] of Object.entries(SLASH_COMMANDS)) {
    if (command.toLowerCase().includes(query)) {
      const blockType = getBlockTypeFromCommand(command);
      matches.push({
        command,
        description,
        blockType,
      });
    }
  }

  return matches.slice(0, 10); // 최대 10개만 반환
}

/**
 * 슬래시 명령어에서 블록 타입 추출
 */
function getBlockTypeFromCommand(
  command: string
): keyof typeof BLOCK_TYPES | undefined {
  const commandMap: Record<string, keyof typeof BLOCK_TYPES> = {
    '/p': 'paragraph',
    '/h1': 'heading1',
    '/h2': 'heading2',
    '/h3': 'heading3',
    '/ul': 'bulletList',
    '/ol': 'numberedList',
    '/todo': 'checkList',
    '/quote': 'quote',
    '/code': 'code',
    '/divider': 'divider',
    '/image': 'image',
    '/file': 'file',
    '/embed': 'embed',
    '/table': 'table',
    '/kanban': 'kanban',
    '/calendar': 'calendar',
  };

  return commandMap[command];
}

/**
 * 임베드 URL 파싱
 */
export function parseEmbedUrl(url: string): {
  provider: keyof typeof EMBED_PROVIDERS | null;
  embedUrl: string | null;
  metadata: Record<string, string>;
} {
  for (const [providerName, provider] of Object.entries(EMBED_PROVIDERS)) {
    const match = url.match(provider.pattern);
    if (match) {
      const [, ...groups] = match;
      let embedUrl: string;

      if (providerName === 'codepen' || providerName === 'github') {
        // 2개 매개변수 필요한 경우
        if (groups.length >= 2) {
          embedUrl = provider.embedUrl(groups[0]!, groups[1]!);
        } else {
          continue; // 매개변수가 부족하면 다음 제공자 시도
        }
      } else {
        // 1개 매개변수만 필요한 경우
        embedUrl = provider.embedUrl(groups[0]!);
      }

      return {
        provider: providerName as keyof typeof EMBED_PROVIDERS,
        embedUrl,
        metadata: {
          originalUrl: url,
          provider: provider.name,
          icon: provider.icon,
        },
      };
    }
  }

  return {
    provider: null,
    embedUrl: null,
    metadata: {},
  };
}
