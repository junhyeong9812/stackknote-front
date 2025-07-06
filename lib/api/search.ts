/**
 * 검색 관련 API 서비스
 */

import { api } from './client';
import {
  GlobalSearchResponse,
  SearchSuggestion,
  SearchType,
  ApiResponse,
} from '@/types';

export class SearchApiService {
  /**
   * 전역 검색
   */
  async search(
    query: string,
    workspaceId?: number,
    type: SearchType = SearchType.ALL
  ): Promise<ApiResponse<GlobalSearchResponse>> {
    return api.get<GlobalSearchResponse>('/search', {
      params: {
        query,
        workspaceId,
        type,
      },
    });
  }

  /**
   * 검색 제안
   */
  async getSuggestions(
    query: string,
    limit: number = 10
  ): Promise<ApiResponse<SearchSuggestion[]>> {
    return api.get<SearchSuggestion[]>('/search/suggestions', {
      params: {
        query,
        limit,
      },
    });
  }
}

// 싱글톤 인스턴스 생성
export const searchApi = new SearchApiService();