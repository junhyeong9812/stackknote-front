'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  FileText,
  Hash,
  Clock,
  Star,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui';
import { useSearchModal } from '@/lib/hooks/use-search';
import { SearchResultItem, SearchType } from '@/types';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    setQuery,
    searchResults,
    suggestions,
    isSearching,
    isLoadingSuggestions,
    executeSearch,
    handleResultClick,
    clearSearch,
  } = useSearchModal();

  // 모달 열릴 때 포커스
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // 엔터키로 검색
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query) {
      executeSearch(query);
    }
  };

  // 검색 결과 그룹 렌더링
  const renderSearchResults = () => {
    if (!searchResults || searchResults.results.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Search className="mb-3 h-12 w-12 text-gray-300" />
          <p className="text-sm">검색 결과가 없습니다</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {searchResults.results.map((group) => (
          <div key={group.workspaceId}>
            <div className="mb-2 px-4">
              <h3 className="text-xs font-medium text-gray-500">
                {group.workspaceName}
              </h3>
            </div>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    handleResultClick(item, group.workspaceId);
                    onOpenChange(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.icon ? (
                    <span className="text-sm">{item.icon}</span>
                  ) : item.type === 'PAGE' ? (
                    <FileText className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Hash className="h-4 w-4 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.title}
                    </div>
                    {item.highlight && (
                      <div
                        className="text-xs text-gray-500"
                        dangerouslySetInnerHTML={{ __html: item.highlight }}
                      />
                    )}
                    {item.path && (
                      <div className="text-xs text-gray-400">{item.path}</div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 검색 제안 렌더링
  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null;
    }

    return (
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 py-2">
          <h3 className="text-xs font-medium text-gray-500">추천 검색어</h3>
        </div>
        <div className="space-y-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(suggestion.text);
                executeSearch(suggestion.text);
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {suggestion.icon ? (
                <span className="text-sm">{suggestion.icon}</span>
              ) : suggestion.type === 'PAGE' ? (
                <FileText className="h-4 w-4 text-gray-400" />
              ) : suggestion.type === 'WORKSPACE' ? (
                <Hash className="h-4 w-4 text-gray-400" />
              ) : (
                <Search className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // 빠른 액션 렌더링
  const renderQuickActions = () => {
    return (
      <div className="space-y-1 px-4 py-2">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            최근 페이지
          </span>
        </button>
        <button
          onClick={() => router.push('/favorites')}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Star className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            즐겨찾기
          </span>
        </button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0" hideCloseButton>
        <div className="flex h-full flex-col">
          {/* 검색 입력 */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 px-4 py-3">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="페이지, 워크스페이스 검색..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              {(isSearching || isLoadingSuggestions) && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              )}
              <kbd className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                ESC
              </kbd>
            </div>
          </div>

          {/* 검색 결과 */}
          <div className="max-h-96 flex-1 overflow-y-auto">
            {searchResults ? (
              renderSearchResults()
            ) : query ? (
              renderSuggestions()
            ) : (
              renderQuickActions()
            )}
          </div>

          {/* 하단 힌트 */}
          <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>
                  <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
                    ↑↓
                  </kbd>{' '}
                  이동
                </span>
                <span>
                  <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
                    Enter
                  </kbd>{' '}
                  선택
                </span>
              </div>
              <span>
                <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
                  Ctrl
                </kbd>{' '}
                +{' '}
                <kbd className="rounded bg-gray-100 px-1 py-0.5 text-xs dark:bg-gray-800">
                  K
                </kbd>{' '}
                검색
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}