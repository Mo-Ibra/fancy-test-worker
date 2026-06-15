
// ── Types ──────────────────────────────────────────────────────────

export interface PDFFile {
  id: string;
  file: File;
  name: string;
  sizeKb: number;
  pageCount: number | null;
  status: "pending" | "reading" | "ready" | "error";
  error?: string;
  pages: PageRange;   // which pages to include
}

export interface PageRange {
  mode: "all" | "custom";
  custom: string;          // e.g. "1-3,5,7-9"
}

export type MergeStatus = "idle" | "merging" | "done" | "error";

// ── Helpers ────────────────────────────────────────────────────────

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function fmtSize(kb: number): string {
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

// Parse page range string like "1-3,5,7-9" → [1,2,3,5,7,8,9] (1-indexed)
export function parsePageRange(str: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = str.split(",").map(s => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (/^\d+$/.test(part)) {
      const n = parseInt(part);
      if (n >= 1 && n <= totalPages) pages.add(n);
    } else {
      const m = part.match(/^(\d+)-(\d+)$/);
      if (m) {
        let a = parseInt(m[1]), b = parseInt(m[2]);
        if (a > b) [a, b] = [b, a];
        for (let i = a; i <= b; i++) if (i >= 1 && i <= totalPages) pages.add(i);
      }
    }
  }
  return [...pages].sort((a, b) => a - b);
}

import PDFLib from './pdf-lib';

// Read page count from a PDF file using pdf-lib
export async function readPageCount(file: File): Promise<number> {
  const buf = await file.arrayBuffer();
  const doc = await PDFLib.PDFDocument.load(buf, { ignoreEncryption: true });
  return doc.getPageCount();
}