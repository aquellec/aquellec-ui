import type { Meta, StoryObj } from '@storybook/react-vite';
import { HardDrive, Zap } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';
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
    label: { control: 'text' },
    helperText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: {
    value: 3,
    max: 10,
    label: 'Analyses du mois',
  },
};

/** Au-delà de 75 %, la barre passe en ambre. */
export const WarningLevel: Story = {
  args: {
    value: 8,
    max: 10,
    label: 'Analyses du mois',
  },
};

/** Au-delà de 90 %, elle passe en rouge. */
export const NearLimit: Story = {
  args: {
    value: 9.5,
    max: 10,
    label: 'Analyses du mois',
  },
};

/** Le compteur accepte un rendu personnalisé via `formatValue`. */
export const CustomFormat: Story = {
  args: {
    value: 42,
    max: 50,
    label: 'Stockage des CV',
    icon: <HardDrive className="h-4 w-4 text-brand-600" />,
    formatValue: (value, max) => `${value} Go sur ${max}`,
  },
};

/** `helperText` et `action` remplacent l'ancien bloc « Passer à la version Pro » codé en dur. */
export const WithAction: Story = {
  args: {
    value: 9,
    max: 10,
    label: 'Crédits consommés',
    icon: <Zap className="h-4 w-4 fill-brand-600/20 text-brand-600" />,
    helperText: 'Quota presque atteint',
    action: (
      <Button variant="ghost" size="sm">
        Passer à la version Pro
      </Button>
    ),
  },
};

/**
 * Sans libellé visible ni action, pour une intégration compacte.
 * `ariaLabel` reste indispensable : une `progressbar` anonyme est une
 * violation axe (`aria-progressbar-name`), vérifiée par la suite de tests.
 */
export const BarOnly: Story = {
  args: {
    value: 30,
    max: 100,
    ariaLabel: 'Progression du traitement',
  },
};

/** `max` à zéro ne doit produire ni division par zéro ni `aria-valuenow` invalide. */
export const ZeroMax: Story = {
  args: {
    value: 0,
    max: 0,
    label: 'Quota non défini',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar');

    await expect(bar).toHaveAttribute('aria-valuenow', '0');
    await expect(bar).toHaveAttribute('aria-valuetext', '0%');
  },
};

export const ActionInteraction: Story = {
  args: {
    value: 3,
    max: 10,
    label: 'Analyses du mois',
    helperText: 'Plan Gratuit',
    action: undefined,
  },
  render: (args) => {
    const onUpgrade = fn();
    return (
      <ProgressBar
        {...args}
        action={
          <Button variant="ghost" size="sm" onClick={onUpgrade}>
            Passer à la version Pro
          </Button>
        }
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bar = canvas.getByRole('progressbar', { name: 'Analyses du mois' });

    await expect(bar).toHaveAttribute('aria-valuenow', '3');
    await expect(bar).toHaveAttribute('aria-valuemax', '10');

    await userEvent.click(canvas.getByRole('button', { name: /Passer à la version Pro/i }));
  },
};
