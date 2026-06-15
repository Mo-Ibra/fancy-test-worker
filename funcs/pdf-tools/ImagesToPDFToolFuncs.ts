
// ── Types ──────────────────────────────────────────────────────────

export type PageSize = "A4" | "A3" | "Letter" | "Legal" | "fit";
export type Orientation = "portrait" | "landscape";
export type ImageFit = "contain" | "cover" | "fill" | "center";

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  sizeKb: number;
  dataUrl: string;
  width: number;
  height: number;
  status: "loading" | "ready" | "error";
  error?: string;
}

export interface ConvertOptions {
  pageSize: PageSize;
  orientation: Orientation;
  imageFit: ImageFit;
  marginPt: number;   // margin in points (1pt = 1/72 inch)
  backgroundColor: string;
  addPageNumbers: boolean;
  quality: number;   // JPEG re-encode quality 0.1–1
}

// ── Page dimensions (in points, 1pt = 1/72 inch) ──────────────────

export const PAGE_SIZES: Record<PageSize, [number, number]> = {
  A4: [595.28, 841.89],
  A3: [841.89, 1190.55],
  Letter: [612, 792],
  Legal: [612, 1008],
  fit: [0, 0],   // will be set per-image
};

// ── Helpers ────────────────────────────────────────────────────────

export function uid() { return Math.random().toString(36).slice(2, 10); }
export function fmtSize(kb: number) {
  return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(2)} MB`;
}

// Load image → dataUrl + dimensions
export function loadImageFile(file: File): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new window.Image();
      img.onload = () => resolve({ dataUrl, width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

import PDFLib from './pdf-lib';

// Re-encode image to JPEG at a given quality using Canvas (returns ArrayBuffer)
export async function reencodeImage(dataUrl: string, quality: number): Promise<{ bytes: Uint8Array; mime: string }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(async blob => {
        if (!blob) { reject(new Error("Canvas export failed")); return; }
        const ab = await blob.arrayBuffer();
        resolve({ bytes: new Uint8Array(ab), mime: blob.type });
      }, "image/jpeg", quality);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// ── Build PDF ─────────────────────────────────────────────────────

export async function buildPDF(
  images: ImageFile[],
  opts: ConvertOptions,
  onProgress: (pct: number, idx: number) => void,
): Promise<Uint8Array> {
  const doc = await PDFLib.PDFDocument.create();

  for (let i = 0; i < images.length; i++) {
    onProgress(Math.round((i / images.length) * 90), i);
    const img = images[i];

    // Embed image
    let pdfImage: any;
    const mime = img.file.type || "image/jpeg";
    const isJpeg = mime === "image/jpeg" || mime === "image/jpg";
    const isPng = mime === "image/png";

    let imgBytes: Uint8Array;

    if (isJpeg && opts.quality >= 1.0) {
      // Use original JPEG bytes directly
      imgBytes = new Uint8Array(await img.file.arrayBuffer());
      pdfImage = await doc.embedJpg(imgBytes);
    } else if (isPng && opts.quality >= 1.0) {
      imgBytes = new Uint8Array(await img.file.arrayBuffer());
      pdfImage = await doc.embedPng(imgBytes);
    } else {
      // Re-encode as JPEG (handles WebP, BMP, GIF, and quality reduction)
      const { bytes } = await reencodeImage(img.dataUrl, Math.min(1, opts.quality));
      pdfImage = await doc.embedJpg(bytes);
    }

    // Determine page dimensions
    let pageW: number, pageH: number;
    if (opts.pageSize === "fit") {
      pageW = img.width;
      pageH = img.height;
    } else {
      const [w, h] = PAGE_SIZES[opts.pageSize];
      pageW = opts.orientation === "portrait" ? w : h;
      pageH = opts.orientation === "portrait" ? h : w;
    }

    const page = doc.addPage([pageW, pageH]);
    const m = opts.marginPt;

    // Available area
    const areaW = pageW - m * 2;
    const areaH = pageH - m * 2;

    // Compute draw rect based on fit mode
    let drawX: number, drawY: number, drawW: number, drawH: number;

    const imgAspect = img.width / img.height;
    const areaAspect = areaW / areaH;

    if (opts.imageFit === "fill") {
      drawX = m; drawY = m; drawW = areaW; drawH = areaH;
    } else if (opts.imageFit === "cover") {
      if (imgAspect > areaAspect) {
        drawH = areaH;
        drawW = drawH * imgAspect;
        drawX = m - (drawW - areaW) / 2;
        drawY = m;
      } else {
        drawW = areaW;
        drawH = drawW / imgAspect;
        drawX = m;
        drawY = m - (drawH - areaH) / 2;
      }
    } else if (opts.imageFit === "center") {
      drawW = img.width;
      drawH = img.height;
      drawX = (pageW - drawW) / 2;
      drawY = (pageH - drawH) / 2;
    } else {
      // contain (default)
      if (imgAspect > areaAspect) {
        drawW = areaW;
        drawH = drawW / imgAspect;
        drawX = m;
        drawY = m + (areaH - drawH) / 2;
      } else {
        drawH = areaH;
        drawW = drawH * imgAspect;
        drawX = m + (areaW - drawW) / 2;
        drawY = m;
      }
    }

    // Background fill
    if (opts.backgroundColor !== "transparent") {
      const hex = opts.backgroundColor.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      page.drawRectangle({ x: 0, y: 0, width: pageW, height: pageH, color: PDFLib.rgb(r, g, b) });
    }

    page.drawImage(pdfImage, { x: drawX, y: drawY, width: drawW, height: drawH });

    // Page number
    if (opts.addPageNumbers) {
      try {
        const font = await doc.embedFont(PDFLib.StandardFonts.Helvetica);
        page.drawText(`${i + 1}`, {
          x: pageW / 2 - 6,
          y: 18,
          size: 10,
          font,
          color: PDFLib.rgb(0.5, 0.5, 0.5),
        });
      } catch {/* skip if font embedding fails */ }
    }
  }

  onProgress(98, images.length);
  return doc.save();
}