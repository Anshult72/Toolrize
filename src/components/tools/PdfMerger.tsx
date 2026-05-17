"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "./Dropzone";

interface PdfQueueItem {
  id: string;
  file: File;
  pageCount: number;
}

export default function PdfMerger() {
  const [pdfs, setPdfs] = useState<PdfQueueItem[]>([]);
  const [mergedFile, setMergedFile] = useState<{ url: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    setError(null);
    setProcessing(true);

    try {
      const items: PdfQueueItem[] = [];
      for (const file of files) {
        // Read file array buffer to check validity and pages count
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        items.push({
          id: Math.random().toString(36).substring(2, 9),
          file,
          pageCount: doc.getPageCount(),
        });
      }
      setPdfs((prev) => [...prev, ...items]);
      setMergedFile(null);
    } catch (err: any) {
      setError("Failed to parse one or more PDF files. Please ensure they are password-free and valid.");
    } finally {
      setProcessing(false);
    }
  };

  const removePdf = (id: string) => {
    setPdfs((prev) => prev.filter((item) => item.id !== id));
    setMergedFile(null);
  };

  const movePdf = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === pdfs.length - 1) return;

    const updated = [...pdfs];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    setPdfs(updated);
    setMergedFile(null);
  };

  const mergePdfs = async () => {
    if (pdfs.length < 2) {
      setError("Please add at least 2 PDF files to merge.");
      return;
    }
    setProcessing(true);
    setError(null);

    try {
      const mergedDoc = await PDFDocument.create();

      for (const item of pdfs) {
        const buffer = await item.file.arrayBuffer();
        const sourceDoc = await PDFDocument.load(buffer);
        const copiedPages = await mergedDoc.copyPages(sourceDoc, sourceDoc.getPageIndices());
        copiedPages.forEach((page) => mergedDoc.addPage(page));
      }

      const mergedBytes = await mergedDoc.save();
      const mergedBlob = new Blob([mergedBytes as any], { type: "application/pdf" });

      if (mergedFile?.url) URL.revokeObjectURL(mergedFile.url);
      setMergedFile({
        url: URL.createObjectURL(mergedBlob),
        size: mergedBlob.size,
      });
    } catch (err: any) {
      setError("Failed to merge PDF files. Please verify the documents are not corrupted.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadMerged = () => {
    if (!mergedFile) return;
    const link = document.createElement("a");
    link.href = mergedFile.url;
    link.download = `merged_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setPdfs([]);
    if (mergedFile?.url) URL.revokeObjectURL(mergedFile.url);
    setMergedFile(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
      <div className="mb-6">
        <Dropzone
          onFilesSelected={handleFilesSelected}
          accept="application/pdf"
          multiple={true}
          label="Select multiple PDF documents to merge"
        />
      </div>

      {pdfs.length > 0 && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-surface/40 border border-border/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-border/40">
              <div>
                <h3 className="font-heading text-[15px] font-extrabold text-foreground">
                  Merge Document Ordering ({pdfs.length} files)
                </h3>
                <p className="text-[12px] text-muted-light font-semibold">
                  Change the order of documents by clicking the navigation arrows on the right.
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={mergePdfs}
                  disabled={processing || pdfs.length < 2}
                  className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-b from-accent to-accent-dark text-white text-[13px] font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {processing ? "Merging..." : "Merge PDFs"}
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

            {/* Document Queue list */}
            <div className="space-y-3">
              {pdfs.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white border border-border/60 rounded-xl shadow-2xs gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 text-[16px] font-bold">
                      PDF
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-extrabold text-foreground truncate leading-snug">
                        {item.file.name}
                      </h4>
                      <p className="text-[12px] text-muted-light font-semibold">
                        {item.pageCount} pages • {(item.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Ordering control buttons */}
                    <button
                      type="button"
                      onClick={() => movePdf(idx, "up")}
                      disabled={idx === 0}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-[12px] font-bold hover:bg-surface disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => movePdf(idx, "down")}
                      disabled={idx === pdfs.length - 1}
                      className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-[12px] font-bold hover:bg-surface disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      ▼
                    </button>
                    <button
                      type="button"
                      onClick={() => removePdf(item.id)}
                      className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center text-[14px] font-bold hover:bg-red-50 cursor-pointer"
                      title="Remove document"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Merge Ready stripe */}
          {mergedFile && (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[32px]">📚</span>
                <div>
                  <h4 className="font-heading text-[15px] font-extrabold text-emerald-800">
                    PDF Merge Successful!
                  </h4>
                  <p className="text-[12.5px] text-emerald-700 font-semibold">
                    Compiled {pdfs.reduce((acc, curr) => acc + curr.pageCount, 0)} total pages. File Size: {(mergedFile.size / 1024).toFixed(1)} KB.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={downloadMerged}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                📥 Download Merged PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
