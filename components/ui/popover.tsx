/**
 * Popover 컴포넌트
 * Radix UI Popover 기반
 */

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Popover Content 변형 스타일
const popoverVariants = cva(
  'z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      size: {
        sm: 'w-64',
        default: 'w-80',
        lg: 'w-96',
        xl: 'w-[480px]',
        auto: 'w-auto',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// 기본 Popover 컴포넌트들
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

// PopoverContent 컴포넌트
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
    VariantProps<typeof popoverVariants>
>(({ className, align = 'center', sideOffset = 4, size, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(popoverVariants({ size }), className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// Popover Header
const PopoverHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between space-y-0 pb-3',
      className
    )}
    {...props}
  />
));
PopoverHeader.displayName = 'PopoverHeader';

// Popover Title
const PopoverTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn('text-sm leading-none font-medium', className)}
    {...props}
  />
));
PopoverTitle.displayName = 'PopoverTitle';

// Popover Description
const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
PopoverDescription.displayName = 'PopoverDescription';

// Popover Body
const PopoverBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props} />
));
PopoverBody.displayName = 'PopoverBody';

// Popover Footer
const PopoverFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex justify-end space-x-2 pt-3', className)}
    {...props}
  />
));
PopoverFooter.displayName = 'PopoverFooter';

// Popover Separator
const PopoverSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('bg-border -mx-4 my-2 h-px', className)}
    {...props}
  />
));
PopoverSeparator.displayName = 'PopoverSeparator';

// 간단한 Popover Props
export interface SimplePopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  size?: VariantProps<typeof popoverVariants>['size'];
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

// 간단한 Popover 컴포넌트 (편의용)
const SimplePopover = React.forwardRef<HTMLButtonElement, SimplePopoverProps>(
  (
    {
      trigger,
      children,
      title,
      description,
      footer,
      side = 'bottom',
      align = 'center',
      size = 'default',
      className,
      open,
      onOpenChange,
      modal = false,
      ...props
    },
    ref
  ) => (
    <Popover open={open} onOpenChange={onOpenChange} modal={modal}>
      <PopoverTrigger ref={ref} asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        size={size}
        className={className}
      >
        {(title || description) && (
          <PopoverHeader>
            <div>
              {title && <PopoverTitle>{title}</PopoverTitle>}
              {description && (
                <PopoverDescription>{description}</PopoverDescription>
              )}
            </div>
          </PopoverHeader>
        )}
        <PopoverBody>{children}</PopoverBody>
        {footer && <PopoverFooter>{footer}</PopoverFooter>}
      </PopoverContent>
    </Popover>
  )
);
SimplePopover.displayName = 'SimplePopover';

// 확인 Popover (삭제 확인 등)
export interface ConfirmPopoverProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  loading?: boolean;
  disabled?: boolean;
}

const ConfirmPopover = React.forwardRef<HTMLButtonElement, ConfirmPopoverProps>(
  (
    {
      trigger,
      title,
      description,
      confirmText = '확인',
      cancelText = '취소',
      onConfirm,
      onCancel,
      variant = 'default',
      loading = false,
      disabled = false,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleConfirm = () => {
      onConfirm();
      setOpen(false);
    };

    const handleCancel = () => {
      onCancel?.();
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger ref={ref} asChild disabled={disabled}>
          {trigger}
        </PopoverTrigger>
        <PopoverContent size='sm'>
          <PopoverHeader>
            <PopoverTitle>{title}</PopoverTitle>
            {description && (
              <PopoverDescription>{description}</PopoverDescription>
            )}
          </PopoverHeader>
          <PopoverFooter>
            <button
              type='button'
              onClick={handleCancel}
              disabled={loading}
              className='border-input bg-background ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-8 items-center justify-center rounded-md border px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
            >
              {cancelText}
            </button>
            <button
              type='button'
              onClick={handleConfirm}
              disabled={loading}
              className={cn(
                'focus-visible:ring-ring inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                variant === 'destructive'
                  ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {loading ? '처리 중...' : confirmText}
            </button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );
  }
);
ConfirmPopover.displayName = 'ConfirmPopover';

// 메뉴 Popover
export interface MenuPopoverProps {
  trigger: React.ReactNode;
  items: Array<{
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    divider?: boolean;
    danger?: boolean;
  }>;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

const MenuPopover = React.forwardRef<HTMLButtonElement, MenuPopoverProps>(
  ({ trigger, items, side = 'bottom', align = 'start' }, ref) => {
    const [open, setOpen] = React.useState(false);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger ref={ref} asChild>
          {trigger}
        </PopoverTrigger>
        <PopoverContent
          side={side}
          align={align}
          size='auto'
          className='min-w-[200px] p-1'
        >
          {items.map((item, index) => (
            <React.Fragment key={item.key}>
              {item.divider && index > 0 && <PopoverSeparator />}
              <button
                type='button'
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                disabled={item.disabled}
                className={cn(
                  'hover:bg-accent focus:bg-accent flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50',
                  item.danger &&
                    'text-destructive hover:bg-destructive/10 focus:bg-destructive/10'
                )}
              >
                {item.icon && (
                  <span className='flex-shrink-0'>{item.icon}</span>
                )}
                <span className='flex-1 text-left'>{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </PopoverContent>
      </Popover>
    );
  }
);
MenuPopover.displayName = 'MenuPopover';

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverBody,
  PopoverFooter,
  PopoverSeparator,
  SimplePopover,
  ConfirmPopover,
  MenuPopover,
};
