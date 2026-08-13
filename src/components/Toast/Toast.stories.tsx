import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
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
