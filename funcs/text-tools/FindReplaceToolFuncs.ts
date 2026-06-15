// ── Types ─────────────────────────────────────────────────────────

interface MatchRange {
  start: number;
  end: number;
}

export interface Options {
  caseSensitive: boolean;
  wholeWord: boolean;
  useRegex: boolean;
}

// ── Match engine ──────────────────────────────────────────────────

export function findMatches(text: string, query: string, opts: Options): MatchRange[] {
  if (!query) return [];
  try {
    let flags = "g";
    if (!opts.caseSensitive) flags += "i";

    let pattern = opts.useRegex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (opts.wholeWord && !opts.useRegex) pattern = `\\b${pattern}\\b`;

    const re = new RegExp(pattern, flags);
    const matches: MatchRange[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length });
      if (m[0].length === 0) re.lastIndex++; // avoid infinite loop on zero-width match
    }
    return matches;
  } catch {
    return [];
  }
}

export function applyReplace(text: string, query: string, replacement: string, opts: Options, replaceAll: boolean, activeIdx: number): string {
  if (!query) return text;
  try {
    let flags = replaceAll ? "g" : "";
    if (!opts.caseSensitive) flags += "i";
    let pattern = opts.useRegex ? query : query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (opts.wholeWord && !opts.useRegex) pattern = `\\b${pattern}\\b`;
    if (replaceAll) {
      return text.replace(new RegExp(pattern, flags), replacement);
    } else {
      // replace only the activeIdx-th match
      const matches = findMatches(text, query, opts);
      if (matches.length === 0 || activeIdx >= matches.length) return text;
      const { start, end } = matches[activeIdx];
      return text.slice(0, start) + replacement + text.slice(end);
    }
  } catch {
    return text;
  }
}

// ── Highlighted textarea overlay ─────────────────────────────────

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildHighlightedHTML(text: string, matches: MatchRange[], activeIdx: number): string {
  if (matches.length === 0) return escapeHtml(text).replace(/\n/g, "<br/>");
  let result = "";
  let cursor = 0;
  for (let i = 0; i < matches.length; i++) {
    const { start, end } = matches[i];
    result += escapeHtml(text.slice(cursor, start));
    const isActive = i === activeIdx;
    result += `<mark class="${isActive ? "bg-blue-400 dark:bg-blue-500" : "bg-yellow-200 dark:bg-yellow-700"} text-foreground rounded-[2px]">${escapeHtml(text.slice(start, end))}</mark>`;
    cursor = end;
  }
  result += escapeHtml(text.slice(cursor));
  return result.replace(/\n/g, "<br/>");
}

export const EXAMPLE_TEXT = `The quick brown fox jumps over the lazy dog.
The dog barked at the fox.
A fox is a cunning animal.
The lazy cat slept all day.
Fox and dog are natural rivals.`;