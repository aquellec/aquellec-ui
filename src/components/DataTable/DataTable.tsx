import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { cn } from '../../lib/cn';
import { mutedTextClass } from '../../lib/semantic-colors';
import { focusRing } from '../../lib/focus-ring';

export interface Column<T> {
  /** Column header label. */
  header: string;
  /** Property key used when no custom cell renderer is provided. */
  accessorKey?: keyof T;
  /** Custom cell renderer for rich content (badges, buttons, etc.). */
  cell?: (item: T) => React.ReactNode;
  /** Optional className applied to header and body cells. */
  className?: string;
}

/** Pagination and navigation copy of the table. */
export interface DataTableLabels {
  /** Accessible name of the pagination area. */
  pagination: string;
  previousPage: string;
  nextPage: string;
  /** Current page indicator, rendered to the left of the controls. */
  pageStatus: (currentPage: number, totalPages: number) => React.ReactNode;
}

/** English defaults. Pass `labels` to render the table in another language. */
export const defaultDataTableLabels: DataTableLabels = {
  pagination: 'Table pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  pageStatus: (currentPage, totalPages) => (
    <>
      Page <strong className="text-slate-800">{currentPage}</strong> of{' '}
      <strong className="text-slate-800">{totalPages}</strong>
    </>
  ),
};

export interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  /** Partial override of the component copy, merged over the defaults. */
  labels?: Partial<DataTableLabels>;
  /** Rows to display in the table body. */
  data: T[];
  /** Column configuration describing headers and cell rendering. */
  columns: Column<T>[];
  /** Stable unique key extractor for each row. */
  keyExtractor: (item: T) => string | number;
  /** Shows skeleton placeholder rows instead of data. */
  isLoading?: boolean;
  /** Message shown when `data` is empty and not loading. */
  emptyMessage?: string;
  /** Optional previous/next pagination controls. */
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

function DataTableInner<T>(
  {
    data,
    columns,
    keyExtractor,
    isLoading = false,
    emptyMessage = 'No data available',
    pagination,
    labels: labelsProp,
    className,
    ...props
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const labels: DataTableLabels = { ...defaultDataTableLabels, ...labelsProp };

  return (
    <div
      ref={ref}
      className={cn(
        'w-full border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-sm',
        className
      )}
      {...props}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse" aria-busy={isLoading || undefined}>
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {columns.map((col) => (
                <th key={col.header} scope="col" className={cn('py-3.5 px-4', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={`${col.header}-skeleton-${rowIdx}`} className="py-4 px-4">
                      <div className="h-4 bg-slate-200/60 rounded-md w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={cn('py-12 text-center', mutedTextClass)}>
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Inbox className={cn('w-8 h-8', mutedTextClass)} aria-hidden="true" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={keyExtractor(item)} className="hover:bg-slate-50/60 transition-colors">
                  {columns.map((col) => (
                    <td key={`${keyExtractor(item)}-${col.header}`} className={cn('py-3.5 px-4 text-slate-700', col.className)}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey != null
                          ? String(item[col.accessorKey])
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && !isLoading && data.length > 0 && (
        <nav
          aria-label={labels.pagination}
          className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500"
        >
          <span>{labels.pageStatus(pagination.currentPage, pagination.totalPages)}</span>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className={cn(
                'p-1 rounded-md border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors',
                focusRing
              )}
              aria-label={labels.previousPage}
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className={cn(
                'p-1 rounded-md border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors',
                focusRing
              )}
              aria-label={labels.nextPage}
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export const DataTable = React.forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement | null;
