/**
 * 테이블 관련 타입 정의
 * @file types/table.ts
 */

import React from 'react';

// 정렬 방향
export type SortDirection = 'asc' | 'desc' | null;

// 테이블 열 정의
export interface TableColumn<T = any> {
  id: string;
  header: React.ReactNode;
  accessorKey?: keyof T; // 데이터 접근 키
  cell?: (props: { row: T; value: any; index: number }) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right'; // 고정 열
  hidden?: boolean;
}

// 테이블 정렬 상태
export interface SortingState {
  id: string;
  desc: boolean;
}

// 테이블 필터
export interface TableFilter {
  id: string;
  value: any;
}

// 테이블 선택 상태
export interface SelectionState {
  selectedRowIds: Set<string | number>;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
}

// 프론트엔드용 페이지네이션 정보 (백엔드 PaginatedResponse를 변환)
export interface PaginationInfo {
  page: number; // 현재 페이지 (1부터 시작, 백엔드는 0부터)
  size: number; // 페이지당 항목 수
  total: number; // 전체 항목 수 (totalElements)
  totalPages: number; // 전체 페이지 수
  hasNext: boolean; // 다음 페이지 존재 여부
  hasPrevious: boolean; // 이전 페이지 존재 여부
}

// 페이지네이션 옵션
export interface PaginationOptions {
  page?: number;
  size?: number;
  showSizeSelector?: boolean;
  showInfo?: boolean;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
  sizeOptions?: number[];
}

// 테이블 상태
export interface TableState {
  sorting: SortingState[];
  filters: TableFilter[];
  selection: SelectionState;
  pagination: PaginationInfo;
  loading?: boolean;
  error?: string;
}

// 테이블 액션
export interface TableActions<T = any> {
  onSort?: (sorting: SortingState[]) => void;
  onFilter?: (filters: TableFilter[]) => void;
  onSelect?: (selection: SelectionState) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
}

// 테이블 설정
export interface TableConfig {
  striped?: boolean; // 줄무늬 효과
  hover?: boolean; // 호버 효과
  bordered?: boolean; // 테두리
  compact?: boolean; // 컴팩트 모드
  selectable?: boolean; // 행 선택 가능
  sortable?: boolean; // 정렬 가능
  filterable?: boolean; // 필터링 가능
  resizable?: boolean; // 열 크기 조정 가능
  virtualized?: boolean; // 가상화 (대용량 데이터)
  sticky?: boolean; // 헤더 고정
}

// 렌더링 함수 타입들
export type CellRenderer<T = any> = (props: {
  row: T;
  value: any;
  index: number;
  column: TableColumn<T>;
}) => React.ReactNode;

export type HeaderRenderer = (props: {
  column: TableColumn;
  sorting?: SortingState;
  onSort?: (column: TableColumn) => void;
}) => React.ReactNode;

// 테이블 컴포넌트 Props
export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  config?: TableConfig;
  actions?: TableActions<T>;
  pagination?: PaginationOptions;
  className?: string;
  rowKey?: keyof T | ((row: T) => string | number);
  getRowProps?: (
    row: T,
    index: number
  ) => React.HTMLAttributes<HTMLTableRowElement>;
  getCellProps?: (
    row: T,
    column: TableColumn<T>,
    value: any
  ) => React.TdHTMLAttributes<HTMLTableCellElement>;
}

// 페이지네이션 컴포넌트 Props
export interface PaginationProps {
  pagination: PaginationInfo;
  options?: PaginationOptions;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

// 데이터 테이블 훅 반환 타입
export interface UseDataTableResult<T = any> {
  data: T[];
  state: TableState;
  actions: TableActions<T>;
  pagination: PaginationInfo;
  loading: boolean;
  error?: string;
  refetch: () => void;
}

// 백엔드 PaginatedResponse를 프론트엔드 PaginationInfo로 변환하는 유틸리티 타입
export type PaginatedResponseToPaginationInfo = <T>(
  response: import('./api').PaginatedResponse<T>
) => {
  data: T[];
  pagination: PaginationInfo;
};

// 멤버 테이블용 특화 타입들
export interface MemberTableRow {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    profileImageUrl?: string;
  };
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  joinedAt: string;
  lastActiveAt?: string;
  invitedBy?: string;
}

// 페이지 테이블용 특화 타입들
export interface PageTableRow {
  id: number;
  title: string;
  icon?: string;
  type: 'DOCUMENT' | 'DATABASE' | 'KANBAN' | 'CALENDAR';
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  author: string;
  lastModified: string;
  views: number;
  tags: string[];
}
