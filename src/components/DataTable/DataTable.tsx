import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { cn } from '../../lib/cn';
import { dataFigureClass } from '../../lib/mark';
import {
  dividerBorderClass,
  mutedTextClass,
  raisedSurfaceClass,
  sunkenSurfaceClass,
} from '../../lib/semantic-colors';
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
  /**
   * Accessible name of the horizontal scroll area. The area is focusable for
   * keyboard scrolling, so it needs a name.
   */
  scrollRegion: string;
}

/** English defaults. Pass `labels` to render the table in another language. */
export const defaultDataTableLabels: DataTableLabels = {
  pagination: 'Table pagination',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  pageStatus: (currentPage, totalPages) => (
    <>
      Page <strong className="tabular-nums text-ink-900 dark:text-ink-50">{currentPage}</strong> of{' '}
      <strong className="tabular-nums text-ink-900 dark:text-ink-50">{totalPages}</strong>
    </>
  ),
  scrollRegion: 'Table, scrollable horizontally',
};

/**
 * Edge shadows indicating horizontal overflow, in pure CSS. The cover layers
 * scroll with the content (`local`) and the shadows stay with the container
 * (`scroll`), so a shadow is hidden when its edge is reached.
 *
 * Colours come from custom properties because an inline style cannot carry a
 * `dark:` variant.
 */
const scrollShadows: React.CSSProperties = {
  backgroundImage: [
    'linear-gradient(to right, var(--aq-surface-raised) 30%, transparent)',
    'linear-gradient(to left, var(--aq-surface-raised) 30%, transparent)',
    'radial-gradient(farthest-side at 0 50%, var(--aq-scroll-shadow), transparent)',
    'radial-gradient(farthest-side at 100% 50%, var(--aq-scroll-shadow), transparent)',
  ].join(', '),
  backgroundPosition: 'left center, right center, left center, right center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '40px 100%, 40px 100%, 14px 100%, 14px 100%',
  backgroundAttachment: 'local, local, scroll, scroll',
};

/*
  `--aq-surface-raised` and `--aq-scroll-shadow` are published on `:root` and
  `.dark` by the preset (Tailwind 3) and `theme.css` (Tailwind 4), from
  `src/lib/design-tokens.ts`.
*/

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
        /*
          No outer border: the table is separated by elevation, with a 1px
          divider under the header.
        */
        'w-full overflow-hidden rounded-2xl shadow-card',
        raisedSurfaceClass,
        className
      )}
      {...props}
    >
      {/*
         `tabIndex` makes the scroll area keyboard-reachable; a focusable
         element needs a role and a name, hence the labelled region.
       */}
      <div
        /*
          `overscroll-x-contain` stops a horizontal swipe from triggering
          browser back-navigation (iOS, Chrome Android) at the scroll end.
        */
        className={cn('overflow-x-auto overscroll-x-contain', focusRing)}
        style={scrollShadows}
        tabIndex={0}
        role="region"
        aria-label={labels.scrollRegion}
      >
        <table className="w-full text-left text-sm border-collapse" aria-busy={isLoading || undefined}>
          <thead>
            {/* Uppercase, wide-tracked header labels on a 1px divider. */}
            <tr
              className={cn(
                'text-xs font-semibold uppercase tracking-eyebrow',
                '[&>th]:border-b [&>th]:border-b-ink-200 dark:[&>th]:border-b-ink-800',
                sunkenSurfaceClass,
                mutedTextClass
              )}
            >
              {/* Headers may wrap to two lines to save width on small screens; cells do not. */}
              {columns.map((col) => (
                <th key={col.header} scope="col" className={cn('py-3.5 px-3 sm:px-4', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={`${col.header}-skeleton-${rowIdx}`} className="py-4 px-3 sm:px-4">
                      <div className="h-4 w-3/4 rounded-md bg-ink-200 dark:bg-ink-800" />
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
                /*
                  Hover accent on the first cell rather than the row: with
                  `border-collapse`, a `tr` border is merged away by its cells.
                  Both states declare the 2px width so rows do not shift.
                */
                <tr
                  key={keyExtractor(item)}
                  className={cn(
                    'transition-colors duration-150 ease-settle motion-reduce:transition-none',
                    'hover:bg-ink-50 dark:hover:bg-ink-800/60',
                    '[&>td:first-child]:border-l-2 [&>td:first-child]:border-l-transparent',
                    'hover:[&>td:first-child]:border-l-brand-600 dark:hover:[&>td:first-child]:border-l-brand-400'
                  )}
                >
                  {/*
                     Cells do not wrap, so badges are not clipped; the table
                     scrolls instead. A column can opt back in with `className:
                     'whitespace-normal'`.
                   */}
                  {columns.map((col) => (
                    <td
                      key={`${keyExtractor(item)}-${col.header}`}
                      className={cn(
                        'whitespace-nowrap px-3 py-3.5 text-ink-800 dark:text-ink-100 sm:px-4',
                        dataFigureClass,
                        col.className
                      )}
                    >
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
          className={cn(
            'flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2 text-xs sm:px-4 sm:py-3',
            sunkenSurfaceClass,
            dividerBorderClass,
            mutedTextClass
          )}
        >
          <span>{labels.pageStatus(pagination.currentPage, pagination.totalPages)}</span>
          {/* 44px targets below `sm`, 32px from `sm` up. */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-800 sm:h-8 sm:w-8',
                'transition-colors duration-150 ease-settle motion-reduce:transition-none',
                'hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-40',
                'dark:text-ink-100 dark:hover:bg-ink-700',
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
                'inline-flex h-11 w-11 items-center justify-center rounded-md text-ink-800 sm:h-8 sm:w-8',
                'transition-colors duration-150 ease-settle motion-reduce:transition-none',
                'hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-40',
                'dark:text-ink-100 dark:hover:bg-ink-700',
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
