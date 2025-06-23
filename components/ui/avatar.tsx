/**
 * Avatar 컴포넌트
 * 사용자 프로필 이미지를 표시하는 컴포넌트
 */

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Avatar 변형 스타일 정의
const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
        '3xl': 'h-24 w-24',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// Avatar 기본 컴포넌트
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

// AvatarImage 컴포넌트
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// AvatarFallback 컴포넌트
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// 확장된 Avatar 컴포넌트들

// UserAvatar - 사용자 정보를 포함한 아바타
export interface UserAvatarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Avatar>, 'children'>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  name?: string;
  username?: string;
  fallbackText?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
  loading?: boolean;
}

const UserAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  UserAvatarProps
>(
  (
    {
      src,
      alt,
      name,
      username,
      fallbackText,
      status,
      showStatus = false,
      loading = false,
      size = 'default',
      className,
      ...props
    },
    ref
  ) => {
    // 폴백 텍스트 생성
    const generateFallback = () => {
      if (fallbackText) return fallbackText;
      if (name) {
        return name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      }
      if (username) {
        return username.slice(0, 2).toUpperCase();
      }
      return '?';
    };

    // 상태 색상 매핑
    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
    };

    // 상태 표시 크기 매핑
    const statusSizes = {
      xs: 'h-1.5 w-1.5',
      sm: 'h-2 w-2',
      default: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-3.5 w-3.5',
      '2xl': 'h-4 w-4',
      '3xl': 'h-5 w-5',
    };

    return (
      <div className="relative inline-block">
        <Avatar ref={ref} size={size} className={className} {...props}>
          {loading ? (
            <AvatarFallback>
              <div className="h-full w-full bg-muted animate-pulse rounded-full" />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage src={src} alt={alt || name || username} />
              <AvatarFallback>{generateFallback()}</AvatarFallback>
            </>
          )}
        </Avatar>

        {/* 상태 표시 */}
        {showStatus && status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-background',
              statusColors[status],
              statusSizes[size || 'default']
            )}
          />
        )}
      </div>
    );
  }
);
UserAvatar.displayName = 'UserAvatar';

// AvatarGroup - 여러 아바타를 그룹으로 표시
export interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    name?: string;
    username?: string;
    alt?: string;
  }>;
  max?: number;
  size?: VariantProps<typeof avatarVariants>['size'];
  className?: string;
  spacing?: 'tight' | 'normal' | 'loose';
  showCount?: boolean;
  onClick?: (index: number) => void;
  onMoreClick?: () => void;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      avatars,
      max = 5,
      size = 'default',
      className,
      spacing = 'normal',
      showCount = true,
      onClick,
      onMoreClick,
    },
    ref
  ) => {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = Math.max(0, avatars.length - max);

    const spacingClasses = {
      tight: '-space-x-1',
      normal: '-space-x-2',
      loose: '-space-x-3',
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center', spacingClasses[spacing], className)}
      >
        {visibleAvatars.map((avatar, index) => (
          <UserAvatar
            key={index}
            src={avatar.src}
            name={avatar.name}
            username={avatar.username}
            alt={avatar.alt}
            size={size}
            className={cn(
              'ring-2 ring-background transition-transform hover:scale-110',
              onClick && 'cursor-pointer'
            )}
            onClick={() => onClick?.(index)}
          />
        ))}

        {/* 남은 개수 표시 */}
        {remainingCount > 0 && showCount && (
          <Avatar
            size={size}
            className={cn(
              'ring-2 ring-background transition-transform hover:scale-110',
              onMoreClick && 'cursor-pointer'
            )}
            onClick={onMoreClick}
          >
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
              +{remainingCount}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

// ProfileAvatar - 프로필 페이지용 아바타 (편집 기능 포함)
export interface ProfileAvatarProps extends UserAvatarProps {
  editable?: boolean;
  onImageChange?: (file: File) => void;
  uploadLoading?: boolean;
}

const ProfileAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  ProfileAvatarProps
>(
  (
    {
      editable = false,
      onImageChange,
      uploadLoading = false,
      size = 'xl',
      className,
      ...props
    },
    ref
  ) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && onImageChange) {
        onImageChange(file);
      }
    };

    const handleClick = () => {
      if (editable && !uploadLoading) {
        fileInputRef.current?.click();
      }
    };

    return (
      <div className="relative inline-block">
        <UserAvatar
          ref={ref}
          size={size}
          className={cn(
            editable && !uploadLoading && 'cursor-pointer hover:opacity-80',
            className
          )}
          loading={uploadLoading}
          onClick={handleClick}
          {...props}
        />

        {/* 편집 가능할 때 오버레이 표시 */}
        {editable && !uploadLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}

        {/* 파일 입력 */}
        {editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        )}
      </div>
    );
  }
);
ProfileAvatar.displayName = 'ProfileAvatar';

// InitialsAvatar - 이름 이니셜만 표시하는 아바타
export interface InitialsAvatarProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Avatar>, 'children'>,
    VariantProps<typeof avatarVariants> {
  name: string;
  backgroundColor?: string;
  textColor?: string;
}

const InitialsAvatar = React.forwardRef<
  React.ElementRef<typeof Avatar>,
  InitialsAvatarProps
>(
  (
    { name, backgroundColor, textColor, size = 'default', className, ...props },
    ref
  ) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    // 이름 기반 색상 생성 (backgroundColor가 없을 때)
    const generateColor = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash % 360);
      return `hsl(${hue}, 65%, 50%)`;
    };

    const bgColor = backgroundColor || generateColor(name);

    return (
      <Avatar ref={ref} size={size} className={className} {...props}>
        <AvatarFallback
          style={{
            backgroundColor: bgColor,
            color: textColor || 'white',
          }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
    );
  }
);
InitialsAvatar.displayName = 'InitialsAvatar';

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  UserAvatar,
  AvatarGroup,
  ProfileAvatar,
  InitialsAvatar,
};