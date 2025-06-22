/**
 * 페이지 관련 API 서비스
 */

import { api } from './client';
import { API_ENDPOINTS } from '@/lib/config/api-config';
import {
  PageCreateRequest,
  PageUpdateRequest,
  PageMoveRequest,
  PageDuplicateRequest,
  PageResponse,
  PageSummaryResponse,
  PageHistoryResponse,
  PageStatisticsResponse,
  SearchParams,
  ApiResponse,
} from '@/types';

export class PageApiService {
  // === 페이지 CRUD ===

  /**
   * 페이지 생성
   */
  async createPage(
    workspaceId: number,
    request: PageCreateRequest
  ): Promise<ApiResponse<PageResponse>> {
    return api.post<PageResponse>(
      API_ENDPOINTS.PAGES.BY_WORKSPACE(workspaceId),
      request
    );
  }

  /**
   * 워크스페이스의 모든 페이지 목록 조회
   */
  async getWorkspacePages(
    workspaceId: number
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(
      API_ENDPOINTS.PAGES.BY_WORKSPACE(workspaceId)
    );
  }

  /**
   * 최상위 페이지들 조회
   */
  async getRootPages(
    workspaceId: number
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(
      API_ENDPOINTS.PAGES.ROOT_PAGES(workspaceId)
    );
  }

  /**
   * 페이지 상세 조회
   */
  async getPage(
    workspaceId: number,
    pageId: number
  ): Promise<ApiResponse<PageResponse>> {
    return api.get<PageResponse>(
      API_ENDPOINTS.PAGES.BY_ID(workspaceId, pageId)
    );
  }

  /**
   * 자식 페이지들 조회
   */
  async getChildPages(
    workspaceId: number,
    pageId: number
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(
      API_ENDPOINTS.PAGES.CHILDREN(workspaceId, pageId)
    );
  }

  /**
   * 페이지 수정
   */
  async updatePage(
    workspaceId: number,
    pageId: number,
    request: PageUpdateRequest
  ): Promise<ApiResponse<PageResponse>> {
    return api.put<PageResponse>(
      API_ENDPOINTS.PAGES.BY_ID(workspaceId, pageId),
      request
    );
  }

  /**
   * 페이지 삭제
   */
  async deletePage(
    workspaceId: number,
    pageId: number
  ): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.PAGES.BY_ID(workspaceId, pageId));
  }

  // === 페이지 명령 ===

  /**
   * 페이지 이동
   */
  async movePage(
    workspaceId: number,
    pageId: number,
    request: PageMoveRequest
  ): Promise<ApiResponse<PageResponse>> {
    return api.put<PageResponse>(
      API_ENDPOINTS.PAGES.MOVE(workspaceId, pageId),
      request
    );
  }

  /**
   * 페이지 복제
   */
  async duplicatePage(
    workspaceId: number,
    pageId: number,
    request: PageDuplicateRequest
  ): Promise<ApiResponse<PageResponse>> {
    return api.post<PageResponse>(
      API_ENDPOINTS.PAGES.DUPLICATE(workspaceId, pageId),
      request
    );
  }

  /**
   * 페이지 공개/비공개 토글
   */
  async togglePageVisibility(
    workspaceId: number,
    pageId: number
  ): Promise<ApiResponse<PageResponse>> {
    return api.post<PageResponse>(
      API_ENDPOINTS.PAGES.TOGGLE_VISIBILITY(workspaceId, pageId)
    );
  }

  /**
   * 페이지 잠금/잠금 해제 토글
   */
  async togglePageLock(
    workspaceId: number,
    pageId: number
  ): Promise<ApiResponse<PageResponse>> {
    return api.post<PageResponse>(
      API_ENDPOINTS.PAGES.TOGGLE_LOCK(workspaceId, pageId)
    );
  }

  /**
   * 페이지 버전 복원
   */
  async restorePageVersion(
    workspaceId: number,
    pageId: number,
    version: number
  ): Promise<ApiResponse<PageResponse>> {
    return api.post<PageResponse>(
      API_ENDPOINTS.PAGES.RESTORE(workspaceId, pageId, version)
    );
  }

  // === 페이지 조회 및 검색 ===

  /**
   * 페이지 검색
   */
  async searchPages(
    workspaceId: number,
    params: SearchParams
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(
      API_ENDPOINTS.PAGES.SEARCH(workspaceId),
      { params }
    );
  }

  /**
   * 최근 수정된 페이지 목록
   */
  async getRecentlyModifiedPages(
    workspaceId: number,
    days: number = 7,
    limit: number = 10
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(
      API_ENDPOINTS.PAGES.RECENT(workspaceId),
      { params: { days, limit } }
    );
  }

  /**
   * 공개된 페이지 목록
   */
  async getPublishedPages(
    workspaceId: number
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(
      API_ENDPOINTS.PAGES.PUBLISHED(workspaceId)
    );
  }

  /**
   * 템플릿 페이지 목록
   */
  async getTemplatePages(
    workspaceId: number
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(
      API_ENDPOINTS.PAGES.TEMPLATES(workspaceId)
    );
  }

  /**
   * 페이지 타입별 조회
   */
  async getPagesByType(
    workspaceId: number,
    pageType: string
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(
      API_ENDPOINTS.PAGES.BY_TYPE(workspaceId, pageType)
    );
  }

  /**
   * 인기 페이지 목록
   */
  async getPopularPages(
    workspaceId: number,
    limit: number = 10
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(
      API_ENDPOINTS.PAGES.POPULAR(workspaceId),
      { params: { limit } }
    );
  }

  // === 페이지 히스토리 ===

  /**
   * 페이지 히스토리 조회
   */
  async getPageHistory(
    workspaceId: number,
    pageId: number,
    limit: number = 20
  ): Promise<ApiResponse<PageHistoryResponse[]>> {
    return api.get<PageHistoryResponse[]>(
      API_ENDPOINTS.PAGES.HISTORY(workspaceId, pageId),
      { params: { limit } }
    );
  }

  /**
   * 특정 버전의 페이지 히스토리 조회
   */
  async getPageHistoryVersion(
    workspaceId: number,
    pageId: number,
    version: number
  ): Promise<ApiResponse<PageHistoryResponse>> {
    return api.get<PageHistoryResponse>(
      API_ENDPOINTS.PAGES.HISTORY_VERSION(workspaceId, pageId, version)
    );
  }

  // === 페이지 통계 ===

  /**
   * 워크스페이스 페이지 통계
   */
  async getPageStatistics(
    workspaceId: number
  ): Promise<ApiResponse<PageStatisticsResponse>> {
    return api.get<PageStatisticsResponse>(
      API_ENDPOINTS.PAGES.STATISTICS(workspaceId)
    );
  }

  // === 사용자별 페이지 조회 ===

  /**
   * 내가 생성한 페이지 목록
   */
  async getMyCreatedPages(
    limit: number = 20
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(API_ENDPOINTS.USER_PAGES.CREATED, {
      params: { limit },
    });
  }

  /**
   * 내가 최근 수정한 페이지 목록
   */
  async getMyRecentlyModifiedPages(
    limit: number = 20
  ): Promise<ApiResponse<PageSummaryResponse[]>> {
    return api.get<PageSummaryResponse[]>(
      API_ENDPOINTS.USER_PAGES.RECENT_MODIFIED,
      { params: { limit } }
    );
  }
}

// 싱글톤 인스턴스 생성
export const pageApi = new PageApiService();
