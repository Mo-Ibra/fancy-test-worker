// ── Types ──────────────────────────────────────────────────────────

export type SplitMode =
  | "every-page"       // one PDF per page
  | "fixed-pages"      // every N pages
  | "ranges"           // custom ranges like "1-3, 4-6, 7"
  | "bookmarks";       // by top-level bookmarks (if available)

export interface SplitRange {
  id: string;
  value: string;   // e.g. "1-3" or "5" or "2,4,6"
  label: string;   // custom name for the output file
}

export interface SplitResult {
  name: string;
  pages: number;
  sizeKb: number;
  bytes: Uint8Array;
}

// ── Helpers ────────────────────────────────────────────────────────

export function uid() { return Math.random().toString(36).slice(2, 10); }
export function fmtSize(kb: number) {
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

export function parsePageList(str: string, totalPages: number): number[] {
  const pages = new Set<number>();
  str.split(",").map(s => s.trim()).filter(Boolean).forEach(part => {
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
  });
  return [...pages].sort((a, b) => a - b);
}

// Trigger browser download for bytes
export function downloadBytes(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as any], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Load JSZip from CDN
export async function loadJSZip(): Promise<any> {
  if ((window as any).JSZip) return (window as any).JSZip;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    s.onload = () => resolve((window as any).JSZip);
    s.onerror = () => reject(new Error("Failed to load JSZip"));
    document.head.appendChild(s);
  });
}