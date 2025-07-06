/**
 * 검색 관련 타입 정의
 */

// 검색 타입
export enum SearchType {
  ALL = 'ALL',
  PAGE = 'PAGE',
  WORKSPACE = 'WORKSPACE',
  TITLE = 'TITLE',
  CONTENT = 'CONTENT',
  TAG = 'TAG'
}

// 전역 검색 응답
export interface GlobalSearchResponse {
  results: SearchResultGroup[];
  totalCount: number;
}

// 검색 결과 그룹 (워크스페이스별 그룹화)
export interface SearchResultGroup {
  workspaceId: number;
  workspaceName: string;
  items: SearchResultItem[];
}

// 검색 결과 항목
export interface SearchResultItem {
  id: number;
  type: 'PAGE' | 'WORKSPACE';
  title: string;
  icon?: string;
  highlight?: string;
  path?: string;
}

// 검색 제안
export interface SearchSuggestion {
  text: string;
  type: 'PAGE' | 'WORKSPACE' | 'TAG';
  icon?: string;
}

// 전역 검색 요청 파라미터
export interface GlobalSearchParams {
  query: string;
  workspaceId?: number;
  type?: SearchType;
  limit?: number;
  offset?: number;
}