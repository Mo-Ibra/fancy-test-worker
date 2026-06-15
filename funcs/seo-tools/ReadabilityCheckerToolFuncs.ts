
// ══════════════════════════════════════════════════════════════════
// READABILITY ALGORITHMS
// ══════════════════════════════════════════════════════════════════

export interface TextMetrics {
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  charCount: number;
  charNoSpaces: number;
  paragraphCount: number;
  avgWordsPerSent: number;
  avgSyllPerWord: number;
  avgCharsPerWord: number;
  longWordCount: number;   // words ≥ 7 chars
  complexWordCount: number;   // words ≥ 3 syllables
  uniqueWordCount: number;
  sentences: string[];
  words: string[];
  longSentences: string[]; // sentences > 25 words
}

// ── Count syllables (English heuristic) ───────────────────────────
export function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const m = word.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
}

// ── Core metrics ───────────────────────────────────────────────────
export function extractMetrics(text: string): TextMetrics {
  const blank: TextMetrics = {
    wordCount: 0, sentenceCount: 0, syllableCount: 0, charCount: 0, charNoSpaces: 0,
    paragraphCount: 0, avgWordsPerSent: 0, avgSyllPerWord: 0, avgCharsPerWord: 0,
    longWordCount: 0, complexWordCount: 0, uniqueWordCount: 0,
    sentences: [], words: [], longSentences: [],
  };
  if (!text.trim()) return blank;

  // Sentences
  const sentences = text
    .split(/(?<=[.!?])\s+(?=[A-Z"'])|(?<=[.!?])$/)
    .map(s => s.trim())
    .filter(s => s.length > 3 && /\w/.test(s));

  // Words
  const words = text.toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 0 && /[a-z]/.test(w));

  const syllableCount = words.reduce((s, w) => s + countSyllables(w), 0);
  const longWords = words.filter(w => w.replace(/[^a-z]/g, "").length >= 7);
  const complexWords = words.filter(w => countSyllables(w) >= 3);
  const uniqueWords = new Set(words).size;
  const longSentences = sentences.filter(s => {
    const wc = s.split(/\s+/).filter(Boolean).length;
    return wc > 25;
  });

  const wc = words.length;
  const sc = Math.max(1, sentences.length);

  return {
    wordCount: wc,
    sentenceCount: sc,
    syllableCount,
    charCount: text.length,
    charNoSpaces: text.replace(/\s/g, "").length,
    paragraphCount: Math.max(1, text.split(/\n{2,}/).filter(p => p.trim()).length),
    avgWordsPerSent: wc / sc,
    avgSyllPerWord: wc > 0 ? syllableCount / wc : 0,
    avgCharsPerWord: wc > 0 ? text.replace(/\s/g, "").length / wc : 0,
    longWordCount: longWords.length,
    complexWordCount: complexWords.length,
    uniqueWordCount: uniqueWords,
    sentences,
    words,
    longSentences,
  };
}

// ── Flesch Reading Ease ───────────────────────────────────────────
// Score 0–100: higher = easier
export function fleschReadingEase(m: TextMetrics): number {
  if (m.wordCount === 0) return 0;
  return 206.835
    - 1.015 * (m.wordCount / m.sentenceCount)
    - 84.6 * (m.syllableCount / m.wordCount);
}

export function fleschLabel(score: number): { label: string; grade: string; audience: string; color: string } {
  if (score >= 90) return { label: "Very Easy", grade: "5th grade", audience: "Anyone", color: "text-emerald-500" };
  if (score >= 80) return { label: "Easy", grade: "6th grade", audience: "General public", color: "text-emerald-500" };
  if (score >= 70) return { label: "Fairly Easy", grade: "7th grade", audience: "General public", color: "text-blue-500" };
  if (score >= 60) return { label: "Standard", grade: "8th–9th grade", audience: "General public", color: "text-blue-500" };
  if (score >= 50) return { label: "Fairly Hard", grade: "10th–12th", audience: "Some high school+", color: "text-amber-500" };
  if (score >= 30) return { label: "Hard", grade: "College", audience: "College educated", color: "text-amber-500" };
  return { label: "Very Confusing", grade: "College grad", audience: "Professionals only", color: "text-red-500" };
}

// ── Flesch-Kincaid Grade Level ────────────────────────────────────
export function fleschKincaidGrade(m: TextMetrics): number {
  if (m.wordCount === 0) return 0;
  return 0.39 * (m.wordCount / m.sentenceCount)
    + 11.8 * (m.syllableCount / m.wordCount)
    - 15.59;
}

// ── Gunning Fog Index ─────────────────────────────────────────────
export function gunningFog(m: TextMetrics): number {
  if (m.wordCount === 0) return 0;
  return 0.4 * (
    (m.wordCount / m.sentenceCount) +
    100 * (m.complexWordCount / m.wordCount)
  );
}

// ── SMOG Index ────────────────────────────────────────────────────
export function smogIndex(m: TextMetrics): number {
  if (m.sentenceCount < 30) return 0; // needs 30+ sentences
  return 1.0430 * Math.sqrt(m.complexWordCount * (30 / m.sentenceCount)) + 3.1291;
}

// ── Coleman-Liau Index ────────────────────────────────────────────
export function colemanLiau(m: TextMetrics): number {
  if (m.wordCount === 0) return 0;
  const L = (m.charNoSpaces / m.wordCount) * 100;
  const S = (m.sentenceCount / m.wordCount) * 100;
  return 0.0588 * L - 0.296 * S - 15.8;
}

// ── Automated Readability Index ───────────────────────────────────
export function automatedReadability(m: TextMetrics): number {
  if (m.wordCount === 0) return 0;
  return 4.71 * (m.charNoSpaces / m.wordCount)
    + 0.5 * (m.wordCount / m.sentenceCount)
    - 21.43;
}

// ── Linsear Write Formula ─────────────────────────────────────────
export function linsearWrite(m: TextMetrics): number {
  if (m.wordCount === 0 || m.sentenceCount === 0) return 0;
  // Use first 100 words
  const sample = m.words.slice(0, 100);
  const easyWords = sample.filter(w => countSyllables(w) <= 2).length;
  const hardWords = sample.filter(w => countSyllables(w) >= 3).length;
  const rawScore = (easyWords * 1 + hardWords * 3) / m.sentenceCount;
  return rawScore > 20 ? rawScore / 2 : rawScore / 2 - 1;
}

// ── Dale-Chall Readability ────────────────────────────────────────
// Simplified: uses % of unfamiliar words (non-common 3000 words)
// We approximate by checking word length as proxy
export function daleChall(m: TextMetrics): number {
  if (m.wordCount === 0) return 0;
  // Approximate: words >8 chars are "difficult"
  const difficult = m.words.filter(w => w.replace(/[^a-z]/g, "").length > 8).length;
  const pctDiff = (difficult / m.wordCount) * 100;
  const raw = 0.1579 * pctDiff + 0.0496 * (m.wordCount / m.sentenceCount);
  return pctDiff > 5 ? raw + 3.6365 : raw;
}

// ── Grade level to age/description ───────────────────────────────
export function gradeToDesc(grade: number): string {
  const g = Math.round(grade);
  if (g <= 0) return "Elementary (Kindergarten)";
  if (g <= 3) return `Elementary (Grade ${g})`;
  if (g <= 5) return `Elementary (Grade ${g})`;
  if (g <= 8) return `Middle School (Grade ${g})`;
  if (g <= 12) return `High School (Grade ${g})`;
  if (g <= 14) return "Undergraduate";
  return "Graduate / Professional";
}

// ── Sentiment (very basic) ────────────────────────────────────────
const POSITIVE_WORDS = new Set(["good", "great", "excellent", "amazing", "wonderful", "best", "love", "perfect", "easy", "clear", "helpful", "simple", "fast", "efficient", "strong", "beautiful", "outstanding", "fantastic", "impressive", "innovative"]);
const NEGATIVE_WORDS = new Set(["bad", "worst", "poor", "terrible", "awful", "confusing", "difficult", "hard", "slow", "broken", "wrong", "fail", "problem", "issue", "error", "boring", "complicated", "unclear", "negative", "weak"]);

export function sentimentScore(words: string[]): number {
  let pos = 0, neg = 0;
  words.forEach(w => {
    if (POSITIVE_WORDS.has(w)) pos++;
    if (NEGATIVE_WORDS.has(w)) neg++;
  });
  const total = pos + neg;
  if (total === 0) return 0;
  return (pos - neg) / total;
}

// ── Top words ─────────────────────────────────────────────────────
const STOP_WORDS = new Set(["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "is", "are", "was", "were", "be", "been", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "that", "this", "it", "its", "as", "so", "if", "not", "we", "you", "he", "she", "they", "i", "me", "my", "our", "your", "his", "her", "their", "what", "who", "how", "when", "where", "which", "all", "also", "just", "more", "some", "than", "then", "there", "these", "those", "up", "can", "into", "about", "after", "before", "much", "many", "any", "each", "very", "over", "even", "such", "same", "most", "own", "like", "well", "get", "use", "new", "one", "two", "may", "yet", "still", "only", "both"]);

export function topWords(words: string[], n = 10): { word: string; count: number }[] {
  const freq = new Map<string, number>();
  words.forEach(w => {
    const clean = w.replace(/[^a-z]/g, "");
    if (clean.length >= 3 && !STOP_WORDS.has(clean)) {
      freq.set(clean, (freq.get(clean) ?? 0) + 1);
    }
  });
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}