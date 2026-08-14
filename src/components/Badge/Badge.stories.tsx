import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './Badge';

/**
 * Étiquette compacte pour afficher un statut, une compétence ou un extrait IA.
 * Les variantes sémantiques (`success`, `danger`, `warning`, `ai`) facilitent le scan visuel.
 */
const meta: Meta<typeof Badge> = {
  title: 'Feedback/Badge',
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

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" icon="check" size="sm">
        OK
      </Badge>
      <Badge variant="danger" icon="cross">
        KO
      </Badge>
      <Badge variant="warning" icon="warning">
        Attention
      </Badge>
      <Badge variant="neutral" icon="none">
        Neutre
      </Badge>
      <Badge variant="ai" icon="ai">
        IA
      </Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('OK')).toBeInTheDocument();
    await expect(canvas.getByText('KO')).toBeInTheDocument();
    await expect(canvas.getByText('Attention')).toBeInTheDocument();
    await expect(canvas.getByText('Neutre')).toBeInTheDocument();
    await expect(canvas.getByText('IA')).toBeInTheDocument();
  },
};
