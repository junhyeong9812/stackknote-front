/**
 * 워크스페이스 관련 API 서비스
 */

import { api } from './client';
import { API_ENDPOINTS } from '@/lib/config/api-config';
import {
  WorkspaceCreateRequest,
  WorkspaceUpdateRequest,
  MemberInviteRequest,
  MemberRoleUpdateRequest,
  WorkspaceResponse,
  WorkspaceSummaryResponse,
  WorkspaceMemberResponse,
  WorkspaceStatisticsResponse,
  PaginatedResponse,
  PaginationParams,
  SearchParams,
  ApiResponse,
} from '@/types';

export class WorkspaceApiService {
  // === 워크스페이스 관리 ===

  /**
   * 워크스페이스 생성
   */
  async createWorkspace(
    request: WorkspaceCreateRequest
  ): Promise<ApiResponse<WorkspaceResponse>> {
    return api.post<WorkspaceResponse>(API_ENDPOINTS.WORKSPACES.BASE, request);
  }

  /**
   * 내 워크스페이스 목록 조회
   */
  async getMyWorkspaces(): Promise<ApiResponse<WorkspaceSummaryResponse[]>> {
    return api.get<WorkspaceSummaryResponse[]>(API_ENDPOINTS.WORKSPACES.MY);
  }

  /**
   * 워크스페이스 상세 조회
   */
  async getWorkspace(
    workspaceId: number
  ): Promise<ApiResponse<WorkspaceResponse>> {
    return api.get<WorkspaceResponse>(
      API_ENDPOINTS.WORKSPACES.BY_ID(workspaceId)
    );
  }

  /**
   * 워크스페이스 수정
   */
  async updateWorkspace(
    workspaceId: number,
    request: WorkspaceUpdateRequest
  ): Promise<ApiResponse<WorkspaceResponse>> {
    return api.put<WorkspaceResponse>(
      API_ENDPOINTS.WORKSPACES.BY_ID(workspaceId),
      request
    );
  }

  /**
   * 워크스페이스 삭제
   */
  async deleteWorkspace(workspaceId: number): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.WORKSPACES.BY_ID(workspaceId));
  }

  /**
   * 워크스페이스 검색
   */
  async searchWorkspaces(
    params: SearchParams
  ): Promise<ApiResponse<WorkspaceSummaryResponse[]>> {
    return api.get<WorkspaceSummaryResponse[]>(
      API_ENDPOINTS.WORKSPACES.SEARCH,
      {
        params,
      }
    );
  }

  /**
   * 공개 워크스페이스 목록 조회
   */
  async getPublicWorkspaces(
    params: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<WorkspaceResponse>>> {
    return api.get<PaginatedResponse<WorkspaceResponse>>(
      API_ENDPOINTS.WORKSPACES.PUBLIC,
      {
        params,
      }
    );
  }

  /**
   * 워크스페이스 통계 조회
   */
  async getWorkspaceStatistics(): Promise<
    ApiResponse<WorkspaceStatisticsResponse>
  > {
    return api.get<WorkspaceStatisticsResponse>(
      API_ENDPOINTS.WORKSPACES.STATISTICS
    );
  }

  // === 멤버 관리 ===

  /**
   * 워크스페이스 멤버 목록 조회
   */
  async getWorkspaceMembers(
    workspaceId: number
  ): Promise<ApiResponse<WorkspaceMemberResponse[]>> {
    return api.get<WorkspaceMemberResponse[]>(
      API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceId)
    );
  }

  /**
   * 워크스페이스 멤버 목록 조회 (페이징)
   */
  async getWorkspaceMembersPaged(
    workspaceId: number,
    params: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<WorkspaceMemberResponse>>> {
    return api.get<PaginatedResponse<WorkspaceMemberResponse>>(
      `${API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceId)}/paged`,
      { params }
    );
  }

  /**
   * 멤버 초대
   */
  async inviteMember(
    workspaceId: number,
    request: MemberInviteRequest
  ): Promise<ApiResponse<WorkspaceMemberResponse>> {
    return api.post<WorkspaceMemberResponse>(
      API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceId),
      request
    );
  }

  /**
   * 멤버 역할 변경
   */
  async updateMemberRole(
    workspaceId: number,
    memberId: number,
    request: MemberRoleUpdateRequest
  ): Promise<ApiResponse<WorkspaceMemberResponse>> {
    return api.put<WorkspaceMemberResponse>(
      API_ENDPOINTS.WORKSPACES.MEMBER_ROLE(workspaceId, memberId),
      request
    );
  }

  /**
   * 멤버 제거
   */
  async removeMember(
    workspaceId: number,
    memberId: number
  ): Promise<ApiResponse<void>> {
    return api.delete<void>(
      API_ENDPOINTS.WORKSPACES.MEMBER_BY_ID(workspaceId, memberId)
    );
  }

  /**
   * 워크스페이스 나가기
   */
  async leaveWorkspace(workspaceId: number): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.WORKSPACES.LEAVE(workspaceId));
  }

  // === 초대 코드 관리 ===

  /**
   * 초대 코드 생성
   */
  async generateInviteCode(workspaceId: number): Promise<ApiResponse<string>> {
    return api.post<string>(API_ENDPOINTS.WORKSPACES.INVITE_CODE(workspaceId));
  }

  /**
   * 초대 코드 제거
   */
  async removeInviteCode(workspaceId: number): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.WORKSPACES.INVITE_CODE(workspaceId));
  }

  /**
   * 초대 코드로 워크스페이스 참가
   */
  async joinWorkspaceByInviteCode(
    inviteCode: string
  ): Promise<ApiResponse<WorkspaceResponse>> {
    return api.post<WorkspaceResponse>(
      API_ENDPOINTS.WORKSPACES.JOIN(inviteCode)
    );
  }

  /**
   * 초대 코드로 워크스페이스 미리보기
   */
  async previewWorkspaceByInviteCode(
    inviteCode: string
  ): Promise<ApiResponse<WorkspaceResponse>> {
    return api.get<WorkspaceResponse>(
      API_ENDPOINTS.WORKSPACES.PREVIEW(inviteCode)
    );
  }
}

// 싱글톤 인스턴스 생성
export const workspaceApi = new WorkspaceApiService();
