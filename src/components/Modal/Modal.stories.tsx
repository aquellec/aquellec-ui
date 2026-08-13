import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { withPageTitle } from '../../../.storybook/story-shell';
import { Modal } from './Modal';
import { Button } from '../Button';
import { Badge } from '../Badge';
import { Sparkles } from 'lucide-react';

/**
 * Dialogue modal accessible pour afficher rapports ATS, confirmations ou formulaires.
 * Fermeture via Escape, overlay ou bouton ; titre relié via `aria-labelledby`.
 */
const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  decorators: [withPageTitle('Modal')],
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
              <h3 className="text-xs font-semibold text-slate-700">Mots-clés requis détectés :</h3>
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole('button', { name: /Voir le rapport d'analyse/i }));
    await expect(body.getByRole('dialog')).toBeInTheDocument();
    await expect(body.getByText('Détails du Matching ATS')).toBeInTheDocument();

    await userEvent.click(body.getByRole('button', { name: 'Fermer' }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const CloseWithEscape: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirmation">
        Souhaitez-vous lancer l&apos;analyse ?
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);

    await expect(body.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const CloseOnOverlayClick: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Fermeture overlay">
        Cliquez en dehors pour fermer.
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);

    await expect(body.getByRole('dialog')).toBeInTheDocument();
    const overlay = body.getByRole('dialog').parentElement?.firstElementChild as HTMLElement;
    await userEvent.click(overlay);
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const FocusTrapInteraction: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Navigation clavier"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
              Valider
            </Button>
          </>
        }
      >
        Contenu du dialogue avec piège de focus.
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);
    const dialog = body.getByRole('dialog');

    await expect(dialog).toBeInTheDocument();
    await expect(body.getByRole('button', { name: 'Fermer la fenêtre' })).toHaveFocus();

    await userEvent.tab();
    await expect(body.getByRole('button', { name: 'Annuler' })).toHaveFocus();

    await userEvent.tab();
    await expect(body.getByRole('button', { name: 'Valider' })).toHaveFocus();

    await userEvent.tab();
    await expect(body.getByRole('button', { name: 'Fermer la fenêtre' })).toHaveFocus();

    await userEvent.tab({ shift: true });
    await expect(body.getByRole('button', { name: 'Valider' })).toHaveFocus();
  },
};

export const WithoutTitle: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        ariaLabel="Dialogue sans titre explicite"
      >
        Dialogue sans titre explicite.
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);
    const dialog = body.getByRole('dialog');

    await expect(dialog).toBeInTheDocument();
    await expect(dialog).toHaveAccessibleName('Dialogue sans titre explicite');
    await expect(within(dialog).queryByRole('heading')).not.toBeInTheDocument();
  },
};

export const CloseWithHeaderButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Rapport ATS">
        Contenu du rapport.
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);

    await userEvent.click(body.getByRole('button', { name: 'Fermer la fenêtre' }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const NoFocusableElements: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="xl"
        ariaLabel="Contenu sans élément focusable"
      >
        <p>Contenu sans élément focusable.</p>
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);

    await expect(body.getByRole('dialog')).toBeInTheDocument();
    await userEvent.keyboard('{Tab}');
    await userEvent.keyboard('{Escape}');
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const CompoundComponents: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const titleId = useId();

    return (
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="md" labelledBy={titleId}>
        <Modal.Header title="En-tête composé" titleId={titleId} onClose={() => setIsOpen(false)} />
        <Modal.Body>Corps via sous-composant.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    );
  },
  play: async () => {
    const body = within(document.body);

    await expect(body.getByText('En-tête composé')).toBeInTheDocument();
    await userEvent.click(body.getByRole('button', { name: 'OK' }));
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
  },
};
