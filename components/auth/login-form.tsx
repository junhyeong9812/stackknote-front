// components/auth/login-form.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { useLoginForm } from '@/lib/hooks';
import { cn } from '@/lib/utils/cn';

interface LoginFormProps {
  className?: string;
  onSuccess?: () => void;
}

export function LoginForm({ className, onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, updateField, handleSubmit, isLoading, error, clearError } =
    useLoginForm();

  const onSubmit = async (e: React.FormEvent) => {
    try {
      await handleSubmit(e);
      onSuccess?.();
    } catch (err) {
      // 에러는 이미 훅에서 처리됨
    }
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader className='text-center'>
        <CardTitle>로그인</CardTitle>
        <CardDescription>StackNote에 오신 것을 환영합니다</CardDescription>
      </CardHeader>

      <form onSubmit={onSubmit}>
        <CardContent className='space-y-4'>
          {error && (
            <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950'>
              {error}
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='email'>이메일</Label>
            <Input
              id='email'
              type='email'
              placeholder='이메일을 입력하세요'
              value={formData.email}
              onChange={e => {
                updateField('email', e.target.value);
                if (error) clearError();
              }}
              required
              autoComplete='email'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>비밀번호</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='비밀번호를 입력하세요'
                value={formData.password}
                onChange={e => {
                  updateField('password', e.target.value);
                  if (error) clearError();
                }}
                required
                autoComplete='current-password'
                className='pr-10'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-400' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-400' />
                )}
              </Button>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <label className='flex items-center space-x-2 text-sm'>
              <input
                type='checkbox'
                checked={formData.rememberMe}
                onChange={e => updateField('rememberMe', e.target.checked)}
                className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span>로그인 상태 유지</span>
            </label>

            <Link
              href='/forgot-password'
              className='text-sm text-blue-600 hover:text-blue-500'
            >
              비밀번호 찾기
            </Link>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <Button
            type='submit'
            className='w-full'
            disabled={isLoading || !formData.email || !formData.password}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </Button>

          <div className='text-center text-sm'>
            <span className='text-gray-600 dark:text-gray-400'>
              계정이 없으신가요?{' '}
            </span>
            <Link
              href='/register'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              회원가입
            </Link>
          </div>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-gray-300 dark:border-gray-600' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-gray-500 dark:bg-gray-900'>
                또는
              </span>
            </div>
          </div>

          <Link href='/guest' className='w-full'>
            <Button type='button' variant='outline' className='w-full'>
              게스트로 둘러보기
            </Button>
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
