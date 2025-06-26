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
  Maximize2,
  Minimize2,
  Palette,
  Type,
  Layout,
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
import { AdvancedBlockNoteEditor } from '@/components/editor/advanced-blocknote-editor';
import { cn } from '@/lib/utils/cn';
import { usePageStore } from '@/lib/stores/page-store';
import { useAuth } from '@/lib/stores/auth-store';
import { useNotifications, useEditor } from '@/lib/stores/ui-store';

// 임시 데이터 (이전과 동일)
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
};

// 고급 페이지 헤더 컴포넌트
function AdvancedPageHeader() {
  const router = useRouter();
  const params = useParams();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(mockPage.title);
  const [isFavorite, setIsFavorite] = useState(mockPage.isFavorite);
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
  const { showSuccessToast } = useNotifications();
  const { fullscreen, setFullscreen } = useEditor();

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
    showSuccessToast(
      isFavorite ? '즐겨찾기에서 제거했습니다.' : '즐겨찾기에 추가했습니다.'
    );
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const toggleTheme = () => {
    setEditorTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='flex h-16 items-center justify-between px-6'>
        {/* 좌측: 뒤로가기 + 제목 */}
        <div className='flex min-w-0 flex-1 items-center gap-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.back()}
            className='h-8 w-8 p-0'
          >
            <ArrowLeft className='h-4 w-4' />
          </Button>

          <div className='flex min-w-0 flex-1 items-center gap-2'>
            {/* 페이지 아이콘 */}
            <span className='text-lg'>{mockPage.icon}</span>

            {/* 페이지 제목 */}
            {isEditingTitle ? (
              <div className='flex flex-1 items-center gap-2'>
                <Input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleTitleSave();
                    if (e.key === 'Escape') handleTitleCancel();
                  }}
                  className='h-8'
                  autoFocus
                />
                <Button size='sm' onClick={handleTitleSave}>
                  <Save className='h-3 w-3' />
                </Button>
                <Button variant='ghost' size='sm' onClick={handleTitleCancel}>
                  <X className='h-3 w-3' />
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className='hover:text-primary truncate text-left text-lg font-semibold transition-colors'
              >
                {title}
              </button>
            )}

            {/* 페이지 상태 뱃지 */}
            <div className='flex items-center gap-1'>
              {mockPage.isPublished && (
                <Badge variant='secondary' className='text-xs'>
                  <Globe className='mr-1 h-3 w-3' />
                  공개
                </Badge>
              )}
              {mockPage.isLocked && (
                <Badge variant='secondary' className='text-xs'>
                  <Lock className='mr-1 h-3 w-3' />
                  잠금
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 고급 액션 버튼들 */}
        <div className='flex items-center gap-2'>
          {/* 협업자 표시 */}
          <AvatarGroup avatars={mockPage.collaborators} max={3} size='sm' />

          {/* 에디터 테마 토글 */}
          <SimpleTooltip
            content={`${editorTheme === 'light' ? '다크' : '라이트'} 모드로 전환`}
          >
            <Button
              variant='ghost'
              size='sm'
              onClick={toggleTheme}
              className='h-8 w-8 p-0'
            >
              <Palette className='h-4 w-4' />
            </Button>
          </SimpleTooltip>

          {/* 전체화면 토글 */}
          <KeyboardTooltip description='전체화면' keys={['F11']}>
            <Button
              variant='ghost'
              size='sm'
              onClick={toggleFullscreen}
              className='h-8 w-8 p-0'
            >
              {fullscreen ? (
                <Minimize2 className='h-4 w-4' />
              ) : (
                <Maximize2 className='h-4 w-4' />
              )}
            </Button>
          </KeyboardTooltip>

          {/* 즐겨찾기 */}
          <SimpleTooltip
            content={isFavorite ? '즐겨찾기 제거' : '즐겨찾기 추가'}
          >
            <Button
              variant='ghost'
              size='sm'
              onClick={handleFavoriteToggle}
              className={cn('h-8 w-8 p-0', isFavorite && 'text-yellow-500')}
            >
              <Star className={cn('h-4 w-4', isFavorite && 'fill-current')} />
            </Button>
          </SimpleTooltip>

          {/* 댓글 */}
          <SimpleTooltip content='댓글'>
            <Button variant='ghost' size='sm' className='relative h-8 w-8 p-0'>
              <MessageCircle className='h-4 w-4' />
              {mockPage.commentCount > 0 && (
                <Badge
                  variant='destructive'
                  className='absolute -top-1 -right-1 h-4 w-4 p-0 text-xs'
                >
                  {mockPage.commentCount}
                </Badge>
              )}
            </Button>
          </SimpleTooltip>

          {/* 공유 */}
          <KeyboardTooltip description='공유' keys={['Ctrl', 'Shift', 'S']}>
            <Button variant='ghost' size='sm' className='h-8 px-3'>
              <Share className='mr-1 h-4 w-4' />
              공유
            </Button>
          </KeyboardTooltip>

          {/* 더보기 메뉴 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem>
                <Edit className='mr-2 h-4 w-4' />
                페이지 정보 수정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className='mr-2 h-4 w-4' />
                페이지 복제
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Type className='mr-2 h-4 w-4' />
                텍스트 설정
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Layout className='mr-2 h-4 w-4' />
                레이아웃 설정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <History className='mr-2 h-4 w-4' />
                버전 기록
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className='mr-2 h-4 w-4' />
                내보내기
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className='mr-2 h-4 w-4' />새 창에서 열기
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className='mr-2 h-4 w-4' />
                페이지 설정
              </DropdownMenuItem>
              <DropdownMenuItem className='text-destructive'>
                <Trash2 className='mr-2 h-4 w-4' />
                페이지 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// 에디터 통계 및 상태 표시 컴포넌트
function EditorStatusBar({
  wordCount,
  blockCount,
  isAutoSaving,
}: {
  wordCount: number;
  blockCount: number;
  isAutoSaving: boolean;
}) {
  return (
    <div className='bg-muted/30 text-muted-foreground flex items-center justify-between border-t px-6 py-2 text-xs'>
      <div className='flex items-center gap-4'>
        <span>블록 {blockCount.toLocaleString()}개</span>
        <span>단어 {wordCount.toLocaleString()}개</span>
        {isAutoSaving && (
          <div className='flex items-center gap-1 text-blue-600'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-blue-600'></div>
            자동 저장 중...
          </div>
        )}
      </div>

      <div className='flex items-center gap-4'>
        <span>마지막 저장: {new Date().toLocaleTimeString()}</span>
        <div className='flex items-center gap-1'>
          <kbd className='bg-background rounded border px-1.5 py-0.5 text-xs'>
            Ctrl
          </kbd>
          <span>+</span>
          <kbd className='bg-background rounded border px-1.5 py-0.5 text-xs'>
            S
          </kbd>
          <span>저장</span>
        </div>
      </div>
    </div>
  );
}

// 페이지 메타 정보 컴포넌트 (이전과 동일)
function PageMeta() {
  return (
    <div className='bg-muted/30 border-b px-6 py-4'>
      <div className='text-muted-foreground flex items-center justify-between text-sm'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <UserAvatar
              src={mockPage.author.avatar}
              name={mockPage.author.name}
              size='xs'
            />
            <span>{mockPage.author.name}님이 작성</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            <span>
              {new Date(mockPage.updatedAt).toLocaleDateString('ko-KR')}{' '}
              업데이트
            </span>
          </div>
        </div>

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <Eye className='h-3 w-3' />
            <span>{mockPage.viewCount.toLocaleString()}회 조회</span>
          </div>
          <div className='flex items-center gap-1'>
            <MessageCircle className='h-3 w-3' />
            <span>{mockPage.commentCount}개 댓글</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 고급 사이드바 컴포넌트
function AdvancedPageSidebar() {
  const [activeTab, setActiveTab] = useState<
    'comments' | 'info' | 'history' | 'outline'
  >('outline');

  return (
    <div className='bg-background/50 w-80 border-l backdrop-blur'>
      {/* 사이드바 헤더 */}
      <div className='border-b p-4'>
        <div className='grid grid-cols-2 gap-1'>
          <Button
            variant={activeTab === 'outline' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('outline')}
            className='text-xs'
          >
            <Layout className='mr-1 h-3 w-3' />
            개요
          </Button>
          <Button
            variant={activeTab === 'comments' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('comments')}
            className='text-xs'
          >
            <MessageCircle className='mr-1 h-3 w-3' />
            댓글
          </Button>
          <Button
            variant={activeTab === 'info' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('info')}
            className='text-xs'
          >
            <BookOpen className='mr-1 h-3 w-3' />
            정보
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            size='sm'
            onClick={() => setActiveTab('history')}
            className='text-xs'
          >
            <History className='mr-1 h-3 w-3' />
            기록
          </Button>
        </div>
      </div>

      {/* 사이드바 콘텐츠 */}
      <div className='h-[calc(100vh-180px)] overflow-y-auto p-4'>
        {activeTab === 'outline' && (
          <div className='space-y-2'>
            <h4 className='mb-3 font-medium'>페이지 개요</h4>
            <div className='space-y-1'>
              <div className='hover:bg-muted cursor-pointer rounded py-1 pl-2 text-sm'>
                📝 API 설계 문서
              </div>
              <div className='text-muted-foreground hover:bg-muted cursor-pointer rounded py-1 pl-6 text-sm'>
                개요
              </div>
              <div className='text-muted-foreground hover:bg-muted cursor-pointer rounded py-1 pl-10 text-sm'>
                설계 원칙
              </div>
              <div className='text-muted-foreground hover:bg-muted cursor-pointer rounded py-1 pl-6 text-sm'>
                엔드포인트 목록
              </div>
              <div className='text-muted-foreground hover:bg-muted cursor-pointer rounded py-1 pl-6 text-sm'>
                응답 형식
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className='space-y-4'>
            <div className='text-muted-foreground text-center'>
              <MessageCircle className='mx-auto mb-2 h-12 w-12 opacity-50' />
              <p>아직 댓글이 없습니다.</p>
              <p className='text-xs'>페이지에 댓글을 달아보세요!</p>
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className='space-y-4'>
            <div>
              <h4 className='mb-3 font-medium'>페이지 정보</h4>
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>생성일</span>
                  <span>
                    {new Date(mockPage.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>수정일</span>
                  <span>
                    {new Date(mockPage.updatedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>작성자</span>
                  <span>{mockPage.author.name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>조회수</span>
                  <span>{mockPage.viewCount.toLocaleString()}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>공개 상태</span>
                  <Badge
                    variant={mockPage.isPublished ? 'default' : 'secondary'}
                    className='text-xs'
                  >
                    {mockPage.isPublished ? '공개' : '비공개'}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className='mb-3 font-medium'>협업자</h4>
              <div className='space-y-2'>
                {mockPage.collaborators.map(collaborator => (
                  <div
                    key={collaborator.id}
                    className='flex items-center gap-2'
                  >
                    <UserAvatar
                      src={collaborator.avatar}
                      name={collaborator.name}
                      size='xs'
                    />
                    <span className='text-sm'>{collaborator.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className='space-y-4'>
            <div className='text-muted-foreground text-center'>
              <History className='mx-auto mb-2 h-12 w-12 opacity-50' />
              <p>버전 기록이 없습니다.</p>
              <p className='text-xs'>페이지를 수정하면 기록이 생성됩니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 메인 페이지 에디터 컴포넌트
export default function AdvancedPageEditor() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const pageId = params.pageId as string;
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
  const [wordCount, setWordCount] = useState(0);
  const [blockCount, setBlockCount] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const { user } = useAuth();
  const { fullscreen } = useEditor();

  // 페이지 로딩 시뮬레이션
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 자동 저장 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAutoSaving(true);
      setTimeout(() => setIsAutoSaving(false), 1000);
    }, 10000); // 10초마다 자동 저장

    return () => clearInterval(interval);
  }, []);

  const handleContentChange = (content: any) => {
    console.log('Content changed:', content);

    // 통계 업데이트
    if (Array.isArray(content)) {
      setBlockCount(content.length);
      // 단어 수 계산 (간단한 버전)
      const totalWords = content.reduce((count, block) => {
        if (block.content && Array.isArray(block.content)) {
          const text = block.content
            .map((item: any) => item.text || '')
            .join(' ');
          return (
            count + text.split(/\s+/).filter(word => word.length > 0).length
          );
        }
        return count;
      }, 0);
      setWordCount(totalWords);
    }
  };

  const handleSelectionChange = (selection: any) => {
    console.log('Selection changed:', selection);
  };

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p className='text-muted-foreground'>페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex h-screen flex-col',
        fullscreen && 'bg-background fixed inset-0 z-50'
      )}
    >
      {/* 브레드크럼 (전체화면이 아닐 때만) */}
      {!fullscreen && (
        <div className='border-b px-6 py-2'>
          <Breadcrumb
            items={[
              { label: '홈', href: '/dashboard' },
              {
                label: mockPage.workspace.name,
                href: `/workspace/${workspaceId}`,
              },
              { label: mockPage.title },
            ]}
          />
        </div>
      )}

      {/* 페이지 헤더 */}
      <AdvancedPageHeader />

      {/* 페이지 메타 정보 (전체화면이 아닐 때만) */}
      {!fullscreen && <PageMeta />}

      {/* 메인 콘텐츠 영역 */}
      <div className='flex flex-1 overflow-hidden'>
        {/* 에디터 영역 */}
        <div className='flex flex-1 flex-col'>
          <div className='flex-1 overflow-auto'>
            <div
              className={cn(
                'mx-auto p-6',
                fullscreen ? 'max-w-5xl' : 'max-w-4xl'
              )}
            >
              <AdvancedBlockNoteEditor
                initialContent={undefined}
                onContentChange={handleContentChange}
                onSelectionChange={handleSelectionChange}
                placeholder='페이지 내용을 입력하세요...'
                className='min-h-[600px]'
                theme={editorTheme}
                showToolbar={true}
                showSlashMenu={true}
                autoFocus={false}
              />
            </div>
          </div>

          {/* 에디터 상태 바 */}
          <EditorStatusBar
            wordCount={wordCount}
            blockCount={blockCount}
            isAutoSaving={isAutoSaving}
          />
        </div>

        {/* 사이드바 (전체화면이 아닐 때만) */}
        {showSidebar && !fullscreen && <AdvancedPageSidebar />}
      </div>

      {/* 플로팅 액션 버튼 */}
      {!fullscreen && (
        <div className='fixed right-6 bottom-6 flex flex-col gap-2'>
          <SimpleTooltip
            content={showSidebar ? '사이드바 숨기기' : '사이드바 보이기'}
          >
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowSidebar(!showSidebar)}
              className='rounded-full shadow-lg'
            >
              {showSidebar ? (
                <X className='h-4 w-4' />
              ) : (
                <Layout className='h-4 w-4' />
              )}
            </Button>
          </SimpleTooltip>

          <SimpleTooltip content='에디터 테마 전환'>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setEditorTheme(prev => (prev === 'light' ? 'dark' : 'light'))
              }
              className='rounded-full shadow-lg'
            >
              <Palette className='h-4 w-4' />
            </Button>
          </SimpleTooltip>
        </div>
      )}
    </div>
  );
}
