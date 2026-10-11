import React, { useEffect, useId, useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import {
  mutedTextClass,
  raisedSurfaceClass,
  subtleTextClass,
} from '../../lib/semantic-colors';
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

    /*
      The empty state is the state this component spends most of its life in, so
      it is designed rather than defaulted: a dashed boundary at the weight every
      other control in the system uses, a light recess behind it, and the
      accepted format stated before the drop rather than after it. Dragging a
      file over does not bounce or glow — the dashes turn cobalt and the recess
      tints, which is the whole animation a drop target needs.
    */
    const dropzoneSurfaceClassName = cn(
      'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8',
      'transition-colors duration-150 ease-settle motion-reduce:transition-none',
      focusRing,
      isInteractive ? 'cursor-pointer' : 'cursor-not-allowed',
      isDragActive
        ? 'border-brand-600 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/15'
        : 'border-ink-400 bg-ink-50 hover:border-ink-500 hover:bg-ink-100 dark:border-ink-500 dark:bg-ink-800/60 dark:hover:border-ink-400 dark:hover:bg-ink-800',
      error && 'border-brick-500 bg-brick-50 dark:border-brick-400 dark:bg-brick-500/10',
      isLoading &&
        'cursor-wait border-brand-600 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10',
      isDisabled && !isLoading && 'opacity-60 hover:bg-transparent'
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
            /*
              A selected file leaves the dashed target and becomes a raised
              sheet. The change of state is carried by elevation and by the file
              name appearing, which is all it ever needed.
            */
            className={cn(
              'flex w-full items-center justify-between rounded-xl p-3.5 shadow-card',
              raisedSurfaceClass
            )}
            aria-describedby={error ? errorId : undefined}
          >
            <div className="flex min-w-0 items-center space-x-3 truncate">
              <div className="rounded-lg bg-brand-50 p-2 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="truncate text-left">
                {multiple ? (
                  <>
                    <p className="truncate text-sm font-semibold text-ink-900 dark:text-ink-50">
                      {labels.selection(displayedFiles.length)}
                    </p>
                    <p
                      className={cn(
                        'text-xs',
                        isLoading
                          ? 'text-brand-700 dark:text-brand-300'
                          : mutedTextClass
                      )}
                    >
                      {isLoading ? labels.uploading : labels.totalSize(formatFileSize(totalSize))}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="truncate text-sm font-semibold text-ink-900 dark:text-ink-50">
                      {displayedFile!.name}
                    </p>
                    <p
                      className={cn(
                        'text-xs',
                        isLoading
                          ? 'text-brand-700 dark:text-brand-300'
                          : mutedTextClass
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
                className="h-5 w-5 flex-shrink-0 animate-spin text-brand-700 dark:text-brand-300"
                aria-label={labels.uploadingStatus}
              />
            ) : (
              <button
                type="button"
                onClick={clearSelection}
                disabled={isDisabled}
                className={cn(
                  'rounded-md p-1 transition-colors duration-150 ease-settle motion-reduce:transition-none',
                  'hover:bg-ink-100 dark:hover:bg-ink-800',
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
                <div className="mb-3 rounded-full bg-brand-100 p-3 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
                  <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                </div>
                <p className="mb-1 text-sm font-semibold text-ink-900 dark:text-ink-50">
                  {labels.loadingTitle}
                </p>
                <p className={cn('text-xs', mutedTextClass)}>{labels.loadingHint(multiple)}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'mb-3 rounded-full p-3 transition-colors',
                    isDragActive
                      ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300'
                      : 'bg-ink-200 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
                  )}
                >
                  <UploadCloud className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mb-1 text-sm font-medium text-ink-800 dark:text-ink-100">
                  <span className="text-brand-700 underline decoration-brand-600/40 underline-offset-4 dark:text-brand-300 dark:decoration-brand-400/40">
                    {labels.browse}
                  </span>{' '}
                  {labels.dropHint(multiple)}
                </p>
                <p className={cn('text-xs', mutedTextClass)}>
                  {labels.constraint(maxSizeMB, multiple)}
                </p>
              </div>
            )}
          </label>
        )}

        {error && (
          /*
            The error is a marked strip rather than a line of red text under the
            box. A parsing failure is the moment a candidate most needs to be
            told what to do next, and a designed error state is what makes the
            difference between "something broke" and "this file is not a PDF".
          */
          <div
            id={errorId}
            role="alert"
            className={cn(
              'mt-2 flex items-start gap-2 rounded-md bg-brick-100 px-3 py-2.5 text-xs font-medium',
              'text-brick-900 dark:bg-brick-500/20 dark:text-brick-100'
            )}
          >
            <AlertCircle className="mt-px h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
});

Dropzone.displayName = 'Dropzone';
