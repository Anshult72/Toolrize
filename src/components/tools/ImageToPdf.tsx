"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "./Dropzone";

interface ImageFile {
  id: string;
  file: File;
  url: string;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [pdfFile, setPdfFile] = useState<{ url: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    setPdfFile(null);
    setError(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const match = prev.find((img) => img.id === id);
      if (match) URL.revokeObjectURL(match.url);
      return prev.filter((img) => img.id !== id);
    });
    setPdfFile(null);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === images.length - 1) return;

    const updated = [...images];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setImages(updated);
    setPdfFile(null);
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgFile of images) {
        const imageBytes = await imgFile.file.arrayBuffer();
        let pdfImage;

        if (imgFile.file.type === "image/jpeg" || imgFile.file.type === "image/jpg") {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (imgFile.file.type === "image/png") {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // Fallback to Canvas conversion to JPEG for unsupported images
          const img = new Image();
          img.src = imgFile.url;
          await new Promise((res) => { img.onload = res; });
          
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          
          const fallbackJpg: ArrayBuffer = await new Promise((resolve) => {
            canvas.toBlob(async (b) => {
              resolve(await b!.arrayBuffer());
            }, "image/jpeg", 0.9);
          });
          pdfImage = await pdfDoc.embedJpg(fallbackJpg);
        }

        // Draw image fit to page bounds
        const page = pdfDoc.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: pdfImage.width,
          height: pdfImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes as any], { type: "application/pdf" });

      if (pdfFile?.url) URL.revokeObjectURL(pdfFile.url);
      setPdfFile({
        url: URL.createObjectURL(pdfBlob),
        size: pdfBlob.size,
      });
    } catch (err: any) {
      setError("Failed to convert images to PDF. Please ensure all uploaded files are valid images.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfFile) return;
    const link = document.createElement("a");
    link.href = pdfFile.url;
    link.download = `toolrize_images_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    if (pdfFile?.url) URL.revokeObjectURL(pdfFile.url);
    setPdfFile(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="image/jpeg,image/png,image/webp"
          multiple={true}
          label="Select multiple images to convert"
        />
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          {/* Re-ordering Dashboard */}
          <div className="p-5 rounded-2xl bg-surface/40 border border-border/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-border/40">
              <div>
                <h3 className="font-heading text-[15px] font-extrabold text-foreground">
                  Arrange Conversion Queue ({images.length} files)
                </h3>
                <p className="text-[12px] text-muted-light font-semibold">
                  Drag files or use buttons below to change page ordering inside the generated PDF.
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={convertToPdf}
                  disabled={processing}
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-b from-accent to-accent-dark text-white text-[13px] font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {processing ? "Converting..." : "Convert to PDF"}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="px-4.5 py-2.5 bg-white border border-border text-foreground text-[13px] font-bold rounded-xl"
                >
                  Clear All
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-[13px] font-bold rounded-xl mb-4">
                {error}
              </div>
            )}

            {/* Images layout queue */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <div key={img.id} className="relative group bg-white border border-border/50 rounded-xl overflow-hidden shadow-2xs">
                  <div className="absolute top-1 left-1 bg-foreground/75 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                    Page {idx + 1}
                  </div>
                  
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-[11px] shadow-sm cursor-pointer z-10"
                    title="Remove page"
                  >
                    ✕
                  </button>

                  <div className="h-28 flex items-center justify-center bg-surface/10 p-2">
                    <img src={img.url} alt={`Queue ${idx}`} className="max-h-full object-contain rounded" />
                  </div>

                  {/* Ordering arrows strip */}
                  <div className="flex border-t border-border/40 bg-surface/30">
                    <button
                      type="button"
                      onClick={() => moveImage(idx, "up")}
                      disabled={idx === 0}
                      className="flex-1 py-1.5 text-center text-[12px] font-bold border-r border-border/40 hover:bg-white disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(idx, "down")}
                      disabled={idx === images.length - 1}
                      className="flex-1 py-1.5 text-center text-[12px] font-bold hover:bg-white disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export sheet */}
          {pdfFile && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[32px]">📄</span>
                <div>
                  <h4 className="font-heading text-[15px] font-extrabold text-emerald-800">
                    PDF Document Ready!
                  </h4>
                  <p className="text-[12.5px] text-emerald-700 font-semibold">
                    Merged {images.length} images into A4 pages. Total Size: {(pdfFile.size / 1024).toFixed(1)} KB.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={downloadPdf}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                📥 Download PDF Document
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
