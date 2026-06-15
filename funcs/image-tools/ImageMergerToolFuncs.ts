
// ── Types ─────────────────────────────────────────────────────────

export type MergeLayout = "horizontal" | "vertical" | "grid";
export type Alignment = "start" | "center" | "end";
export type OutputFmt = "image/jpeg" | "image/png" | "image/webp";
export type FitMode = "contain" | "cover" | "stretch";

export interface ImageItem {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
}

export interface MergeOptions {
  layout: MergeLayout;
  alignment: Alignment;
  gap: number;
  bgColor: string;
  gridCols: number;
  fitMode: FitMode;
  fixedWidth: number;
  fixedHeight: number;
  useFixedSize: boolean;
}

export interface ProcessResult {
  url: string;
  width: number;
  height: number;
  sizeKb: number;
}

// ── Helpers ───────────────────────────────────────────────────────

export function uid() { return Math.random().toString(36).slice(2, 9); }
export function fmtSize(kb: number) { return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`; }

export const formatOpts: { value: OutputFmt; label: string; ext: string }[] = [
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

export async function loadImageItem(file: File): Promise<ImageItem> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => resolve({ id: uid(), file, url, width: img.naturalWidth, height: img.naturalHeight });
    img.src = url;
  });
}

export async function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function drawFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number, dy: number, dw: number, dh: number,
  mode: FitMode
) {
  const iw = img.naturalWidth, ih = img.naturalHeight;
  if (mode === "stretch") {
    ctx.drawImage(img, dx, dy, dw, dh);
    return;
  }
  const scaleX = dw / iw, scaleY = dh / ih;
  const scale = mode === "contain" ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
  const sw = iw * scale, sh = ih * scale;
  const sx = dx + (dw - sw) / 2, sy = dy + (dh - sh) / 2;
  ctx.save();
  ctx.rect(dx, dy, dw, dh);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh);
  ctx.restore();
}

export async function mergeImages(items: ImageItem[], opts: MergeOptions, fmt: OutputFmt, quality: number): Promise<ProcessResult> {
  const imgs = await Promise.all(items.map((i) => loadImg(i.url)));
  const gap = opts.gap;

  // Determine cell size
  let cellW: number, cellH: number;
  if (opts.useFixedSize) {
    cellW = opts.fixedWidth;
    cellH = opts.fixedHeight;
  } else {
    cellW = Math.max(...items.map((i) => i.width));
    cellH = Math.max(...items.map((i) => i.height));
  }

  const n = items.length;
  const cols = opts.layout === "grid" ? Math.min(opts.gridCols, n) : opts.layout === "horizontal" ? n : 1;
  const rows = opts.layout === "grid" ? Math.ceil(n / cols) : opts.layout === "vertical" ? n : 1;

  const canvasW = cols * cellW + (cols - 1) * gap;
  const canvasH = rows * cellH + (rows - 1) * gap;

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = opts.bgColor;
  ctx.fillRect(0, 0, canvasW, canvasH);

  imgs.forEach((img, idx) => {
    const col = opts.layout === "vertical" ? 0 : idx % cols;
    const row = opts.layout === "horizontal" ? 0 : Math.floor(idx / cols);
    const x = col * (cellW + gap);
    const y = row * (cellH + gap);

    // Alignment adjustment for non-fixed cells in horizontal/vertical layouts
    let dx = x, dy = y, dw = cellW, dh = cellH;

    if (opts.layout === "horizontal" && !opts.useFixedSize) {
      const scale = cellH / img.naturalHeight;
      dw = img.naturalWidth * scale;
      dh = cellH;
      if (opts.alignment === "start") dy = y;
      else if (opts.alignment === "center") dy = y + (cellH - dh) / 2;
      else dy = y + cellH - dh;
      dx = x;
    } else if (opts.layout === "vertical" && !opts.useFixedSize) {
      const scale = cellW / img.naturalWidth;
      dw = cellW;
      dh = img.naturalHeight * scale;
      if (opts.alignment === "start") dx = x;
      else if (opts.alignment === "center") dx = x + (cellW - dw) / 2;
      else dx = x + cellW - dw;
      dy = y;
    }

    drawFit(ctx, img, dx, dy, dw, dh, opts.fitMode);
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas failed"));
      resolve({ url: URL.createObjectURL(blob), width: canvasW, height: canvasH, sizeKb: Math.round(blob.size / 1024) });
    }, fmt, quality / 100);
  });
}