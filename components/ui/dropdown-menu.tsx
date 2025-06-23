/**
 * Dropdown Menu 컴포넌트
 * Radix UI DropdownMenu 기반
 */

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

// 기본 Dropdown 컴포넌트들
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// Dropdown Menu Sub Trigger
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'focus:bg-accent data-[state=open]:bg-accent flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className='ml-auto h-4 w-4' />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

// Dropdown Menu Sub Content
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

// Dropdown Menu Content
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// Dropdown Menu Item
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    destructive?: boolean;
  }
>(({ className, inset, destructive, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      destructive &&
        'text-destructive focus:bg-destructive/10 focus:text-destructive',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

// Dropdown Menu Checkbox Item
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className='h-4 w-4' />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

// Dropdown Menu Radio Item
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className='h-2 w-2 fill-current' />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

// Dropdown Menu Label
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

// Dropdown Menu Separator
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('bg-muted -mx-1 my-1 h-px', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

// Dropdown Menu Shortcut
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

// Enhanced Dropdown Menu Item with Icon
export interface DropdownMenuItemWithIconProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuItem> {
  icon?: React.ReactNode;
  shortcut?: string;
  description?: string;
}

const DropdownMenuItemWithIcon = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  DropdownMenuItemWithIconProps
>(({ className, icon, shortcut, description, children, ...props }, ref) => (
  <DropdownMenuItem ref={ref} className={cn('gap-2', className)} {...props}>
    {icon && <span className='flex-shrink-0'>{icon}</span>}
    <div className='flex flex-1 flex-col'>
      <span>{children}</span>
      {description && (
        <span className='text-muted-foreground text-xs'>{description}</span>
      )}
    </div>
    {shortcut && <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>}
  </DropdownMenuItem>
));
DropdownMenuItemWithIcon.displayName = 'DropdownMenuItemWithIcon';

// Simple Dropdown Menu
export interface SimpleDropdownMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  shortcut?: string;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  type?: 'item' | 'separator' | 'label';
}

export interface SimpleDropdownMenuProps {
  trigger: React.ReactNode;
  items: SimpleDropdownMenuItem[];
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

const SimpleDropdownMenu = React.forwardRef<
  HTMLButtonElement,
  SimpleDropdownMenuProps
>(({ trigger, items, side = 'bottom', align = 'start', className }, ref) => (
  <DropdownMenu>
    <DropdownMenuTrigger ref={ref} asChild>
      {trigger}
    </DropdownMenuTrigger>
    <DropdownMenuContent side={side} align={align} className={className}>
      {items.map(item => {
        if (item.type === 'separator') {
          return <DropdownMenuSeparator key={item.key} />;
        }

        if (item.type === 'label') {
          return (
            <DropdownMenuLabel key={item.key}>{item.label}</DropdownMenuLabel>
          );
        }

        return (
          <DropdownMenuItemWithIcon
            key={item.key}
            icon={item.icon}
            shortcut={item.shortcut}
            description={item.description}
            onClick={item.onClick}
            disabled={item.disabled}
            destructive={item.destructive}
          >
            {item.label}
          </DropdownMenuItemWithIcon>
        );
      })}
    </DropdownMenuContent>
  </DropdownMenu>
));
SimpleDropdownMenu.displayName = 'SimpleDropdownMenu';

// User Menu (프로필 메뉴용)
export interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  menuItems: SimpleDropdownMenuItem[];
  trigger?: React.ReactNode;
}

const UserMenu = React.forwardRef<HTMLButtonElement, UserMenuProps>(
  ({ user, menuItems, trigger }, ref) => {
    const defaultTrigger = (
      <button
        type='button'
        className='hover:bg-accent flex items-center gap-2 rounded-lg p-2 transition-colors'
      >
        <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className='h-8 w-8 rounded-full'
            />
          ) : (
            <span className='text-sm font-medium'>
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className='flex flex-col items-start'>
          <span className='text-sm font-medium'>{user.name}</span>
          <span className='text-muted-foreground text-xs'>{user.email}</span>
        </div>
      </button>
    );

    return (
      <DropdownMenu>
        <DropdownMenuTrigger ref={ref} asChild>
          {trigger || defaultTrigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <DropdownMenuLabel>내 계정</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems.map(item => {
            if (item.type === 'separator') {
              return <DropdownMenuSeparator key={item.key} />;
            }

            if (item.type === 'label') {
              return (
                <DropdownMenuLabel key={item.key}>
                  {item.label}
                </DropdownMenuLabel>
              );
            }

            return (
              <DropdownMenuItemWithIcon
                key={item.key}
                icon={item.icon}
                shortcut={item.shortcut}
                onClick={item.onClick}
                disabled={item.disabled}
                destructive={item.destructive}
              >
                {item.label}
              </DropdownMenuItemWithIcon>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
UserMenu.displayName = 'UserMenu';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuItemWithIcon,
  SimpleDropdownMenu,
  UserMenu,
};
