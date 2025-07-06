/**
 * 워크스페이스 트리 관련 커스텀 훅
 * 사이드바에서 워크스페이스와 페이지 트리를 관리하는 로직
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceApi, pageApi } from '@/lib/api';
import { useWorkspaceStore, usePageStore } from '@/lib/stores';
import { useNotifications } from '@/lib/stores/ui-store';
import {
  WorkspaceSidebarResponse,
  PageTreeResponse,
  RecentPageResponse,
  FavoritePageResponse,
} from '@/types';

interface UseWorkspaceTreeOptions {
  autoFetch?: boolean;
  enablePolling?: boolean;
  pollingInterval?: number;
}

export function useWorkspaceTree(options: UseWorkspaceTreeOptions = {}) {
  const { autoFetch = true, enablePolling = false, pollingInterval = 30000 } = options;
  
  const queryClient = useQueryClient();
  const { showErrorToast } = useNotifications();
  const { currentWorkspace } = useWorkspaceStore();
  const { expandTreeNode, collapseTreeNode } = usePageStore();

  // 사이드바 전체 데이터 조회
  const {
    data: sidebarData,
    isLoading,
    error,
    refetch: refetchSidebar,
  } = useQuery<WorkspaceSidebarResponse>({
    queryKey: ['workspace', 'sidebar', 'tree'],
    queryFn: async () => {
      const response = await workspaceApi.getSidebarTree();
      return response.data;
    },
    enabled: autoFetch,
    refetchInterval: enablePolling ? pollingInterval : false,
    onError: (error: any) => {
      showErrorToast('사이드바 데이터를 불러오는데 실패했습니다.');
    },
  });

  // 특정 워크스페이스의 페이지 트리 조회 (지연 로딩)
  const fetchWorkspacePages = useCallback(
    async (workspaceId: number) => {
      try {
        const response = await workspaceApi.getWorkspacePageTree(workspaceId);
        return response.data;
      } catch (error) {
        showErrorToast('페이지 목록을 불러오는데 실패했습니다.');
        throw error;
      }
    },
    [showErrorToast]
  );

  // 페이지 즐겨찾기 토글
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (pageId: number) => {
      const response = await pageApi.toggleFavorite(pageId);
      return response.data;
    },
    onSuccess: (isFavorited, pageId) => {
      queryClient.invalidateQueries(['workspace', 'sidebar', 'tree']);
      const message = isFavorited ? '즐겨찾기에 추가되었습니다.' : '즐겨찾기에서 제거되었습니다.';
      // showSuccessToast(message);
    },
    onError: () => {
      showErrorToast('즐겨찾기 처리에 실패했습니다.');
    },
  });

  // 페이지 방문 기록
  const recordPageVisit = useCallback(
    async (pageId: number) => {
      try {
        await pageApi.recordPageVisit(pageId);
        // 최근 페이지 목록 갱신
        queryClient.invalidateQueries(['workspace', 'sidebar', 'tree']);
      } catch (error) {
        console.error('페이지 방문 기록 실패:', error);
      }
    },
    [queryClient]
  );

  // 트리 노드 확장/축소
  const toggleTreeNode = useCallback(
    (nodeId: number, isExpanded: boolean) => {
      if (isExpanded) {
        collapseTreeNode(nodeId);
      } else {
        expandTreeNode(nodeId);
      }
    },
    [expandTreeNode, collapseTreeNode]
  );

  // 페이지 생성
  const createPageInTree = useCallback(
    async (workspaceId: number, parentId?: number) => {
      try {
        const newPage = await pageApi.createPage(workspaceId, {
          title: '새 페이지',
          parentId,
        });
        
        // 트리 갱신
        queryClient.invalidateQueries(['workspace', 'sidebar', 'tree']);
        
        return newPage.data;
      } catch (error) {
        showErrorToast('페이지 생성에 실패했습니다.');
        throw error;
      }
    },
    [queryClient, showErrorToast]
  );

  // 페이지 이동 (드래그 앤 드롭)
  const movePageInTree = useCallback(
    async (pageId: number, newParentId?: number, newSortOrder?: number) => {
      try {
        await pageApi.movePage(currentWorkspace?.id || 0, pageId, {
          newParentId,
          newSortOrder,
        });
        
        // 트리 갱신
        queryClient.invalidateQueries(['workspace', 'sidebar', 'tree']);
      } catch (error) {
        showErrorToast('페이지 이동에 실패했습니다.');
        throw error;
      }
    },
    [currentWorkspace, queryClient, showErrorToast]
  );

  return {
    // 데이터
    sidebarData,
    personalSpace: sidebarData?.personalSpace,
    teamSpaces: sidebarData?.teamSpaces || [],
    recentPages: sidebarData?.recentPages || [],
    favoritePages: sidebarData?.favoritePages || [],

    // 상태
    isLoading,
    error,

    // 액션
    refetchSidebar,
    fetchWorkspacePages,
    toggleFavorite: toggleFavoriteMutation.mutate,
    recordPageVisit,
    toggleTreeNode,
    createPageInTree,
    movePageInTree,
  };
}

// 페이지 트리 탐색을 위한 유틸리티 훅
export function usePageTreeNavigation() {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  const toggleNode = useCallback((nodeId: number) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const expandNode = useCallback((nodeId: number) => {
    setExpandedNodes(prev => new Set(prev).add(nodeId));
  }, []);

  const collapseNode = useCallback((nodeId: number) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      next.delete(nodeId);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    // 모든 노드 확장 로직
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  const selectNode = useCallback((nodeId: number | null) => {
    setSelectedNodeId(nodeId);
  }, []);

  return {
    expandedNodes,
    selectedNodeId,
    toggleNode,
    expandNode,
    collapseNode,
    expandAll,
    collapseAll,
    selectNode,
  };
}