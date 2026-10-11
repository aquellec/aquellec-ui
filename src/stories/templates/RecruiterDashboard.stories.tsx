import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Briefcase, ExternalLink, FileText, User } from 'lucide-react';
import { useI18n, type Dictionary } from '../../../.storybook/i18n';
import { Dropzone } from '../../components/Dropzone';
import { SegmentedControl } from '../../components/SegmentedControl';
import { DataTable } from '../../components/DataTable';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { ScoreGauge } from '../../components/ScoreGauge';
import { getScoreTextClass } from '../../lib/score-tier';
import { dataFigureClass, mastheadRuleClass, ruleMarkClass } from '../../lib/mark';
import {
  mutedTextClass,
  pageSurfaceClass,
  strongTextClass,
  subtleTextClass,
} from '../../lib/semantic-colors';
import { cn } from '../../lib/cn';

interface AnalysisHistory {
  id: string;
  candidateName: string;
  jobTitle: string;
  score: number;
  date: string;
  status: keyof Dictionary['dashboard']['statuses'];
}

const mockData: AnalysisHistory[] = [
  { id: '1', candidateName: 'Amandine Q.', jobTitle: 'Front-End Engineer', score: 88, date: '2026-08-12', status: 'matched' },
  { id: '2', candidateName: 'Alexandre M.', jobTitle: 'Full-Stack Developer', score: 64, date: '2026-08-10', status: 'review' },
  { id: '3', candidateName: 'Sophie L.', jobTitle: 'UI/UX Designer', score: 42, date: '2026-08-08', status: 'rejected' },
];

const statusVariant = { matched: 'success', review: 'warning', rejected: 'danger' } as const;

/**
 * Page template composing Dropzone (multiple), KPIs and DataTable. All copy
 * follows the language selector in the toolbar.
 */
const meta: Meta = {
  title: 'Templates/RecruiterDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Recruiter dashboard composition: multiple upload, KPIs and a DataTable of analyzed applications.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;


/**
 * Hero block: one main figure at `text-8xl` on a lightly tinted surface, with
 * three secondary figures beside it.
 */
function PipelineHeadline() {
  const t = useI18n().dashboard.recruiter;

  const support = [
    { value: '24', label: t.hero.applications, tone: strongTextClass },
    { value: '6', label: t.hero.review, tone: 'text-ochre-700 dark:text-ochre-300' },
    { value: '0', label: t.hero.rejected, tone: mutedTextClass },
  ];

  return (
    <section className="bg-ink-50 dark:bg-ink-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-16 lg:py-20">
        <div>
          <p
            className={cn(
              'flex items-center gap-2.5 text-xs font-semibold uppercase tracking-eyebrow',
              'text-brand-700 dark:text-brand-300'
            )}
          >
            <span className={ruleMarkClass} aria-hidden="true" />
            {t.hero.kicker} · {t.hero.role}
          </p>

          <p className="mt-5 flex items-baseline gap-4">
            <span
              className={cn(
                'aq-display font-display text-8xl font-bold leading-none tracking-masthead',
                dataFigureClass,
                strongTextClass
              )}
            >
              18
            </span>
            <span className={cn('max-w-[10ch] text-lg font-semibold leading-tight', subtleTextClass)}>
              {t.hero.matched}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Secondary figures, separated by spacing and a 1px divider. */}
          <span className={mastheadRuleClass} aria-hidden="true" />
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {support.map((item) => (
              <div key={item.label}>
                <p
                  className={cn(
                    'aq-display font-display text-4xl font-bold leading-none',
                    dataFigureClass,
                    item.tone
                  )}
                >
                  {item.value}
                </p>
                <p
                  className={cn(
                    'mt-2 text-xs font-semibold uppercase tracking-eyebrow',
                    mutedTextClass
                  )}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <p className={cn('max-w-measure text-base leading-relaxed', subtleTextClass)}>
            {t.hero.verdict}
          </p>
        </div>
      </div>
    </section>
  );
}

/** Section heading with a 1px divider. */
function SectionHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <div className="pb-3">
        <h2
          className={cn(
            'aq-display font-display text-2xl font-bold tracking-tight sm:text-3xl',
            strongTextClass
          )}
        >
          {title}
        </h2>
        {subtitle && <p className={cn('mt-1 text-sm', mutedTextClass)}>{subtitle}</p>}
      </div>
      <span className={mastheadRuleClass} aria-hidden="true" />
    </header>
  );
}

function RecruiterDashboardPage() {
  const t = useI18n();
  const [workspace, setWorkspace] = useState('recruiter');

  const workspaceOptions = [
    {
      value: 'candidate',
      label: t.segmented.workspace.candidate,
      icon: <User className="h-3.5 w-3.5" />,
    },
    {
      value: 'recruiter',
      label: t.segmented.workspace.recruiter,
      icon: <Briefcase className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className={cn('min-h-screen', pageSurfaceClass)}>
      <header className="mx-auto max-w-6xl px-4 pb-4 pt-6 sm:px-6 sm:pt-8">
        <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-700 dark:text-brand-300">
              {t.dashboard.recruiter.brand}
            </p>
            <h1
              className={cn(
                'aq-display mt-1 font-display text-4xl font-bold tracking-tight sm:text-5xl',
                strongTextClass
              )}
            >
              {t.dashboard.recruiter.title}
            </h1>
          </div>
          <SegmentedControl
            options={workspaceOptions}
            value={workspace}
            onChange={setWorkspace}
            ariaLabel={t.dashboard.workspaceLabel}
          />
        </div>
        <span className={mastheadRuleClass} aria-hidden="true" />
      </header>

      <PipelineHeadline />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
          <section>
            <SectionHead
              title={t.dashboard.recruiter.upload.title}
              subtitle={t.dashboard.recruiter.upload.subtitle}
            />
            <Dropzone multiple labels={t.components.dropzone} maxSizeMB={5} accept=".pdf" />
          </section>

          <aside className="flex flex-col items-center gap-3">
            <ScoreGauge
              score={72}
              size="md"
              label={t.dashboard.recruiter.kpi.matchLabel}
              statusLabels={t.components.gaugeStatus}
              isAiTheme
              className="w-full"
            />
            <p className={cn('text-center text-sm', subtleTextClass)}>
              {t.dashboard.recruiter.kpi.matchCaption}
            </p>
          </aside>
        </div>

        <section className="mt-14">
          <SectionHead
            title={t.dashboard.recruiter.history.title}
            subtitle={t.dashboard.recruiter.history.subtitle}
          />
          <DataTable
              data={mockData}
              keyExtractor={(item) => item.id}
              labels={t.components.dataTable}
              /*
                Below `sm` only the first three columns are shown; the rest is
                reachable by horizontal scroll.
              */
              columns={[
                {
                  header: t.dashboard.recruiter.history.columns.candidate,
                  cell: (item) => (
                    <div className="flex items-center space-x-2 font-medium text-ink-900 dark:text-ink-100">
                      <FileText className="h-4 w-4 text-brand-600 dark:text-brand-300" aria-hidden="true" />
                      <span>{item.candidateName}</span>
                    </div>
                  ),
                },
                {
                  header: t.dashboard.recruiter.history.columns.job,
                  accessorKey: 'jobTitle',
                  className: 'hidden sm:table-cell',
                },
                {
                  header: t.dashboard.recruiter.history.columns.score,
                  cell: (item) => (
                    <span
                      className={cn(
                        'text-base font-bold',
                        dataFigureClass,
                        getScoreTextClass(item.score)
                      )}
                    >
                      {item.score}%
                    </span>
                  ),
                },
                {
                  header: t.dashboard.recruiter.history.columns.status,
                  cell: (item) => (
                    <Badge variant={statusVariant[item.status]} size="sm">
                      {t.dashboard.statuses[item.status]}
                    </Badge>
                  ),
                },
                {
                  header: t.dashboard.recruiter.history.columns.date,
                  accessorKey: 'date',
                  className: 'hidden sm:table-cell',
                },
                {
                  header: t.dashboard.recruiter.history.columns.action,
                  cell: () => (
                    <Button variant="ghost" size="sm">
                      {t.dashboard.recruiter.history.action}
                      <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                    </Button>
                  ),
                },
              ]}
            pagination={{ currentPage: 1, totalPages: 3, onPageChange: () => undefined }}
          />
        </section>
      </main>
    </div>
  );
}

export const Default: Story = {
  render: () => <RecruiterDashboardPage />,
};

/**
 * Mobile view — single column grid, header title and actions stacked.
 *
 * Open it in the **Canvas** tab: Storybook locks the viewport to Responsive on
 * documentation pages, so the preview below renders full width. The viewport is
 * applied for real in the Canvas and in the Vitest run.
 */
export const OnMobile: Story = {
  render: () => <RecruiterDashboardPage />,
  globals: {
    viewport: { value: 'mobile', isRotated: false },
  },
};

/**
 * Tablet view — the three column grid is already in place (md).
 *
 * Canvas tab as well: documentation pages ignore the story viewport.
 */
export const OnTablet: Story = {
  render: () => <RecruiterDashboardPage />,
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
};
