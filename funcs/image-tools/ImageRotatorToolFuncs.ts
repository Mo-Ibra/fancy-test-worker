
// ── Types ─────────────────────────────────────────────────────────

export type OutputFmt = "image/jpeg" | "image/png" | "image/webp";
export type BgFill = "transparent" | "white" | "black";

export interface ImageState {
  file: File;
  originalUrl: string;
  width: number;
  height: number;
  sizeKb: number;
}

export interface RotateResult {
  url: string;
  sizeKb: number;
  width: number;
  height: number;
}

// ── Helpers ───────────────────────────────────────────────────────

export function fmtSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export const formatOpts: { value: OutputFmt; label: string; ext: string }[] = [
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

// Rotate canvas, expanding canvas size to avoid clipping
export async function rotateImage(
  src: string,
  angleDeg: number,
  fmt: OutputFmt,
  quality: number,
  bgFill: BgFill
): Promise<RotateResult> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const rad = (angleDeg * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      const W = img.naturalWidth;
      const H = img.naturalHeight;

      // New canvas dimensions to fully contain rotated image
      const newW = Math.round(W * cos + H * sin);
      const newH = Math.round(W * sin + H * cos);

      const canvas = document.createElement("canvas");
      canvas.width = newW;
      canvas.height = newH;
      const ctx = canvas.getContext("2d")!;

      // Background fill
      if (bgFill === "white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, newW, newH);
      } else if (bgFill === "black") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, newW, newH);
      }
      // transparent: leave canvas as-is

      ctx.translate(newW / 2, newH / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -W / 2, -H / 2);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas conversion failed"));
          resolve({
            url: URL.createObjectURL(blob),
            sizeKb: Math.round(blob.size / 1024),
            width: newW,
            height: newH,
          });
        },
        fmt,
        quality / 100
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

export const PRESET_ANGLES = [
  { label: "90° CW", value: 90 },
  { label: "180°", value: 180 },
  { label: "90° CCW", value: -90 },
  { label: "45° CW", value: 45 },
  { label: "45° CCW", value: -45 },
  { label: "15° CW", value: 15 },
  { label: "15° CCW", value: -15 },
  { label: "Custom", value: null },
];