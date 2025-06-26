'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Share,
  MoreHorizontal,
  Lock,
  Globe,
  Users,
  MessageCircle,
  Clock,
  Eye,
  Settings,
  Trash2,
  Download,
  Copy,
  ExternalLink,
  Edit,
  Save,
  X,
  Plus,
  History,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserAvatar, AvatarGroup } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SimpleTooltip, KeyboardTooltip } from '@/components/ui/tooltip';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { BlockNoteEditor } from '@/components/editor/blocknote-editor';
import { cn } from '@/lib/utils/cn';
import { usePageStore } from '@/lib/stores/page-store';
import { useAuth } from '@/lib/stores/auth-store';
import { useNotifications } from '@/lib/stores/ui-store';

// 임시 데이터
const mockPage = {
  id: 1,
  title: 'API 설계 문서',
  icon: '📝',
  coverImage: null,
  isPublished: true,
  isLocked: false,
  isFavorite: false,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T10:30:00Z',
  author: {
    id: 1,
    name: '김철수',
    avatar: '/avatars/user1.jpg',
    username: 'kimcs',
  },
  workspace: {
    id: 1,
    name: '개발팀',
    icon: '💻',
  },
  collaborators: [
    { id: 1, name: '김철수', avatar: '/avatars/user1.jpg' },
    { id: 2, name: '이영희', avatar: '/avatars/user2.jpg' },
    { id: 3, name: '박민수', avatar: '/avatars/user3.jpg' },
  ],
  viewCount: 156,
  commentCount: 8,
  // BlockNote 호환 형식으로 변경
  content: [
    {
      id: 'heading-1',
      type: 'heading',
      props: { level: 1 },
      content: [{ type: 'text', text: 'API 설계 문서', styles: {} }],
      children: [],
    },
    {
      id: 'paragraph-1',
      type: 'paragraph',
      props: {},
      content: [
        {
          type: 'text',
          text: '이 문서는 우리 프로젝트의 API 설계에 대한 내용을 다룹니다.',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'heading-2',
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '개요', styles: {} }],
      children: [],
    },
    {
      id: 'paragraph-2',
      type: 'paragraph',
      props: {},
      content: [
        {
          type: 'text',
          text: 'RESTful API를 기반으로 설계하며, 다음과 같은 원칙을 따릅니다:',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'bullet-1',
      type: 'bulletListItem',
      props: {},
      content: [{ type: 'text', text: '명확한 리소스 네이밍', styles: {} }],
      children: [],
    },
    {
      id: 'bullet-2',
      type: 'bulletListItem',
      props: {},
      content: [{ type: 'text', text: '적절한 HTTP 메서드 사용', styles: {} }],
      children: [],
    },
    {
      id: 'bullet-3',
      type: 'bulletListItem',
      props: {},
      content: [{ type: 'text', text: '일관된 응답 형식', styles: {} }],
      children: [],
    },
  ],
};

// 페이지 헤더 컴포넌트
function PageHeader() {
  const router = useRouter();
  const params = useParams();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(mockPage.title);
  const [isFavorite, setIsFavorite] = useState(mockPage.isFavorite);
  const { showSuccessToast } = useNotifications();

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    showSuccessToast('페이지 제목이 저장되었습니다.');
    console.log('제목 저장:', title);
  };

  const handleTitleCancel = () => {
    setTitle(mockPage.title);
    setIsEditingTitle(false);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    showSuccessToast(isFavorite ? '즐겨찾기에서 제거했습니다.' : '즐겨찾기에 추가했습니다.');
  };

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* 좌측: 뒤로가기 + 제목 */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* 페이지 아이콘 */}
            <span className="text-lg">{mockPage.icon}</span>

            {/* 페이지 제목 */}
            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave();
                    if (e.key === 'Escape') handleTitleCancel();
                  }}
                  className="h-8"
                  autoFocus
                />
                <Button size="sm" onClick={handleTitleSave}>
                  <Save className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleTitleCancel}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-left font-semibold text-lg hover:text-primary transition-colors truncate"
              >
                {title}
              </button>
            )}

            {/* 페이지 상태 뱃지 */}
            <div className="flex items-center gap-1">
              {mockPage.isPublished && (
                <Badge variant="secondary" className="text-xs">
                  <Globe className="h-3 w-3 mr-1" />
                  공개
                </Badge>
              )}
              {mockPage.isLocked && (
                <Badge variant="secondary" className="text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  잠금
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 액션 버튼들 */}
        <div className="flex items-center gap-2">
          {/* 협업자 표시 */}
          <AvatarGroup
            avatars={mockPage.collaborators}
            max={3}
            size="sm"
          />

          {/* 즐겨찾기 */}
          <SimpleTooltip content={isFavorite ? '즐겨찾기 제거' : '즐겨찾기 추가'}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className={cn(
                "h-8 w-8 p-0",
                isFavorite && "text-yellow-500"
              )}
            >
              <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </Button>
          </SimpleTooltip>

          {/* 댓글 */}
          <SimpleTooltip content="댓글">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
              <MessageCircle className="h-4 w-4" />
              {mockPage.commentCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs"
                >
                  {mockPage.commentCount}
                </Badge>
              )}
            </Button>
          </SimpleTooltip>

          {/* 공유 */}
          <KeyboardTooltip description="공유" keys={['Ctrl', 'Shift', 'S']}>
            <Button variant="ghost" size="sm" className="h-8 px-3">
              <Share className="h-4 w-4 mr-1" />
              공유
            </Button>
          </KeyboardTooltip>

          {/* 더보기 메뉴 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                페이지 정보 수정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                페이지 복제
              </DropdownMenuItem>
              <DropdownMenuItem>
                <History className="h-4 w-4 mr-2" />
                버전 기록
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="h-4 w-4 mr-2" />
                새 창에서 열기
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                페이지 설정
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                페이지 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// 페이지 메타 정보 컴포넌트
function PageMeta() {
  return (
    <div className="px-6 py-4 border-b bg-muted/30">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <UserAvatar
              src={mockPage.author.avatar}
              name={mockPage.author.name}
              size="xs"
            />
            <span>{mockPage.author.name}님이 작성</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(mockPage.updatedAt).toLocaleDateString('ko-KR')} 업데이트</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{mockPage.viewCount.toLocaleString()}회 조회</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>{mockPage.commentCount}개 댓글</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 사이드바 컴포넌트 (댓글, 페이지 정보 등)
function PageSidebar() {
  const [activeTab, setActiveTab] = useState<'comments' | 'info' | 'history'>('comments');

  return (
    <div className="w-80 border-l bg-background/50 backdrop-blur">
      {/* 사이드바 헤더 */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'comments' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('comments')}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            댓글
          </Button>
          <Button
            variant={activeTab === 'info' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('info')}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            정보
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('history')}
          >
            <History className="h-4 w-4 mr-1" />
            기록
          </Button>
        </div>
      </div>

      {/* 사이드바 콘텐츠 */}
      <div className="p-4">
        {activeTab === 'comments' && (
          <div className="space-y-4">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>아직 댓글이 없습니다.</p>
              <p className="text-xs">페이지에 댓글을 달아보세요!</p>
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">페이지 정보</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">생성일</span>
                  <span>{new Date(mockPage.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">수정일</span>
                  <span>{new Date(mockPage.updatedAt).toLocaleDateString('ko-KR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">작성자</span>
                  <span>{mockPage.author.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">조회수</span>
                  <span>{mockPage.viewCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>버전 기록이 없습니다.</p>
              <p className="text-xs">페이지를 수정하면 기록이 생성됩니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 메인 페이지 에디터 컴포넌트
export default function PageEditor() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const pageId = params.pageId as string;
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // 페이지 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleContentChange = (content: any) => {
    console.log('Content changed:', content);
    // TODO: 실제 저장 로직
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* 브레드크럼 */}
      <div className="px-6 py-2 border-b">
        <Breadcrumb
          items={[
            { label: '홈', href: '/dashboard' },
            { label: mockPage.workspace.name, href: `/workspace/${workspaceId}` },
            { label: mockPage.title },
          ]}
        />
      </div>

      {/* 페이지 헤더 */}
      <PageHeader />

      {/* 페이지 메타 정보 */}
      <PageMeta />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 에디터 영역 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6">
              <BlockNoteEditor
                initialContent={undefined} // undefined로 설정하여 기본 콘텐츠 사용
                onContentChange={handleContentChange}
                placeholder="페이지 내용을 입력하세요..."
                className="min-h-[600px]"
              />
            </div>
          </div>
        </div>

        {/* 사이드바 */}
        {showSidebar && <PageSidebar />}
      </div>

      {/* 플로팅 액션 버튼 */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <SimpleTooltip content={showSidebar ? '사이드바 숨기기' : '사이드바 보이기'}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSidebar(!showSidebar)}
            className="rounded-full shadow-lg"
          >
            {showSidebar ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </SimpleTooltip>
      </div>
    </div>
  );
}