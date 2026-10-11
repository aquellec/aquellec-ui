import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArrowRight, Briefcase, Sparkles, User, Zap } from 'lucide-react';
import { useI18n, type Dictionary } from '../../../.storybook/i18n';
import { Dropzone } from '../../components/Dropzone';
import { SegmentedControl } from '../../components/SegmentedControl';
import { ScoreGauge } from '../../components/ScoreGauge';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { ProgressBar } from '../../components/ProgressBar';
import { Textarea } from '../../components/Textarea';
import { Input } from '../../components/Input';
import { DataTable } from '../../components/DataTable';
import { getScoreTextClass, SCORE_TIER_HIGH, SCORE_TIER_MEDIUM } from '../../lib/score-tier';
import {
  dataFigureClass,
  mastheadRuleClass,
  ruleMarkClass,
  thresholdMarkClass,
} from '../../lib/mark';
import {
  bodyTextClass,
  mutedTextClass,
  pageSurfaceClass,
  strongTextClass,
  subtleTextClass,
} from '../../lib/semantic-colors';
import { cn } from '../../lib/cn';

interface CandidateAnalysis {
  id: string;
  company: string;
  jobTitle: string;
  score: number;
  date: string;
  status: keyof Dictionary['dashboard']['statuses'];
}

/* Sample data values are not translated; only statuses and column headers are. */
const recentAnalyses: CandidateAnalysis[] = [
  { id: '1', company: 'Vercel', jobTitle: 'Front-End Engineer', score: 88, date: '2026-08-12', status: 'matched' },
  { id: '2', company: 'Doctolib', jobTitle: 'React Developer', score: 62, date: '2026-08-10', status: 'review' },
  { id: '3', company: 'Alan', jobTitle: 'Senior Frontend Engineer', score: 79, date: '2026-08-05', status: 'matched' },
  { id: '4', company: 'Swile', jobTitle: 'TypeScript Developer', score: 45, date: '2026-08-01', status: 'rejected' },
];

const statusVariant = { matched: 'success', review: 'warning', rejected: 'danger' } as const;

/**
 * Page template composing Dropzone, Textarea, ScoreGauge, ProgressBar and
 * DataTable. All copy follows the language selector in the toolbar.
 */
const meta: Meta = {
  title: 'Templates/CandidateDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Candidate dashboard composition: SegmentedControl, Dropzone, job description, ScoreGauge, recommendations and analysis history.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;


/**
 * Hero block: the main figure set at `text-8xl` on a lightly tinted surface.
 * The only status colours in the block are the tag and the rail fill.
 */
function ScoreHeadline({
  score,
  role,
  company,
}: {
  score: number;
  role: string;
  company: string;
}) {
  const t = useI18n().dashboard.candidate;
  const cleared = score >= SCORE_TIER_HIGH;

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
            {t.hero.kicker}
          </p>

          {/* The percent sign is smaller and lighter than the digits. */}
          <p className="mt-5 flex items-baseline gap-2">
            <span
              className={cn(
                'aq-display font-display text-8xl font-bold leading-none tracking-masthead',
                dataFigureClass,
                strongTextClass
              )}
            >
              {score}
            </span>
            <span
              className={cn(
                'aq-display font-display text-4xl font-bold leading-none',
                mutedTextClass
              )}
            >
              %
            </span>
          </p>

          <p className={cn('mt-5 text-lg', subtleTextClass)}>
            {t.hero.against}{' '}
            <span className={cn('font-semibold', strongTextClass)}>{role}</span>
            <span className={mutedTextClass}> · {company}</span>
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Threshold ticks at both tier boundaries, each with a label. */}
          <div>
            <div
              className="relative h-3 w-full overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800"
              role="img"
              aria-label={t.hero.railLabel}
            >
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700 ease-settle motion-reduce:transition-none',
                  cleared ? 'bg-moss-600 dark:bg-moss-400' : 'bg-ochre-600 dark:bg-ochre-400'
                )}
                style={{ width: `${score}%` }}
              />
              <span
                aria-hidden="true"
                className={thresholdMarkClass}
                style={{ left: `${SCORE_TIER_MEDIUM}%` }}
              />
              <span
                aria-hidden="true"
                className={thresholdMarkClass}
                style={{ left: `${SCORE_TIER_HIGH}%` }}
              />
            </div>

            <div className="relative mt-2 h-4" aria-hidden="true">
              <span
                className={cn(
                  '-translate-x-1/2 absolute text-xs font-semibold uppercase tracking-eyebrow',
                  dataFigureClass,
                  mutedTextClass
                )}
                style={{ left: `${SCORE_TIER_MEDIUM}%` }}
              >
                {t.hero.scaleReview}
              </span>
              <span
                className={cn(
                  '-translate-x-1/2 absolute text-xs font-semibold uppercase tracking-eyebrow',
                  dataFigureClass,
                  subtleTextClass
                )}
                style={{ left: `${SCORE_TIER_HIGH}%` }}
              >
                {t.hero.scaleBar}
              </span>
            </div>
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
function SectionHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-6">
      <div className="flex flex-wrap items-end justify-between gap-3 pb-3">
        <div>
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
        {action}
      </div>
      <span className={mastheadRuleClass} aria-hidden="true" />
    </header>
  );
}

function CandidateDashboardPage() {
  const t = useI18n();
  const [workspace, setWorkspace] = useState('candidate');

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
      {/*
         Page header: brand line, title in the display face and the workspace
         switch, above a divider.
       */}
      <header className="mx-auto max-w-6xl px-4 pb-4 pt-6 sm:px-6 sm:pt-8">
        <div className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-700 dark:text-brand-300">
              {t.dashboard.candidate.brand}
            </p>
            <h1
              className={cn(
                'aq-display mt-1 font-display text-4xl font-bold tracking-tight sm:text-5xl',
                strongTextClass
              )}
            >
              {t.dashboard.candidate.title}
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

      <ScoreHeadline
        score={88}
        role={t.dashboard.candidate.analysis.job.value}
        company={t.dashboard.candidate.analysis.company.value}
      />

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-14">
          <section>
            <SectionHead
              title={t.dashboard.candidate.analysis.title}
              subtitle={t.dashboard.candidate.analysis.subtitle}
            />
            <div>
              <div className="overflow-visible">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="flex flex-col">
                    <p className="mb-3 text-xs font-semibold text-ink-700 dark:text-ink-200">
                      {t.dashboard.candidate.analysis.resumeLabel}
                    </p>
                    <Dropzone
                      labels={t.components.dropzone}
                      maxSizeMB={5}
                      accept=".pdf"
                      /*
                        The dashed area is the Dropzone `<label>`; it fills the
                        column so both grid columns end at the same height.
                      */
                      className="flex-1 [&>label]:h-full [&>label]:min-h-[200px]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input
                        id="company-name"
                        label={t.dashboard.candidate.analysis.company.label}
                        defaultValue={t.dashboard.candidate.analysis.company.value}
                        placeholder={t.dashboard.candidate.analysis.company.placeholder}
                      />
                      <Input
                        id="job-title"
                        label={t.dashboard.candidate.analysis.job.label}
                        defaultValue={t.dashboard.candidate.analysis.job.value}
                        placeholder={t.dashboard.candidate.analysis.job.placeholder}
                      />
                    </div>

                    <div className="mt-4">
                      <Textarea
                        id="job-description"
                        label={t.dashboard.candidate.analysis.description.label}
                        placeholder={t.dashboard.candidate.analysis.description.placeholder}
                        helperText={t.dashboard.candidate.analysis.description.helper}
                        defaultValue={t.dashboard.candidate.analysis.description.value}
                        maxLength={2000}
                        rows={6}
                      />
                    </div>

                    <Button variant="ai" size="lg" className="mt-5 w-full">
                      <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                      {t.dashboard.candidate.analysis.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Card variant="ai" className="mt-10">
              <Card.Header
                title={t.dashboard.candidate.advice.title}
                subtitle={t.dashboard.candidate.advice.subtitle}
                /* The `ai` badge labels the card's content as generated. */
                action={
                  <Badge variant="ai" size="sm">
                    {t.dashboard.candidate.advice.badge}
                  </Badge>
                }
              />
              <Card.Body className="space-y-3">
                <p className={cn('text-sm leading-relaxed', bodyTextClass)}>
                  {t.dashboard.candidate.advice.body}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" icon="check">
                    React / Next.js
                  </Badge>
                  <Badge variant="success" icon="check">
                    TypeScript
                  </Badge>
                  <Badge variant="danger" icon="cross">
                    Vitest
                  </Badge>
                </div>
              </Card.Body>
              <Card.Footer>
                <span className="text-xs text-ink-500 dark:text-ink-300">{t.dashboard.candidate.advice.meta}</span>
                <Button variant="ghost" size="sm">
                  {t.dashboard.candidate.advice.action}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </Card.Footer>
            </Card>
          </section>

          {/*
             The gauge and the progress bar are their own surfaces, so the aside
             is not wrapped in a card.
           */}
          <aside className="flex flex-col gap-10">
            <div className="flex flex-col items-center gap-3">
              <ScoreGauge
                score={88}
                size="md"
                label={t.dashboard.candidate.score.label}
                statusLabels={t.components.gaugeStatus}
                className="w-full"
              />
              <p className={cn('text-center text-sm', subtleTextClass)}>
                {t.dashboard.candidate.score.status}
              </p>
            </div>

            <div>
              <SectionHead title={t.dashboard.candidate.quota.title} />
              <div>
                <ProgressBar
                  value={3}
                  max={10}
                  label={t.dashboard.candidate.quota.label}
                  icon={<Zap className="h-4 w-4 fill-brand-600/20 text-brand-600 dark:text-brand-300" />}
                  formatValue={(value, max) =>
                    `${value} / ${max} ${t.dashboard.candidate.quota.unit}`
                  }
                  helperText={t.dashboard.candidate.quota.helper}
                  action={
                    <Button variant="ghost" size="sm">
                      {t.dashboard.candidate.quota.action}
                    </Button>
                  }
                />
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-14">
          <SectionHead
            title={t.dashboard.candidate.history.title}
            subtitle={t.dashboard.candidate.history.subtitle}
          />
          <DataTable
              data={recentAnalyses}
              keyExtractor={(item) => item.id}
              labels={t.components.dataTable}
              columns={[
                {
                  /*
                    Free-text column: opts back into wrapping so the remaining
                    columns stay visible at 375px.
                  */
                  header: t.dashboard.candidate.history.columns.position,
                  className: 'whitespace-normal min-w-[9rem]',
                  cell: (item) => (
                    <div className="flex items-start space-x-2 font-medium text-ink-900 dark:text-ink-100">
                      <Briefcase
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600 dark:text-brand-300"
                        aria-hidden="true"
                      />
                      <span>
                        {item.company} — {item.jobTitle}
                      </span>
                    </div>
                  ),
                },
                {
                  header: t.dashboard.candidate.history.columns.score,
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
                  header: t.dashboard.candidate.history.columns.status,
                  cell: (item) => (
                    <Badge variant={statusVariant[item.status]} size="sm">
                      {t.dashboard.statuses[item.status]}
                    </Badge>
                  ),
                },
                {
                  header: t.dashboard.candidate.history.columns.date,
                  accessorKey: 'date',
                  className: 'hidden sm:table-cell',
                },
                {
                  header: t.dashboard.candidate.history.columns.action,
                  cell: () => (
                    <Button variant="ghost" size="sm">
                      {t.dashboard.candidate.history.action}
                      <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                    </Button>
                  ),
                },
              ]}
            pagination={{ currentPage: 1, totalPages: 2, onPageChange: () => undefined }}
          />
        </section>
      </main>
    </div>
  );
}

export const Default: Story = {
  render: () => <CandidateDashboardPage />,
};

/**
 * Mobile view — single column grid, company and role fields stacked.
 *
 * Open it in the **Canvas** tab: Storybook locks the viewport to Responsive on
 * documentation pages, so the preview below renders full width. The viewport is
 * applied for real in the Canvas and in the Vitest run.
 */
export const OnMobile: Story = {
  render: () => <CandidateDashboardPage />,
  globals: {
    viewport: { value: 'mobile', isRotated: false },
  },
};

/**
 * Tablet view — company and role fields side by side (sm), main grid still on a
 * single column until lg.
 *
 * Canvas tab as well: documentation pages ignore the story viewport.
 */
export const OnTablet: Story = {
  render: () => <CandidateDashboardPage />,
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
};
