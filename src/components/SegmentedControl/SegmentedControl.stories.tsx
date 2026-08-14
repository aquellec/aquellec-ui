import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Briefcase, LayoutGrid, List, User } from 'lucide-react';
import { expect, userEvent, within } from 'storybook/test';
import { getDictionary, useI18n, type Dictionary } from '../../../.storybook/i18n';
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

/* Les jeux d'options dérivent du dictionnaire : les `play` reconstruisent les
   mêmes libellés via `getDictionary`, quelle que soit la langue active. */
const periodOptions = (t: Dictionary): SegmentedControlOption[] => [
  { value: 'week', label: t.segmented.period.week },
  { value: 'month', label: t.segmented.period.month },
  { value: 'quarter', label: t.segmented.period.quarter },
];

const viewOptions = (t: Dictionary): SegmentedControlOption[] => [
  { value: 'grid', label: t.segmented.view.grid, icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { value: 'list', label: t.segmented.view.list, icon: <List className="h-3.5 w-3.5" /> },
];

const workspaceOptions = (t: Dictionary): SegmentedControlOption[] => [
  {
    value: 'candidate',
    label: t.segmented.workspace.candidate,
    icon: <User className="h-3.5 w-3.5 text-brand-600" />,
  },
  {
    value: 'recruiter',
    label: t.segmented.workspace.recruiter,
    icon: <Briefcase className="h-3.5 w-3.5 text-ai-600" />,
  },
];

/** Segments simples, sans illustration : filtre de période d'un tableau de bord. */
export const Default: Story = {
  render: () => {
    const t = useI18n();
    const [value, setValue] = useState('month');
    return (
      <SegmentedControl
        options={periodOptions(t)}
        value={value}
        onChange={setValue}
        ariaLabel={t.segmented.period.label}
      />
    );
  },
};

/** Chaque option peut porter une icône décorative : le libellé reste le nom accessible. */
export const WithIcons: Story = {
  render: () => {
    const t = useI18n();
    const [value, setValue] = useState('grid');
    return (
      <SegmentedControl
        options={viewOptions(t)}
        value={value}
        onChange={setValue}
        ariaLabel={t.segmented.view.label}
      />
    );
  },
};

/** Cas d'usage produit : la bascule d'espace de travail, simple configuration d'options. */
export const RoleSwitcherDemo: Story = {
  render: () => {
    const t = useI18n();
    const [workspace, setWorkspace] = useState('candidate');
    return (
      <div className="flex flex-col items-start gap-3">
        <SegmentedControl
          options={workspaceOptions(t)}
          value={workspace}
          onChange={setWorkspace}
          ariaLabel={t.segmented.workspace.label}
        />
        <p className="text-xs text-slate-500">
          {t.segmented.workspace.active}{' '}
          <strong className="text-slate-800">{workspace}</strong>
        </p>
      </div>
    );
  },
};

export const SmallSize: Story = {
  render: () => {
    const t = useI18n();
    const [value, setValue] = useState('week');
    return (
      <SegmentedControl
        options={periodOptions(t)}
        value={value}
        onChange={setValue}
        size="sm"
        ariaLabel={t.segmented.period.label}
      />
    );
  },
};

export const SelectionInteraction: Story = {
  render: () => {
    const t = useI18n();
    const [workspace, setWorkspace] = useState('candidate');
    return (
      <SegmentedControl
        options={workspaceOptions(t)}
        value={workspace}
        onChange={setWorkspace}
        ariaLabel={t.segmented.workspace.label}
      />
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);
    const candidate = canvas.getByRole('radio', { name: t.segmented.workspace.candidate });
    const recruiter = canvas.getByRole('radio', { name: t.segmented.workspace.recruiter });

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
    const t = useI18n();
    const [value, setValue] = useState('week');
    return (
      <SegmentedControl
        options={periodOptions(t)}
        value={value}
        onChange={setValue}
        ariaLabel={t.segmented.period.label}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [week, month, quarter] = canvas.getAllByRole('radio');

    await expect(week).toHaveAttribute('tabindex', '0');
    await expect(month).toHaveAttribute('tabindex', '-1');

    week.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(month).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{End}');
    await expect(quarter).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{Home}');
    await expect(week).toHaveAttribute('aria-checked', 'true');

    // Boucle : depuis la première option, la flèche gauche va à la dernière.
    await userEvent.keyboard('{ArrowLeft}');
    await expect(quarter).toHaveAttribute('aria-checked', 'true');
  },
};
