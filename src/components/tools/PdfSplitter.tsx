"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "./Dropzone";

export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rangeInput, setRangeInput] = useState<string>("1");
  const [splitFile, setSplitFile] = useState<{ url: string; size: number } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = async (files: File[]) => {
    setError(null);
    setProcessing(true);
    const selected = files[0];

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setFile(selected);
      setPageCount(doc.getPageCount());
      setRangeInput(`1-${doc.getPageCount()}`);
      setSplitFile(null);
    } catch (err: any) {
      setError("Failed to parse PDF document. Please upload a valid, unencrypted PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const parseRanges = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const tokens = input.replace(/\s+/g, "").split(",");

    for (const token of tokens) {
      if (token.includes("-")) {
        const parts = token.split("-");
        const start = parseInt(parts[0]);
        const end = parseInt(parts[1]);

        if (!isNaN(start) && !isNaN(end) && start > 0 && end <= maxPages && start <= end) {
          for (let i = start; i <= end; i++) {
            pages.add(i - 1); // convert to 0-indexed
          }
        } else {
          throw new Error(`Invalid range format: "${token}"`);
        }
      } else {
        const page = parseInt(token);
        if (!isNaN(page) && page > 0 && page <= maxPages) {
          pages.add(page - 1); // convert to 0-indexed
        } else {
          throw new Error(`Invalid page number: "${token}"`);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const splitPdf = async () => {
    if (!file || pageCount === 0) return;
    setProcessing(true);
    setError(null);

    try {
      const targetIndices = parseRanges(rangeInput, pageCount);
      if (targetIndices.length === 0) {
        throw new Error("No valid page indices selected.");
      }

      const buffer = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();

      const copiedPages = await newDoc.copyPages(sourceDoc, targetIndices);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const splitBytes = await newDoc.save();
      const splitBlob = new Blob([splitBytes as any], { type: "application/pdf" });

      if (splitFile?.url) URL.revokeObjectURL(splitFile.url);
      setSplitFile({
        url: URL.createObjectURL(splitBlob),
        size: splitBlob.size,
      });
    } catch (err: any) {
      setError(err.message || "Failed to split PDF. Check your page range inputs (e.g. 1-3, 5).");
    } finally {
      setProcessing(false);
    }
  };

  const downloadSplit = () => {
    if (!splitFile || !file) return;
    const link = document.createElement("a");
    link.href = splitFile.url;
    link.download = `split_pages_${rangeInput.replace(/,/g, "_")}_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setRangeInput("1");
    if (splitFile?.url) URL.revokeObjectURL(splitFile.url);
    setSplitFile(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
      {!file ? (
        <Dropzone
          onFilesSelected={handleFileSelected}
          accept="application/pdf"
          label="Select PDF Document to Split"
        />
      ) : (
        <div className="space-y-6">
          {/* Settings Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-5 rounded-2xl bg-surface/40 border border-border/50">
            <div className="flex-1 w-full">
              <label htmlFor="range-input" className="block text-[13px] font-extrabold text-foreground mb-2">
                Specify Page Ranges to Extract:
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="range-input"
                  type="text"
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="e.g. 1-3, 5, 8-10"
                  className="flex-1 px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-[14px]"
                />
                <span className="text-[13px] font-extrabold text-muted-light">
                  Total: {pageCount} pages
                </span>
              </div>
              <span className="text-[11px] text-muted-light font-medium block mt-1">
                Enter page ranges separated by commas. Use hyphens for page sweeps (e.g. 1-4, 6-7).
              </span>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={splitPdf}
                disabled={processing}
                className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-b from-accent to-accent-dark text-white text-[14px] font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {processing ? "Extracting..." : "Split PDF"}
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

          {/* Comparatives Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-border/60 rounded-2xl p-5 bg-surface/20 flex flex-col justify-between min-h-[140px]">
              <div>
                <span className="text-[11px] font-extrabold uppercase text-muted-light">Source PDF</span>
                <h3 className="font-heading text-[16px] font-bold text-foreground mt-1.5 line-clamp-1">{file.name}</h3>
              </div>
              <div className="flex items-end justify-between mt-4">
                <span className="text-[13px] text-muted-light font-medium">{pageCount} Pages</span>
                <span className="text-[15px] font-extrabold text-foreground">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            </div>

            <div className="border border-border/60 rounded-2xl p-5 bg-surface/20 flex flex-col justify-between min-h-[140px]">
              <div>
                <span className="text-[11px] font-extrabold uppercase text-muted-light">Extracted PDF</span>
                <h3 className="font-heading text-[16px] font-bold text-foreground mt-1.5 line-clamp-1">
                  {splitFile ? `split_pages_${file.name}` : "Waiting for extraction..."}
                </h3>
              </div>
              <div className="flex items-end justify-between mt-4">
                {processing ? (
                  <span className="text-[13px] font-bold text-accent animate-pulse font-medium">Extracting indexed pages...</span>
                ) : splitFile ? (
                  <>
                    <span className="text-[15px] font-extrabold text-emerald-600">{(splitFile.size / 1024).toFixed(1)} KB</span>
                    <button
                      type="button"
                      onClick={downloadSplit}
                      className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12.5px] font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                    >
                      📥 Download Extracted PDF
                    </button>
                  </>
                ) : (
                  <span className="text-[13px] text-muted-light font-medium">Ready to extract</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
