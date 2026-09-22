"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, X, Loader2, FileCheck, AlertCircle } from "lucide-react";
import { cn } from "./utils";

export interface UploadZoneClassNames {
  root?: string;
  dropArea?: string;
  dropAreaActive?: string;
  dropAreaDisabled?: string;
  iconWrapper?: string;
  title?: string;
  description?: string;
  previewWrapper?: string;
  previewImage?: string;
  clearButton?: string;
  error?: string;
}

export interface UploadZoneProps {
  /** Callback fired when valid files are selected or dropped */
  onFilesSelected: (files: File[]) => void;
  /** Accepted file types (e.g. 'image/*', '.png,.jpg,.webp', 'application/json') */
  accept?: string;
  /** Whether multiple files can be selected */
  multiple?: boolean;
  /** Maximum allowable file size in bytes */
  maxSizeBytes?: number;
  /** Whether the dropzone is interactive */
  disabled?: boolean;
  /** Loading state indicator (e.g. during processing or compression) */
  loading?: boolean;
  /** Optional URL of an already loaded or uploaded file to preview */
  previewUrl?: string;
  /** Callback fired when user clicks the clear/remove preview button */
  onClear?: () => void;
  /** Heading text. Default: 'Click to upload or drag and drop' */
  title?: React.ReactNode;
  /** Subtitle or format hint. Default: format specification */
  description?: React.ReactNode;
  /** Text shown when dragging files over the dropzone */
  dragActiveText?: React.ReactNode;
  /** Visual error message */
  error?: string;
  className?: string;
  classNames?: UploadZoneClassNames;
}

export function UploadZone({
  onFilesSelected,
  accept = "image/*",
  multiple = false,
  maxSizeBytes,
  disabled = false,
  loading = false,
  previewUrl,
  onClear,
  title = "Click to upload or drag and drop",
  description,
  dragActiveText = "Drop files here to upload",
  error: controlledError,
  className = "",
  classNames = {},
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeError = controlledError || internalError;

  const validateAndEmit = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setInternalError(null);

    const validFiles: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (maxSizeBytes && file.size > maxSizeBytes) {
        const sizeMb = (maxSizeBytes / (1024 * 1024)).toFixed(1);
        setInternalError(`File "${file.name}" exceeds maximum allowed size of ${sizeMb}MB.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || loading) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled || loading) return;
    validateAndEmit(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (disabled || loading) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className, classNames.root)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled || loading}
        className="sr-only"
        tabIndex={-1}
        onChange={(e) => {
          validateAndEmit(e.target.files);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
      />

      {previewUrl ? (
        <div
          className={cn(
            "relative group flex items-center justify-center p-3 rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] overflow-hidden",
            classNames.previewWrapper
          )}
        >
          <img
            src={previewUrl}
            alt="Upload preview"
            className={cn("max-h-48 max-w-full object-contain rounded-xl shadow-2xs", classNames.previewImage)}
          />
          {onClear && !disabled && !loading && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              aria-label="Remove image"
              className={cn(
                "absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white shadow-md transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)]",
                classNames.clearButton
              )}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center p-6 text-center rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none outline-none",
            "border-[var(--border)] bg-[var(--card)] hover:border-[var(--brand)] hover:bg-[var(--card-soft)]",
            "focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)] focus-visible:ring-offset-2",
            isDragOver && "border-[var(--brand)] bg-[var(--brand-soft)] ring-2 ring-[var(--brand-ring)]",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
            classNames.dropArea,
            isDragOver && classNames.dropAreaActive,
            disabled && classNames.dropAreaDisabled
          )}
        >
          <div
            className={cn(
              "w-11 h-11 mb-3 rounded-full flex items-center justify-center bg-[var(--control-fill)] text-[var(--body-subtle)] group-hover:text-[var(--brand)] transition-colors",
              classNames.iconWrapper
            )}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[var(--brand)]" />
            ) : isDragOver ? (
              <FileCheck className="w-5 h-5 text-[var(--brand)]" />
            ) : (
              <UploadCloud className="w-5 h-5 text-[var(--brand)]" />
            )}
          </div>

          <p className={cn("text-xs font-semibold text-[var(--heading)]", classNames.title)}>
            {isDragOver ? dragActiveText : title}
          </p>

          {description && (
            <p className={cn("text-[11px] text-[var(--body-subtle)] mt-1 max-w-xs", classNames.description)}>
              {description}
            </p>
          )}
        </div>
      )}

      {activeError && (
        <div
          role="alert"
          className={cn(
            "flex items-center gap-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1",
            classNames.error
          )}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{activeError}</span>
        </div>
      )}
    </div>
  );
}
