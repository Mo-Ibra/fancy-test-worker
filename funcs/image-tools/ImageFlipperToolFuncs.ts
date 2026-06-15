
// ── Types ─────────────────────────────────────────────────────────

export type FlipMode = "horizontal" | "vertical" | "both";
export type OutputFmt = "image/jpeg" | "image/png" | "image/webp";

export interface ImageState {
  file: File;
  originalUrl: string;
  width: number;
  height: number;
  sizeKb: number;
}

export interface FlipResult {
  url: string;
  sizeKb: number;
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

export async function flipImage(
  src: string,
  mode: FlipMode,
  fmt: OutputFmt,
  quality: number
): Promise<FlipResult> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      // White background for JPEG
      if (fmt === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.save();
      const flipX = mode === "horizontal" || mode === "both";
      const flipY = mode === "vertical" || mode === "both";
      ctx.translate(
        flipX ? canvas.width : 0,
        flipY ? canvas.height : 0
      );
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Canvas failed"));
          resolve({ url: URL.createObjectURL(blob), sizeKb: Math.round(blob.size / 1024) });
        },
        fmt,
        quality / 100
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
