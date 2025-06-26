'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Menu,
  Search,
  Settings,
  User,
  LogOut,
  Plus,
  Share,
  FileText,
  Users,
  Star,
  MoreHorizontal,
  Sun,
  Moon,
  Monitor,
  HelpCircle,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserAvatar, AvatarGroup } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { SimpleTooltip, KeyboardTooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils/cn';
import { setTheme, getCurrentTheme, type Theme } from '@/lib/utils/theme';
import { useAuth } from '@/lib/stores/auth-store';
import {
  useSearch,
  useMobile,
  useNotifications,
  useTheme,
} from '@/lib/stores/ui-store';

// 임시 사용자 데이터
const mockUser = {
  id: 1,
  name: '김철수',
  email: 'user@example.com',
  username: 'kimcs',
  avatar: '/avatars/user.jpg',
  initials: '김철',
};

// 임시 알림 데이터
const mockNotifications = [
  {
    id: 1,
    title: '새로운 댓글',
    description: 'API 문서 페이지에 댓글이 달렸습니다.',
    time: '2분 전',
    unread: true,
    type: 'comment',
  },
  {
    id: 2,
    title: '워크스페이스 초대',
    description: 'Design System 워크스페이스에 초대되었습니다.',
    time: '1시간 전',
    unread: true,
    type: 'invitation',
  },
  {
    id: 3,
    title: '페이지 공유',
    description: '회의록 페이지가 공유되었습니다.',
    time: '어제',
    unread: false,
    type: 'share',
  },
];

// 알림 패널
function NotificationPanel() {
  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='relative'>
          <SimpleTooltip content='알림'>
            <Button variant='ghost' size='sm' className='h-9 w-9 p-0'>
              <Bell className='h-4 w-4' />
            </Button>
          </SimpleTooltip>
          {unreadCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs'
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='flex items-center justify-between'>
          알림
          {unreadCount > 0 && (
            <Button variant='ghost' size='sm' className='h-auto p-1 text-xs'>
              모두 읽음
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className='max-h-96 overflow-y-auto'>
          {mockNotifications.map(notification => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                'flex cursor-pointer flex-col items-start gap-1 p-3',
                notification.unread && 'bg-muted/50'
              )}
            >
              <div className='flex w-full items-center gap-2'>
                <div
                  className={cn(
                    'h-2 w-2 rounded-full',
                    notification.unread ? 'bg-primary' : 'bg-transparent'
                  )}
                />
                <div className='min-w-0 flex-1'>
                  <div className='text-sm font-medium'>
                    {notification.title}
                  </div>
                  <div className='text-muted-foreground truncate text-xs'>
                    {notification.description}
                  </div>
                </div>
                <div className='text-muted-foreground text-xs'>
                  {notification.time}
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/notifications' className='w-full text-center'>
            모든 알림 보기
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 사용자 메뉴
function UserMenu() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
  };

  const { theme: currentTheme } = getCurrentTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <UserAvatar
            src={mockUser.avatar}
            name={mockUser.name}
            size='default'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>{mockUser.name}</p>
            <p className='text-muted-foreground text-xs leading-none'>
              {mockUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href='/profile'>
            <User className='mr-2 h-4 w-4' />
            프로필
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href='/settings'>
            <Settings className='mr-2 h-4 w-4' />
            설정
          </Link>
        </DropdownMenuItem>

        {/* 테마 설정 */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Sun className='mr-2 h-4 w-4' />
            테마
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => handleThemeChange('light')}
              className={currentTheme === 'light' ? 'bg-accent' : ''}
            >
              <Sun className='mr-2 h-4 w-4' />
              라이트
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleThemeChange('dark')}
              className={currentTheme === 'dark' ? 'bg-accent' : ''}
            >
              <Moon className='mr-2 h-4 w-4' />
              다크
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleThemeChange('system')}
              className={currentTheme === 'system' ? 'bg-accent' : ''}
            >
              <Monitor className='mr-2 h-4 w-4' />
              시스템
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href='/help'>
            <HelpCircle className='mr-2 h-4 w-4' />
            도움말
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href='/feedback'>
            <MessageSquare className='mr-2 h-4 w-4' />
            피드백
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TopNavigation() {
  const { query, setQuery, focused, setFocused } = useSearch();
  const { isMobile, setMenuOpen } = useMobile();

  return (
    <div className='flex h-14 items-center justify-between gap-4 px-4'>
      {/* 좌측: 모바일 메뉴 + 제목 */}
      <div className='flex items-center gap-3'>
        {isMobile && (
          <SimpleTooltip content='메뉴 열기'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setMenuOpen(true)}
              className='h-8 w-8 p-0'
            >
              <Menu className='h-4 w-4' />
            </Button>
          </SimpleTooltip>
        )}

        <div className='flex items-center gap-3'>
          {/* 페이지 액션 버튼들 */}
          <div className='flex items-center gap-1'>
            <SimpleTooltip content='공유'>
              <Button variant='ghost' size='sm' className='h-7 px-2'>
                <Share className='mr-1 h-3 w-3' />
                공유
              </Button>
            </SimpleTooltip>
            <SimpleTooltip content='더보기'>
              <Button variant='ghost' size='sm' className='h-7 w-7 p-0'>
                <MoreHorizontal className='h-3 w-3' />
              </Button>
            </SimpleTooltip>
          </div>
        </div>
      </div>

      {/* 중앙: 검색바 */}
      <div className='mx-4 max-w-md flex-1'>
        <div className='relative'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
          <Input
            placeholder='페이지 검색...'
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className='pr-4 pl-10'
          />
        </div>
      </div>

      {/* 우측: 액션 버튼들 */}
      <div className='flex items-center gap-2'>
        {/* 새 페이지 버튼 */}
        <KeyboardTooltip description='새 페이지 만들기' keys={['Ctrl', 'N']}>
          <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
            <Plus className='h-4 w-4' />
          </Button>
        </KeyboardTooltip>

        {/* 알림 버튼 */}
        <NotificationPanel />

        {/* 설정 버튼 */}
        <SimpleTooltip content='설정'>
          <Button variant='ghost' size='sm' className='h-8 w-8 p-0' asChild>
            <Link href='/settings'>
              <Settings className='h-4 w-4' />
            </Link>
          </Button>
        </SimpleTooltip>

        {/* 프로필 드롭다운 */}
        <UserMenu />
      </div>
    </div>
  );
}
