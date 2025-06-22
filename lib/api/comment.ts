/**
 * 댓글 관련 API 서비스
 */

import { api } from './client';
import { API_ENDPOINTS } from '@/lib/config/api-config';
import {
  CommentCreateRequest,
  CommentUpdateRequest,
  CommentResponse,
  CommentSummaryResponse,
  PaginationParams,
  DateRangeParams,
  ApiResponse,
} from '@/types';

export class CommentApiService {
  // === 댓글 CRUD ===

  /**
   * 댓글 생성
   */
  async createComment(
    request: CommentCreateRequest
  ): Promise<ApiResponse<CommentResponse>> {
    return api.post<CommentResponse>(API_ENDPOINTS.COMMENTS.BASE, request);
  }

  /**
   * 댓글 상세 조회
   */
  async getComment(commentId: number): Promise<ApiResponse<CommentResponse>> {
    return api.get<CommentResponse>(API_ENDPOINTS.COMMENTS.BY_ID(commentId));
  }

  /**
   * 댓글 수정
   */
  async updateComment(
    commentId: number,
    request: CommentUpdateRequest
  ): Promise<ApiResponse<CommentResponse>> {
    return api.put<CommentResponse>(
      API_ENDPOINTS.COMMENTS.BY_ID(commentId),
      request
    );
  }

  /**
   * 댓글 삭제
   */
  async deleteComment(commentId: number): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.COMMENTS.BY_ID(commentId));
  }

  // === 댓글 조회 ===

  /**
   * 페이지의 댓글 목록 조회
   */
  async getCommentsByPage(
    pageId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<CommentResponse[]>> {
    return api.get<CommentResponse[]>(API_ENDPOINTS.COMMENTS.BY_PAGE(pageId), {
      params,
    });
  }

  /**
   * 대댓글 목록 조회
   */
  async getReplies(commentId: number): Promise<ApiResponse<CommentResponse[]>> {
    return api.get<CommentResponse[]>(
      API_ENDPOINTS.COMMENTS.REPLIES(commentId)
    );
  }

  /**
   * 페이지의 댓글 수 조회
   */
  async getCommentCount(pageId: number): Promise<ApiResponse<number>> {
    return api.get<number>(API_ENDPOINTS.COMMENTS.COUNT(pageId));
  }

  /**
   * 사용자 댓글 목록 조회
   */
  async getCommentsByUser(
    userId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<CommentSummaryResponse[]>> {
    return api.get<CommentSummaryResponse[]>(
      API_ENDPOINTS.COMMENTS.BY_USER(userId),
      { params }
    );
  }

  /**
   * 기간별 댓글 조회
   */
  async getCommentsByDateRange(
    pageId: number,
    dateRange: DateRangeParams
  ): Promise<ApiResponse<CommentSummaryResponse[]>> {
    return api.get<CommentSummaryResponse[]>(
      API_ENDPOINTS.COMMENTS.DATE_RANGE(pageId),
      { params: dateRange }
    );
  }

  /**
   * 최근 댓글 조회
   */
  async getRecentComments(
    params?: PaginationParams
  ): Promise<ApiResponse<CommentSummaryResponse[]>> {
    return api.get<CommentSummaryResponse[]>(API_ENDPOINTS.COMMENTS.RECENT, {
      params,
    });
  }

  /**
   * 워크스페이스 최근 댓글 조회
   */
  async getRecentCommentsByWorkspace(
    workspaceId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<CommentSummaryResponse[]>> {
    return api.get<CommentSummaryResponse[]>(
      API_ENDPOINTS.COMMENTS.BY_WORKSPACE(workspaceId),
      { params }
    );
  }

  /**
   * 인기 댓글 조회
   */
  async getPopularComments(
    pageId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<CommentResponse[]>> {
    return api.get<CommentResponse[]>(API_ENDPOINTS.COMMENTS.POPULAR(pageId), {
      params,
    });
  }

  /**
   * 멘션 댓글 조회
   */
  async getCommentsWithMentions(
    params?: PaginationParams
  ): Promise<ApiResponse<CommentSummaryResponse[]>> {
    return api.get<CommentSummaryResponse[]>(API_ENDPOINTS.COMMENTS.MENTIONS, {
      params,
    });
  }

  /**
   * 사용자 멘션 댓글 조회
   */
  async getCommentsByMentionedUser(
    username: string,
    params?: PaginationParams
  ): Promise<ApiResponse<CommentSummaryResponse[]>> {
    return api.get<CommentSummaryResponse[]>(
      API_ENDPOINTS.COMMENTS.MENTIONS_USER(username),
      { params }
    );
  }

  /**
   * 댓글 검색
   */
  async searchComments(
    pageId: number,
    keyword: string
  ): Promise<ApiResponse<CommentResponse[]>> {
    return api.get<CommentResponse[]>(API_ENDPOINTS.COMMENTS.SEARCH(pageId), {
      params: { keyword },
    });
  }

  // === 댓글 액션 ===

  /**
   * 댓글 좋아요
   */
  async likeComment(commentId: number): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.COMMENTS.LIKE(commentId));
  }

  /**
   * 댓글 좋아요 취소
   */
  async unlikeComment(commentId: number): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.COMMENTS.LIKE(commentId));
  }
}

// 싱글톤 인스턴스 생성
export const commentApi = new CommentApiService();
