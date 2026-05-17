"use client";

import { useState, useRef } from "react";
import Dropzone from "./Dropzone";

export default function SignatureBgRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [threshold, setThreshold] = useState<number>(200); // threshold for white pixels
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelected = (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    setImageUrl(URL.createObjectURL(selected));
    setResultUrl(null);
    setError(null);
  };

  const removeBackground = async () => {
    if (!file || !imageUrl) return;
    setProcessing(true);
    setError(null);

    try {
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = canvasRef.current || document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize canvas context");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Scan imageData and replace light pixels (greater than threshold) with transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate average brightness or distance from perfect white
        const brightness = (r + g + b) / 3;

        // If the pixel is brighter than the threshold, make it transparent
        if (brightness > threshold) {
          data[i + 3] = 0; // alpha = 0 (fully transparent)
        }
      }

      ctx.putImageData(imageData, 0, 0);

      const pngBlob: Blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(pngBlob));
    } catch (err: any) {
      setError("Failed to process signature. Please upload a valid signature photo.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadSignature = () => {
    if (!resultUrl || !file) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `transparent_${file.name.replace(/\.[^/.]+$/, "")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setImageUrl(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFileSelected}
          accept="image/jpeg,image/png,image/webp"
          label="Select Signature Image to Remove Background"
        />
      ) : (
        <div className="space-y-6">
          {/* Settings controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-5 rounded-2xl bg-surface/40 border border-border/50">
            <div className="flex-1 w-full">
              <label htmlFor="threshold-slider" className="block text-[13px] font-extrabold text-foreground mb-2">
                Filter Sensitivity (Threshold):
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="threshold-slider"
                  type="range"
                  min="100"
                  max="245"
                  step="5"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value))}
                  className="flex-1 accent-accent"
                />
                <span className="text-[13px] font-extrabold text-accent w-10 text-right">{threshold}</span>
              </div>
              <span className="text-[11px] text-muted-light font-medium block mt-1">
                Increase if signature lines are faint, decrease if signature disappears.
              </span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={removeBackground}
                disabled={processing}
                className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-b from-accent to-accent-dark text-white text-[14px] font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {processing ? "Removing..." : "Remove Background"}
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

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] font-bold rounded-2xl">
              {error}
            </div>
          )}

          {/* Comparative Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Preview */}
            <div className="border border-border/60 rounded-2xl overflow-hidden bg-surface/20">
              <div className="p-3 bg-white border-b border-border/60">
                <span className="text-[12px] font-extrabold uppercase text-muted-light">Input Signature Photo</span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[220px]">
                {imageUrl && (
                  <img src={imageUrl} alt="Signature Input" className="max-h-[220px] object-contain rounded-lg shadow-2xs" />
                )}
              </div>
            </div>

            {/* Output Preview */}
            <div className="border border-border/60 rounded-2xl overflow-hidden bg-surface/20">
              <div className="p-3 bg-white border-b border-border/60 flex items-center justify-between">
                <span className="text-[12px] font-extrabold uppercase text-muted-light">Transparent PNG Signature</span>
                {resultUrl && (
                  <button
                    type="button"
                    onClick={downloadSignature}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    📥 Download PNG
                  </button>
                )}
              </div>
              <div className="p-4 flex items-center justify-center min-h-[220px]" style={{
                // Checkerboard pattern background to preview transparency!
                backgroundImage: "radial-gradient(#c5b6a0 1px, transparent 1px), radial-gradient(#c5b6a0 1px, #ffffff 1px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
              }}>
                <canvas ref={canvasRef} className="hidden" />
                {processing ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="animate-spin text-[32px]">🖊️</span>
                    <span className="text-[13px] font-bold text-muted-light">Removing paper backdrop...</span>
                  </div>
                ) : resultUrl ? (
                  <img src={resultUrl} alt="Transparent Signature Output" className="max-h-[200px] object-contain rounded-lg" />
                ) : (
                  <div className="text-[13px] font-bold text-muted-light bg-white/95 px-4 py-2.5 rounded-xl border border-border/40">
                    Click &quot;Remove Background&quot; to scan
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
