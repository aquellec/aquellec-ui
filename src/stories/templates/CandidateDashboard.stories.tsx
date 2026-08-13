import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dropzone } from '../../components/Dropzone';
import { RoleToggle, type Role } from '../../components/RoleToggle';
import { ScoreGauge } from '../../components/ScoreGauge';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { UsageBar } from '../../components/UsageBar';
import { Textarea } from '../../components/Textarea';
import { DataTable } from '../../components/DataTable';
import { Sparkles, ArrowRight, Briefcase } from 'lucide-react';
import { cn } from '../../lib/cn';
import { focusRing } from '../../lib/focus-ring';

interface CandidateAnalysis {
  id: string;
  company: string;
  jobTitle: string;
  score: number;
  date: string;
  status: 'matched' | 'review' | 'rejected';
}

const recentAnalyses: CandidateAnalysis[] = [
  {
    id: '1',
    company: 'Vercel',
    jobTitle: 'Front-End Engineer',
    score: 88,
    date: '12 Août 2026',
    status: 'matched',
  },
  {
    id: '2',
    company: 'Doctolib',
    jobTitle: 'React Dev',
    score: 62,
    date: '10 Août 2026',
    status: 'review',
  },
  {
    id: '3',
    company: 'Alan',
    jobTitle: 'Senior Frontend Engineer',
    score: 79,
    date: '05 Août 2026',
    status: 'matched',
  },
  {
    id: '4',
    company: 'Swile',
    jobTitle: 'Développeur TypeScript',
    score: 45,
    date: '01 Août 2026',
    status: 'rejected',
  },
];

/**
 * Page template candidat : upload de CV, fiche de poste, score ATS et historique.
 */
const meta: Meta = {
  title: 'Templates/Candidate Dashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Composition dashboard candidat : RoleToggle, Dropzone, fiche de poste, ScoreGauge, recommandations et historique des analyses.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function CandidateDashboardPage() {
  const [role, setRole] = useState<Role>('candidate');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">aquellec</p>
            <h1 className="text-xl font-bold text-slate-900">Mon espace candidat</h1>
          </div>
          <RoleToggle activeRole={role} onChange={setRole} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <section className="space-y-6">
            <Card>
              <Card.Header
                title="Lancer une analyse ATS"
                subtitle="Importez votre CV et collez la fiche de poste visée"
              />
              <Card.Body className="overflow-visible pb-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="flex flex-col">
                    <p className="mb-3 text-xs font-semibold text-slate-700">Votre CV (PDF)</p>
                    <Dropzone
                      maxSizeMB={5}
                      accept=".pdf"
                      className="min-h-[280px] [&>div]:min-h-[240px]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="w-full min-w-0 text-left">
                        <label
                          htmlFor="company-name"
                          className="mb-1.5 block text-xs font-semibold text-slate-700 sm:whitespace-nowrap"
                        >
                          Nom de l&apos;entreprise
                        </label>
                        <input
                          id="company-name"
                          type="text"
                          defaultValue="Vercel"
                          placeholder="Ex : Vercel, Doctolib"
                          className={cn(
                            'w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 transition-all duration-150 placeholder:text-slate-400 hover:border-slate-400',
                            focusRing
                          )}
                        />
                      </div>

                      <div className="w-full min-w-0 text-left">
                        <label
                          htmlFor="job-title"
                          className="mb-1.5 block text-xs font-semibold text-slate-700 sm:whitespace-nowrap"
                        >
                          Titre du poste
                        </label>
                        <input
                          id="job-title"
                          type="text"
                          defaultValue="Front-End Engineer"
                          placeholder="Ex : Développeur Front-End Senior"
                          className={cn(
                            'w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs text-slate-800 transition-all duration-150 placeholder:text-slate-400 hover:border-slate-400',
                            focusRing
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Textarea
                        id="job-description"
                        label="Description de l'offre"
                        placeholder="Collez ici la description du poste visé..."
                        helperText="Plus la description est détaillée, plus le score ATS sera précis."
                        maxLength={2000}
                        rows={6}
                        defaultValue="Nous recherchons un(e) Développeur(se) Front-End Senior maîtrisant React, Next.js et TypeScript..."
                      />
                    </div>

                    <Button variant="ai" className="mt-4 w-full">
                      ✨ Lancer l&apos;analyse ATS
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card variant="ai">
              <Card.Header
                title={
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-ai-600" />
                    <span>Recommandations ATS</span>
                  </div>
                }
                subtitle="Optimisations suggérées pour Front-End Engineer"
                action={
                  <Badge variant="warning" icon="warning">
                    3 conseils
                  </Badge>
                }
              />
              <Card.Body className="space-y-3">
                <p className="text-sm text-slate-600">
                  Ajoutez des mots-clés relatifs aux tests (Vitest, Cypress) pour améliorer votre score
                  auprès des recruteurs.
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
                <span className="text-xs text-slate-500">Dernière analyse : aujourd&apos;hui</span>
                <Button variant="ghost" size="sm">
                  Voir détails <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Card.Footer>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card className="text-center">
              <Card.Body className="flex flex-col items-center gap-2 py-8">
                <ScoreGauge score={88} size="lg" label="Score ATS" />
                <p className="text-sm font-medium text-emerald-600">Profil compatible</p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header title="Quota mensuel" />
              <Card.Body>
                <UsageBar current={3} max={10} label="Analyses du mois" unit="CVs" />
              </Card.Body>
            </Card>
          </aside>
        </div>

        <Card>
          <Card.Header title="Mes analyses récentes" subtitle="Historique de vos matchings ATS" />
          <Card.Body className="p-0">
            <DataTable
              data={recentAnalyses}
              keyExtractor={(item) => item.id}
              columns={[
                {
                  header: 'Entreprise — Poste',
                  cell: (item) => (
                    <div className="flex items-center space-x-2 font-medium text-slate-900">
                      <Briefcase className="h-4 w-4 text-brand-600" />
                      <span>
                        {item.company} — {item.jobTitle}
                      </span>
                    </div>
                  ),
                },
                {
                  header: 'Score ATS',
                  cell: (item) => (
                    <span
                      className={
                        item.score >= 75
                          ? 'font-bold text-emerald-600'
                          : item.score >= 50
                            ? 'font-bold text-amber-600'
                            : 'font-bold text-rose-600'
                      }
                    >
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
                      {item.status === 'matched'
                        ? 'Compatible'
                        : item.status === 'review'
                          ? 'À revoir'
                          : 'Faible'}
                    </Badge>
                  ),
                },
                { header: 'Date', accessorKey: 'date' },
                {
                  header: 'Action',
                  cell: () => (
                    <Button variant="ghost" size="sm">
                      Rapport <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  ),
                },
              ]}
              pagination={{
                currentPage: 1,
                totalPages: 2,
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
  render: () => <CandidateDashboardPage />,
};
