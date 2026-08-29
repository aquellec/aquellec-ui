import React, { useEffect, useId, useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { errorTextClass, subtleTextClass } from '../../lib/semantic-colors';
import { focusRing, focusRingGhost } from '../../lib/focus-ring';

/**
 * Every user-facing string of the component, including the ones only exposed to
 * assistive technology. Parameterised entries are functions so each language can
 * place its variables and handle its own pluralisation.
 */
export interface DropzoneLabels {
  /** Accessible name of the file input, the only focusable element of the zone. */
  inputLabel: (multiple: boolean) => string;
  /** Clickable part of the prompt. */
  browse: string;
  /** Remainder of the prompt, after the clickable part. */
  dropHint: (multiple: boolean) => string;
  /** Reminder of the accepted format and size limit. */
  constraint: (maxSizeMB: number, multiple: boolean) => string;
  loadingTitle: string;
  loadingHint: (multiple: boolean) => string;
  /** Shown under the file name while uploading. */
  uploading: string;
  /** Accessible name of the upload spinner. */
  uploadingStatus: string;
  remove: (multiple: boolean) => string;
  /** Selection summary in multiple mode. */
  selection: (count: number) => string;
  totalSize: (formattedSize: string) => string;
  /** Formats a size expressed in bytes. */
  fileSize: (bytes: number) => string;
  errorTooLarge: (fileName: string, maxSizeMB: number) => string;
  errorInvalidType: (fileName: string) => string;
}

/** English defaults. Pass `labels` to render the component in another language. */
export const defaultDropzoneLabels: DropzoneLabels = {
  inputLabel: (multiple) =>
    multiple
      ? 'File drop zone. Press Enter or Space to browse your files.'
      : 'File drop zone. Press Enter or Space to browse your file.',
  browse: 'Click to browse',
  dropHint: (multiple) => (multiple ? 'or drop your files here' : 'or drop your file here'),
  constraint: (maxSizeMB, multiple) =>
    `PDF only (max. ${maxSizeMB} MB${multiple ? ' per file' : ''})`,
  loadingTitle: 'Processing…',
  loadingHint: (multiple) =>
    `Please wait while ${multiple ? 'your files are' : 'your file is'} uploaded`,
  uploading: 'Uploading…',
  uploadingStatus: 'Uploading',
  remove: (multiple) => (multiple ? 'Remove files' : 'Remove file'),
  selection: (count) => `${count} file${count > 1 ? 's' : ''} selected`,
  totalSize: (formattedSize) => `Total size: ${formattedSize}`,
  fileSize: (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`,
  errorTooLarge: (fileName, maxSizeMB) => `"${fileName}" exceeds the ${maxSizeMB} MB limit.`,
  errorInvalidType: (fileName) => `"${fileName}" is not a valid PDF.`,
};

interface DropzoneBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Called when the current selection is cleared by the user. */
  onClear?: () => void;
  /** Partial override of the component copy, merged over the defaults. */
  labels?: Partial<DropzoneLabels>;
  /** Accepted file extensions or MIME types passed to the native input. */
  accept?: string;
  /** Maximum allowed file size in megabytes per file. */
  maxSizeMB?: number;
  /** Disables drag, drop and browse interactions. */
  isDisabled?: boolean;
  /** Shows a loading state while upload or analysis is in progress. */
  isLoading?: boolean;
}

/** Single-file dropzone props (`multiple` omitted or `false`). */
export type SingleDropzoneProps = DropzoneBaseProps & {
  multiple?: false;
  /** Called when a single file is selected. */
  onFileSelect?: (file: File) => void;
  /** Controlled preview file for Storybook or parent-managed state. */
  file?: File | null;
  onFilesSelect?: never;
  files?: never;
};

/** Multi-file dropzone props (`multiple: true`). */
export type MultipleDropzoneProps = DropzoneBaseProps & {
  multiple: true;
  /** Called when multiple files are selected. */
  onFilesSelect?: (files: File[]) => void;
  /** Controlled preview files for Storybook or parent-managed state. */
  files?: File[] | null;
  onFileSelect?: never;
  file?: never;
};

export type DropzoneProps = SingleDropzoneProps | MultipleDropzoneProps;

export const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>((props, ref) => {
  const {
    onClear,
    accept = '.pdf',
    maxSizeMB = 5,
    isDisabled = false,
    isLoading = false,
    className,
    labels: labelsProp,
    multiple: _multiple,
    onFileSelect: _onFileSelect,
    onFilesSelect: _onFilesSelect,
    file: _file,
    files: _files,
    ...rest
  } = props as DropzoneProps & Record<string, unknown>;

  const labels: DropzoneLabels = { ...defaultDropzoneLabels, ...labelsProp };
  const multiple = props.multiple === true;
  const onFileSelect = !multiple ? props.onFileSelect : undefined;
  const onFilesSelect = multiple ? props.onFilesSelect : undefined;
  const file = !multiple ? props.file : undefined;
  const files = multiple ? props.files : undefined;
    const [isDragActive, setIsDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const inputId = useId();
    const errorId = useId();

    const isFileControlled = file !== undefined;
    const isFilesControlled = files !== undefined;

    const displayedFile = multiple ? null : isFileControlled ? file : selectedFile;
    const displayedFiles = multiple ? (isFilesControlled ? (files ?? []) : selectedFiles) : [];

    useEffect(() => {
      if (isFileControlled && file === null) {
        setSelectedFile(null);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    }, [file, isFileControlled]);

    useEffect(() => {
      if (isFilesControlled && (files === null || files.length === 0)) {
        setSelectedFiles([]);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    }, [files, isFilesControlled]);

    const isInteractive = !isDisabled && !isLoading;

    const validateFile = (candidate: File): string | null => {
      if (candidate.size > maxSizeMB * 1024 * 1024) {
        return labels.errorTooLarge(candidate.name, maxSizeMB);
      }

      if (accept.includes('.pdf') && candidate.type !== 'application/pdf') {
        return labels.errorInvalidType(candidate.name);
      }

      return null;
    };

    const validateAndHandleFiles = (incomingFiles: File[]) => {
      setError(null);

      const validFiles: File[] = [];
      for (const candidate of incomingFiles) {
        const validationError = validateFile(candidate);
        if (validationError) {
          setError(validationError);
          return;
        }
        validFiles.push(candidate);
      }

      if (validFiles.length === 0) return;

      if (multiple) {
        if (!isFilesControlled) {
          setSelectedFiles(validFiles);
        }
        onFilesSelect?.(validFiles);
        return;
      }

      const firstFile = validFiles[0];
      if (!isFileControlled) {
        setSelectedFile(firstFile);
      }
      onFileSelect?.(firstFile);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      if (!isInteractive) return;
      setIsDragActive(true);
    };

    const handleDragLeave = () => {
      setIsDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      if (!isInteractive) return;

      if (e.dataTransfer.files?.length) {
        validateAndHandleFiles(Array.from(e.dataTransfer.files));
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isInteractive) return;
      if (e.target.files?.length) {
        validateAndHandleFiles(Array.from(e.target.files));
      }
    };

    const clearSelection = () => {
      if (!isFileControlled) {
        setSelectedFile(null);
      }
      if (!isFilesControlled) {
        setSelectedFiles([]);
      }
      setError(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      onClear?.();
    };

    const formatFileSize = labels.fileSize;

    const totalSize = displayedFiles.reduce((sum, item) => sum + item.size, 0);
    const hasSelection = multiple ? displayedFiles.length > 0 : Boolean(displayedFile);

    const dropzoneLabel = labels.inputLabel(multiple);
    const removeLabel = labels.remove(multiple);

    const dropzoneSurfaceClassName = cn(
      'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-control transition-all duration-200 ease-in-out',
      focusRing,
      isInteractive ? 'cursor-pointer' : 'cursor-not-allowed',
      isDragActive
        ? 'border-brand-500 bg-brand-50/50 scale-[0.99] dark:border-brand-400 dark:bg-brand-500/10'
        : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50 dark:border-neutral-600 dark:hover:border-neutral-500 dark:bg-neutral-800/40 dark:hover:bg-neutral-800/70',
      error && 'border-red-400 bg-red-50/30',
      isLoading && 'border-brand-500 bg-brand-50/50 cursor-wait dark:border-brand-400 dark:bg-brand-500/10',
      isDisabled && !isLoading && 'opacity-60 hover:bg-transparent border-neutral-200 dark:border-neutral-700'
    );

    return (
      <div ref={ref} className={cn('w-full', className)} {...rest}>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={!isInteractive}
          onChange={handleInputChange}
          aria-label={dropzoneLabel}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="sr-only"
        />

        {hasSelection ? (
          <div
            className="flex w-full items-center justify-between rounded-control border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-700 dark:bg-neutral-900"
            aria-describedby={error ? errorId : undefined}
          >
            <div className="flex min-w-0 items-center space-x-3 truncate">
              <div className="rounded-control bg-brand-50 p-2 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="truncate text-left">
                {multiple ? (
                  <>
                    <p className="truncate text-body font-medium text-neutral-800 dark:text-neutral-100">
                      {labels.selection(displayedFiles.length)}
                    </p>
                    <p
                      className={cn(
                        'text-caption',
                        isLoading
                          ? 'text-brand-600 dark:text-brand-300'
                          : 'text-neutral-500 dark:text-neutral-400'
                      )}
                    >
                      {isLoading ? labels.uploading : labels.totalSize(formatFileSize(totalSize))}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="truncate text-body font-medium text-neutral-800 dark:text-neutral-100">
                      {displayedFile!.name}
                    </p>
                    <p
                      className={cn(
                        'text-caption',
                        isLoading
                          ? 'text-brand-600 dark:text-brand-300'
                          : 'text-neutral-500 dark:text-neutral-400'
                      )}
                    >
                      {isLoading ? labels.uploading : formatFileSize(displayedFile!.size)}
                    </p>
                  </>
                )}
              </div>
            </div>
            {isLoading ? (
              <Loader2
                className="h-5 w-5 flex-shrink-0 animate-spin text-brand-600 dark:text-brand-300"
                aria-label={labels.uploadingStatus}
              />
            ) : (
              <button
                type="button"
                onClick={clearSelection}
                disabled={isDisabled}
                className={cn(
                  'rounded-md p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800',
                  subtleTextClass,
                  focusRingGhost
                )}
                aria-label={removeLabel}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        ) : (
          <label
            htmlFor={inputId}
            aria-busy={isLoading || undefined}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={dropzoneSurfaceClassName}
          >
            {isLoading ? (
              <div className="flex flex-col items-center text-center" role="status" aria-live="polite">
                <div className="mb-3 rounded-full bg-brand-100 p-3 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                </div>
                <p className="mb-1 text-body font-medium text-neutral-700 dark:text-neutral-200">
                  {labels.loadingTitle}
                </p>
                <p className="text-caption text-neutral-500 dark:text-neutral-400">
                  {labels.loadingHint(multiple)}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'mb-3 rounded-full p-3 transition-colors',
                    isDragActive
                      ? 'bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300'
                      : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                  )}
                >
                  <UploadCloud className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mb-1 text-body font-medium text-neutral-700 dark:text-neutral-200">
                  <span className="text-brand-600 dark:text-brand-300 underline underline-offset-2">
                    {labels.browse}
                  </span>{' '}
                  {labels.dropHint(multiple)}
                </p>
                <p className="text-caption text-neutral-500 dark:text-neutral-400">
                  {labels.constraint(maxSizeMB, multiple)}
                </p>
              </div>
            )}
          </label>
        )}

        {error && (
          <div id={errorId} role="alert" className={cn('mt-2 flex items-center space-x-1.5 text-caption', errorTextClass)}>
            <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
});

Dropzone.displayName = 'Dropzone';
