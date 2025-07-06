/**
 * 사이드바 상태 관리 Store (Zustand)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  WorkspaceSidebarResponse,
  PersonalSpaceResponse,
  TeamSpaceResponse,
  PageTreeResponse,
  RecentPageResponse,
  FavoritePageResponse,
  SidebarSection,
  SidebarUIState,
} from '@/types';
import { sidebarApi, pageApi } from '@/lib/api';

interface SidebarState extends SidebarUIState {
  // Data
  sidebarData: WorkspaceSidebarResponse | null;
  
  // Loading states
  isLoading: boolean;
  isTreeLoading: Map<number, boolean>;
  
  // Error state
  error: string | null;
}

interface SidebarActions {
  // Data fetching
  fetchSidebarData: () => Promise<void>;
  fetchWorkspacePages: (workspaceId: number) => Promise<void>;
  refreshRecentPages: () => Promise<void>;
  refreshFavoritePages: () => Promise<void>;

  // Page actions
  toggleFavorite: (pageId: number) => Promise<void>;
  recordPageVisit: (pageId: number) => Promise<void>;

  // UI actions
  toggleSection: (section: SidebarSection) => void;
  toggleWorkspace: (workspaceId: number) => void;
  togglePage: (pageId: number) => void;
  selectPage: (pageId: number | null) => void;
  selectWorkspace: (workspaceId: number | null) => void;

  // Drag and drop
  setDragging: (isDragging: boolean) => void;
  setDraggedItem: (item: { type: 'page' | 'workspace'; id: number } | null) => void;

  // Tree management
  expandAllPages: (workspaceId: number) => void;
  collapseAllPages: (workspaceId: number) => void;

  // Error handling
  clearError: () => void;
}

interface SidebarStore extends SidebarState, SidebarActions {}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarData: null,
      isLoading: false,
      isTreeLoading: new Map(),
      error: null,

      // UI state
      expandedSections: new Set(['PERSONAL', 'TEAMSPACES']),
      expandedWorkspaces: new Set(),
      expandedPages: new Set(),
      selectedPageId: null,
      selectedWorkspaceId: null,
      isDragging: false,
      draggedItem: null,

      // Data fetching
      fetchSidebarData: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await sidebarApi.getSidebarTree();
          set({ sidebarData: response.data, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || '사이드바 데이터를 불러오는데 실패했습니다.',
            isLoading: false,
          });
        }
      },

      fetchWorkspacePages: async (workspaceId: number) => {
        const { isTreeLoading } = get();
        
        // 이미 로딩 중이면 무시
        if (isTreeLoading.get(workspaceId)) return;

        try {
          // 로딩 상태 설정
          const newLoadingMap = new Map(isTreeLoading);
          newLoadingMap.set(workspaceId, true);
          set({ isTreeLoading: newLoadingMap });

          const response = await sidebarApi.getWorkspacePageTree(workspaceId);
          const pages = response.data;

          // 사이드바 데이터 업데이트
          const { sidebarData } = get();
          if (!sidebarData) return;

          let updatedData: WorkspaceSidebarResponse;

          if (sidebarData.personalSpace?.workspaceId === workspaceId) {
            // 개인 공간 업데이트
            updatedData = {
              ...sidebarData,
              personalSpace: {
                ...sidebarData.personalSpace,
                pages,
              },
            };
          } else {
            // 팀 스페이스 업데이트
            updatedData = {
              ...sidebarData,
              teamSpaces: sidebarData.teamSpaces.map(space =>
                space.workspaceId === workspaceId
                  ? { ...space, pages }
                  : space
              ),
            };
          }

          // 로딩 상태 해제
          const updatedLoadingMap = new Map(isTreeLoading);
          updatedLoadingMap.delete(workspaceId);

          set({
            sidebarData: updatedData,
            isTreeLoading: updatedLoadingMap,
          });
        } catch (error: any) {
          const updatedLoadingMap = new Map(isTreeLoading);
          updatedLoadingMap.delete(workspaceId);
          
          set({
            error: error.message || '페이지 목록을 불러오는데 실패했습니다.',
            isTreeLoading: updatedLoadingMap,
          });
        }
      },

      refreshRecentPages: async () => {
        try {
          const response = await sidebarApi.getRecentPages();
          const { sidebarData } = get();
          
          if (sidebarData) {
            set({
              sidebarData: {
                ...sidebarData,
                recentPages: response.data,
              },
            });
          }
        } catch (error) {
          console.error('최근 페이지 새로고침 실패:', error);
        }
      },

      refreshFavoritePages: async () => {
        try {
          const response = await sidebarApi.getFavoritePages();
          const { sidebarData } = get();
          
          if (sidebarData) {
            set({
              sidebarData: {
                ...sidebarData,
                favoritePages: response.data,
              },
            });
          }
        } catch (error) {
          console.error('즐겨찾기 페이지 새로고침 실패:', error);
        }
      },

      // Page actions
      toggleFavorite: async (pageId: number) => {
        try {
          await sidebarApi.toggleFavorite(pageId);
          // 즐겨찾기 목록 새로고침
          await get().refreshFavoritePages();
        } catch (error: any) {
          set({ error: error.message || '즐겨찾기 처리에 실패했습니다.' });
        }
      },

      recordPageVisit: async (pageId: number) => {
        try {
          await sidebarApi.recordPageVisit(pageId);
          // 최근 페이지 목록 새로고침
          await get().refreshRecentPages();
        } catch (error) {
          console.error('페이지 방문 기록 실패:', error);
        }
      },

      // UI actions
      toggleSection: (section: SidebarSection) => {
        const { expandedSections } = get();
        const newSections = new Set(expandedSections);
        
        if (newSections.has(section)) {
          newSections.delete(section);
        } else {
          newSections.add(section);
        }
        
        set({ expandedSections: newSections });
      },

      toggleWorkspace: (workspaceId: number) => {
        const { expandedWorkspaces } = get();
        const newWorkspaces = new Set(expandedWorkspaces);
        
        if (newWorkspaces.has(workspaceId)) {
          newWorkspaces.delete(workspaceId);
        } else {
          newWorkspaces.add(workspaceId);
          // 워크스페이스 확장 시 페이지 목록 로드
          get().fetchWorkspacePages(workspaceId);
        }
        
        set({ expandedWorkspaces: newWorkspaces });
      },

      togglePage: (pageId: number) => {
        const { expandedPages } = get();
        const newPages = new Set(expandedPages);
        
        if (newPages.has(pageId)) {
          newPages.delete(pageId);
        } else {
          newPages.add(pageId);
        }
        
        set({ expandedPages: newPages });
      },

      selectPage: (pageId: number | null) => {
        set({ selectedPageId: pageId });
        
        // 페이지 방문 기록
        if (pageId) {
          get().recordPageVisit(pageId);
        }
      },

      selectWorkspace: (workspaceId: number | null) => {
        set({ selectedWorkspaceId: workspaceId });
      },

      // Drag and drop
      setDragging: (isDragging: boolean) => {
        set({ isDragging });
      },

      setDraggedItem: (item) => {
        set({ draggedItem: item });
      },

      // Tree management
      expandAllPages: (workspaceId: number) => {
        const { sidebarData, expandedPages } = get();
        if (!sidebarData) return;

        const newExpandedPages = new Set(expandedPages);
        
        // 해당 워크스페이스의 모든 페이지 ID 수집
        const collectPageIds = (pages: PageTreeResponse[]) => {
          pages.forEach(page => {
            if (page.hasChildren) {
              newExpandedPages.add(page.id);
              collectPageIds(page.children);
            }
          });
        };

        if (sidebarData.personalSpace?.workspaceId === workspaceId) {
          collectPageIds(sidebarData.personalSpace.pages);
        } else {
          const teamSpace = sidebarData.teamSpaces.find(
            space => space.workspaceId === workspaceId
          );
          if (teamSpace) {
            collectPageIds(teamSpace.pages);
          }
        }

        set({ expandedPages: newExpandedPages });
      },

      collapseAllPages: (workspaceId: number) => {
        const { sidebarData, expandedPages } = get();
        if (!sidebarData) return;

        const newExpandedPages = new Set(expandedPages);
        
        // 해당 워크스페이스의 모든 페이지 ID 제거
        const removePageIds = (pages: PageTreeResponse[]) => {
          pages.forEach(page => {
            newExpandedPages.delete(page.id);
            if (page.children) {
              removePageIds(page.children);
            }
          });
        };

        if (sidebarData.personalSpace?.workspaceId === workspaceId) {
          removePageIds(sidebarData.personalSpace.pages);
        } else {
          const teamSpace = sidebarData.teamSpaces.find(
            space => space.workspaceId === workspaceId
          );
          if (teamSpace) {
            removePageIds(teamSpace.pages);
          }
        }

        set({ expandedPages: newExpandedPages });
      },

      // Error handling
      clearError: () => set({ error: null }),
    }),
    {
      name: 'sidebar-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // UI 상태만 영속화
        expandedSections: state.expandedSections,
        expandedWorkspaces: state.expandedWorkspaces,
        expandedPages: state.expandedPages,
      }),
    }
  )
);

// Selectors
export const useSidebarData = () => useSidebarStore((state) => state.sidebarData);
export const usePersonalSpace = () => useSidebarStore((state) => state.sidebarData?.personalSpace);
export const useTeamSpaces = () => useSidebarStore((state) => state.sidebarData?.teamSpaces || []);
export const useRecentPages = () => useSidebarStore((state) => state.sidebarData?.recentPages || []);
export const useFavoritePages = () => useSidebarStore((state) => state.sidebarData?.favoritePages || []);