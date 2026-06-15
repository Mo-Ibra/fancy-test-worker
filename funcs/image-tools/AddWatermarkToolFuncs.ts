
// ── Types ─────────────────────────────────────────────────────────

export type WatermarkType = "text" | "image";
export type Position = "top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right" | "tile";
export type OutputFmt = "image/jpeg" | "image/png" | "image/webp";

export interface ImageState {
  file: File;
  url: string;
  width: number;
  height: number;
  sizeKb: number;
}

export interface TextWatermark {
  text: string;
  font: string;
  fontSize: number;
  color: string;
  opacity: number;
  bold: boolean;
  italic: boolean;
  rotation: number;
}

export interface ImageWatermark {
  url: string;
  scale: number;
  opacity: number;
  rotation: number;
}

export interface WatermarkOptions {
  type: WatermarkType;
  position: Position;
  offsetX: number;
  offsetY: number;
  text: TextWatermark;
  image: ImageWatermark;
}

export interface ProcessResult {
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

export const fontOptions = [
  "Arial", "Georgia", "Courier New", "Times New Roman",
  "Verdana", "Trebuchet MS", "Impact", "Comic Sans MS",
];

export const positions: { key: Position; label: string; grid: string }[] = [
  { key: "top-left", label: "↖", grid: "col-start-1 row-start-1" },
  { key: "top-center", label: "↑", grid: "col-start-2 row-start-1" },
  { key: "top-right", label: "↗", grid: "col-start-3 row-start-1" },
  { key: "middle-left", label: "←", grid: "col-start-1 row-start-2" },
  { key: "middle-center", label: "·", grid: "col-start-2 row-start-2" },
  { key: "middle-right", label: "→", grid: "col-start-3 row-start-2" },
  { key: "bottom-left", label: "↙", grid: "col-start-1 row-start-3" },
  { key: "bottom-center", label: "↓", grid: "col-start-2 row-start-3" },
  { key: "bottom-right", label: "↘", grid: "col-start-3 row-start-3" },
];

export function getPositionCoords(
  pos: Position,
  canvasW: number, canvasH: number,
  wmW: number, wmH: number,
  offsetX: number, offsetY: number
): { x: number; y: number } {
  const pad = 20;
  const map: Record<Position, { x: number; y: number }> = {
    "top-left": { x: pad, y: pad },
    "top-center": { x: (canvasW - wmW) / 2, y: pad },
    "top-right": { x: canvasW - wmW - pad, y: pad },
    "middle-left": { x: pad, y: (canvasH - wmH) / 2 },
    "middle-center": { x: (canvasW - wmW) / 2, y: (canvasH - wmH) / 2 },
    "middle-right": { x: canvasW - wmW - pad, y: (canvasH - wmH) / 2 },
    "bottom-left": { x: pad, y: canvasH - wmH - pad },
    "bottom-center": { x: (canvasW - wmW) / 2, y: canvasH - wmH - pad },
    "bottom-right": { x: canvasW - wmW - pad, y: canvasH - wmH - pad },
    "tile": { x: 0, y: 0 },
  };
  const base = map[pos] ?? map["bottom-right"];
  return { x: base.x + offsetX, y: base.y + offsetY };
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export async function applyWatermark(
  baseImg: HTMLImageElement,
  opts: WatermarkOptions,
  fmt: OutputFmt,
  quality: number
): Promise<ProcessResult> {
  const W = baseImg.naturalWidth, H = baseImg.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(baseImg, 0, 0);

  ctx.save();

  if (opts.type === "text") {
    const tw = opts.text;
    const style = `${tw.italic ? "italic " : ""}${tw.bold ? "bold " : ""}${tw.fontSize}px ${tw.font}`;
    ctx.font = style;
    ctx.fillStyle = hexToRgba(tw.color, tw.opacity / 100);

    const metrics = ctx.measureText(tw.text);
    const wmW = metrics.width;
    const wmH = tw.fontSize;

    if (opts.position === "tile") {
      const stepX = wmW + 80;
      const stepY = wmH + 60;
      for (let y = -stepY; y < H + stepY; y += stepY) {
        for (let x = -stepX; x < W + stepX; x += stepX) {
          ctx.save();
          ctx.translate(x + wmW / 2, y + wmH / 2);
          ctx.rotate((tw.rotation * Math.PI) / 180);
          ctx.fillText(tw.text, -wmW / 2, wmH / 2);
          ctx.restore();
        }
      }
    } else {
      const { x, y } = getPositionCoords(opts.position, W, H, wmW, wmH, opts.offsetX, opts.offsetY);
      ctx.translate(x + wmW / 2, y + wmH / 2);
      ctx.rotate((tw.rotation * Math.PI) / 180);
      ctx.fillText(tw.text, -wmW / 2, wmH / 2);
    }
  } else if (opts.type === "image" && opts.image.url) {
    await new Promise<void>((resolve) => {
      const wmImg = new window.Image();
      wmImg.onload = () => {
        const scale = opts.image.scale / 100;
        const wmW = wmImg.naturalWidth * scale;
        const wmH = wmImg.naturalHeight * scale;
        ctx.globalAlpha = opts.image.opacity / 100;

        if (opts.position === "tile") {
          const stepX = wmW + 40;
          const stepY = wmH + 40;
          for (let y = 0; y < H + stepY; y += stepY) {
            for (let x = 0; x < W + stepX; x += stepX) {
              ctx.save();
              ctx.translate(x + wmW / 2, y + wmH / 2);
              ctx.rotate((opts.image.rotation * Math.PI) / 180);
              ctx.drawImage(wmImg, -wmW / 2, -wmH / 2, wmW, wmH);
              ctx.restore();
            }
          }
        } else {
          const { x, y } = getPositionCoords(opts.position, W, H, wmW, wmH, opts.offsetX, opts.offsetY);
          ctx.save();
          ctx.translate(x + wmW / 2, y + wmH / 2);
          ctx.rotate((opts.image.rotation * Math.PI) / 180);
          ctx.drawImage(wmImg, -wmW / 2, -wmH / 2, wmW, wmH);
          ctx.restore();
        }
        resolve();
      };
      wmImg.src = opts.image.url;
    });
  }

  ctx.restore();

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Canvas failed"));
      resolve({ url: URL.createObjectURL(blob), sizeKb: Math.round(blob.size / 1024) });
    }, fmt, quality / 100);
  });
}