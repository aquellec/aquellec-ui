import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Dropzone } from './Dropzone';

/**
 * Zone de dépôt drag-and-drop pour CVs PDF. Supporte le mode simple et multiple,
 * avec validation de taille, états loading/disabled et navigation clavier (Entrée/Espace).
 */
const meta: Meta<typeof Dropzone> = {
  title: 'Components/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  argTypes: {
    maxSizeMB: { control: 'number' },
    isDisabled: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    file: new File([new ArrayBuffer(512 * 1024)], 'cv-amandine-quellec.pdf', {
      type: 'application/pdf',
    }),
  },
};

export const MultipleUpload: Story = {
  args: {
    multiple: true,
    maxSizeMB: 5,
    accept: '.pdf',
  },
};

export const FileSelectionInteraction: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
    onFileSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const fileInput = canvas.getByLabelText(/Zone de dépôt de CV/i);

    await expect(fileInput).toBeEnabled();

    const pdfFile = new File(['%PDF-1.4 mock content'], 'cv-test.pdf', {
      type: 'application/pdf',
    });
    await userEvent.upload(fileInput, pdfFile);

    await expect(canvas.getByText('cv-test.pdf')).toBeInTheDocument();
    await expect(args.onFileSelect).toHaveBeenCalled();
  },
};

export const InvalidFileType: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const invalidFile = new File(['not a pdf'], 'cv.txt', { type: 'text/plain' });
    const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;

    await userEvent.upload(fileInput, invalidFile);

    await expect(canvas.getByRole('alert')).toHaveTextContent(/n'est pas un PDF valide/i);
  },
};
