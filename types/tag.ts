/**
 * 태그 관련 타입 정의
 */

// 태그 생성 요청
export interface TagCreateRequest {
  workspaceId: number;
  name: string;
  color?: string; // HEX 색상 코드 (#RRGGBB)
  description?: string;
}

// 태그 수정 요청
export interface TagUpdateRequest {
  name?: string;
  color?: string;
  description?: string;
}

// 페이지에 태그 추가 요청
export interface TagAddToPageRequest {
  pageId: number;
  tagNames: string[]; // 태그 이름 배열 (없으면 자동 생성)
}

// 태그 상세 응답
export interface TagResponse {
  id: number;
  name: string;
  color?: string;
  description?: string;
  workspaceId: number;
  workspaceName: string;
  usageCount: number; // 사용된 페이지 수
  isSystemTag: boolean; // 시스템 생성 태그 여부
  canDelete: boolean; // 삭제 가능 여부
  createdAt: string;
  updatedAt: string;
}

// 태그 요약 응답 (목록용)
export interface TagSummaryResponse {
  id: number;
  name: string;
  color?: string;
  usageCount: number;
  isSystemTag: boolean;
}

// 태그 통계 응답
export interface TagStatisticsResponse {
  totalTags: number;
  usedTags: number; // 실제 사용 중인 태그 수
  systemTags: number; // 시스템 태그 수
  averageUsage: number; // 평균 사용 횟수
  popularTags: TagSummaryResponse[]; // 인기 태그 목록
  recentTags: TagSummaryResponse[]; // 최근 생성된 태그
}

// 태그 클라우드 데이터
export interface TagCloudItem {
  tag: TagSummaryResponse;
  weight: number; // 가중치 (사용 빈도에 따른)
  fontSize: number; // 표시될 폰트 크기
}

// 태그 필터 옵션
export interface TagFilters {
  workspaceId?: number;
  isSystemTag?: boolean;
  hasUsage?: boolean; // 사용 중인 태그만
  color?: string;
  nameContains?: string;
  minUsage?: number;
  maxUsage?: number;
  sortBy?: 'name' | 'usageCount' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

// 태그 그룹 (카테고리별 태그 분류용)
export interface TagGroup {
  category: string;
  tags: TagSummaryResponse[];
  count: number;
}

// 페이지별 태그 정보
export interface PageTagInfo {
  pageId: number;
  pageTitle: string;
  tags: TagSummaryResponse[];
  tagCount: number;
}

// 태그 제안 (자동완성용)
export interface TagSuggestion {
  tag: TagSummaryResponse;
  relevanceScore: number; // 관련성 점수
  reason: 'usage' | 'similarity' | 'recent'; // 제안 이유
}

// 태그 색상 팔레트
export const TAG_COLOR_PALETTE = [
  '#FF6B6B', // 빨간색
  '#4ECDC4', // 청록색
  '#45B7D1', // 파란색
  '#FFA07A', // 주황색
  '#98D8C8', // 민트색
  '#F7DC6F', // 노란색
  '#BB8FCE', // 보라색
  '#85C1E9', // 하늘색
  '#F8C471', // 베이지색
  '#82E0AA', // 연두색
  '#F1948A', // 분홍색
  '#AED6F1', // 연파랑
] as const;

// 태그 색상 타입
export type TagColor = (typeof TAG_COLOR_PALETTE)[number] | string;

// 시스템 태그 타입
export type SystemTagType =
  | 'template'
  | 'archived'
  | 'favorite'
  | 'important'
  | 'draft'
  | 'published';

// 시스템 태그 정보
export interface SystemTag {
  type: SystemTagType;
  name: string;
  color: string;
  description: string;
  icon: string;
}
