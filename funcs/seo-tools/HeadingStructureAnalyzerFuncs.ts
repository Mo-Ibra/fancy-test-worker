// ── Types ──────────────────────────────────────────────────────────

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type InputMode = "html" | "text";

export interface HeadingEntry {
  level: HeadingLevel;
  text: string;
  id: string | null;
  position: number;        // 1-indexed
  depth: number;        // nesting depth relative to parent
  hasIssue: boolean;
  issues: string[];
}

export interface StructureIssue {
  type: "error" | "warning" | "info";
  message: string;
}

// ── Parse headings from HTML ───────────────────────────────────────

export function parseHtml(html: string): HeadingEntry[] {
  const entries: HeadingEntry[] = [];
  // Match all heading tags h1–h6 with their content
  const re = /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  let pos = 1;

  while ((m = re.exec(html)) !== null) {
    const level = parseInt(m[1]) as HeadingLevel;
    const attrs = m[2];
    const inner = m[3]
      .replace(/<[^>]+>/g, "")   // strip nested tags
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ").trim();

    const idMatch = attrs.match(/id=["']([^"']*)["']/i);
    const id = idMatch ? idMatch[1] : null;

    entries.push({ level, text: inner, id, position: pos++, depth: 0, hasIssue: false, issues: [] });
  }

  return entries;
}

// ── Parse headings from plain text (Markdown-style) ────────────────

export function parseText(text: string): HeadingEntry[] {
  const entries: HeadingEntry[] = [];
  let pos = 1;

  for (const line of text.split("\n")) {
    const trimmed = line.trim();

    // Markdown: # H1, ## H2, ...
    const mdMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (mdMatch) {
      const level = Math.min(6, mdMatch[1].length) as HeadingLevel;
      entries.push({ level, text: mdMatch[2].trim(), id: null, position: pos++, depth: 0, hasIssue: false, issues: [] });
      continue;
    }

    // Setext headings: underline with === or ---
    // (check next line — we'll handle this simplistically)
  }

  return entries;
}

// ── Analyze heading structure ──────────────────────────────────────

export function analyzeHeadings(entries: HeadingEntry[], t: (key: string, params?: Record<string, any>, fallback?: string) => string): {
  processed: HeadingEntry[];
  issues: StructureIssue[];
  stats: Record<HeadingLevel, number>;
} {
  const issues: StructureIssue[] = [];
  const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const processed = entries.map(e => ({ ...e, issues: [] as string[] }));

  if (processed.length === 0) {
    return { processed, issues, stats };
  }

  // Count levels
  for (const e of processed) stats[e.level]++;

  // Rule 1: No H1
  if (stats[1] === 0) {
    issues.push({ type: "error", message: t("issues.noH1Found") });
  }

  // Rule 2: Multiple H1s
  if (stats[1] > 1) {
    issues.push({ type: "warning", message: t("issues.multipleH1Found", { count: stats[1] }) });
  }

  // Rule 3: First heading is not H1
  const firstH = processed[0];
  if (firstH && firstH.level !== 1) {
    issues.push({ type: "warning", message: t("issues.firstNotH1", { level: firstH.level }) });
  }

  // Rule 4: Heading hierarchy skips (e.g. H1 → H3 without H2)
  let prevLevel = 0;
  for (const e of processed) {
    if (prevLevel > 0 && e.level > prevLevel + 1) {
      e.issues.push(t("issues.skipLevelFound", { prevLevel: prevLevel, level: e.level, missing: prevLevel + 1, text: e.text.slice(0, 50) }));
      e.hasIssue = true;
      issues.push({ type: "warning", message: t("issues.skipLevelFound", { prevLevel: prevLevel, level: e.level, missing: prevLevel + 1, text: e.text.slice(0, 50) }) });
    }
    prevLevel = e.level;
  }

  // Rule 5: Empty headings
  for (const e of processed) {
    if (!e.text.trim()) {
      e.issues.push(t("issues.empty"));
      e.hasIssue = true;
      issues.push({ type: "error", message: t("issues.emptyHeadingMessage", { level: e.level, position: e.position }) });
    }
  }

  // Rule 6: Very long headings
  for (const e of processed) {
    if (e.text.length > 70) {
      e.issues.push(t("issues.longHeading", { length: e.text.length }));
      e.hasIssue = true;
      issues.push({ type: "info", message: t("issues.longHeadingMessage", { level: e.level, text: e.text.slice(0, 40), length: e.text.length }) });
    }
  }

  // Rule 7: Duplicate headings
  const seen = new Map<string, number>();
  for (const e of processed) {
    const key = `h${e.level}:${e.text.toLowerCase().trim()}`;
    if (seen.has(key)) {
      e.issues.push(t("issues.duplicate"));
      e.hasIssue = true;
      issues.push({ type: "info", message: t("issues.duplicateMessage", { level: e.level, text: e.text.slice(0, 50) }) });
    }
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }

  // Rule 8: Good structure note
  if (issues.length === 0) {
    issues.push({ type: "info", message: t("issues.goodStructure") });
  }

  return { processed, issues, stats };
}

// ── Compute depth for tree visualization ───────────────────────────

export function computeDepths(entries: HeadingEntry[]): HeadingEntry[] {
  const stack: HeadingLevel[] = [];
  return entries.map(e => {
    // Pop stack until we find parent level
    while (stack.length > 0 && stack[stack.length - 1] >= e.level) stack.pop();
    const depth = stack.length;
    stack.push(e.level);
    return { ...e, depth };
  });
}

export const LEVEL_COLORS: Record<HeadingLevel, { bg: string; text: string; border: string; bar: string; dot: string }> = {
  1: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-400", border: "border-blue-300 dark:border-blue-700", bar: "bg-blue-500", dot: "bg-blue-500" },
  2: { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400", border: "border-violet-300 dark:border-violet-700", bar: "bg-violet-500", dot: "bg-violet-500" },
  3: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-300 dark:border-emerald-700", bar: "bg-emerald-500", dot: "bg-emerald-500" },
  4: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-300 dark:border-amber-700", bar: "bg-amber-500", dot: "bg-amber-500" },
  5: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-300 dark:border-orange-700", bar: "bg-orange-500", dot: "bg-orange-500" },
  6: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", border: "border-red-300 dark:border-red-700", bar: "bg-red-500", dot: "bg-red-500" },
};

export const LEVEL_SIZES: Record<HeadingLevel, string> = {
  1: "text-xl font-black", 2: "text-lg font-bold", 3: "text-base font-bold",
  4: "text-sm font-semibold", 5: "text-sm font-medium", 6: "text-xs font-medium",
};
