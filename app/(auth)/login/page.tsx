'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/auth/login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

// 에러 메시지 매핑
const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: '이메일 또는 비밀번호가 올바르지 않습니다.',
  account_disabled: '계정이 비활성화되었습니다. 관리자에게 문의하세요.',
  email_not_verified: '이메일 인증이 필요합니다. 이메일을 확인해주세요.',
  session_expired: '세션이 만료되었습니다. 다시 로그인해주세요.',
  too_many_attempts:
    '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.',
  server_error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

// 성공 메시지 매핑
const SUCCESS_MESSAGES: Record<string, string> = {
  registration_complete: '회원가입이 완료되었습니다. 로그인해주세요.',
  password_reset: '비밀번호가 성공적으로 재설정되었습니다.',
  email_verified: '이메일 인증이 완료되었습니다. 로그인해주세요.',
};

function LoginPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const success = searchParams.get('success');
  const callbackUrl = searchParams.get('callbackUrl');

  const errorMessage = error
    ? ERROR_MESSAGES[error] || '알 수 없는 오류가 발생했습니다.'
    : null;
  const successMessage = success ? SUCCESS_MESSAGES[success] : null;

  return (
    <div className='space-y-6'>
      {/* 에러 메시지 */}
      {errorMessage && (
        <Card className='border-destructive/50 bg-destructive/5'>
          <CardContent className='flex items-center gap-3 pt-6'>
            <AlertCircle className='text-destructive h-5 w-5 flex-shrink-0' />
            <p className='text-destructive text-sm'>{errorMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* 성공 메시지 */}
      {successMessage && (
        <Card className='border-green-500/50 bg-green-50 dark:bg-green-950'>
          <CardContent className='flex items-center gap-3 pt-6'>
            <div className='flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500'>
              <svg
                className='h-3 w-3 text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <p className='text-sm text-green-700 dark:text-green-300'>
              {successMessage}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 로그인 폼 */}
      <LoginForm />

      {/* 추가 정보 */}
      <div className='space-y-4 text-center'>
        <div className='text-muted-foreground text-sm'>
          아직 계정이 없으신가요?{' '}
          <Link
            href='/register'
            className='text-primary hover:text-primary/80 font-medium transition-colors'
          >
            회원가입
          </Link>
        </div>

        <div className='text-sm'>
          <Link
            href='/forgot-password'
            className='text-muted-foreground hover:text-primary transition-colors'
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className='space-y-6'>
          <Card>
            <CardHeader className='text-center'>
              <CardTitle>로그인</CardTitle>
              <CardDescription>
                StackNote에 오신 것을 환영합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <div className='bg-muted h-4 animate-pulse rounded' />
                  <div className='bg-muted h-10 animate-pulse rounded-md' />
                </div>
                <div className='space-y-2'>
                  <div className='bg-muted h-4 animate-pulse rounded' />
                  <div className='bg-muted h-10 animate-pulse rounded-md' />
                </div>
                <div className='bg-muted h-10 animate-pulse rounded-md' />
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
