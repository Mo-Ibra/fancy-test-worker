// ── Slug engine ───────────────────────────────────────────────────

const CHAR_MAP: Record<string, string> = {
  // Latin extended
  à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a", æ: "ae", ç: "c", è: "e", é: "e", ê: "e", ë: "e",
  ì: "i", í: "i", î: "i", ï: "i", ð: "d", ñ: "n", ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ø: "o",
  ù: "u", ú: "u", û: "u", ü: "u", ý: "y", þ: "th", ÿ: "y",
  // German
  ß: "ss",
  // Arabic transliteration (common)
  ا: "a", ب: "b", ت: "t", ث: "th", ج: "j", ح: "h", خ: "kh", د: "d", ذ: "dh", ر: "r", ز: "z",
  س: "s", ش: "sh", ص: "s", ض: "d", ط: "t", ظ: "z", ع: "a", غ: "gh", ف: "f", ق: "q", ك: "k",
  ل: "l", م: "m", ن: "n", ه: "h", و: "w", ي: "y", ى: "a", ة: "h", ء: "",
};

function transliterate(text: string): string {
  return text.split("").map((c) => CHAR_MAP[c] ?? c).join("");
}

export interface SlugOptions {
  separator: "-" | "_" | ".";
  lowercase: boolean;
  transliterate: boolean;
  removeStopWords: boolean;
  maxLength: number | null;
  trim: boolean;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "is",
  "it", "this", "that", "was", "be", "as", "by", "from", "are", "not", "have", "do", "did",
]);

export function generateSlug(input: string, opts: SlugOptions): string {
  let s = input;

  if (opts.transliterate) s = transliterate(s);
  if (opts.lowercase) s = s.toLowerCase();

  // Replace non-alphanumeric with separator
  s = s
    .replace(/[^\w\s-]/g, " ")     // special chars → space
    .replace(/[\s_-]+/g, " ")       // collapse spaces
    .trim();

  // Stop words
  if (opts.removeStopWords) {
    const words = s.split(" ").filter((w) => !STOP_WORDS.has(w.toLowerCase()));
    s = words.join(" ");
  }

  // Join with separator
  s = s.split(" ").filter(Boolean).join(opts.separator);

  // Max length (cut at separator boundary)
  if (opts.maxLength && s.length > opts.maxLength) {
    s = s.slice(0, opts.maxLength);
    const lastSep = s.lastIndexOf(opts.separator);
    if (lastSep > 0) s = s.slice(0, lastSep);
  }

  // Trim leading/trailing separators
  if (opts.trim) {
    const r = new RegExp(`^[${opts.separator}]+|[${opts.separator}]+$`, "g");
    s = s.replace(r, "");
  }

  return s;
}

// ── Examples ──────────────────────────────────────────────────────

export const examples = [
  "How to Build a Next.js App in 2026",
  "10 Best Free Online Tools for Developers",
  "Café au Lait & Crêpes: A French Guide",
  "مقال عن أدوات الإنترنت المجانية",
  "C++ vs. Rust: Which Language Should You Learn?",
  "The Ultimate SEO Guide — Tips, Tricks & More!",
];