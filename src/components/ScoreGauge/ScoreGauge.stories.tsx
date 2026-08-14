import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { ScoreGauge } from './ScoreGauge';

/**
 * Circular gauge for a score out of 100: performance, quality, match rate.
 * The color follows the tier (>=75 green, >=50 amber, red below); `isAiTheme`
 * switches to the generative hue.
 *
 * Exposed as `role="meter"`, so the value is announced as one.
 */
const meta: Meta<typeof ScoreGauge> = {
  title: 'Data Display/ScoreGauge',
  component: ScoreGauge,
  tags: ['autodocs'],
  /*
    Mirrors the defaults declared by the component, so the controls open on the
    real state instead of an empty selection. Story args still take precedence.
  */
  args: { size: 'md', isAiTheme: false, showStatus: true },
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
    return <ScoreGauge {...args} statusLabels={t.components.gaugeStatus} label={t.gauge.performance} />;
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
    return <ScoreGauge {...args} statusLabels={t.components.gaugeStatus} label={t.gauge.quality} />;
  },
  args: { score: 62, size: 'md' },
};

export const LowScore: Story = {
  render: (args) => {
    const t = useI18n();
    return <ScoreGauge {...args} statusLabels={t.components.gaugeStatus} label={t.gauge.health} />;
  },
  args: { score: 35, size: 'md' },
};

export const AITheme: Story = {
  render: (args) => {
    const t = useI18n();
    return <ScoreGauge {...args} statusLabels={t.components.gaugeStatus} label={t.gauge.match} />;
  },
  args: { score: 94, size: 'lg', isAiTheme: true },
};

/** Bounds: the value is clamped between 0 and 100 before any rendering. */
export const Bounds: Story = {
  render: () => {
    const t = useI18n();
    return (
      <div className="flex flex-wrap items-center gap-6">
        <ScoreGauge score={0} size="sm" label={t.gauge.performance} showStatus={false} statusLabels={t.components.gaugeStatus} />
        <ScoreGauge score={100} size="sm" label={t.gauge.performance} showStatus={false} statusLabels={t.components.gaugeStatus} />
        <ScoreGauge score={140} size="sm" label={t.gauge.performance} showStatus={false} statusLabels={t.components.gaugeStatus} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [zero, hundred, overflow] = canvas.getAllByRole('meter');

    await expect(zero).toHaveAttribute('aria-valuenow', '0');
    await expect(hundred).toHaveAttribute('aria-valuenow', '100');
    // 140 must be clamped to 100, not rendered as is.
    await expect(overflow).toHaveAttribute('aria-valuenow', '100');
  },
};

/** Compact dashboard case: no status badge, no surface of its own. */
export const CompactDashboard: Story = {
  render: (args) => {
    const t = useI18n();
    return <ScoreGauge {...args} statusLabels={t.components.gaugeStatus} label={t.gauge.match} />;
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
