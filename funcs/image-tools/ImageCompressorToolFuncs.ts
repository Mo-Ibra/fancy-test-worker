
// ── Types ─────────────────────────────────────────────────────────

export type OutputFmt = "image/jpeg" | "image/png" | "image/webp";
export type CompressionMode = "quality" | "target";

export interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
  originalSizeKb: number;
  width: number;
  height: number;
  status: "idle" | "processing" | "done" | "error";
  result?: { url: string; sizeKb: number; width: number; height: number };
  error?: string;
}

export interface CompressOptions {
  mode: CompressionMode;
  quality: number;
  targetSizeKb: number;
  outputFormat: OutputFmt;
  maxWidthEnabled: boolean;
  maxWidth: number;
  stripMetadata: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────

export function uid() { return Math.random().toString(36).slice(2); }
export function fmtSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb} KB`;
}

export async function loadImageInfo(file: File): Promise<{ width: number; height: number; previewUrl: string }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight, previewUrl: url });
    img.src = url;
  });
}

// Binary search quality for target size
export async function compressToTargetSize(
  item: FileItem,
  targetKb: number,
  fmt: OutputFmt
): Promise<{ url: string; sizeKb: number; width: number; height: number }> {
  let lo = 1, hi = 95, best: { url: string; sizeKb: number } | null = null;
  const img = await loadImg(item.previewUrl);

  for (let i = 0; i < 8; i++) {
    const mid = Math.round((lo + hi) / 2);
    const { url, sizeKb } = await renderCanvas(img, item.width, item.height, fmt, mid);
    if (sizeKb <= targetKb) { best = { url, sizeKb }; lo = mid + 1; }
    else hi = mid - 1;
    if (lo > hi) break;
  }
  if (!best) {
    const { url, sizeKb } = await renderCanvas(img, item.width, item.height, fmt, 1);
    best = { url, sizeKb };
  }
  return { ...best, width: item.width, height: item.height };
}

export function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function renderCanvas(
  img: HTMLImageElement,
  w: number,
  h: number,
  fmt: OutputFmt,
  quality: number
): Promise<{ url: string; sizeKb: number }> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    if (fmt === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Failed"));
      resolve({ url: URL.createObjectURL(blob), sizeKb: Math.round(blob.size / 1024) });
    }, fmt, quality / 100);
  });
}

export async function compressImage(
  item: FileItem,
  opts: CompressOptions
): Promise<{ url: string; sizeKb: number; width: number; height: number }> {
  let w = item.width, h = item.height;
  if (opts.maxWidthEnabled && w > opts.maxWidth) {
    h = Math.round(h * opts.maxWidth / w);
    w = opts.maxWidth;
  }

  const img = await loadImg(item.previewUrl);

  if (opts.mode === "target") {
    return compressToTargetSize(
      { ...item, width: w, height: h },
      opts.targetSizeKb,
      opts.outputFormat
    );
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    if (opts.outputFormat === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); }
    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Failed"));
      const url = URL.createObjectURL(blob);
      const sizeKb = Math.round(blob.size / 1024);
      resolve({ url, sizeKb, width: w, height: h });
    }, opts.outputFormat, opts.quality / 100);
  });
}

// ── Format options ────────────────────────────────────────────────

export const formatOpts: { value: OutputFmt; label: string; ext: string }[] = [
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];