// ── Types ─────────────────────────────────────────────────────────

export type OutputFmt = "image/jpeg" | "image/png" | "image/webp" | "image/bmp" | "image/gif";

export interface FileItem {
  id: string;
  file: File;
  previewUrl: string;
  originalSizeKb: number;
  width: number;
  height: number;
  status: "idle" | "processing" | "done" | "error";
  result?: { url: string; sizeKb: number; blob: Blob };
  error?: string;
}

export interface ConvertOptions {
  outputFormat: OutputFmt;
  quality: number;
  maxWidth: number | null;
  maxHeight: number | null;
  resizeEnabled: boolean;
}

// ── Format metadata ───────────────────────────────────────────────

export const formats: { value: OutputFmt; label: string; ext: string; desc: string; lossy: boolean }[] = [
  { value: "image/jpeg", label: "JPEG", ext: "jpg", desc: "Best for photos. Small size, lossy.", lossy: true },
  { value: "image/png", label: "PNG", ext: "png", desc: "Lossless. Great for graphics & logos.", lossy: false },
  { value: "image/webp", label: "WebP", ext: "webp", desc: "Modern format. Small & high quality.", lossy: true },
  { value: "image/bmp", label: "BMP", ext: "bmp", desc: "Uncompressed. Large file size.", lossy: false },
  { value: "image/gif", label: "GIF", ext: "gif", desc: "Animated or 256-color images.", lossy: false },
];

// ── Helpers ───────────────────────────────────────────────────────

export function uid() {
  return Math.random().toString(36).slice(2);
}

export function fmtSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export function getExt(filename: string): string {
  return filename.split(".").pop()?.toUpperCase() ?? "?";
}

export async function loadImageInfo(file: File): Promise<{ width: number; height: number; previewUrl: string }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight, previewUrl: url });
    img.src = url;
  });
}

export async function convertImage(
  item: FileItem,
  opts: ConvertOptions
): Promise<{ url: string; sizeKb: number; blob: Blob }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (opts.resizeEnabled) {
        if (opts.maxWidth && w > opts.maxWidth) { h = Math.round(h * opts.maxWidth / w); w = opts.maxWidth; }
        if (opts.maxHeight && h > opts.maxHeight) { w = Math.round(w * opts.maxHeight / h); h = opts.maxHeight; }
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      if (opts.outputFormat === "image/jpeg" || opts.outputFormat === "image/bmp") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
      }

      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas conversion failed"));
          const url = URL.createObjectURL(blob);
          const sizeKb = Math.round(blob.size / 1024);
          resolve({ url, sizeKb, blob });
        },
        opts.outputFormat,
        opts.quality / 100
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = item.previewUrl;
  });
}