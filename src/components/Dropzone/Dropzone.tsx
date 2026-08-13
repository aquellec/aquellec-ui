import React, { useState, useRef, useId } from 'react';
import { UploadCloud, FileText, X, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { focusRing, focusRingGhost } from '../../lib/focus-ring';

export interface DropzoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Called when a single file is selected in non-multiple mode. */
  onFileSelect?: (file: File) => void;
  /** Called when multiple files are selected in multiple mode. */
  onFilesSelect?: (files: File[]) => void;
  /** Accepted file extensions or MIME types passed to the native input. */
  accept?: string;
  /** Maximum allowed file size in megabytes per file. */
  maxSizeMB?: number;
  /** Disables drag, drop and browse interactions. */
  isDisabled?: boolean;
  /** Shows a loading state while upload or analysis is in progress. */
  isLoading?: boolean;
  /** Enables bulk upload for recruiter workflows. */
  multiple?: boolean;
  /** Controlled preview file for Storybook or parent-managed state. */
  file?: File | null;
  /** Controlled preview files when `multiple` is true. */
  files?: File[] | null;
}

export const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      onFileSelect,
      onFilesSelect,
      accept = '.pdf',
      maxSizeMB = 5,
      isDisabled = false,
      isLoading = false,
      multiple = false,
      file,
      files,
      className,
      ...props
    },
    ref
  ) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const errorId = useId();

    const displayedFile = multiple ? null : file ?? selectedFile;
    const displayedFiles = multiple ? files ?? selectedFiles : [];

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
        setSelectedFiles(validFiles);
        onFilesSelect?.(validFiles);
        return;
      }

      const firstFile = validFiles[0];
      setSelectedFile(firstFile);
      onFileSelect?.(firstFile);
    };

    const openFilePicker = () => {
      if (isInteractive) inputRef.current?.click();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isInteractive) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openFilePicker();
      }
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
      if (e.target.files?.length) {
        validateAndHandleFiles(Array.from(e.target.files));
      }
    };

    const removeFiles = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedFile(null);
      setSelectedFiles([]);
      setError(null);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
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

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div
          role="button"
          tabIndex={isInteractive ? 0 : -1}
          aria-disabled={isDisabled || isLoading}
          aria-busy={isLoading || undefined}
          aria-label={dropzoneLabel}
          aria-describedby={error ? errorId : undefined}
          onClick={openFilePicker}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all duration-200 ease-in-out',
            focusRing,
            isInteractive ? 'cursor-pointer' : 'cursor-not-allowed',
            isDragActive
              ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50',
            error && 'border-red-400 bg-red-50/30',
            isLoading && 'border-brand-500 bg-brand-50/50 cursor-wait',
            isDisabled && !isLoading && 'opacity-60 hover:bg-transparent border-slate-200'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={isDisabled || isLoading}
            onChange={handleInputChange}
            className="sr-only"
            tabIndex={-1}
          />

          {hasSelection ? (
            <div className="flex items-center justify-between w-full p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3 truncate">
                <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                  <FileText className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="truncate text-left">
                  {multiple ? (
                    <>
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {displayedFiles.length} CV{displayedFiles.length > 1 ? 's' : ''} sélectionné
                        {displayedFiles.length > 1 ? 's' : ''}
                      </p>
                      <p className={cn('text-xs', isLoading ? 'text-brand-600' : 'text-slate-500')}>
                        {isLoading ? 'Envoi en cours...' : `Volume total : ${formatFileSize(totalSize)}`}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-800 truncate">{displayedFile!.name}</p>
                      <p className={cn('text-xs', isLoading ? 'text-brand-600' : 'text-slate-500')}>
                        {isLoading ? 'Envoi en cours...' : formatFileSize(displayedFile!.size)}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {isLoading ? (
                <Loader2
                  className="w-5 h-5 animate-spin text-brand-600 flex-shrink-0"
                  aria-label="Envoi en cours"
                />
              ) : (
                <button
                  type="button"
                  onClick={removeFiles}
                  className={cn(
                    'p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors',
                    focusRingGhost
                  )}
                  aria-label="Supprimer le fichier"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center text-center" role="status" aria-live="polite">
              <div className="p-3 mb-3 rounded-full bg-brand-100 text-brand-600">
                <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">Analyse en cours...</p>
              <p className="text-xs text-slate-500">
                Veuillez patienter pendant l&apos;envoi {multiple ? 'de vos CVs' : 'de votre CV'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  'p-3 mb-3 rounded-full transition-colors',
                  isDragActive ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'
                )}
              >
                <UploadCloud className="w-6 h-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">
                <span className="text-brand-600 underline underline-offset-2">Cliquez pour parcourir</span>{' '}
                {multiple ? 'ou glissez vos CVs ici' : 'ou glissez votre CV ici'}
              </p>
              <p className="text-xs text-slate-500">
                Format PDF uniquement (max. {maxSizeMB} Mo{multiple ? ' par fichier' : ''})
              </p>
            </div>
          )}
        </div>

        {error && (
          <div id={errorId} role="alert" className="flex items-center space-x-1.5 mt-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Dropzone.displayName = 'Dropzone';
