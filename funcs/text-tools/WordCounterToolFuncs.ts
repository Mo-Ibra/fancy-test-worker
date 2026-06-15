export function analyze(text: string) {
  const trimmed = text.trim();

  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).filter(Boolean).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed === "" ? 0 : trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = trimmed === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const lines = text === "" ? 0 : text.split("\n").length;
  const readingTime = Math.max(1, Math.ceil(words / 200)); // avg 200 wpm
  const speakingTime = Math.max(1, Math.ceil(words / 130)); // avg 130 wpm

  // Top keywords (exclude stop words)
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "is", "it", "this", "that", "was", "be", "as", "by", "from", "are", "not", "have", "he", "she", "they", "we", "you", "i", "do", "did", "has", "had", "will", "can", "about", "up", "out", "so", "if", "its", "my", "your", "their", "our", "his", "her", "which", "what", "when", "how", "all", "been", "were", "would", "could", "should", "more", "also", "than", "then", "there", "these", "those", "into", "over", "after", "just", "me", "him", "us", "them", "no", "yes", "one", "two", "three", "any", "some", "other", "new", "like", "time", "get", "use", "way", "may", "each", "only"]);
  const wordList = trimmed.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const freq: Record<string, number> = {};
  for (const w of wordList) {
    if (!stopWords.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1;
  }
  const topKeywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  return { words, characters, charactersNoSpaces, sentences, paragraphs, lines, readingTime, speakingTime, topKeywords };
}