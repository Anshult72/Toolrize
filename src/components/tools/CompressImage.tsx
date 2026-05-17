"use client";

import { useState } from "react";
import Dropzone from "./Dropzone";

export default function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState<number>(50);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    setOriginalSize(selected.size);
    setOriginalUrl(URL.createObjectURL(selected));
    setCompressedBlob(null);
    setCompressedUrl(null);
    setError(null);
  };

  const compressImage = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);

    try {
      const img = new Image();
      img.src = originalUrl || "";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize canvas context");

      // Adaptive size scaling
      let width = img.width;
      let height = img.height;
      const maxDimension = 1600;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Binary search quality estimation to meet target KB size
      let quality = 0.9;
      let minQuality = 0.05;
      let maxQuality = 0.95;
      let bestBlob: Blob | null = null;
      let bestSizeDifference = Infinity;

      for (let i = 0; i < 7; i++) {
        const blob: Blob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/jpeg", quality);
        });

        const sizeKb = blob.size / 1024;
        
        // Save the best blob under the target size
        if (sizeKb <= targetKb && (targetKb - sizeKb) < bestSizeDifference) {
          bestBlob = blob;
          bestSizeDifference = targetKb - sizeKb;
        }

        if (sizeKb > targetKb) {
          maxQuality = quality;
          quality = (quality + minQuality) / 2;
        } else {
          minQuality = quality;
          quality = (quality + maxQuality) / 2;
        }
      }

      // If no blob fell below target, use the lowest quality scaled blob
      if (!bestBlob) {
        // scale canvas down by 50% for extreme compression fallback
        canvas.width = width * 0.6;
        canvas.height = height * 0.6;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        bestBlob = await new Promise((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.1);
        });
      }

      if (bestBlob) {
        setCompressedBlob(bestBlob);
        setCompressedSize(bestBlob.size);
        if (compressedUrl) URL.revokeObjectURL(compressedUrl);
        setCompressedUrl(URL.createObjectURL(bestBlob));
      } else {
        throw new Error("Failed to compress image.");
      }
    } catch (err: any) {
      setError("Failed to compress image. Please upload a valid image file.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!compressedUrl || !file) return;
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `compressed_${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setCompressedBlob(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalUrl(null);
    setCompressedUrl(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFileSelected}
          accept="image/jpeg,image/png,image/webp"
          label="Select Image to Compress"
        />
      ) : (
        <div className="space-y-6">
          {/* Settings Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-surface/40 border border-border/50">
            <div className="flex-1">
              <label htmlFor="target-kb" className="block text-[14px] font-extrabold text-foreground mb-1.5">
                Target File Size (Max KB):
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="target-kb"
                  type="number"
                  min="5"
                  max="5000"
                  value={targetKb}
                  onChange={(e) => setTargetKb(Math.max(5, parseInt(e.target.value) || 20))}
                  className="w-24 px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-[14px]"
                />
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={targetKb}
                  onChange={(e) => setTargetKb(parseInt(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="text-[14px] font-bold text-accent">{targetKb} KB</span>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={compressImage}
                disabled={processing}
                className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-b from-accent to-accent-dark text-white text-[14px] font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {processing ? "Compressing..." : "Compress Image"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="px-5 py-3 bg-white border border-border hover:border-border-hover text-foreground text-[14px] font-bold rounded-xl"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] font-bold rounded-2xl">
              {error}
            </div>
          )}

          {/* Image Comparisons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Preview */}
            <div className="border border-border/60 rounded-2xl overflow-hidden bg-surface/20">
              <div className="p-3 bg-white border-b border-border/60 flex items-center justify-between">
                <span className="text-[12px] font-extrabold uppercase text-muted-light">Original File</span>
                <span className="text-[13px] font-bold text-foreground">{(originalSize / 1024).toFixed(1)} KB</span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[220px]">
                {originalUrl && (
                  <img src={originalUrl} alt="Original Preview" className="max-h-[260px] object-contain rounded-lg shadow-2xs" />
                )}
              </div>
            </div>

            {/* Compressed Preview */}
            <div className="border border-border/60 rounded-2xl overflow-hidden bg-surface/20">
              <div className="p-3 bg-white border-b border-border/60 flex items-center justify-between">
                <span className="text-[12px] font-extrabold uppercase text-muted-light">Compressed File</span>
                {compressedSize > 0 && (
                  <span className="text-[13px] font-bold text-emerald-600">{(compressedSize / 1024).toFixed(1)} KB</span>
                )}
              </div>
              <div className="p-4 flex items-center justify-center min-h-[220px]">
                {processing ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="animate-spin text-[32px]">⚙️</span>
                    <span className="text-[13px] font-bold text-muted">Optimizing Pixels...</span>
                  </div>
                ) : compressedUrl ? (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <img src={compressedUrl} alt="Compressed Preview" className="max-h-[200px] object-contain rounded-lg shadow-2xs" />
                    <button
                      type="button"
                      onClick={downloadImage}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl shadow-sm flex items-center gap-2"
                    >
                      📥 Download Image
                    </button>
                  </div>
                ) : (
                  <div className="text-[13px] font-bold text-muted-light">Click &quot;Compress Image&quot; to begin</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
