import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Textarea } from './Textarea';

/**
 * Zone de saisie multi-lignes pour fiches de poste ou descriptions longues.
 * Affiche un compteur de caractères lorsque `maxLength` est défini.
 */
const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    id: 'job-description',
    label: 'Fiche de poste',
    placeholder: 'Collez ici la description du poste visé...',
    helperText: 'Plus la description est détaillée, plus le score ATS sera précis.',
    maxLength: 2000,
    rows: 5,
  },
};

export const WithError: Story = {
  args: {
    id: 'job-description-error',
    label: 'Fiche de poste',
    error: 'La description doit contenir au moins 50 caractères.',
    defaultValue: 'Développeur React',
    maxLength: 2000,
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    id: 'job-description-disabled',
    label: 'Fiche de poste',
    defaultValue: 'Champ non modifiable.',
    disabled: true,
    rows: 4,
  },
};

export const CharacterCountInteraction: Story = {
  args: {
    id: 'job-description-count',
    label: 'Fiche de poste',
    placeholder: 'Décrivez le poste...',
    maxLength: 20,
    rows: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole('textbox', { name: /Fiche de poste/i });

    await userEvent.type(textarea, 'Développeur React senior');
    await expect(canvas.getByText(/20\s*\/\s*20/)).toBeInTheDocument();
  },
};

export const HelperTextOnly: Story = {
  args: {
    id: 'job-description-helper',
    label: 'Fiche de poste',
    helperText: 'Minimum 50 caractères recommandés.',
    rows: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Minimum 50 caractères recommandés.')).toBeInTheDocument();
  },
};
