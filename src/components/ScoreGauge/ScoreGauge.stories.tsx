import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { ScoreGauge } from './ScoreGauge';

/**
 * Jauge circulaire pour un score sur 100 : performance, qualité, correspondance.
 * La couleur suit le seuil (≥75 vert, ≥50 ambre, sinon rose) ; `isAiTheme`
 * bascule sur la teinte générative.
 *
 * Exposée en `role="meter"`, la valeur est donc annoncée comme telle.
 */
const meta: Meta<typeof ScoreGauge> = {
  title: 'Data Display/ScoreGauge',
  component: ScoreGauge,
  tags: ['autodocs'],
  argTypes: {
    score: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    isAiTheme: { control: 'boolean' },
    showStatus: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ScoreGauge>;

export const HighScore: Story = {
  render: (args) => {
    const t = useI18n();
    return <ScoreGauge {...args} label={t.gauge.performance} />;
  },
  args: { score: 88, size: 'md' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meter = canvas.getByRole('meter');

    await expect(meter).toHaveAttribute('aria-valuenow', '88');
    await expect(meter).toHaveAttribute('aria-valuemax', '100');
  },
};

export const MediumScore: Story = {
  render: (args) => {
    const t = useI18n();
    return <ScoreGauge {...args} label={t.gauge.quality} />;
  },
  args: { score: 62, size: 'md' },
};

export const LowScore: Story = {
  render: (args) => {
    const t = useI18n();
    return <ScoreGauge {...args} label={t.gauge.health} />;
  },
  args: { score: 35, size: 'md' },
};

export const AITheme: Story = {
  render: (args) => {
    const t = useI18n();
    return <ScoreGauge {...args} label={t.gauge.match} />;
  },
  args: { score: 94, size: 'lg', isAiTheme: true },
};

/** Bornes : la valeur est normalisée entre 0 et 100 avant tout rendu. */
export const Bounds: Story = {
  render: () => {
    const t = useI18n();
    return (
      <div className="flex flex-wrap items-center gap-6">
        <ScoreGauge score={0} size="sm" label={t.gauge.performance} showStatus={false} />
        <ScoreGauge score={100} size="sm" label={t.gauge.performance} showStatus={false} />
        <ScoreGauge score={140} size="sm" label={t.gauge.performance} showStatus={false} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [zero, hundred, overflow] = canvas.getAllByRole('meter');

    await expect(zero).toHaveAttribute('aria-valuenow', '0');
    await expect(hundred).toHaveAttribute('aria-valuenow', '100');
    // 140 doit être ramené à 100, pas rendu tel quel.
    await expect(overflow).toHaveAttribute('aria-valuenow', '100');
  },
};

/** Cas compact pour un tableau de bord : sans statut ni surface propre. */
export const CompactDashboard: Story = {
  render: (args) => {
    const t = useI18n();
    return <ScoreGauge {...args} label={t.gauge.match} />;
  },
  args: {
    score: 72,
    size: 'sm',
    isAiTheme: true,
    showStatus: false,
    className: 'border-0 shadow-none p-0 bg-transparent',
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    await expect(canvas.getByRole('meter')).toHaveAccessibleName(t.gauge.match);
  },
};
