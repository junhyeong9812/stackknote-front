'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  FileText, 
  Users, 
  Settings, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  Lock,
  Globe,
  Calendar,
  Archive,
  Trash2,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  UserPlus,
  Share,
  Eye,
  Edit
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, SearchInput } from '@/components/ui/input'
import { Card, StatCard } from '@/components/ui/card'
import { UserAvatar, AvatarGroup } from '@/components/ui/avatar'
import { Badge, StatusBadge, NewBadge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  SimpleTabs,
  type TabItem 
} from '@/components/ui/tabs'
import { 
  SimpleSelect,
  type SelectOption 
} from '@/components/ui/select'
import { cn } from '@/lib/utils/cn'

// 임시 데이터
const mockWorkspace = {
  id: 1,
  name: '개발팀',
  description: '백엔드 & 프론트엔드 개발 워크스페이스',
  icon: '💻',
  coverImageUrl: '/workspace-covers/dev-team.jpg',
  isOwner: true,
  memberCount: 8,
  pageCount: 23,
  visibility: 'PRIVATE' as 'PUBLIC' | 'PRIVATE',
  createdAt: '2024-01-01',
  members: [
    { id: 1, name: '김철수', avatar: '/avatars/user1.jpg', role: 'OWNER' },
    { id: 2, name: '이영희', avatar: '/avatars/user2.jpg', role: 'ADMIN' },
    { id: 3, name: '박민수', avatar: '/avatars/user3.jpg', role: 'MEMBER' },
    { id: 4, name: '정수진', avatar: '/avatars/user4.jpg', role: 'MEMBER' },
    { id: 5, name: '최동훈', avatar: '/avatars/user5.jpg', role: 'VIEWER' },
  ]
}

const mockPages = [
  {
    id: 1,
    title: 'API 설계 문서',
    icon: '📝',
    isPublic: true,
    isLocked: false,
    hasChildren: true,
    level: 0,
    lastModified: '2시간 전',
    author: '김철수',
    viewCount: 156,
    children: [
      {
        id: 2,
        title: '인증 API',
        icon: null,
        isPublic: false,
        isLocked: false,
        hasChildren: false,
        level: 1,
        lastModified: '3시간 전',
        author: '이영희',
        viewCount: 89,
      },
      {
        id: 3,
        title: '사용자 API',
        icon: null,
        isPublic: true,
        isLocked: true,
        hasChildren: false,
        level: 1,
        lastModified: '1일 전',
        author: '박민수',
        viewCount: 124,
      }
    ]
  },
  {
    id: 4,
    title: '프로젝트 회의록',
    icon: '📋',
    isPublic: false,
    isLocked: false,
    hasChildren: true,
    level: 0,
    lastModified: '어제',
    author: '이영희',
    viewCount: 67,
    children: [
      {
        id: 5,
        title: '2024년 1월 회의',
        icon: null,
        isPublic: false,
        isLocked: false,
        hasChildren: false,
        level: 1,
        lastModified: '3일 전',
        author: '정수진',
        viewCount: 34,
      }
    ]
  },
  {
    id: 6,
    title: '코딩 컨벤션',
    icon: '📚',
    isPublic: true,
    isLocked: false,
    hasChildren: false,
    level: 0,
    lastModified: '1주 전',
    author: '최동훈',
    viewCount: 201,
  }
]

const sortOptions: SelectOption[] = [
  { value: 'lastModified', label: '최근 수정순' },
  { value: 'title', label: '제목순' },
  { value: 'created', label: '생성일순' },
  { value: 'views', label: '조회수순' },
]

const filterOptions: SelectOption[] = [
  { value: 'all', label: '전체 페이지' },
  { value: 'public', label: '공개 페이지' },
  { value: 'private', label: '비공개 페이지' },
  { value: 'favorites', label: '즐겨찾기' },
]

// 워크스페이스 헤더 컴포넌트
function WorkspaceHeader() {
  return (
    <div className="relative">
      {/* 커버 이미지 */}
      <div 
        className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative"
        style={mockWorkspace.coverImageUrl ? {
          backgroundImage: `url(${mockWorkspace.coverImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                워크스페이스 설정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                멤버 초대
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                공유 설정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Archive className="mr-2 h-4 w-4" />
                워크스페이스 보관
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 워크스페이스 정보 */}
      <div className="px-6 pb-6">
        <div className="flex items-start gap-4 -mt-6">
          <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-lg border-2 border-white dark:border-gray-900 flex items-center justify-center text-2xl shadow-sm">
            {mockWorkspace.icon}
          </div>
          <div className="flex-1 min-w-0 mt-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{mockWorkspace.name}</h1>
              <StatusBadge 
                status={mockWorkspace.visibility === 'PUBLIC' ? 'success' : 'inactive'} 
                label={mockWorkspace.visibility === 'PUBLIC' ? '공개' : '비공개'}
                showDot={false}
              />
              {mockWorkspace.isOwner && (
                <Badge variant="secondary" className="text-xs">소유자</Badge>
              )}
            </div>
            <p className="text-muted-foreground mb-3">{mockWorkspace.description}</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {mockWorkspace.memberCount}명
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {mockWorkspace.pageCount}개 페이지
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {mockWorkspace.createdAt} 생성
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <AvatarGroup 
              avatars={mockWorkspace.members.slice(0, 4)}
              max={4}
              size="sm"
            />
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              초대
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 페이지 트리 아이템 컴포넌트
interface PageTreeItemProps {
  page: any
  level?: number
  expanded?: boolean
  onToggle?: (pageId: number) => void
}

function PageTreeItem({ page, level = 0, expanded = false, onToggle }: PageTreeItemProps) {
  return (
    <div>
      <div 
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted/50 transition-colors group',
          'cursor-pointer'
        )}
        style={{ paddingLeft: `${level * 16 + 12}px` }}
      >
        {/* 확장/축소 버튼 */}
        {page.hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onToggle?.(page.id)}
          >
            {expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        ) : (
          <div className="w-4" />
        )}

        {/* 페이지 아이콘 */}
        <div className="w-4 h-4 flex items-center justify-center">
          {page.icon ? (
            <span className="text-xs">{page.icon}</span>
          ) : (
            <FileText className="h-3 w-3 text-muted-foreground" />
          )}
        </div>

        {/* 페이지 제목 */}
        <Link 
          href={`/workspace/${mockWorkspace.id}/page/${page.id}`}
          className="flex-1 min-w-0 flex items-center gap-2 hover:text-primary transition-colors"
        >
          <span className="truncate">{page.title}</span>
          
          {/* 상태 아이콘 */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {page.isPublic && <Globe className="h-3 w-3 text-green-600" />}
            {page.isLocked && <Lock className="h-3 w-3 text-orange-600" />}
          </div>
        </Link>

        {/* 메타 정보 */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <span>{page.lastModified}</span>
          <span>{page.viewCount} 조회</span>
        </div>

        {/* 더보기 메뉴 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              페이지 열기
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              편집
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plus className="h-4 w-4 mr-2" />
              하위 페이지 추가
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Star className="h-4 w-4 mr-2" />
              즐겨찾기
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share className="h-4 w-4 mr-2" />
              공유
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Archive className="h-4 w-4 mr-2" />
              보관함으로 이동
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 하위 페이지들 */}
      {expanded && page.children && (
        <div>
          {page.children.map((child: any) => (
            <PageTreeItem
              key={child.id}
              page={child}
              level={level + 1}
              expanded={false}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// 페이지 목록 컴포넌트
function PagesList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('lastModified')
  const [filterBy, setFilterBy] = useState('all')
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set([1, 4]))

  const togglePageExpansion = (pageId: number) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(pageId)) {
        newSet.delete(pageId)
      } else {
        newSet.add(pageId)
      }
      return newSet
    })
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">페이지</h3>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            새 페이지
          </Button>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex items-center gap-3 mb-4">
          <SearchInput
            placeholder="페이지 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <SimpleSelect
            options={sortOptions}
            value={sortBy}
            onValueChange={setSortBy}
            placeholder="정렬"
          />
          <SimpleSelect
            options={filterOptions}
            value={filterBy}
            onValueChange={setFilterBy}
            placeholder="필터"
          />
        </div>

        {/* 페이지 트리 */}
        <div className="space-y-1">
          {mockPages.map((page) => (
            <PageTreeItem
              key={page.id}
              page={page}
              expanded={expandedPages.has(page.id)}
              onToggle={togglePageExpansion}
            />
          ))}
        </div>

        {/* 빈 상태 */}
        {mockPages.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h4 className="text-lg font-medium mb-2">페이지가 없습니다</h4>
            <p className="text-muted-foreground mb-4">
              첫 번째 페이지를 만들어 시작해보세요.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 페이지 만들기
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

// 멤버 목록 컴포넌트
function MembersList() {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">멤버</h3>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            멤버 초대
          </Button>
        </div>

        <div className="space-y-3">
          {mockWorkspace.members.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <UserAvatar 
                src={member.avatar}
                name={member.name}
                size="default"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">
                  {member.role === 'OWNER' && '소유자'}
                  {member.role === 'ADMIN' && '관리자'}
                  {member.role === 'MEMBER' && '멤버'}
                  {member.role === 'VIEWER' && '뷰어'}
                </div>
              </div>
              <Badge 
                variant={member.role === 'OWNER' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {member.role === 'OWNER' && '소유자'}
                {member.role === 'ADMIN' && '관리자'}
                {member.role === 'MEMBER' && '멤버'}
                {member.role === 'VIEWER' && '뷰어'}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>역할 변경</DropdownMenuItem>
                  <DropdownMenuItem>메시지 보내기</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    멤버 제거
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

// 활동 내역 컴포넌트
function ActivityList() {
  const activities = [
    {
      id: 1,
      user: '김철수',
      avatar: '/avatars/user1.jpg',
      action: 'API 설계 문서를 수정했습니다',
      time: '2시간 전'
    },
    {
      id: 2,
      user: '이영희',
      avatar: '/avatars/user2.jpg',
      action: '프로젝트 회의록에 댓글을 달았습니다',
      time: '4시간 전'
    },
    {
      id: 3,
      user: '박민수',
      avatar: '/avatars/user3.jpg',
      action: '새 페이지 "사용자 API"를 만들었습니다',
      time: '1일 전'
    }
  ]

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">최근 활동</h3>
        
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <UserAvatar 
                src={activity.avatar}
                name={activity.user}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>
                  <span className="text-muted-foreground">님이 {activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default function WorkspacePage() {
  const params = useParams()
  const workspaceId = params.workspaceId

  const tabItems: TabItem[] = [
    {
      value: 'pages',
      label: '페이지',
      icon: <FileText className="h-4 w-4" />,
      badge: <Badge variant="secondary" className="text-xs">{mockWorkspace.pageCount}</Badge>,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PagesList />
          </div>
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">워크스페이스 통계</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">총 페이지</span>
                    <span className="text-sm font-medium">{mockWorkspace.pageCount}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">공개 페이지</span>
                    <span className="text-sm font-medium">12개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">이번 주 생성</span>
                    <span className="text-sm font-medium">3개</span>
                  </div>
                </div>
              </div>
            </Card>
            <ActivityList />
          </div>
        </div>
      )
    },
    {
      value: 'members',
      label: '멤버',
      icon: <Users className="h-4 w-4" />,
      badge: <Badge variant="secondary" className="text-xs">{mockWorkspace.memberCount}</Badge>,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MembersList />
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">멤버 통계</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">소유자</span>
                  <span className="text-sm font-medium">1명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">관리자</span>
                  <span className="text-sm font-medium">1명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">멤버</span>
                  <span className="text-sm font-medium">5명</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">뷰어</span>
                  <span className="text-sm font-medium">1명</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      value: 'activity',
      label: '활동',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityList />
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">활동 통계</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">오늘</span>
                  <span className="text-sm font-medium">5개 활동</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">이번 주</span>
                  <span className="text-sm font-medium">23개 활동</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">이번 달</span>
                  <span className="text-sm font-medium">87개 활동</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      value: 'settings',
      label: '설정',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="max-w-2xl">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">워크스페이스 설정</h3>
              <p className="text-muted-foreground">
                워크스페이스 설정 페이지는 추후 구현 예정입니다.
              </p>
            </div>
          </Card>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* 워크스페이스 헤더 */}
      <WorkspaceHeader />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-6 pb-6">
        <SimpleTabs
          items={tabItems}
          defaultValue="pages"
          variant="line"
        />
      </div>
    </div>
  )
}