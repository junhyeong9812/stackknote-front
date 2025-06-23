/**
 * UI 상태 관리 Store (Zustand)
 * 전역 UI 상태, 모달, 사이드바, 테마 등 관리
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Theme,
  setTheme as setAppTheme,
  getCurrentTheme,
} from '@/lib/utils/theme';

interface UIState {
  // Theme
  theme: Theme;

  // Layout
  sidebarCollapsed: boolean;
  sidebarWidth: number;

  // Modals and dialogs
  modals: {
    createWorkspace: boolean;
    createPage: boolean;
    deleteConfirm: boolean;
    inviteMember: boolean;
    settings: boolean;
    fileUpload: boolean;
    search: boolean;
  };

  // Notifications and toasts
  notifications: UINotification[];

  // Loading states
  globalLoading: boolean;

  // Search
  searchQuery: string;
  searchFocused: boolean;

  // Editor
  editorFullscreen: boolean;
  showPageTree: boolean;

  // Mobile
  isMobile: boolean;
  mobileMenuOpen: boolean;
}

interface UINotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  isRead?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UIActions {
  // Theme
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Layout
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;

  // Modals
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  closeAllModals: () => void;

  // Notifications
  addNotification: (notification: Omit<UINotification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Loading
  setGlobalLoading: (loading: boolean) => void;

  // Search
  setSearchQuery: (query: string) => void;
  setSearchFocused: (focused: boolean) => void;
  clearSearch: () => void;

  // Editor
  setEditorFullscreen: (fullscreen: boolean) => void;
  togglePageTree: () => void;

  // Mobile
  setIsMobile: (isMobile: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Quick actions
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
  showWarningToast: (message: string) => void;
  showInfoToast: (message: string) => void;
}

interface UIStore extends UIState, UIActions {}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      sidebarCollapsed: false,
      sidebarWidth: 280,
      modals: {
        createWorkspace: false,
        createPage: false,
        deleteConfirm: false,
        inviteMember: false,
        settings: false,
        fileUpload: false,
        search: false,
      },
      notifications: [],
      globalLoading: false,
      searchQuery: '',
      searchFocused: false,
      editorFullscreen: false,
      showPageTree: true,
      isMobile: false,
      mobileMenuOpen: false,

      // Theme actions
      setTheme: (theme: Theme) => {
        setAppTheme(theme);
        set({ theme });
      },

      toggleTheme: () => {
        const { theme } = get();
        const { resolvedTheme } = getCurrentTheme();
        const newTheme: Theme = resolvedTheme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // Layout actions
      toggleSidebar: () => {
        const { sidebarCollapsed } = get();
        set({ sidebarCollapsed: !sidebarCollapsed });
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },

      setSidebarWidth: (width: number) => {
        // 최소/최대 너비 제한
        const constrainedWidth = Math.max(200, Math.min(400, width));
        set({ sidebarWidth: constrainedWidth });
      },

      // Modal actions
      openModal: (modal: keyof UIState['modals']) => {
        set(state => ({
          modals: { ...state.modals, [modal]: true },
        }));
      },

      closeModal: (modal: keyof UIState['modals']) => {
        set(state => ({
          modals: { ...state.modals, [modal]: false },
        }));
      },

      closeAllModals: () => {
        const closedModals = Object.keys(get().modals).reduce(
          (acc, key) => {
            acc[key as keyof UIState['modals']] = false;
            return acc;
          },
          {} as UIState['modals']
        );

        set({ modals: closedModals });
      },

      // Notification actions
      addNotification: (notification: Omit<UINotification, 'id'>) => {
        const id = `notification-${Date.now()}-${Math.random()}`;
        const newNotification: UINotification = {
          ...notification,
          id,
          duration: notification.duration ?? 5000,
        };

        const { notifications } = get();
        set({ notifications: [...notifications, newNotification] });

        // 자동 제거
        if (newNotification.duration && newNotification.duration > 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, newNotification.duration);
        }
      },

      removeNotification: (id: string) => {
        const { notifications } = get();
        set({ notifications: notifications.filter(n => n.id !== id) });
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      // Loading actions
      setGlobalLoading: (loading: boolean) => {
        set({ globalLoading: loading });
      },

      // Search actions
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      setSearchFocused: (focused: boolean) => {
        set({ searchFocused: focused });
      },

      clearSearch: () => {
        set({ searchQuery: '', searchFocused: false });
      },

      // Editor actions
      setEditorFullscreen: (fullscreen: boolean) => {
        set({ editorFullscreen: fullscreen });
      },

      togglePageTree: () => {
        const { showPageTree } = get();
        set({ showPageTree: !showPageTree });
      },

      // Mobile actions
      setIsMobile: (isMobile: boolean) => {
        set({ isMobile });

        // 모바일일 때 자동으로 사이드바 접기
        if (isMobile) {
          set({ sidebarCollapsed: true, mobileMenuOpen: false });
        }
      },

      setMobileMenuOpen: (open: boolean) => {
        set({ mobileMenuOpen: open });
      },

      // Quick toast actions
      showSuccessToast: (message: string) => {
        get().addNotification({
          type: 'success',
          title: '성공',
          message,
          duration: 3000,
        });
      },

      showErrorToast: (message: string) => {
        get().addNotification({
          type: 'error',
          title: '오류',
          message,
          duration: 5000,
        });
      },

      showWarningToast: (message: string) => {
        get().addNotification({
          type: 'warning',
          title: '경고',
          message,
          duration: 4000,
        });
      },

      showInfoToast: (message: string) => {
        get().addNotification({
          type: 'info',
          title: '알림',
          message,
          duration: 3000,
        });
      },
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        // 영속화할 상태만 선택
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarWidth: state.sidebarWidth,
        showPageTree: state.showPageTree,
      }),
    }
  )
);

// Selectors
export const useTheme = () => useUIStore(state => state.theme);
export const useSidebar = () =>
  useUIStore(state => ({
    collapsed: state.sidebarCollapsed,
    width: state.sidebarWidth,
    toggle: state.toggleSidebar,
    setCollapsed: state.setSidebarCollapsed,
    setWidth: state.setSidebarWidth,
  }));

export const useModals = () =>
  useUIStore(state => ({
    modals: state.modals,
    openModal: state.openModal,
    closeModal: state.closeModal,
    closeAllModals: state.closeAllModals,
  }));

export const useNotifications = () =>
  useUIStore(state => ({
    notifications: state.notifications,
    addNotification: state.addNotification,
    removeNotification: state.removeNotification,
    clearNotifications: state.clearNotifications,
    showSuccessToast: state.showSuccessToast,
    showErrorToast: state.showErrorToast,
    showWarningToast: state.showWarningToast,
    showInfoToast: state.showInfoToast,
  }));

export const useSearch = () =>
  useUIStore(state => ({
    query: state.searchQuery,
    focused: state.searchFocused,
    setQuery: state.setSearchQuery,
    setFocused: state.setSearchFocused,
    clear: state.clearSearch,
  }));

export const useEditor = () =>
  useUIStore(state => ({
    fullscreen: state.editorFullscreen,
    showPageTree: state.showPageTree,
    setFullscreen: state.setEditorFullscreen,
    togglePageTree: state.togglePageTree,
  }));

export const useMobile = () =>
  useUIStore(state => ({
    isMobile: state.isMobile,
    menuOpen: state.mobileMenuOpen,
    setIsMobile: state.setIsMobile,
    setMenuOpen: state.setMobileMenuOpen,
  }));
