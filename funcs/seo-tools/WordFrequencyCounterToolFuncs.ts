// ── Types ──────────────────────────────────────────────────────────

export type SortKey = "count" | "alpha" | "length" | "density";
export type ViewMode = "table" | "cloud" | "chart";

export interface WordEntry {
  word: string;
  count: number;
  density: number;
  charLen: number;
  firstPos: number;
  positions: number[];
}

// ── Stop words ─────────────────────────────────────────────────────

export const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at",
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can", "can't", "cannot",
  "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each",
  "few", "for", "from", "further", "get", "got", "had", "hadn't", "has", "hasn't", "have", "haven't", "having",
  "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's",
  "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself",
  "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only",
  "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd",
  "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their",
  "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
  "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we",
  "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's",
  "which", "while", "who", "who's", "whom", "why", "why's", "will", "with", "won't", "would", "wouldn't",
  "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "just", "also",
  "like", "even", "still", "back", "may", "might", "shall", "oh", "ok", "okay", "yeah", "yes", "no", "well",
]);

// ── Tokenize ───────────────────────────────────────────────────────

export function tokenize(text: string, minLen: number): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .split(/\s+/)
    .map(w => w.replace(/^[-']+|[-']+$/g, ""))
    .filter(w => w.length >= minLen && /[a-z]/.test(w));
}

// ── Analyze ────────────────────────────────────────────────────────

export function analyzeWords(
  text: string,
  minLen: number,
  excludeStop: boolean,
  customIgnore: string[],
): WordEntry[] {
  if (!text.trim()) return [];

  const tokens = tokenize(text, minLen);
  const total = tokens.length;
  if (!total) return [];

  const freq = new Map<string, number>();
  const firstPos = new Map<string, number>();
  const positions = new Map<string, number[]>();

  tokens.forEach((w, i) => {
    if (excludeStop && STOP_WORDS.has(w)) return;
    if (customIgnore.includes(w)) return;
    freq.set(w, (freq.get(w) ?? 0) + 1);
    if (!firstPos.has(w)) firstPos.set(w, i + 1);
    if (!positions.has(w)) positions.set(w, []);
    positions.get(w)!.push(i + 1);
  });

  return [...freq.entries()].map(([word, count]) => ({
    word,
    count,
    density: (count / total) * 100,
    charLen: word.length,
    firstPos: firstPos.get(word) ?? 0,
    positions: positions.get(word) ?? [],
  }));
}

// ── Sort ───────────────────────────────────────────────────────────

export function sortEntries(entries: WordEntry[], key: SortKey, asc: boolean): WordEntry[] {
  const sorted = [...entries].sort((a, b) => {
    switch (key) {
      case "count": return b.count - a.count;
      case "alpha": return a.word.localeCompare(b.word);
      case "length": return b.charLen - a.charLen;
      case "density": return b.density - a.density;
      default: return 0;
    }
  });
  return asc && key !== "count" && key !== "density" ? sorted.reverse() : sorted;
}

// ── Helpers ────────────────────────────────────────────────────────

export function fmtDensity(d: number): string {
  return d < 0.01 ? "<0.01%" : `${d.toFixed(2)}%`;
}

export function getDensityColor(d: number): string {
  if (d >= 4) return "text-red-500";
  if (d >= 2.5) return "text-amber-500";
  if (d >= 0.5) return "text-emerald-500";
  return "text-muted-foreground/60";
}

export function getBarColor(d: number): string {
  if (d >= 4) return "bg-red-400";
  if (d >= 2.5) return "bg-amber-400";
  if (d >= 0.5) return "bg-blue-400";
  return "bg-muted-foreground/30";
}

export function cloudSize(count: number, max: number): number {
  const ratio = count / Math.max(1, max);
  return Math.round(10 + ratio * 28); // 10px – 38px
}

export function cloudColor(count: number, max: number): string {
  const ratio = count / Math.max(1, max);
  if (ratio > 0.7) return "#3b82f6";
  if (ratio > 0.4) return "#8b5cf6";
  if (ratio > 0.2) return "#06b6d4";
  return "#94a3b8";
}