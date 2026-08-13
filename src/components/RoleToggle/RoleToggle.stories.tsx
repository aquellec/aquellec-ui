import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { RoleToggle, type Role } from './RoleToggle';

/**
 * Segmented control pour basculer entre l'espace Candidat et Recruteur.
 * Implémenté en `radiogroup` avec navigation clavier aux flèches.
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
    const candidateRadio = canvas.getByRole('radio', { name: /Espace Candidat/i });
    const recruiterRadio = canvas.getByRole('radio', { name: /Espace Recruteur/i });

    await expect(candidateRadio).toHaveAttribute('aria-checked', 'true');
    await expect(recruiterRadio).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(recruiterRadio);

    await expect(recruiterRadio).toHaveAttribute('aria-checked', 'true');
    await expect(candidateRadio).toHaveAttribute('aria-checked', 'false');

    await userEvent.click(candidateRadio);

    await expect(candidateRadio).toHaveAttribute('aria-checked', 'true');
    await expect(recruiterRadio).toHaveAttribute('aria-checked', 'false');
  },
};

export const KeyboardNavigation: Story = {
  render: () => {
    const [activeRole, setActiveRole] = useState<Role>('candidate');
    return <RoleToggle activeRole={activeRole} onChange={setActiveRole} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const candidateRadio = canvas.getByRole('radio', { name: /Espace Candidat/i });
    const recruiterRadio = canvas.getByRole('radio', { name: /Espace Recruteur/i });

    candidateRadio.focus();
    await userEvent.keyboard('{ArrowRight}');

    await expect(recruiterRadio).toHaveAttribute('aria-checked', 'true');
    await expect(candidateRadio).toHaveAttribute('aria-checked', 'false');
  },
};
