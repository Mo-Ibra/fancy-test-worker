type DiffOp = "equal" | "insert" | "delete";

export interface DiffPart {
  op: DiffOp;
  text: string;
}

// Simple LCS-based word/char diff
export function diffTexts(a: string, b: string, mode: "words" | "chars" | "lines"): DiffPart[] {
  const tokenize = (s: string) => {
    if (mode === "chars") return s.split("");
    if (mode === "lines") return s.split("\n");
    return s.split(/(\s+)/); // keep whitespace tokens
  };

  const tokA = tokenize(a);
  const tokB = tokenize(b);

  // Build LCS table
  const m = tokA.length;
  const n = tokB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = tokA[i - 1] === tokB[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack
  const parts: DiffPart[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && tokA[i - 1] === tokB[j - 1]) {
      parts.unshift({ op: "equal", text: tokA[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      parts.unshift({ op: "insert", text: tokB[j - 1] });
      j--;
    } else {
      parts.unshift({ op: "delete", text: tokA[i - 1] });
      i--;
    }
  }

  // Merge consecutive same-op parts
  const merged: DiffPart[] = [];
  for (const p of parts) {
    if (merged.length > 0 && merged[merged.length - 1].op === p.op) {
      merged[merged.length - 1].text += p.text;
    } else {
      merged.push({ ...p });
    }
  }
  return merged;
}

export function getStats(parts: DiffPart[]) {
  const added = parts.filter((p) => p.op === "insert").map((p) => p.text).join("").split(/\s+/).filter(Boolean).length;
  const removed = parts.filter((p) => p.op === "delete").map((p) => p.text).join("").split(/\s+/).filter(Boolean).length;
  const unchanged = parts.filter((p) => p.op === "equal").map((p) => p.text).join("").split(/\s+/).filter(Boolean).length;
  const similarity = parts.length === 0 ? 100 : Math.round((unchanged / Math.max(1, unchanged + added + removed)) * 100);
  return { added, removed, unchanged, similarity };
}

// ── View mode ─────────────────────────────────────────────────────

export type ViewMode = "split" | "unified";
export type DiffMode = "words" | "chars" | "lines";


// ── Examples ─────────────────────────────────────────────────────

export const EXAMPLE_A = `The quick brown fox jumps over the lazy dog.
Pack my box with five dozen liquor jugs.
How vexingly quick daft zebras jump.`;

export const EXAMPLE_B = `The quick brown fox leaps over the lazy cat.
Pack my box with five dozen liquor jugs.
How surprisingly quick daft zebras jump today.`;