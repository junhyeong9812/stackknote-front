/**
 * 알림 관련 타입 정의
 */

import { UserResponse } from './user';

// 알림 타입
export type NotificationType =
  | 'WORKSPACE_INVITATION' // 워크스페이스 초대
  | 'PAGE_COMMENT' // 페이지 댓글
  | 'COMMENT_REPLY' // 댓글 답글
  | 'MENTION' // 멘션
  | 'SYSTEM_ANNOUNCEMENT' // 시스템 공지
  | 'SECURITY_ALERT'; // 보안 알림

// 알림 우선순위
export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

// 알림 생성 요청
export interface NotificationCreateRequest {
  type: NotificationType;
  title: string;
  content: string;
  recipientId: number;
  senderId?: number; // 시스템 알림인 경우 null
  referenceType?: string; // 참조 타입 (page, comment 등)
  referenceId?: number; // 참조 ID
  actionUrl?: string; // 클릭 시 이동할 URL
  metadata?: string; // 추가 메타데이터 (JSON 문자열)
  priority?: NotificationPriority;
}

// 알림 수정 요청
export interface NotificationUpdateRequest {
  title?: string;
  content?: string;
  actionUrl?: string;
  metadata?: string;
}

// 알림 상세 응답
export interface NotificationResponse {
  id: number;
  type: string;
  typeDescription: string; // 타입 설명
  title: string;
  content: string;
  recipient: UserResponse;
  sender?: UserResponse; // 시스템 알림인 경우 null
  isRead: boolean;
  referenceType?: string;
  referenceId?: number;
  actionUrl?: string;
  metadata?: string;
  priority: string;
  priorityDescription: string;
  relativeTime: string; // "5분 전" 형태
  isSystemNotification: boolean;
  isUrgent: boolean; // 긴급 알림 여부
  readAt?: string; // 읽은 시간
  createdAt: string;
  updatedAt: string;
}

// 알림 통계 응답
export interface NotificationStatisticsResponse {
  totalNotifications: number;
  unreadNotifications: number;
  highPriorityNotifications: number;
  systemNotifications: number;
  notificationsByType: {
    type: NotificationType;
    count: number;
  }[];
  weeklyTrend: {
    date: string;
    count: number;
  }[];
}

// 알림 필터 옵션
export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  priority?: NotificationPriority;
  senderId?: number;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  referenceType?: string;
  sortBy?: 'createdAt' | 'priority' | 'isRead';
  sortDirection?: 'asc' | 'desc';
}

// 알림 설정
export interface NotificationSettings {
  // 워크스페이스 관련
  workspaceInvitations: boolean;
  workspaceUpdates: boolean;

  // 페이지 관련
  pageComments: boolean;
  pageShares: boolean;
  pageUpdates: boolean;

  // 댓글 관련
  commentReplies: boolean;
  commentLikes: boolean;
  commentMentions: boolean;

  // 시스템 관련
  systemAnnouncements: boolean;
  securityAlerts: boolean;

  // 알림 방식
  emailNotifications: boolean;
  pushNotifications: boolean;
  browserNotifications: boolean;

  // 알림 시간
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string; // "08:00"
  };

  // 요약 알림
  dailySummary: boolean;
  weeklySummary: boolean;
}

// 알림 배치 (여러 알림 일괄 처리)
export interface NotificationBatch {
  notificationIds: number[];
  action: 'read' | 'unread' | 'delete';
}

// 실시간 알림 이벤트
export interface NotificationEvent {
  type: 'notification_created' | 'notification_read' | 'notification_deleted';
  notification: NotificationResponse;
  timestamp: string;
}

// 알림 템플릿 (시스템에서 사용)
export interface NotificationTemplate {
  type: NotificationType;
  titleTemplate: string; // "{{user}}님이 댓글을 작성했습니다"
  contentTemplate: string;
  actionUrlTemplate?: string;
  defaultPriority: NotificationPriority;
  variables: string[]; // 템플릿 변수 목록
}
