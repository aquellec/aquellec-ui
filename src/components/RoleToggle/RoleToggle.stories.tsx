import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RoleToggle, type Role } from './RoleToggle';

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
