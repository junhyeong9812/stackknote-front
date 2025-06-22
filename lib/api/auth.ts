/**
 * 인증 관련 API 서비스
 */

import { api } from './client';
import { API_ENDPOINTS } from '@/lib/config/api-config';
import {
  UserLoginRequest,
  UserRegisterRequest,
  PasswordChangeRequest,
  UserUpdateRequest,
  AuthTokenResponse,
  UserResponse,
  UserProfileResponse,
  ApiResponse,
} from '@/types';

export class AuthApiService {
  /**
   * 사용자 로그인
   */
  async login(
    request: UserLoginRequest
  ): Promise<ApiResponse<AuthTokenResponse>> {
    return api.post<AuthTokenResponse>(API_ENDPOINTS.AUTH.LOGIN, request);
  }

  /**
   * 사용자 회원가입
   */
  async register(
    request: UserRegisterRequest
  ): Promise<ApiResponse<UserResponse>> {
    return api.post<UserResponse>(API_ENDPOINTS.AUTH.REGISTER, request);
  }

  /**
   * 로그아웃
   */
  async logout(): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  /**
   * 모든 디바이스에서 로그아웃
   */
  async logoutFromAllDevices(): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.AUTH.LOGOUT_ALL);
  }

  /**
   * 토큰 갱신
   */
  async refreshToken(): Promise<ApiResponse<AuthTokenResponse>> {
    return api.post<AuthTokenResponse>(API_ENDPOINTS.AUTH.REFRESH);
  }

  /**
   * 인증 상태 확인
   */
  async checkAuthStatus(): Promise<ApiResponse<boolean>> {
    return api.get<boolean>(API_ENDPOINTS.AUTH.STATUS);
  }

  /**
   * 내 프로필 조회
   */
  async getMyProfile(): Promise<ApiResponse<UserProfileResponse>> {
    return api.get<UserProfileResponse>(API_ENDPOINTS.USERS.ME);
  }

  /**
   * 사용자 정보 수정
   */
  async updateProfile(
    request: UserUpdateRequest
  ): Promise<ApiResponse<UserResponse>> {
    return api.put<UserResponse>(API_ENDPOINTS.USERS.PROFILE, request);
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(
    request: PasswordChangeRequest
  ): Promise<ApiResponse<void>> {
    return api.put<void>(API_ENDPOINTS.USERS.PASSWORD, request);
  }

  /**
   * 이메일 인증 완료
   */
  async verifyEmail(): Promise<ApiResponse<UserResponse>> {
    return api.post<UserResponse>(API_ENDPOINTS.USERS.VERIFY_EMAIL);
  }

  /**
   * 계정 비활성화
   */
  async deactivateAccount(): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.USERS.DEACTIVATE);
  }

  /**
   * 계정 활성화
   */
  async activateAccount(): Promise<ApiResponse<UserResponse>> {
    return api.post<UserResponse>(API_ENDPOINTS.USERS.ACTIVATE);
  }

  /**
   * 계정 삭제
   */
  async deleteAccount(): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.USERS.DELETE);
  }

  /**
   * 이메일 중복 확인
   */
  async checkEmailAvailability(email: string): Promise<ApiResponse<boolean>> {
    return api.get<boolean>(API_ENDPOINTS.USERS.CHECK_EMAIL, {
      params: { email },
    });
  }

  /**
   * 사용자명 중복 확인
   */
  async checkUsernameAvailability(
    username: string
  ): Promise<ApiResponse<boolean>> {
    return api.get<boolean>(API_ENDPOINTS.USERS.CHECK_USERNAME, {
      params: { username },
    });
  }

  /**
   * 사용자 ID로 사용자 조회
   */
  async getUserById(userId: number): Promise<ApiResponse<UserResponse>> {
    return api.get<UserResponse>(API_ENDPOINTS.USERS.BY_ID(userId));
  }

  /**
   * 사용자명으로 사용자 조회
   */
  async getUserByUsername(
    username: string
  ): Promise<ApiResponse<UserResponse>> {
    return api.get<UserResponse>(API_ENDPOINTS.USERS.BY_USERNAME(username));
  }
}

// 싱글톤 인스턴스 생성
export const authApi = new AuthApiService();
