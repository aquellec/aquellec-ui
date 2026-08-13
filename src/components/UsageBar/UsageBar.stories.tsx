import type { Meta, StoryObj } from '@storybook/react-vite';
import { UsageBar } from './UsageBar';

/**
 * Barre de progression pour quotas SaaS (analyses CV, crédits API).
 * Change automatiquement de couleur à l'approche de la limite mensuelle.
 */
const meta: Meta<typeof UsageBar> = {
  title: 'Components/UsageBar',
  component: UsageBar,
  tags: ['autodocs'],
  argTypes: {
    current: { control: { type: 'number', min: 0 } },
    max: { control: { type: 'number', min: 1 } },
    showUpgradeButton: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof UsageBar>;

export const Default: Story = {
  args: {
    current: 3,
    max: 10,
    label: 'Analyses du mois',
    unit: 'CVs',
  },
};

export const NearLimit: Story = {
  args: {
    current: 9,
    max: 10,
    label: 'Analyses du mois',
    unit: 'CVs',
  },
};

export const EnterpriseUnlimited: Story = {
  args: {
    current: 45,
    max: 50,
    label: 'Crédits API Python',
    unit: 'requêtes',
    showUpgradeButton: false,
  },
};
