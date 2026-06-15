
// ── Types ─────────────────────────────────────────────────────────

export type ResizeMode = "pixels" | "percentage" | "preset";
export type FitMode = "contain" | "cover" | "fill" | "none";
export type OutputFmt = "image/jpeg" | "image/png" | "image/webp";

export interface ImageInfo {
  file: File;
  url: string;
  width: number;
  height: number;
  sizeKb: number;
}

export interface ResizeOptions {
  mode: ResizeMode;
  width: number;
  height: number;
  percentage: number;
  lockAspect: boolean;
  fitMode: FitMode;
  quality: number;
  outputFormat: OutputFmt;
}

// ── Presets ───────────────────────────────────────────────────────

export const presets = [
  { key: "hd", label: "HD", width: 1280, height: 720 },
  { key: "fullHd", label: "Full HD", width: 1920, height: 1080 },
  { key: "4k", label: "4K", width: 3840, height: 2160 },
  { key: "instagram", label: "Instagram", width: 1080, height: 1080 },
  { key: "twitter", label: "Twitter", width: 1200, height: 675 },
  { key: "facebook", label: "Facebook", width: 1200, height: 630 },
  { key: "linkedin", label: "LinkedIn", width: 1200, height: 627 },
  { key: "youtube", label: "YouTube", width: 2560, height: 1440 },
  { key: "thumbnail", label: "Thumbnail", width: 300, height: 300 },
  { key: "avatar", label: "Avatar", width: 128, height: 128 },
  { key: "a4", label: "A4 @72dpi", width: 595, height: 842 },
  { key: "icon", label: "Icon", width: 64, height: 64 },
];

export const formatOptions: { value: OutputFmt; label: string; ext: string }[] = [
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

// ── Resize on canvas ──────────────────────────────────────────────

export async function resizeImage(
  src: string,
  targetW: number,
  targetH: number,
  fit: FitMode,
  format: OutputFmt,
  quality: number
): Promise<{ url: string; width: number; height: number; sizeKb: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d")!;

      if (format !== "image/png") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetW, targetH);
      }

      const srcW = img.naturalWidth;
      const srcH = img.naturalHeight;

      if (fit === "fill" || fit === "none") {
        ctx.drawImage(img, 0, 0, targetW, targetH);
      } else {
        const scaleX = targetW / srcW;
        const scaleY = targetH / srcH;
        const scale = fit === "contain" ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);
        const dw = srcW * scale;
        const dh = srcH * scale;
        const dx = (targetW - dw) / 2;
        const dy = (targetH - dh) / 2;
        ctx.save();
        if (fit === "cover") { ctx.rect(0, 0, targetW, targetH); ctx.clip(); }
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
      }

      const dataUrl = canvas.toDataURL(format, quality / 100);
      const bytes = Math.round((dataUrl.length * 3) / 4);
      resolve({ url: dataUrl, width: targetW, height: targetH, sizeKb: Math.round(bytes / 1024) });
    };
    img.src = src;
  });
}

export function fmtSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}