
// ── Types ─────────────────────────────────────────────────────────

export type GrayscaleMethod = "luminance" | "average" | "lightness" | "red" | "green" | "blue" | "sepia" | "cool" | "warm";
export type OutputFmt = "image/jpeg" | "image/png" | "image/webp";

export interface ImageState {
  file: File;
  originalUrl: string;
  width: number;
  height: number;
  sizeKb: number;
}

export interface ProcessResult {
  url: string;
  sizeKb: number;
}

// ── Method metadata ───────────────────────────────────────────────

export const methods: {
  key: GrayscaleMethod;
  label: string;
  description: string;
  tag?: string;
}[] = [
    { key: "luminance", label: "Luminance", description: "Perceptually accurate — human eye weighting (BT.709).", tag: "Best" },
    { key: "average", label: "Average", description: "Simple average of R, G, B channels." },
    { key: "lightness", label: "Lightness", description: "Average of the max and min channel values (HSL)." },
    { key: "red", label: "Red Channel", description: "Use only the red channel as grayscale." },
    { key: "green", label: "Green Channel", description: "Use only the green channel as grayscale." },
    { key: "blue", label: "Blue Channel", description: "Use only the blue channel as grayscale." },
    { key: "sepia", label: "Sepia Tone", description: "Warm brownish vintage sepia effect.", tag: "Tinted" },
    { key: "cool", label: "Cool Tone", description: "Slightly blue-shifted grayscale tint.", tag: "Tinted" },
    { key: "warm", label: "Warm Tone", description: "Slightly orange-shifted grayscale tint.", tag: "Tinted" },
  ];

export const formatOpts: { value: OutputFmt; label: string; ext: string }[] = [
  { value: "image/jpeg", label: "JPEG", ext: "jpg" },
  { value: "image/png", label: "PNG", ext: "png" },
  { value: "image/webp", label: "WebP", ext: "webp" },
];

// ── Helpers ───────────────────────────────────────────────────────

export function fmtSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export function applyGrayscale(
  r: number, g: number, b: number,
  method: GrayscaleMethod,
  intensity: number // 0–100
): [number, number, number] {
  let gr: number, gg: number, gb: number;

  switch (method) {
    case "luminance": {
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      gr = gg = gb = l; break;
    }
    case "average": {
      const a = (r + g + b) / 3;
      gr = gg = gb = a; break;
    }
    case "lightness": {
      const l = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
      gr = gg = gb = l; break;
    }
    case "red": gr = gg = gb = r; break;
    case "green": gr = gg = gb = g; break;
    case "blue": gr = gg = gb = b; break;
    case "sepia": {
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      gr = Math.min(255, l * 1.2);
      gg = Math.min(255, l * 1.0);
      gb = Math.min(255, l * 0.78); break;
    }
    case "cool": {
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      gr = Math.min(255, l * 0.88);
      gg = Math.min(255, l * 0.95);
      gb = Math.min(255, l * 1.15); break;
    }
    case "warm": {
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      gr = Math.min(255, l * 1.15);
      gg = Math.min(255, l * 1.0);
      gb = Math.min(255, l * 0.85); break;
    }
    default: { const l = 0.2126 * r + 0.7152 * g + 0.0722 * b; gr = gg = gb = l; }
  }

  // Blend with original by intensity
  const t = intensity / 100;
  return [
    Math.round(r + (gr - r) * t),
    Math.round(g + (gg - g) * t),
    Math.round(b + (gb - b) * t),
  ];
}

export async function processImage(
  src: string,
  method: GrayscaleMethod,
  intensity: number,
  contrast: number,
  brightness: number,
  fmt: OutputFmt,
  quality: number
): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const W = img.naturalWidth, H = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Apply CSS filters for brightness/contrast before pixel manipulation
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
      ctx.drawImage(img, 0, 0, W, H);
      ctx.filter = "none";

      const imageData = ctx.getImageData(0, 0, W, H);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const [nr, ng, nb] = applyGrayscale(data[i], data[i + 1], data[i + 2], method, intensity);
        data[i] = nr; data[i + 1] = ng; data[i + 2] = nb;
      }

      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas failed"));
        resolve({ url: URL.createObjectURL(blob), sizeKb: Math.round(blob.size / 1024) });
      }, fmt, quality / 100);
    };
    img.onerror = () => reject(new Error("Load failed"));
    img.src = src;
  });
}