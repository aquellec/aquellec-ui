import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import { Dropzone } from './Dropzone';

const pdfFile = (name = 'cv-test.pdf', sizeBytes = 1024) =>
  new File([new ArrayBuffer(sizeBytes)], name, { type: 'application/pdf' });

function getFileInput(canvasElement: HTMLElement, name: RegExp) {
  return within(canvasElement).getByLabelText(name);
}

function getDropzoneLabel(canvasElement: HTMLElement, name: RegExp) {
  const input = getFileInput(canvasElement, name) as HTMLInputElement;
  return input.labels?.[0] ?? (() => {
    throw new Error('Dropzone label not found');
  })();
}

function uploadFiles(canvasElement: HTMLElement, files: File[]) {
  const fileInput = canvasElement.querySelector('input[type="file"]') as HTMLInputElement;
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  fileInput.files = dataTransfer.files;
  fireEvent.change(fileInput);
}

function dropOnDropzone(dropzone: HTMLElement, files: File[]) {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));

  if (files.length > 0) {
    fireEvent.dragStart(dropzone, { dataTransfer });
    fireEvent.drop(dropzone, { dataTransfer });
    return;
  }

  const event = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent;
  Object.defineProperty(event, 'dataTransfer', {
    value: dataTransfer,
    configurable: true,
  });
  dropzone.dispatchEvent(event);
}

/**
 * Zone de dépôt drag-and-drop pour CVs PDF. Supporte le mode simple et multiple,
 * avec validation de taille, états loading/disabled et activation via label natif.
 */
const meta: Meta<typeof Dropzone> = {
  title: 'Forms/Dropzone',
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
    onClear: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const fileInput = getFileInput(canvasElement, /Zone de dépôt de CV/i);

    await expect(fileInput).toBeEnabled();
    await userEvent.upload(fileInput, pdfFile());

    await expect(canvas.getByText('cv-test.pdf')).toBeInTheDocument();
    await expect(args.onFileSelect).toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('button', { name: /Supprimer le fichier/i }));
    await expect(canvas.queryByText('cv-test.pdf')).not.toBeInTheDocument();
    await expect(args.onClear).toHaveBeenCalled();
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

    uploadFiles(canvasElement, [invalidFile]);

    await expect(canvas.getByRole('alert')).toHaveTextContent(/n'est pas un PDF valide/i);
  },
};

export const FileTooLarge: Story = {
  args: {
    maxSizeMB: 1,
    accept: '.pdf',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    uploadFiles(canvasElement, [pdfFile('cv-heavy.pdf', 2 * 1024 * 1024)]);

    await expect(canvas.getByRole('alert')).toHaveTextContent(/dépasse la limite autorisée/i);
  },
};

export const DragAndDropInteraction: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
    onFileSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const dropzone = getDropzoneLabel(canvasElement, /Zone de dépôt de CV/i);

    fireEvent.dragOver(dropzone);
    await expect(dropzone).toHaveClass('border-brand-500');

    fireEvent.dragLeave(dropzone);
    uploadFiles(canvasElement, [pdfFile('cv-drag.pdf', 512 * 1024)]);

    await expect(canvas.getByText('cv-drag.pdf')).toBeInTheDocument();
    await expect(canvas.getByText(/512\.0 Ko/i)).toBeInTheDocument();
    await expect(args.onFileSelect).toHaveBeenCalled();
  },
};

export const KeyboardInteraction: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
  },
  play: async ({ canvasElement }) => {
    const fileInput = getFileInput(canvasElement, /Zone de dépôt de CV/i);

    fileInput.focus();
    await expect(fileInput).toHaveFocus();
  },
};

export const MultipleFilesInteraction: Story = {
  args: {
    multiple: true,
    maxSizeMB: 5,
    accept: '.pdf',
    onFilesSelect: fn(),
    onClear: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    uploadFiles(canvasElement, [pdfFile('cv-a.pdf'), pdfFile('cv-b.pdf')]);

    await expect(canvas.getByText(/2 CVs sélectionnés/i)).toBeInTheDocument();
    await expect(args.onFilesSelect).toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('button', { name: /Supprimer les fichiers/i }));
    await expect(canvas.queryByText(/2 CVs sélectionnés/i)).not.toBeInTheDocument();
    await expect(args.onClear).toHaveBeenCalled();
  },
};

export const ControlledFileInteraction: Story = {
  render: () => {
    const [file, setFile] = useState<File | null>(null);

    return (
      <Dropzone
        file={file}
        onFileSelect={setFile}
        onClear={() => setFile(null)}
        maxSizeMB={5}
        accept=".pdf"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    uploadFiles(canvasElement, [pdfFile('cv-controlled.pdf')]);
    await expect(canvas.getByText('cv-controlled.pdf')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: /Supprimer le fichier/i }));
    await expect(canvas.queryByText('cv-controlled.pdf')).not.toBeInTheDocument();
    await expect(getFileInput(canvasElement, /Zone de dépôt de CV/i)).toBeInTheDocument();
  },
};

export const ControlledMultipleFilesInteraction: Story = {
  render: () => {
    const [files, setFiles] = useState<File[] | null>(null);

    return (
      <Dropzone
        multiple
        files={files}
        onFilesSelect={setFiles}
        onClear={() => setFiles(null)}
        maxSizeMB={5}
        accept=".pdf"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    uploadFiles(canvasElement, [pdfFile('cv-unique.pdf')]);
    await expect(canvas.getByText(/1 CV sélectionné$/i)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: /Supprimer les fichiers/i }));
    await expect(getFileInput(canvasElement, /Zone de dépôt de CVs/i)).toBeInTheDocument();
  },
};

export const DisabledInteraction: Story = {
  args: {
    isDisabled: true,
    maxSizeMB: 5,
    accept: '.pdf',
    onFileSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const fileInput = getFileInput(canvasElement, /Zone de dépôt de CV/i);
    const dropzone = getDropzoneLabel(canvasElement, /Zone de dépôt de CV/i);

    await expect(fileInput).toBeDisabled();

    fireEvent.dragOver(dropzone);
    await expect(dropzone).not.toHaveClass('border-brand-500');

    dropOnDropzone(dropzone, [pdfFile('cv-disabled.pdf')]);

    await expect(canvas.queryByText('cv-disabled.pdf')).not.toBeInTheDocument();
    await expect(args.onFileSelect).not.toHaveBeenCalled();
  },
};

export const LoadingDropzoneInteraction: Story = {
  args: {
    isLoading: true,
    maxSizeMB: 5,
    accept: '.pdf',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dropzone = getDropzoneLabel(canvasElement, /Zone de dépôt de CV/i);

    await expect(dropzone).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent(/Analyse en cours/i);
    await expect(getFileInput(canvasElement, /Zone de dépôt de CV/i)).toBeDisabled();
  },
};

export const LoadingPreviewInteraction: Story = {
  args: {
    isLoading: true,
    file: pdfFile('cv-envoi.pdf', 2 * 1024 * 1024),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('cv-envoi.pdf')).toBeInTheDocument();
    await expect(canvas.getByText(/Envoi en cours/i)).toBeInTheDocument();
    await expect(canvas.getByLabelText('Envoi en cours')).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: /Supprimer le fichier/i })).not.toBeInTheDocument();
  },
};

export const AcceptWithoutPdfValidation: Story = {
  args: {
    accept: 'image/png',
    maxSizeMB: 5,
    onFileSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const pngFile = new File(['png'], 'photo.png', { type: 'image/png' });

    uploadFiles(canvasElement, [pngFile]);

    await expect(canvas.getByText('photo.png')).toBeInTheDocument();
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await expect(args.onFileSelect).toHaveBeenCalled();
  },
};

export const LargeFilePreviewInteraction: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
    onFileSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    uploadFiles(canvasElement, [pdfFile('cv-large.pdf', 2 * 1024 * 1024)]);

    await expect(canvas.getByText('cv-large.pdf')).toBeInTheDocument();
    await expect(canvas.getByText(/2\.0 Mo/i)).toBeInTheDocument();
    await expect(args.onFileSelect).toHaveBeenCalled();
  },
};

export const EmptyDropInteraction: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
    onFileSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const dropzone = getDropzoneLabel(canvasElement, /Zone de dépôt de CV/i);

    dropOnDropzone(dropzone, []);

    await expect(getFileInput(canvasElement, /Zone de dépôt de CV/i)).toBeInTheDocument();
    await expect(args.onFileSelect).not.toHaveBeenCalled();
  },
};

export const DisabledInputInteraction: Story = {
  args: {
    isDisabled: true,
    onFileSelect: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    uploadFiles(canvasElement, [pdfFile('cv-blocked.pdf')]);

    await expect(canvas.queryByText('cv-blocked.pdf')).not.toBeInTheDocument();
    await expect(args.onFileSelect).not.toHaveBeenCalled();
  },
};

export const OtherKeyIgnored: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
  },
  play: async ({ canvasElement }) => {
    const onFileSelect = fn();

    getFileInput(canvasElement, /Zone de dépôt de CV/i).focus();
    fireEvent.keyDown(getFileInput(canvasElement, /Zone de dépôt de CV/i), { key: 'a' });

    await expect(getFileInput(canvasElement, /Zone de dépôt de CV/i)).toBeInTheDocument();
    await expect(onFileSelect).not.toHaveBeenCalled();
  },
};
