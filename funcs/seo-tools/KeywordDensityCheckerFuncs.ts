
// ── Types ──────────────────────────────────────────────────────────

interface KeywordResult {
  word: string;
  count: number;
  density: number;  // % of total words
  positions: number[]; // word positions (1-indexed)
  isStopWord: boolean;
}

interface PhraseResult {
  phrase: string;
  count: number;
  density: number;
}

interface TextStats {
  wordCount: number;
  charCount: number;
  charNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordLength: number;
  readTimeMin: number;
}

export type SortKey = "count" | "density" | "alpha";

// ── Stop words ─────────────────────────────────────────────────────

export const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
  "down", "during", "each", "few", "for", "from", "further", "get", "got", "had", "hadn't", "has",
  "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's",
  "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've",
  "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most",
  "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other",
  "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd",
  "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the",
  "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd",
  "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what",
  "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why",
  "why's", "will", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're",
  "you've", "your", "yours", "yourself", "yourselves",
]);

// ── Text analysis ──────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(w => w.length > 1 && /[a-z]/.test(w));
}

export function analyzeText(text: string, minLength: number, includeStopWords: boolean): {
  keywords: KeywordResult[];
  stats: TextStats;
} {
  if (!text.trim()) return {
    keywords: [],
    stats: { wordCount: 0, charCount: 0, charNoSpaces: 0, sentenceCount: 0, paragraphCount: 0, avgWordLength: 0, readTimeMin: 0 },
  };

  const words = tokenize(text);
  const totalWords = words.length;

  // Count frequencies
  const freq = new Map<string, number>();
  const positions = new Map<string, number[]>();

  words.forEach((w, i) => {
    const clean = w.replace(/^[-']+|[-']+$/g, "");
    if (clean.length < minLength) return;
    freq.set(clean, (freq.get(clean) ?? 0) + 1);
    if (!positions.has(clean)) positions.set(clean, []);
    positions.get(clean)!.push(i + 1);
  });

  const keywords: KeywordResult[] = [];
  freq.forEach((count, word) => {
    const isStop = STOP_WORDS.has(word);
    if (!includeStopWords && isStop) return;
    keywords.push({
      word,
      count,
      density: totalWords > 0 ? (count / totalWords) * 100 : 0,
      positions: positions.get(word) ?? [],
      isStopWord: isStop,
    });
  });

  // Stats
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 0).length;
  const chars = text.length;
  const charsNS = text.replace(/\s/g, "").length;
  const avgWL = totalWords > 0 ? words.reduce((s, w) => s + w.length, 0) / totalWords : 0;
  const readTime = totalWords / 200; // ~200 wpm

  return {
    keywords,
    stats: {
      wordCount: totalWords,
      charCount: chars,
      charNoSpaces: charsNS,
      sentenceCount: sentences,
      paragraphCount: Math.max(1, paragraphs),
      avgWordLength: avgWL,
      readTimeMin: readTime,
    },
  };
}

export function extractPhrases(text: string, n: number, topN = 20): PhraseResult[] {
  const words = tokenize(text);
  const total = words.length - (n - 1);
  if (total <= 0) return [];

  const freq = new Map<string, number>();
  for (let i = 0; i <= words.length - n; i++) {
    const phrase = words.slice(i, i + n)
      .map(w => w.replace(/^[-']+|[-']+$/g, ""))
      .join(" ");
    if (phrase.split(" ").some(w => w.length < 2)) continue;
    freq.set(phrase, (freq.get(phrase) ?? 0) + 1);
  }

  return [...freq.entries()]
    .filter(([, c]) => c > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([phrase, count]) => ({
      phrase,
      count,
      density: (count / Math.max(1, words.length)) * 100,
    }));
}