/**
 * API 서비스들 통합 Export
 *
 * 사용법:
 * import { authApi, workspaceApi, pageApi } from '@/lib/api';
 */

// API 클라이언트
export { api, apiClient } from './client';

// 도메인별 API 서비스
export { authApi } from './auth';
export { workspaceApi } from './workspace';
export { pageApi } from './page';
export { commentApi } from './comment';
export { fileApi } from './file';
export { tagApi } from './tag';
export { notificationApi } from './notification';

// API 설정
export { API_CONFIG, API_ENDPOINTS, buildUrl } from '@/lib/config/api-config';
