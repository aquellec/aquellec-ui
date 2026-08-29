import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ArrowRight, Sparkles } from 'lucide-react';
import { withPageTitle } from '../../../.storybook/story-shell';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Card } from './Card';
import { Button } from '../Button';
import { Badge } from '../Badge';

/**
 * Structured container grouping content, actions and metadata.
 * Composes `Card.Header`, `Card.Body` and `Card.Footer`.
 */
const meta: Meta<typeof Card> = {
  title: 'Data Display/Card',
  component: Card,
  tags: ['autodocs'],
  decorators: [withPageTitle('Card')],
  /*
    Mirrors the defaults declared by the component, so the controls open on the
    real state instead of an empty selection. Story args still take precedence.
  */
  args: { variant: 'default' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'ai', 'ghost'] },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <Card {...args} className="max-w-md">
        <Card.Header
          title={t.card.report.title}
          subtitle={t.card.report.subtitle}
          action={
            <Badge variant="warning" icon="warning">
              {t.card.report.badge}
            </Badge>
          }
        />
        <Card.Body>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{t.card.report.body}</p>
        </Card.Body>
        <Card.Footer>
          <span>
            {t.card.report.meta} : {t.common.today}
          </span>
          <Button variant="ghost" size="sm">
            {t.card.report.action} <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </Card.Footer>
      </Card>
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);
    const heading = canvas.getByRole('heading', { level: 2, name: t.card.report.title });
    const card = heading.closest('[aria-labelledby]');

    await expect(canvas.getByRole('heading', { level: 1, name: 'Card' })).toBeInTheDocument();
    await expect(card).toHaveAttribute('aria-labelledby', heading.id);
  },
};

export const AICard: Story = {
  render: () => {
    const t = useI18n();
    return (
      <Card variant="ai" className="max-w-md">
        <Card.Header
          title={
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ai-600 dark:text-ai-300" aria-hidden="true" />
              <span>{t.card.ai.title}</span>
            </div>
          }
          subtitle={t.card.ai.subtitle}
        />
        <Card.Body>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">{t.card.ai.body}</p>
        </Card.Body>
        <Card.Footer>
          <Badge variant="ai" icon="ai">
            {t.card.ai.confidence}
          </Badge>
          <Button variant="ai" size="sm">
            {t.card.ai.action}
          </Button>
        </Card.Footer>
      </Card>
    );
  },
};

export const OutlineCard: Story = {
  render: () => {
    const t = useI18n();
    return (
      <Card variant="outline" className="max-w-md">
        <Card.Header title={t.card.plan.title} subtitle={t.card.plan.subtitle} />
        <Card.Body>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{t.card.plan.body}</p>
        </Card.Body>
      </Card>
    );
  },
};

export const GhostCard: Story = {
  render: () => {
    const t = useI18n();
    return (
      <Card variant="ghost" className="max-w-md">
        <Card.Header title={t.card.tip.title} />
        <Card.Body>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{t.card.tip.body}</p>
        </Card.Body>
      </Card>
    );
  },
};

export const SemanticTitle: Story = {
  render: () => {
    const t = useI18n();
    return (
      <Card className="max-w-md">
        <Card.Header title={t.card.section.title} titleAs="h2" subtitle={t.card.section.subtitle} />
        <Card.Body>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">{t.card.section.body}</p>
        </Card.Body>
      </Card>
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    await expect(
      canvas.getByRole('heading', { level: 2, name: t.card.section.title })
    ).toBeInTheDocument();
  },
};

export const HeaderOnly: Story = {
  render: () => {
    const t = useI18n();
    return (
      <Card className="max-w-md">
        <Card.Header title={t.card.minimal.title} />
        <Card.Body>{t.card.minimal.body}</Card.Body>
      </Card>
    );
  },
};
