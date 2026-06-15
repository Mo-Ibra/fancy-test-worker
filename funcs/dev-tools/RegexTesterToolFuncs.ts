
// ── Types ─────────────────────────────────────────────────────────

export type Flag = "g" | "i" | "m" | "s" | "u" | "d";
export type ViewTab = "matches" | "groups" | "replace" | "cheatsheet";

export interface MatchInfo {
  index: number;
  value: string;
  start: number;
  end: number;
  groups: Record<string, string>;
  indices: [number, number][];
}

// ── Helpers ───────────────────────────────────────────────────────

export const FLAGS_META: { flag: Flag; label: string; description: string }[] = [
  { flag: "g", label: "g", description: "Global — find all matches" },
  { flag: "i", label: "i", description: "Ignore case" },
  { flag: "m", label: "m", description: "Multiline — ^ $ match line edges" },
  { flag: "s", label: "s", description: "Dotall — . matches newline" },
  { flag: "u", label: "u", description: "Unicode — full Unicode support" },
  { flag: "d", label: "d", description: "Indices — capture group positions" },
];

export function buildRegex(pattern: string, flags: Set<Flag>): { re: RegExp; error: string } {
  if (!pattern) return { re: /(?:)/, error: "" };
  try {
    return { re: new RegExp(pattern, [...flags].join("")), error: "" };
  } catch (e: any) {
    return { re: /(?:)/, error: e.message };
  }
}

export function getMatches(re: RegExp, text: string): MatchInfo[] {
  if (!text) return [];
  const results: MatchInfo[] = [];
  const reG = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m: RegExpExecArray | null;
  let guard = 0;
  while ((m = reG.exec(text)) !== null && guard++ < 1000) {
    const groups: Record<string, string> = {};
    if (m.groups) Object.assign(groups, m.groups);
    results.push({
      index: results.length,
      value: m[0],
      start: m.index,
      end: m.index + m[0].length,
      groups,
      indices: (m as any).indices ?? [],
    });
    if (m[0].length === 0) reG.lastIndex++;
  }
  return results;
}

// ── Cheat sheet data ──────────────────────────────────────────────

export const CHEAT_SHEET = [
  {
    section: "Character Classes",
    items: [
      { token: ".", desc: "Any character except newline" },
      { token: "\\w", desc: "Word character [a-zA-Z0-9_]" },
      { token: "\\W", desc: "Non-word character" },
      { token: "\\d", desc: "Digit [0-9]" },
      { token: "\\D", desc: "Non-digit" },
      { token: "\\s", desc: "Whitespace (space, tab, newline)" },
      { token: "\\S", desc: "Non-whitespace" },
      { token: "[abc]", desc: "Character set — a, b, or c" },
      { token: "[^abc]", desc: "Negated set — not a, b, or c" },
      { token: "[a-z]", desc: "Range — a to z" },
    ],
  },
  {
    section: "Anchors",
    items: [
      { token: "^", desc: "Start of string (or line with m flag)" },
      { token: "$", desc: "End of string (or line with m flag)" },
      { token: "\\b", desc: "Word boundary" },
      { token: "\\B", desc: "Non-word boundary" },
    ],
  },
  {
    section: "Quantifiers",
    items: [
      { token: "*", desc: "0 or more (greedy)" },
      { token: "+", desc: "1 or more (greedy)" },
      { token: "?", desc: "0 or 1 (optional)" },
      { token: "{n}", desc: "Exactly n times" },
      { token: "{n,}", desc: "n or more times" },
      { token: "{n,m}", desc: "Between n and m times" },
      { token: "*?", desc: "0 or more (lazy)" },
      { token: "+?", desc: "1 or more (lazy)" },
    ],
  },
  {
    section: "Groups",
    items: [
      { token: "(abc)", desc: "Capturing group" },
      { token: "(?:abc)", desc: "Non-capturing group" },
      { token: "(?<name>abc)", desc: "Named capturing group" },
      { token: "(?=abc)", desc: "Positive lookahead" },
      { token: "(?!abc)", desc: "Negative lookahead" },
      { token: "(?<=abc)", desc: "Positive lookbehind" },
      { token: "(?<!abc)", desc: "Negative lookbehind" },
    ],
  },
  {
    section: "Assertions & Escapes",
    items: [
      { token: "\\n", desc: "Newline" },
      { token: "\\t", desc: "Tab" },
      { token: "\\\\", desc: "Literal backslash" },
      { token: "\\.", desc: "Literal dot" },
      { token: "a|b", desc: "Alternation — a or b" },
    ],
  },
];

export const EXAMPLES = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: new Set<Flag>(["g", "i"]) },
  { label: "URL", pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*", flags: new Set<Flag>(["g", "i"]) },
  { label: "IPv4 Address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: new Set<Flag>(["g"]) },
  { label: "Hex Color", pattern: "#(?:[0-9a-fA-F]{3}){1,2}\\b", flags: new Set<Flag>(["g", "i"]) },
  { label: "Date YYYY-MM-DD", pattern: "\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])", flags: new Set<Flag>(["g"]) },
  { label: "Phone (intl)", pattern: "\\+?\\d[\\d\\s\\-().]{6,}\\d", flags: new Set<Flag>(["g"]) },
  { label: "HTML tag", pattern: "<([a-z][a-z0-9]*)(?:\\s[^>]*)?>.*?<\\/\\1>", flags: new Set<Flag>(["g", "i", "s"]) },
  { label: "Hashtag", pattern: "#[\\w\\u0600-\\u06FF]+", flags: new Set<Flag>(["g", "u"]) },
];

export const SAMPLE_TEXTS: Record<string, string> = {
  "Email": "Contact us at support@example.com or sales@company.org for help.\nAdmin: admin@mysite.co.uk",
  "URL": "Visit https://example.com or http://test.org/path?q=hello for more.\nDocs: https://docs.site.io/guide",
  "IPv4 Address": "Server A: 192.168.1.1\nServer B: 10.0.0.255\nInvalid: 999.999.999.999\nGateway: 172.16.0.1",
  "Hex Color": "Colors: #FF5733, #abc, #00FF00, and also #FFFFFF.\nInvalid: #GGGGGG or #12345",
  "Date YYYY-MM-DD": "Events on 2026-01-15, 2025-12-31, and 2024-06-01.\nInvalid: 2026-13-45",
  "Phone (intl)": "+1 (800) 555-1234\n+20 100 234 5678\n+44 20 7946 0958\n+966 55 123 4567",
  "HTML tag": '<p class="intro">Hello world</p>\n<a href="https://example.com">Click me</a>\n<span>Test</span>',
  "Hashtag": "Trending: #JavaScript #Python #مرحبا #开发者\nPost: Check #WebDev tips! #coding",
};