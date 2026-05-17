"use client";

import { useState } from "react";
import Dropzone from "./Dropzone";

interface Preset {
  name: string;
  width: number;
  height: number;
  label: string;
}

const FORM_PRESETS: Preset[] = [
  { name: "upsc-photo", width: 350, height: 350, label: "UPSC Photo (350x350 px)" },
  { name: "upsc-sign", width: 350, height: 350, label: "UPSC Signature (350x350 px)" },
  { name: "ssc-photo", width: 350, height: 450, label: "SSC Photo (3.5 x 4.5 cm / 350x450 px)" },
  { name: "ssc-sign", width: 600, height: 300, label: "SSC Signature (6.0 x 3.0 cm / 600x300 px)" },
  { name: "ibps-photo", width: 324, height: 400, label: "IBPS Bank Photo (4.5 x 3.5 cm)" },
  { name: "ibps-sign", width: 550, height: 250, label: "IBPS Bank Signature" },
];

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(350);
  const [height, setHeight] = useState<number>(350);
  const [aspectRatioLocked, setAspectRatioLocked] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    setImageUrl(URL.createObjectURL(selected));
    setResultUrl(null);
    setError(null);

    // Read image dimensions and populate fields
    const img = new Image();
    img.src = URL.createObjectURL(selected);
    img.onload = () => {
      setWidth(img.width);
      setHeight(img.height);
    };
  };

  const applyPreset = (preset: Preset) => {
    setAspectRatioLocked(false);
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const resizeImage = async () => {
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

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize canvas context");

      canvas.width = width;
      canvas.height = height;

      // Draw resized image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      const resizedBlob: Blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9);
      });

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(resizedBlob));
    } catch (err: any) {
      setError("Failed to resize image. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resultUrl || !file) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = `resized_${width}x${height}_${file.name}`;
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
          label="Select Image to Resize"
        />
      ) : (
        <div className="space-y-6">
          {/* Presets and Custom Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5 rounded-2xl bg-surface/40 border border-border/50">
            {/* Presets Column */}
            <div className="lg:col-span-1 border-r border-border/50 pr-0 lg:pr-5">
              <span className="block text-[13px] font-extrabold text-foreground mb-3">
                Government Form Presets:
              </span>
              <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-2">
                {FORM_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="w-full text-left px-3.5 py-2.5 bg-white border border-border hover:border-border-hover rounded-xl text-[12.5px] font-bold text-muted hover:text-foreground transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Sizing Column */}
            <div className="lg:col-span-1 flex flex-col justify-center">
              <span className="block text-[13px] font-extrabold text-foreground mb-3">Custom Dimensions (px):</span>
              <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                <div>
                  <label htmlFor="custom-width" className="block text-[11px] font-extrabold uppercase text-muted-light mb-1">
                    Width:
                  </label>
                  <input
                    id="custom-width"
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Math.max(10, parseInt(e.target.value) || 350))}
                    className="w-full px-3.5 py-2 bg-white border border-border rounded-xl font-bold text-[14px]"
                  />
                </div>
                <div>
                  <label htmlFor="custom-height" className="block text-[11px] font-extrabold uppercase text-muted-light mb-1">
                    Height:
                  </label>
                  <input
                    id="custom-height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Math.max(10, parseInt(e.target.value) || 350))}
                    className="w-full px-3.5 py-2 bg-white border border-border rounded-xl font-bold text-[14px]"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-[12px] font-bold text-muted cursor-pointer">
                <input
                  type="checkbox"
                  checked={aspectRatioLocked}
                  onChange={(e) => setAspectRatioLocked(e.target.checked)}
                  className="accent-accent"
                />
                Maintain Aspect Ratio (Locks scale)
              </label>
            </div>

            {/* Action Row */}
            <div className="lg:col-span-1 flex flex-col justify-end gap-2 w-full">
              <button
                type="button"
                onClick={resizeImage}
                disabled={processing}
                className="w-full px-6 py-3 bg-gradient-to-b from-accent to-accent-dark text-white text-[14px] font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {processing ? "Resizing..." : "Apply Dimensions"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="w-full px-4 py-3 bg-white border border-border hover:border-border-hover text-foreground text-[14px] font-bold rounded-xl"
              >
                Clear File
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] font-bold rounded-2xl">
              {error}
            </div>
          )}

          {/* Comparatives Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border/60 rounded-2xl overflow-hidden bg-surface/20">
              <div className="p-3 bg-white border-b border-border/60">
                <span className="text-[12px] font-extrabold uppercase text-muted-light">Input Preview</span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[220px]">
                {imageUrl && (
                  <img src={imageUrl} alt="Uploaded" className="max-h-[220px] object-contain rounded-lg shadow-2xs" />
                )}
              </div>
            </div>

            <div className="border border-border/60 rounded-2xl overflow-hidden bg-surface/20">
              <div className="p-3 bg-white border-b border-border/60 flex items-center justify-between">
                <span className="text-[12px] font-extrabold uppercase text-muted-light">Resized Preview</span>
                {resultUrl && (
                  <button
                    type="button"
                    onClick={downloadImage}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    📥 Download Resized
                  </button>
                )}
              </div>
              <div className="p-4 flex items-center justify-center min-h-[220px]">
                {processing ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="animate-spin text-[32px]">📐</span>
                    <span className="text-[13px] font-bold text-muted-light">Scaling images...</span>
                  </div>
                ) : resultUrl ? (
                  <div className="flex flex-col items-center gap-3 w-full">
                    <img src={resultUrl} alt="Resized output" className="max-h-[190px] object-contain rounded-lg shadow-2xs" />
                    <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Successfully scale: {width} x {height} px
                    </span>
                  </div>
                ) : (
                  <div className="text-[13px] font-bold text-muted-light">Apply presets or dimensions to preview</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
