/**
 * Table 컴포넌트
 * 데이터 표시용 테이블 컴포넌트
 */

import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type {
  TableProps,
  TableColumn,
  SortingState,
  SelectionState,
  TableConfig,
} from '@/types';

// Table 변형 스타일
const tableVariants = cva('w-full caption-bottom text-sm', {
  variants: {
    variant: {
      default: '',
      bordered: 'border border-border',
      striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/50',
    },
    size: {
      default: '',
      compact: '[&_td]:py-2 [&_th]:py-2',
      comfortable: '[&_td]:py-4 [&_th]:py-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

// 기본 Table 컴포넌트들
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & VariantProps<typeof tableVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div className='relative w-full overflow-auto'>
    <table
      ref={ref}
      className={cn(tableVariants({ variant, size }), className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & {
    selected?: boolean;
    clickable?: boolean;
  }
>(({ className, selected, clickable, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      selected && 'bg-muted',
      clickable && 'cursor-pointer',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    sortable?: boolean;
    sorted?: 'asc' | 'desc' | false;
    onSort?: () => void;
  }
>(({ className, children, sortable, sorted, onSort, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      sortable && 'cursor-pointer select-none hover:bg-muted/50',
      className
    )}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className='flex items-center gap-2'>
      {children}
      {sortable && (
        <span className='flex flex-col'>
          {sorted === 'asc' ? (
            <ChevronUp className='h-4 w-4' />
          ) : sorted === 'desc' ? (
            <ChevronDown className='h-4 w-4' />
          ) : (
            <ChevronsUpDown className='h-4 w-4 opacity-50' />
          )}
        </span>
      )}
    </div>
  </th>
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

// 데이터 테이블 컴포넌트
function DataTable<T = any>({
  data = [],
  columns = [],
  loading = false,
  error,
  emptyMessage = '데이터가 없습니다.',
  config = {},
  actions = {},
  className,
  rowKey = 'id' as keyof T,
  getRowProps,
  getCellProps,
  ...props
}: TableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState[]>([]);
  const [selection, setSelection] = React.useState<SelectionState>({
    selectedRowIds: new Set(),
    isAllSelected: false,
    isPartiallySelected: false,
  });

  const {
    striped = false,
    hover = true,
    bordered = false,
    compact = false,
    selectable = false,
    sortable = true,
  } = config;

  // 행 키 생성
  const getRowId = React.useCallback(
    (row: T, index: number): string | number => {
      if (typeof rowKey === 'function') {
        return rowKey(row);
      }
      return (row as any)[rowKey] ?? index;
    },
    [rowKey]
  );

  // 정렬 처리
  const handleSort = React.useCallback(
    (column: TableColumn<T>) => {
      if (!column.sortable || !sortable) return;

      setSorting(current => {
        const existing = current.find(s => s.id === column.id);
        const newSorting = current.filter(s => s.id !== column.id);

        if (!existing) {
          newSorting.push({ id: column.id, desc: false });
        } else if (!existing.desc) {
          newSorting.push({ id: column.id, desc: true });
        }
        // desc가 true면 제거 (토글 완료)

        actions.onSort?.(newSorting);
        return newSorting;
      });
    },
    [sortable, actions]
  );

  // 선택 처리
  const handleSelectAll = React.useCallback(
    (checked: boolean) => {
      const newSelection: SelectionState = {
        selectedRowIds: checked
          ? new Set(data.map((row, index) => getRowId(row, index)))
          : new Set(),
        isAllSelected: checked,
        isPartiallySelected: false,
      };
      setSelection(newSelection);
      actions.onSelect?.(newSelection);
    },
    [data, getRowId, actions]
  );

  const handleSelectRow = React.useCallback(
    (rowId: string | number, checked: boolean) => {
      setSelection(current => {
        const newSelectedIds = new Set(current.selectedRowIds);
        if (checked) {
          newSelectedIds.add(rowId);
        } else {
          newSelectedIds.delete(rowId);
        }

        const newSelection: SelectionState = {
          selectedRowIds: newSelectedIds,
          isAllSelected: newSelectedIds.size === data.length && data.length > 0,
          isPartiallySelected:
            newSelectedIds.size > 0 && newSelectedIds.size < data.length,
        };

        actions.onSelect?.(newSelection);
        return newSelection;
      });
    },
    [data.length, actions]
  );

  // 행 클릭 처리
  const handleRowClick = React.useCallback(
    (row: T, index: number) => {
      actions.onRowClick?.(row, index);
    },
    [actions]
  );

  // 로딩 상태
  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <Loader2 className='h-6 w-6 animate-spin' />
        <span className='ml-2'>로딩 중...</span>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='mb-2 text-destructive'>오류가 발생했습니다</div>
        <div className='text-sm text-muted-foreground'>{error}</div>
      </div>
    );
  }

  // 빈 데이터 상태
  if (data.length === 0) {
    return (
      <div className='flex items-center justify-center py-12 text-center'>
        <div className='text-muted-foreground'>{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <Table
        variant={bordered ? 'bordered' : striped ? 'striped' : 'default'}
        size={compact ? 'compact' : 'default'}
        {...props}
      >
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className='w-12'>
                <input
                  type='checkbox'
                  checked={selection.isAllSelected}
                  ref={input => {
                    if (input)
                      input.indeterminate = selection.isPartiallySelected;
                  }}
                  onChange={e => handleSelectAll(e.target.checked)}
                  className='h-4 w-4'
                  aria-label='전체 선택'
                />
              </TableHead>
            )}
            {columns
              .filter(column => !column.hidden)
              .map(column => {
                const sortState = sorting.find(s => s.id === column.id);
                const sortDirection = sortState
                  ? sortState.desc
                    ? 'desc'
                    : 'asc'
                  : false;

                return (
                  <TableHead
                    key={column.id}
                    sortable={column.sortable && sortable}
                    sorted={sortDirection}
                    onSort={() => handleSort(column)}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      textAlign: column.align,
                    }}
                  >
                    {column.header}
                  </TableHead>
                );
              })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const rowId = getRowId(row, index);
            const isSelected = selection.selectedRowIds.has(rowId);
            const rowProps = getRowProps?.(row, index) || {};

            return (
              <TableRow
                key={rowId}
                selected={isSelected}
                clickable={!!actions.onRowClick}
                onClick={() => handleRowClick(row, index)}
                {...rowProps}
              >
                {selectable && (
                  <TableCell>
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={e => handleSelectRow(rowId, e.target.checked)}
                      className='h-4 w-4'
                      aria-label={`행 ${index + 1} 선택`}
                    />
                  </TableCell>
                )}
                {columns
                  .filter(column => !column.hidden)
                  .map(column => {
                    const value = column.accessorKey
                      ? (row as any)[column.accessorKey]
                      : undefined;

                    const cellProps = getCellProps?.(row, column, value) || {};

                    return (
                      <TableCell
                        key={column.id}
                        style={{
                          width: column.width,
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                          textAlign: column.align,
                        }}
                        {...cellProps}
                      >
                        {column.cell
                          ? column.cell({ row, value, index })
                          : value?.toString() || '-'}
                      </TableCell>
                    );
                  })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// 간단한 테이블 (기본 HTML 테이블 래퍼)
const SimpleTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & {
    headers: string[];
    data: (string | React.ReactNode)[][];
    striped?: boolean;
    bordered?: boolean;
    hover?: boolean;
  }
>(({ headers, data, striped, bordered, hover, className, ...props }, ref) => (
  <Table
    ref={ref}
    variant={bordered ? 'bordered' : striped ? 'striped' : 'default'}
    className={cn(hover && 'hover:bg-muted/50', className)}
    {...props}
  >
    <TableHeader>
      <TableRow>
        {headers.map((header, index) => (
          <TableHead key={index}>{header}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <TableCell key={cellIndex}>{cell}</TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
));

SimpleTable.displayName = 'SimpleTable';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  DataTable,
  SimpleTable,
};
