// ── Types ─────────────────────────────────────────────────────────

export interface Color {
  r: number; g: number; b: number;
  hex: string;
  rgb: string;
  hsl: string;
  count: number;
}

export type ColorFormat = "hex" | "rgb" | "hsl";
export type PaletteSize = 6 | 8 | 12 | 16;

// ── Color math ────────────────────────────────────────────────────

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

export function rgbToHsl(r: number, g: number, b: number): string {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function quantizeColor(r: number, g: number, b: number, bits = 5): string {
  const q = (v: number) => Math.round(v >> (8 - bits)) << (8 - bits);
  return `${q(r)},${q(g)},${q(b)}`;
}

// ── Palette extractor ─────────────────────────────────────────────

export function extractPalette(canvas: HTMLCanvasElement, count: PaletteSize): Color[] {
  const ctx = canvas.getContext("2d")!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
    if (a < 128) continue; // skip transparent
    const key = quantizeColor(r, g, b, 5);
    if (!buckets[key]) buckets[key] = { r, g, b, count: 0 };
    buckets[key].count++;
    // average the actual values
    buckets[key].r = Math.round((buckets[key].r + r) / 2);
    buckets[key].g = Math.round((buckets[key].g + g) / 2);
    buckets[key].b = Math.round((buckets[key].b + b) / 2);
  }

  // Sort by frequency, pick top N with diversity check
  const sorted = Object.values(buckets).sort((a, b) => b.count - a.count);

  const palette: typeof sorted = [];
  for (const color of sorted) {
    if (palette.length >= count) break;
    // ensure minimum distance from existing palette colors
    const tooClose = palette.some((p) => {
      const dr = p.r - color.r, dg = p.g - color.g, db = p.b - color.b;
      return Math.sqrt(dr * dr + dg * dg + db * db) < 30;
    });
    if (!tooClose) palette.push(color);
  }

  // Fill remaining if needed
  if (palette.length < count) {
    for (const color of sorted) {
      if (palette.length >= count) break;
      if (!palette.includes(color)) palette.push(color);
    }
  }

  return palette.map(({ r, g, b, count }) => ({
    r, g, b, count,
    hex: rgbToHex(r, g, b),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: rgbToHsl(r, g, b),
  }));
}