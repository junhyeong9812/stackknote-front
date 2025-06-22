/**
 * 댓글 관련 타입 정의
 */

import { UserResponse } from './user';

// 댓글 생성 요청
export interface CommentCreateRequest {
  pageId: number;
  content: string;
  parentId?: number; // 대댓글인 경우 부모 댓글 ID
  mentions?: string; // 멘션된 사용자 정보 (JSON 문자열)
}

// 댓글 수정 요청
export interface CommentUpdateRequest {
  content: string;
  mentions?: string;
}

// 댓글 상세 응답
export interface CommentResponse {
  id: number;
  content: string;
  pageId: number;
  pageTitle: string;
  author: UserResponse;
  parentId?: number;
  replies: CommentResponse[];
  isEdited: boolean;
  likesCount: number;
  mentions?: string;
  depth: number;
  replyCount: number;
  relativeTime: string; // "5분 전" 형태
  canEdit: boolean;
  canDelete: boolean;
  isLiked?: boolean; // 현재 사용자의 좋아요 여부
  createdAt: string;
  updatedAt: string;
}

// 댓글 요약 응답 (목록용)
export interface CommentSummaryResponse {
  id: number;
  content: string;
  contentPreview: string; // 50자 미리보기
  pageId: number;
  pageTitle: string;
  authorName: string;
  authorProfileImage?: string;
  isEdited: boolean;
  likesCount: number;
  replyCount: number;
  relativeTime: string;
  createdAt: string;
}

// 댓글 트리 구조 (계층형 댓글용)
export interface CommentTreeNode {
  comment: CommentResponse;
  children: CommentTreeNode[];
  isExpanded: boolean;
  isLoading: boolean;
}

// 댓글 멘션 정보
export interface CommentMention {
  userId: number;
  username: string;
  displayName: string;
  startIndex: number;
  endIndex: number;
}

// 댓글 통계
export interface CommentStatistics {
  totalComments: number;
  commentsThisWeek: number;
  averageCommentsPerPage: number;
  topCommenters: {
    user: UserResponse;
    commentCount: number;
  }[];
}

// 댓글 필터 옵션
export interface CommentFilters {
  authorId?: number;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  hasReplies?: boolean;
  minLikes?: number;
  sortBy?: 'createdAt' | 'likesCount' | 'replyCount';
  sortDirection?: 'asc' | 'desc';
}

// 댓글 알림 설정
export interface CommentNotificationSettings {
  notifyOnReply: boolean;
  notifyOnMention: boolean;
  notifyOnLike: boolean;
  emailNotifications: boolean;
}
