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
 * Page template recruteur : import massif de CV, KPI et historique des analyses.
 * Toute la copie suit le sélecteur de langue de la barre d'outils.
 */
const meta: Meta = {
  title: 'Templates/RecruiterDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Composition dashboard recruteur : upload multiple, KPI et DataTable des candidatures analysées.',
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
      icon: <User className="h-3.5 w-3.5 text-brand-600" />,
    },
    {
      value: 'recruiter',
      label: t.segmented.workspace.recruiter,
      icon: <Briefcase className="h-3.5 w-3.5 text-ai-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ai-600">
              {t.dashboard.recruiter.brand}
            </p>
            <h1 className="text-xl font-bold text-slate-900">{t.dashboard.recruiter.title}</h1>
          </div>
          <SegmentedControl
            options={workspaceOptions}
            value={workspace}
            onChange={setWorkspace}
            ariaLabel={t.dashboard.workspaceLabel}
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <Card.Body className="flex items-center gap-4 py-6">
              <ScoreGauge
                score={72}
                size="sm"
                label={t.dashboard.recruiter.kpi.matchLabel}
                statusLabels={t.components.gaugeStatus}
                isAiTheme
                showStatus={false}
                className="border-0 bg-transparent p-0 shadow-none"
              />
              <p className="text-xs text-slate-500">{t.dashboard.recruiter.kpi.matchCaption}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="py-6">
              <p className="text-2xl font-bold text-emerald-700">18</p>
              <p className="text-sm text-slate-600">{t.dashboard.recruiter.kpi.compatible}</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="py-6">
              <p className="text-2xl font-bold text-amber-700">6</p>
              <p className="text-sm text-slate-600">{t.dashboard.recruiter.kpi.toReview}</p>
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
              columns={[
                {
                  header: t.dashboard.recruiter.history.columns.candidate,
                  cell: (item) => (
                    <div className="flex items-center space-x-2 font-medium text-slate-900">
                      <FileText className="h-4 w-4 text-brand-600" aria-hidden="true" />
                      <span>{item.candidateName}</span>
                    </div>
                  ),
                },
                { header: t.dashboard.recruiter.history.columns.job, accessorKey: 'jobTitle' },
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
                { header: t.dashboard.recruiter.history.columns.date, accessorKey: 'date' },
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
          </Card.Body>
        </Card>
      </main>
    </div>
  );
}

export const Default: Story = {
  render: () => <RecruiterDashboardPage />,
};

export const OnMobile: Story = {
  render: () => <RecruiterDashboardPage />,
  globals: {
    viewport: { value: 'mobile', isRotated: false },
  },
};

export const OnTablet: Story = {
  render: () => <RecruiterDashboardPage />,
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
};
