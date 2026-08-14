import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Textarea } from './Textarea';

/**
 * Multi-line input for descriptions and long notes.
 * Shows a character counter as soon as `maxLength` is set.
 */
const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  /*
    Mirrors the defaults declared by the component, so the controls open on the
    real state instead of an empty selection. Story args still take precedence.
  */
  args: { rows: 4 },
  argTypes: {
    rows: { control: { type: 'number', min: 2, max: 12 } },
    maxLength: { control: { type: 'number', min: 0 } },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <Textarea
        {...args}
        label={t.textarea.description.label}
        placeholder={t.textarea.description.placeholder}
        helperText={t.textarea.description.helper}
      />
    );
  },
  args: { id: 'product-description', maxLength: 2000, rows: 5 },
};

export const WithError: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <Textarea
        {...args}
        label={t.textarea.description.label}
        error={t.textarea.description.error}
        defaultValue={t.textarea.description.value}
      />
    );
  },
  args: { id: 'product-description-error', maxLength: 2000, rows: 4 },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    await expect(canvas.getByRole('textbox', { name: t.textarea.description.label })).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await expect(canvas.getByRole('alert')).toHaveTextContent(t.textarea.description.error);
  },
};

export const Disabled: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <Textarea
        {...args}
        label={t.textarea.description.label}
        defaultValue={t.textarea.description.value}
      />
    );
  },
  args: { id: 'product-description-disabled', disabled: true, rows: 4 },
};

export const CharacterCountInteraction: Story = {
  render: (args) => {
    const t = useI18n();
    return (
      <Textarea
        {...args}
        label={t.textarea.description.label}
        placeholder={t.textarea.description.placeholder}
      />
    );
  },
  args: { id: 'product-description-count', maxLength: 20, rows: 3 },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);
    const textarea = canvas.getByRole('textbox', { name: t.textarea.description.label });

    // Input longer than `maxLength`: the counter must saturate, not overflow.
    await userEvent.type(textarea, 'Nunc laoreet egestas nulla');
    await expect(canvas.getByText(/20\s*\/\s*20/)).toBeInTheDocument();
  },
};

export const HelperTextOnly: Story = {
  render: (args) => {
    const t = useI18n();
    return <Textarea {...args} label={t.textarea.note.label} helperText={t.textarea.note.helper} />;
  },
  args: { id: 'internal-note', rows: 3 },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const t = getDictionary(globals.locale);

    await expect(canvas.getByText(t.textarea.note.helper)).toBeInTheDocument();
  },
};
