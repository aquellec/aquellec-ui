import type { Meta, StoryObj } from '@storybook/react-vite';
import { HardDrive, Users, Zap } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Button } from '../Button';
import { ProgressBar } from './ProgressBar';

/**
 * Generic progress bar: quota, consumption, fill level.
 * No copy is hardcoded — label, counter, helper and action are all props.
 * The color switches at configurable thresholds (amber 75%, red 90% by default).
 */
const meta: Meta<typeof ProgressBar> = {
  title: 'Data Display/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'number', min: 0 } },
    max: { control: { type: 'number', min: 0 } },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  render: (args) => {
    const t = useI18n();
    return <ProgressBar {...args} label={t.progress.credits.label} />;
  },
  args: { value: 3, max: 10 },
};

/** Past 75%, the bar turns amber. */
export const WarningLevel: Story = {
  render: (args) => {
    const t = useI18n();
    return <ProgressBar {...args} label={t.progress.credits.label} />;
  },
  args: { value: 8, max: 10 },
};

/** Past 90%, it turns red. */
export const NearLimit: Story = {
  render: (args) => {
    const t = useI18n();
    return <ProgressBar {...args} label={t.progress.credits.label} />;
  },
  args: { value: 9.5, max: 10 },
};

/** The counter accepts a custom rendering through `formatValue`. */
export const CustomFormat: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <ProgressBar
        {...args}
        label={t.progress.storage.label}
        icon={<HardDrive className="h-4 w-4 text-brand-600 dark:text-brand-300" />}
        formatValue={(value, max) => `${value} ${t.progress.storage.unit} ${max}`}
      />
    );
  },
  args: { value: 42, max: 50 },
};

/** Team seats: same component, an entirely different domain. */
export const TeamSeats: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <ProgressBar
        {...args}
        label={t.progress.seats.label}
        icon={<Users className="h-4 w-4 text-brand-600 dark:text-brand-300" />}
      />
    );
  },
  args: { value: 4, max: 5 },
};

/** `helperText` and `action` replace any hardcoded conversion block. */
export const WithAction: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <ProgressBar
        {...args}
        label={t.progress.credits.label}
        icon={<Zap className="h-4 w-4 fill-brand-600/20 text-brand-600 dark:fill-brand-400/20 dark:text-brand-300" />}
        helperText={t.progress.credits.helperNearLimit}
        action={
          <Button variant="ghost" size="sm">
            {t.progress.credits.action}
          </Button>
        }
      />
    );
  },
  args: { value: 9, max: 10 },
};

/**
 * Without a visible label or action, for a compact integration.
 * `ariaLabel` stays mandatory: an unnamed `progressbar` is an axe violation
 * (`aria-progressbar-name`), which the test suite checks.
 */
export const BarOnly: Story = {
  render: (args) => {
    const t = useI18n();
    return <ProgressBar {...args} ariaLabel={t.progress.processing} />;
  },
  args: { value: 30, max: 100 },
};

/** A zero `max` must produce neither a division by zero nor an invalid `aria-valuenow`. */
export const ZeroMax: Story = {
  render: (args) => {
    const t = useI18n();
    return <ProgressBar {...args} label={t.progress.undefined.label} />;
  },
  args: { value: 0, max: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar');

    await expect(bar).toHaveAttribute('aria-valuenow', '0');
    await expect(bar).toHaveAttribute('aria-valuetext', '0%');
  },
};

export const ActionInteraction: Story = {
  render: (args) => {
    const t = useI18n();
    const onUpgrade = fn();
    return (
      <ProgressBar
        {...args}
        label={t.progress.credits.label}
        helperText={t.progress.credits.helper}
        action={
          <Button variant="ghost" size="sm" onClick={onUpgrade}>
            {t.progress.credits.action}
          </Button>
        }
      />
    );
  },
  args: { value: 3, max: 10 },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);
    const bar = canvas.getByRole('progressbar', { name: t.progress.credits.label });

    await expect(bar).toHaveAttribute('aria-valuenow', '3');
    await expect(bar).toHaveAttribute('aria-valuemax', '10');

    await userEvent.click(canvas.getByRole('button', { name: t.progress.credits.action }));
  },
};
