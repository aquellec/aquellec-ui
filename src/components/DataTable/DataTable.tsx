import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'Aucune donnée disponible',
  pagination,
  className,
}: DataTableProps<T>) {
  return (
    <div className={twMerge('w-full border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-xs', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className={clsx('py-3.5 px-4', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, rowIdx) => (
                <tr key={rowIdx} className="animate-pulse">
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="py-4 px-4">
                      <div className="h-4 bg-slate-200/60 rounded-md w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Inbox className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={keyExtractor(item)} className="hover:bg-slate-50/60 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={clsx('py-3.5 px-4 text-slate-700', col.className)}>
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? (item[col.accessorKey] as unknown as React.ReactNode)
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
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Page <strong className="text-slate-800">{pagination.currentPage}</strong> sur{' '}
            <strong className="text-slate-800">{pagination.totalPages}</strong>
          </span>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="p-1 rounded-md border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="p-1 rounded-md border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
              aria-label="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
