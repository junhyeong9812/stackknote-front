/**
 * 검색 관련 커스텀 훅
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { searchApi } from '@/lib/api/search';
import {
  GlobalSearchResponse,
  SearchSuggestion,
  SearchType,
  SearchResultItem,
} from '@/types';

interface UseSearchOptions {
  enableSuggestions?: boolean;
  suggestionDelay?: number;
  minQueryLength?: number;
  defaultType?: SearchType;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    enableSuggestions = true,
    suggestionDelay = 300,
    minQueryLength = 2,
    defaultType = SearchType.ALL,
  } = options;

  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GlobalSearchResponse | null>(null);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const debouncedQuery = useDebounce(query, suggestionDelay);

  // 검색 실행
  const executeSearch = useCallback(
    async (searchQuery: string, workspaceId?: number, type: SearchType = defaultType) => {
      if (searchQuery.length < minQueryLength) {
        setSearchResults(null);
        return;
      }

      try {
        setIsSearching(true);
        setError(null);

        const response = await searchApi.search(searchQuery, workspaceId, type);
        setSearchResults(response.data);
      } catch (err: any) {
        setError(err.message || '검색에 실패했습니다.');
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    },
    [minQueryLength, defaultType]
  );

  // 검색 제안 가져오기
  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      if (!enableSuggestions || searchQuery.length < minQueryLength) {
        setSuggestions([]);
        return;
      }

      // 이전 요청 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 새 요청 생성
      abortControllerRef.current = new AbortController();

      try {
        setIsLoadingSuggestions(true);
        const response = await searchApi.getSuggestions(searchQuery);
        setSuggestions(response.data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('검색 제안 오류:', err);
        }
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    [enableSuggestions, minQueryLength]
  );

  // 디바운스된 쿼리로 자동 제안
  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, fetchSuggestions]);

  // 검색 결과 항목 클릭 핸들러
  const handleResultClick = useCallback(
    (item: SearchResultItem, workspaceId: number) => {
      if (item.type === 'PAGE') {
        router.push(`/workspace/${workspaceId}/page/${item.id}`);
      } else if (item.type === 'WORKSPACE') {
        router.push(`/workspace/${item.id}`);
      }
    },
    [router]
  );

  // 검색 초기화
  const clearSearch = useCallback(() => {
    setQuery('');
    setSearchResults(null);
    setSuggestions([]);
    setError(null);
  }, []);

  // 컴포넌트 언마운트 시 요청 취소
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    query,
    searchResults,
    suggestions,
    isSearching,
    isLoadingSuggestions,
    error,

    // Actions
    setQuery,
    executeSearch,
    handleResultClick,
    clearSearch,
  };
}

// 검색 모달용 훅
export function useSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const search = useSearch({
    enableSuggestions: true,
    suggestionDelay: 200,
  });

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    search.clearSearch();
  }, [search]);

  // 키보드 단축키 (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  return {
    isOpen,
    openSearch,
    closeSearch,
    ...search,
  };
}

// 디바운스 훅 (없으면 추가)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}