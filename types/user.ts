/**
 * 사용자 관련 타입 정의
 */

// 사용자 역할
export type UserRole = 'USER' | 'ADMIN';

// 기본 사용자 응답
export interface UserResponse {
  id: number;
  email: string;
  username: string;
  profileImageUrl?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 사용자 프로필 응답 (상세 정보 포함)
export interface UserProfileResponse extends UserResponse {
  lastLoginAt?: string;
}

// 사용자 등록 요청
export interface UserRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

// 사용자 로그인 요청
export interface UserLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 사용자 정보 수정 요청
export interface UserUpdateRequest {
  username?: string;
  profileImageUrl?: string;
}

// 비밀번호 변경 요청
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// 인증 토큰 응답
export interface AuthTokenResponse {
  tokenType: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: UserResponse;
}

// 사용자 검증 상태
export interface UserValidation {
  isEmailValid: boolean;
  isUsernameValid: boolean;
  isPasswordValid: boolean;
  errors: {
    email?: string;
    username?: string;
    password?: string;
  };
}

// 사용자 통계 (관리자용)
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
}
