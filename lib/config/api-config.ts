/**
 * API 설정 및 엔드포인트 정의
 */

import { env } from '../api/env';

// 동적 API URL 결정 함수
function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    // 서버 사이드에서는 기본값 사용
    return env.API_URL;
  }

  const hostname = window.location.hostname;
  
  switch (hostname) {
    case 'www.pinjun.xyz':
      return process.env.NEXT_PUBLIC_PROD_API_URL || env.API_URL;
    case '192.168.55.164':
      return process.env.NEXT_PUBLIC_LOCAL_API_URL || env.API_URL;
    default:
      return env.API_URL;
  }
}

// API 기본 설정
export const API_CONFIG = {
  BASE_URL: env.API_URL,
  TIMEOUT: env.API_TIMEOUT,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// API 엔드포인트 정의
export const API_ENDPOINTS = {
  // 인증 관련
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
    REFRESH: '/auth/refresh',
    STATUS: '/auth/status',
  },

  // 사용자 관련
  USERS: {
    ME: '/users/me',
    PROFILE: '/users/profile',
    PASSWORD: '/users/password',
    BY_ID: (id: number) => `/users/${id}`,
    BY_USERNAME: (username: string) => `/users/username/${username}`,
    CHECK_EMAIL: '/users/check-email',
    CHECK_USERNAME: '/users/check-username',
    VERIFY_EMAIL: '/users/verify-email',
    DEACTIVATE: '/users/deactivate',
    ACTIVATE: '/users/activate',
    DELETE: '/users/account',
  },

  // 워크스페이스 관련
  WORKSPACES: {
    BASE: '/workspaces',
    MY: '/workspaces/my',
    BY_ID: (id: number) => `/workspaces/${id}`,
    MEMBERS: (id: number) => `/workspaces/${id}/members`,
    MEMBER_BY_ID: (workspaceId: number, memberId: number) =>
      `/workspaces/${workspaceId}/members/${memberId}`,
    MEMBER_ROLE: (workspaceId: number, memberId: number) =>
      `/workspaces/${workspaceId}/members/${memberId}/role`,
    LEAVE: (id: number) => `/workspaces/${id}/leave`,
    INVITE_CODE: (id: number) => `/workspaces/${id}/invite-code`,
    JOIN: (code: string) => `/workspaces/join/${code}`,
    PREVIEW: (code: string) => `/workspaces/preview/${code}`,
    PUBLIC: '/workspaces/public',
    SEARCH: '/workspaces/search',
    STATISTICS: '/workspaces/my/statistics',
  },

  // 페이지 관련
  PAGES: {
    BY_WORKSPACE: (workspaceId: number) => `/workspaces/${workspaceId}/pages`,
    ROOT_PAGES: (workspaceId: number) =>
      `/workspaces/${workspaceId}/pages/root`,
    BY_ID: (workspaceId: number, pageId: number) =>
      `/workspaces/${workspaceId}/pages/${pageId}`,
    CHILDREN: (workspaceId: number, pageId: number) =>
      `/workspaces/${workspaceId}/pages/${pageId}/children`,
    SEARCH: (workspaceId: number) => `/workspaces/${workspaceId}/pages/search`,
    RECENT: (workspaceId: number) => `/workspaces/${workspaceId}/pages/recent`,
    PUBLISHED: (workspaceId: number) =>
      `/workspaces/${workspaceId}/pages/published`,
    TEMPLATES: (workspaceId: number) =>
      `/workspaces/${workspaceId}/pages/templates`,
    BY_TYPE: (workspaceId: number, pageType: string) =>
      `/workspaces/${workspaceId}/pages/type/${pageType}`,
    POPULAR: (workspaceId: number) =>
      `/workspaces/${workspaceId}/pages/popular`,
    HISTORY: (workspaceId: number, pageId: number) =>
      `/workspaces/${workspaceId}/pages/${pageId}/history`,
    HISTORY_VERSION: (workspaceId: number, pageId: number, version: number) =>
      `/workspaces/${workspaceId}/pages/${pageId}/history/${version}`,
    STATISTICS: (workspaceId: number) =>
      `/workspaces/${workspaceId}/pages/statistics`,

    // 페이지 명령
    MOVE: (workspaceId: number, pageId: number) =>
      `/workspaces/${workspaceId}/pages/${pageId}/move`,
    DUPLICATE: (workspaceId: number, pageId: number) =>
      `/workspaces/${workspaceId}/pages/${pageId}/duplicate`,
    TOGGLE_VISIBILITY: (workspaceId: number, pageId: number) =>
      `/workspaces/${workspaceId}/pages/${pageId}/toggle-visibility`,
    TOGGLE_LOCK: (workspaceId: number, pageId: number) =>
      `/workspaces/${workspaceId}/pages/${pageId}/toggle-lock`,
    RESTORE: (workspaceId: number, pageId: number, version: number) =>
      `/workspaces/${workspaceId}/pages/${pageId}/restore/${version}`,
  },

  // 댓글 관련
  COMMENTS: {
    BASE: '/comments',
    BY_ID: (id: number) => `/comments/${id}`,
    BY_PAGE: (pageId: number) => `/comments/page/${pageId}`,
    REPLIES: (id: number) => `/comments/${id}/replies`,
    LIKE: (id: number) => `/comments/${id}/like`,
    COUNT: (pageId: number) => `/comments/page/${pageId}/count`,
    BY_USER: (userId: number) => `/comments/user/${userId}`,
    DATE_RANGE: (pageId: number) => `/comments/page/${pageId}/date-range`,
    RECENT: '/comments/recent',
    BY_WORKSPACE: (workspaceId: number) =>
      `/comments/workspace/${workspaceId}/recent`,
    POPULAR: (pageId: number) => `/comments/page/${pageId}/popular`,
    MENTIONS: '/comments/mentions',
    MENTIONS_USER: (username: string) => `/comments/mentions/${username}`,
    SEARCH: (pageId: number) => `/comments/page/${pageId}/search`,
  },

  // 파일 관련
  FILES: {
    // 워크스페이스별 파일
    BY_WORKSPACE: (workspaceId: number) => `/workspaces/${workspaceId}/files`,
    UPLOAD: (workspaceId: number) => `/workspaces/${workspaceId}/files/upload`,
    BY_PAGE: (workspaceId: number, pageId: number) =>
      `/workspaces/${workspaceId}/files/pages/${pageId}`,
    UNATTACHED: (workspaceId: number) =>
      `/workspaces/${workspaceId}/files/unattached`,
    BY_TYPE: (workspaceId: number, type: string) =>
      `/workspaces/${workspaceId}/files/type/${type}`,
    IMAGES: (workspaceId: number) => `/workspaces/${workspaceId}/files/images`,
    SEARCH: (workspaceId: number) => `/workspaces/${workspaceId}/files/search`,
    RECENT: (workspaceId: number) => `/workspaces/${workspaceId}/files/recent`,
    POPULAR: (workspaceId: number) =>
      `/workspaces/${workspaceId}/files/popular`,
    STATISTICS: (workspaceId: number) =>
      `/workspaces/${workspaceId}/files/statistics`,

    // 전역 파일
    GLOBAL_BY_ID: (id: number) => `/files/${id}`,
    DOWNLOAD: (id: number) => `/files/${id}/download`,
    THUMBNAIL: (id: number) => `/files/${id}/thumbnail`,
    PREVIEW: (id: number) => `/files/${id}/preview`,
    PUBLIC: (id: number) => `/files/public/${id}`,
    MY_UPLOADS: '/files/my-uploads',
    TOGGLE_VISIBILITY: (id: number) => `/files/${id}/toggle-visibility`,
    DETACH: (id: number) => `/files/${id}/detach`,
  },

  // 태그 관련
  TAGS: {
    BASE: '/tags',
    BY_ID: (id: number) => `/tags/${id}`,
    BY_WORKSPACE: (workspaceId: number) => `/tags/workspace/${workspaceId}`,
    BY_NAME: (workspaceId: number, name: string) =>
      `/tags/workspace/${workspaceId}/name/${name}`,
    POPULAR: (workspaceId: number) => `/tags/workspace/${workspaceId}/popular`,
    UNUSED: (workspaceId: number) => `/tags/workspace/${workspaceId}/unused`,
    SYSTEM: (workspaceId: number) => `/tags/workspace/${workspaceId}/system`,
    SEARCH: (workspaceId: number) => `/tags/workspace/${workspaceId}/search`,
    BY_COLOR: (workspaceId: number, color: string) =>
      `/tags/workspace/${workspaceId}/color/${color.replace('#', '')}`,
    BY_PAGE: (pageId: number) => `/tags/page/${pageId}`,
    RECENT: (workspaceId: number) => `/tags/workspace/${workspaceId}/recent`,
    STATISTICS: (workspaceId: number) =>
      `/tags/workspace/${workspaceId}/statistics`,
    COUNT: (workspaceId: number) => `/tags/workspace/${workspaceId}/count`,

    // 태그 관리
    ADD_TO_PAGE: '/tags/page',
    REMOVE_FROM_PAGE: (pageId: number, tagId: number) =>
      `/tags/page/${pageId}/tag/${tagId}`,
    REMOVE_ALL_FROM_PAGE: (pageId: number) => `/tags/page/${pageId}`,
  },

  // 알림 관련
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id: number) => `/notifications/${id}`,
    MY: '/notifications/my',
    UNREAD: '/notifications/my/unread',
    UNREAD_COUNT: '/notifications/my/unread/count',
    HIGH_PRIORITY: '/notifications/my/high-priority',
    BY_TYPE: (type: string) => `/notifications/my/type/${type}`,
    DATE_RANGE: '/notifications/my/date-range',
    SYSTEM: '/notifications/my/system',
    BY_REFERENCE: '/notifications/my/reference',
    BY_SENDER: (senderId: number) => `/notifications/my/sender/${senderId}`,
    URGENT: '/notifications/my/urgent',
    RECENT: '/notifications/my/recent',
    STATISTICS: '/notifications/my/statistics',

    // 개별 알림 액션
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    MARK_UNREAD: (id: number) => `/notifications/${id}/unread`,
    DELETE_ONE: (id: number) => `/notifications/${id}`,

    // 일괄 액션
    READ_ALL: '/notifications/my/read-all',
    READ_BY_TYPE: (type: string) => `/notifications/my/read-by-type/${type}`,
    READ_BY_REFERENCE: '/notifications/my/read-by-reference',
    DELETE_ALL: '/notifications/my/all',
    DELETE_BY_TYPE: (type: string) => `/notifications/my/type/${type}`,

    // 특수 알림 생성
    WORKSPACE_INVITATION: '/notifications/workspace-invitation',
    PAGE_COMMENT: '/notifications/page-comment',
    COMMENT_REPLY: '/notifications/comment-reply',
    MENTION: '/notifications/mention',
    SYSTEM_ANNOUNCEMENT: '/notifications/system-announcement',
    SECURITY_ALERT: '/notifications/security-alert',
  },

  // 사용자 개별 페이지 쿼리
  USER_PAGES: {
    CREATED: '/users/pages/created',
    RECENT_MODIFIED: '/users/pages/recent-modified',
  },
} as const;

// URL 헬퍼 함수
// export function buildUrl(
//   endpoint: string,
//   params?: Record<string, any>
// ): string {
//   let url = `${API_CONFIG.BASE_URL}${endpoint}`;

//   if (params) {
//     const searchParams = new URLSearchParams();
//     Object.entries(params).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         searchParams.append(key, String(value));
//       }
//     });

//     const queryString = searchParams.toString();
//     if (queryString) {
//       url += `?${queryString}`;
//     }
//   }

//   return url;
// }
// URL 헬퍼 함수 (도메인별 분기 처리)
export function buildUrl(
  endpoint: string,
  params?: Record<string, any>
): string {
  // 동적으로 BASE_URL 결정
  const baseUrl = getApiBaseUrl();
  let url = `${baseUrl}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  return url;
}

// API 엔드포인트 타입 검증
export function isValidEndpoint(endpoint: string): boolean {
  return endpoint.startsWith('/') && endpoint.length > 1;
}
