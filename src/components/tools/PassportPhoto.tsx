"use client";

import { useState, useRef } from "react";
import Dropzone from "./Dropzone";

export default function PassportPhoto() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string>("#3b82f6"); // Blue preset
  const [photoCount, setPhotoCount] = useState<number>(8); // 8 photos sheet
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelected = (files: File[]) => {
    const selected = files[0];
    setFile(selected);
    setImageUrl(URL.createObjectURL(selected));
    setSheetUrl(null);
    setError(null);
  };

  const generatePassportSheet = async () => {
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

      // Create cropped passport photo canvas first
      const pCanvas = document.createElement("canvas");
      const pCtx = pCanvas.getContext("2d");
      if (!pCtx) throw new Error("Could not initialize canvas context");

      // Indian standard: 35mm x 45mm, ratio 3.5:4.5 (7:9)
      const photoWidth = 350;
      const photoHeight = 450;
      pCanvas.width = photoWidth;
      pCanvas.height = photoHeight;

      // Draw background color
      pCtx.fillStyle = bgColor;
      pCtx.fillRect(0, 0, photoWidth, photoHeight);

      // Crop center square/portrait from uploaded image
      const sourceAspect = img.width / img.height;
      const targetAspect = photoWidth / photoHeight;
      let sWidth = img.width;
      let sHeight = img.height;
      let sx = 0;
      let sy = 0;

      if (sourceAspect > targetAspect) {
        sWidth = img.height * targetAspect;
        sx = (img.width - sWidth) / 2;
      } else {
        sHeight = img.width / targetAspect;
        sy = (img.height - sHeight) / 2;
      }

      // Draw cropped image onto passport canvas
      pCtx.drawImage(img, sx, sy, sWidth, sHeight, 10, 10, photoWidth - 20, photoHeight - 20);

      // Draw subtle passport border
      pCtx.strokeStyle = "#e5ddd0";
      pCtx.lineWidth = 4;
      pCtx.strokeRect(2, 2, photoWidth - 4, photoHeight - 4);

      // Now create final A4 sheet canvas (e.g. 1750 x 2450)
      const sheetCanvas = canvasRef.current || document.createElement("canvas");
      const sheetCtx = sheetCanvas.getContext("2d");
      if (!sheetCtx) throw new Error("Could not initialize sheet context");

      // Set dimensions of the printable sheet
      const cols = photoCount === 8 ? 4 : photoCount === 16 ? 4 : 6;
      const rows = Math.ceil(photoCount / cols);
      
      const padding = 40;
      const gap = 30;
      
      sheetCanvas.width = cols * photoWidth + (cols - 1) * gap + padding * 2;
      sheetCanvas.height = rows * photoHeight + (rows - 1) * gap + padding * 2;

      // Fill sheet canvas background with white
      sheetCtx.fillStyle = "#ffffff";
      sheetCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height);

      // Draw the passport photos onto the sheet grid
      for (let i = 0; i < photoCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = padding + col * (photoWidth + gap);
        const y = padding + row * (photoHeight + gap);
        sheetCtx.drawImage(pCanvas, x, y);
      }

      const sheetBlob: Blob = await new Promise((resolve) => {
        sheetCanvas.toBlob((b) => resolve(b!), "image/jpeg", 0.95);
      });

      if (sheetUrl) URL.revokeObjectURL(sheetUrl);
      setSheetUrl(URL.createObjectURL(sheetBlob));
    } catch (err: any) {
      setError("Failed to generate passport photo sheet. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadSheet = () => {
    if (!sheetUrl) return;
    const link = document.createElement("a");
    link.href = sheetUrl;
    link.download = `passport_photos_sheet_${photoCount}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    if (sheetUrl) URL.revokeObjectURL(sheetUrl);
    setImageUrl(null);
    setSheetUrl(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFileSelected}
          accept="image/jpeg,image/png,image/webp"
          label="Select Photo for Passport Sheet"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls Sheet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-surface/40 border border-border/50">
            <div>
              <span className="block text-[13px] font-extrabold text-foreground mb-2">Background Color:</span>
              <div className="flex gap-2.5">
                {[
                  { name: "Blue", color: "#3b82f6" },
                  { name: "Light Blue", color: "#60a5fa" },
                  { name: "White", color: "#ffffff" },
                  { name: "Light Gray", color: "#e5e7eb" },
                ].map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    onClick={() => setBgColor(item.color)}
                    style={{ backgroundColor: item.color }}
                    className={`w-9 h-9 rounded-full border shadow-2xs transition-all duration-200 ${
                      bgColor === item.color ? "ring-2 ring-accent scale-105" : "border-border hover:scale-105"
                    }`}
                    title={item.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[13px] font-extrabold text-foreground mb-2">Quantity (A4 layout):</span>
              <div className="flex gap-2">
                {[8, 12, 16, 24].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setPhotoCount(count)}
                    className={`px-4.5 py-2 rounded-xl text-[13px] font-bold border transition-all ${
                      photoCount === count
                        ? "bg-foreground text-white border-foreground"
                        : "bg-white text-muted border-border hover:border-border-hover"
                    }`}
                  >
                    {count} Photos
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end gap-2 w-full">
              <button
                type="button"
                onClick={generatePassportSheet}
                disabled={processing}
                className="flex-1 px-6 py-3 bg-gradient-to-b from-accent to-accent-dark text-white text-[14px] font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {processing ? "Generating..." : "Generate Printable Sheet"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="px-4 py-3 bg-white border border-border hover:border-border-hover text-foreground text-[14px] font-bold rounded-xl"
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

          {/* Canvas & Preview Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Original Preview */}
            <div className="md:col-span-1 border border-border/60 rounded-2xl overflow-hidden bg-surface/20">
              <div className="p-3 bg-white border-b border-border/60">
                <span className="text-[12px] font-extrabold uppercase text-muted-light">Input Portrait</span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[220px]">
                {imageUrl && (
                  <img src={imageUrl} alt="Uploaded Portrait" className="max-h-[220px] object-contain rounded-lg shadow-2xs" />
                )}
              </div>
            </div>

            {/* Printable Sheet Sheet Preview */}
            <div className="md:col-span-2 border border-border/60 rounded-2xl overflow-hidden bg-surface/20">
              <div className="p-3 bg-white border-b border-border/60 flex items-center justify-between">
                <span className="text-[12px] font-extrabold uppercase text-muted-light">Printable Sheet Sheet</span>
                {sheetUrl && (
                  <button
                    type="button"
                    onClick={downloadSheet}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    📥 Download JPEG Sheet
                  </button>
                )}
              </div>
              <div className="p-6 flex items-center justify-center min-h-[260px] max-h-[360px] overflow-auto">
                <canvas ref={canvasRef} className="hidden" />
                {processing ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="animate-spin text-[32px]">🖨️</span>
                    <span className="text-[13px] font-bold text-muted">Building layout grid...</span>
                  </div>
                ) : sheetUrl ? (
                  <img src={sheetUrl} alt="Passport Photos Sheet" className="max-h-[300px] object-contain shadow-md rounded-md bg-white p-2" />
                ) : (
                  <div className="text-[13px] font-bold text-muted-light">Click &quot;Generate Printable Sheet&quot; to compile grid</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
