/**
 * Skeleton 컴포넌트
 * 로딩 상태를 위한 스켈레톤 UI
 */

import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Skeleton 변형 스타일
const skeletonVariants = cva('animate-pulse rounded-md bg-muted', {
  variants: {
    variant: {
      default: 'bg-muted',
      shimmer:
        'bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]',
      pulse: 'bg-muted animate-pulse',
      wave: 'bg-muted animate-[wave_2s_ease-in-out_infinite]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// 기본 Skeleton 컴포넌트
export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, circle, style, ...props }, ref) => {
    const skeletonStyle = {
      width: typeof width === 'number' ? `${width}px` : width,
      height: typeof height === 'number' ? `${height}px` : height,
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn(
          skeletonVariants({ variant }),
          circle && 'rounded-full',
          className
        )}
        style={skeletonStyle}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

// Text Skeleton
export interface TextSkeletonProps extends Omit<SkeletonProps, 'height'> {
  lines?: number;
  lineHeight?: string | number;
  lastLineWidth?: string;
}

const TextSkeleton = React.forwardRef<HTMLDivElement, TextSkeletonProps>(
  (
    {
      lines = 1,
      lineHeight = '1rem',
      lastLineWidth = '60%',
      className,
      ...props
    },
    ref
  ) => {
    if (lines === 1) {
      return (
        <Skeleton
          ref={ref}
          height={lineHeight}
          className={className}
          {...props}
        />
      );
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            height={lineHeight}
            width={index === lines - 1 ? lastLineWidth : '100%'}
            {...props}
          />
        ))}
      </div>
    );
  }
);
TextSkeleton.displayName = 'TextSkeleton';

// Avatar Skeleton
export interface AvatarSkeletonProps extends Omit<SkeletonProps, 'circle'> {
  size?: 'sm' | 'default' | 'lg' | 'xl';
}

const AvatarSkeleton = React.forwardRef<HTMLDivElement, AvatarSkeletonProps>(
  ({ size = 'default', className, ...props }, ref) => {
    const sizeMap = {
      sm: 32,
      default: 40,
      lg: 48,
      xl: 64,
    };

    return (
      <Skeleton
        ref={ref}
        circle
        width={sizeMap[size]}
        height={sizeMap[size]}
        className={className}
        {...props}
      />
    );
  }
);
AvatarSkeleton.displayName = 'AvatarSkeleton';

// Card Skeleton
export interface CardSkeletonProps
  extends Omit<SkeletonProps, 'width' | 'height'> {
  showImage?: boolean;
  imageHeight?: string | number;
  showAvatar?: boolean;
  titleLines?: number;
  bodyLines?: number;
  showActions?: boolean;
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  (
    {
      showImage = false,
      imageHeight = '200px',
      showAvatar = false,
      titleLines = 1,
      bodyLines = 3,
      showActions = false,
      className,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn('bg-card space-y-4 rounded-lg border p-6', className)}
    >
      {/* Image */}
      {showImage && (
        <Skeleton
          height={imageHeight}
          className='w-full rounded-md'
          {...props}
        />
      )}

      {/* Avatar and Title Row */}
      <div className='flex items-start gap-4'>
        {showAvatar && <AvatarSkeleton {...props} />}
        <div className='flex-1 space-y-2'>
          <TextSkeleton lines={titleLines} lineHeight='1.25rem' {...props} />
        </div>
      </div>

      {/* Body */}
      {bodyLines > 0 && (
        <TextSkeleton lines={bodyLines} lineHeight='1rem' {...props} />
      )}

      {/* Actions */}
      {showActions && (
        <div className='flex gap-2 pt-2'>
          <Skeleton width='80px' height='2rem' {...props} />
          <Skeleton width='80px' height='2rem' {...props} />
        </div>
      )}
    </div>
  )
);
CardSkeleton.displayName = 'CardSkeleton';

// Table Skeleton
export interface TableSkeletonProps
  extends Omit<SkeletonProps, 'width' | 'height'> {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

const TableSkeleton = React.forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ rows = 5, columns = 4, showHeader = true, className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-3', className)}>
      {/* Header */}
      {showHeader && (
        <div className='flex gap-4'>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={`header-${index}`}
              height='1.25rem'
              className='flex-1'
              {...props}
            />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className='space-y-2'>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className='flex gap-4'>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`cell-${rowIndex}-${colIndex}`}
                height='1rem'
                className='flex-1'
                {...props}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
);
TableSkeleton.displayName = 'TableSkeleton';

// Button Skeleton
export interface ButtonSkeletonProps extends Omit<SkeletonProps, 'height'> {
  size?: 'sm' | 'default' | 'lg';
}

const ButtonSkeleton = React.forwardRef<HTMLDivElement, ButtonSkeletonProps>(
  ({ size = 'default', className, ...props }, ref) => {
    const sizeMap = {
      sm: { width: '60px', height: '2rem' },
      default: { width: '80px', height: '2.5rem' },
      lg: { width: '100px', height: '2.75rem' },
    };

    return (
      <Skeleton
        ref={ref}
        width={sizeMap[size].width}
        height={sizeMap[size].height}
        className={cn('rounded-md', className)}
        {...props}
      />
    );
  }
);
ButtonSkeleton.displayName = 'ButtonSkeleton';

// List Skeleton
export interface ListSkeletonProps
  extends Omit<SkeletonProps, 'width' | 'height'> {
  items?: number;
  showAvatar?: boolean;
  showIcon?: boolean;
  showActions?: boolean;
}

const ListSkeleton = React.forwardRef<HTMLDivElement, ListSkeletonProps>(
  (
    {
      items = 5,
      showAvatar = false,
      showIcon = false,
      showActions = false,
      className,
      ...props
    },
    ref
  ) => (
    <div ref={ref} className={cn('space-y-3', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className='flex items-center gap-3 p-2'>
          {/* Avatar or Icon */}
          {showAvatar && <AvatarSkeleton size='sm' {...props} />}
          {showIcon && !showAvatar && (
            <Skeleton width='1.5rem' height='1.5rem' {...props} />
          )}

          {/* Content */}
          <div className='flex-1 space-y-1'>
            <Skeleton height='1rem' width='70%' {...props} />
            <Skeleton height='0.875rem' width='50%' {...props} />
          </div>

          {/* Actions */}
          {showActions && (
            <div className='flex gap-2'>
              <Skeleton width='2rem' height='2rem' {...props} />
              <Skeleton width='2rem' height='2rem' {...props} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
);
ListSkeleton.displayName = 'ListSkeleton';

// Navigation Skeleton
export interface NavSkeletonProps
  extends Omit<SkeletonProps, 'width' | 'height'> {
  items?: number;
  showIcons?: boolean;
  showSubItems?: boolean;
}

const NavSkeleton = React.forwardRef<HTMLDivElement, NavSkeletonProps>(
  (
    { items = 6, showIcons = true, showSubItems = false, className, ...props },
    ref
  ) => (
    <div ref={ref} className={cn('space-y-1', className)}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className='space-y-1'>
          {/* Main Item */}
          <div className='flex items-center gap-3 p-2'>
            {showIcons && (
              <Skeleton width='1.25rem' height='1.25rem' {...props} />
            )}
            <Skeleton height='1rem' width='60%' {...props} />
          </div>

          {/* Sub Items */}
          {showSubItems && index < 2 && (
            <div className='ml-8 space-y-1'>
              {Array.from({ length: 2 }).map((_, subIndex) => (
                <div
                  key={`sub-${subIndex}`}
                  className='flex items-center gap-2 p-1'
                >
                  <Skeleton height='0.875rem' width='50%' {...props} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
);
NavSkeleton.displayName = 'NavSkeleton';

// Page Skeleton (전체 페이지 로딩용)
export interface PageSkeletonProps
  extends Omit<SkeletonProps, 'width' | 'height'> {
  layout?: 'dashboard' | 'article' | 'profile' | 'list';
}

const PageSkeleton = React.forwardRef<HTMLDivElement, PageSkeletonProps>(
  ({ layout = 'dashboard', className, ...props }, ref) => {
    if (layout === 'dashboard') {
      return (
        <div ref={ref} className={cn('space-y-6', className)}>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <Skeleton height='2rem' width='200px' {...props} />
              <Skeleton height='1rem' width='300px' {...props} />
            </div>
            <ButtonSkeleton {...props} />
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton
                key={index}
                titleLines={1}
                bodyLines={1}
                showActions={false}
                {...props}
              />
            ))}
          </div>

          {/* Chart */}
          <Skeleton height='300px' className='rounded-lg' {...props} />

          {/* Table */}
          <TableSkeleton {...props} />
        </div>
      );
    }

    if (layout === 'article') {
      return (
        <div ref={ref} className={cn('mx-auto max-w-4xl space-y-6', className)}>
          {/* Header */}
          <div className='space-y-4'>
            <Skeleton height='3rem' width='80%' {...props} />
            <div className='flex items-center gap-4'>
              <AvatarSkeleton {...props} />
              <div className='space-y-1'>
                <Skeleton height='1rem' width='120px' {...props} />
                <Skeleton height='0.875rem' width='100px' {...props} />
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <Skeleton height='400px' className='rounded-lg' {...props} />

          {/* Content */}
          <div className='space-y-4'>
            {Array.from({ length: 6 }).map((_, index) => (
              <TextSkeleton
                key={index}
                lines={Math.floor(Math.random() * 4) + 2}
                {...props}
              />
            ))}
          </div>
        </div>
      );
    }

    if (layout === 'profile') {
      return (
        <div ref={ref} className={cn('space-y-6', className)}>
          {/* Profile Header */}
          <div className='flex items-start gap-6'>
            <AvatarSkeleton size='xl' {...props} />
            <div className='flex-1 space-y-3'>
              <Skeleton height='2rem' width='200px' {...props} />
              <Skeleton height='1rem' width='300px' {...props} />
              <div className='flex gap-2'>
                <ButtonSkeleton {...props} />
                <ButtonSkeleton {...props} />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className='flex gap-4 border-b'>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} height='1.25rem' width='80px' {...props} />
            ))}
          </div>

          {/* Content Grid */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton
                key={index}
                showImage
                imageHeight='150px'
                titleLines={1}
                bodyLines={2}
                {...props}
              />
            ))}
          </div>
        </div>
      );
    }

    // Default list layout
    return (
      <div ref={ref} className={cn('space-y-4', className)}>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <Skeleton height='2rem' width='150px' {...props} />
          <ButtonSkeleton {...props} />
        </div>

        {/* Search/Filter */}
        <div className='flex gap-2'>
          <Skeleton height='2.5rem' width='300px' {...props} />
          <ButtonSkeleton {...props} />
        </div>

        {/* List */}
        <ListSkeleton items={8} showAvatar showActions {...props} />
      </div>
    );
  }
);
PageSkeleton.displayName = 'PageSkeleton';

// Skeleton Provider (전역 스켈레톤 설정)
export interface SkeletonProviderProps {
  children: React.ReactNode;
  variant?: VariantProps<typeof skeletonVariants>['variant'];
}

const SkeletonProvider = React.createContext<{
  variant?: VariantProps<typeof skeletonVariants>['variant'];
}>({});

const SkeletonProviderComponent = ({
  children,
  variant,
}: SkeletonProviderProps) => (
  <SkeletonProvider.Provider value={{ variant }}>
    {children}
  </SkeletonProvider.Provider>
);

// Hook to use skeleton context
const useSkeleton = () => {
  const context = React.useContext(SkeletonProvider);
  return context;
};

export {
  Skeleton,
  TextSkeleton,
  AvatarSkeleton,
  CardSkeleton,
  TableSkeleton,
  ButtonSkeleton,
  ListSkeleton,
  NavSkeleton,
  PageSkeleton,
  SkeletonProviderComponent as SkeletonProvider,
  useSkeleton,
};
