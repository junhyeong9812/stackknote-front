/**
 * 사이드바 관련 타입 정의
 */

import { PageTreeNode } from './page';

// 사이드바 전체 구조
export interface WorkspaceSidebarResponse {
  personalSpace?: PersonalSpaceResponse;
  teamSpaces: TeamSpaceResponse[];
  recentPages: RecentPageResponse[];
  favoritePages: FavoritePageResponse[];
}

// 개인 공간
export interface PersonalSpaceResponse {
  workspaceId: number;
  name: string;
  icon?: string;
  pages: PageTreeResponse[];
  totalPageCount: number;
}

// 팀 스페이스
export interface TeamSpaceResponse {
  workspaceId: number;
  name: string;
  icon?: string;
  description?: string;
  visibility: 'PUBLIC' | 'PRIVATE';
  memberCount: number;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  pages: PageTreeResponse[];
  totalPageCount: number;
}

// 페이지 트리 응답
export interface PageTreeResponse {
  id: number;
  title: string;
  icon?: string;
  parentId?: number;
  depth: number;
  sortOrder: number;
  hasChildren: boolean;
  isPublished: boolean;
  isLocked: boolean;
  children: PageTreeResponse[];
}

// 최근 방문 페이지
export interface RecentPageResponse {
  pageId: number;
  title: string;
  icon?: string;
  workspaceId: number;
  workspaceName: string;
  lastVisitedAt: string;
}

// 즐겨찾기 페이지
export interface FavoritePageResponse {
  pageId: number;
  title: string;
  icon?: string;
  workspaceId: number;
  workspaceName: string;
  favoritedAt: string;
}

// 사이드바 액션 타입
export type SidebarActionType = 
  | 'CREATE_PAGE'
  | 'DELETE_PAGE'
  | 'RENAME_PAGE'
  | 'MOVE_PAGE'
  | 'DUPLICATE_PAGE'
  | 'TOGGLE_FAVORITE'
  | 'EXPORT_PAGE'
  | 'IMPORT_PAGE'
  | 'PAGE_SETTINGS';

// 사이드바 섹션 타입
export type SidebarSection = 
  | 'FAVORITES'
  | 'RECENT'
  | 'PERSONAL'
  | 'TEAMSPACES'
  | 'SHARED'
  | 'TRASH';

// 사이드바 UI 상태
export interface SidebarUIState {
  expandedSections: Set<SidebarSection>;
  expandedWorkspaces: Set<number>;
  expandedPages: Set<number>;
  selectedPageId: number | null;
  selectedWorkspaceId: number | null;
  isDragging: boolean;
  draggedItem: {
    type: 'page' | 'workspace';
    id: number;
  } | null;
}