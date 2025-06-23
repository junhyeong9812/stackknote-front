// components/layout/header.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Bell, 
  Settings,
  Menu,
  ChevronDown,
  Plus,
  Share,
  MoreHorizontal
} from 'lucide-react';
import { 
  Button, 
  Input,
  Badge,
  Avatar,
  Dialog,
  DialogContent,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui';
import { useAuth, useSearch, useMobile, useCurrentPage, useNotifications } from '@/lib/stores';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { query, setQuery, focused, setFocused } = useSearch();
  const { isMobile, setMenuOpen } = useMobile();
  const currentPage = useCurrentPage();
  const { notifications } = useNotifications();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 현재 페이지 타이틀 결정
  const getPageTitle = () => {
    if (pathname === '/dashboard') return '대시보드';
    if (pathname.startsWith('/workspace')) {
      if (currentPage) return currentPage.title;
      return '워크스페이스';
    }
    if (pathname === '/search') return '검색';
    if (pathname === '/settings') return '설정';
    return 'StackNote';
  };

  return (
    <header className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="flex items-center justify-between h-14 px-4 gap-4">
        {/* 좌측: 모바일 메뉴 + 제목 */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMenuOpen(true)}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {getPageTitle()}
            </h1>
            
            {/* 페이지 액션 버튼들 */}
            {currentPage && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Share className="h-3 w-3 mr-1" />
                  공유
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 중앙: 검색바 */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="페이지 검색..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* 우측: 알림 + 프로필 */}
        <div className="flex items-center gap-2">
          {/* 새 페이지 버튼 */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Plus className="h-4 w-4" />
          </Button>

          {/* 알림 버튼 */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bell className="h-4 w-4" />
            </Button>
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>

          {/* 설정 버튼 */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>

          {/* 프로필 드롭다운 */}
          {user && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 gap-2 px-2">
                  <Avatar className="h-6 w-6">
                    <img src={user.profileImageUrl || '/default-avatar.png'} alt={user.username} />
                  </Avatar>
                  {!isMobile && (
                    <>
                      <span className="text-sm font-medium truncate max-w-20">
                        {user.username}
                      </span>
                      <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <img src={user.profileImageUrl || '/default-avatar.png'} alt={user.username} />
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      프로필 설정
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      테마 설정
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      로그아웃
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}