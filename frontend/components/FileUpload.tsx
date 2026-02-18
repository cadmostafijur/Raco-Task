"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileArchive, Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

export default function FileUpload({
  onUpload,
  accept = ".zip",
  maxSize = 10 * 1024 * 1024,
  disabled,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
    e.target.value = "";
  };

  const processFile = async (file: File) => {
    setError(null);
    setSuccess(false);
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setError("Only .zip files are allowed");
      return;
    }
    if (file.size > maxSize) {
      setError(`File size must be under ${maxSize / 1024 / 1024}MB`);
      return;
    }
    setUploading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
    }, 200);
    try {
      await onUpload(file);
      setProgress(100);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      clearInterval(interval);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer",
          dragActive && "border-primary bg-primary/5 scale-[1.02]",
          uploading && "pointer-events-none opacity-80",
          disabled && "opacity-50 cursor-not-allowed",
          "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        <div className="p-8 flex flex-col items-center justify-center gap-4">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-600"
              >
                <CheckCircle2 className="h-10 w-10" />
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <FileArchive className="h-10 w-10" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="text-center">
            <p className="font-medium">
              {uploading ? "Uploading..." : "Drop your ZIP file here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse • Max 10MB
            </p>
          </div>
          {uploading && (
            <div className="w-full max-w-xs">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
