// ── Types ──────────────────────────────────────────────────────────

export type RotationAngle = 0 | 90 | 180 | 270;

export interface PageInfo {
  pageNum: number;
  rotation: RotationAngle;   // additional rotation to apply
  origAngle: RotationAngle;   // original rotation stored in PDF
  selected: boolean;
  previewUrl: string | null;
}

// ── Helpers ────────────────────────────────────────────────────────

export function fmtSize(kb: number) {
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

export function normalizeAngle(a: number): RotationAngle {
  return (((a % 360) + 360) % 360) as RotationAngle;
}

// Load PDF.js for thumbnail generation
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

// Render a single PDF page to a thumbnail data URL
export async function renderThumbnail(
  pdfjs: any,
  buffer: ArrayBuffer,
  pageNum: number,
  maxPx = 160,
): Promise<string> {
  const doc = await pdfjs.getDocument({ data: buffer.slice(0) }).promise;
  const page = await doc.getPage(pageNum);
  const vp = page.getViewport({ scale: 1 });
  const scale = Math.min(maxPx / vp.width, maxPx / vp.height);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  const url = canvas.toDataURL("image/jpeg", 0.7);
  canvas.width = 0; canvas.height = 0;
  return url;
}