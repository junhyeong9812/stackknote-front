'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Users,
  TrendingUp,
  Clock,
  Star,
  Plus,
  ArrowRight,
  Calendar,
  MessageSquare,
  Activity,
  Folder,
  Settings,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, StatCard, ImageCard } from '@/components/ui/card';
import { UserAvatar, AvatarGroup } from '@/components/ui/avatar';
import { Badge, StatusBadge, NewBadge } from '@/components/ui/badge';
import { Progress, ProgressWithLabel } from '@/components/ui/progress';
import { SimpleTooltip } from '@/components/ui/tooltip';
import { SimpleTabs, type TabItem } from '@/components/ui/tabs';

// 임시 데이터
const mockStats = {
  totalPages: 47,
  totalWorkspaces: 3,
  totalMembers: 12,
  weeklyActivity: 85,
};

const mockRecentPages = [
  {
    id: 1,
    title: 'API 설계 문서',
    workspace: '개발팀',
    lastModified: '2시간 전',
    author: '김철수',
    avatar: '/avatars/user1.jpg',
    isPublished: true,
  },
  {
    id: 2,
    title: '프로젝트 회의록',
    workspace: 'Team Project',
    lastModified: '어제',
    author: '이영희',
    avatar: '/avatars/user2.jpg',
    isPublished: false,
  },
  {
    id: 3,
    title: '디자인 시스템 가이드',
    workspace: 'Design System',
    lastModified: '3일 전',
    author: '박민수',
    avatar: '/avatars/user3.jpg',
    isPublished: true,
  },
];

const mockWorkspaces = [
  {
    id: 1,
    name: '개발팀',
    description: '백엔드 & 프론트엔드 개발',
    icon: '💻',
    memberCount: 8,
    pageCount: 23,
    isOwner: true,
  },
  {
    id: 2,
    name: 'Team Project',
    description: '팀 프로젝트 관리',
    icon: '🚀',
    memberCount: 5,
    pageCount: 15,
    isOwner: false,
  },
  {
    id: 3,
    name: 'Design System',
    description: '디자인 시스템 & UI 컴포넌트',
    icon: '🎨',
    memberCount: 3,
    pageCount: 9,
    isOwner: true,
  },
];

const mockActivity = [
  {
    id: 1,
    type: 'page_created',
    user: '김철수',
    action: '새 페이지를 만들었습니다',
    target: 'API 설계 문서',
    time: '2시간 전',
    avatar: '/avatars/user1.jpg',
  },
  {
    id: 2,
    type: 'comment_added',
    user: '이영희',
    action: '댓글을 남겼습니다',
    target: '프로젝트 회의록',
    time: '4시간 전',
    avatar: '/avatars/user2.jpg',
  },
  {
    id: 3,
    type: 'workspace_joined',
    user: '박민수',
    action: '워크스페이스에 참여했습니다',
    target: 'Design System',
    time: '어제',
    avatar: '/avatars/user3.jpg',
  },
];

function StatsOverview() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
      <StatCard
        title='총 페이지'
        value={mockStats.totalPages}
        description='이번 주 +3'
        icon={<FileText className='h-4 w-4' />}
        trend={{ value: 8, isPositive: true }}
      />
      <StatCard
        title='워크스페이스'
        value={mockStats.totalWorkspaces}
        description='활성 워크스페이스'
        icon={<Folder className='h-4 w-4' />}
      />
      <StatCard
        title='팀 멤버'
        value={mockStats.totalMembers}
        description='총 협업자 수'
        icon={<Users className='h-4 w-4' />}
        trend={{ value: 15, isPositive: true }}
      />
      <StatCard
        title='주간 활동'
        value={`${mockStats.weeklyActivity}%`}
        description='지난 주 대비'
        icon={<TrendingUp className='h-4 w-4' />}
        trend={{ value: 12, isPositive: true }}
      />
    </div>
  );
}

function RecentPages() {
  return (
    <Card>
      <div className='p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>최근 페이지</h3>
          <Button variant='ghost' size='sm' asChild>
            <Link href='/recent'>
              전체 보기
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>

        <div className='space-y-3'>
          {mockRecentPages.map(page => (
            <div
              key={page.id}
              className='hover:bg-muted/50 flex items-center gap-3 rounded-lg p-3 transition-colors'
            >
              <FileText className='text-muted-foreground h-4 w-4' />
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <Link
                    href={`/workspace/1/page/${page.id}`}
                    className='hover:text-primary truncate font-medium transition-colors'
                  >
                    {page.title}
                  </Link>
                  {page.isPublished && (
                    <StatusBadge
                      status='success'
                      label='공개'
                      showDot={false}
                    />
                  )}
                </div>
                <div className='text-muted-foreground text-sm'>
                  {page.workspace} • {page.lastModified}
                </div>
              </div>
              <UserAvatar src={page.avatar} name={page.author} size='sm' />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function WorkspaceGrid() {
  return (
    <Card>
      <div className='p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>내 워크스페이스</h3>
          <Button size='sm'>
            <Plus className='mr-2 h-4 w-4' />새 워크스페이스
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {mockWorkspaces.map(workspace => (
            <Card
              key={workspace.id}
              className='cursor-pointer p-4 transition-shadow hover:shadow-md'
            >
              <Link href={`/workspace/${workspace.id}`}>
                <div className='flex items-start gap-3'>
                  <div className='text-2xl'>{workspace.icon}</div>
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <h4 className='truncate font-medium'>{workspace.name}</h4>
                      {workspace.isOwner && (
                        <Badge variant='secondary' className='text-xs'>
                          소유자
                        </Badge>
                      )}
                    </div>
                    <p className='text-muted-foreground mt-1 truncate text-sm'>
                      {workspace.description}
                    </p>
                    <div className='text-muted-foreground mt-3 flex items-center gap-4 text-xs'>
                      <span className='flex items-center gap-1'>
                        <Users className='h-3 w-3' />
                        {workspace.memberCount}명
                      </span>
                      <span className='flex items-center gap-1'>
                        <FileText className='h-3 w-3' />
                        {workspace.pageCount}개
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ActivityFeed() {
  return (
    <Card>
      <div className='p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>최근 활동</h3>
          <Button variant='ghost' size='sm' asChild>
            <Link href='/activity'>
              전체 보기
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>

        <div className='space-y-4'>
          {mockActivity.map(activity => (
            <div key={activity.id} className='flex items-start gap-3'>
              <UserAvatar
                src={activity.avatar}
                name={activity.user}
                size='sm'
              />
              <div className='min-w-0 flex-1'>
                <p className='text-sm'>
                  <span className='font-medium'>{activity.user}</span>
                  <span className='text-muted-foreground'>
                    {' '}
                    {activity.action}{' '}
                  </span>
                  <span className='font-medium'>{activity.target}</span>
                </p>
                <p className='text-muted-foreground text-xs'>{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card>
      <div className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>빠른 실행</h3>
        <div className='grid grid-cols-2 gap-3'>
          <Button
            variant='outline'
            className='flex h-auto flex-col gap-2 p-4'
            asChild
          >
            <Link href='/create/page'>
              <FileText className='h-5 w-5' />
              <span className='text-sm'>새 페이지</span>
            </Link>
          </Button>

          <Button
            variant='outline'
            className='flex h-auto flex-col gap-2 p-4'
            asChild
          >
            <Link href='/create/workspace'>
              <Folder className='h-5 w-5' />
              <span className='text-sm'>워크스페이스</span>
            </Link>
          </Button>

          <Button
            variant='outline'
            className='flex h-auto flex-col gap-2 p-4'
            asChild
          >
            <Link href='/templates'>
              <Star className='h-5 w-5' />
              <span className='text-sm'>템플릿</span>
            </Link>
          </Button>

          <Button
            variant='outline'
            className='flex h-auto flex-col gap-2 p-4'
            asChild
          >
            <Link href='/search'>
              <Search className='h-5 w-5' />
              <span className='text-sm'>검색</span>
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function WeeklyProgress() {
  return (
    <Card>
      <div className='p-6'>
        <h3 className='mb-4 text-lg font-semibold'>이번 주 진행률</h3>
        <div className='space-y-4'>
          <ProgressWithLabel
            label='페이지 작성'
            value={75}
            description='목표: 10개 페이지'
          />
          <ProgressWithLabel
            label='댓글 활동'
            value={60}
            description='목표: 20개 댓글'
          />
          <ProgressWithLabel
            label='협업 참여'
            value={90}
            description='목표: 5개 워크스페이스'
            variant='success'
          />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const tabItems: TabItem[] = [
    {
      value: 'overview',
      label: '개요',
      content: (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
            <div className='space-y-6 lg:col-span-2'>
              <RecentPages />
              <WorkspaceGrid />
            </div>
            <div className='space-y-6'>
              <QuickActions />
              <WeeklyProgress />
              <ActivityFeed />
            </div>
          </div>
        </div>
      ),
    },
    {
      value: 'activity',
      label: '활동',
      badge: <NewBadge />,
      content: (
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <ActivityFeed />
          <Card>
            <div className='p-6'>
              <h3 className='mb-4 text-lg font-semibold'>활동 통계</h3>
              <div className='space-y-4'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>오늘</span>
                  <span className='text-sm font-medium'>12개 활동</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>이번 주</span>
                  <span className='text-sm font-medium'>47개 활동</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground text-sm'>이번 달</span>
                  <span className='text-sm font-medium'>156개 활동</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      value: 'favorites',
      label: '즐겨찾기',
      icon: <Star className='h-4 w-4' />,
      content: (
        <div>
          <Card>
            <div className='p-6'>
              <h3 className='mb-4 text-lg font-semibold'>즐겨찾는 페이지</h3>
              <div className='text-muted-foreground py-8 text-center'>
                <Star className='mx-auto mb-4 h-12 w-12 opacity-50' />
                <p>아직 즐겨찾기한 페이지가 없습니다.</p>
                <p className='text-sm'>
                  페이지에서 별표를 클릭하여 즐겨찾기에 추가하세요.
                </p>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className='container mx-auto max-w-7xl px-6 py-8'>
      {/* 헤더 */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>대시보드</h1>
            <p className='text-muted-foreground mt-2'>
              안녕하세요, 김철수님! 오늘도 좋은 하루 되세요.
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' size='sm' asChild>
              <Link href='/settings'>
                <Settings className='mr-2 h-4 w-4' />
                설정
              </Link>
            </Button>
            <Button size='sm' asChild>
              <Link href='/create/page'>
                <Plus className='mr-2 h-4 w-4' />새 페이지
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <StatsOverview />

      {/* 메인 컨텐츠 */}
      <div className='mt-8'>
        <SimpleTabs items={tabItems} defaultValue='overview' variant='line' />
      </div>
    </div>
  );
}
