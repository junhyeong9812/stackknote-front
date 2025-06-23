/**
 * Tooltip 컴포넌트
 * Radix UI Tooltip 기반
 */

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Tooltip 변형 스타일 정의
const tooltipVariants = cva(
  'z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'bg-popover border shadow-md',
        dark: 'bg-gray-900 text-gray-50 border-gray-800',
        light: 'bg-white text-gray-900 border-gray-200 shadow-lg',
        error: 'bg-destructive text-destructive-foreground border-destructive',
        success: 'bg-green-600 text-white border-green-700',
        warning: 'bg-yellow-600 text-white border-yellow-700',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// 기본 Tooltip 컴포넌트들
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

// TooltipContent 컴포넌트
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    VariantProps<typeof tooltipVariants>
>(({ className, sideOffset = 4, variant, size, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipVariants({ variant, size }), className)}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// 간단한 Tooltip Props
export interface SimpleTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  variant?: VariantProps<typeof tooltipVariants>['variant'];
  size?: VariantProps<typeof tooltipVariants>['size'];
  delayDuration?: number;
  disabled?: boolean;
  className?: string;
  asChild?: boolean;
}

// 간단한 Tooltip 컴포넌트 (편의용)
const SimpleTooltip = React.forwardRef<HTMLButtonElement, SimpleTooltipProps>(
  (
    {
      content,
      children,
      side = 'top',
      align = 'center',
      variant = 'default',
      size = 'default',
      delayDuration = 400,
      disabled = false,
      className,
      asChild = false,
      ...props
    },
    ref
  ) => {
    if (disabled || !content) {
      return <>{children}</>;
    }

    return (
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger ref={ref} asChild={asChild} {...props}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          variant={variant}
          size={size}
          className={className}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    );
  }
);
SimpleTooltip.displayName = 'SimpleTooltip';

// 아이콘 버튼용 Tooltip
export interface IconTooltipProps extends Omit<SimpleTooltipProps, 'children'> {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const IconTooltip = React.forwardRef<HTMLButtonElement, IconTooltipProps>(
  (
    {
      content,
      icon,
      onClick,
      disabled = false,
      loading = false,
      variant = 'default',
      size = 'default',
      ...props
    },
    ref
  ) => (
    <SimpleTooltip
      content={content}
      variant={variant}
      size={size}
      disabled={disabled}
      {...props}
    >
      <button
        ref={ref}
        type='button'
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          'hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
          loading && 'cursor-wait'
        )}
      >
        {loading ? (
          <svg
            className='h-4 w-4 animate-spin'
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
        ) : (
          icon
        )}
      </button>
    </SimpleTooltip>
  )
);
IconTooltip.displayName = 'IconTooltip';

// 키보드 단축키 Tooltip
export interface KeyboardTooltipProps
  extends Omit<SimpleTooltipProps, 'content'> {
  description: string;
  keys: string[];
  children: React.ReactNode;
}

const KeyboardTooltip = React.forwardRef<
  HTMLButtonElement,
  KeyboardTooltipProps
>(({ description, keys, children, ...props }, ref) => {
  const tooltipContent = (
    <div className='flex flex-col gap-1'>
      <span>{description}</span>
      <div className='flex gap-1'>
        {keys.map((key, index) => (
          <kbd
            key={index}
            className='bg-muted text-muted-foreground inline-flex h-5 min-w-[20px] items-center justify-center rounded border px-1 text-[10px] font-medium'
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );

  return (
    <SimpleTooltip ref={ref} content={tooltipContent} {...props}>
      {children}
    </SimpleTooltip>
  );
});
KeyboardTooltip.displayName = 'KeyboardTooltip';

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
  IconTooltip,
  KeyboardTooltip,
};
