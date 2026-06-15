// ── Types ─────────────────────────────────────────────────────────

export type OutputWrapper = "raw" | "dataurl" | "css" | "html" | "markdown";
export type Mode = "encode" | "decode";

export interface ImageInfo {
  name: string;
  type: string;
  sizeKb: number;
  width: number;
  height: number;
  dataUrl: string;
  base64: string; // without data: prefix
}

// ── Helpers ───────────────────────────────────────────────────────

export function fmtSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb} KB`;
}

export function b64Size(base64: string): number {
  return Math.round((base64.length * 3) / 4 / 1024);
}

export function getWrapper(info: ImageInfo, wrapper: OutputWrapper): string {
  const { dataUrl, base64, type, name } = info;
  switch (wrapper) {
    case "raw": return base64;
    case "dataurl": return dataUrl;
    case "css": return `background-image: url("${dataUrl}");`;
    case "html": return `<img src="${dataUrl}" alt="${name}" />`;
    case "markdown": return `![${name}](${dataUrl})`;
    default: return base64;
  }
}

export async function fileToInfo(file: File): Promise<ImageInfo> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      const img = new window.Image();
      img.onload = () => resolve({
        name: file.name,
        type: file.type,
        sizeKb: Math.round(file.size / 1024),
        width: img.naturalWidth,
        height: img.naturalHeight,
        dataUrl,
        base64,
      });
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function decodeBase64(raw: string): { dataUrl: string; type: string; sizeKb: number } | null {
  try {
    let cleaned = raw.trim();
    // If already a data URL, extract parts
    if (cleaned.startsWith("data:")) {
      const match = cleaned.match(/^data:([^;]+);base64,([\s\S]+)$/);
      if (!match) return null;
      return { dataUrl: cleaned, type: match[1], sizeKb: b64Size(match[2]) };
    }
    // Raw base64 — assume JPEG if can't determine
    const binary = atob(cleaned);
    // Sniff file type from magic bytes
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    let type = "image/jpeg";
    if (bytes[0] === 0x89 && bytes[1] === 0x50) type = "image/png";
    else if (bytes[0] === 0x47 && bytes[1] === 0x49) type = "image/gif";
    else if (bytes[0] === 0x52 && bytes[4] === 0x57) type = "image/webp";
    const dataUrl = `data:${type};base64,${cleaned}`;
    return { dataUrl, type, sizeKb: b64Size(cleaned) };
  } catch {
    return null;
  }
}

export const wrapperOptions: { key: OutputWrapper; label: string; preview: string }[] = [
  { key: "raw", label: "Raw Base64", preview: "/9j/4AAQSkZJRgAB..." },
  { key: "dataurl", label: "Data URL", preview: "data:image/jpeg;base64,..." },
  { key: "css", label: "CSS", preview: "background-image: url(...);" },
  { key: "html", label: "HTML <img>", preview: '<img src="data:..." />' },
  { key: "markdown", label: "Markdown", preview: "![name](data:...)" },
];