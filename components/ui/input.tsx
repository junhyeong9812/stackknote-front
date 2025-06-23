/**
 * Input 컴포넌트
 * 다양한 타입의 입력 필드를 지원하는 재사용 가능한 컴포넌트
 */

import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

// Input 변형 스타일 정의
const inputVariants = cva(
  'flex w-full border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      size: {
        default: 'h-10 px-3 py-2 rounded-md',
        sm: 'h-9 px-2 py-1 rounded-md text-xs',
        lg: 'h-12 px-4 py-3 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// 기본 Input Props
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  loading?: boolean;
}

// 기본 Input 컴포넌트
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      size,
      leftIcon,
      rightIcon,
      error,
      helperText,
      loading,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const inputVariant = hasError ? 'error' : variant;

    return (
      <div className='relative w-full'>
        {/* 왼쪽 아이콘 */}
        {leftIcon && (
          <div className='text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2'>
            {leftIcon}
          </div>
        )}

        {/* 입력 필드 */}
        <input
          type={type}
          className={cn(
            inputVariants({ variant: inputVariant, size }),
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            loading && 'cursor-wait',
            className
          )}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        />

        {/* 오른쪽 아이콘 */}
        {rightIcon && (
          <div className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2'>
            {rightIcon}
          </div>
        )}

        {/* 로딩 스피너 */}
        {loading && (
          <div className='absolute top-1/2 right-3 -translate-y-1/2'>
            <svg
              className='text-muted-foreground h-4 w-4 animate-spin'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='m12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8z'
              />
            </svg>
          </div>
        )}

        {/* 에러 메시지 또는 헬퍼 텍스트 */}
        {(error || helperText) && (
          <p
            className={cn(
              'mt-1 text-xs',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// 패스워드 Input 컴포넌트
export interface PasswordInputProps
  extends Omit<InputProps, 'type' | 'rightIcon'> {
  showPasswordToggle?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showPasswordToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={
          showPasswordToggle ? (
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='text-muted-foreground hover:text-foreground transition-colors'
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          ) : undefined
        }
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

// 검색 Input 컴포넌트
export interface SearchInputProps extends Omit<InputProps, 'type'> {
  onClear?: () => void;
  showClearButton?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClearButton = true, value, ...props }, ref) => {
    const hasValue = value && String(value).length > 0;

    const handleClear = () => {
      onClear?.();
    };

    return (
      <Input
        {...props}
        ref={ref}
        type='search'
        value={value}
        leftIcon={
          <svg
            className='h-4 w-4'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        }
        rightIcon={
          showClearButton && hasValue ? (
            <button
              type='button'
              onClick={handleClear}
              className='text-muted-foreground hover:text-foreground transition-colors'
              tabIndex={-1}
            >
              <svg
                className='h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          ) : undefined
        }
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Textarea 컴포넌트
export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string;
  helperText?: string;
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      size,
      error,
      helperText,
      autoResize = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const hasError = !!error;
    const inputVariant = hasError ? 'error' : variant;

    // Auto resize 기능
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        const adjustHeight = () => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        };

        textarea.addEventListener('input', adjustHeight);
        adjustHeight(); // 초기 높이 설정

        return () => textarea.removeEventListener('input', adjustHeight);
      }
    }, [autoResize]);

    // ref 병합
    React.useImperativeHandle(ref, () => textareaRef.current!);

    return (
      <div className='relative w-full'>
        <textarea
          className={cn(
            inputVariants({ variant: inputVariant, size }),
            'min-h-[80px] resize-none',
            autoResize && 'resize-none overflow-hidden',
            className
          )}
          ref={textareaRef}
          disabled={disabled}
          {...props}
        />

        {/* 에러 메시지 또는 헬퍼 텍스트 */}
        {(error || helperText) && (
          <p
            className={cn(
              'mt-1 text-xs',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Label 컴포넌트
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className='text-destructive ml-1'>*</span>}
    </label>
  )
);

Label.displayName = 'Label';

// FormField 컴포넌트 (Label + Input 조합)
export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactElement<any>;
  className?: string;
}

const FormField = ({
  label,
  required,
  error,
  helperText,
  children,
  className,
}: FormFieldProps) => {
  const childWithProps = React.cloneElement(children, {
    error,
    helperText: !error ? helperText : undefined,
  } as any);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label required={required} htmlFor={(children.props as any)?.id}>
          {label}
        </Label>
      )}
      {childWithProps}
    </div>
  );
};

export { Input, PasswordInput, SearchInput, Textarea, Label, FormField };
