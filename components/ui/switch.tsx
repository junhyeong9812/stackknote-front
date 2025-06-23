/**
 * Switch 컴포넌트
 * Radix UI Switch 기반 토글 스위치
 */

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Switch 변형 스타일
const switchVariants = cva(
  'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        destructive:
          'data-[state=checked]:bg-destructive data-[state=unchecked]:bg-input',
        success:
          'data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-input',
        warning:
          'data-[state=checked]:bg-yellow-600 data-[state=unchecked]:bg-input',
      },
      size: {
        sm: 'h-5 w-9',
        default: 'h-6 w-11',
        lg: 'h-7 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Switch Thumb 변형 스타일
const switchThumbVariants = cva(
  'pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
        default:
          'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
        lg: 'h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// 기본 Switch 컴포넌트
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> &
    VariantProps<typeof switchVariants> &
    VariantProps<typeof switchThumbVariants>
>(({ className, variant, size, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ variant, size }), className)}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className={cn(switchThumbVariants({ size }))} />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

// Switch with Label
export interface SwitchWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof Switch> {
  label?: string;
  description?: string;
  labelPosition?: 'left' | 'right';
  required?: boolean;
}

const SwitchWithLabel = React.forwardRef<
  React.ElementRef<typeof Switch>,
  SwitchWithLabelProps
>(
  (
    {
      label,
      description,
      labelPosition = 'right',
      required = false,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const switchId = id || React.useId();

    const switchElement = <Switch ref={ref} id={switchId} {...props} />;

    const labelElement = (label || description) && (
      <div className='grid gap-1.5 leading-none'>
        {label && (
          <label
            htmlFor={switchId}
            className='cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {label}
            {required && <span className='text-destructive ml-1'>*</span>}
          </label>
        )}
        {description && (
          <p className='text-muted-foreground text-xs'>{description}</p>
        )}
      </div>
    );

    if (!label && !description) {
      return switchElement;
    }

    return (
      <div className={cn('flex items-center space-x-2', className)}>
        {labelPosition === 'left' && labelElement}
        {switchElement}
        {labelPosition === 'right' && labelElement}
      </div>
    );
  }
);
SwitchWithLabel.displayName = 'SwitchWithLabel';

// Animated Switch (로딩 상태 포함)
export interface AnimatedSwitchProps extends SwitchWithLabelProps {
  loading?: boolean;
  icons?: {
    checked?: React.ReactNode;
    unchecked?: React.ReactNode;
  };
}

const AnimatedSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  AnimatedSwitchProps
>(
  (
    { loading = false, icons, checked, onCheckedChange, disabled, ...props },
    ref
  ) => {
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    const handleCheckedChange = React.useCallback(
      (newChecked: boolean) => {
        if (loading || disabled) return;

        setIsTransitioning(true);
        onCheckedChange?.(newChecked);

        // 애니메이션 완료 후 전환 상태 해제
        setTimeout(() => setIsTransitioning(false), 200);
      },
      [loading, disabled, onCheckedChange]
    );

    return (
      <div className='relative'>
        <SwitchWithLabel
          ref={ref}
          checked={checked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled || loading}
          {...props}
        />

        {/* 로딩 스피너 */}
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <svg
              className='text-muted-foreground h-3 w-3 animate-spin'
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

        {/* 아이콘 표시 */}
        {icons && !loading && (
          <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
            {checked ? icons.checked : icons.unchecked}
          </div>
        )}
      </div>
    );
  }
);
AnimatedSwitch.displayName = 'AnimatedSwitch';

// Settings Switch (설정 페이지용)
export interface SettingSwitchProps extends SwitchWithLabelProps {
  category?: string;
  warning?: string;
  premium?: boolean;
}

const SettingSwitch = React.forwardRef<
  React.ElementRef<typeof Switch>,
  SettingSwitchProps
>(
  (
    {
      label,
      description,
      category,
      warning,
      premium = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => (
    <div className={cn('space-y-3', className)}>
      {category && (
        <div className='text-muted-foreground text-sm font-medium'>
          {category}
        </div>
      )}

      <div className='flex items-center justify-between'>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-2'>
            {label && (
              <label className='text-sm leading-none font-medium'>
                {label}
              </label>
            )}
            {premium && (
              <span className='inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 text-xs font-medium text-white'>
                PRO
              </span>
            )}
          </div>
          {description && (
            <p className='text-muted-foreground text-sm'>{description}</p>
          )}
          {warning && (
            <p className='text-sm text-yellow-600 dark:text-yellow-400'>
              ⚠️ {warning}
            </p>
          )}
        </div>

        <Switch ref={ref} disabled={disabled || premium} {...props} />
      </div>
    </div>
  )
);
SettingSwitch.displayName = 'SettingSwitch';

// Switch Group (여러 스위치를 그룹화)
export interface SwitchGroupProps {
  title?: string;
  description?: string;
  items: Array<SwitchWithLabelProps & { key: string }>;
  className?: string;
}

const SwitchGroup = React.forwardRef<HTMLDivElement, SwitchGroupProps>(
  ({ title, description, items, className }, ref) => (
    <div ref={ref} className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className='space-y-1'>
          {title && <h3 className='text-lg font-medium'>{title}</h3>}
          {description && (
            <p className='text-muted-foreground text-sm'>{description}</p>
          )}
        </div>
      )}

      <div className='space-y-3'>
        {items.map(({ key, ...switchProps }) => (
          <SwitchWithLabel key={key} {...switchProps} />
        ))}
      </div>
    </div>
  )
);
SwitchGroup.displayName = 'SwitchGroup';

export { Switch, SwitchWithLabel, AnimatedSwitch, SettingSwitch, SwitchGroup };
