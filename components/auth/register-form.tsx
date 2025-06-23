// components/auth/register-form.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
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
import { useRegisterForm } from '@/lib/hooks';
import {
  validatePasswordStrength,
  validateUsername,
  validateEmail,
} from '@/lib/config/auth-config';
import { cn } from '@/lib/utils/cn';

interface RegisterFormProps {
  className?: string;
  onSuccess?: () => void;
}

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  const { score, feedback } = validatePasswordStrength(password);

  const strengthLabels = ['매우 약함', '약함', '보통', '강함', '매우 강함'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-blue-500',
    'bg-green-500',
  ];

  if (!password) return null;

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <div className='flex flex-1 gap-1'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 rounded-full transition-colors',
                i <= score
                  ? strengthColors[score]
                  : 'bg-gray-200 dark:bg-gray-700'
              )}
              style={{ flex: 1 }}
            />
          ))}
        </div>
        <span className='text-xs text-gray-600 dark:text-gray-400'>
          {strengthLabels[score]}
        </span>
      </div>

      {feedback.length > 0 && (
        <ul className='space-y-1'>
          {feedback.map((item, index) => (
            <li
              key={index}
              className='flex items-center gap-2 text-xs text-red-600'
            >
              <X className='h-3 w-3' />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export function RegisterForm({ className, onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { formData, updateField, handleSubmit, isLoading, error, clearError } =
    useRegisterForm();

  // 유효성 검사 결과
  const emailValidation = validateEmail(formData.email);
  const usernameValidation = validateUsername(formData.username);
  const passwordValidation = validatePasswordStrength(formData.password);
  const isPasswordMatch = formData.password === formData.confirmPassword;

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
        <CardTitle>회원가입</CardTitle>
        <CardDescription>StackNote 계정을 만들어 시작하세요</CardDescription>
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
            {formData.email && !emailValidation.isValid && (
              <p className='flex items-center gap-1 text-xs text-red-600'>
                <X className='h-3 w-3' />
                {emailValidation.error}
              </p>
            )}
            {formData.email && emailValidation.isValid && (
              <p className='flex items-center gap-1 text-xs text-green-600'>
                <Check className='h-3 w-3' />
                사용 가능한 이메일입니다
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='username'>사용자명</Label>
            <Input
              id='username'
              type='text'
              placeholder='사용자명을 입력하세요'
              value={formData.username}
              onChange={e => {
                updateField('username', e.target.value);
                if (error) clearError();
              }}
              required
              autoComplete='username'
            />
            {formData.username && !usernameValidation.isValid && (
              <p className='flex items-center gap-1 text-xs text-red-600'>
                <X className='h-3 w-3' />
                {usernameValidation.error}
              </p>
            )}
            {formData.username && usernameValidation.isValid && (
              <p className='flex items-center gap-1 text-xs text-green-600'>
                <Check className='h-3 w-3' />
                사용 가능한 사용자명입니다
              </p>
            )}
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
                autoComplete='new-password'
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
            <PasswordStrengthIndicator password={formData.password} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>비밀번호 확인</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='비밀번호를 다시 입력하세요'
                value={formData.confirmPassword}
                onChange={e => {
                  updateField('confirmPassword', e.target.value);
                  if (error) clearError();
                }}
                required
                autoComplete='new-password'
                className='pr-10'
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-4 w-4 text-gray-400' />
                ) : (
                  <Eye className='h-4 w-4 text-gray-400' />
                )}
              </Button>
            </div>
            {formData.confirmPassword && !isPasswordMatch && (
              <p className='flex items-center gap-1 text-xs text-red-600'>
                <X className='h-3 w-3' />
                비밀번호가 일치하지 않습니다
              </p>
            )}
            {formData.confirmPassword &&
              isPasswordMatch &&
              formData.password && (
                <p className='flex items-center gap-1 text-xs text-green-600'>
                  <Check className='h-3 w-3' />
                  비밀번호가 일치합니다
                </p>
              )}
          </div>

          <div className='flex items-start space-x-2'>
            <input
              type='checkbox'
              id='agreeToTerms'
              checked={formData.agreeToTerms}
              onChange={e => updateField('agreeToTerms', e.target.checked)}
              className='mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              required
            />
            <label
              htmlFor='agreeToTerms'
              className='text-sm text-gray-600 dark:text-gray-400'
            >
              <Link href='/terms' className='text-blue-600 hover:text-blue-500'>
                이용약관
              </Link>{' '}
              및{' '}
              <Link
                href='/privacy'
                className='text-blue-600 hover:text-blue-500'
              >
                개인정보처리방침
              </Link>
              에 동의합니다
            </label>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <Button
            type='submit'
            className='w-full'
            disabled={
              isLoading ||
              !formData.email ||
              !formData.username ||
              !formData.password ||
              !formData.confirmPassword ||
              !formData.agreeToTerms ||
              !emailValidation.isValid ||
              !usernameValidation.isValid ||
              !passwordValidation.isValid ||
              !isPasswordMatch
            }
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                계정 생성 중...
              </>
            ) : (
              '계정 만들기'
            )}
          </Button>

          <div className='text-center text-sm'>
            <span className='text-gray-600 dark:text-gray-400'>
              이미 계정이 있으신가요?{' '}
            </span>
            <Link
              href='/login'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              로그인
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
