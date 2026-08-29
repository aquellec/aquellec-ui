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
  /**
   * Accessible name of the horizontal scroll area wrapping the table.
   *
   * Below the width of its columns the table scrolls sideways. The area is
   * focusable so it can be scrolled with the keyboard, which means it needs a
   * name to be announced.
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
      Page <strong className="text-slate-800 dark:text-slate-100">{currentPage}</strong> of{' '}
      <strong className="text-slate-800 dark:text-slate-100">{totalPages}</strong>
    </>
  ),
  scrollRegion: 'Table, scrollable horizontally',
};

/**
 * Edge shadows revealing that the table scrolls sideways.
 *
 * The two cover layers are attached to the content (`local`) and the two
 * shadows to the container (`scroll`): a shadow is therefore covered while the
 * matching edge is reached, and appears as soon as content is hidden on that
 * side. Pure CSS, no scroll listener.
 *
 * Both colours come from custom properties rather than being written into the
 * gradients: an inline style cannot carry a `dark:` variant, and a hard-coded
 * white cover would smear across the left and right edges of a dark table. The
 * values are set by `scrollShadowTheme` below.
 */
const scrollShadows: React.CSSProperties = {
  backgroundImage: [
    'linear-gradient(to right, var(--aq-table-edge) 30%, transparent)',
    'linear-gradient(to left, var(--aq-table-edge) 30%, transparent)',
    'radial-gradient(farthest-side at 0 50%, var(--aq-table-shadow), transparent)',
    'radial-gradient(farthest-side at 100% 50%, var(--aq-table-shadow), transparent)',
  ].join(', '),
  backgroundPosition: 'left center, right center, left center, right center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '40px 100%, 40px 100%, 14px 100%, 14px 100%',
  backgroundAttachment: 'local, local, scroll, scroll',
};

/*
  The cover matches the table surface (white / slate-900) so it hides the
  shadow once an edge is reached. The shadow itself is deepened in dark mode:
  a slate-tinted shadow is invisible against a dark surface.
*/
const scrollShadowTheme =
  '[--aq-table-edge:#ffffff] [--aq-table-shadow:rgba(15,23,42,0.14)] ' +
  'dark:[--aq-table-edge:#0f172a] dark:[--aq-table-shadow:rgba(0,0,0,0.55)]';

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
        'dark:border-slate-700 dark:bg-slate-900',
        className
      )}
      {...props}
    >
      {/*
        `tabIndex` makes the scroll area reachable with the keyboard, which is
        the only way to reach the hidden columns without a pointer. A focusable
        element needs a role and a name, hence the labelled region.
      */}
      <div
        /*
          `overscroll-x-contain` keeps a horizontal swipe inside the table:
          without it, reaching the last column hands the gesture to the browser,
          which triggers back-navigation on iOS and Chrome Android.
        */
        className={cn('overflow-x-auto overscroll-x-contain', scrollShadowTheme, focusRing)}
        style={scrollShadows}
        tabIndex={0}
        role="region"
        aria-label={labels.scrollRegion}
      >
        <table className="w-full text-left text-sm border-collapse" aria-busy={isLoading || undefined}>
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold text-slate-500 uppercase tracking-wider dark:bg-slate-800/60 dark:border-slate-700 dark:text-slate-400">
              {/*
                Headers wrap, cells do not: a header is a label that can take
                two lines, and keeping `CANDIDATE / RESUME` on one line alone
                costs 230px of the 375px viewport.
              */}
              {columns.map((col) => (
                <th key={col.header} scope="col" className={cn('py-3.5 px-3 sm:px-4', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={`${col.header}-skeleton-${rowIdx}`} className="py-4 px-3 sm:px-4">
                      <div className="h-4 bg-slate-200/60 dark:bg-slate-700/60 rounded-md w-3/4" />
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
                <tr
                  key={keyExtractor(item)}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/*
                    Cells do not wrap: at 375px a wrapped cell turns a badge
                    into two clipped lines. The table scrolls instead, and a
                    column can opt back in with `className: 'whitespace-normal'`.
                  */}
                  {columns.map((col) => (
                    <td
                      key={`${keyExtractor(item)}-${col.header}`}
                      className={cn(
                        'py-3.5 px-3 sm:px-4 text-slate-700 dark:text-slate-200 whitespace-nowrap',
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
          className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-400"
        >
          <span>{labels.pageStatus(pagination.currentPage, pagination.totalPages)}</span>
          {/*
            44px targets on touch screens, back to a compact 32px from `sm`
            where the pointer is precise.
          */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center sm:h-8 sm:w-8 rounded-md border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors',
                'dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
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
                'inline-flex h-11 w-11 items-center justify-center sm:h-8 sm:w-8 rounded-md border border-slate-200 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors',
                'dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
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
