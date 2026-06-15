// ── Wrap engine ───────────────────────────────────────────────────

export type WrapMode = "hard" | "soft";
export type BreakOn = "words" | "chars";

export interface WrapOptions {
  lineWidth: number;
  mode: WrapMode;
  breakOn: BreakOn;
  addLineNumbers: boolean;
  prefix: string;
  suffix: string;
  trimLines: boolean;
  preserveBlankLines: boolean;
}

export function wrapText(input: string, opts: WrapOptions): string {
  if (!input.trim()) return "";

  const lines = input.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = opts.trimLines ? line.trim() : line;

    if (trimmed === "") {
      if (opts.preserveBlankLines) result.push("");
      continue;
    }

    if (opts.breakOn === "words") {
      const words = trimmed.split(/\s+/);
      let current = "";

      for (const word of words) {
        const candidate = current ? current + " " + word : word;
        if (candidate.length <= opts.lineWidth) {
          current = candidate;
        } else {
          if (current) result.push(current);
          // If the word itself is longer than the limit
          if (word.length > opts.lineWidth && opts.mode === "hard") {
            // break the word
            let w = word;
            while (w.length > opts.lineWidth) {
              result.push(w.slice(0, opts.lineWidth));
              w = w.slice(opts.lineWidth);
            }
            current = w;
          } else {
            current = word;
          }
        }
      }
      if (current) result.push(current);
    } else {
      // char mode
      let remaining = trimmed;
      while (remaining.length > opts.lineWidth) {
        result.push(remaining.slice(0, opts.lineWidth));
        remaining = remaining.slice(opts.lineWidth);
      }
      if (remaining) result.push(remaining);
    }
  }

  // Apply prefix / suffix / numbering
  return result
    .map((line, i) => {
      const num = opts.addLineNumbers ? `${String(i + 1).padStart(String(result.length).length, " ")} │ ` : "";
      return `${num}${opts.prefix}${line}${opts.suffix}`;
    })
    .join("\n");
}

export const widthPresets = [
  { label: "40", value: 40, desc: "Narrow / Mobile" },
  { label: "60", value: 60, desc: "Email / SMS" },
  { label: "72", value: 72, desc: "Terminal" },
  { label: "80", value: 80, desc: "Classic / Code" },
  { label: "100", value: 100, desc: "Wide" },
  { label: "120", value: 120, desc: "Extra Wide" },
];

export const EXAMPLE = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.`;
