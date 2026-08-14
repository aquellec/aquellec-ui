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
import { getScoreTextClass } from '../../lib/score-tier';
import { cn } from '../../lib/cn';

interface CandidateAnalysis {
  id: string;
  company: string;
  jobTitle: string;
  score: number;
  date: string;
  status: keyof Dictionary['dashboard']['statuses'];
}

/* Les noms d'entreprise et intitulés de poste ne sont pas traduits : ce sont
   des données, pas de l'interface. Seuls statuts et en-têtes le sont. */
const recentAnalyses: CandidateAnalysis[] = [
  { id: '1', company: 'Vercel', jobTitle: 'Front-End Engineer', score: 88, date: '2026-08-12', status: 'matched' },
  { id: '2', company: 'Doctolib', jobTitle: 'React Developer', score: 62, date: '2026-08-10', status: 'review' },
  { id: '3', company: 'Alan', jobTitle: 'Senior Frontend Engineer', score: 79, date: '2026-08-05', status: 'matched' },
  { id: '4', company: 'Swile', jobTitle: 'TypeScript Developer', score: 45, date: '2026-08-01', status: 'rejected' },
];

const statusVariant = { matched: 'success', review: 'warning', rejected: 'danger' } as const;

/**
 * Page template candidat : import de CV, fiche de poste, score ATS et historique.
 * Toute la copie suit le sélecteur de langue de la barre d'outils.
 */
const meta: Meta = {
  title: 'Templates/CandidateDashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Composition dashboard candidat : SegmentedControl, Dropzone, fiche de poste, ScoreGauge, recommandations et historique des analyses.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function CandidateDashboardPage() {
  const t = useI18n();
  const [workspace, setWorkspace] = useState('candidate');

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
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {t.dashboard.candidate.brand}
            </p>
            <h1 className="text-xl font-bold text-slate-900">{t.dashboard.candidate.title}</h1>
          </div>
          <SegmentedControl
            options={workspaceOptions}
            value={workspace}
            onChange={setWorkspace}
            ariaLabel={t.dashboard.workspaceLabel}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <section className="space-y-6">
            <Card>
              <Card.Header
                title={t.dashboard.candidate.analysis.title}
                subtitle={t.dashboard.candidate.analysis.subtitle}
              />
              <Card.Body className="overflow-visible pb-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="flex flex-col">
                    <p className="mb-3 text-xs font-semibold text-slate-700">
                      {t.dashboard.candidate.analysis.resumeLabel}
                    </p>
                    <Dropzone
                      labels={t.components.dropzone}
                      maxSizeMB={5}
                      accept=".pdf"
                      className="min-h-[280px] [&>div]:min-h-[240px]"
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

                    <Button variant="ai" className="mt-4 w-full">
                      <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                      {t.dashboard.candidate.analysis.cta}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card variant="ai">
              <Card.Header
                title={
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-ai-600" aria-hidden="true" />
                    <span>{t.dashboard.candidate.advice.title}</span>
                  </div>
                }
                subtitle={t.dashboard.candidate.advice.subtitle}
                action={
                  <Badge variant="warning" icon="warning">
                    {t.dashboard.candidate.advice.badge}
                  </Badge>
                }
              />
              <Card.Body className="space-y-3">
                <p className="text-sm text-slate-600">{t.dashboard.candidate.advice.body}</p>
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
                <span className="text-xs text-slate-500">{t.dashboard.candidate.advice.meta}</span>
                <Button variant="ghost" size="sm">
                  {t.dashboard.candidate.advice.action}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </Card.Footer>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="text-center">
              <Card.Body className="flex flex-col items-center gap-2 py-8">
                <ScoreGauge
                  score={88}
                  size="lg"
                  label={t.dashboard.candidate.score.label}
                  statusLabels={t.components.gaugeStatus}
                />
                <p className="text-sm font-medium text-emerald-700">
                  {t.dashboard.candidate.score.status}
                </p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title={t.dashboard.candidate.quota.title} />
              <Card.Body>
                <ProgressBar
                  value={3}
                  max={10}
                  label={t.dashboard.candidate.quota.label}
                  icon={<Zap className="h-4 w-4 fill-brand-600/20 text-brand-600" />}
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
              </Card.Body>
            </Card>
          </aside>
        </div>

        <Card>
          <Card.Header
            title={t.dashboard.candidate.history.title}
            subtitle={t.dashboard.candidate.history.subtitle}
          />
          <Card.Body className="p-0">
            <DataTable
              data={recentAnalyses}
              keyExtractor={(item) => item.id}
              labels={t.components.dataTable}
              columns={[
                {
                  header: t.dashboard.candidate.history.columns.position,
                  cell: (item) => (
                    <div className="flex items-center space-x-2 font-medium text-slate-900">
                      <Briefcase className="h-4 w-4 text-brand-600" aria-hidden="true" />
                      <span>
                        {item.company} — {item.jobTitle}
                      </span>
                    </div>
                  ),
                },
                {
                  header: t.dashboard.candidate.history.columns.score,
                  cell: (item) => (
                    <span className={cn('font-bold', getScoreTextClass(item.score))}>
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
                { header: t.dashboard.candidate.history.columns.date, accessorKey: 'date' },
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
          </Card.Body>
        </Card>
      </main>
    </div>
  );
}

export const Default: Story = {
  render: () => <CandidateDashboardPage />,
};

/** Vue mobile — grille 1 colonne, champs entreprise/poste empilés. */
export const OnMobile: Story = {
  render: () => <CandidateDashboardPage />,
  globals: {
    viewport: { value: 'mobile', isRotated: false },
  },
};

/** Vue tablette — transition vers la grille 2 colonnes (lg). */
export const OnTablet: Story = {
  render: () => <CandidateDashboardPage />,
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
};
