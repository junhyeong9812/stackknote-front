/**
 * Axios 기반 API 클라이언트
 * 인증, 에러 처리, 재시도 로직 포함
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

import { API_CONFIG } from '@/lib/config/api-config';
import { env, isDevelopment } from '@/lib/config/env';
import { ApiResponse, ApiError, PaginatedResponse } from '@/types';

// 요청 설정 인터페이스 (재시도 관련 속성 추가)
interface RequestConfig extends AxiosRequestConfig {
  skipAuthRetry?: boolean; // 인증 재시도 스킵
  skipErrorToast?: boolean; // 에러 토스트 스킵
  _retry?: boolean; // 재시도 여부 플래그
  _retryCount?: number; // 재시도 횟수
}

// 재시도 설정
interface RetryConfig {
  attempts: number;
  delay: number;
  shouldRetry: (error: AxiosError) => boolean;
}

// API 클라이언트 클래스
class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string | null) => void> = [];

  constructor() {
    this.instance = this.createInstance();
    this.setupInterceptors();
  }

  /**
   * Axios 인스턴스 생성
   */
  private createInstance(): AxiosInstance {
    return axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      withCredentials: true, // 쿠키 포함
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  /**
   * 인터셉터 설정
   */
  private setupInterceptors(): void {
    // 요청 인터셉터
    this.instance.interceptors.request.use(
      config => {
        this.logRequest(config);
        return config;
      },
      error => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.instance.interceptors.response.use(
      response => {
        this.logResponse(response);
        return response;
      },
      async (error: AxiosError) => {
        return this.handleResponseError(error);
      }
    );
  }

  /**
   * 요청 로깅
   */
  private logRequest(config: AxiosRequestConfig): void {
    if (isDevelopment) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
      if (config.data) {
        console.log('📦 Request Data:', config.data);
      }
    }
  }

  /**
   * 응답 로깅
   */
  private logResponse(response: AxiosResponse): void {
    if (isDevelopment) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data
      );
    }
  }

  /**
   * 응답 에러 처리
   */
  private async handleResponseError(error: AxiosError): Promise<any> {
    const config = error.config as RequestConfig;

    console.error('❌ API Error:', {
      url: config?.url,
      method: config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    // 401 Unauthorized - 토큰 갱신 시도
    if (error.response?.status === 401 && !config?.skipAuthRetry) {
      return this.handleUnauthorized(error);
    }

    // 재시도 가능한 에러
    if (this.shouldRetry(error) && !config?._retry) {
      return this.retryRequest(error);
    }

    return Promise.reject(this.normalizeError(error));
  }

  /**
   * 인증 오류 처리
   */
  private async handleUnauthorized(error: AxiosError): Promise<any> {
  const config = error.config as RequestConfig;

  // 로그인, 회원가입, 토큰 갱신 요청은 재시도하지 않음
  const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
  if (config?.url && authEndpoints.some(endpoint => config.url?.includes(endpoint))) {
    return Promise.reject(this.normalizeError(error));
  }

  if (this.isRefreshing) {
    // 이미 토큰 갱신 중이면 대기
    return new Promise(resolve => {
      this.refreshSubscribers.push(token => {
        if (token) {
          resolve(this.instance.request(config));
        } else {
          resolve(Promise.reject(error));
        }
      });
    });
  }

  this.isRefreshing = true;

  try {
    // 토큰 갱신 시도 - 타입 캐스팅 사용
    await this.instance.post('/auth/refresh', {}, {
      skipAuthRetry: true
    } as RequestConfig);  // ← 이렇게 타입 캐스팅

    // 대기 중인 요청들 재시도
    this.refreshSubscribers.forEach(callback => callback('refreshed'));
    this.refreshSubscribers = [];

    // 원래 요청 재시도
    return this.instance.request(config);
  } catch (refreshError) {
    // 갱신 실패 시 로그인 페이지로 리다이렉트
    this.refreshSubscribers.forEach(callback => callback(null));
    this.refreshSubscribers = [];

    // 로그인 페이지에 있으면 리다이렉트하지 않음
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }

    return Promise.reject(refreshError);
  } finally {
    this.isRefreshing = false;
  }
}
  // private async handleUnauthorized(error: AxiosError): Promise<any> {
  //   const config = error.config as RequestConfig;
    
  //   if (this.isRefreshing) {
  //     // 이미 토큰 갱신 중이면 대기
  //     return new Promise(resolve => {
  //       this.refreshSubscribers.push(token => {
  //         if (token) {
  //           resolve(this.instance.request(config));
  //         } else {
  //           resolve(Promise.reject(error));
  //         }
  //       });
  //     });
  //   }

  //   this.isRefreshing = true;

  //   try {
  //     // 토큰 갱신 시도
  //     await this.instance.post('/auth/refresh');

  //     // 대기 중인 요청들 재시도
  //     this.refreshSubscribers.forEach(callback => callback('refreshed'));
  //     this.refreshSubscribers = [];

  //     // 원래 요청 재시도
  //     return this.instance.request(config);
  //   } catch (refreshError) {
  //     // 갱신 실패 시 로그인 페이지로 리다이렉트
  //     this.refreshSubscribers.forEach(callback => callback(null));
  //     this.refreshSubscribers = [];

  //     if (typeof window !== 'undefined') {
  //       window.location.href = '/login';
  //     }

  //     return Promise.reject(refreshError);
  //   } finally {
  //     this.isRefreshing = false;
  //   }
  // }

  /**
   * 재시도 여부 판단
   */
  private shouldRetry(error: AxiosError): boolean {
    const status = error.response?.status;
    const isNetworkError = !status;
    const isServerError = status && status >= 500;
    const isTimeoutError = error.code === 'ECONNABORTED';

    return isNetworkError || isServerError || isTimeoutError;
  }

  /**
   * 요청 재시도
   */
  private async retryRequest(error: AxiosError): Promise<any> {
    const config = error.config as RequestConfig;

    config._retry = true;
    config._retryCount = (config._retryCount || 0) + 1;

    if (config._retryCount > API_CONFIG.RETRY_ATTEMPTS) {
      return Promise.reject(error);
    }

    // 지연 후 재시도
    await new Promise(resolve =>
      setTimeout(resolve, API_CONFIG.RETRY_DELAY * config._retryCount!)
    );

    return this.instance.request(config);
  }

  /**
   * 에러 정규화
   */
  private normalizeError(error: AxiosError): ApiError {
    const response = error.response;

    if (response?.data) {
      // 백엔드에서 온 에러 응답
      const errorData = response.data as any;
      return {
        errorCode: errorData.errorCode || 'UNKNOWN_ERROR',
        message: errorData.message || error.message,
        fieldErrors: errorData.fieldErrors,
        timestamp: errorData.timestamp || new Date().toISOString(),
      };
    }

    // 네트워크 에러 등
    return {
      errorCode: error.code || 'NETWORK_ERROR',
      message: error.message || '네트워크 오류가 발생했습니다.',
      timestamp: new Date().toISOString(),
    };
  }

  // Public API 메서드들

  /**
   * GET 요청
   */
  async get<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, config);
    return response.data;
  }

  /**
   * POST 요청
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data, config);
    return response.data;
  }

  /**
   * PUT 요청
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data, config);
    return response.data;
  }

  /**
   * DELETE 요청
   */
  async delete<T = any>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url, config);
    return response.data;
  }

  /**
   * PATCH 요청
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data, config);
    return response.data;
  }

  /**
   * 파일 업로드
   */
  async uploadFile<T = any>(
    url: string,
    file: File,
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    // 추가 데이터가 있으면 FormData에 추가
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    const response = await this.instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  /**
   * 파일 다운로드
   */
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: 'blob',
    });

    // 브라우저 다운로드 트리거
    const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = downloadUrl;

    // 파일명 설정
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch) {
        link.download = decodeURIComponent(filenameMatch[1]);
      }
    } else if (filename) {
      link.download = filename;
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * 원시 Axios 인스턴스 접근 (특수한 경우)
   */
  getRawInstance(): AxiosInstance {
    return this.instance;
  }
}

// 싱글톤 인스턴스 생성
export const apiClient = new ApiClient();

// 편의 함수들 export
export const api = {
  get: <T = any>(url: string, config?: RequestConfig) =>
    apiClient.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    apiClient.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    apiClient.put<T>(url, data, config),

  delete: <T = any>(url: string, config?: RequestConfig) =>
    apiClient.delete<T>(url, config),

  patch: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    apiClient.patch<T>(url, data, config),

  uploadFile: <T = any>(
    url: string,
    file: File,
    additionalData?: Record<string, any>,
    onProgress?: (progress: number) => void
  ) => apiClient.uploadFile<T>(url, file, additionalData, onProgress),

  downloadFile: (url: string, filename?: string) =>
    apiClient.downloadFile(url, filename),
};

export default apiClient;
