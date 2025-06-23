/**
 * 페이지 상태 관리 Store (Zustand)
 */

import { create } from 'zustand';
import {
  PageResponse,
  PageSummaryResponse,
  PageCreateRequest,
  PageUpdateRequest,
  PageMoveRequest,
  PageDuplicateRequest,
  PageTreeNode,
} from '@/types';
import { pageApi } from '@/lib/api';

interface PageState {
  // Current page
  currentPage: PageResponse | null;

  // Workspace pages (tree structure)
  pageTree: PageTreeNode[];

  // Recently visited pages
  recentPages: PageSummaryResponse[];

  // Search results
  searchResults: PageSummaryResponse[];

  // Loading states
  isLoading: boolean;
  isPageLoading: boolean;
  isSaving: boolean;
  isTreeLoading: boolean;

  // Error states
  error: string | null;
  saveError: string | null;

  // Editor state
  hasUnsavedChanges: boolean;
  lastSaved: string | null;
}

interface PageActions {
  // Page CRUD
  createPage: (
    workspaceId: number,
    data: PageCreateRequest
  ) => Promise<PageResponse>;
  fetchPage: (workspaceId: number, pageId: number) => Promise<void>;
  updatePage: (
    workspaceId: number,
    pageId: number,
    data: PageUpdateRequest
  ) => Promise<void>;
  deletePage: (workspaceId: number, pageId: number) => Promise<void>;

  // Page operations
  movePage: (
    workspaceId: number,
    pageId: number,
    data: PageMoveRequest
  ) => Promise<void>;
  duplicatePage: (
    workspaceId: number,
    pageId: number,
    data: PageDuplicateRequest
  ) => Promise<PageResponse>;
  togglePageVisibility: (workspaceId: number, pageId: number) => Promise<void>;
  togglePageLock: (workspaceId: number, pageId: number) => Promise<void>;

  // Page tree management
  fetchPageTree: (workspaceId: number) => Promise<void>;
  expandTreeNode: (nodeId: number) => void;
  collapseTreeNode: (nodeId: number) => void;

  // Content management
  setCurrentPage: (page: PageResponse | null) => void;
  updatePageContent: (content: string, autoSave?: boolean) => void;
  saveCurrentPage: () => Promise<void>;

  // Search and navigation
  searchPages: (workspaceId: number, keyword: string) => Promise<void>;
  addToRecentPages: (page: PageSummaryResponse) => void;
  clearSearchResults: () => void;

  // Editor state
  setUnsavedChanges: (hasChanges: boolean) => void;

  // Error handling
  clearError: () => void;
  clearSaveError: () => void;
}

interface PageStore extends PageState, PageActions {}

export const usePageStore = create<PageStore>((set, get) => ({
  // Initial state
  currentPage: null,
  pageTree: [],
  recentPages: [],
  searchResults: [],
  isLoading: false,
  isPageLoading: false,
  isSaving: false,
  isTreeLoading: false,
  error: null,
  saveError: null,
  hasUnsavedChanges: false,
  lastSaved: null,

  // Page CRUD
  createPage: async (workspaceId: number, data: PageCreateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const response = await pageApi.createPage(workspaceId, data);
      const newPage = response.data;

      // 페이지 트리 새로고침
      await get().fetchPageTree(workspaceId);

      set({ isLoading: false });
      return newPage;
    } catch (error: any) {
      set({
        error: error.message || '페이지 생성에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchPage: async (workspaceId: number, pageId: number) => {
    try {
      set({ isPageLoading: true, error: null });
      const response = await pageApi.getPage(workspaceId, pageId);
      const page = response.data;

      set({
        currentPage: page,
        isPageLoading: false,
        hasUnsavedChanges: false,
      });

      // 최근 페이지에 추가
      const pageSummary: PageSummaryResponse = {
        id: page.id,
        title: page.title,
        summary: page.summary,
        icon: page.icon,
        coverImageUrl: page.coverImageUrl,
        parentId: page.parentId,
        createdByName: page.createdBy.username,
        lastModifiedByName: page.lastModifiedBy?.username,
        isPublished: page.isPublished,
        isTemplate: page.isTemplate,
        isLocked: page.isLocked,
        sortOrder: page.sortOrder,
        viewCount: page.viewCount,
        pageType: page.pageType,
        depth: page.depth,
        hasChildren: page.hasChildren,
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      };

      get().addToRecentPages(pageSummary);
    } catch (error: any) {
      set({
        error: error.message || '페이지를 불러오는데 실패했습니다.',
        isPageLoading: false,
      });
    }
  },

  updatePage: async (
    workspaceId: number,
    pageId: number,
    data: PageUpdateRequest
  ) => {
    try {
      set({ isSaving: true, saveError: null });
      const response = await pageApi.updatePage(workspaceId, pageId, data);
      const updatedPage = response.data;

      set({
        currentPage: updatedPage,
        isSaving: false,
        hasUnsavedChanges: false,
        lastSaved: new Date().toISOString(),
      });

      // 페이지 트리에서 업데이트
      const updateTreeNode = (nodes: PageTreeNode[]): PageTreeNode[] => {
        return nodes.map(node => {
          if (node.id === pageId) {
            return {
              ...node,
              title: updatedPage.title,
              icon: updatedPage.icon,
            };
          }
          if (node.children) {
            return { ...node, children: updateTreeNode(node.children) };
          }
          return node;
        });
      };

      const { pageTree } = get();
      set({ pageTree: updateTreeNode(pageTree) });
    } catch (error: any) {
      set({
        saveError: error.message || '페이지 저장에 실패했습니다.',
        isSaving: false,
      });
      throw error;
    }
  },

  deletePage: async (workspaceId: number, pageId: number) => {
    try {
      set({ error: null });
      await pageApi.deletePage(workspaceId, pageId);

      // 현재 페이지가 삭제된 경우 초기화
      const { currentPage } = get();
      if (currentPage?.id === pageId) {
        set({ currentPage: null, hasUnsavedChanges: false });
      }

      // 페이지 트리 새로고침
      await get().fetchPageTree(workspaceId);
    } catch (error: any) {
      set({ error: error.message || '페이지 삭제에 실패했습니다.' });
      throw error;
    }
  },

  // Page operations
  movePage: async (
    workspaceId: number,
    pageId: number,
    data: PageMoveRequest
  ) => {
    try {
      set({ error: null });
      const response = await pageApi.movePage(workspaceId, pageId, data);
      const movedPage = response.data;

      // 현재 페이지 업데이트
      const { currentPage } = get();
      if (currentPage?.id === pageId) {
        set({ currentPage: movedPage });
      }

      // 페이지 트리 새로고침
      await get().fetchPageTree(workspaceId);
    } catch (error: any) {
      set({ error: error.message || '페이지 이동에 실패했습니다.' });
      throw error;
    }
  },

  duplicatePage: async (
    workspaceId: number,
    pageId: number,
    data: PageDuplicateRequest
  ) => {
    try {
      set({ isLoading: true, error: null });
      const response = await pageApi.duplicatePage(workspaceId, pageId, data);
      const duplicatedPage = response.data;

      // 페이지 트리 새로고침
      await get().fetchPageTree(workspaceId);

      set({ isLoading: false });
      return duplicatedPage;
    } catch (error: any) {
      set({
        error: error.message || '페이지 복제에 실패했습니다.',
        isLoading: false,
      });
      throw error;
    }
  },

  togglePageVisibility: async (workspaceId: number, pageId: number) => {
    try {
      const response = await pageApi.togglePageVisibility(workspaceId, pageId);
      const updatedPage = response.data;

      // 현재 페이지 업데이트
      const { currentPage } = get();
      if (currentPage?.id === pageId) {
        set({ currentPage: updatedPage });
      }
    } catch (error: any) {
      set({ error: error.message || '페이지 공개 설정 변경에 실패했습니다.' });
      throw error;
    }
  },

  togglePageLock: async (workspaceId: number, pageId: number) => {
    try {
      const response = await pageApi.togglePageLock(workspaceId, pageId);
      const updatedPage = response.data;

      // 현재 페이지 업데이트
      const { currentPage } = get();
      if (currentPage?.id === pageId) {
        set({ currentPage: updatedPage });
      }
    } catch (error: any) {
      set({ error: error.message || '페이지 잠금 설정 변경에 실패했습니다.' });
      throw error;
    }
  },

  // Page tree management
  fetchPageTree: async (workspaceId: number) => {
    try {
      set({ isTreeLoading: true, error: null });
      const response = await pageApi.getRootPages(workspaceId);
      const rootPages = response.data;

      // 페이지 요약을 트리 노드로 변환
      const convertToTreeNode = (page: PageSummaryResponse): PageTreeNode => ({
        id: page.id,
        title: page.title,
        icon: page.icon,
        parentId: page.parentId,
        depth: page.depth,
        sortOrder: page.sortOrder,
        hasChildren: page.hasChildren,
        isExpanded: false,
        children: [],
      });

      const pageTree = rootPages.map(convertToTreeNode);
      set({ pageTree, isTreeLoading: false });
    } catch (error: any) {
      set({
        error: error.message || '페이지 목록을 불러오는데 실패했습니다.',
        isTreeLoading: false,
      });
    }
  },

  expandTreeNode: (nodeId: number) => {
    const updateNode = (nodes: PageTreeNode[]): PageTreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isExpanded: true };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };

    const { pageTree } = get();
    set({ pageTree: updateNode(pageTree) });
  },

  collapseTreeNode: (nodeId: number) => {
    const updateNode = (nodes: PageTreeNode[]): PageTreeNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, isExpanded: false };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };

    const { pageTree } = get();
    set({ pageTree: updateNode(pageTree) });
  },

  // Content management
  setCurrentPage: (page: PageResponse | null) => {
    set({ currentPage: page, hasUnsavedChanges: false });
  },

  updatePageContent: (content: string, autoSave = false) => {
    const { currentPage } = get();
    if (!currentPage) return;

    const updatedPage = { ...currentPage, content };
    set({
      currentPage: updatedPage,
      hasUnsavedChanges: true,
    });

    // 자동 저장 로직 (추후 구현)
    if (autoSave) {
      // TODO: debounced auto save
    }
  },

  saveCurrentPage: async () => {
    const { currentPage, hasUnsavedChanges } = get();
    if (!currentPage || !hasUnsavedChanges) return;

    await get().updatePage(currentPage.workspaceId, currentPage.id, {
      content: currentPage.content,
    });
  },

  // Search and navigation
  searchPages: async (workspaceId: number, keyword: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await pageApi.searchPages(workspaceId, { keyword });
      set({ searchResults: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.message || '페이지 검색에 실패했습니다.',
        isLoading: false,
      });
    }
  },

  addToRecentPages: (page: PageSummaryResponse) => {
    const { recentPages } = get();

    // 중복 제거
    const filteredPages = recentPages.filter(p => p.id !== page.id);

    // 최대 10개까지만 유지
    const updatedPages = [page, ...filteredPages].slice(0, 10);

    set({ recentPages: updatedPages });
  },

  clearSearchResults: () => {
    set({ searchResults: [] });
  },

  // Editor state
  setUnsavedChanges: (hasChanges: boolean) => {
    set({ hasUnsavedChanges: hasChanges });
  },

  // Error handling
  clearError: () => set({ error: null }),
  clearSaveError: () => set({ saveError: null }),
}));

// Selectors
export const useCurrentPage = () => usePageStore(state => state.currentPage);
export const usePageTree = () => usePageStore(state => state.pageTree);
export const useRecentPages = () => usePageStore(state => state.recentPages);
export const usePageSearchResults = () =>
  usePageStore(state => state.searchResults);
export const useUnsavedChanges = () =>
  usePageStore(state => state.hasUnsavedChanges);
