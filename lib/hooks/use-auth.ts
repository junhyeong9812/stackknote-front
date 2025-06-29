/**
 * 인증 관련 커스텀 훅
 */

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAuth as useAuthStore,
  useAuthStore as useRawAuthStore,
} from '@/lib/stores';
import {
  AUTH_ROUTES,
  AUTH_ERRORS,
  SESSION_CONFIG,
} from '@/lib/config/auth-config';
import { UserLoginRequest, UserRegisterRequest } from '@/types';

/**
 * 기본 인증 훅 (스토어에서 가져온 것의 확장)
 */
export function useAuth() {
  const auth = useAuthStore();
  const router = useRouter();

  const login = useCallback(
    async (credentials: UserLoginRequest) => {
      try {
        await auth.login(credentials);
        router.push(AUTH_ROUTES.DEFAULT_REDIRECT);
      } catch (error) {
        throw error;
      }
    },
    [auth.login, router]
  );

  const register = useCallback(
    async (userData: UserRegisterRequest) => {
      try {
        const user = await auth.register(userData);
        // 회원가입 후 로그인 페이지로 이동
        router.push(AUTH_ROUTES.LOGIN);
        return user;
      } catch (error) {
        throw error;
      }
    },
    [auth.register, router]
  );

  const logout = useCallback(async () => {
    try {
      await auth.logout();
      router.push(AUTH_ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      // 에러가 있어도 로그인 페이지로 이동
      router.push(AUTH_ROUTES.LOGIN);
    }
  }, [auth.logout, router]);

  const logoutFromAllDevices = useCallback(async () => {
    try {
      await auth.logoutFromAllDevices();
      router.push(AUTH_ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout all devices error:', error);
      router.push(AUTH_ROUTES.LOGIN);
    }
  }, [auth.logoutFromAllDevices, router]);

  return {
    ...auth,
    login,
    register,
    logout,
    logoutFromAllDevices,
  };
}

/**
 * 인증 상태 초기화 훅
 */
export function useAuthInitializer() {
  const { checkAuthStatus } = useRawAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [checkAuthStatus]);

  return isInitialized;
}

/**
 * 인증 가드 훅 (페이지 보호)
 */
export function useAuthGuard(redirectTo?: string) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirect = redirectTo || AUTH_ROUTES.LOGIN;
      router.push(redirect);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    isAuthorized: isAuthenticated && !isLoading,
  };
}

/**
 * 게스트 가드 훅 (인증된 사용자는 접근 불가)
 */
export function useGuestGuard(redirectTo?: string) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = redirectTo || AUTH_ROUTES.DEFAULT_REDIRECT;
      router.push(redirect);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  return {
    isGuest: !isAuthenticated,
    isLoading,
    canAccess: !isAuthenticated && !isLoading,
  };
}

/**
 * 세션 타이머 훅
 */
export function useSessionTimer() {
  const { isAuthenticated, logout } = useAuth();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setTimeLeft(null);
      setShowWarning(false);
      return;
    }

    // 세션 타이머 시작
    const sessionDuration = SESSION_CONFIG.DEFAULT_DURATION;
    const warningTime = sessionDuration - SESSION_CONFIG.IDLE_TIMEOUT;

    // let warningTimer: NodeJS.Timeout;
    // let logoutTimer: NodeJS.Timeout;

    // 경고 타이머
     const warningTimer = setTimeout(() => {  // 170라인 ✅
      setShowWarning(true);
      setTimeLeft(SESSION_CONFIG.IDLE_TIMEOUT);

      // 카운트다운 시작
      const countdownInterval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1000) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev - 1000;
        });
      }, 1000);
    }, warningTime);

    // 자동 로그아웃 타이머
    const logoutTimer = setTimeout(() => {  // 187라인 ✅
      logout();
    }, sessionDuration);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
    };
  }, [isAuthenticated, logout]);

  const extendSession = useCallback(() => {
    setShowWarning(false);
    setTimeLeft(null);
    // 세션 연장 API 호출 (추후 구현)
  }, []);

  const formatTimeLeft = useCallback((milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    showWarning,
    timeLeft,
    timeLeftFormatted: timeLeft ? formatTimeLeft(timeLeft) : null,
    extendSession,
  };
}

/**
 * 권한 확인 훅
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  const hasRole = useCallback(
    (role: string) => {
      if (!isAuthenticated || !user) return false;
      return user.role === role;
    },
    [isAuthenticated, user]
  );

  const isOwner = useCallback(() => {
    return hasRole('ADMIN');
  }, [hasRole]);

  const isAdmin = useCallback(() => {
    return hasRole('ADMIN');
  }, [hasRole]);

  const canAccess = useCallback(
    (requiredRole?: string) => {
      if (!requiredRole) return isAuthenticated;
      return hasRole(requiredRole);
    },
    [isAuthenticated, hasRole]
  );

  return {
    hasRole,
    isOwner,
    isAdmin,
    canAccess,
    userRole: user?.role,
  };
}

/**
 * 프로필 관리 훅
 */
export function useProfile() {
  const { user, refreshProfile, setUser } = useRawAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(
    async (data: any) => {
      if (!user) return;

      try {
        setIsUpdating(true);
        setError(null);

        // API 호출로 프로필 업데이트 (추후 구현)
        // const updatedUser = await authApi.updateProfile(data);
        // setUser(updatedUser);

        await refreshProfile();
      } catch (err: any) {
        setError(err.message || '프로필 업데이트에 실패했습니다.');
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [user, refreshProfile, setUser]
  );

  const uploadProfileImage = useCallback(
    async (file: File) => {
      if (!user) return;

      try {
        setIsUpdating(true);
        setError(null);

        // 이미지 업로드 API 호출 (추후 구현)
        // const imageUrl = await fileApi.uploadProfileImage(file);
        // await updateProfile({ profileImageUrl: imageUrl });
      } catch (err: any) {
        setError(err.message || '프로필 이미지 업로드에 실패했습니다.');
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [user, updateProfile]
  );

  return {
    user,
    isUpdating,
    error,
    updateProfile,
    uploadProfileImage,
    clearError: () => setError(null),
  };
}

/**
 * 비밀번호 관리 훅
 */
export function usePasswordManagement() {
  const { user } = useAuth();
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!user) return;

      try {
        setIsChanging(true);
        setError(null);

        // 비밀번호 변경 API 호출 (추후 구현)
        // await authApi.changePassword({ currentPassword, newPassword });
      } catch (err: any) {
        setError(err.message || '비밀번호 변경에 실패했습니다.');
        throw err;
      } finally {
        setIsChanging(false);
      }
    },
    [user]
  );

  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);

      // 비밀번호 재설정 API 호출 (추후 구현)
      // await authApi.resetPassword(email);
    } catch (err: any) {
      setError(err.message || '비밀번호 재설정에 실패했습니다.');
      throw err;
    }
  }, []);

  return {
    isChanging,
    error,
    changePassword,
    resetPassword,
    clearError: () => setError(null),
  };
}

/**
 * 로그인 폼 관리 훅
 */
export function useLoginForm() {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const updateField = useCallback(
    (field: keyof typeof formData, value: string | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.email || !formData.password) {
        return;
      }

      try {
        await login(formData);
      } catch (error) {
        // 에러는 이미 store에서 처리됨
      }
    },
    [formData, login]
  );

  const reset = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      rememberMe: false,
    });
    clearError();
  }, [clearError]);

  return {
    formData,
    updateField,
    handleSubmit,
    reset,
    isLoading,
    error,
    clearError,
  };
}

/**
 * 회원가입 폼 관리 훅
 */
export function useRegisterForm() {
  const { register, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const updateField = useCallback(
    (field: keyof typeof formData, value: string | boolean) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const validateForm = useCallback(() => {
    const errors: string[] = [];

    if (!formData.email) errors.push('이메일을 입력해주세요.');
    if (!formData.username) errors.push('사용자명을 입력해주세요.');
    if (!formData.password) errors.push('비밀번호를 입력해주세요.');
    if (formData.password !== formData.confirmPassword) {
      errors.push('비밀번호가 일치하지 않습니다.');
    }
    if (!formData.agreeToTerms) errors.push('이용약관에 동의해주세요.');

    return errors;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        return;
      }

      try {
        await register({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
      } catch (error) {
        // 에러는 이미 store에서 처리됨
      }
    },
    [formData, register, validateForm]
  );

  const reset = useCallback(() => {
    setFormData({
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    });
    clearError();
  }, [clearError]);

  return {
    formData,
    updateField,
    handleSubmit,
    reset,
    validateForm,
    isLoading,
    error,
    clearError,
  };
}
