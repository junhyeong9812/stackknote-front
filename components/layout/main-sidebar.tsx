// components/layout/main-sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FileText,
  Users,
  Settings,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  Lock,
  Globe,
  Star,
  FolderOpen,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button, Badge, Avatar } from '@/components/ui';
import {
  useAuth,
  useSidebar,
  useCurrentWorkspace,
  usePageTree,
} from '@/lib/stores';
import { PageTreeNode } from '@/types';

interface MainSidebarProps {
  className?: string;
}

interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
  badge?: string | number;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const NavItem = ({
  href,
  icon: Icon,
  label,
  isActive,
  badge,
  isCollapsed,
  onClick,
}: NavItemProps) => (
  <Link href={href} onClick={onClick}>
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        isActive &&
          'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400',
        isCollapsed && 'justify-center px-2'
      )}
    >
      <Icon className='h-4 w-4 flex-shrink-0' />
      {!isCollapsed && (
        <>
          <span className='flex-1 truncate'>{label}</span>
          {badge && (
            <Badge variant='secondary' className='ml-auto'>
              {badge}
            </Badge>
          )}
        </>
      )}
    </div>
  </Link>
);

interface PageTreeItemProps {
  node: PageTreeNode;
  level: number;
  isCollapsed: boolean;
  workspaceId: number;
}

const PageTreeItem = ({
  node,
  level,
  isCollapsed,
  workspaceId,
}: PageTreeItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === `/workspace/${workspaceId}/page/${node.id}`;

  if (isCollapsed) return null;

  return (
    <div>
      <Link href={`/workspace/${workspaceId}/page/${node.id}`}>
        <div
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800',
            isActive &&
              'bg-gray-100 text-blue-600 dark:bg-gray-800 dark:text-blue-400'
          )}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {node.hasChildren &&
            (node.isExpanded ? (
              <ChevronDown className='h-3 w-3 text-gray-500' />
            ) : (
              <ChevronRight className='h-3 w-3 text-gray-500' />
            ))}
          {node.icon ? (
            <span className='text-xs'>{node.icon}</span>
          ) : (
            <FileText className='h-3 w-3 text-gray-500' />
          )}
          <span className='flex-1 truncate'>{node.title}</span>
        </div>
      </Link>

      {node.isExpanded &&
        node.children?.map(child => (
          <PageTreeItem
            key={child.id}
            node={child}
            level={level + 1}
            isCollapsed={isCollapsed}
            workspaceId={workspaceId}
          />
        ))}
    </div>
  );
};

export function MainSidebar({ className }: MainSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { collapsed, toggle } = useSidebar();
  const currentWorkspace = useCurrentWorkspace();
  const pageTree = usePageTree();

  const navigationItems = [
    {
      href: '/dashboard',
      icon: Home,
      label: '대시보드',
      isActive: pathname === '/dashboard',
    },
    {
      href: currentWorkspace
        ? `/workspace/${currentWorkspace.id}`
        : '/workspace',
      icon: FolderOpen,
      label: '워크스페이스',
      isActive: pathname.startsWith('/workspace'),
    },
    {
      href: '/search',
      icon: Search,
      label: '검색',
      isActive: pathname === '/search',
    },
    {
      href: '/settings',
      icon: Settings,
      label: '설정',
      isActive: pathname === '/settings',
    },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-800 dark:bg-gray-900',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* 상단 헤더 */}
      <div className='flex items-center gap-3 border-b border-gray-200 p-4 dark:border-gray-800'>
        {!collapsed && user && (
          <>
            <Avatar className='h-8 w-8'>
              <img
                src={user.profileImageUrl || '/default-avatar.png'}
                alt={user.username}
              />
            </Avatar>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-sm font-medium text-gray-900 dark:text-gray-100'>
                {user.username}
              </p>
              <p className='truncate text-xs text-gray-500 dark:text-gray-400'>
                {user.email}
              </p>
            </div>
          </>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={toggle}
          className='h-8 w-8 p-0'
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform',
              !collapsed && 'rotate-180'
            )}
          />
        </Button>
      </div>

      {/* 메인 내비게이션 */}
      <div className='flex-1 overflow-y-auto'>
        <div className='space-y-1 p-3'>
          {navigationItems.map(item => (
            <NavItem key={item.href} {...item} isCollapsed={collapsed} />
          ))}
        </div>

        {/* 워크스페이스 정보 */}
        {currentWorkspace && !collapsed && (
          <div className='px-3 py-2'>
            <div className='border-t border-gray-200 pt-3 dark:border-gray-800'>
              <div className='mb-3 flex items-center gap-2'>
                <div className='flex min-w-0 flex-1 items-center gap-2'>
                  {currentWorkspace.icon ? (
                    <span className='text-lg'>{currentWorkspace.icon}</span>
                  ) : (
                    <FolderOpen className='h-4 w-4 text-gray-500' />
                  )}
                  <div className='min-w-0 flex-1'>
                    <h3 className='truncate text-sm font-medium text-gray-900 dark:text-gray-100'>
                      {currentWorkspace.name}
                    </h3>
                    <div className='flex items-center gap-1'>
                      {currentWorkspace.visibility === 'PUBLIC' ? (
                        <Globe className='h-3 w-3 text-gray-400' />
                      ) : (
                        <Lock className='h-3 w-3 text-gray-400' />
                      )}
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        {currentWorkspace.visibility === 'PUBLIC'
                          ? '공개'
                          : '비공개'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                  <Plus className='h-3 w-3' />
                </Button>
              </div>

              {/* 페이지 트리 */}
              <div className='space-y-0.5'>
                {pageTree.map(node => (
                  <PageTreeItem
                    key={node.id}
                    node={node}
                    level={0}
                    isCollapsed={collapsed}
                    workspaceId={currentWorkspace.id}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 액션 */}
      {!collapsed && (
        <div className='border-t border-gray-200 p-3 dark:border-gray-800'>
          <Button className='w-full' size='sm'>
            <Plus className='mr-2 h-4 w-4' />새 페이지
          </Button>
        </div>
      )}
    </aside>
  );
}
