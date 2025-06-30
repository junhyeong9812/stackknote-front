/**
 * 환경 변수 설정 및 타입 정의
 * 런타임에서 환경 변수 유효성 검사
 */

// 환경 변수 타입 정의
interface EnvConfig {
  // API 설정
  API_URL: string;
  API_TIMEOUT: number;
  
  // 도메인별 API URL
  PROD_API_URL?: string;
  LOCAL_API_URL?: string;

  // 앱 설정
  APP_NAME: string;
  APP_VERSION: string;
  APP_ENV: 'development' | 'production' | 'test';

  // 파일 업로드 설정
  MAX_FILE_SIZE: number;
  ALLOWED_IMAGE_TYPES: string[];
  ALLOWED_FILE_TYPES: string[];

  // 에디터 설정
  EDITOR_AUTO_SAVE_INTERVAL: number;
  EDITOR_HISTORY_LIMIT: number;

  // 실시간 협업
  WEBSOCKET_URL?: string;
  PROD_WS_URL?: string;
  LOCAL_WS_URL?: string;
  ENABLE_REALTIME: boolean;

  // 게스트 모드
  GUEST_USERNAME: string;
  GUEST_PASSWORD: string;
  ENABLE_GUEST_MODE: boolean;

  // 분석 및 모니터링
  ANALYTICS_ID?: string;
  SENTRY_DSN?: string;

  // 디버그
  DEBUG_MODE: boolean;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}

/**
 * 환경 변수 파싱 및 기본값 설정
 */
function parseEnvConfig(): EnvConfig {
  // API URL 우선순위 처리 (유연한 검증)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 
                 process.env.NEXT_PUBLIC_PROD_API_URL || 
                 process.env.NEXT_PUBLIC_LOCAL_API_URL;
  
  if (!apiUrl) {
    throw new Error('Missing required API URL environment variable (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_PROD_API_URL, or NEXT_PUBLIC_LOCAL_API_URL)');
  }

  return {
    // API 설정
    API_URL: apiUrl,
    PROD_API_URL: process.env.NEXT_PUBLIC_PROD_API_URL,
    LOCAL_API_URL: process.env.NEXT_PUBLIC_LOCAL_API_URL,
    API_TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),

    // 앱 설정
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'StackNote',
    APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
    APP_ENV:
      (process.env.NEXT_PUBLIC_APP_ENV as EnvConfig['APP_ENV']) ||
      'development',

    // 파일 업로드 설정
    MAX_FILE_SIZE: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10', 10),
    ALLOWED_IMAGE_TYPES: (
      process.env.NEXT_PUBLIC_ALLOWED_IMAGE_TYPES ||
      'image/jpeg,image/png,image/gif,image/webp'
    ).split(','),
    ALLOWED_FILE_TYPES: (
      process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES ||
      'image/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
    ).split(','),

    // 에디터 설정
    EDITOR_AUTO_SAVE_INTERVAL: parseInt(
      process.env.NEXT_PUBLIC_EDITOR_AUTO_SAVE_INTERVAL || '5000',
      10
    ),
    EDITOR_HISTORY_LIMIT: parseInt(
      process.env.NEXT_PUBLIC_EDITOR_HISTORY_LIMIT || '50',
      10
    ),

    // 실시간 협업
    WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
    PROD_WS_URL: process.env.NEXT_PUBLIC_PROD_WS_URL,
    LOCAL_WS_URL: process.env.NEXT_PUBLIC_LOCAL_WS_URL,
    ENABLE_REALTIME: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',

    // 게스트 모드
    GUEST_USERNAME: process.env.NEXT_PUBLIC_GUEST_USERNAME || 'guest',
    GUEST_PASSWORD: process.env.NEXT_PUBLIC_GUEST_PASSWORD || 'guest123',
    ENABLE_GUEST_MODE: process.env.NEXT_PUBLIC_ENABLE_GUEST_MODE !== 'false',

    // 분석 및 모니터링
    ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // 디버그
    DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    LOG_LEVEL:
      (process.env.NEXT_PUBLIC_LOG_LEVEL as EnvConfig['LOG_LEVEL']) || 'info',
  };
}

// 환경 변수 설정 객체 생성
export const env: EnvConfig = parseEnvConfig();

// 개발 환경 여부 확인
export const isDevelopment = env.APP_ENV === 'development';
export const isProduction = env.APP_ENV === 'production';
export const isTest = env.APP_ENV === 'test';

// 파일 크기를 바이트로 변환
export const MAX_FILE_SIZE_BYTES = env.MAX_FILE_SIZE * 1024 * 1024;

// 로그 레벨 우선순위
export const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * 현재 로그 레벨에 따라 로그 출력 여부 결정
 */
export function shouldLog(level: EnvConfig['LOG_LEVEL']): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[env.LOG_LEVEL];
}

/**
 * 파일 타입 검증
 */
export function isAllowedFileType(file: File): boolean {
  return env.ALLOWED_FILE_TYPES.some(type => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.slice(0, -1));
    }
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    }
    return file.type === type;
  });
}

/**
 * 이미지 파일 타입 검증
 */
export function isAllowedImageType(file: File): boolean {
  return env.ALLOWED_IMAGE_TYPES.includes(file.type);
}

/**
 * 파일 크기 검증
 */
export function isValidFileSize(file: File): boolean {
  return file.size <= MAX_FILE_SIZE_BYTES;
}

/**
 * 도메인별 API URL 동적 결정
 */
export function getApiUrl(path: string = ''): string {
  let baseUrl: string;
  
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 기본값 사용
    baseUrl = env.API_URL;
  } else {
    // 클라이언트 사이드에서는 도메인별 분기
    const hostname = window.location.hostname;
    
    switch (hostname) {
      case 'www.pinjun.xyz':
        baseUrl = env.PROD_API_URL || env.API_URL;
        break;
      case '192.168.55.164':
        baseUrl = env.LOCAL_API_URL || env.API_URL;
        break;
      default:
        baseUrl = env.API_URL;
    }
  }
  
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
}

/**
 * 도메인별 WebSocket URL 동적 결정
 */
export function getWebSocketUrl(path: string = ''): string | null {
  if (!env.ENABLE_REALTIME) return null;
  
  let baseUrl: string | undefined;
  
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 기본값 사용
    baseUrl = env.WEBSOCKET_URL;
  } else {
    // 클라이언트 사이드에서는 도메인별 분기
    const hostname = window.location.hostname;
    
    switch (hostname) {
      case 'www.pinjun.xyz':
        baseUrl = env.PROD_WS_URL || env.WEBSOCKET_URL;
        break;
      case '192.168.55.164':
        baseUrl = env.LOCAL_WS_URL || env.WEBSOCKET_URL;
        break;
      default:
        baseUrl = env.WEBSOCKET_URL;
    }
  }
  
  if (!baseUrl) return null;
  
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBaseUrl}${cleanPath}`;
}