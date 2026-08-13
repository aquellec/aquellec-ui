import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
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

export const Disabled: Story = {
  args: {
    children: 'Action indisponible',
    disabled: true,
  },
};

export const Secondary: Story = {
  args: {
    children: 'Voir l\u2019historique',
    variant: 'secondary',
  },
};

export const Outline: Story = {
  args: {
    children: 'Exporter',
    variant: 'outline',
    size: 'lg',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Annuler',
    variant: 'ghost',
    size: 'sm',
  },
};

export const ClickInteraction: Story = {
  args: {
    children: 'Lancer l\u2019analyse',
    variant: 'primary',
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Lancer l.analyse/i }));
    await expect(args.onClick).toHaveBeenCalled();
  },
};
