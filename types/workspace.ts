/**
 * 워크스페이스 관련 타입 정의
 */

import { UserResponse } from './user';

// 워크스페이스 가시성
export type WorkspaceVisibility = 'PUBLIC' | 'PRIVATE';

// 워크스페이스 멤버 역할
export type WorkspaceMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

// 워크스페이스 생성 요청
export interface WorkspaceCreateRequest {
  name: string;
  description?: string;
  icon?: string;
  coverImageUrl?: string;
  visibility?: WorkspaceVisibility;
}

// 워크스페이스 수정 요청
export interface WorkspaceUpdateRequest {
  name?: string;
  description?: string;
  icon?: string;
  coverImageUrl?: string;
  visibility?: WorkspaceVisibility;
}

// 워크스페이스 응답
export interface WorkspaceResponse {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  coverImageUrl?: string;
  owner: UserResponse;
  visibility: WorkspaceVisibility;
  isActive: boolean;
  inviteCode?: string;
  createdAt: string;
  updatedAt: string;

  // 현재 사용자의 권한 정보
  currentUserRole?: WorkspaceMemberRole;
  canRead: boolean;
  canWrite: boolean;
  canManage: boolean;
}

// 워크스페이스 요약 응답 (목록용)
export interface WorkspaceSummaryResponse {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  coverImageUrl?: string;
  ownerName: string;
  visibility: WorkspaceVisibility;
  isActive: boolean;
  currentUserRole?: WorkspaceMemberRole;
  memberCount: number;
  pageCount: number;
}

// 멤버 초대 요청
export interface MemberInviteRequest {
  email: string;
  role: Exclude<WorkspaceMemberRole, 'OWNER'>;
  message?: string;
}

// 멤버 역할 변경 요청
export interface MemberRoleUpdateRequest {
  role: Exclude<WorkspaceMemberRole, 'OWNER'>;
}

// 워크스페이스 멤버 응답
export interface WorkspaceMemberResponse {
  id: number;
  user: UserResponse;
  role: WorkspaceMemberRole;
  isActive: boolean;
  invitedBy?: UserResponse;
  joinedAt: string;
}

// 워크스페이스 통계
export interface WorkspaceStatisticsResponse {
  totalWorkspaces: number;
  ownedWorkspaces: number;
  sharedWorkspaces: number;
  totalPages: number;
  totalMembers: number;
}

// 워크스페이스 설정
export interface WorkspaceSettings {
  allowPublicPages: boolean;
  allowGuestComments: boolean;
  defaultPageVisibility: 'PUBLIC' | 'PRIVATE';
  enableNotifications: boolean;
  maxFileSize: number;
}

// 워크스페이스 초대 정보
export interface WorkspaceInvite {
  code: string;
  workspace: WorkspaceResponse;
  invitedBy: UserResponse;
  expiresAt?: string;
  isValid: boolean;
}
