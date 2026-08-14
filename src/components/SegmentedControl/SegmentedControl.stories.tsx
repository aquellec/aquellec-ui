import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Briefcase, LayoutGrid, List, User } from 'lucide-react';
import { expect, userEvent, within } from 'storybook/test';
import { SegmentedControl, type SegmentedControlOption } from './SegmentedControl';

/**
 * Groupe de segments exclusifs, générique : les options sont passées en prop.
 * Implémenté en `radiogroup` WAI-ARIA — roving tabindex, flèches, `Home` / `End`.
 */
const meta: Meta<typeof SegmentedControl> = {
  title: 'Actions/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    options: { control: 'object' },
    value: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

const periodOptions: SegmentedControlOption[] = [
  { value: 'week', label: 'Semaine' },
  { value: 'month', label: 'Mois' },
  { value: 'year', label: 'Année' },
];

const viewOptions: SegmentedControlOption[] = [
  { value: 'grid', label: 'Grille', icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { value: 'list', label: 'Liste', icon: <List className="h-3.5 w-3.5" /> },
];

const roleOptions: SegmentedControlOption[] = [
  {
    value: 'candidate',
    label: 'Espace Candidat',
    icon: <User className="h-3.5 w-3.5 text-brand-600" />,
  },
  {
    value: 'recruiter',
    label: 'Espace Recruteur',
    icon: <Briefcase className="h-3.5 w-3.5 text-ai-600" />,
  },
];

/** Segments simples, sans illustration. */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('month');
    return (
      <SegmentedControl
        options={periodOptions}
        value={value}
        onChange={setValue}
        ariaLabel="Période affichée"
      />
    );
  },
};

/** Chaque option peut porter une icône décorative : le libellé reste le nom accessible. */
export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState('grid');
    return (
      <SegmentedControl
        options={viewOptions}
        value={value}
        onChange={setValue}
        ariaLabel="Mode d'affichage"
      />
    );
  },
};

/** Cas d'usage produit : la bascule Candidat / Recruteur, désormais une simple configuration. */
export const RoleSwitcherDemo: Story = {
  render: () => {
    const [role, setRole] = useState('candidate');
    return (
      <div className="flex flex-col items-start gap-3">
        <SegmentedControl
          options={roleOptions}
          value={role}
          onChange={setRole}
          ariaLabel="Choisir l'espace utilisateur"
        />
        <p className="text-xs text-slate-500">
          Espace actif : <strong className="text-slate-800">{role}</strong>
        </p>
      </div>
    );
  },
};

export const SmallSize: Story = {
  render: () => {
    const [value, setValue] = useState('week');
    return (
      <SegmentedControl
        options={periodOptions}
        value={value}
        onChange={setValue}
        size="sm"
        ariaLabel="Période affichée"
      />
    );
  },
};

export const SelectionInteraction: Story = {
  render: () => {
    const [role, setRole] = useState('candidate');
    return (
      <SegmentedControl
        options={roleOptions}
        value={role}
        onChange={setRole}
        ariaLabel="Choisir l'espace utilisateur"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const candidate = canvas.getByRole('radio', { name: 'Espace Candidat' });
    const recruiter = canvas.getByRole('radio', { name: 'Espace Recruteur' });

    await expect(candidate).toHaveAttribute('aria-checked', 'true');
    await expect(recruiter).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(recruiter);

    await expect(recruiter).toHaveAttribute('aria-checked', 'true');
    await expect(candidate).toHaveAttribute('aria-checked', 'false');
  },
};

/** Vérifie le roving tabindex : un seul segment est atteignable au `Tab`. */
export const KeyboardNavigation: Story = {
  render: () => {
    const [value, setValue] = useState('week');
    return (
      <SegmentedControl
        options={periodOptions}
        value={value}
        onChange={setValue}
        ariaLabel="Période affichée"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [week, month, year] = canvas.getAllByRole('radio');

    await expect(week).toHaveAttribute('tabindex', '0');
    await expect(month).toHaveAttribute('tabindex', '-1');

    week.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(month).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{End}');
    await expect(year).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{Home}');
    await expect(week).toHaveAttribute('aria-checked', 'true');

    // Boucle : depuis la première option, la flèche gauche va à la dernière.
    await userEvent.keyboard('{ArrowLeft}');
    await expect(year).toHaveAttribute('aria-checked', 'true');
  },
};
