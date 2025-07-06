/**
 * Zustand 스토어들 통합 Export
 *
 * 사용법:
 * import { useAuth, useWorkspaceStore, usePageStore } from '@/lib/stores';
 */

// Auth store
export {
  useAuthStore,
  useAuth,
  useUser,
  useAuthStatus,
  useAuthError,
} from './auth-store';

// Workspace store
export {
  useWorkspaceStore,
  useCurrentWorkspace,
  useMyWorkspaces,
  useWorkspaceMembers,
} from './workspace-store';

// Page store
export {
  usePageStore,
  useCurrentPage,
  usePageTree,
  useRecentPages,
  usePageSearchResults,
  useUnsavedChanges,
} from './page-store';

// UI store
export {
  useUIStore,
  useTheme,
  useSidebar,
  useModals,
  useNotifications,
  useSearch,
  useEditor,
  useMobile,
} from './ui-store';

// Sidebar Store
export {
  useSidebarStore,
  useSidebarData,
  usePersonalSpace,
  useTeamSpaces,
  useRecentPages as useSidebarRecentPages,
  useFavoritePages,
} from './sidebar-store';