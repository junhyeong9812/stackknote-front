// components/auth/guest-login.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Eye,
  UserCheck,
  Clock,
  FileText,
  MessageSquare,
  Upload,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { GUEST_CONFIG } from '@/lib/config/auth-config';
import { cn } from '@/lib/utils/cn';

interface GuestLoginProps {
  className?: string;
  onGuestLogin?: () => void;
}

export function GuestLogin({ className, onGuestLogin }: GuestLoginProps) {
  const handleGuestLogin = () => {
    // 게스트 로그인 로직 (추후 구현)
    onGuestLogin?.();
  };

  if (!GUEST_CONFIG.ENABLED) {
    return (
      <Card className={cn('w-full max-w-md', className)}>
        <CardContent className='py-8 text-center'>
          <p className='text-gray-600 dark:text-gray-400'>
            게스트 모드가 비활성화되어 있습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className='text-center'>
        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
          <UserCheck className='h-6 w-6 text-blue-600 dark:text-blue-400' />
        </div>
        <CardTitle>게스트로 둘러보기</CardTitle>
        <CardDescription>
          회원가입 없이 StackNote의 기능을 체험해보세요
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* 게스트 모드 기능 */}
        <div className='space-y-3'>
          <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
            체험 가능한 기능
          </h3>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
              <Eye className='h-4 w-4 text-green-600' />
              공개 페이지 및 워크스페이스 열람
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
              <FileText className='h-4 w-4 text-green-600' />
              샘플 페이지 및 템플릿 확인
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
              <MessageSquare className='h-4 w-4 text-green-600' />
              에디터 인터페이스 체험
            </div>
          </div>
        </div>

        {/* 게스트 모드 제한사항 */}
        <div className='space-y-3'>
          <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
            제한사항
          </h3>
          <div className='space-y-2'>
            {GUEST_CONFIG.LIMITATIONS.map((limitation, index) => (
              <div
                key={index}
                className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'
              >
                <div className='h-1 w-1 rounded-full bg-gray-400' />
                {limitation}
              </div>
            ))}
          </div>
        </div>

        {/* 세션 정보 */}
        <div className='rounded-lg bg-blue-50 p-3 dark:bg-blue-950'>
          <div className='flex items-center gap-2 text-sm'>
            <Clock className='h-4 w-4 text-blue-600' />
            <span className='text-blue-800 dark:text-blue-200'>
              게스트 세션은 1시간 동안 유지됩니다
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='flex flex-col space-y-4'>
        <Button onClick={handleGuestLogin} className='w-full' variant='outline'>
          게스트로 시작하기
        </Button>

        <div className='text-center text-sm'>
          <span className='text-gray-600 dark:text-gray-400'>
            모든 기능을 사용하려면{' '}
          </span>
          <Link
            href='/register'
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            회원가입
          </Link>
          <span className='text-gray-600 dark:text-gray-400'> 하세요</span>
        </div>

        <div className='text-center'>
          <Link
            href='/login'
            className='text-sm text-blue-600 hover:text-blue-500'
          >
            ← 로그인으로 돌아가기
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
