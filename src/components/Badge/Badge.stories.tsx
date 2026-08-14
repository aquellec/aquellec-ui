import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Badge } from './Badge';

/**
 * Compact label for a status, a category or an extracted value.
 * Semantic variants (`success`, `danger`, `warning`, `ai`) make scanning easier.
 */
const meta: Meta<typeof Badge> = {
  title: 'Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  /*
    Mirrors the defaults declared by the component, so the controls open on the
    real state instead of an empty selection. Story args still take precedence.
  */
  args: { variant: 'neutral', size: 'md', icon: 'none' },
  argTypes: {
    variant: { control: 'select', options: ['success', 'danger', 'warning', 'neutral', 'ai'] },
    size: { control: 'radio', options: ['sm', 'md'] },
    icon: { control: 'select', options: ['none', 'check', 'cross', 'warning', 'ai'] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Success: Story = {
  render: (args) => {
    const t = useI18n();
    return <Badge {...args}>{t.badge.inStock}</Badge>;
  },
  args: { variant: 'success', icon: 'check' },
};

export const Danger: Story = {
  render: (args) => {
    const t = useI18n();
    return <Badge {...args}>{t.badge.outOfStock}</Badge>;
  },
  args: { variant: 'danger', icon: 'cross' },
};

export const Warning: Story = {
  render: (args) => {
    const t = useI18n();
    return <Badge {...args}>{t.badge.lowStock}</Badge>;
  },
  args: { variant: 'warning', icon: 'warning' },
};

export const AISuggested: Story = {
  render: (args) => {
    const t = useI18n();
    return <Badge {...args}>{t.badge.aiSuggested}</Badge>;
  },
  args: { variant: 'ai', icon: 'ai' },
};

export const Neutral: Story = {
  render: (args) => {
    const t = useI18n();
    return <Badge {...args}>{t.badge.draft}</Badge>;
  },
  args: { variant: 'neutral', icon: 'none' },
};

/** Status set of a product catalog — the most common use case. */
export const StatusSet: Story = {
  render: () => {
    const t = useI18n();
    return (
      <div className="flex flex-wrap gap-2">
        <Badge variant="success" icon="check">
          {t.badge.inStock}
        </Badge>
        <Badge variant="warning" icon="warning">
          {t.badge.lowStock}
        </Badge>
        <Badge variant="danger" icon="cross">
          {t.badge.outOfStock}
        </Badge>
        <Badge variant="neutral">{t.badge.draft}</Badge>
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => {
    const t = useI18n();
    return (
      <div className="flex flex-wrap gap-2">
        <Badge variant="success" icon="check" size="sm">
          {t.badge.ok}
        </Badge>
        <Badge variant="danger" icon="cross">
          {t.badge.error}
        </Badge>
        <Badge variant="warning" icon="warning">
          {t.badge.warning}
        </Badge>
        <Badge variant="neutral" icon="none">
          {t.badge.neutral}
        </Badge>
        <Badge variant="ai" icon="ai">
          {t.badge.ai}
        </Badge>
      </div>
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    for (const label of [t.badge.ok, t.badge.error, t.badge.warning, t.badge.neutral, t.badge.ai]) {
      await expect(canvas.getByText(label)).toBeInTheDocument();
    }
  },
};
