import type { Meta, StoryObj } from '@storybook/react-vite';
import { Briefcase, Lock } from 'lucide-react';
import { Input } from './Input';

/**
 * Champ de saisie une ligne pour formulaires SaaS (entreprise, poste, identifiants).
 * Associe label, messages d'erreur et texte d'aide avec les attributs ARIA correspondants.
 */
const meta: Meta<typeof Input> = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    id: 'company-name',
    label: 'Nom de l\'entreprise',
    placeholder: 'Ex : Vercel, Doctolib',
    defaultValue: 'Vercel',
  },
};

export const WithError: Story = {
  args: {
    id: 'job-title-error',
    label: 'Titre du poste',
    error: 'Le titre du poste est requis.',
    defaultValue: '',
    placeholder: 'Ex : Front-End Engineer',
  },
};

export const Disabled: Story = {
  args: {
    id: 'company-disabled',
    label: 'Nom de l\'entreprise',
    defaultValue: 'Vercel',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    id: 'password',
    label: 'Mot de passe',
    type: 'password',
    placeholder: '••••••••',
    helperText: '8 caractères minimum, dont une majuscule.',
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="relative max-w-sm">
      <Input
        id="company-with-icon"
        label="Nom de l'entreprise"
        defaultValue="Vercel"
        placeholder="Ex : Vercel, Doctolib"
        className="pl-9"
      />
      <Briefcase
        className="pointer-events-none absolute left-3 top-[34px] h-4 w-4 text-slate-500"
        aria-hidden="true"
      />
    </div>
  ),
};

export const PasswordWithIcon: Story = {
  render: () => (
    <div className="relative max-w-sm">
      <Input
        id="password-with-icon"
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        className="pl-9"
      />
      <Lock
        className="pointer-events-none absolute left-3 top-[34px] h-4 w-4 text-slate-500"
        aria-hidden="true"
      />
    </div>
  ),
};
