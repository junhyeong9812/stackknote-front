/**
 * 페이지 관련 타입 정의
 */

import { UserResponse } from './user';

// 페이지 타입
export type PageType = 'DOCUMENT' | 'DATABASE' | 'KANBAN' | 'CALENDAR';

// 페이지 생성 요청
export interface PageCreateRequest {
  title: string;
  content?: string;
  icon?: string;
  coverImageUrl?: string;
  parentId?: number;
  pageType?: PageType;
  isPublished?: boolean;
  isTemplate?: boolean;
  sortOrder?: number;
}

// 페이지 수정 요청
export interface PageUpdateRequest {
  title?: string;
  content?: string;
  icon?: string;
  coverImageUrl?: string;
  pageType?: PageType;
  isPublished?: boolean;
  isTemplate?: boolean;
  isLocked?: boolean;
  sortOrder?: number;
}

// 페이지 이동 요청
export interface PageMoveRequest {
  newParentId?: number;
  newSortOrder?: number;
}

// 페이지 복제 요청
export interface PageDuplicateRequest {
  newTitle?: string;
  newParentId?: number;
  includeChildren?: boolean;
  resetViewCount?: boolean;
}

// 페이지 상세 응답
export interface PageResponse {
  id: number;
  title: string;
  content?: string;
  summary?: string;
  icon?: string;
  coverImageUrl?: string;
  workspaceId: number;
  workspaceName: string;
  parentId?: number;
  parentTitle?: string;
  createdBy: UserResponse;
  lastModifiedBy?: UserResponse;
  isPublished: boolean;
  isTemplate: boolean;
  isLocked: boolean;
  sortOrder: number;
  viewCount: number;
  pageType: PageType;
  depth: number;
  hasChildren: boolean;
  createdAt: string;
  updatedAt: string;
}

// 페이지 요약 응답 (목록용)
export interface PageSummaryResponse {
  id: number;
  title: string;
  summary?: string;
  icon?: string;
  coverImageUrl?: string;
  parentId?: number;
  createdByName: string;
  lastModifiedByName?: string;
  isPublished: boolean;
  isTemplate: boolean;
  isLocked: boolean;
  sortOrder: number;
  viewCount: number;
  pageType: PageType;
  depth: number;
  hasChildren: boolean;
  createdAt: string;
  updatedAt: string;
}

// 페이지 히스토리 응답
export interface PageHistoryResponse {
  id: number;
  version: number;
  title: string;
  content: string;
  modifiedBy: UserResponse;
  changeDescription?: string;
  createdAt: string;
}

// 페이지 통계 응답
export interface PageStatisticsResponse {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  templatePages: number;
  totalViews: number;
  averageViews: number;
}

// 페이지 트리 노드 (계층 구조용)
export interface PageTreeNode {
  id: number;
  title: string;
  icon?: string;
  parentId?: number;
  depth: number;
  sortOrder: number;
  hasChildren: boolean;
  isExpanded?: boolean;
  children?: PageTreeNode[];

  // UI 상태
  isSelected?: boolean;
  isLoading?: boolean;
  isDragging?: boolean;
}

// 페이지 권한
export interface PagePermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canShare: boolean;
  canComment: boolean;
}

// 페이지 검색 결과
export interface PageSearchResult {
  page: PageSummaryResponse;
  highlights: {
    title?: string;
    content?: string;
  };
  relevanceScore: number;
}
