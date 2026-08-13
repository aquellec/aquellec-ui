import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { RoleToggle, type Role } from './RoleToggle';

/**
 * Segmented control pour basculer entre l'espace Candidat et Recruteur.
 * Utilise `aria-pressed` sur chaque option pour indiquer l'état actif aux lecteurs d'écran.
 */
const meta: Meta<typeof RoleToggle> = {
  title: 'Components/RoleToggle',
  component: RoleToggle,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RoleToggle>;

export const Default: Story = {
  render: () => {
    const [activeRole, setActiveRole] = useState<Role>('candidate');
    return <RoleToggle activeRole={activeRole} onChange={setActiveRole} />;
  },
};

export const RecruiterActive: Story = {
  render: () => {
    const [activeRole, setActiveRole] = useState<Role>('recruiter');
    return <RoleToggle activeRole={activeRole} onChange={setActiveRole} />;
  },
};

export const SwitchRoleInteraction: Story = {
  render: () => {
    const [activeRole, setActiveRole] = useState<Role>('candidate');
    return <RoleToggle activeRole={activeRole} onChange={setActiveRole} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const candidateButton = canvas.getByRole('button', { name: /Espace Candidat/i });
    const recruiterButton = canvas.getByRole('button', { name: /Espace Recruteur/i });

    await expect(candidateButton).toHaveAttribute('aria-pressed', 'true');
    await expect(recruiterButton).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(recruiterButton);

    await expect(recruiterButton).toHaveAttribute('aria-pressed', 'true');
    await expect(candidateButton).toHaveAttribute('aria-pressed', 'false');
  },
};
