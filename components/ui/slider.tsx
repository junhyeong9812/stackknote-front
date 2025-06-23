/**
 * Slider 컴포넌트
 * Radix UI Slider 기반
 */

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Slider 변형 스타일
const sliderVariants = cva(
  'relative flex w-full touch-none select-none items-center',
  {
    variants: {
      size: {
        sm: 'h-4',
        default: 'h-6',
        lg: 'h-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Slider Track 변형 스타일
const sliderTrackVariants = cva(
  'relative h-2 w-full grow overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      size: {
        sm: 'h-1',
        default: 'h-2',
        lg: 'h-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Slider Range 변형 스타일
const sliderRangeVariants = cva('absolute h-full bg-primary', {
  variants: {
    variant: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      success: 'bg-green-600',
      warning: 'bg-yellow-600',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Slider Thumb 변형 스타일
const sliderThumbVariants = cva(
  'block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      variant: {
        default: 'border-primary',
        destructive: 'border-destructive',
        success: 'border-green-600',
        warning: 'border-yellow-600',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

// 기본 Slider 컴포넌트
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> &
    VariantProps<typeof sliderVariants> &
    VariantProps<typeof sliderRangeVariants> &
    VariantProps<typeof sliderThumbVariants>
>(({ className, variant, size, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(sliderVariants({ size }), className)}
    {...props}
  >
    <SliderPrimitive.Track className={sliderTrackVariants({ size })}>
      <SliderPrimitive.Range className={sliderRangeVariants({ variant })} />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={sliderThumbVariants({ size, variant })} />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

// Slider with Label
export interface SliderWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof Slider> {
  label?: string;
  description?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  unit?: string;
}

const SliderWithLabel = React.forwardRef<
  React.ElementRef<typeof Slider>,
  SliderWithLabelProps
>(
  (
    {
      label,
      description,
      showValue = true,
      valueFormatter,
      unit,
      value = [0],
      className,
      ...props
    },
    ref
  ) => {
    const formatValue = (val: number) => {
      if (valueFormatter) return valueFormatter(val);
      return unit ? `${val}${unit}` : val.toString();
    };

    return (
      <div className={cn('space-y-3', className)}>
        {(label || showValue) && (
          <div className='flex items-center justify-between'>
            {label && (
              <label className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                {label}
              </label>
            )}
            {showValue && (
              <span className='text-muted-foreground text-sm'>
                {formatValue(value[0] || 0)}
              </span>
            )}
          </div>
        )}

        <Slider ref={ref} value={value} {...props} />

        {description && (
          <p className='text-muted-foreground text-xs'>{description}</p>
        )}
      </div>
    );
  }
);
SliderWithLabel.displayName = 'SliderWithLabel';

// Range Slider (두 개의 thumb)
export interface RangeSliderProps
  extends Omit<SliderWithLabelProps, 'value' | 'defaultValue'> {
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  separator?: string;
}

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof Slider>,
  RangeSliderProps
>(
  (
    {
      label,
      description,
      showValue = true,
      valueFormatter,
      unit,
      value = [0, 100],
      separator = ' - ',
      className,
      ...props
    },
    ref
  ) => {
    const formatValue = (val: number) => {
      if (valueFormatter) return valueFormatter(val);
      return unit ? `${val}${unit}` : val.toString();
    };

    return (
      <div className={cn('space-y-3', className)}>
        {(label || showValue) && (
          <div className='flex items-center justify-between'>
            {label && (
              <label className='text-sm leading-none font-medium'>
                {label}
              </label>
            )}
            {showValue && (
              <span className='text-muted-foreground text-sm'>
                {formatValue(value[0])}
                {separator}
                {formatValue(value[1])}
              </span>
            )}
          </div>
        )}

        <SliderPrimitive.Root
          ref={ref}
          value={value}
          className={cn(sliderVariants({}), className)}
          {...props}
        >
          <SliderPrimitive.Track className={sliderTrackVariants({})}>
            <SliderPrimitive.Range className={sliderRangeVariants({})} />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className={sliderThumbVariants({})} />
          <SliderPrimitive.Thumb className={sliderThumbVariants({})} />
        </SliderPrimitive.Root>

        {description && (
          <p className='text-muted-foreground text-xs'>{description}</p>
        )}
      </div>
    );
  }
);
RangeSlider.displayName = 'RangeSlider';

// Stepped Slider (단계별 슬라이더)
export interface SteppedSliderProps extends SliderWithLabelProps {
  steps?: Array<{
    value: number;
    label?: string;
  }>;
  showSteps?: boolean;
}

const SteppedSlider = React.forwardRef<
  React.ElementRef<typeof Slider>,
  SteppedSliderProps
>(
  (
    { steps = [], showSteps = true, min = 0, max = 100, className, ...props },
    ref
  ) => {
    const stepValues = steps.length > 0 ? steps.map(s => s.value) : undefined;

    return (
      <div className={cn('space-y-3', className)}>
        <SliderWithLabel
          ref={ref}
          min={min}
          max={max}
          step={stepValues ? undefined : 1}
          {...props}
        />

        {showSteps && steps.length > 0 && (
          <div className='relative'>
            <div className='flex justify-between'>
              {steps.map((step, index) => (
                <div
                  key={index}
                  className='flex flex-col items-center'
                  style={{
                    left: `${((step.value - min) / (max - min)) * 100}%`,
                  }}
                >
                  <div className='bg-border h-2 w-0.5' />
                  {step.label && (
                    <span className='text-muted-foreground mt-1 text-xs'>
                      {step.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
SteppedSlider.displayName = 'SteppedSlider';

// Volume Slider (볼륨 조절용)
export interface VolumeSliderProps extends Omit<SliderWithLabelProps, 'unit'> {
  muted?: boolean;
  onMutedChange?: (muted: boolean) => void;
}

const VolumeSlider = React.forwardRef<
  React.ElementRef<typeof Slider>,
  VolumeSliderProps
>(
  (
    { value = [50], muted = false, onMutedChange, className, ...props },
    ref
  ) => {
    const currentValue = value[0] || 0;

    const getVolumeIcon = () => {
      if (muted || currentValue === 0) {
        return (
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
              d='M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2'
            />
          </svg>
        );
      } else if (currentValue < 50) {
        return (
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
              d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
            />
          </svg>
        );
      } else {
        return (
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
              d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M18.364 5.636a9 9 0 010 12.728'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
            />
          </svg>
        );
      }
    };

    return (
      <div className={cn('flex items-center gap-3', className)}>
        <button
          type='button'
          onClick={() => onMutedChange?.(!muted)}
          className='text-muted-foreground hover:text-foreground transition-colors'
        >
          {getVolumeIcon()}
        </button>

        <div className='flex-1'>
          <SliderWithLabel
            ref={ref}
            value={value}
            min={0}
            max={100}
            unit='%'
            showValue={false}
            variant={muted ? 'destructive' : 'default'}
            {...props}
          />
        </div>

        <span className='text-muted-foreground w-8 text-right text-xs'>
          {muted ? '0%' : `${currentValue}%`}
        </span>
      </div>
    );
  }
);
VolumeSlider.displayName = 'VolumeSlider';

// Progress Slider (진행률 표시용)
export interface ProgressSliderProps
  extends Omit<SliderWithLabelProps, 'value' | 'onValueChange'> {
  value: number;
  buffer?: number;
  showBuffer?: boolean;
}

const ProgressSlider = React.forwardRef<
  React.ElementRef<typeof Slider>,
  ProgressSliderProps
>(
  (
    {
      value,
      buffer,
      showBuffer = false,
      min = 0,
      max = 100,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('relative', className)}>
        <SliderWithLabel
          ref={ref}
          value={[value]}
          min={min}
          max={max}
          disabled
          className='pointer-events-none'
          {...props}
        />

        {/* Buffer 표시 */}
        {showBuffer && buffer !== undefined && (
          <div
            className='bg-muted-foreground/30 absolute top-1/2 left-0 h-2 -translate-y-1/2 rounded-full'
            style={{
              width: `${((buffer - min) / (max - min)) * 100}%`,
            }}
          />
        )}
      </div>
    );
  }
);
ProgressSlider.displayName = 'ProgressSlider';

// Color Slider (색상 선택용)
export interface ColorSliderProps
  extends Omit<SliderWithLabelProps, 'variant'> {
  colorType?: 'hue' | 'saturation' | 'lightness' | 'alpha';
  baseColor?: string;
}

const ColorSlider = React.forwardRef<
  React.ElementRef<typeof Slider>,
  ColorSliderProps
>(
  (
    {
      colorType = 'hue',
      baseColor = '#ff0000',
      value = [0],
      className,
      ...props
    },
    ref
  ) => {
    const getGradient = () => {
      switch (colorType) {
        case 'hue':
          return 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)';
        case 'saturation':
          return `linear-gradient(to right, hsl(${value[0]}, 0%, 50%), hsl(${value[0]}, 100%, 50%))`;
        case 'lightness':
          return `linear-gradient(to right, hsl(${value[0]}, 100%, 0%), hsl(${value[0]}, 100%, 50%), hsl(${value[0]}, 100%, 100%))`;
        case 'alpha':
          return `linear-gradient(to right, transparent, ${baseColor})`;
        default:
          return '';
      }
    };

    return (
      <div className={cn('relative', className)}>
        <SliderWithLabel
          ref={ref}
          value={value}
          min={0}
          max={colorType === 'hue' ? 360 : 100}
          {...props}
        />

        {/* 색상 그라디언트 오버레이 */}
        <div
          className='pointer-events-none absolute inset-0 rounded-full'
          style={{
            background: getGradient(),
            height: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      </div>
    );
  }
);
ColorSlider.displayName = 'ColorSlider';

export {
  Slider,
  SliderWithLabel,
  RangeSlider,
  SteppedSlider,
  VolumeSlider,
  ProgressSlider,
  ColorSlider,
};
