import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

/**
 * Étiquette compacte pour afficher un statut, une compétence ou un extrait IA.
 * Les variantes sémantiques (`success`, `danger`, `warning`, `ai`) facilitent le scan visuel.
 */
const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'danger', 'warning', 'neutral', 'ai'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
    },
    icon: {
      control: 'select',
      options: ['none', 'check', 'cross', 'warning', 'ai'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const SkillMatched: Story = {
  args: {
    children: 'TypeScript',
    variant: 'success',
    icon: 'check',
  },
};

export const SkillMissing: Story = {
  args: {
    children: 'Vitest / Jest',
    variant: 'danger',
    icon: 'cross',
  },
};

export const SkillRecommended: Story = {
  args: {
    children: 'Docker',
    variant: 'warning',
    icon: 'warning',
  },
};

export const AIExtracted: Story = {
  args: {
    children: 'React 19 / Next.js',
    variant: 'ai',
    icon: 'ai',
  },
};

export const Neutral: Story = {
  args: {
    children: 'CDI — Temps plein',
    variant: 'neutral',
    icon: 'none',
  },
};
