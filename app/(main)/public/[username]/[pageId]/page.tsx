'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  Calendar,
  User,
  Globe,
  Heart,
  Share2,
  MessageCircle,
  BookOpen,
  Clock,
  Tag,
  ChevronRight,
  Home,
  ExternalLink,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  UserAvatar,
  SimpleTooltip,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import type { PageResponse, TagSummaryResponse } from '@/types';

// 임시 데이터 (실제로는 API에서 가져와야 함)
const mockPageData: PageResponse = {
  id: 1,
  title: 'React 개발 가이드',
  content: `
# React 개발 가이드

## 소개
React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다.

## 주요 개념

### 1. 컴포넌트
컴포넌트는 React의 핵심 개념입니다.

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
\`\`\`

### 2. JSX
JSX는 JavaScript의 문법 확장입니다.

### 3. Props와 State
- **Props**: 컴포넌트에 전달되는 읽기 전용 데이터
- **State**: 컴포넌트의 내부 상태

## 훅 (Hooks)
React 16.8에서 도입된 훅을 사용하면 함수 컴포넌트에서도 상태와 생명주기 기능을 사용할 수 있습니다.

### useState
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

### useEffect
\`\`\`jsx
useEffect(() => {
  document.title = \`You clicked \${count} times\`;
});
\`\`\`

## 결론
React는 현대적인 웹 애플리케이션 개발에 필수적인 도구입니다.
  `,
  summary: 'React 개발을 위한 핵심 개념과 실습 가이드',
  icon: '⚛️',
  coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
  workspaceId: 1,
  workspaceName: '개발팀',
  parentId: undefined,
  parentTitle: undefined,
  createdBy: {
    id: 1,
    username: '김철수',
    email: 'kimcs@example.com',
    profileImageUrl: '/avatars/user1.jpg',
    role: 'USER',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  lastModifiedBy: {
    id: 2,
    username: '이영희',
    email: 'leeyh@example.com',
    profileImageUrl: '/avatars/user2.jpg',
    role: 'USER',
    isActive: true,
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  isPublished: true,
  isTemplate: false,
  isLocked: false,
  sortOrder: 1,
  viewCount: 1234,
  pageType: 'DOCUMENT',
  depth: 0,
  hasChildren: false,
  createdAt: '2024-01-15T09:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
};

const mockTags: TagSummaryResponse[] = [
  { id: 1, name: 'React', color: '#61DAFB', usageCount: 45, isSystemTag: false },
  { id: 2, name: 'JavaScript', color: '#F7DF1E', usageCount: 78, isSystemTag: false },
  { id: 3, name: '프론트엔드', color: '#FF6B6B', usageCount: 23, isSystemTag: false },
  { id: 4, name: '개발가이드', color: '#4ECDC4', usageCount: 12, isSystemTag: false },
];

const mockRelatedPages = [
  {
    id: 2,
    title: 'JavaScript ES6+ 문법 정리',
    icon: '📝',
    viewCount: 892,
    author: '박민수',
  },
  {
    id: 3,
    title: 'Next.js 시작하기',
    icon: '🚀',
    viewCount: 567,
    author: '김철수',
  },
  {
    id: 4,
    title: 'TypeScript 기초',
    icon: '🔷',
    viewCount: 734,
    author: '이영희',
  },
];

export default function PublicPage() {
  const params = useParams();
  const username = params.username as string;
  const pageId = parseInt(params.pageId as string);

  const [page, setPage] = useState<PageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(89);

  // 실제로는 API에서 데이터를 가져와야 함
  useEffect(() => {
    const loadPage = async () => {
      try {
        setIsLoading(true);
        // API 호출 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 페이지가 존재하지 않거나 비공개인 경우
        if (pageId > 10) {
          notFound();
          return;
        }
        
        setPage(mockPageData);
      } catch (error) {
        console.error('페이지 로드 실패:', error);
        notFound();
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [username, pageId]);

  // 좋아요 토글
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // 공유하기
  const handleShare = async () => {
    try {
      await navigator.share({
        title: page?.title,
        text: page?.summary,
        url: window.location.href,
      });
    } catch (error) {
      // 공유 API를 지원하지 않는 경우 URL 복사
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  // 마크다운 렌더링 (실제로는 마크다운 파서 사용)
  const renderContent = (content: string) => {
    // 간단한 마크다운 처리 (실제로는 react-markdown 등 사용)
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mb-4 mt-8">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mb-3 mt-6">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-medium mb-2 mt-4">{line.slice(4)}</h3>;
        }
        if (line.startsWith('```')) {
          return <div key={index} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto" />;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 mb-1">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 브레드크럼 */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link 
                href={`/u/${username}`}
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                {username}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {page.title}
              </span>
            </nav>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-2">
              <SimpleTooltip content="공유하기">
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </SimpleTooltip>
              <SimpleTooltip content="워크스페이스로 이동">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/workspace/${page.workspaceId}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </SimpleTooltip>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 메인 컨텐츠 */}
          <main className="lg:col-span-3">
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              {/* 커버 이미지 */}
              {page.coverImageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={page.coverImageUrl}
                    alt={page.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* 페이지 헤더 */}
              <header className="p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4 mb-6">
                  {page.icon && (
                    <span className="text-4xl">{page.icon}</span>
                  )}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      {page.title}
                    </h1>
                    {page.summary && (
                      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                        {page.summary}
                      </p>
                    )}
                  </div>
                </div>

                {/* 메타 정보 */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      src={page.createdBy.profileImageUrl}
                      name={page.createdBy.username}
                      size="sm"
                    />
                    <span>{page.createdBy.username}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(page.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{page.viewCount.toLocaleString()}회 조회</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <span>공개</span>
                  </div>
                </div>

                {/* 태그 */}
                {mockTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {mockTags.map(tag => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        style={{ backgroundColor: tag.color + '20', color: tag.color }}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </header>

              {/* 페이지 컨텐츠 */}
              <div className="p-8">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  {renderContent(page.content || '')}
                </div>
              </div>

              {/* 페이지 푸터 */}
              <footer className="p-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLikeToggle}
                      className={isLiked ? "text-red-600" : ""}
                    >
                      <Heart className={cn("h-4 w-4 mr-2", isLiked && "fill-current")} />
                      {likeCount}
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      댓글
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {page.lastModifiedBy && (
                      <span>
                        {page.lastModifiedBy.username}님이{' '}
                        {new Date(page.updatedAt).toLocaleDateString('ko-KR')}에 수정
                      </span>
                    )}
                  </div>
                </div>
              </footer>
            </article>
          </main>

          {/* 사이드바 */}
          <aside className="space-y-6">
            {/* 작성자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">작성자</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <UserAvatar
                    src={page.createdBy.profileImageUrl}
                    name={page.createdBy.username}
                    size="default"
                  />
                  <div>
                    <h4 className="font-medium">{page.createdBy.username}</h4>
                    <p className="text-sm text-gray-500">@{username}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/u/${username}`}>
                    <User className="h-4 w-4 mr-2" />
                    프로필 보기
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* 워크스페이스 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">워크스페이스</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">{page.workspaceName}</h4>
                    <p className="text-sm text-gray-500">워크스페이스</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/workspace/${page.workspaceId}`}>
                    워크스페이스 방문
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* 관련 페이지 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">관련 페이지</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRelatedPages.map(relatedPage => (
                  <Link
                    key={relatedPage.id}
                    href={`/u/${username}/${relatedPage.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-xl">{relatedPage.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{relatedPage.title}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{relatedPage.author}</span>
                        <span>•</span>
                        <span>{relatedPage.viewCount}회 조회</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* 페이지 통계 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">조회수</span>
                  <span className="font-medium">{page.viewCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">좋아요</span>
                  <span className="font-medium">{likeCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">생성일</span>
                  <span className="font-medium">
                    {new Date(page.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">수정일</span>
                  <span className="font-medium">
                    {new Date(page.updatedAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}