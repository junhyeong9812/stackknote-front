/**
 * 커스텀 훅들 통합 Export
 *
 * 사용법:
 * import { useAuth, useEditor, useDragDrop } from '@/lib/hooks';
 */

// 인증 관련 훅
export {
  useAuth,
  useAuthInitializer,
  useAuthGuard,
  useGuestGuard,
  useSessionTimer,
  usePermissions,
  useProfile,
  usePasswordManagement,
  useLoginForm,
  useRegisterForm,
} from './use-auth';

// 에디터 관련 훅
export {
  useEditor,
  useAutoSave,
  useEditorShortcuts,
  useEditorHistory,
  useBlocks,
  useEditorFormatting,
  useEditorSearch,
  useEditorEvents,
} from './use-editor';

// 드래그 앤 드롭 관련 훅
export {
  useDragDrop,
  useBlockDragDrop,
  useFileDragDrop,
  useResizable,
  useDragDropContext,
  useSortableList,
  useDragPreview,
  useDropZone,
} from './use-drag-drop';

// 파일 업로드 관련 훅
export {
  useFileUpload,
  useDropzoneUpload,
  useImageUpload,
  useUploadProgress,
  useFileUtils,
} from './use-file-upload';

// 검색 관련 훅
export {
  useSearch,
  useSearchModal,
  useDebounce,
} from './use-search';

// 워크스페이스 트리 관련 훅
export {
  useWorkspaceTree,
  usePageTreeNavigation,
} from './use-workspace-tree';

// 워크스페이스 관련 훅 (추후 추가)
// export { useWorkspace, useWorkspaceMembers } from './use-workspace';

// 페이지 관련 훅 (추후 추가)
// export { usePage, usePageTree } from './use-page';

// UI 관련 훅 (추후 추가)
// export { useModal, useToast, useSearch } from './use-ui';
