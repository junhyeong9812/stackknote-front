'use client';

import { useRouter } from 'next/navigation';
import { GuestLogin } from '@/components/auth/guest-login';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Eye,
  FileText,
  Users,
  Clock,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

export default function GuestPage() {
  const router = useRouter();

  const handleGuestLogin = () => {
    // 게스트 로그인 처리 (추후 구현)
    console.log('Guest login initiated');
    // 임시: 대시보드로 리다이렉트
    router.push('/dashboard');
  };

  return (
    <div className='space-y-6'>
      {/* 뒤로 가기 버튼 */}
      <div className='flex items-center'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/login'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            로그인으로 돌아가기
          </Link>
        </Button>
      </div>

      {/* 게스트 모드 소개 */}
      <Card className='border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-blue-900 dark:text-blue-100'>
            <Eye className='h-5 w-5' />
            게스트 모드란?
          </CardTitle>
          <CardDescription className='text-blue-700 dark:text-blue-300'>
            회원가입 없이 StackNote의 핵심 기능을 미리 체험해볼 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            {/* 체험 가능한 기능 */}
            <div className='space-y-3'>
              <h3 className='font-medium text-blue-900 dark:text-blue-100'>
                체험 가능한 기능
              </h3>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300'>
                  <Eye className='h-4 w-4 text-green-600' />
                  공개 페이지 및 워크스페이스 열람
                </div>
                <div className='flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300'>
                  <FileText className='h-4 w-4 text-green-600' />
                  샘플 페이지 및 템플릿 확인
                </div>
                <div className='flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300'>
                  <Users className='h-4 w-4 text-green-600' />
                  에디터 인터페이스 체험
                </div>
              </div>
            </div>

            {/* 제한사항 */}
            <div className='space-y-3'>
              <h3 className='font-medium text-blue-900 dark:text-blue-100'>
                주요 제한사항
              </h3>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400'>
                  <div className='h-1.5 w-1.5 rounded-full bg-blue-400' />
                  페이지 편집 및 저장 불가
                </div>
                <div className='flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400'>
                  <div className='h-1.5 w-1.5 rounded-full bg-blue-400' />
                  댓글 작성 및 파일 업로드 불가
                </div>
                <div className='flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400'>
                  <div className='h-1.5 w-1.5 rounded-full bg-blue-400' />
                  워크스페이스 생성 불가
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 게스트 로그인 컴포넌트 */}
      <GuestLogin onGuestLogin={handleGuestLogin} />

      {/* 주의사항 */}
      <Card className='border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/50'>
        <CardContent className='pt-6'>
          <div className='flex items-start gap-3'>
            <AlertTriangle className='mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600' />
            <div className='space-y-2'>
              <h3 className='font-medium text-amber-900 dark:text-amber-100'>
                게스트 모드 주의사항
              </h3>
              <div className='space-y-1 text-sm text-amber-700 dark:text-amber-300'>
                <p>• 게스트 세션은 1시간 후 자동으로 만료됩니다.</p>
                <p>• 작성한 내용은 저장되지 않으며 세션 종료 시 삭제됩니다.</p>
                <p>• 일부 기능은 체험용으로 제한될 수 있습니다.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 추천 액션 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-center'>
            StackNote의 모든 기능을 사용해보세요
          </CardTitle>
          <CardDescription className='text-center'>
            무료 계정을 만들어 실시간 협업, 무제한 페이지 생성, 팀 워크스페이스
            등 모든 기능을 제한 없이 사용하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col justify-center gap-3 sm:flex-row'>
            <Button size='lg' asChild>
              <Link href='/register'>무료 계정 만들기</Link>
            </Button>
            <Button variant='outline' size='lg' asChild>
              <Link href='/login'>기존 계정으로 로그인</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 기능 비교표 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-center'>기능 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b'>
                  <th className='py-2 text-left'>기능</th>
                  <th className='py-2 text-center text-amber-600'>게스트</th>
                  <th className='py-2 text-center text-green-600'>무료 계정</th>
                  <th className='py-2 text-center text-blue-600'>프리미엄</th>
                </tr>
              </thead>
              <tbody className='text-muted-foreground'>
                <tr className='border-b'>
                  <td className='py-2'>페이지 열람</td>
                  <td className='py-2 text-center'>✓</td>
                  <td className='py-2 text-center'>✓</td>
                  <td className='py-2 text-center'>✓</td>
                </tr>
                <tr className='border-b'>
                  <td className='py-2'>페이지 편집</td>
                  <td className='py-2 text-center'>✗</td>
                  <td className='py-2 text-center'>✓</td>
                  <td className='py-2 text-center'>✓</td>
                </tr>
                <tr className='border-b'>
                  <td className='py-2'>워크스페이스 생성</td>
                  <td className='py-2 text-center'>✗</td>
                  <td className='py-2 text-center'>3개</td>
                  <td className='py-2 text-center'>무제한</td>
                </tr>
                <tr className='border-b'>
                  <td className='py-2'>팀 협업</td>
                  <td className='py-2 text-center'>✗</td>
                  <td className='py-2 text-center'>5명</td>
                  <td className='py-2 text-center'>무제한</td>
                </tr>
                <tr className='border-b'>
                  <td className='py-2'>파일 업로드</td>
                  <td className='py-2 text-center'>✗</td>
                  <td className='py-2 text-center'>100MB</td>
                  <td className='py-2 text-center'>10GB</td>
                </tr>
                <tr>
                  <td className='py-2'>고급 기능</td>
                  <td className='py-2 text-center'>✗</td>
                  <td className='py-2 text-center'>제한적</td>
                  <td className='py-2 text-center'>✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
