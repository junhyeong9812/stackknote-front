/**
 * API 공통 응답 및 요청 타입 정의
 */

// API 공통 응답 형식 (백엔드 ApiResponse와 매칭)
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// 페이지네이션 응답 (백엔드 PageResponse와 매칭)
export interface PaginatedResponse<T> {
  content: T[];
  page: number; // 현재 페이지 번호 (0부터 시작)
  size: number; // 페이지 크기
  totalElements: number; // 전체 요소 수
  totalPages: number; // 전체 페이지 수
  first: boolean; // 첫 번째 페이지 여부
  last: boolean; // 마지막 페이지 여부
  hasNext: boolean; // 다음 페이지 존재 여부
  hasPrevious: boolean; // 이전 페이지 존재 여부
}

// API 에러 응답 (백엔드 ErrorResponse와 매칭)
export interface ApiError {
  errorCode: string;
  message: string;
  fieldErrors?: FieldError[];
  timestamp: string;
}

// 필드 검증 에러
export interface FieldError {
  field: string;
  rejectedValue: any;
  message: string;
}

// 페이지네이션 매개변수
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

// 검색 매개변수
export interface SearchParams extends PaginationParams {
  keyword?: string;
}

// 날짜 범위 매개변수
export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

// 파일 업로드 진행률 콜백
export interface UploadProgressCallback {
  (progress: number): void;
}

// API 요청 옵션
export interface RequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// HTTP 메서드 타입
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API 엔드포인트 타입
export interface ApiEndpoint {
  method: HttpMethod;
  path: string;
  authenticated?: boolean;
}
