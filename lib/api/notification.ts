/**
 * 알림 관련 API 서비스
 */

import { api } from './client';
import { API_ENDPOINTS } from '@/lib/config/api-config';
import {
  NotificationCreateRequest,
  NotificationUpdateRequest,
  NotificationResponse,
  NotificationStatisticsResponse,
  NotificationType,
  DateRangeParams,
  PaginationParams,
  ApiResponse,
} from '@/types';

export class NotificationApiService {
  // === 알림 CRUD ===

  /**
   * 알림 생성
   */
  async createNotification(
    request: NotificationCreateRequest
  ): Promise<ApiResponse<NotificationResponse>> {
    return api.post<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.BASE,
      request
    );
  }

  /**
   * 알림 상세 조회
   */
  async getNotification(
    notificationId: number
  ): Promise<ApiResponse<NotificationResponse>> {
    return api.get<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.BY_ID(notificationId)
    );
  }

  /**
   * 알림 수정
   */
  async updateNotification(
    notificationId: number,
    request: NotificationUpdateRequest
  ): Promise<ApiResponse<NotificationResponse>> {
    return api.put<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.BY_ID(notificationId),
      request
    );
  }

  /**
   * 알림 삭제
   */
  async deleteNotification(notificationId: number): Promise<ApiResponse<void>> {
    return api.delete<void>(
      API_ENDPOINTS.NOTIFICATIONS.DELETE_ONE(notificationId)
    );
  }

  // === 알림 조회 ===

  /**
   * 내 알림 목록 조회
   */
  async getMyNotifications(
    params?: PaginationParams
  ): Promise<ApiResponse<NotificationResponse[]>> {
    return api.get<NotificationResponse[]>(API_ENDPOINTS.NOTIFICATIONS.MY, {
      params,
    });
  }

  /**
   * 읽지 않은 알림 조회
   */
  async getUnreadNotifications(): Promise<ApiResponse<NotificationResponse[]>> {
    return api.get<NotificationResponse[]>(API_ENDPOINTS.NOTIFICATIONS.UNREAD);
  }

  /**
   * 읽지 않은 알림 수 조회
   */
  async getUnreadNotificationCount(): Promise<ApiResponse<number>> {
    return api.get<number>(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  }

  /**
   * 높은 우선순위 알림 조회
   */
  async getHighPriorityNotifications(): Promise<
    ApiResponse<NotificationResponse[]>
  > {
    return api.get<NotificationResponse[]>(
      API_ENDPOINTS.NOTIFICATIONS.HIGH_PRIORITY
    );
  }

  /**
   * 타입별 알림 조회
   */
  async getNotificationsByType(
    type: NotificationType,
    params?: PaginationParams
  ): Promise<ApiResponse<NotificationResponse[]>> {
    return api.get<NotificationResponse[]>(
      API_ENDPOINTS.NOTIFICATIONS.BY_TYPE(type),
      { params }
    );
  }

  /**
   * 기간별 알림 조회
   */
  async getNotificationsByDateRange(
    dateRange: DateRangeParams
  ): Promise<ApiResponse<NotificationResponse[]>> {
    return api.get<NotificationResponse[]>(
      API_ENDPOINTS.NOTIFICATIONS.DATE_RANGE,
      { params: dateRange }
    );
  }

  /**
   * 시스템 알림 조회
   */
  async getSystemNotifications(
    params?: PaginationParams
  ): Promise<ApiResponse<NotificationResponse[]>> {
    return api.get<NotificationResponse[]>(API_ENDPOINTS.NOTIFICATIONS.SYSTEM, {
      params,
    });
  }

  /**
   * 참조별 알림 조회
   */
  async getNotificationsByReference(
    referenceType: string,
    referenceId: number
  ): Promise<ApiResponse<NotificationResponse[]>> {
    return api.get<NotificationResponse[]>(
      API_ENDPOINTS.NOTIFICATIONS.BY_REFERENCE,
      { params: { referenceType, referenceId } }
    );
  }

  /**
   * 발송자별 알림 조회
   */
  async getNotificationsBySender(
    senderId: number,
    params?: PaginationParams
  ): Promise<ApiResponse<NotificationResponse[]>> {
    return api.get<NotificationResponse[]>(
      API_ENDPOINTS.NOTIFICATIONS.BY_SENDER(senderId),
      { params }
    );
  }

  /**
   * 긴급 알림 조회
   */
  async getUrgentNotifications(): Promise<ApiResponse<NotificationResponse[]>> {
    return api.get<NotificationResponse[]>(API_ENDPOINTS.NOTIFICATIONS.URGENT);
  }

  /**
   * 최근 알림 조회
   */
  async getRecentNotifications(
    size: number = 10
  ): Promise<ApiResponse<NotificationResponse[]>> {
    return api.get<NotificationResponse[]>(API_ENDPOINTS.NOTIFICATIONS.RECENT, {
      params: { size },
    });
  }

  // === 알림 액션 ===

  /**
   * 알림 읽음 처리
   */
  async markAsRead(notificationId: number): Promise<ApiResponse<void>> {
    return api.post<void>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
    );
  }

  /**
   * 알림 읽지 않음 처리
   */
  async markAsUnread(notificationId: number): Promise<ApiResponse<void>> {
    return api.post<void>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_UNREAD(notificationId)
    );
  }

  /**
   * 모든 알림 읽음 처리
   */
  async markAllAsRead(): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
  }

  /**
   * 타입별 알림 읽음 처리
   */
  async markAsReadByType(type: NotificationType): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.NOTIFICATIONS.READ_BY_TYPE(type));
  }

  /**
   * 참조별 알림 읽음 처리
   */
  async markAsReadByReference(
    referenceType: string,
    referenceId: number
  ): Promise<ApiResponse<void>> {
    return api.post<void>(API_ENDPOINTS.NOTIFICATIONS.READ_BY_REFERENCE, {
      referenceType,
      referenceId,
    });
  }

  /**
   * 모든 알림 삭제
   */
  async deleteAllNotifications(): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.NOTIFICATIONS.DELETE_ALL);
  }

  /**
   * 타입별 알림 삭제
   */
  async deleteNotificationsByType(
    type: NotificationType
  ): Promise<ApiResponse<void>> {
    return api.delete<void>(API_ENDPOINTS.NOTIFICATIONS.DELETE_BY_TYPE(type));
  }

  // === 알림 통계 ===

  /**
   * 알림 통계 조회
   */
  async getNotificationStatistics(): Promise<
    ApiResponse<NotificationStatisticsResponse>
  > {
    return api.get<NotificationStatisticsResponse>(
      API_ENDPOINTS.NOTIFICATIONS.STATISTICS
    );
  }

  // === 특수 알림 생성 ===

  /**
   * 워크스페이스 초대 알림 생성
   */
  async createWorkspaceInvitationNotification(
    recipientId: number,
    workspaceName: string,
    workspaceId: number
  ): Promise<ApiResponse<NotificationResponse>> {
    return api.post<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.WORKSPACE_INVITATION,
      { recipientId, workspaceName, workspaceId }
    );
  }

  /**
   * 페이지 댓글 알림 생성
   */
  async createPageCommentNotification(
    recipientId: number,
    pageTitle: string,
    pageId: number,
    commentId: number
  ): Promise<ApiResponse<NotificationResponse>> {
    return api.post<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.PAGE_COMMENT,
      { recipientId, pageTitle, pageId, commentId }
    );
  }

  /**
   * 댓글 답글 알림 생성
   */
  async createCommentReplyNotification(
    recipientId: number,
    pageTitle: string,
    commentId: number
  ): Promise<ApiResponse<NotificationResponse>> {
    return api.post<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.COMMENT_REPLY,
      { recipientId, pageTitle, commentId }
    );
  }

  /**
   * 멘션 알림 생성
   */
  async createMentionNotification(
    recipientId: number,
    pageTitle: string,
    pageId: number,
    context: string
  ): Promise<ApiResponse<NotificationResponse>> {
    return api.post<NotificationResponse>(API_ENDPOINTS.NOTIFICATIONS.MENTION, {
      recipientId,
      pageTitle,
      pageId,
      context,
    });
  }

  /**
   * 시스템 공지 알림 생성
   */
  async createSystemAnnouncementNotification(
    recipientId: number,
    title: string,
    content: string
  ): Promise<ApiResponse<NotificationResponse>> {
    return api.post<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.SYSTEM_ANNOUNCEMENT,
      { recipientId, title, content }
    );
  }

  /**
   * 보안 알림 생성
   */
  async createSecurityAlertNotification(
    recipientId: number,
    message: string
  ): Promise<ApiResponse<NotificationResponse>> {
    return api.post<NotificationResponse>(
      API_ENDPOINTS.NOTIFICATIONS.SECURITY_ALERT,
      { recipientId, message }
    );
  }

  // === 알림 유틸리티 ===

  /**
   * 알림 우선순위에 따른 색상 반환
   */
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'URGENT':
        return 'red';
      case 'HIGH':
        return 'orange';
      case 'NORMAL':
        return 'blue';
      case 'LOW':
        return 'gray';
      default:
        return 'blue';
    }
  }

  /**
   * 알림 타입에 따른 아이콘 반환
   */
  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case 'WORKSPACE_INVITATION':
        return '👥';
      case 'PAGE_COMMENT':
        return '💬';
      case 'COMMENT_REPLY':
        return '↩️';
      case 'MENTION':
        return '@';
      case 'SYSTEM_ANNOUNCEMENT':
        return '📢';
      case 'SECURITY_ALERT':
        return '🔒';
      default:
        return '🔔';
    }
  }

  /**
   * 알림 배치 처리 (클라이언트에서 일괄 처리)
   */
  async batchProcessNotifications(
    notificationIds: number[],
    action: 'read' | 'unread' | 'delete'
  ): Promise<void> {
    const promises = notificationIds.map(id => {
      switch (action) {
        case 'read':
          return this.markAsRead(id);
        case 'unread':
          return this.markAsUnread(id);
        case 'delete':
          return this.deleteNotification(id);
        default:
          throw new Error(`Unknown action: ${action}`);
      }
    });

    await Promise.all(promises);
  }

  /**
   * 실시간 알림 연결 (WebSocket - 추후 구현)
   */
  connectRealTimeNotifications(): void {
    // TODO: WebSocket 연결 구현
    console.log('Real-time notifications connection - to be implemented');
  }

  /**
   * 실시간 알림 해제
   */
  disconnectRealTimeNotifications(): void {
    // TODO: WebSocket 연결 해제 구현
    console.log('Real-time notifications disconnection - to be implemented');
  }
}

// 싱글톤 인스턴스 생성
export const notificationApi = new NotificationApiService();
