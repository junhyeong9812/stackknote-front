/**
 * 태그 관련 API 서비스
 */

import { api } from './client';
import { API_ENDPOINTS } from '@/lib/config/api-config';
import {
  TagCreateRequest,
  TagUpdateRequest,
  TagAddToPageRequest,
  TagResponse,
  TagSummaryResponse,
  TagStatisticsResponse,
  ApiResponse,
} from '@/types';

export class TagApiService {
  // === 태그 CRUD ===

  /**
   * 태그 생성
   */
  async createTag(
    request: TagCreateRequest
  ): Promise<ApiResponse<TagResponse>> {
    return api.post<TagResponse>(API_ENDPOINTS.TAGS.BASE, request);
  }

  /**
   * 태그 상세 조회
   */
  async getTag(tagId: number): Promise<ApiResponse<TagResponse>> {
    return api.get<TagResponse>(API_ENDPOINTS.TAGS.BY_ID(tagId));
  }

  /**
   * 태그 수정
   */
  async updateTag(
    tagId: number,
    request: TagUpdateRequest
  ): Promise<ApiResponse<TagResponse>> {
    return api.put<TagResponse>(API_ENDPOINTS.TAGS.BY_ID(tagId), request);
  }

  /**
   * 태그 삭제
   */
  async deleteTag(tagId: number): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.TAGS.BY_ID(tagId));
  }

  // === 태그 조회 ===

  /**
   * 워크스페이스 태그 목록 조회
   */
  async getTagsByWorkspace(
    workspaceId: number,
    sort: 'usage' | 'name' = 'usage'
  ): Promise<ApiResponse<TagResponse[]>> {
    return api.get<TagResponse[]>(
      API_ENDPOINTS.TAGS.BY_WORKSPACE(workspaceId),
      { params: { sort } }
    );
  }

  /**
   * 태그 이름으로 조회
   */
  async getTagByName(
    workspaceId: number,
    tagName: string
  ): Promise<ApiResponse<TagResponse>> {
    return api.get<TagResponse>(
      API_ENDPOINTS.TAGS.BY_NAME(workspaceId, tagName)
    );
  }

  /**
   * 인기 태그 조회
   */
  async getPopularTags(
    workspaceId: number,
    size: number = 10
  ): Promise<ApiResponse<TagSummaryResponse[]>> {
    return api.get<TagSummaryResponse[]>(
      API_ENDPOINTS.TAGS.POPULAR(workspaceId),
      { params: { size } }
    );
  }

  /**
   * 사용되지 않는 태그 조회
   */
  async getUnusedTags(
    workspaceId: number
  ): Promise<ApiResponse<TagResponse[]>> {
    return api.get<TagResponse[]>(API_ENDPOINTS.TAGS.UNUSED(workspaceId));
  }

  /**
   * 시스템 태그 조회
   */
  async getSystemTags(
    workspaceId: number
  ): Promise<ApiResponse<TagResponse[]>> {
    return api.get<TagResponse[]>(API_ENDPOINTS.TAGS.SYSTEM(workspaceId));
  }

  /**
   * 태그 검색
   */
  async searchTags(
    workspaceId: number,
    keyword: string
  ): Promise<ApiResponse<TagResponse[]>> {
    return api.get<TagResponse[]>(API_ENDPOINTS.TAGS.SEARCH(workspaceId), {
      params: { keyword },
    });
  }

  /**
   * 색상별 태그 조회
   */
  async getTagsByColor(
    workspaceId: number,
    color: string
  ): Promise<ApiResponse<TagResponse[]>> {
    // # 제거하고 전송
    const cleanColor = color.replace('#', '');
    return api.get<TagResponse[]>(
      API_ENDPOINTS.TAGS.BY_COLOR(workspaceId, cleanColor)
    );
  }

  /**
   * 페이지의 태그 조회
   */
  async getTagsByPage(
    pageId: number
  ): Promise<ApiResponse<TagSummaryResponse[]>> {
    return api.get<TagSummaryResponse[]>(API_ENDPOINTS.TAGS.BY_PAGE(pageId));
  }

  /**
   * 최근 생성된 태그 조회
   */
  async getRecentTags(
    workspaceId: number,
    size: number = 10
  ): Promise<ApiResponse<TagResponse[]>> {
    return api.get<TagResponse[]>(API_ENDPOINTS.TAGS.RECENT(workspaceId), {
      params: { size },
    });
  }

  // === 태그 통계 ===

  /**
   * 태그 통계 조회
   */
  async getTagStatistics(
    workspaceId: number
  ): Promise<ApiResponse<TagStatisticsResponse>> {
    return api.get<TagStatisticsResponse>(
      API_ENDPOINTS.TAGS.STATISTICS(workspaceId)
    );
  }

  /**
   * 태그 개수 조회
   */
  async getTagCount(workspaceId: number): Promise<ApiResponse<number>> {
    return api.get<number>(API_ENDPOINTS.TAGS.COUNT(workspaceId));
  }

  // === 페이지 태그 관리 ===

  /**
   * 페이지에 태그 추가
   */
  async addTagsToPage(
    request: TagAddToPageRequest
  ): Promise<ApiResponse<TagResponse[]>> {
    return api.post<TagResponse[]>(API_ENDPOINTS.TAGS.ADD_TO_PAGE, request);
  }

  /**
   * 페이지에서 태그 제거
   */
  async removeTagFromPage(
    pageId: number,
    tagId: number
  ): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.TAGS.REMOVE_FROM_PAGE(pageId, tagId));
  }

  /**
   * 페이지의 모든 태그 제거
   */
  async removeAllTagsFromPage(pageId: number): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.TAGS.REMOVE_ALL_FROM_PAGE(pageId));
  }

  // === 태그 유틸리티 ===

  /**
   * 태그 색상 생성 (랜덤)
   */
  generateRandomColor(): string {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E9',
      '#F8C471',
      '#82E0AA',
      '#F1948A',
      '#AED6F1',
    ] as const;

    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex] ?? '#FF6B6B'; // 확실한 fallback
  }

  /**
   * 태그 이름 유효성 검사
   */
  isValidTagName(name: string): boolean {
    // 1-50자, 쉼표 제외
    return name.length >= 1 && name.length <= 50 && !name.includes(',');
  }

  /**
   * 색상 코드 유효성 검사
   */
  isValidColor(color: string): boolean {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexRegex.test(color);
  }

  /**
   * 태그 이름 배열을 문자열로 변환
   */
  tagNamesToString(tagNames: string[]): string {
    return tagNames.join(', ');
  }

  /**
   * 태그 문자열을 이름 배열로 변환
   */
  stringToTagNames(tagString: string): string[] {
    if (!tagString || tagString.trim() === '') return [];

    return tagString
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0);
  }

  /**
   * 태그 사용량에 따른 가중치 계산
   */
  calculateTagWeight(usageCount: number, maxUsage: number): number {
    if (maxUsage === 0) return 1;
    return Math.max(0.5, usageCount / maxUsage);
  }

  /**
   * 태그 클라우드용 폰트 크기 계산
   */
  calculateTagFontSize(
    weight: number,
    minSize: number = 12,
    maxSize: number = 24
  ): number {
    return Math.round(minSize + (maxSize - minSize) * weight);
  }
}

// 싱글톤 인스턴스 생성
export const tagApi = new TagApiService();
