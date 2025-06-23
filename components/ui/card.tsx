/**
 * Card 컴포넌트
 * 콘텐츠를 그룹화하고 구조화하는 컨테이너 컴포넌트
 */

import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Card 변형 스타일 정의
const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'border-border',
        outline: 'border-2 border-border',
        ghost: 'border-transparent shadow-none',
        elevated: 'shadow-lg border-border',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

// Card Props 타입
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
}

// 기본 Card 컴포넌트
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';

    if (asChild) {
      return <>{props.children}</>;
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

// CardHeader 컴포넌트
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    noPadding?: boolean;
  }
>(({ className, noPadding = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', !noPadding && 'p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// CardTitle 컴포넌트
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  }
>(({ className, as: Comp = 'h3', ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn(
      'text-2xl leading-none font-semibold tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// CardDescription 컴포넌트
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// CardContent 컴포넌트
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    noPadding?: boolean;
  }
>(({ className, noPadding = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(!noPadding && 'p-6 pt-0', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

// CardFooter 컴포넌트
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    noPadding?: boolean;
  }
>(({ className, noPadding = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center', !noPadding && 'p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// 미리 구성된 Card 컴포넌트들

// ClickableCard - 클릭 가능한 카드
export interface ClickableCardProps extends CardProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const ClickableCard = React.forwardRef<HTMLDivElement, ClickableCardProps>(
  ({ className, onClick, disabled, loading, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        'cursor-pointer transition-all',
        !disabled && !loading && 'hover:-translate-y-0.5 hover:shadow-md',
        disabled && 'cursor-not-allowed opacity-50',
        loading && 'cursor-wait',
        className
      )}
      onClick={disabled || loading ? undefined : onClick}
      {...props}
    />
  )
);
ClickableCard.displayName = 'ClickableCard';

// StatCard - 통계 표시용 카드
export interface StatCardProps extends Omit<CardProps, 'children'> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  loading?: boolean;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      title,
      value,
      description,
      icon,
      trend,
      loading = false,
      className,
      ...props
    },
    ref
  ) => (
    <Card ref={ref} className={cn('relative', className)} {...props}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon && <div className='text-muted-foreground h-4 w-4'>{icon}</div>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className='space-y-2'>
            <div className='bg-muted h-8 animate-pulse rounded' />
            <div className='bg-muted h-4 w-2/3 animate-pulse rounded' />
          </div>
        ) : (
          <>
            <div className='text-2xl font-bold'>{value}</div>
            {(description || trend) && (
              <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                {trend && (
                  <span
                    className={cn(
                      'flex items-center gap-1',
                      trend.isPositive ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {trend.isPositive ? '↑' : '↓'}
                    {Math.abs(trend.value)}%
                  </span>
                )}
                {description && <span>{description}</span>}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
);
StatCard.displayName = 'StatCard';

// ImageCard - 이미지가 포함된 카드
export interface ImageCardProps extends Omit<CardProps, 'children'> {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'top' | 'left' | 'right';
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const ImageCard = React.forwardRef<HTMLDivElement, ImageCardProps>(
  (
    {
      title,
      description,
      imageUrl,
      imageAlt = '',
      imagePosition = 'top',
      actions,
      children,
      className,
      ...props
    },
    ref
  ) => (
    <Card
      ref={ref}
      className={cn('overflow-hidden', className)}
      padding='none'
      {...props}
    >
      <div
        className={cn(
          'flex',
          imagePosition === 'top' && 'flex-col',
          imagePosition === 'left' && 'flex-row',
          imagePosition === 'right' && 'flex-row-reverse'
        )}
      >
        {imageUrl && (
          <div
            className={cn(
              'flex-shrink-0',
              imagePosition === 'top' && 'h-48 w-full',
              (imagePosition === 'left' || imagePosition === 'right') &&
                'h-full w-48'
            )}
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              className='h-full w-full object-cover'
            />
          </div>
        )}
        <div className='flex-1 p-6'>
          <CardHeader noPadding>
            <CardTitle className='text-lg'>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          {children && <CardContent noPadding>{children}</CardContent>}
          {actions && (
            <CardFooter noPadding className='pt-4'>
              {actions}
            </CardFooter>
          )}
        </div>
      </div>
    </Card>
  )
);
ImageCard.displayName = 'ImageCard';

// LoadingCard - 로딩 상태 카드
export interface LoadingCardProps extends CardProps {
  lines?: number;
  showHeader?: boolean;
}

const LoadingCard = React.forwardRef<HTMLDivElement, LoadingCardProps>(
  ({ lines = 3, showHeader = true, className, ...props }, ref) => (
    <Card ref={ref} className={className} {...props}>
      {showHeader && (
        <CardHeader>
          <div className='bg-muted h-6 w-1/3 animate-pulse rounded' />
          <div className='bg-muted h-4 w-1/2 animate-pulse rounded' />
        </CardHeader>
      )}
      <CardContent>
        <div className='space-y-3'>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'bg-muted h-4 animate-pulse rounded',
                i === lines - 1 && 'w-2/3'
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
);
LoadingCard.displayName = 'LoadingCard';

// EmptyCard - 빈 상태 카드
export interface EmptyCardProps extends Omit<CardProps, 'children'> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyCard = React.forwardRef<HTMLDivElement, EmptyCardProps>(
  ({ icon, title, description, action, className, ...props }, ref) => (
    <Card ref={ref} className={className} {...props}>
      <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
        {icon && <div className='text-muted-foreground mb-4'>{icon}</div>}
        <CardTitle className='mb-2 text-lg'>{title}</CardTitle>
        {description && (
          <CardDescription className='mb-4 max-w-sm'>
            {description}
          </CardDescription>
        )}
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  )
);
EmptyCard.displayName = 'EmptyCard';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ClickableCard,
  StatCard,
  ImageCard,
  LoadingCard,
  EmptyCard,
};
