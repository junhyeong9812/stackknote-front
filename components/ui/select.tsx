/**
 * Select 컴포넌트
 * Radix UI Select 기반의 커스텀 선택 컴포넌트
 */

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { type VariantProps, cva } from 'class-variance-authority';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Select 기본 컴포넌트들
const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

// Trigger 스타일 변형
const triggerVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
  {
    variants: {
      variant: {
        default: 'border-input',
        error: 'border-destructive focus:ring-destructive',
      },
      size: {
        default: 'h-10',
        sm: 'h-9 text-xs',
        lg: 'h-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// SelectTrigger 컴포넌트
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    VariantProps<typeof triggerVariants> & {
      error?: boolean;
    }
>(({ className, children, variant, size, error, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      triggerVariants({
        variant: error ? 'error' : variant,
        size,
      }),
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className='h-4 w-4 opacity-50' />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// SelectScrollUpButton 컴포넌트
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronUp className='h-4 w-4' />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

// SelectScrollDownButton 컴포넌트
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronDown className='h-4 w-4' />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

// SelectContent 컴포넌트
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md',
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport className='p-1'>
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

// SelectLabel 컴포넌트
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pr-2 pl-8 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

// SelectItem 컴포넌트
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    icon?: React.ReactNode;
    description?: string;
  }
>(({ className, children, icon, description, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <SelectPrimitive.ItemIndicator>
        <Check className='h-4 w-4' />
      </SelectPrimitive.ItemIndicator>
    </span>

    <div className='flex items-center gap-2'>
      {icon && <span className='flex-shrink-0'>{icon}</span>}
      <div className='flex flex-col'>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        {description && (
          <span className='text-muted-foreground text-xs'>{description}</span>
        )}
      </div>
    </div>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// SelectSeparator 컴포넌트
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('bg-muted -mx-1 my-1 h-px', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// 옵션 타입 정의
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

// SimpleSelect 컴포넌트 (편의를 위한 래퍼)
export interface SimpleSelectProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
    'children'
  > {
  options?: SelectOption[];
  groups?: SelectGroup[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  triggerClassName?: string;
  loading?: boolean;
  searchable?: boolean;
  emptyMessage?: string;
}

const SimpleSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SimpleSelectProps
>(
  (
    {
      options = [],
      groups = [],
      placeholder = '선택하세요',
      error,
      helperText,
      size = 'default',
      className,
      triggerClassName,
      loading = false,
      searchable = false,
      emptyMessage = '옵션이 없습니다',
      ...props
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const hasError = !!error;

    // 검색 필터링
    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchQuery) return options;

      return options.filter(
        option =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          option.value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery, searchable]);

    const filteredGroups = React.useMemo(() => {
      if (!searchable || !searchQuery) return groups;

      return groups
        .map(group => ({
          ...group,
          options: group.options.filter(
            option =>
              option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              option.value.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter(group => group.options.length > 0);
    }, [groups, searchQuery, searchable]);

    const hasContent = filteredOptions.length > 0 || filteredGroups.length > 0;

    return (
      <div className={cn('relative w-full', className)}>
        <Select {...props}>
          <SelectTrigger
            ref={ref}
            className={triggerClassName}
            size={size}
            error={hasError}
            disabled={loading}
          >
            {loading ? (
              <div className='flex items-center gap-2'>
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
                로딩 중...
              </div>
            ) : (
              <SelectValue placeholder={placeholder} />
            )}
          </SelectTrigger>

          <SelectContent>
            {/* 검색 기능 */}
            {searchable && (
              <div className='border-b p-2'>
                <input
                  type='text'
                  placeholder='검색...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='bg-background border-input focus:ring-ring h-8 w-full rounded border px-2 text-sm focus:ring-2 focus:outline-none'
                />
              </div>
            )}

            {/* 일반 옵션들 */}
            {filteredOptions.map(option => (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                icon={option.icon}
                description={option.description}
              >
                {option.label}
              </SelectItem>
            ))}

            {/* 그룹화된 옵션들 */}
            {filteredGroups.map((group, groupIndex) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.options.map(option => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    icon={option.icon}
                    description={option.description}
                  >
                    {option.label}
                  </SelectItem>
                ))}
                {groupIndex < filteredGroups.length - 1 && <SelectSeparator />}
              </SelectGroup>
            ))}

            {/* 빈 상태 메시지 */}
            {!hasContent && !loading && (
              <div className='text-muted-foreground p-4 text-center text-sm'>
                {emptyMessage}
              </div>
            )}
          </SelectContent>
        </Select>

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

SimpleSelect.displayName = 'SimpleSelect';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SimpleSelect,
};
