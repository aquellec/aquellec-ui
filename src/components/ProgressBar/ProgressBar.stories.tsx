import type { Meta, StoryObj } from '@storybook/react-vite';
import { HardDrive, Users, Zap } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Button } from '../Button';
import { ProgressBar } from './ProgressBar';

/**
 * Barre de progression générique : quota, consommation, remplissage.
 * Aucun texte n'est codé en dur — libellé, compteur, aide et action sont des props.
 * La couleur bascule aux seuils configurables (ambre 75 %, rouge 90 % par défaut).
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

/** Au-delà de 75 %, la barre passe en ambre. */
export const WarningLevel: Story = {
  render: (args) => {
    const t = useI18n();
    return <ProgressBar {...args} label={t.progress.credits.label} />;
  },
  args: { value: 8, max: 10 },
};

/** Au-delà de 90 %, elle passe en rouge. */
export const NearLimit: Story = {
  render: (args) => {
    const t = useI18n();
    return <ProgressBar {...args} label={t.progress.credits.label} />;
  },
  args: { value: 9.5, max: 10 },
};

/** Le compteur accepte un rendu personnalisé via `formatValue`. */
export const CustomFormat: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <ProgressBar
        {...args}
        label={t.progress.storage.label}
        icon={<HardDrive className="h-4 w-4 text-brand-600" />}
        formatValue={(value, max) => `${value} ${t.progress.storage.unit} ${max}`}
      />
    );
  },
  args: { value: 42, max: 50 },
};

/** Sièges d'une équipe : même composant, tout autre domaine. */
export const TeamSeats: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <ProgressBar
        {...args}
        label={t.progress.seats.label}
        icon={<Users className="h-4 w-4 text-brand-600" />}
      />
    );
  },
  args: { value: 4, max: 5 },
};

/** `helperText` et `action` remplacent tout bloc de conversion codé en dur. */
export const WithAction: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <ProgressBar
        {...args}
        label={t.progress.credits.label}
        icon={<Zap className="h-4 w-4 fill-brand-600/20 text-brand-600" />}
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
 * Sans libellé visible ni action, pour une intégration compacte.
 * `ariaLabel` reste indispensable : une `progressbar` anonyme est une
 * violation axe (`aria-progressbar-name`), vérifiée par la suite de tests.
 */
export const BarOnly: Story = {
  render: (args) => {
    const t = useI18n();
    return <ProgressBar {...args} ariaLabel={t.progress.processing} />;
  },
  args: { value: 30, max: 100 },
};

/** `max` à zéro ne doit produire ni division par zéro ni `aria-valuenow` invalide. */
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
