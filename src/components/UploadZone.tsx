import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { cn, fileToBase64, compressImage } from '../utils/helpers';
import { motion, AnimatePresence } from 'motion/react';

interface UploadZoneProps {
  onImageSelect: (base64: string, mimeType: string) => void;
  isAnalyzing: boolean;
}

export default function UploadZone({ onImageSelect, isAnalyzing }: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const compressed = await compressImage(base64);
      setPreview(compressed);
      onImageSelect(compressed, 'image/jpeg');
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false,
    disabled: isAnalyzing
  } as any);

  const clearPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer transition-all duration-300 ease-in-out",
          "border-2 border-dashed rounded-2xl p-8 min-h-[300px] flex flex-col items-center justify-center gap-4",
          isDragActive ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 hover:border-slate-600 bg-slate-800/30",
          preview ? "p-4" : "p-8",
          isAnalyzing && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full aspect-video rounded-xl overflow-hidden"
            >
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              <button
                onClick={clearPreview}
                className="absolute top-2 right-2 p-2 bg-slate-900/80 hover:bg-red-500 text-white rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="p-4 bg-slate-800 rounded-full text-slate-400 group-hover:text-indigo-400 transition-colors">
                <Upload size={32} />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-200">
                  {isDragActive ? "Drop the image here" : "Click or drag image to upload"}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Supports JPG, PNG, WEBP (Max 5MB)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
