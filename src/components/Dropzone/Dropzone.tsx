import React, { useEffect, useId, useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { errorTextClass, subtleTextClass } from '../../lib/semantic-colors';
import { focusRing, focusRingGhost } from '../../lib/focus-ring';

interface DropzoneBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Called when the current selection is cleared by the user. */
  onClear?: () => void;
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
    ...rest
  } = props;

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
        return `Le fichier "${candidate.name}" dépasse la limite autorisée de ${maxSizeMB} Mo.`;
      }

      if (accept.includes('.pdf') && candidate.type !== 'application/pdf') {
        return `Le fichier "${candidate.name}" n'est pas un PDF valide.`;
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

    const formatFileSize = (bytes: number) => {
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    };

    const totalSize = displayedFiles.reduce((sum, item) => sum + item.size, 0);
    const hasSelection = multiple ? displayedFiles.length > 0 : Boolean(displayedFile);

    const dropzoneLabel = multiple
      ? 'Zone de dépôt de CVs. Appuyez sur Entrée ou Espace pour parcourir vos fichiers.'
      : 'Zone de dépôt de CV. Appuyez sur Entrée ou Espace pour parcourir vos fichiers.';

    const removeLabel = multiple ? 'Supprimer les fichiers' : 'Supprimer le fichier';

    const dropzoneSurfaceClassName = cn(
      'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out',
      focusRing,
      isInteractive ? 'cursor-pointer' : 'cursor-not-allowed',
      isDragActive
        ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
        : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50',
      error && 'border-red-400 bg-red-50/30',
      isLoading && 'border-brand-500 bg-brand-50/50 cursor-wait',
      isDisabled && !isLoading && 'opacity-60 hover:bg-transparent border-slate-200'
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
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            aria-describedby={error ? errorId : undefined}
          >
            <div className="flex min-w-0 items-center space-x-3 truncate">
              <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
                <FileText className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="truncate text-left">
                {multiple ? (
                  <>
                    <p className="truncate text-sm font-medium text-slate-800">
                      {displayedFiles.length} CV{displayedFiles.length > 1 ? 's' : ''} sélectionné
                      {displayedFiles.length > 1 ? 's' : ''}
                    </p>
                    <p className={cn('text-xs', isLoading ? 'text-brand-600' : 'text-slate-500')}>
                      {isLoading ? 'Envoi en cours...' : `Volume total : ${formatFileSize(totalSize)}`}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-slate-800">{displayedFile!.name}</p>
                    <p className={cn('text-xs', isLoading ? 'text-brand-600' : 'text-slate-500')}>
                      {isLoading ? 'Envoi en cours...' : formatFileSize(displayedFile!.size)}
                    </p>
                  </>
                )}
              </div>
            </div>
            {isLoading ? (
              <Loader2
                className="h-5 w-5 flex-shrink-0 animate-spin text-brand-600"
                aria-label="Envoi en cours"
              />
            ) : (
              <button
                type="button"
                onClick={clearSelection}
                disabled={isDisabled}
                className={cn(
                  'rounded-md p-1 transition-colors hover:bg-slate-100',
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
                <div className="mb-3 rounded-full bg-brand-100 p-3 text-brand-600">
                  <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
                </div>
                <p className="mb-1 text-sm font-medium text-slate-700">Analyse en cours...</p>
                <p className="text-xs text-slate-500">
                  Veuillez patienter pendant l&apos;envoi {multiple ? 'de vos CVs' : 'de votre CV'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'mb-3 rounded-full p-3 transition-colors',
                    isDragActive ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  <UploadCloud className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mb-1 text-sm font-medium text-slate-700">
                  <span className="text-brand-600 underline underline-offset-2">Cliquez pour parcourir</span>{' '}
                  {multiple ? 'ou glissez vos CVs ici' : 'ou glissez votre CV ici'}
                </p>
                <p className="text-xs text-slate-500">
                  Format PDF uniquement (max. {maxSizeMB} Mo{multiple ? ' par fichier' : ''})
                </p>
              </div>
            )}
          </label>
        )}

        {error && (
          <div id={errorId} role="alert" className={cn('mt-2 flex items-center space-x-1.5 text-xs', errorTextClass)}>
            <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
});

Dropzone.displayName = 'Dropzone';
