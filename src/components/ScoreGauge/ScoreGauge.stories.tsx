import type { Meta, StoryObj } from '@storybook/react-vite';
import { ScoreGauge } from './ScoreGauge';

/**
 * Jauge circulaire de score ATS ou de matching IA. La couleur évolue selon le seuil
 * (≥75 vert, ≥50 ambre, sinon rose) ; activez `isAiTheme` pour les métriques génératives.
 */
const meta: Meta<typeof ScoreGauge> = {
  title: 'Data Display/ScoreGauge',
  component: ScoreGauge,
  tags: ['autodocs'],
  argTypes: {
    score: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    isAiTheme: { control: 'boolean' },
    showStatus: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ScoreGauge>;

export const HighScore: Story = {
  args: {
    score: 88,
    size: 'md',
    label: 'Score ATS',
  },
};

export const MediumScore: Story = {
  args: {
    score: 62,
    size: 'md',
    label: 'Score ATS',
  },
};

export const LowScore: Story = {
  args: {
    score: 35,
    size: 'md',
    label: 'Score ATS',
  },
};

export const AITheme: Story = {
  args: {
    score: 94,
    size: 'lg',
    label: 'Match global',
    isAiTheme: true,
  },
};

/** Cas compact dashboard recruteur — score 72 % + libellé court en taille sm. */
export const CompactDashboard: Story = {
  args: {
    score: 72,
    size: 'sm',
    label: 'Match moyen',
    isAiTheme: true,
    showStatus: false,
    className: 'border-0 shadow-none p-0 bg-transparent',
  },
};
