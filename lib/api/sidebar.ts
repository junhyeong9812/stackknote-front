/**
 * 사이드바 관련 API 서비스
 */

import { api } from './client';
import { API_ENDPOINTS } from '@/lib/config/api-config';
import {
  WorkspaceSidebarResponse,
  PageTreeResponse,
  RecentPageResponse,
  FavoritePageResponse,
  ApiResponse,
} from '@/types';

export class SidebarApiService {
  /**
   * 사이드바 전체 트리 조회
   */
  async getSidebarTree(): Promise<ApiResponse<WorkspaceSidebarResponse>> {
    return api.get<WorkspaceSidebarResponse>('/workspaces/sidebar/tree');
  }

  /**
   * 워크스페이스별 페이지 트리 조회 (지연 로딩)
   */
  async getWorkspacePageTree(
    workspaceId: number
  ): Promise<ApiResponse<PageTreeResponse[]>> {
    return api.get<PageTreeResponse[]>(
      `/workspaces/${workspaceId}/sidebar/pages`
    );
  }

  /**
   * 최근 방문 페이지 목록
   */
  async getRecentPages(
    limit: number = 5
  ): Promise<ApiResponse<RecentPageResponse[]>> {
    return api.get<RecentPageResponse[]>('/workspaces/sidebar/recent-pages', {
      params: { limit },
    });
  }

  /**
   * 즐겨찾기 페이지 목록
   */
  async getFavoritePages(): Promise<ApiResponse<FavoritePageResponse[]>> {
    return api.get<FavoritePageResponse[]>('/workspaces/sidebar/favorite-pages');
  }

  /**
   * 페이지 즐겨찾기 토글
   */
  async toggleFavorite(pageId: number): Promise<ApiResponse<boolean>> {
    return api.post<boolean>(`/pages/${pageId}/favorite`);
  }

  /**
   * 페이지 방문 기록
   */
  async recordPageVisit(pageId: number): Promise<ApiResponse<void>> {
    return api.post<void>(`/pages/${pageId}/visit`);
  }
}

// 싱글톤 인스턴스 생성
export const sidebarApi = new SidebarApiService();