// ── Repeat engine ─────────────────────────────────────────────────

type SeparatorType = "none" | "space" | "newline" | "comma" | "custom";

export interface RepeatOptions {
  count: number;
  separatorType: SeparatorType;
  customSeparator: string;
  addNumbering: boolean;
  numberingStyle: "1." | "1)" | "[1]";
  trimInput: boolean;
}

const SEPARATOR_MAP: Record<SeparatorType, string> = {
  none: "",
  space: " ",
  newline: "\n",
  comma: ", ",
  custom: "",
};

export function buildOutput(input: string, opts: RepeatOptions): string {
  if (!input || opts.count < 1) return "";

  const text = opts.trimInput ? input.trim() : input;
  const sep =
    opts.separatorType === "custom"
      ? opts.customSeparator
      : SEPARATOR_MAP[opts.separatorType];

  if (opts.addNumbering) {
    const items = Array.from({ length: opts.count }, (_, i) => {
      const n = i + 1;
      let prefix = "";
      if (opts.numberingStyle === "1.") prefix = `${n}. `;
      else if (opts.numberingStyle === "1)") prefix = `${n}) `;
      else prefix = `[${n}] `;
      return prefix + text;
    });
    return items.join(sep);
  }

  return Array.from({ length: opts.count }, () => text).join(sep);
}

// ── Presets ───────────────────────────────────────────────────────

export const countPresets = [2, 3, 5, 10, 20, 50, 100];

export const separatorOptions: { key: SeparatorType; label: string; preview: string }[] = [
  { key: "none", label: "None", preview: "abcabc" },
  { key: "space", label: "Space", preview: "abc abc" },
  { key: "newline", label: "New Line", preview: "abc↵abc" },
  { key: "comma", label: "Comma", preview: "abc, abc" },
  { key: "custom", label: "Custom", preview: "abc…abc" },
];