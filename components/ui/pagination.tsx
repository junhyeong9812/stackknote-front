/**
 * Pagination 컴포넌트
 * 데이터 페이지네이션을 위한 컴포넌트
 */

import * as React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PaginationProps, PaginationInfo } from '@/types';

// 페이지 번호 생성 유틸리티
function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  const end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push('ellipsis');
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      pages.push('ellipsis');
    }
    pages.push(totalPages);
  }

  return pages;
}

// 기본 Pagination 컴포넌트
export function Pagination({
  pagination,
  options = {},
  onPageChange,
  onPageSizeChange,
  className,
  loading = false,
  disabled = false,
}: PaginationProps) {
  const {
    showSizeSelector = true,
    showInfo = true,
    showFirstLast = true,
    maxVisiblePages = 7,
    sizeOptions = [10, 20, 50, 100],
  } = options;

  const { page, size, total, totalPages, hasNext, hasPrevious } = pagination;

  const isDisabled = disabled || loading;

  // 페이지 변경 핸들러
  const handlePageChange = React.useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages && !isDisabled) {
        onPageChange(newPage);
      }
    },
    [totalPages, isDisabled, onPageChange]
  );

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = React.useCallback(
    (newSize: string) => {
      if (onPageSizeChange && !isDisabled) {
        onPageSizeChange(parseInt(newSize, 10));
      }
    },
    [onPageSizeChange, isDisabled]
  );

  // 페이지 번호 생성
  const pageNumbers = generatePageNumbers(page, totalPages, maxVisiblePages);

  // 현재 페이지의 시작/끝 아이템 번호
  const startItem = (page - 1) * size + 1;
  const endItem = Math.min(page * size, total);

  if (totalPages <= 1) {
    return showInfo ? (
      <div className={cn('flex items-center justify-between', className)}>
        <div className='text-sm text-muted-foreground'>총 {total}개 항목</div>
      </div>
    ) : null;
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {/* 왼쪽: 정보 표시 */}
      <div className='flex items-center gap-6'>
        {showInfo && (
          <div className='text-sm text-muted-foreground'>
            {total > 0 ? (
              <>
                {startItem}-{endItem} / {total}개 항목
              </>
            ) : (
              '항목이 없습니다'
            )}
          </div>
        )}

        {/* 페이지 크기 선택 */}
        {showSizeSelector && onPageSizeChange && (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>페이지당</span>
            <Select
              value={size.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className='h-8 w-16'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map(option => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className='text-sm text-muted-foreground'>개</span>
          </div>
        )}
      </div>

      {/* 오른쪽: 페이지네이션 버튼 */}
      <div className='flex items-center gap-1'>
        {/* 처음 페이지 */}
        {showFirstLast && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(1)}
            disabled={!hasPrevious || isDisabled}
            className='h-8 w-8 p-0'
          >
            <ChevronsLeft className='h-4 w-4' />
            <span className='sr-only'>처음 페이지</span>
          </Button>
        )}

        {/* 이전 페이지 */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrevious || isDisabled}
          className='h-8 w-8 p-0'
        >
          <ChevronLeft className='h-4 w-4' />
          <span className='sr-only'>이전 페이지</span>
        </Button>

        {/* 페이지 번호들 */}
        {pageNumbers.map((pageNum, index) => (
          <React.Fragment key={index}>
            {pageNum === 'ellipsis' ? (
              <span className='flex h-8 w-8 items-center justify-center'>
                <MoreHorizontal className='h-4 w-4' />
              </span>
            ) : (
              <Button
                variant={pageNum === page ? 'default' : 'outline'}
                size='sm'
                onClick={() => handlePageChange(pageNum)}
                disabled={isDisabled}
                className='h-8 w-8 p-0'
              >
                {pageNum}
              </Button>
            )}
          </React.Fragment>
        ))}

        {/* 다음 페이지 */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext || isDisabled}
          className='h-8 w-8 p-0'
        >
          <ChevronRight className='h-4 w-4' />
          <span className='sr-only'>다음 페이지</span>
        </Button>

        {/* 마지막 페이지 */}
        {showFirstLast && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(totalPages)}
            disabled={!hasNext || isDisabled}
            className='h-8 w-8 p-0'
          >
            <ChevronsRight className='h-4 w-4' />
            <span className='sr-only'>마지막 페이지</span>
          </Button>
        )}
      </div>
    </div>
  );
}

// 간단한 페이지네이션 (이전/다음만)
export function SimplePagination({
  pagination,
  onPageChange,
  className,
  loading = false,
  disabled = false,
}: Omit<PaginationProps, 'options'>) {
  const { page, totalPages, hasNext, hasPrevious } = pagination;
  const isDisabled = disabled || loading;

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevious || isDisabled}
      >
        <ChevronLeft className='mr-1 h-4 w-4' />
        이전
      </Button>

      <span className='mx-4 text-sm text-muted-foreground'>
        {page} / {totalPages}
      </span>

      <Button
        variant='outline'
        size='sm'
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext || isDisabled}
      >
        다음
        <ChevronRight className='ml-1 h-4 w-4' />
      </Button>
    </div>
  );
}

// 페이지네이션 정보만 표시
export function PaginationInfo({
  pagination,
  className,
}: {
  pagination: PaginationInfo;
  className?: string;
}) {
  const { page, size, total, totalPages } = pagination;
  const startItem = (page - 1) * size + 1;
  const endItem = Math.min(page * size, total);

  return (
    <div className={cn('text-sm text-muted-foreground', className)}>
      {total > 0 ? (
        <>
          {startItem}-{endItem} / {total}개 항목 (페이지 {page}/{totalPages})
        </>
      ) : (
        '항목이 없습니다'
      )}
    </div>
  );
}

// 페이지네이션 유틸리티 훅
export function usePagination(
  initialPage: number = 1,
  initialSize: number = 10
) {
  const [page, setPage] = React.useState(initialPage);
  const [size, setSize] = React.useState(initialSize);

  const handlePageChange = React.useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = React.useCallback((newSize: number) => {
    setSize(newSize);
    setPage(1); // 페이지 크기 변경 시 첫 페이지로
  }, []);

  const reset = React.useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    size,
    setPage: handlePageChange,
    setSize: handlePageSizeChange,
    reset,
    params: { page, size }, // API 요청용
  };
}

export type { PaginationProps };
