// ── Types ──────────────────────────────────────────────────────────

export type OutputFormat = "png" | "jpeg" | "webp";
export type PageSelection = "all" | "custom";

export interface RenderOptions {
  format: OutputFormat;
  quality: number;     // 0.1–1.0 (jpeg/webp)
  dpi: number;     // 72–300
  background: string;     // hex color or "transparent"
  pageSelection: PageSelection;
  customPages: string;
}

export interface RenderedPage {
  pageNum: number;
  dataUrl: string;
  width: number;
  height: number;
  sizeKb: number;
  blob: Blob;
}

// ── Helpers ────────────────────────────────────────────────────────

export function fmtSize(kb: number): string {
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

export function parsePageList(str: string, total: number): number[] {
  const pages = new Set<number>();
  str.split(",").map(s => s.trim()).filter(Boolean).forEach(part => {
    if (/^\d+$/.test(part)) {
      const n = parseInt(part);
      if (n >= 1 && n <= total) pages.add(n);
    } else {
      const m = part.match(/^(\d+)-(\d+)$/);
      if (m) {
        let a = parseInt(m[1]), b = parseInt(m[2]);
        if (a > b) [a, b] = [b, a];
        for (let i = a; i <= b; i++) if (i >= 1 && i <= total) pages.add(i);
      }
    }
  });
  return [...pages].sort((a, b) => a - b);
}

// Lazy-load PDF.js
export async function loadPdfJs(): Promise<any> {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      const lib = (window as any).pdfjsLib;
      lib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(lib);
    };
    s.onerror = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(s);
  });
}

// Lazy-load JSZip
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

// ── Render engine ──────────────────────────────────────────────────

export async function renderPdfPages(
  buffer: ArrayBuffer,
  opts: RenderOptions,
  onProgress: (pct: number, page: number, total: number) => void,
): Promise<RenderedPage[]> {
  const pdfjs = await loadPdfJs();
  const pdfDoc = await pdfjs.getDocument({ data: buffer }).promise;
  const total = pdfDoc.numPages;

  const pagesToRender = opts.pageSelection === "all"
    ? Array.from({ length: total }, (_, i) => i + 1)
    : parsePageList(opts.customPages, total);

  if (pagesToRender.length === 0) throw new Error("No valid pages selected");

  const scale = opts.dpi / 72;  // PDF native unit = 72 dpi
  const mimeType = `image/${opts.format}`;
  const results: RenderedPage[] = [];

  for (let idx = 0; idx < pagesToRender.length; idx++) {
    const pageNum = pagesToRender[idx];
    onProgress(Math.round((idx / pagesToRender.length) * 95), pageNum, total);

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    // Create off-screen canvas
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext("2d")!;

    // Fill background
    if (opts.background !== "transparent" || opts.format === "jpeg") {
      ctx.fillStyle = opts.background === "transparent" ? "#ffffff" : opts.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Render PDF page
    await page.render({ canvasContext: ctx, viewport }).promise;

    // Export to blob
    const quality = opts.format === "png" ? undefined : opts.quality;
    const blob = await new Promise<Blob>((res, rej) => {
      canvas.toBlob(b => b ? res(b) : rej(new Error("Canvas export failed")), mimeType, quality);
    });

    const dataUrl = canvas.toDataURL(mimeType, quality);
    results.push({
      pageNum,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      sizeKb: blob.size / 1024,
      blob,
    });

    // Release canvas memory
    canvas.width = 0;
    canvas.height = 0;
  }

  return results;
}