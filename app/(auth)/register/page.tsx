'use client';

import { Metadata } from 'next';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { RegisterForm } from '@/components/auth/register-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

// 에러 메시지 매핑
const ERROR_MESSAGES: Record<string, string> = {
  email_exists: '이미 사용 중인 이메일입니다.',
  username_exists: '이미 사용 중인 사용자명입니다.',
  weak_password: '비밀번호가 보안 요구사항을 충족하지 않습니다.',
  invalid_email: '올바르지 않은 이메일 형식입니다.',
  invalid_username: '사용자명에 허용되지 않은 문자가 포함되어 있습니다.',
  terms_not_agreed: '이용약관에 동의해주세요.',
  server_error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  rate_limit: '너무 많은 가입 시도가 있었습니다. 잠시 후 다시 시도해주세요.',
};

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const invited = searchParams.get('invited') === 'true';
  const workspaceName = searchParams.get('workspace');

  const errorMessage = error
    ? ERROR_MESSAGES[error] || '알 수 없는 오류가 발생했습니다.'
    : null;

  return (
    <div className='space-y-6'>
      {/* 초대받은 경우 안내 메시지 */}
      {invited && workspaceName && (
        <Card className='border-blue-500/50 bg-blue-50 dark:bg-blue-950'>
          <CardContent className='flex items-center gap-3 pt-6'>
            <CheckCircle className='h-5 w-5 flex-shrink-0 text-blue-500' />
            <div>
              <p className='text-sm font-medium text-blue-700 dark:text-blue-300'>
                워크스페이스 초대
              </p>
              <p className='text-sm text-blue-600 dark:text-blue-400'>
                <strong>{decodeURIComponent(workspaceName)}</strong>{' '}
                워크스페이스에 초대되었습니다. 계정을 만든 후 자동으로
                참여됩니다.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 에러 메시지 */}
      {errorMessage && (
        <Card className='border-destructive/50 bg-destructive/5'>
          <CardContent className='flex items-center gap-3 pt-6'>
            <AlertCircle className='text-destructive h-5 w-5 flex-shrink-0' />
            <p className='text-destructive text-sm'>{errorMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* 회원가입 폼 */}
      <RegisterForm />

      {/* 추가 정보 */}
      <div className='space-y-4 text-center'>
        <div className='text-muted-foreground text-sm'>
          이미 계정이 있으신가요?{' '}
          <a
            href='/login'
            className='text-primary hover:text-primary/80 font-medium transition-colors'
          >
            로그인
          </a>
        </div>

        {/* 약관 및 개인정보처리방침 링크 */}
        <div className='text-muted-foreground space-y-1 text-xs'>
          <p>
            회원가입을 진행하면{' '}
            <a
              href='/terms'
              target='_blank'
              className='text-primary hover:underline'
            >
              이용약관
            </a>{' '}
            및{' '}
            <a
              href='/privacy'
              target='_blank'
              className='text-primary hover:underline'
            >
              개인정보처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className='space-y-6'>
          <Card>
            <CardHeader className='text-center'>
              <CardTitle>회원가입</CardTitle>
              <CardDescription>
                StackNote 계정을 만들어 시작하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {/* 스켈레톤 로딩 */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className='space-y-2'>
                    <div className='bg-muted h-4 animate-pulse rounded' />
                    <div className='bg-muted h-10 animate-pulse rounded-md' />
                  </div>
                ))}
                <div className='space-y-2'>
                  <div className='bg-muted h-4 animate-pulse rounded' />
                  <div className='flex items-center space-x-2'>
                    <div className='bg-muted h-4 w-4 animate-pulse rounded' />
                    <div className='bg-muted h-4 flex-1 animate-pulse rounded' />
                  </div>
                </div>
                <div className='bg-muted h-10 animate-pulse rounded-md' />
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
