/**
 * Tabs 컴포넌트
 * Radix UI Tabs 기반
 */

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Tabs List 변형 스타일
const tabsListVariants = cva(
  'inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'border-b bg-transparent p-0 h-auto',
        pill: 'bg-background border rounded-lg p-1',
        ghost: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Tabs Trigger 변형 스타일
const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        line: 'rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent hover:bg-muted/50',
        pill: 'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50',
        ghost:
          'data-[state=active]:bg-muted data-[state=active]:text-foreground hover:bg-muted/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// 기본 Tabs 컴포넌트들
const Tabs = TabsPrimitive.Root;

// Tabs List
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

// Tabs Trigger
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof tabsTriggerVariants> & {
      badge?: React.ReactNode;
      icon?: React.ReactNode;
    }
>(({ className, variant, badge, icon, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  >
    {icon && <span className='mr-2 flex-shrink-0'>{icon}</span>}
    <span className='flex-1'>{children}</span>
    {badge && <span className='ml-2 flex-shrink-0'>{badge}</span>}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Tabs Content
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

// Enhanced Tab Interface
export interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

// Simple Tabs Props
export interface SimpleTabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: VariantProps<typeof tabsListVariants>['variant'];
  className?: string;
  listClassName?: string;
  contentClassName?: string;
  orientation?: 'horizontal' | 'vertical';
}

// Simple Tabs 컴포넌트 (편의용)
const SimpleTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  SimpleTabsProps
>(
  (
    {
      items,
      defaultValue,
      value,
      onValueChange,
      variant = 'default',
      className,
      listClassName,
      contentClassName,
      orientation = 'horizontal',
    },
    ref
  ) => {
    const firstItem = items[0];
    const initialValue = defaultValue || firstItem?.value;

    return (
      <Tabs
        ref={ref}
        value={value}
        defaultValue={initialValue}
        onValueChange={onValueChange}
        orientation={orientation}
        className={className}
      >
        <TabsList variant={variant} className={listClassName}>
          {items.map(item => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              variant={variant}
              icon={item.icon}
              badge={item.badge}
              disabled={item.disabled}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map(item => (
          <TabsContent
            key={item.value}
            value={item.value}
            className={contentClassName}
          >
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
    );
  }
);
SimpleTabs.displayName = 'SimpleTabs';

// Vertical Tabs
export interface VerticalTabsProps
  extends Omit<SimpleTabsProps, 'orientation'> {
  tabsWidth?: string;
}

const VerticalTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  VerticalTabsProps
>(
  (
    {
      items,
      defaultValue,
      value,
      onValueChange,
      variant = 'ghost',
      className,
      listClassName,
      contentClassName,
      tabsWidth = 'w-48',
    },
    ref
  ) => {
    const firstItem = items[0];
    const initialValue = defaultValue || firstItem?.value;

    return (
      <Tabs
        ref={ref}
        value={value}
        defaultValue={initialValue}
        onValueChange={onValueChange}
        orientation='vertical'
        className={cn('flex gap-4', className)}
      >
        <TabsList
          variant={variant}
          className={cn(
            'flex h-auto w-full flex-col justify-start',
            tabsWidth,
            listClassName
          )}
        >
          {items.map(item => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              variant={variant}
              icon={item.icon}
              badge={item.badge}
              disabled={item.disabled}
              className='w-full justify-start'
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className='flex-1'>
          {items.map(item => (
            <TabsContent
              key={item.value}
              value={item.value}
              className={cn('mt-0', contentClassName)}
            >
              {item.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    );
  }
);
VerticalTabs.displayName = 'VerticalTabs';

// Scrollable Tabs (많은 탭이 있을 때)
export interface ScrollableTabsProps extends SimpleTabsProps {
  scrollButtons?: boolean;
}

const ScrollableTabs = React.forwardRef<
  React.ElementRef<typeof Tabs>,
  ScrollableTabsProps
>(
  (
    {
      items,
      defaultValue,
      value,
      onValueChange,
      variant = 'line',
      className,
      listClassName,
      contentClassName,
      scrollButtons = true,
    },
    ref
  ) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(false);

    const checkScrollButtons = React.useCallback(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
    }, []);

    React.useEffect(() => {
      checkScrollButtons();
      const scrollElement = scrollRef.current;
      if (scrollElement) {
        scrollElement.addEventListener('scroll', checkScrollButtons);
        return () =>
          scrollElement.removeEventListener('scroll', checkScrollButtons);
      }
      return undefined;
    }, [checkScrollButtons]);

    const scrollLeft = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      }
    };

    const scrollRight = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      }
    };

    const firstItem = items[0];
    const initialValue = defaultValue || firstItem?.value;

    return (
      <Tabs
        ref={ref}
        value={value}
        defaultValue={initialValue}
        onValueChange={onValueChange}
        className={className}
      >
        <div className='relative flex items-center'>
          {scrollButtons && canScrollLeft && (
            <button
              type='button'
              onClick={scrollLeft}
              className='from-background absolute left-0 z-10 flex h-10 w-8 items-center justify-center bg-gradient-to-r to-transparent'
            >
              <svg
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            className='scrollbar-hide overflow-x-auto'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <TabsList variant={variant} className={cn('w-max', listClassName)}>
              {items.map(item => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  variant={variant}
                  icon={item.icon}
                  badge={item.badge}
                  disabled={item.disabled}
                  className='flex-shrink-0'
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {scrollButtons && canScrollRight && (
            <button
              type='button'
              onClick={scrollRight}
              className='from-background absolute right-0 z-10 flex h-10 w-8 items-center justify-center bg-gradient-to-l to-transparent'
            >
              <svg
                className='h-4 w-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
          )}
        </div>

        {items.map(item => (
          <TabsContent
            key={item.value}
            value={item.value}
            className={contentClassName}
          >
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
    );
  }
);
ScrollableTabs.displayName = 'ScrollableTabs';

// Card Tabs (카드 형태의 탭)
export interface CardTabsProps extends SimpleTabsProps {
  cardClassName?: string;
}

const CardTabs = React.forwardRef<React.ElementRef<typeof Tabs>, CardTabsProps>(
  (
    {
      items,
      defaultValue,
      value,
      onValueChange,
      className,
      listClassName,
      contentClassName,
      cardClassName,
    },
    ref
  ) => {
    const firstItem = items[0];
    const initialValue = defaultValue || firstItem?.value;

    return (
      <div className={cn('bg-card rounded-lg border', cardClassName)}>
        <Tabs
          ref={ref}
          value={value}
          defaultValue={initialValue}
          onValueChange={onValueChange}
          className={className}
        >
          <TabsList
            variant='line'
            className={cn(
              'w-full rounded-none border-b bg-transparent px-6',
              listClassName
            )}
          >
            {items.map(item => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                variant='line'
                icon={item.icon}
                badge={item.badge}
                disabled={item.disabled}
              >
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {items.map(item => (
            <TabsContent
              key={item.value}
              value={item.value}
              className={cn('p-6 pt-4', contentClassName)}
            >
              {item.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }
);
CardTabs.displayName = 'CardTabs';

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SimpleTabs,
  VerticalTabs,
  ScrollableTabs,
  CardTabs,
};