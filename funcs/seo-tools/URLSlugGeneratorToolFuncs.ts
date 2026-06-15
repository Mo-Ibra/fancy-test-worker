// Character map for transliteration
export const CHAR_MAP: Record<string, string> = {
  à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a", æ: "ae", ç: "c", è: "e", é: "e", ê: "e", ë: "e",
  ì: "i", í: "i", î: "i", ï: "i", ð: "d", ñ: "n", ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ø: "o",
  ù: "u", ú: "u", û: "u", ü: "u", ý: "y", þ: "th", ß: "ss",
  À: "a", Á: "a", Â: "a", Ã: "a", Ä: "a", Å: "a", Æ: "ae", Ç: "c", È: "e", É: "e", Ê: "e", Ë: "e",
  Ì: "i", Í: "i", Î: "i", Ï: "i", Ð: "d", Ñ: "n", Ò: "o", Ó: "o", Ô: "o", Õ: "o", Ö: "o", Ø: "o",
  Ù: "u", Ú: "u", Û: "u", Ü: "u", Ý: "y", Þ: "th", œ: "oe", Œ: "oe",
  "\u0627": "a", "\u0623": "a", "\u0625": "i", "\u0622": "a", "\u0628": "b", "\u062a": "t",
  "\u062b": "th", "\u062c": "j", "\u062d": "h", "\u062e": "kh", "\u062f": "d",
  "\u0630": "dh", "\u0631": "r", "\u0632": "z", "\u0633": "s", "\u0634": "sh",
  "\u0635": "s", "\u0636": "d", "\u0637": "t", "\u0638": "z", "\u0639": "a",
  "\u063a": "gh", "\u0641": "f", "\u0642": "q", "\u0643": "k", "\u0644": "l",
  "\u0645": "m", "\u0646": "n", "\u0647": "h", "\u0648": "w", "\u064a": "y",
  "\u0649": "a", "\u0629": "h", "\u0626": "y", "\u0624": "w", "\u0621": "",
  "&": "and", "@": "at", "%": "percent", "$": "dollar", "#": "hash",
};

export const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "up", "about", "into", "is", "are", "was", "were", "be", "been",
  "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
]);

export interface SlugOptions {
  separator: "-" | "_" | "." | "/";
  lowercase: boolean;
  maxLength: number | null;
  removeStopWords: boolean;
  trim: boolean;
  customReplace: string;
}

export function generateSlug(input: string, opts: SlugOptions): string {
  if (!input.trim()) return "";
  let s = input;
  if (opts.customReplace.trim()) {
    opts.customReplace.split("\n").forEach(line => {
      const eq = line.indexOf("=");
      if (eq > 0) {
        const from = line.slice(0, eq).trim();
        const to = line.slice(eq + 1).trim();
        if (from) s = s.split(from).join(to);
      }
    });
  }
  s = s.split("").map(c => CHAR_MAP[c] !== undefined ? CHAR_MAP[c] : c).join("");
  if (opts.lowercase) s = s.toLowerCase();
  if (opts.removeStopWords)
    s = s.split(/\s+/).filter(w => !STOP_WORDS.has(w.toLowerCase())).join(" ");
  const sep = opts.separator;
  s = s.replace(/[^\w\s-]/g, " ").replace(/[\s_]+/g, " ").trim();
  s = s.replace(/\s+/g, sep);
  if (sep !== "/") {
    const e = sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    s = s.replace(new RegExp(e + "+", "g"), sep);
    if (opts.trim) s = s.replace(new RegExp("^" + e + "+|" + e + "+$", "g"), "");
  }
  if (opts.maxLength && s.length > opts.maxLength) {
    const cut = s.slice(0, opts.maxLength);
    const last = cut.lastIndexOf(sep);
    s = last > 0 ? cut.slice(0, last) : cut;
  }
  return s;
}

export function analyzeSlug(slug: string, t?: any) {
  const tips: string[] = [];
  const length = slug.length;
  const wordCount = slug.split(/[-_./]/).filter(Boolean).length;
  if (/[A-Z]/.test(slug)) tips.push(t ? t("analysis.containsUppercase") : "Contains uppercase — lowercase is better");
  if (/[^a-z0-9\-_.\/]/.test(slug)) tips.push(t ? t("analysis.containsSpecial") : "Contains special characters");
  if (/\s/.test(slug)) tips.push(t ? t("analysis.containsSpaces") : "Contains spaces");
  if (length > 75) tips.push(t ? t("analysis.tooLong") : "Over 75 chars — consider shortening");
  if (wordCount > 6) tips.push(t ? t("analysis.tooManyWords") : "Over 6 words — shorter slugs rank better");
  const score = tips.length === 0 ? "good" : tips.length === 1 ? "ok" : "poor";
  return { length, wordCount, tips, score: score as "good" | "ok" | "poor" };
}