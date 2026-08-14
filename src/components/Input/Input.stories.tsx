import type { Meta, StoryObj } from '@storybook/react-vite';
import { Building2, Lock, Search } from 'lucide-react';
import { expect, within } from 'storybook/test';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Input } from './Input';

/**
 * Champ de saisie sur une ligne. Associe libellé, message d'erreur et texte
 * d'aide via `htmlFor` et `aria-describedby`.
 */
const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'search'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <Input
        {...args}
        label={t.input.workspace.label}
        placeholder={t.input.workspace.placeholder}
        defaultValue={t.input.workspace.value}
      />
    );
  },
  args: { id: 'workspace-name' },
};

export const WithError: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <Input
        {...args}
        label={t.input.email.label}
        placeholder={t.input.email.placeholder}
        error={t.input.email.error}
      />
    );
  },
  args: { id: 'email-error', type: 'email', defaultValue: 'name@' },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);
    const field = canvas.getByLabelText(t.input.email.label);

    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAccessibleDescription(t.input.email.error);
  },
};

export const WithHelperText: Story = {
  render: (args) => {
    const t = useI18n();
    return <Input {...args} label={t.input.password.label} helperText={t.input.password.helper} />;
  },
  args: { id: 'password', type: 'password', placeholder: '••••••••' },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    await expect(canvas.getByLabelText(t.input.password.label)).toHaveAccessibleDescription(
      t.input.password.helper
    );
  },
};

export const Disabled: Story = {
  render: (args) => {
    const t = useI18n();
    return <Input {...args} label={t.input.workspace.label} defaultValue={t.input.workspace.value} />;
  },
  args: { id: 'workspace-disabled', disabled: true },
};

/** L'icône est décorative : le libellé reste le seul nom accessible du champ. */
export const WithIcon: Story = {
  render: () => {
    const t = useI18n();
    return (
      <div className="relative max-w-sm">
        <Input
          id="workspace-with-icon"
          label={t.input.workspace.label}
          defaultValue={t.input.workspace.value}
          placeholder={t.input.workspace.placeholder}
          className="pl-9"
        />
        <Building2
          className="pointer-events-none absolute left-3 top-[34px] h-4 w-4 text-slate-500"
          aria-hidden="true"
        />
      </div>
    );
  },
};

export const SearchField: Story = {
  render: () => {
    const t = useI18n();
    return (
      <div className="relative max-w-sm">
        <Input
          id="catalog-search"
          type="search"
          label={t.input.search.label}
          placeholder={t.input.search.placeholder}
          className="pl-9"
        />
        <Search
          className="pointer-events-none absolute left-3 top-[34px] h-4 w-4 text-slate-500"
          aria-hidden="true"
        />
      </div>
    );
  },
};

export const PasswordWithIcon: Story = {
  render: () => {
    const t = useI18n();
    return (
      <div className="relative max-w-sm">
        <Input
          id="password-with-icon"
          label={t.input.password.label}
          type="password"
          placeholder="••••••••"
          className="pl-9"
        />
        <Lock
          className="pointer-events-none absolute left-3 top-[34px] h-4 w-4 text-slate-500"
          aria-hidden="true"
        />
      </div>
    );
  },
};
