/**
 * Select 관련 타입 정의
 * @file types/select.ts
 */

import React from 'react';

// 기본 선택 옵션
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

// 그룹화된 선택 옵션
export interface SelectGroupOption {
  label: string;
  options: SelectOption[];
}

// 선택 상태
export interface SelectState {
  value: string | string[];
  isOpen: boolean;
  searchQuery: string;
  filteredOptions: SelectOption[];
}

// 다중 선택 옵션
export interface MultiSelectOption extends SelectOption {
  selected?: boolean;
}

// 색상이 있는 선택 옵션 (태그 등에 사용)
export interface ColorSelectOption extends SelectOption {
  color?: string;
  backgroundColor?: string;
}

// 아바타가 있는 선택 옵션 (사용자 선택 등에 사용)
export interface AvatarSelectOption extends SelectOption {
  avatar?: string;
  email?: string;
  role?: string;
}

// 계층적 선택 옵션 (트리 구조)
export interface HierarchicalSelectOption extends SelectOption {
  level: number;
  parentValue?: string;
  children?: HierarchicalSelectOption[];
  hasChildren?: boolean;
  isExpanded?: boolean;
}

// 검색 가능한 선택 옵션
export interface SearchableSelectOption extends SelectOption {
  searchTerms?: string[]; // 추가 검색어
  category?: string;
}

// 커스텀 렌더링 옵션
export interface CustomSelectOption extends SelectOption {
  render?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
  renderLabel?: (option: SelectOption) => React.ReactNode;
}
