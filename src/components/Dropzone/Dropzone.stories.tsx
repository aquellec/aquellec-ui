import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import { getDictionary, useI18n } from '../../../.storybook/i18n';
import { Dropzone } from './Dropzone';

const pdfFile = (name = 'cv-test.pdf', sizeBytes = 1024) =>
  new File([new ArrayBuffer(sizeBytes)], name, { type: 'application/pdf' });

function getFileInput(canvasElement: HTMLElement, name: string | RegExp) {
  return within(canvasElement).getByLabelText(name);
}

function getDropzoneLabel(canvasElement: HTMLElement, name: string | RegExp) {
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
 * Zone de dépôt drag-and-drop. Modes simple et multiple, validation de taille
 * et de type, états chargement / désactivé, activation par label natif.
 *
 * Tous ses textes — instructions, contraintes, messages d'erreur, libellés de
 * boutons et noms accessibles — passent par la prop `labels`. Les défauts sont
 * en français ; les stories injectent ceux de la langue active.
 */
const meta: Meta<typeof Dropzone> = {
  title: 'Forms/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  /* `render` au niveau du meta : toutes les stories qui n'en définissent pas
     reçoivent les libellés de la langue active sans le répéter. */
  render: (args) => {
    const t = useI18n();
    return <Dropzone {...args} labels={t.components.dropzone} />;
  },
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
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;
    const fileInput = getFileInput(canvasElement, d.inputLabel(false));

    await expect(fileInput).toBeEnabled();
    await userEvent.upload(fileInput, pdfFile());

    await expect(canvas.getByText('cv-test.pdf')).toBeInTheDocument();
    await expect(args.onFileSelect).toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('button', { name: d.remove(false) }));
    await expect(canvas.queryByText('cv-test.pdf')).not.toBeInTheDocument();
    await expect(args.onClear).toHaveBeenCalled();
  },
};

export const InvalidFileType: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;
    const invalidFile = new File(['not a pdf'], 'cv.txt', { type: 'text/plain' });

    uploadFiles(canvasElement, [invalidFile]);

    await expect(canvas.getByRole('alert')).toHaveTextContent(d.errorInvalidType('cv.txt'));
  },
};

export const FileTooLarge: Story = {
  args: {
    maxSizeMB: 1,
    accept: '.pdf',
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;

    uploadFiles(canvasElement, [pdfFile('cv-heavy.pdf', 2 * 1024 * 1024)]);

    await expect(canvas.getByRole('alert')).toHaveTextContent(d.errorTooLarge('cv-heavy.pdf', 1));
  },
};

export const DragAndDropInteraction: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
    onFileSelect: fn(),
  },
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;
    const dropzone = getDropzoneLabel(canvasElement, d.inputLabel(false));

    fireEvent.dragOver(dropzone);
    await expect(dropzone).toHaveClass('border-brand-500');

    fireEvent.dragLeave(dropzone);
    uploadFiles(canvasElement, [pdfFile('cv-drag.pdf', 512 * 1024)]);

    await expect(canvas.getByText('cv-drag.pdf')).toBeInTheDocument();
    await expect(canvas.getByText(d.fileSize(512 * 1024))).toBeInTheDocument();
    await expect(args.onFileSelect).toHaveBeenCalled();
  },
};

export const KeyboardInteraction: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
  },
  play: async ({ canvasElement, globals }) => {
    const d = getDictionary(globals.locale).components.dropzone;
    const fileInput = getFileInput(canvasElement, d.inputLabel(false));

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
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;

    uploadFiles(canvasElement, [pdfFile('cv-a.pdf'), pdfFile('cv-b.pdf')]);

    await expect(canvas.getByText(d.selection(2))).toBeInTheDocument();
    await expect(args.onFilesSelect).toHaveBeenCalled();

    await userEvent.click(canvas.getByRole('button', { name: d.remove(true) }));
    await expect(canvas.queryByText(d.selection(2))).not.toBeInTheDocument();
    await expect(args.onClear).toHaveBeenCalled();
  },
};

export const ControlledFileInteraction: Story = {
  render: () => {
    const t = useI18n();
    const [file, setFile] = useState<File | null>(null);

    return (
      <Dropzone
        labels={t.components.dropzone}
        file={file}
        onFileSelect={setFile}
        onClear={() => setFile(null)}
        maxSizeMB={5}
        accept=".pdf"
      />
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;

    uploadFiles(canvasElement, [pdfFile('cv-controlled.pdf')]);
    await expect(canvas.getByText('cv-controlled.pdf')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: d.remove(false) }));
    await expect(canvas.queryByText('cv-controlled.pdf')).not.toBeInTheDocument();
    await expect(getFileInput(canvasElement, d.inputLabel(false))).toBeInTheDocument();
  },
};

export const ControlledMultipleFilesInteraction: Story = {
  render: () => {
    const t = useI18n();
    const [files, setFiles] = useState<File[] | null>(null);

    return (
      <Dropzone
        multiple
        labels={t.components.dropzone}
        files={files}
        onFilesSelect={setFiles}
        onClear={() => setFiles(null)}
        maxSizeMB={5}
        accept=".pdf"
      />
    );
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;

    uploadFiles(canvasElement, [pdfFile('cv-unique.pdf')]);
    await expect(canvas.getByText(d.selection(1))).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: d.remove(true) }));
    await expect(getFileInput(canvasElement, d.inputLabel(true))).toBeInTheDocument();
  },
};

export const DisabledInteraction: Story = {
  args: {
    isDisabled: true,
    maxSizeMB: 5,
    accept: '.pdf',
    onFileSelect: fn(),
  },
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;
    const fileInput = getFileInput(canvasElement, d.inputLabel(false));
    const dropzone = getDropzoneLabel(canvasElement, d.inputLabel(false));

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
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;
    const dropzone = getDropzoneLabel(canvasElement, d.inputLabel(false));

    await expect(dropzone).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('status')).toHaveTextContent(d.loadingTitle);
    await expect(getFileInput(canvasElement, d.inputLabel(false))).toBeDisabled();
  },
};

export const LoadingPreviewInteraction: Story = {
  args: {
    isLoading: true,
    file: pdfFile('cv-envoi.pdf', 2 * 1024 * 1024),
  },
  play: async ({ canvasElement, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;

    await expect(canvas.getByText('cv-envoi.pdf')).toBeInTheDocument();
    await expect(canvas.getByText(d.uploading)).toBeInTheDocument();
    await expect(canvas.getByLabelText(d.uploadingStatus)).toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: d.remove(false) })).not.toBeInTheDocument();
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
  play: async ({ canvasElement, args, globals }) => {
    const canvas = within(canvasElement);
    const d = getDictionary(globals.locale).components.dropzone;

    uploadFiles(canvasElement, [pdfFile('cv-large.pdf', 2 * 1024 * 1024)]);

    await expect(canvas.getByText('cv-large.pdf')).toBeInTheDocument();
    await expect(canvas.getByText(d.fileSize(2 * 1024 * 1024))).toBeInTheDocument();
    await expect(args.onFileSelect).toHaveBeenCalled();
  },
};

export const EmptyDropInteraction: Story = {
  args: {
    maxSizeMB: 5,
    accept: '.pdf',
    onFileSelect: fn(),
  },
  play: async ({ canvasElement, args, globals }) => {
    const d = getDictionary(globals.locale).components.dropzone;
    const dropzone = getDropzoneLabel(canvasElement, d.inputLabel(false));

    dropOnDropzone(dropzone, []);

    await expect(getFileInput(canvasElement, d.inputLabel(false))).toBeInTheDocument();
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
  play: async ({ canvasElement, globals }) => {
    const d = getDictionary(globals.locale).components.dropzone;
    const onFileSelect = fn();

    getFileInput(canvasElement, d.inputLabel(false)).focus();
    fireEvent.keyDown(getFileInput(canvasElement, d.inputLabel(false)), { key: 'a' });

    await expect(getFileInput(canvasElement, d.inputLabel(false))).toBeInTheDocument();
    await expect(onFileSelect).not.toHaveBeenCalled();
  },
};
