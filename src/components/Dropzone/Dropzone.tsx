import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UploadCloud, FileText, X, AlertCircle, Loader2 } from 'lucide-react';

export interface DropzoneProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  isDisabled?: boolean;
  isLoading?: boolean;
  file?: File | null;
  className?: string;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelect,
  accept = '.pdf',
  maxSizeMB = 5,
  isDisabled = false,
  isLoading = false,
  file,
  className,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const displayedFile = file ?? selectedFile;

  const validateAndHandleFile = (file: File) => {
    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Le fichier dépasse la limite autorisée de ${maxSizeMB} Mo.`);
      return;
    }

    if (accept.includes('.pdf') && file.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptés.');
      return;
    }

    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isDisabled || isLoading) return;
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (isDisabled || isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  return (
    <div className="w-full">
      <div
        onClick={() => !isDisabled && !isLoading && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={twMerge(
          clsx(
            'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out',
            isDragActive
              ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50',
            error && 'border-red-400 bg-red-50/30',
            isLoading && 'border-brand-500 bg-brand-50/50 cursor-wait',
            isDisabled && !isLoading && 'opacity-60 cursor-not-allowed hover:bg-transparent border-slate-200',
            className
          )
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          disabled={isDisabled || isLoading}
          onChange={handleInputChange}
          className="hidden"
        />

        {displayedFile ? (
          <div className="flex items-center justify-between w-full p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3 truncate">
              <div className="p-2 rounded-lg bg-brand-50 text-brand-600">
                <FileText className="w-6 h-6" />
              </div>
              <div className="truncate text-left">
                <p className="text-sm font-medium text-slate-800 truncate">{displayedFile.name}</p>
                <p className={clsx('text-xs', isLoading ? 'text-brand-600' : 'text-slate-500')}>
                  {isLoading ? 'Envoi en cours...' : formatFileSize(displayedFile.size)}
                </p>
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
                onClick={removeFile}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Supprimer le fichier"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center text-center" role="status" aria-live="polite">
            <div className="p-3 mb-3 rounded-full bg-brand-100 text-brand-600">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">Analyse en cours...</p>
            <p className="text-xs text-slate-500">Veuillez patienter pendant l&apos;envoi de votre CV</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div
              className={clsx(
                'p-3 mb-3 rounded-full transition-colors',
                isDragActive ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-500'
              )}
            >
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              <span className="text-brand-600 underline underline-offset-2">Cliquez pour parcourir</span> ou glissez votre CV ici
            </p>
            <p className="text-xs text-slate-500">Format PDF uniquement (max. {maxSizeMB} Mo)</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-1.5 mt-2 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
