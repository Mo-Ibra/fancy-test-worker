
// ── Types ─────────────────────────────────────────────────────────

export type IndentSize = 2 | 4 | 8;
export type ViewMode = "formatted" | "tree" | "minified";

export interface ParseResult {
  ok: boolean;
  value?: unknown;
  error?: string;
  errorLine?: number;
}

// ── Parser ────────────────────────────────────────────────────────

export function parseJSON(raw: string): ParseResult {
  if (!raw.trim()) return { ok: false, error: "Input is empty" };
  try {
    const value = JSON.parse(raw);
    return { ok: true, value };
  } catch (e: any) {
    // Try to extract line number from error message
    const match = e.message?.match(/position (\d+)/);
    let errorLine: number | undefined;
    if (match) {
      const pos = Number(match[1]);
      errorLine = raw.slice(0, pos).split("\n").length;
    }
    return { ok: false, error: e.message, errorLine };
  }
}

export function formatJSON(value: unknown, indent: IndentSize): string {
  return JSON.stringify(value, null, indent);
}

export function minifyJSON(value: unknown): string {
  return JSON.stringify(value);
}

export function countNodes(value: unknown): number {
  if (value === null || typeof value !== "object") return 1;
  if (Array.isArray(value)) return 1 + value.reduce((s, v) => s + countNodes(v), 0);
  return 1 + Object.values(value as Record<string, any>).reduce((s, v) => s + countNodes(v), 0);
}

export function getType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

export const EXAMPLES = [
  {
    label: "User Object",
    value: `{"id":1,"name":"Alice","email":"alice@example.com","roles":["admin","editor"],"active":true,"address":{"city":"Cairo","country":"Egypt"}}`,
  },
  {
    label: "API Response",
    value: `{"status":"success","code":200,"data":{"users":[{"id":1,"name":"Alice"},{"id":2,"name":"Bob"}],"total":2,"page":1},"timestamp":"2026-03-12T10:00:00Z"}`,
  },
  {
    label: "Config File",
    value: `{"app":"MyApp","version":"1.0.0","debug":false,"database":{"host":"localhost","port":5432,"name":"mydb"},"features":{"darkMode":true,"notifications":false}}`,
  },
];