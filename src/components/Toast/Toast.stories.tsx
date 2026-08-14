import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { withPageTitle } from '../../../.storybook/story-shell';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './ToastProvider';
import { Button } from '../Button';

/**
 * Notification temporaire pour confirmer une action, signaler une erreur ou un quota.
 * Utilise `role="alert"` ou `role="status"` selon la variante pour l'accessibilité.
 */
const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  decorators: [withPageTitle('Toast')],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info', 'ai'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'CV importé avec succès',
    description: 'Le fichier Amandine_Quellec_CV.pdf a été analysé par le serveur.',
    onClose: () => console.log('Close clicked'),
  },
};

export const AIProcessing: Story = {
  args: {
    variant: 'ai',
    title: 'Analyse ATS terminée',
    description: '12 mots-clés correspondants trouvés. Votre score de match est de 88%.',
    onClose: () => console.log('Close clicked'),
  },
};

export const WarningLimit: Story = {
  args: {
    variant: 'warning',
    title: 'Quota bientôt atteint',
    description: 'Il ne vous reste plus que 1 crédit d\u2019analyse pour ce mois-ci.',
  },
};

export const ErrorState: Story = {
  args: {
    variant: 'error',
    title: 'Erreur lors du parsing',
    description: 'Le format du fichier fourni n\u2019est pas un PDF valide ou est corrompu.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Nouvelle fonctionnalité',
    description: 'Export PDF disponible sur le plan Pro.',
  },
};

export const TitleOnly: Story = {
  args: {
    variant: 'success',
    title: 'Analyse lancée',
  },
};

export const CloseInteraction: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return <p>Notification fermée.</p>;
    }

    return (
      <Toast
        variant="warning"
        title="Quota bientôt atteint"
        description="Il ne reste qu'un crédit."
        onClose={() => setVisible(false)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('status')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Fermer la notification' }));
    await expect(canvas.getByText('Notification fermée.')).toBeInTheDocument();
  },
};

export const ErrorAlertRole: Story = {
  args: {
    variant: 'error',
    title: 'Échec de l\u2019analyse',
    onClose: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('alert')).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Fermer la notification' }));
    await expect(args.onClose).toHaveBeenCalled();
  },
};

function ToastQueueDemo() {
  const { push } = useToast();

  return (
    <Button
      variant="primary"
      onClick={() =>
        push({
          variant: 'success',
          title: 'CV importé',
          description: 'Analyse ATS terminée avec succès.',
        })
      }
    >
      Afficher une notification
    </Button>
  );
}

export const ProviderQueue: Story = {
  render: () => (
    <ToastProvider defaultDuration={0}>
      <ToastQueueDemo />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(canvas.getByRole('button', { name: /Afficher une notification/i }));
    await expect(body.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
    await expect(body.getByText('CV importé')).toBeInTheDocument();
  },
};
