/**
 * 워크스페이스 상태 관리 Store (Zustand)
 */

import { create } from 'zustand';
import {
  WorkspaceResponse,
  WorkspaceSummaryResponse,
  WorkspaceCreateRequest,
  WorkspaceUpdateRequest,
  WorkspaceMemberResponse,
  MemberInviteRequest,
  MemberRoleUpdateRequest,
} from '@/types';
import { workspaceApi } from '@/lib/api';

interface WorkspaceState {
  // Current workspace
  currentWorkspace: WorkspaceResponse | null;

  // User's workspaces
  myWorkspaces: WorkspaceSummaryResponse[];

  // Current workspace members
  members: WorkspaceMemberResponse[];

  // Loading states
  isLoading: boolean;
  isMembersLoading: boolean;
  isCreating: boolean;

  // Error states
  error: string | null;
  membersError: string | null;
}

interface WorkspaceActions {
  // Workspace management
  fetchMyWorkspaces: () => Promise<void>;
  createWorkspace: (data: WorkspaceCreateRequest) => Promise<WorkspaceResponse>;
  updateWorkspace: (id: number, data: WorkspaceUpdateRequest) => Promise<void>;
  deleteWorkspace: (id: number) => Promise<void>;

  // Current workspace
  setCurrentWorkspace: (workspace: WorkspaceResponse | null) => void;
  fetchWorkspace: (id: number) => Promise<void>;

  // Member management
  fetchMembers: (workspaceId: number) => Promise<void>;
  inviteMember: (
    workspaceId: number,
    data: MemberInviteRequest
  ) => Promise<void>;
  updateMemberRole: (
    workspaceId: number,
    memberId: number,
    data: MemberRoleUpdateRequest
  ) => Promise<void>;
  removeMember: (workspaceId: number, memberId: number) => Promise<void>;
  leaveWorkspace: (workspaceId: number) => Promise<void>;

  // Invite codes
  generateInviteCode: (workspaceId: number) => Promise<string>;
  removeInviteCode: (workspaceId: number) => Promise<void>;
  joinByInviteCode: (code: string) => Promise<WorkspaceResponse>;

  // Error handling
  clearError: () => void;
  clearMembersError: () => void;
}

interface WorkspaceStore extends WorkspaceState, WorkspaceActions {}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  // Initial state
  currentWorkspace: null,
  myWorkspaces: [],
  members: [],
  isLoading: false,
  isMembersLoading: false,
  isCreating: false,
  error: null,
  membersError: null,

  // Workspace management
  fetchMyWorkspaces: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await workspaceApi.getMyWorkspaces();
      set({ myWorkspaces: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || '워크스페이스 목록을 불러오는데 실패했습니다.',
        isLoading: false,
      });
    }
  },

  createWorkspace: async (data: WorkspaceCreateRequest) => {
    try {
      set({ isCreating: true, error: null });
      const response = await workspaceApi.createWorkspace(data);
      const newWorkspace = response.data;

      // 내 워크스페이스 목록에 추가
      const { myWorkspaces } = get();
      const newSummary: WorkspaceSummaryResponse = {
        id: newWorkspace.id,
        name: newWorkspace.name,
        description: newWorkspace.description,
        icon: newWorkspace.icon,
        coverImageUrl: newWorkspace.coverImageUrl,
        ownerName: newWorkspace.owner.username,
        visibility: newWorkspace.visibility,
        isActive: newWorkspace.isActive,
        currentUserRole: 'OWNER',
        memberCount: 1,
        pageCount: 0,
      };

      set({
        myWorkspaces: [newSummary, ...myWorkspaces],
        isCreating: false,
      });

      return newWorkspace;
    } catch (error: any) {
      set({
        error: error.message || '워크스페이스 생성에 실패했습니다.',
        isCreating: false,
      });
      throw error;
    }
  },

  updateWorkspace: async (id: number, data: WorkspaceUpdateRequest) => {
    try {
      set({ error: null });
      const response = await workspaceApi.updateWorkspace(id, data);
      const updatedWorkspace = response.data;

      // 현재 워크스페이스 업데이트
      const { currentWorkspace } = get();
      if (currentWorkspace?.id === id) {
        set({ currentWorkspace: updatedWorkspace });
      }

      // 내 워크스페이스 목록에서 업데이트
      const { myWorkspaces } = get();
      const updatedWorkspaces = myWorkspaces.map(ws =>
        ws.id === id
          ? {
              ...ws,
              name: updatedWorkspace.name,
              description: updatedWorkspace.description,
            }
          : ws
      );
      set({ myWorkspaces: updatedWorkspaces });
    } catch (error: any) {
      set({ error: error.message || '워크스페이스 수정에 실패했습니다.' });
      throw error;
    }
  },

  deleteWorkspace: async (id: number) => {
    try {
      set({ error: null });
      await workspaceApi.deleteWorkspace(id);

      // 목록에서 제거
      const { myWorkspaces, currentWorkspace } = get();
      const updatedWorkspaces = myWorkspaces.filter(ws => ws.id !== id);
      set({ myWorkspaces: updatedWorkspaces });

      // 현재 워크스페이스가 삭제된 경우 초기화
      if (currentWorkspace?.id === id) {
        set({ currentWorkspace: null, members: [] });
      }
    } catch (error: any) {
      set({ error: error.message || '워크스페이스 삭제에 실패했습니다.' });
      throw error;
    }
  },

  // Current workspace
  setCurrentWorkspace: (workspace: WorkspaceResponse | null) => {
    set({ currentWorkspace: workspace });
  },

  fetchWorkspace: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const response = await workspaceApi.getWorkspace(id);
      set({ currentWorkspace: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || '워크스페이스 정보를 불러오는데 실패했습니다.',
        isLoading: false,
      });
    }
  },

  // Member management
  fetchMembers: async (workspaceId: number) => {
    try {
      set({ isMembersLoading: true, membersError: null });
      const response = await workspaceApi.getWorkspaceMembers(workspaceId);
      set({ members: response.data, isMembersLoading: false });
    } catch (error: any) {
      set({
        membersError: error.message || '멤버 목록을 불러오는데 실패했습니다.',
        isMembersLoading: false,
      });
    }
  },

  inviteMember: async (workspaceId: number, data: MemberInviteRequest) => {
    try {
      set({ membersError: null });
      const response = await workspaceApi.inviteMember(workspaceId, data);
      const newMember = response.data;

      const { members } = get();
      set({ members: [...members, newMember] });
    } catch (error: any) {
      set({ membersError: error.message || '멤버 초대에 실패했습니다.' });
      throw error;
    }
  },

  updateMemberRole: async (
    workspaceId: number,
    memberId: number,
    data: MemberRoleUpdateRequest
  ) => {
    try {
      set({ membersError: null });
      const response = await workspaceApi.updateMemberRole(
        workspaceId,
        memberId,
        data
      );
      const updatedMember = response.data;

      const { members } = get();
      const updatedMembers = members.map(member =>
        member.id === memberId ? updatedMember : member
      );
      set({ members: updatedMembers });
    } catch (error: any) {
      set({ membersError: error.message || '멤버 역할 변경에 실패했습니다.' });
      throw error;
    }
  },

  removeMember: async (workspaceId: number, memberId: number) => {
    try {
      set({ membersError: null });
      await workspaceApi.removeMember(workspaceId, memberId);

      const { members } = get();
      const updatedMembers = members.filter(member => member.id !== memberId);
      set({ members: updatedMembers });
    } catch (error: any) {
      set({ membersError: error.message || '멤버 제거에 실패했습니다.' });
      throw error;
    }
  },

  leaveWorkspace: async (workspaceId: number) => {
    try {
      set({ error: null });
      await workspaceApi.leaveWorkspace(workspaceId);

      // 내 워크스페이스 목록에서 제거
      const { myWorkspaces, currentWorkspace } = get();
      const updatedWorkspaces = myWorkspaces.filter(
        ws => ws.id !== workspaceId
      );
      set({ myWorkspaces: updatedWorkspaces });

      // 현재 워크스페이스인 경우 초기화
      if (currentWorkspace?.id === workspaceId) {
        set({ currentWorkspace: null, members: [] });
      }
    } catch (error: any) {
      set({ error: error.message || '워크스페이스 나가기에 실패했습니다.' });
      throw error;
    }
  },

  // Invite codes
  generateInviteCode: async (workspaceId: number) => {
    try {
      const response = await workspaceApi.generateInviteCode(workspaceId);

      // 현재 워크스페이스 정보 업데이트
      const { currentWorkspace } = get();
      if (currentWorkspace?.id === workspaceId) {
        set({
          currentWorkspace: {
            ...currentWorkspace,
            inviteCode: response.data,
          },
        });
      }

      return response.data;
    } catch (error: any) {
      set({ error: error.message || '초대 코드 생성에 실패했습니다.' });
      throw error;
    }
  },

  removeInviteCode: async (workspaceId: number) => {
    try {
      await workspaceApi.removeInviteCode(workspaceId);

      // 현재 워크스페이스 정보 업데이트
      const { currentWorkspace } = get();
      if (currentWorkspace?.id === workspaceId) {
        set({
          currentWorkspace: {
            ...currentWorkspace,
            inviteCode: undefined,
          },
        });
      }
    } catch (error: any) {
      set({ error: error.message || '초대 코드 제거에 실패했습니다.' });
      throw error;
    }
  },

  joinByInviteCode: async (code: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await workspaceApi.joinWorkspaceByInviteCode(code);
      const workspace = response.data;

      // 내 워크스페이스 목록 새로고침
      await get().fetchMyWorkspaces();

      set({ isLoading: false });
      return workspace;
    } catch (error: any) {
      set({
        error: error.message || '워크스페이스 참가에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  // Error handling
  clearError: () => set({ error: null }),
  clearMembersError: () => set({ membersError: null }),
}));

// Selectors
export const useCurrentWorkspace = () =>
  useWorkspaceStore(state => state.currentWorkspace);
export const useMyWorkspaces = () =>
  useWorkspaceStore(state => state.myWorkspaces);
export const useWorkspaceMembers = () =>
  useWorkspaceStore(state => state.members);
