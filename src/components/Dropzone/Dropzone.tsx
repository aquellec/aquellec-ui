import React, { useEffect, useId, useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { errorTextClass, subtleTextClass } from '../../lib/semantic-colors';
import { focusRing, focusRingGhost } from '../../lib/focus-ring';

/**
 * Toutes les chaînes visibles du composant, y compris celles réservées aux
 * technologies d'assistance. Les entrées paramétrées sont des fonctions pour
 * laisser chaque langue placer ses variables et gérer ses pluriels.
 */
export interface DropzoneLabels {
  /** Nom accessible de l'input fichier, seul élément focusable de la zone. */
  inputLabel: (multiple: boolean) => string;
  /** Segment cliquable de l'invite. */
  browse: string;
  /** Suite de l'invite, après le segment cliquable. */
  dropHint: (multiple: boolean) => string;
  /** Rappel des contraintes de format et de taille. */
  constraint: (maxSizeMB: number, multiple: boolean) => string;
  loadingTitle: string;
  loadingHint: (multiple: boolean) => string;
  /** Texte affiché sous le nom du fichier pendant l'envoi. */
  uploading: string;
  /** Nom accessible de l'indicateur d'envoi. */
  uploadingStatus: string;
  remove: (multiple: boolean) => string;
  /** Résumé de la sélection en mode multiple. */
  selection: (count: number) => string;
  totalSize: (formattedSize: string) => string;
  /** Formatage d'une taille en octets. */
  fileSize: (bytes: number) => string;
  errorTooLarge: (fileName: string, maxSizeMB: number) => string;
  errorInvalidType: (fileName: string) => string;
}

/**
 * Valeurs par défaut en français, conservées pour ne pas modifier le rendu des
 * intégrations existantes. Passez `labels` pour toute autre langue.
 */
export const defaultDropzoneLabels: DropzoneLabels = {
  inputLabel: (multiple) =>
    multiple
      ? 'Zone de dépôt de fichiers. Appuyez sur Entrée ou Espace pour parcourir vos fichiers.'
      : 'Zone de dépôt de fichier. Appuyez sur Entrée ou Espace pour parcourir vos fichiers.',
  browse: 'Cliquez pour parcourir',
  dropHint: (multiple) => (multiple ? 'ou glissez vos fichiers ici' : 'ou glissez votre fichier ici'),
  constraint: (maxSizeMB, multiple) =>
    `Format PDF uniquement (max. ${maxSizeMB} Mo${multiple ? ' par fichier' : ''})`,
  loadingTitle: 'Analyse en cours...',
  loadingHint: (multiple) =>
    `Veuillez patienter pendant l'envoi ${multiple ? 'de vos fichiers' : 'de votre fichier'}`,
  uploading: 'Envoi en cours...',
  uploadingStatus: 'Envoi en cours',
  remove: (multiple) => (multiple ? 'Supprimer les fichiers' : 'Supprimer le fichier'),
  selection: (count) => `${count} fichier${count > 1 ? 's' : ''} sélectionné${count > 1 ? 's' : ''}`,
  totalSize: (formattedSize) => `Volume total : ${formattedSize}`,
  fileSize: (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} Ko`
      : `${(bytes / (1024 * 1024)).toFixed(1)} Mo`,
  errorTooLarge: (fileName, maxSizeMB) =>
    `Le fichier "${fileName}" dépasse la limite autorisée de ${maxSizeMB} Mo.`,
  errorInvalidType: (fileName) => `Le fichier "${fileName}" n'est pas un PDF valide.`,
};

interface DropzoneBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Called when the current selection is cleared by the user. */
  onClear?: () => void;
  /** Surcharge partielle des textes du composant, fusionnée avec les défauts. */
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
                      {labels.selection(displayedFiles.length)}
                    </p>
                    <p className={cn('text-xs', isLoading ? 'text-brand-600' : 'text-slate-500')}>
                      {isLoading ? labels.uploading : labels.totalSize(formatFileSize(totalSize))}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="truncate text-sm font-medium text-slate-800">{displayedFile!.name}</p>
                    <p className={cn('text-xs', isLoading ? 'text-brand-600' : 'text-slate-500')}>
                      {isLoading ? labels.uploading : formatFileSize(displayedFile!.size)}
                    </p>
                  </>
                )}
              </div>
            </div>
            {isLoading ? (
              <Loader2
                className="h-5 w-5 flex-shrink-0 animate-spin text-brand-600"
                aria-label={labels.uploadingStatus}
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
                <p className="mb-1 text-sm font-medium text-slate-700">{labels.loadingTitle}</p>
                <p className="text-xs text-slate-500">{labels.loadingHint(multiple)}</p>
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
                  <span className="text-brand-600 underline underline-offset-2">{labels.browse}</span>{' '}
                  {labels.dropHint(multiple)}
                </p>
                <p className="text-xs text-slate-500">{labels.constraint(maxSizeMB, multiple)}</p>
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
