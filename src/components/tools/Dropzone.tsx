"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  maxSizeMB?: number;
  label?: string;
}

export default function Dropzone({
  onFilesSelected,
  accept,
  multiple = false,
  maxSizeMB = 25,
  label = "Drag & drop files here, or click to browse",
}: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateFiles = (fileList: File[]): File[] => {
    setError(null);
    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const acceptedTypes = accept.split(",").map(t => t.trim().toLowerCase());

    for (const file of fileList) {
      if (file.size > maxSizeBytes) {
        setError(`File ${file.name} exceeds the maximum size limit of ${maxSizeMB}MB.`);
        continue;
      }

      // Basic file type validation
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith("image/")) {
          return file.type.startsWith("image/");
        }
        if (type === "application/pdf") {
          return file.type === "application/pdf" || fileExt === ".pdf";
        }
        return file.type === type || fileExt === type;
      });

      if (!isAccepted && accept !== "*") {
        setError(`Invalid file type for ${file.name}. Only ${accept} files are supported.`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const filtered = validateFiles(filesArray);
      if (filtered.length > 0) {
        onFilesSelected(multiple ? filtered : [filtered[0]]);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const filtered = validateFiles(filesArray);
      if (filtered.length > 0) {
        onFilesSelected(multiple ? filtered : [filtered[0]]);
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative flex flex-col items-center justify-center p-10 sm:p-14 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-200 bg-white ${
          isDragActive
            ? "border-accent bg-accent-light/50 scale-[1.01]"
            : "border-border/80 hover:border-accent hover:bg-accent-light/20"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-accent/5 text-[32px] text-accent mb-5 group-hover:scale-105 transition-transform duration-200">
            📥
          </div>
          <p className="font-heading text-[16px] sm:text-[17px] font-extrabold text-foreground tracking-[-0.01em] mb-2">
            {label}
          </p>
          <p className="text-[12.5px] text-muted-light font-medium leading-relaxed">
            Click to upload or drag &amp; drop. Max size {maxSizeMB}MB. Supported formats: {accept.toUpperCase()}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4.5 bg-red-50 border border-red-200 text-red-700 text-[13px] font-bold rounded-2xl flex items-center gap-2.5">
          <span>⚠️</span>
          <span className="flex-1 leading-snug">{error}</span>
        </div>
      )}
    </div>
  );
}
