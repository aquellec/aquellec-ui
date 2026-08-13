import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Sparkles } from 'lucide-react';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const InteractiveExample: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-4">
        <Button variant="ai" onClick={() => setIsOpen(true)}>
          <Sparkles className="w-4 h-4 mr-2" />
          Voir le rapport d&apos;analyse
        </Button>

        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          maxWidth="lg"
          title="Détails du Matching ATS"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                Fermer
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
                Télécharger le PDF
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p>
              Voici le diagnostic détaillé calculé par l&apos;API Python pour la candidature au poste de{' '}
              <strong className="text-slate-800">Front-End Engineer</strong> :
            </p>
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-200/60">
              <h4 className="text-xs font-semibold text-slate-700">Mots-clés requis détectés :</h4>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="success" icon="check">React / Next.js</Badge>
                <Badge variant="success" icon="check">TypeScript</Badge>
                <Badge variant="success" icon="check">Tailwind CSS</Badge>
                <Badge variant="danger" icon="cross">Vitest / Jest</Badge>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};
