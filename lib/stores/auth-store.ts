/**
 * 인증 상태 관리 Store (Zustand)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  AuthStatus,
  AuthState,
  UserResponse,
  UserLoginRequest,
  UserRegisterRequest,
} from '@/types';
import { authApi } from '@/lib/api';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: UserLoginRequest) => Promise<void>;
  register: (userData: UserRegisterRequest) => Promise<UserResponse>;
  logout: () => Promise<void>;
  logoutFromAllDevices: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;

  // Internal actions
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state - 수정: 초기 상태를 unauthenticated로 변경
      status: 'unauthenticated',
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: UserLoginRequest) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApi.login(credentials);
          const { user, accessTokenExpiresAt } = response.data;

          set({
            status: 'authenticated',
            user,
            expiresAt: accessTokenExpiresAt,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            status: 'unauthenticated',
            user: null,
            expiresAt: null,
            isLoading: false,
            error: error.message || '로그인에 실패했습니다.',
          });
          throw error;
        }
      },

      register: async (userData: UserRegisterRequest) => {
        try {
          set({ isLoading: true, error: null });

          const response = await authApi.register(userData);
          const user = response.data;

          // 회원가입 후 자동 로그인은 하지 않음
          set({
            status: 'unauthenticated',
            user: null,
            isLoading: false,
            error: null,
          });

          return user;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || '회원가입에 실패했습니다.',
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await authApi.logout();
        } catch (error) {
          console.error('Logout API error:', error);
        } finally {
          // API 오류와 관계없이 로컬 상태 초기화
          set({
            status: 'unauthenticated',
            user: null,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            isLoading: false,
            error: null,
          });
        }
      },

      logoutFromAllDevices: async () => {
        try {
          set({ isLoading: true });
          await authApi.logoutFromAllDevices();
        } catch (error) {
          console.error('Logout all devices API error:', error);
        } finally {
          set({
            status: 'unauthenticated',
            user: null,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            isLoading: false,
            error: null,
          });
        }
      },

      checkAuthStatus: async () => {
        try {
          set({ status: 'loading', isLoading: true });

          const response = await authApi.checkAuthStatus();

          if (response.data) {
            // 인증 상태이면 프로필 정보 가져오기
            const profileResponse = await authApi.getMyProfile();
            set({
              status: 'authenticated',
              user: profileResponse.data,
              isLoading: false,
            });
          } else {
            set({
              status: 'unauthenticated',
              user: null,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            status: 'unauthenticated',
            user: null,
            isLoading: false,
          });
        }
      },

      refreshProfile: async () => {
        try {
          const response = await authApi.getMyProfile();
          set({ user: response.data });
        } catch (error) {
          console.error('Failed to refresh profile:', error);
        }
      },

      clearError: () => {
        set({ error: null });
      },

      // Internal actions
      setUser: (user: UserResponse | null) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        // 민감한 정보는 localStorage에 저장하지 않음
        user: state.user,
        status:
          state.status === 'authenticated' ? 'loading' : 'unauthenticated',
      }),
    }
  )
);

// Computed values (selectors) - 수정: isLoading 로직 개선
export const useAuth = () => {
  const store = useAuthStore();

  return {
    ...store,
    isAuthenticated: store.status === 'authenticated',
    // 수정: 명시적인 isLoading 상태만 사용
    isLoading: store.isLoading,
    isGuest: false, // 추후 게스트 모드 구현시 사용
  };
};

// 특정 상태만 구독하는 hooks
export const useUser = () => useAuthStore(state => state.user);
export const useAuthStatus = () => useAuthStore(state => state.status);
export const useAuthError = () => useAuthStore(state => state.error);