/**
 * Badge 컴포넌트
 * 상태, 카테고리, 카운트 등을 표시하는 작은 라벨 컴포넌트
 */

import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Badge 변형 스타일 정의
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success:
          'border-transparent bg-green-500 text-white hover:bg-green-500/80',
        warning:
          'border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80',
        info: 'border-transparent bg-blue-500 text-white hover:bg-blue-500/80',
        outline: 'text-foreground border-border',
        ghost:
          'border-transparent bg-transparent text-foreground hover:bg-muted',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Badge Props 타입
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
}

// 기본 Badge 컴포넌트
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      leftIcon,
      rightIcon,
      removable = false,
      onRemove,
      disabled = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    };

    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          disabled && 'cursor-not-allowed opacity-50',
          onClick && !disabled && 'cursor-pointer',
          className
        )}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {leftIcon && <span className='mr-1 flex-shrink-0'>{leftIcon}</span>}

        <span className='flex-1'>{children}</span>

        {rightIcon && !removable && (
          <span className='ml-1 flex-shrink-0'>{rightIcon}</span>
        )}

        {removable && (
          <button
            type='button'
            className='ml-1 flex-shrink-0 rounded-full p-0.5 transition-colors hover:bg-black/10'
            onClick={handleRemove}
            disabled={disabled}
            aria-label='Remove'
          >
            <X className='h-3 w-3' />
          </button>
        )}
      </div>
    );
  }
);
Badge.displayName = 'Badge';

// 미리 구성된 Badge 컴포넌트들

// StatusBadge - 상태 표시용 배지
export interface StatusBadgeProps
  extends Omit<BadgeProps, 'variant' | 'children'> {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning';
  showDot?: boolean;
  label?: string;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, showDot = true, label, className, ...props }, ref) => {
    const statusConfig = {
      active: {
        variant: 'success' as const,
        label: label || '활성',
        dotColor: 'bg-green-500',
      },
      inactive: {
        variant: 'secondary' as const,
        label: label || '비활성',
        dotColor: 'bg-gray-500',
      },
      pending: {
        variant: 'warning' as const,
        label: label || '대기중',
        dotColor: 'bg-yellow-500',
      },
      error: {
        variant: 'destructive' as const,
        label: label || '오류',
        dotColor: 'bg-red-500',
      },
      success: {
        variant: 'success' as const,
        label: label || '성공',
        dotColor: 'bg-green-500',
      },
      warning: {
        variant: 'warning' as const,
        label: label || '경고',
        dotColor: 'bg-yellow-500',
      },
    };

    const config = statusConfig[status];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        className={className}
        leftIcon={
          showDot ? (
            <span className={cn('h-2 w-2 rounded-full', config.dotColor)} />
          ) : undefined
        }
        {...props}
      >
        {config.label}
      </Badge>
    );
  }
);
StatusBadge.displayName = 'StatusBadge';

// CountBadge - 숫자 표시용 배지
export interface CountBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number;
  max?: number;
  showZero?: boolean;
}

const CountBadge = React.forwardRef<HTMLDivElement, CountBadgeProps>(
  ({ count, max = 99, showZero = false, className, ...props }, ref) => {
    if (count === 0 && !showZero) {
      return null;
    }

    const displayCount = count > max ? `${max}+` : count.toString();

    return (
      <Badge
        ref={ref}
        variant='destructive'
        size='sm'
        className={cn('h-5 min-w-[1.25rem] px-1', className)}
        {...props}
      >
        {displayCount}
      </Badge>
    );
  }
);
CountBadge.displayName = 'CountBadge';

// TagBadge - 태그용 배지
export interface TagBadgeProps
  extends Omit<BadgeProps, 'removable' | 'onRemove'> {
  color?: string;
  editable?: boolean;
  onEdit?: (newValue: string) => void;
  onRemove?: () => void;
}

const TagBadge = React.forwardRef<HTMLDivElement, TagBadgeProps>(
  (
    {
      color,
      editable = false,
      onEdit,
      onRemove,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState(String(children || ''));
    const inputRef = React.useRef<HTMLInputElement>(null);

    // 색상이 제공된 경우 스타일 생성
    const customStyle = color
      ? {
          backgroundColor: color,
          borderColor: color,
          color: getContrastColor(color),
          ...style,
        }
      : style;

    const handleEdit = () => {
      if (editable) {
        setIsEditing(true);
        setEditValue(String(children || ''));
      }
    };

    const handleSave = () => {
      if (editValue.trim() && editValue !== children) {
        onEdit?.(editValue.trim());
      }
      setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSave();
      } else if (e.key === 'Escape') {
        setIsEditing(false);
        setEditValue(String(children || ''));
      }
    };

    React.useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    if (isEditing) {
      return (
        <input
          ref={inputRef}
          type='text'
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={cn(
            'bg-background border-border inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
            className
          )}
          style={style}
        />
      );
    }

    return (
      <Badge
        ref={ref}
        variant={color ? 'ghost' : 'secondary'}
        className={cn(editable && 'cursor-pointer hover:opacity-80', className)}
        style={customStyle}
        onClick={handleEdit}
        removable={!!onRemove}
        onRemove={onRemove}
        {...props}
      >
        {children}
      </Badge>
    );
  }
);
TagBadge.displayName = 'TagBadge';

// 색상 대비 계산 함수
function getContrastColor(hexColor: string): string {
  // hex 색상에서 # 제거
  const hex = hexColor.replace('#', '');

  // RGB 값 추출
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // 밝기 계산 (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // 밝기에 따라 텍스트 색상 결정
  return brightness > 128 ? '#000000' : '#ffffff';
}

// PriorityBadge - 우선순위 표시용 배지
export interface PriorityBadgeProps
  extends Omit<BadgeProps, 'variant' | 'children'> {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  showIcon?: boolean;
}

const PriorityBadge = React.forwardRef<HTMLDivElement, PriorityBadgeProps>(
  ({ priority, showIcon = true, className, ...props }, ref) => {
    const priorityConfig = {
      low: {
        variant: 'ghost' as const,
        label: '낮음',
        icon: '⬇️',
      },
      medium: {
        variant: 'secondary' as const,
        label: '보통',
        icon: '➡️',
      },
      high: {
        variant: 'warning' as const,
        label: '높음',
        icon: '⬆️',
      },
      urgent: {
        variant: 'destructive' as const,
        label: '긴급',
        icon: '🔥',
      },
    };

    const config = priorityConfig[priority];

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        className={className}
        leftIcon={showIcon ? <span>{config.icon}</span> : undefined}
        {...props}
      >
        {config.label}
      </Badge>
    );
  }
);
PriorityBadge.displayName = 'PriorityBadge';

// NewBadge - "새로운" 표시용 배지
export interface NewBadgeProps extends Omit<BadgeProps, 'children'> {
  pulse?: boolean;
}

const NewBadge = React.forwardRef<HTMLDivElement, NewBadgeProps>(
  ({ pulse = false, className, ...props }, ref) => (
    <Badge
      ref={ref}
      variant='destructive'
      size='sm'
      className={cn('relative', pulse && 'animate-pulse', className)}
      {...props}
    >
      NEW
      {pulse && (
        <span className='absolute -top-1 -right-1 h-2 w-2 animate-ping rounded-full bg-red-400' />
      )}
    </Badge>
  )
);
NewBadge.displayName = 'NewBadge';

export {
  Badge,
  badgeVariants,
  StatusBadge,
  CountBadge,
  TagBadge,
  PriorityBadge,
  NewBadge,
};
