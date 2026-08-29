import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Briefcase, ExternalLink, FileText, User } from 'lucide-react';
import { useI18n, type Dictionary } from '../../../.storybook/i18n';
import { Dropzone } from '../../components/Dropzone';
import { SegmentedControl } from '../../components/SegmentedControl';
import { DataTable } from '../../components/DataTable';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { ScoreGauge } from '../../components/ScoreGauge';
import { getScoreTextClass } from '../../lib/score-tier';
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
 * Recruiter page template: bulk resume import, KPIs and analysis history.
 * All copy follows the language selector in the toolbar.
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

function RecruiterDashboardPage() {
  const t = useI18n();
  const [workspace, setWorkspace] = useState('recruiter');

  const workspaceOptions = [
    {
      value: 'candidate',
      label: t.segmented.workspace.candidate,
      icon: <User className="h-3.5 w-3.5 text-brand-600 dark:text-brand-300" />,
    },
    {
      value: 'recruiter',
      label: t.segmented.workspace.recruiter,
      icon: <Briefcase className="h-3.5 w-3.5 text-ai-600 dark:text-ai-300" />,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white px-4 py-4 sm:px-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ai-600 dark:text-ai-300">
              {t.dashboard.recruiter.brand}
            </p>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{t.dashboard.recruiter.title}</h1>
          </div>
          <SegmentedControl
            options={workspaceOptions}
            value={workspace}
            onChange={setWorkspace}
            ariaLabel={t.dashboard.workspaceLabel}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-8">
        {/*
          Two KPI columns from the smallest screen: stacked, the three cards
          pushed the rest of the page below the fold for a single number each.
          The gauge keeps a full row, it is the one that needs the width.
        */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
          <Card className="col-span-2 md:col-span-1">
            <Card.Body className="flex items-center gap-4 py-4 sm:py-6">
              <ScoreGauge
                score={72}
                size="sm"
                label={t.dashboard.recruiter.kpi.matchLabel}
                statusLabels={t.components.gaugeStatus}
                isAiTheme
                showStatus={false}
                className="border-0 bg-transparent p-0 shadow-none"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.dashboard.recruiter.kpi.matchCaption}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="py-4 sm:py-6">
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">18</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{t.dashboard.recruiter.kpi.compatible}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="py-4 sm:py-6">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">6</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{t.dashboard.recruiter.kpi.toReview}</p>
            </Card.Body>
          </Card>
        </div>

        <Card>
          <Card.Header
            title={t.dashboard.recruiter.upload.title}
            subtitle={t.dashboard.recruiter.upload.subtitle}
          />
          <Card.Body>
            <Dropzone multiple labels={t.components.dropzone} maxSizeMB={5} accept=".pdf" />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title={t.dashboard.recruiter.history.title}
            subtitle={t.dashboard.recruiter.history.subtitle}
          />
          <Card.Body className="p-0">
            <DataTable
              data={mockData}
              keyExtractor={(item) => item.id}
              labels={t.components.dataTable}
              /*
                Column priority: below `sm` only candidate, score and status
                stay, the columns a recruiter scans first. The rest is one
                horizontal scroll away.
              */
              columns={[
                {
                  header: t.dashboard.recruiter.history.columns.candidate,
                  cell: (item) => (
                    <div className="flex items-center space-x-2 font-medium text-neutral-900 dark:text-neutral-100">
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
                    <span className={cn('font-bold', getScoreTextClass(item.score))}>
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
              className="border-0 shadow-none"
              pagination={{ currentPage: 1, totalPages: 3, onPageChange: () => undefined }}
            />
          </Card.Body>
        </Card>
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
