/**
 * Progress 컴포넌트
 * Radix UI Progress 기반 진행률 표시
 */

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Progress 변형 스타일
const progressVariants = cva(
  'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      size: {
        sm: 'h-2',
        default: 'h-4',
        lg: 'h-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Progress Indicator 변형 스타일
const progressIndicatorVariants = cva(
  'h-full w-full flex-1 bg-primary transition-all',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        destructive: 'bg-destructive',
        success: 'bg-green-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600',
      },
      animated: {
        true: 'bg-gradient-to-r from-primary/80 via-primary to-primary/80 bg-[length:200%_100%] animate-[shimmer_2s_infinite]',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      animated: false,
    },
  }
);

// 기본 Progress 컴포넌트
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
    VariantProps<typeof progressVariants> &
    VariantProps<typeof progressIndicatorVariants>
>(({ className, value, size, variant, animated, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ size }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressIndicatorVariants({ variant, animated }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

// Progress with Label
export interface ProgressWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof Progress> {
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  description?: string;
}

const ProgressWithLabel = React.forwardRef<
  React.ElementRef<typeof Progress>,
  ProgressWithLabelProps
>(
  (
    {
      label,
      showValue = true,
      valueFormatter,
      description,
      value = 0,
      className,
      ...props
    },
    ref
  ) => {
    const safeValue = value || 0; // null/undefined 처리

    const formatValue = (val: number) => {
      if (valueFormatter) return valueFormatter(val);
      return `${Math.round(val)}%`;
    };

    return (
      <div className={cn('space-y-2', className)}>
        {(label || showValue) && (
          <div className='flex items-center justify-between'>
            {label && (
              <span className='text-foreground text-sm font-medium'>
                {label}
              </span>
            )}
            {showValue && (
              <span className='text-muted-foreground text-sm'>
                {formatValue(safeValue)}
              </span>
            )}
          </div>
        )}

        <Progress ref={ref} value={safeValue} {...props} />

        {description && (
          <p className='text-muted-foreground text-xs'>{description}</p>
        )}
      </div>
    );
  }
);
ProgressWithLabel.displayName = 'ProgressWithLabel';

// Circular Progress
export interface CircularProgressProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  variant?: VariantProps<typeof progressIndicatorVariants>['variant'];
  showValue?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(
  (
    {
      value = 0,
      size = 120,
      strokeWidth = 8,
      variant = 'default',
      showValue = true,
      children,
      className,
    },
    ref
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const safeVariant = variant || 'default'; // null/undefined 처리

    const variantColors = {
      default: 'stroke-primary',
      destructive: 'stroke-destructive',
      success: 'stroke-green-600',
      warning: 'stroke-yellow-600',
      info: 'stroke-blue-600',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          className
        )}
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className='-rotate-90 transform'>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke='currentColor'
            strokeWidth={strokeWidth}
            fill='none'
            className='text-muted/20'
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke='currentColor'
            strokeWidth={strokeWidth}
            fill='none'
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap='round'
            className={cn(
              'transition-all duration-500 ease-in-out',
              variantColors[safeVariant]
            )}
          />
        </svg>

        {/* Center content */}
        <div className='absolute inset-0 flex items-center justify-center'>
          {children ||
            (showValue && (
              <span className='text-xl font-semibold'>
                {Math.round(value)}%
              </span>
            ))}
        </div>
      </div>
    );
  }
);
CircularProgress.displayName = 'CircularProgress';

// Step Progress
export interface StepProgressProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    status?: 'pending' | 'current' | 'completed' | 'error';
  }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  ({ steps, orientation = 'horizontal', className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
          className
        )}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const stepStatus = step.status || 'pending'; // null/undefined 처리

          const statusStyles = {
            pending: 'bg-muted text-muted-foreground border-muted',
            current: 'bg-primary text-primary-foreground border-primary',
            completed: 'bg-green-600 text-white border-green-600',
            error:
              'bg-destructive text-destructive-foreground border-destructive',
          };

          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  'flex items-center',
                  orientation === 'vertical' && 'w-full'
                )}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium',
                    statusStyles[stepStatus]
                  )}
                >
                  {stepStatus === 'completed' ? (
                    <svg
                      className='h-4 w-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : stepStatus === 'error' ? (
                    <svg
                      className='h-4 w-4'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Step Content */}
                <div
                  className={cn('ml-3', orientation === 'vertical' && 'flex-1')}
                >
                  <h3
                    className={cn(
                      'text-sm font-medium',
                      stepStatus === 'current' && 'text-primary',
                      stepStatus === 'completed' && 'text-green-600',
                      stepStatus === 'error' && 'text-destructive'
                    )}
                  >
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className='text-muted-foreground text-xs'>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector */}
              {!isLast && (
                <div
                  className={cn(
                    'bg-muted',
                    orientation === 'horizontal'
                      ? 'mx-4 h-0.5 w-12'
                      : 'my-2 ml-4 h-8 w-0.5',
                    (stepStatus === 'completed' ||
                      (steps[index + 1]?.status || 'pending') ===
                        'completed') &&
                      'bg-green-600'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);
StepProgress.displayName = 'StepProgress';

// Multi Progress (여러 진행률을 하나에 표시)
export interface MultiProgressProps {
  segments: Array<{
    value: number;
    label?: string;
    color?: string;
    variant?: VariantProps<typeof progressIndicatorVariants>['variant'];
  }>;
  size?: VariantProps<typeof progressVariants>['size'];
  showLabels?: boolean;
  className?: string;
}

const MultiProgress = React.forwardRef<HTMLDivElement, MultiProgressProps>(
  ({ segments, size = 'default', showLabels = true, className }, ref) => {
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {/* Progress Bar */}
        <div className={cn(progressVariants({ size }))}>
          {segments.map((segment, index) => {
            const percentage = (segment.value / total) * 100;

            const variantColors = {
              default: 'bg-primary',
              destructive: 'bg-destructive',
              success: 'bg-green-600',
              warning: 'bg-yellow-600',
              info: 'bg-blue-600',
            };

            return (
              <div
                key={index}
                className={cn(
                  'h-full transition-all',
                  segment.color
                    ? ''
                    : variantColors[segment.variant || 'default']
                )}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: segment.color,
                  display: 'inline-block',
                }}
              />
            );
          })}
        </div>

        {/* Labels */}
        {showLabels && (
          <div className='flex flex-wrap gap-4 text-sm'>
            {segments.map((segment, index) => (
              <div key={index} className='flex items-center gap-2'>
                <div
                  className='h-3 w-3 rounded-full'
                  style={{
                    backgroundColor:
                      segment.color ||
                      (segment.variant === 'destructive'
                        ? 'hsl(var(--destructive))'
                        : segment.variant === 'success'
                          ? 'rgb(34 197 94)'
                          : segment.variant === 'warning'
                            ? 'rgb(234 179 8)'
                            : segment.variant === 'info'
                              ? 'rgb(37 99 235)'
                              : 'hsl(var(--primary))'),
                  }}
                />
                <span className='text-muted-foreground'>
                  {segment.label}: {segment.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
MultiProgress.displayName = 'MultiProgress';

export {
  Progress,
  ProgressWithLabel,
  CircularProgress,
  StepProgress,
  MultiProgress,
};
