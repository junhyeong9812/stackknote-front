import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { FileText } from 'lucide-react';
import Link from 'next/link';

// 인증 상태 확인 (실제로는 서버 컴포넌트에서 쿠키 등을 확인)
async function checkAuth() {
  // TODO: 실제 인증 상태 확인 로직
  // 예시: const user = await getServerSession()
  // return !!user
  return false;
}

export const metadata: Metadata = {
  title: '로그인 · StackNote',
  description: 'StackNote에 로그인하여 팀과 함께 지식을 쌓아보세요.',
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const isAuthenticated = await checkAuth();

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  if (isAuthenticated) {
    redirect('/dashboard');
  }

  return (
    <div className='flex min-h-screen'>
      {/* 왼쪽 브랜딩 섹션 */}
      <div className='from-primary/5 to-primary/10 hidden bg-gradient-to-br lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8'>
        <div className='mx-auto max-w-md'>
          {/* 로고 */}
          <Link href='/' className='mb-8 flex items-center space-x-3'>
            <div className='bg-primary flex h-10 w-10 items-center justify-center rounded-lg'>
              <FileText className='text-primary-foreground h-6 w-6' />
            </div>
            <span className='text-primary text-2xl font-bold'>StackNote</span>
          </Link>

          {/* 브랜딩 메시지 */}
          <div className='space-y-6'>
            <h1 className='text-foreground text-3xl font-bold'>
              팀과 함께 만드는
              <br />
              지식 베이스
            </h1>

            <p className='text-muted-foreground text-lg leading-relaxed'>
              StackNote와 함께 아이디어를 정리하고, 팀과 협업하며, 모든 지식을
              하나의 공간에서 관리하세요.
            </p>

            {/* 특징 목록 */}
            <div className='space-y-3'>
              <div className='flex items-center space-x-3'>
                <div className='bg-primary h-2 w-2 rounded-full'></div>
                <span className='text-muted-foreground'>실시간 협업 편집</span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='bg-primary h-2 w-2 rounded-full'></div>
                <span className='text-muted-foreground'>
                  강력한 블록 에디터
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='bg-primary h-2 w-2 rounded-full'></div>
                <span className='text-muted-foreground'>
                  무제한 워크스페이스
                </span>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='bg-primary h-2 w-2 rounded-full'></div>
                <span className='text-muted-foreground'>
                  페이지 공개 및 공유
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 인증 폼 섹션 */}
      <div className='bg-background flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8'>
        <div className='mx-auto w-full max-w-md'>
          {/* 모바일용 로고 */}
          <div className='mb-8 text-center lg:hidden'>
            <Link href='/' className='inline-flex items-center space-x-2'>
              <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
                <FileText className='text-primary-foreground h-5 w-5' />
              </div>
              <span className='text-primary text-xl font-bold'>StackNote</span>
            </Link>
          </div>

          {/* 인증 폼 */}
          {children}

          {/* 홈으로 돌아가기 링크 */}
          <div className='mt-8 text-center'>
            <Link
              href='/'
              className='text-muted-foreground hover:text-primary text-sm transition-colors'
            >
              ← 홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
