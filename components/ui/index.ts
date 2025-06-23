/**
 * UI 컴포넌트들 통합 Export
 *
 * 사용법:
 * import { Button, Input, Select, Dialog } from '@/components/ui';
 */

// Button 컴포넌트
export { Button, buttonVariants } from './button';

// Input 컴포넌트들
export {
  Input,
  PasswordInput,
  SearchInput,
  Textarea,
  Label,
  FormField,
} from './input';

// Select 컴포넌트들
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
} from './select';

// Dialog 컴포넌트들
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  ConfirmDialog,
} from './dialog';

// Card 컴포넌트들
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
} from './card';

// Badge 컴포넌트들
export {
  Badge,
  badgeVariants,
  StatusBadge,
  CountBadge,
  TagBadge,
  PriorityBadge,
  NewBadge,
} from './badge';

// Avatar 컴포넌트들
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  UserAvatar,
  AvatarGroup,
  ProfileAvatar,
  InitialsAvatar,
} from './avatar';

// Tooltip 컴포넌트들
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  SimpleTooltip,
  IconTooltip,
  KeyboardTooltip,
} from './tooltip';

// 타입들도 함께 export
export type { ButtonProps } from './button';

export type {
  InputProps,
  PasswordInputProps,
  SearchInputProps,
  TextareaProps,
  LabelProps,
  FormFieldProps,
} from './input';

export type {
  SelectOption,
  SelectGroup as SelectGroupType,
  SimpleSelectProps,
} from './select';

export type { ConfirmDialogProps } from './dialog';

export type {
  CardProps,
  ClickableCardProps,
  StatCardProps,
  ImageCardProps,
  LoadingCardProps,
  EmptyCardProps,
} from './card';

export type {
  BadgeProps,
  StatusBadgeProps,
  CountBadgeProps,
  TagBadgeProps,
  PriorityBadgeProps,
  NewBadgeProps,
} from './badge';

export type {
  UserAvatarProps,
  AvatarGroupProps,
  ProfileAvatarProps,
  InitialsAvatarProps,
} from './avatar';

export type {
  SimpleTooltipProps,
  IconTooltipProps,
  KeyboardTooltipProps,
} from './tooltip';