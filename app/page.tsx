import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import {
  FileText,
  Users,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
} from 'lucide-react';

// 인증 상태 확인 (실제로는 서버 컴포넌트에서 쿠키 등을 확인)
async function checkAuth() {
  // TODO: 실제 인증 상태 확인 로직
  // 예시: const user = await getServerSession()
  // return !!user
  return false;
}

export default async function HomePage() {
  const isAuthenticated = await checkAuth();

  // 로그인된 사용자는 대시보드로 리다이렉트
  if (isAuthenticated) {
    redirect('/dashboard');
  }

  return (
    <div className='from-background to-muted/20 min-h-screen bg-gradient-to-br'>
      {/* 헤더 */}
      <header className='bg-background/80 sticky top-0 z-50 border-b backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='bg-primary flex h-8 w-8 items-center justify-center rounded-lg'>
                <FileText className='text-primary-foreground h-5 w-5' />
              </div>
              <span className='text-xl font-bold'>StackNote</span>
            </div>

            <nav className='hidden items-center space-x-6 md:flex'>
              <Link
                href='#features'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                기능
              </Link>
              <Link
                href='#pricing'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                요금제
              </Link>
              <Link
                href='#about'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                소개
              </Link>
            </nav>

            <div className='flex items-center space-x-4'>
              <Button variant='ghost' asChild>
                <Link href='/login'>로그인</Link>
              </Button>
              <Button asChild>
                <Link href='/register'>시작하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className='container mx-auto px-4 py-20 text-center'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='from-foreground to-foreground/70 mb-6 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-6xl'>
            팀과 함께 만드는
            <br />
            지식 베이스
          </h1>
          <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-xl'>
            StackNote와 함께 아이디어를 정리하고, 팀과 협업하며, 모든 지식을
            하나의 공간에서 관리하세요.
          </p>

          <div className='mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button size='lg' className='px-8 py-3 text-lg' asChild>
              <Link href='/register'>
                무료로 시작하기
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='px-8 py-3 text-lg'
              asChild
            >
              <Link href='/guest'>
                게스트로 둘러보기
                <Globe className='ml-2 h-5 w-5' />
              </Link>
            </Button>
          </div>

          <div className='text-muted-foreground flex items-center justify-center space-x-6 text-sm'>
            <div className='flex items-center'>
              <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
              무료 플랜 제공
            </div>
            <div className='flex items-center'>
              <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
              신용카드 불필요
            </div>
            <div className='flex items-center'>
              <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
              언제든 업그레이드
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section id='features' className='container mx-auto px-4 py-20'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>강력한 기능들</h2>
          <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
            생산성을 높이고 협업을 원활하게 만드는 다양한 기능을 제공합니다.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <Card className='notion-hover-card'>
            <CardHeader>
              <div className='bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
                <FileText className='text-primary h-6 w-6' />
              </div>
              <CardTitle>리치 에디터</CardTitle>
              <CardDescription>
                노션 스타일의 블록 기반 에디터로 다양한 콘텐츠를 자유롭게
                작성하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  드래그 앤 드롭 지원
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  다양한 블록 타입
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  실시간 미리보기
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className='notion-hover-card'>
            <CardHeader>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10'>
                <Users className='h-6 w-6 text-blue-500' />
              </div>
              <CardTitle>실시간 협업</CardTitle>
              <CardDescription>
                팀원들과 동시에 문서를 편집하고 실시간으로 소통하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  동시 편집 지원
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  댓글 & 멘션
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  변경 이력 추적
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className='notion-hover-card'>
            <CardHeader>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10'>
                <Zap className='h-6 w-6 text-orange-500' />
              </div>
              <CardTitle>빠른 성능</CardTitle>
              <CardDescription>
                최적화된 성능으로 끊김 없는 작업 경험을 제공합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  즉시 로딩
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  오프라인 지원
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  자동 저장
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className='notion-hover-card'>
            <CardHeader>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10'>
                <Shield className='h-6 w-6 text-green-500' />
              </div>
              <CardTitle>보안 & 권한</CardTitle>
              <CardDescription>
                세밀한 권한 관리와 강력한 보안으로 데이터를 안전하게 보호합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  역할 기반 권한
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  암호화 저장
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  백업 & 복구
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className='notion-hover-card'>
            <CardHeader>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10'>
                <Star className='h-6 w-6 text-purple-500' />
              </div>
              <CardTitle>템플릿</CardTitle>
              <CardDescription>
                다양한 용도의 템플릿으로 빠르게 시작하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  미리 제작된 템플릿
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  커스텀 템플릿
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  템플릿 공유
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className='notion-hover-card'>
            <CardHeader>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10'>
                <Globe className='h-6 w-6 text-pink-500' />
              </div>
              <CardTitle>공개 페이지</CardTitle>
              <CardDescription>
                페이지를 공개하여 더 많은 사람들과 지식을 공유하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  SEO 최적화
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  커스텀 도메인
                </li>
                <li className='flex items-center'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                  분석 도구
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className='bg-muted/30 border-t'>
        <div className='container mx-auto px-4 py-20 text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            지금 바로 시작해보세요
          </h2>
          <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-xl'>
            몇 분 안에 설정을 완료하고 팀과 함께 더 나은 협업을 경험해보세요.
          </p>

          <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
            <Button size='lg' className='px-8 py-3 text-lg' asChild>
              <Link href='/register'>
                무료로 시작하기
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </Button>
            <Button
              variant='outline'
              size='lg'
              className='px-8 py-3 text-lg'
              asChild
            >
              <Link href='/login'>기존 계정으로 로그인</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className='bg-background border-t'>
        <div className='container mx-auto px-4 py-12'>
          <div className='grid gap-8 md:grid-cols-4'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <div className='bg-primary flex h-6 w-6 items-center justify-center rounded'>
                  <FileText className='text-primary-foreground h-4 w-4' />
                </div>
                <span className='font-bold'>StackNote</span>
              </div>
              <p className='text-muted-foreground text-sm'>
                팀과 함께 만드는 지식 베이스
              </p>
            </div>

            <div>
              <h4 className='mb-4 font-semibold'>제품</h4>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    기능
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    요금제
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    템플릿
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='mb-4 font-semibold'>지원</h4>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    도움말
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    문의하기
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    상태 페이지
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    릴리즈 노트
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='mb-4 font-semibold'>회사</h4>
              <ul className='text-muted-foreground space-y-2 text-sm'>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    소개
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    채용
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    블로그
                  </Link>
                </li>
                <li>
                  <Link
                    href='#'
                    className='hover:text-foreground transition-colors'
                  >
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row'>
            <p className='text-muted-foreground text-sm'>
              © 2024 StackNote. All rights reserved.
            </p>
            <div className='mt-4 flex items-center space-x-4 md:mt-0'>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <span className='sr-only'>Twitter</span>
                <svg
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84' />
                </svg>
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <span className='sr-only'>GitHub</span>
                <svg
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                <span className='sr-only'>LinkedIn</span>
                <svg
                  className='h-5 w-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z'
                    clipRule='evenodd'
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
