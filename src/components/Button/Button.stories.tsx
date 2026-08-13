import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

/**
 * Bouton d'action principal du design system. Utilisez `primary` pour les CTAs
 * standards, `ai` pour les workflows génératifs et `outline`/`ghost` pour les actions secondaires.
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'ai'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Analyser le CV',
    variant: 'primary',
  },
};

export const AIAction: Story = {
  args: {
    children: '✨ Générer l\u2019Analyse ATS',
    variant: 'ai',
  },
};

export const Loading: Story = {
  args: {
    children: 'Analyse en cours...',
    isLoading: true,
  },
};
