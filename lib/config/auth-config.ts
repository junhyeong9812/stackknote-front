/**
 * 인증 관련 설정
 */

import { env } from './env';

// 인증 토큰 만료 시간 (밀리초)
export const AUTH_CONFIG = {
  // 액세스 토큰 만료 시간 (1시간)
  ACCESS_TOKEN_EXPIRY: 60 * 60 * 1000,

  // 리프레시 토큰 만료 시간 (7일)
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000,

  // 자동 로그아웃 전 경고 시간 (5분)
  LOGOUT_WARNING_TIME: 5 * 60 * 1000,

  // 토큰 갱신 시도 간격 (10초)
  REFRESH_RETRY_INTERVAL: 10 * 1000,

  // 최대 토큰 갱신 시도 횟수
  MAX_REFRESH_ATTEMPTS: 3,
} as const;

// 게스트 모드 설정
export const GUEST_CONFIG = {
  USERNAME: env.GUEST_USERNAME,
  PASSWORD: env.GUEST_PASSWORD,
  ENABLED: env.ENABLE_GUEST_MODE,

  // 게스트 제한 사항
  LIMITATIONS: [
    '공개 페이지만 열람 가능',
    '댓글 작성 불가',
    '파일 업로드 불가',
    '워크스페이스 생성 불가',
    '페이지 편집 불가',
  ],

  // 게스트 세션 만료 시간 (1시간)
  SESSION_EXPIRY: 60 * 60 * 1000,
} as const;

// 패스워드 정책
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SPECIAL_CHARS: false,
  FORBIDDEN_PATTERNS: [
    'password',
    '123456',
    'qwerty',
    'admin',
    'user',
  ],
} as const;

// 사용자명 정책
export const USERNAME_POLICY = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 30,
  ALLOWED_CHARS: /^[a-zA-Z0-9_-]+$/,
  FORBIDDEN_USERNAMES: [
    'admin',
    'root',
    'system',
    'api',
    'www',
    'mail',
    'ftp',
    'public',
    'private',
    'guest',
    'anonymous',
    'stacknote',
  ] satisfies string[],
} as const;

// 이메일 정책
export const EMAIL_POLICY = {
  MAX_LENGTH: 254,
  ALLOWED_DOMAINS: [] as string[], // 빈 배열이면 모든 도메인 허용
  FORBIDDEN_DOMAINS: [
    '10minutemail.com',
    'tempmail.org',
    'guerrillamail.com',
  ] satisfies string[],
} as const;

// 세션 관리
export const SESSION_CONFIG = {
  // Remember Me 기능 사용시 세션 유지 기간 (30일)
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000,

  // 일반 세션 유지 기간 (24시간)
  DEFAULT_DURATION: 24 * 60 * 60 * 1000,

  // 비활성 상태에서 자동 로그아웃 시간 (2시간)
  IDLE_TIMEOUT: 2 * 60 * 60 * 1000,

  // 세션 갱신 간격 (30분)
  RENEWAL_INTERVAL: 30 * 60 * 1000,
} as const;

// 2FA 설정 (추후 구현용)
export const TWO_FACTOR_CONFIG = {
  ENABLED: false,
  CODE_LENGTH: 6,
  CODE_EXPIRY: 5 * 60 * 1000, // 5분
  MAX_ATTEMPTS: 3,
  BACKUP_CODES_COUNT: 10,
} as const;

// OAuth 설정 (추후 구현용)
export const OAUTH_CONFIG = {
  GOOGLE: {
    ENABLED: false,
    CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    SCOPE: 'openid email profile',
  },
  GITHUB: {
    ENABLED: false,
    CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    SCOPE: 'user:email',
  },
  DISCORD: {
    ENABLED: false,
    CLIENT_ID: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
    SCOPE: 'identify email',
  },
} as const;

// 인증 관련 URL 경로
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  GUEST: '/guest',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  
  // 리다이렉트 경로
  DEFAULT_REDIRECT: '/dashboard',
  GUEST_REDIRECT: '/public',
  
  // 보호된 경로들
  PROTECTED_ROUTES: [
    '/dashboard',
    '/workspace',
    '/settings',
    '/profile',
  ],
  
  // 인증이 필요 없는 경로들
  PUBLIC_ROUTES: [
    '/',
    '/public',
    '/about',
    '/contact',
  ],
} as const;

// 에러 메시지
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
  USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
  USER_ALREADY_EXISTS: '이미 존재하는 사용자입니다.',
  EMAIL_ALREADY_EXISTS: '이미 사용 중인 이메일입니다.',
  USERNAME_ALREADY_EXISTS: '이미 사용 중인 사용자명입니다.',
  INVALID_EMAIL: '올바르지 않은 이메일 형식입니다.',
  INVALID_USERNAME: '올바르지 않은 사용자명 형식입니다.',
  WEAK_PASSWORD: '비밀번호가 너무 약합니다.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  TOKEN_EXPIRED: '토큰이 만료되었습니다.',
  TOKEN_INVALID: '유효하지 않은 토큰입니다.',
  ACCESS_DENIED: '접근이 거부되었습니다.',
  SESSION_EXPIRED: '세션이 만료되었습니다.',
  RATE_LIMIT_EXCEEDED: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
  GUEST_MODE_DISABLED: '게스트 모드가 비활성화되어 있습니다.',
  GUEST_ACCESS_DENIED: '게스트는 이 기능을 사용할 수 없습니다.',
} as const;

// 성공 메시지
export const AUTH_SUCCESS = {
  LOGIN_SUCCESS: '성공적으로 로그인되었습니다.',
  REGISTER_SUCCESS: '회원가입이 완료되었습니다.',
  LOGOUT_SUCCESS: '성공적으로 로그아웃되었습니다.',
  PASSWORD_CHANGED: '비밀번호가 성공적으로 변경되었습니다.',
  PROFILE_UPDATED: '프로필이 성공적으로 업데이트되었습니다.',
  EMAIL_VERIFIED: '이메일 인증이 완료되었습니다.',
  PASSWORD_RESET_SENT: '비밀번호 재설정 링크가 이메일로 전송되었습니다.',
} as const;

/**
 * 비밀번호 강도 검증
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number; // 0-4
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // 길이 검사
  if (password.length < PASSWORD_POLICY.MIN_LENGTH) {
    feedback.push(`최소 ${PASSWORD_POLICY.MIN_LENGTH}자 이상이어야 합니다.`);
  } else {
    score += 1;
  }

  // 대문자 검사
  if (PASSWORD_POLICY.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    feedback.push('대문자를 포함해야 합니다.');
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // 소문자 검사
  if (PASSWORD_POLICY.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    feedback.push('소문자를 포함해야 합니다.');
  } else if (/[a-z]/.test(password)) {
    score += 1;
  }

  // 숫자 검사
  if (PASSWORD_POLICY.REQUIRE_NUMBERS && !/\d/.test(password)) {
    feedback.push('숫자를 포함해야 합니다.');
  } else if (/\d/.test(password)) {
    score += 1;
  }

  // 특수문자 검사
  if (PASSWORD_POLICY.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*]/.test(password)) {
    feedback.push('특수문자를 포함해야 합니다.');
  } else if (/[!@#$%^&*]/.test(password)) {
    score += 1;
  }

  // 금지된 패턴 검사
  const lowerPassword = password.toLowerCase();
  for (const pattern of PASSWORD_POLICY.FORBIDDEN_PATTERNS) {
    if (lowerPassword.includes(pattern)) {
      feedback.push(`"${pattern}"과 같은 일반적인 패턴은 사용할 수 없습니다.`);
      score = Math.max(0, score - 1);
    }
  }

  return {
    isValid: feedback.length === 0 && score >= 3,
    score: Math.min(4, score),
    feedback,
  };
}

/**
 * 사용자명 유효성 검증
 */
export function validateUsername(username: string): {
  isValid: boolean;
  error?: string;
} {
  if (username.length < USERNAME_POLICY.MIN_LENGTH) {
    return {
      isValid: false,
      error: `사용자명은 최소 ${USERNAME_POLICY.MIN_LENGTH}자 이상이어야 합니다.`,
    };
  }

  if (username.length > USERNAME_POLICY.MAX_LENGTH) {
    return {
      isValid: false,
      error: `사용자명은 최대 ${USERNAME_POLICY.MAX_LENGTH}자까지 가능합니다.`,
    };
  }

  if (!USERNAME_POLICY.ALLOWED_CHARS.test(username)) {
    return {
      isValid: false,
      error: '사용자명은 영문, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다.',
    };
  }

  if (USERNAME_POLICY.FORBIDDEN_USERNAMES.includes(username.toLowerCase())) {
    return {
      isValid: false,
      error: '사용할 수 없는 사용자명입니다.',
    };
  }

  return { isValid: true };
}

/**
 * 이메일 유효성 검증
 */
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: '올바른 이메일 형식이 아닙니다.',
    };
  }

  if (email.length > EMAIL_POLICY.MAX_LENGTH) {
    return {
      isValid: false,
      error: `이메일은 최대 ${EMAIL_POLICY.MAX_LENGTH}자까지 가능합니다.`,
    };
  }

  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && EMAIL_POLICY.FORBIDDEN_DOMAINS.includes(domain)) {
    return {
      isValid: false,
      error: '사용할 수 없는 이메일 도메인입니다.',
    };
  }

  if (
    EMAIL_POLICY.ALLOWED_DOMAINS.length > 0 &&
    domain &&
    !EMAIL_POLICY.ALLOWED_DOMAINS.includes(domain)
  ) {
    return {
      isValid: false,
      error: '허용되지 않은 이메일 도메인입니다.',
    };
  }

  return { isValid: true };
}