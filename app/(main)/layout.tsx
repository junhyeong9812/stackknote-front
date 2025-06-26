import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { MainSidebar } from '@/components/layout/main-sidebar';
import { TopNavigation } from '@/components/layout/top-navigation';
import { Toaster } from '@/components/ui/toast';

// 인증 상태 확인 (실제로는 서버 컴포넌트에서 쿠키 등을 확인)
async function checkAuth() {
  // TODO: 실제 인증 상태 확인 로직
  // 예시: const user = await getServerSession()
  // return user
  return {
    id: 1,
    email: 'user@example.com',
    username: 'user',
    role: 'USER' as const,
    isEmailVerified: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };
}

export const metadata: Metadata = {
  title: {
    template: '%s | StackNote',
    default: 'StackNote',
  },
  description: '팀과 함께 만드는 지식 베이스',
};

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const user = await checkAuth();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    redirect('/login');
  }

  return (
    <div className='bg-background min-h-screen'>
      {/* 메인 그리드 레이아웃 */}
      <div className='grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]'>
        {/* 사이드바 */}
        <aside className='bg-muted/10 hidden border-r lg:block'>
          <MainSidebar />
        </aside>

        {/* 메인 콘텐츠 영역 */}
        <main className='flex min-h-screen flex-col'>
          {/* 상단 네비게이션 */}
          <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
            <TopNavigation />
          </header>

          {/* 페이지 콘텐츠 */}
          <div className='flex-1 overflow-hidden'>{children}</div>
        </main>
      </div>

      {/* 전역 토스트 */}
      <Toaster />
    </div>
  );
}
