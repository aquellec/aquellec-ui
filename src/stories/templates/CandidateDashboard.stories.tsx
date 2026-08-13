import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Dropzone } from '../../components/Dropzone';
import { RoleToggle, type Role } from '../../components/RoleToggle';
import { ScoreGauge } from '../../components/ScoreGauge';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { UsageBar } from '../../components/UsageBar';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * Page template candidat : upload de CV, score ATS et recommandations.
 */
const meta: Meta = {
  title: 'Templates/Candidate Dashboard',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Composition dashboard candidat : RoleToggle, Dropzone, ScoreGauge et carte de recommandations.',
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

      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-8 lg:grid-cols-[1fr_280px]">
        <section className="space-y-6">
          <Card>
            <Card.Header
              title="Importer votre CV"
              subtitle="Analyse ATS instantanée — format PDF uniquement"
            />
            <Card.Body>
              <Dropzone maxSizeMB={5} accept=".pdf" />
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
              action={<Badge variant="warning" icon="warning">3 conseils</Badge>}
            />
            <Card.Body className="space-y-3">
              <p className="text-sm text-slate-600">
                Ajoutez des mots-clés relatifs aux tests (Vitest, Cypress) pour améliorer votre score
                auprès des recruteurs.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" icon="check">React / Next.js</Badge>
                <Badge variant="success" icon="check">TypeScript</Badge>
                <Badge variant="danger" icon="cross">Vitest</Badge>
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
      </main>
    </div>
  );
}

export const Default: Story = {
  render: () => <CandidateDashboardPage />,
};
