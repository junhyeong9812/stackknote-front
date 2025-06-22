/**
 * 인증 관련 타입 정의
 */

import { UserResponse } from './user';

// 로그인 상태
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

// 인증 상태 정보
export interface AuthState {
  status: AuthStatus;
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  isLoading: boolean;
  error: string | null;
}

// 로그인 폼 데이터
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

// 회원가입 폼 데이터
export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// 패스워드 변경 폼 데이터
export interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// 세션 정보
export interface SessionInfo {
  userId: number;
  email: string;
  username: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  expiresAt: string;
}

// 토큰 정보
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

// 로그아웃 옵션
export interface LogoutOptions {
  everywhere?: boolean; // 모든 디바이스에서 로그아웃
  clearCache?: boolean; // 로컬 캐시 삭제
}

// 인증 에러 타입
export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

// 게스트 모드 정보
export interface GuestInfo {
  isGuest: boolean;
  guestId?: string;
  limitations: string[];
}
