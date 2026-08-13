import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dropzone } from '../../components/Dropzone';
import { RoleToggle, type Role } from '../../components/RoleToggle';
import { DataTable } from '../../components/DataTable';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { ScoreGauge } from '../../components/ScoreGauge';
import { getScoreTextClass } from '../../lib/score-tier';
import { cn } from '../../lib/cn';
import { FileText, ExternalLink } from 'lucide-react';

interface AnalysisHistory {
  id: string;
  candidateName: string;
  jobTitle: string;
  score: number;
  date: string;
  status: 'matched' | 'review' | 'rejected';
}

const mockData: AnalysisHistory[] = [
  { id: '1', candidateName: 'Amandine Q.', jobTitle: 'Front-End Engineer', score: 88, date: '12 Août 2026', status: 'matched' },
  { id: '2', candidateName: 'Alexandre M.', jobTitle: 'Full-Stack Developer', score: 64, date: '10 Août 2026', status: 'review' },
  { id: '3', candidateName: 'Sophie L.', jobTitle: 'UI/UX Designer', score: 42, date: '08 Août 2026', status: 'rejected' },
];

/**
 * Page template recruteur : import de CVs, KPIs et historique des analyses.
 */
const meta: Meta = {
  title: 'Templates/Recruiter Dashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Composition dashboard recruteur : upload multiple, KPIs et DataTable des candidatures analysées.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function RecruiterDashboardPage() {
  const [role, setRole] = useState<Role>('recruiter');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ai-600">aquellec RH</p>
            <h1 className="text-xl font-bold text-slate-900">Pipeline de recrutement</h1>
          </div>
          <RoleToggle activeRole={role} onChange={setRole} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <Card.Body className="flex items-center gap-4 py-6">
              <ScoreGauge
                score={72}
                size="sm"
                label="Match moyen"
                isAiTheme
                showStatus={false}
                className="border-0 shadow-none p-0 bg-transparent"
              />
              <p className="text-xs text-slate-500">Sur 24 candidatures</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="py-6">
              <p className="text-2xl font-bold text-emerald-700">18</p>
              <p className="text-sm text-slate-600">Profils compatibles</p>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body className="py-6">
              <p className="text-2xl font-bold text-amber-700">6</p>
              <p className="text-sm text-slate-600">À revoir manuellement</p>
            </Card.Body>
          </Card>
        </div>

        <Card>
          <Card.Header
            title="Import massif de CVs"
            subtitle="Glissez plusieurs PDFs — analyse batch via l'API Python"
          />
          <Card.Body>
            <Dropzone multiple maxSizeMB={5} accept=".pdf" />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header
            title="Historique des analyses"
            subtitle="Tri ATS et statuts de matching"
          />
          <Card.Body className="p-0">
            <DataTable
              data={mockData}
              keyExtractor={(item) => item.id}
              columns={[
                {
                  header: 'Candidat / CV',
                  cell: (item) => (
                    <div className="flex items-center space-x-2 font-medium text-slate-900">
                      <FileText className="h-4 w-4 text-brand-600" />
                      <span>{item.candidateName}</span>
                    </div>
                  ),
                },
                { header: 'Poste visé', accessorKey: 'jobTitle' },
                {
                  header: 'Score ATS',
                  cell: (item) => (
                    <span className={cn('font-bold', getScoreTextClass(item.score))}>
                      {item.score}%
                    </span>
                  ),
                },
                {
                  header: 'Statut',
                  cell: (item) => (
                    <Badge
                      variant={
                        item.status === 'matched'
                          ? 'success'
                          : item.status === 'review'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                    >
                      {item.status === 'matched' ? 'Compatible' : item.status === 'review' ? 'À revoir' : 'Faible'}
                    </Badge>
                  ),
                },
                { header: 'Date', accessorKey: 'date' },
                {
                  header: 'Action',
                  cell: () => (
                    <Button variant="ghost" size="sm">
                      Rapport <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  ),
                },
              ]}
              pagination={{
                currentPage: 1,
                totalPages: 3,
                onPageChange: () => undefined,
              }}
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
