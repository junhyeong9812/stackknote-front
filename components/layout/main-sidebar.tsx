'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Search,
  Settings,
  Plus,
  MoreHorizontal,
  Star,
  Clock,
  Home,
  Users,
  Trash2,
  FileText,
  Hash,
  Lock,
  Globe,
  LogOut,
  User,
  HelpCircle,
  Keyboard,
  Download,
  Upload,
  Copy,
  Move,
  Edit,
  SidebarOpen,
  SidebarClose,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import {
  Button,
  Avatar,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SimpleTooltip,
} from '@/components/ui';
import { SearchModal } from '@/components/search/search-modal';
import { useAuth, useSidebarStore, useUIStore } from '@/lib/stores';
import { 
  PageTreeResponse, 
  PersonalSpaceResponse, 
  TeamSpaceResponse,
  RecentPageResponse,
  FavoritePageResponse,
  SidebarSection,
} from '@/types';

interface MainSidebarProps {
  className?: string;
}

export function MainSidebar({ className }: MainSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useUIStore(state => ({
    sidebarCollapsed: state.sidebarCollapsed,
    toggleSidebar: state.toggleSidebar,
  }));
  
  const {
    sidebarData,
    expandedSections,
    expandedWorkspaces,
    expandedPages,
    selectedPageId,
    toggleSection,
    toggleWorkspace,
    togglePage,
    selectPage,
    toggleFavorite,
    fetchSidebarData,
  } = useSidebarStore();

  const [searchOpen, setSearchOpen] = useState(false);

  // 초기 데이터 로드
  React.useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

  // 섹션 렌더링 (+ 버튼 포함)
  const renderSection = (
    title: string,
    section: SidebarSection,
    children: React.ReactNode,
    isEmpty?: boolean,
    onAddClick?: () => void
  ) => {
    const isExpanded = expandedSections.includes(section);

    return (
      <div className="mb-1">
        <div className="group flex items-center justify-between rounded px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800">
          <button
            onClick={() => toggleSection(section)}
            className="flex flex-1 items-center gap-1 text-sm text-gray-600 dark:text-gray-400"
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
            <span className="font-medium">{title}</span>
          </button>
          {onAddClick && (
            <SimpleTooltip content={`새 ${title.slice(0, -1)}`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddClick();
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </SimpleTooltip>
          )}
        </div>
        {isExpanded && (
          <div className="mt-0.5">
            {isEmpty ? (
              <div className="px-6 py-2 text-xs text-gray-500">
                비어있음
              </div>
            ) : (
              children
            )}
          </div>
        )}
      </div>
    );
  };

  // 페이지 트리 아이템 렌더링
  const renderPageTree = (
    page: PageTreeResponse,
    level: number = 0,
    workspaceId: number
  ) => {
    const isActive = pathname === `/workspace/${workspaceId}/page/${page.id}`;
    const isExpanded = expandedPages.includes(page.id);
    const hasChildren = page.hasChildren && page.children.length > 0;

    return (
      <div key={page.id}>
        <div
          className={cn(
            'group flex items-center rounded hover:bg-gray-100 dark:hover:bg-gray-800',
            isActive && 'bg-gray-100 dark:bg-gray-800'
          )}
          style={{ paddingLeft: `${12 + level * 12}px` }}
        >
          <button
            onClick={() => hasChildren && togglePage(page.id)}
            className="flex h-6 w-6 items-center justify-center"
          >
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-500" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-500" />
              )
            )}
          </button>

          <Link
            href={`/workspace/${workspaceId}/page/${page.id}`}
            onClick={() => selectPage(page.id)}
            className="flex flex-1 items-center gap-2 py-1 pr-2"
          >
            {page.icon ? (
              <span className="text-sm">{page.icon}</span>
            ) : (
              <FileText className="h-3.5 w-3.5 text-gray-500" />
            )}
            <span className={cn(
              "flex-1 truncate text-sm",
              isActive ? "font-medium text-gray-900 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"
            )}>
              {page.title}
            </span>
            {page.isLocked && <Lock className="h-3 w-3 text-gray-400" />}
            {page.isPublished && <Globe className="h-3 w-3 text-gray-400" />}
          </Link>

          <div className="opacity-0 group-hover:opacity-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => toggleFavorite(page.id)}>
                  <Star className="mr-2 h-3.5 w-3.5" />
                  즐겨찾기
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-3.5 w-3.5" />
                  복제
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-3.5 w-3.5" />
                  이름 변경
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Move className="mr-2 h-3.5 w-3.5" />
                  이동
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {page.children.map(child => 
              renderPageTree(child, level + 1, workspaceId)
            )}
          </div>
        )}
      </div>
    );
  };

  // 워크스페이스 렌더링 (페이지 없이)
  const renderWorkspace = (
    workspace: PersonalSpaceResponse | TeamSpaceResponse,
    isPersonal = false
  ) => {
    return (
      <Link
        key={workspace.workspaceId}
        href={`/workspace/${workspace.workspaceId}`}
        className="group flex items-center gap-2 rounded px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {workspace.icon ? (
          <span className="text-sm">{workspace.icon}</span>
        ) : (
          <Hash className="h-3.5 w-3.5 text-gray-500" />
        )}
        <span className="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">
          {workspace.name}
        </span>
        <span className="text-xs text-gray-500">
          {workspace.totalPageCount}
        </span>
      </Link>
    );
  };

  // 페이지 섹션용 워크스페이스 선택기
  const [selectedWorkspaceForPages, setSelectedWorkspaceForPages] = useState<number | null>(null);

  // 최근/즐겨찾기 페이지 렌더링
  const renderQuickAccessPage = (
    page: RecentPageResponse | FavoritePageResponse,
    type: 'recent' | 'favorite'
  ) => {
    const pageId = page.pageId;
    const isActive = selectedPageId === pageId;

    return (
      <Link
        key={pageId}
        href={`/workspace/${page.workspaceId}/page/${pageId}`}
        onClick={() => selectPage(pageId)}
        className={cn(
          "group flex items-center gap-2 rounded px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-800",
          isActive && "bg-gray-100 dark:bg-gray-800"
        )}
      >
        {page.icon ? (
          <span className="text-sm">{page.icon}</span>
        ) : (
          <FileText className="h-3.5 w-3.5 text-gray-500" />
        )}
        <div className="flex-1 truncate">
          <div className="truncate text-sm text-gray-700 dark:text-gray-300">
            {page.title}
          </div>
          <div className="truncate text-xs text-gray-500">
            {page.workspaceName}
          </div>
        </div>
        {type === 'favorite' && (
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(pageId);
            }}
            className="opacity-0 group-hover:opacity-100"
          >
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
          </button>
        )}
      </Link>
    );
  };

  if (sidebarCollapsed) {
    return (
      <aside className={cn(
        "flex w-12 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900",
        className
      )}>
        <div className="flex h-12 items-center justify-center border-b border-gray-200 dark:border-gray-800">
          <SimpleTooltip content="사이드바 펼치기">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0"
            >
              <SidebarOpen className="h-4 w-4" />
            </Button>
          </SimpleTooltip>
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className={cn(
        "flex w-60 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900",
        className
      )}>
        {/* 상단 사용자 메뉴 */}
        <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-2 dark:border-gray-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                <Avatar className="h-5 w-5">
                  <img
                    src={user?.profileImageUrl || '/default-avatar.png'}
                    alt={user?.username}
                  />
                </Avatar>
                <span className="flex-1 truncate font-medium">
                  {user?.username || '사용자'}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-3.5 w-3.5" />
                프로필 설정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-3.5 w-3.5" />
                설정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Keyboard className="mr-2 h-3.5 w-3.5" />
                키보드 단축키
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="mr-2 h-3.5 w-3.5" />
                내보내기
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="mr-2 h-3.5 w-3.5" />
                가져오기
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-3.5 w-3.5" />
                도움말 & 지원
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-3.5 w-3.5" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SimpleTooltip content="사이드바 접기">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-6 w-6 p-0"
            >
              <SidebarClose className="h-3.5 w-3.5" />
            </Button>
          </SimpleTooltip>
        </div>

        {/* 검색 버튼 */}
        <div className="px-3 py-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex w-full items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <Search className="h-3.5 w-3.5" />
            <span>검색...</span>
            <span className="ml-auto text-xs text-gray-400">⌘K</span>
          </button>
        </div>

        {/* 메인 네비게이션 */}
        <div className="flex-1 overflow-y-auto px-2">
          {/* 홈 */}
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-2 rounded px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800",
              pathname === '/dashboard' && "bg-gray-100 dark:bg-gray-800"
            )}
          >
            <Home className="h-3.5 w-3.5" />
            <span>홈</span>
          </Link>

          {/* 즐겨찾기 */}
          {renderSection(
            '즐겨찾기',
            'FAVORITES',
            sidebarData?.favoritePages.map(page => 
              renderQuickAccessPage(page, 'favorite')
            ),
            !sidebarData?.favoritePages.length
          )}

          {/* 최근 */}
          {renderSection(
            '최근',
            'RECENT',
            sidebarData?.recentPages.map(page => 
              renderQuickAccessPage(page, 'recent')
            ),
            !sidebarData?.recentPages.length
          )}

          {/* 개인 페이지 */}
          {sidebarData?.personalSpace && renderSection(
            '개인 페이지',
            'PERSONAL',
            renderWorkspace(sidebarData.personalSpace, true)
          )}

          {/* 팀스페이스 */}
          {renderSection(
            '팀스페이스',
            'TEAMSPACES',
            sidebarData?.teamSpaces.map(space => renderWorkspace(space)),
            !sidebarData?.teamSpaces.length,
            () => {
              // TODO: 새 팀스페이스 생성
              console.log('새 팀스페이스 생성');
            }
          )}

          {/* 페이지 */}
          {renderSection(
            '페이지',
            'PAGES',
            <>
              {/* 워크스페이스 선택 드롭다운 */}
              <div className="mb-2 px-3">
                <select
                  value={selectedWorkspaceForPages || ''}
                  onChange={(e) => setSelectedWorkspaceForPages(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
                >
                  <option value="">워크스페이스 선택</option>
                  {sidebarData?.personalSpace && (
                    <option value={sidebarData.personalSpace.workspaceId}>
                      {sidebarData.personalSpace.name}
                    </option>
                  )}
                  {sidebarData?.teamSpaces.map(space => (
                    <option key={space.workspaceId} value={space.workspaceId}>
                      {space.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 선택된 워크스페이스의 페이지 트리 */}
              {selectedWorkspaceForPages && (
                <div>
                  {(() => {
                    const workspace = sidebarData?.personalSpace?.workspaceId === selectedWorkspaceForPages
                      ? sidebarData.personalSpace
                      : sidebarData?.teamSpaces.find(s => s.workspaceId === selectedWorkspaceForPages);
                    
                    if (!workspace) return null;
                    
                    return workspace.pages.length > 0 ? (
                      workspace.pages.map(page => 
                        renderPageTree(page, 0, workspace.workspaceId)
                      )
                    ) : (
                      <div className="px-6 py-2 text-xs text-gray-500">
                        페이지가 없습니다
                      </div>
                    );
                  })()}
                </div>
              )}
            </>,
            false,
            () => {
              if (selectedWorkspaceForPages) {
                // TODO: 선택된 워크스페이스에 새 페이지 생성
                console.log('새 페이지 생성:', selectedWorkspaceForPages);
              }
            }
          )}

          {/* 휴지통 */}
          <Link
            href="/trash"
            className="flex items-center gap-2 rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>휴지통</span>
          </Link>
        </div>
      </aside>

      {/* 검색 모달 */}
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}