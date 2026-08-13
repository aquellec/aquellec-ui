import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * Conteneur structuré pour regrouper contenu, actions et métadonnées.
 * Compose `Card.Header`, `Card.Body` et `Card.Footer` pour des blocs dashboard cohérents.
 */
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ai', 'ghost'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-md">
      <Card.Header
        title="Recommandations ATS"
        subtitle="Optimisations suggérées pour la fiche de poste"
        action={<Badge variant="warning" icon="warning">3 conseils</Badge>}
      />
      <Card.Body>
        <p className="text-sm text-slate-600">
          Ajoutez davantage de mots-clés relatifs aux tests automatisés (ex: Vitest, Cypress) pour maximiser votre score auprès des recruteurs.
        </p>
      </Card.Body>
      <Card.Footer>
        <span>Dernière analyse : Aujourd&apos;hui</span>
        <Button variant="ghost" size="sm">
          Voir détails <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </Card.Footer>
    </Card>
  ),
};

export const AICard: Story = {
  render: () => (
    <Card variant="ai" className="max-w-md">
      <Card.Header
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-ai-600" />
            <span>Synthèse IA du profil</span>
          </div>
        }
        subtitle="Générée par le modèle Python Fast-API"
      />
      <Card.Body>
        <p className="text-sm text-slate-700 leading-relaxed">
          Le profil montre une solide expérience Front-End Senior avec un parti pris fort pour le Clean Code et l&apos;accessibilité UI.
        </p>
      </Card.Body>
      <Card.Footer>
        <Badge variant="ai" icon="ai">Confiance : 98%</Badge>
        <Button variant="ai" size="sm">
          Réanalyser
        </Button>
      </Card.Footer>
    </Card>
  ),
};
