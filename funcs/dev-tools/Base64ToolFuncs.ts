// ── Types ─────────────────────────────────────────────────────────

export type Mode = "encode" | "decode";
export type InputType = "text" | "file";
export type Variant = "standard" | "urlsafe" | "mime";

// ── Helpers ───────────────────────────────────────────────────────

export function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function encodeBase64(text: string, variant: Variant): string {
  try {
    const encoded = btoa(unescape(encodeURIComponent(text)));
    if (variant === "urlsafe") return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
    if (variant === "mime") return encoded.match(/.{1,76}/g)?.join("\r\n") ?? encoded;
    return encoded;
  } catch {
    throw new Error("Encoding failed — input may contain unsupported characters.");
  }
}

export function decodeBase64(b64: string, variant: Variant): string {
  try {
    let cleaned = b64.trim().replace(/\s/g, "");
    if (variant === "urlsafe") {
      cleaned = cleaned.replace(/-/g, "+").replace(/_/g, "/");
      const pad = cleaned.length % 4;
      if (pad) cleaned += "=".repeat(4 - pad);
    }
    return decodeURIComponent(escape(atob(cleaned)));
  } catch {
    throw new Error("Decoding failed — input is not valid Base64.");
  }
}

export function encodeFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

export function b64ToBlob(b64: string, mime = "application/octet-stream"): Blob {
  const binary = atob(b64.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function sniffMime(b64: string): string {
  try {
    const binary = atob(b64.replace(/\s/g, "").slice(0, 12));
    const b = (i: number) => binary.charCodeAt(i);
    if (b(0) === 0xFF && b(1) === 0xD8) return "image/jpeg";
    if (b(0) === 0x89 && b(1) === 0x50 && b(2) === 0x4E) return "image/png";
    if (b(0) === 0x47 && b(1) === 0x49 && b(2) === 0x46) return "image/gif";
    if (b(0) === 0x52 && b(4) === 0x57 && b(8) === 0x57) return "image/webp";
    if (b(0) === 0x25 && b(1) === 0x50 && b(2) === 0x44) return "application/pdf";
    if (b(0) === 0x50 && b(1) === 0x4B) return "application/zip";
  } catch { }
  return "application/octet-stream";
}

export const VARIANT_INFO: Record<Variant, { label: string; description: string }> = {
  standard: { label: "Standard", description: "RFC 4648 — uses + / and = padding" },
  urlsafe: { label: "URL-safe", description: "RFC 4648 §5 — uses - _ no padding" },
  mime: { label: "MIME", description: "76-char lines with CRLF line breaks" },
};

export const EXAMPLES = [
  { label: "Hello World", value: "Hello, World!" },
  { label: "JSON string", value: '{"name":"Alice","age":30}' },
  { label: "URL", value: "https://example.com/path?q=hello world&lang=en" },
  { label: "Arabic text", value: "مرحباً بالعالم" },
];
