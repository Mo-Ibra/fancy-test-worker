
// ── Types ──────────────────────────────────────────────────────────

export type AngleMode = "DEG" | "RAD" | "GRAD";
export type CalcMode = "basic" | "scientific";

export interface HistoryEntry {
  expression: string;
  result: string;
  ts: number;
}

// ── Tokenizer / Parser / Evaluator ───────────────────────────────

/*
  Grammar:
  expr   → addSub
  addSub → mulDiv (('+' | '-') mulDiv)*
  mulDiv → unary (('*' | '/' | '%') unary)*
  unary  → '-' unary | power
  power  → postfix ('^' unary)*
  postfix→ primary ('!')*
  primary→ number | '(' expr ')' | func '(' expr ')' | const
*/

export function tokenize(src: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (/\s/.test(ch)) { i++; continue; }
    // Number (including scientific notation)
    if (/[\d.]/.test(ch)) {
      let num = "";
      while (i < src.length && /[\d.eE+\-]/.test(src[i])) {
        if ((src[i] === "+" || src[i] === "-") && !/[eE]/.test(src[i - 1] ?? "")) break;
        num += src[i++];
      }
      tokens.push(num);
      continue;
    }
    // Multi-char tokens
    const rest = src.slice(i);
    const funcs = ["asin", "acos", "atan", "sinh", "cosh", "tanh", "asinh", "acosh", "atanh",
      "sin", "cos", "tan", "log2", "log10", "log", "ln", "sqrt", "cbrt", "abs",
      "ceil", "floor", "round", "sign", "exp", "nCr", "nPr"];
    const consts = ["π", "pi", "e", "phi", "Inf", "inf"];
    const matched = [...funcs, ...consts].find(f => rest.toLowerCase().startsWith(f.toLowerCase()));
    if (matched) {
      tokens.push(src.slice(i, i + matched.length));
      i += matched.length;
      continue;
    }
    // Single chars
    tokens.push(ch);
    i++;
  }
  return tokens;
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("n! requires non-negative integer");
  if (n > 170) return Infinity;
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}

export function nCr(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) throw new Error("Invalid nCr");
  return factorial(n) / (factorial(r) * factorial(n - r));
}

export function nPr(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) throw new Error("Invalid nPr");
  return factorial(n) / factorial(n - r);
}

export class Parser {
  private tokens: string[];
  private pos: number = 0;
  private angleMode: AngleMode;

  constructor(tokens: string[], angleMode: AngleMode) {
    this.tokens = tokens;
    this.angleMode = angleMode;
  }

  private peek(): string | undefined { return this.tokens[this.pos]; }
  private consume(): string { return this.tokens[this.pos++]; }
  private match(t: string): boolean {
    if (this.peek() === t) { this.pos++; return true; }
    return false;
  }

  private toRad(v: number): number {
    if (this.angleMode === "RAD") return v;
    if (this.angleMode === "DEG") return v * Math.PI / 180;
    return v * Math.PI / 200; // GRAD
  }
  private fromRad(v: number): number {
    if (this.angleMode === "RAD") return v;
    if (this.angleMode === "DEG") return v * 180 / Math.PI;
    return v * 200 / Math.PI;
  }

  parse(): number {
    const result = this.expr();
    if (this.pos < this.tokens.length) throw new Error(`Unexpected token: ${this.peek()}`);
    return result;
  }

  private expr(): number { return this.addSub(); }

  private addSub(): number {
    let left = this.mulDiv();
    while (true) {
      if (this.match("+")) left += this.mulDiv();
      else if (this.match("-")) left -= this.mulDiv();
      else break;
    }
    return left;
  }

  private mulDiv(): number {
    let left = this.unary();
    while (true) {
      if (this.match("×") || this.match("*")) left *= this.unary();
      else if (this.match("÷") || this.match("/")) left /= this.unary();
      else if (this.match("%")) { const r = this.unary(); left = left % r; }
      else break;
    }
    return left;
  }

  private unary(): number {
    if (this.match("-")) return -this.power();
    this.match("+");
    return this.power();
  }

  private power(): number {
    let base = this.postfix();
    if (this.match("^")) {
      const exp = this.unary();
      base = Math.pow(base, exp);
    }
    return base;
  }

  private postfix(): number {
    let v = this.primary();
    while (this.match("!")) v = factorial(v);
    return v;
  }

  private primary(): number {
    const t = this.peek();
    if (t === undefined) throw new Error("Unexpected end of expression");

    // Parenthesized expression
    if (t === "(") {
      this.consume();
      const v = this.expr();
      if (!this.match(")")) throw new Error("Missing closing parenthesis");
      return v;
    }

    // Constants
    if (t === "π" || t?.toLowerCase() === "pi") { this.consume(); return Math.PI; }
    if (t === "e" && !/\d/.test(this.tokens[this.pos + 1] ?? "")) { this.consume(); return Math.E; }
    if (t?.toLowerCase() === "phi") { this.consume(); return 1.6180339887; }
    if (t?.toLowerCase() === "inf" || t?.toLowerCase() === "infinity") { this.consume(); return Infinity; }

    // Functions
    const funcs: Record<string, (a: number, b?: number) => number> = {
      sin: v => Math.sin(this.toRad(v)),
      cos: v => Math.cos(this.toRad(v)),
      tan: v => Math.tan(this.toRad(v)),
      asin: v => this.fromRad(Math.asin(v)),
      acos: v => this.fromRad(Math.acos(v)),
      atan: v => this.fromRad(Math.atan(v)),
      sinh: v => Math.sinh(v),
      cosh: v => Math.cosh(v),
      tanh: v => Math.tanh(v),
      asinh: v => Math.asinh(v),
      acosh: v => Math.acosh(v),
      atanh: v => Math.atanh(v),
      sqrt: v => Math.sqrt(v),
      cbrt: v => Math.cbrt(v),
      log: v => Math.log10(v),
      log10: v => Math.log10(v),
      log2: v => Math.log2(v),
      ln: v => Math.log(v),
      abs: v => Math.abs(v),
      ceil: v => Math.ceil(v),
      floor: v => Math.floor(v),
      round: v => Math.round(v),
      sign: v => Math.sign(v),
      exp: v => Math.exp(v),
      nCr: (n, r) => nCr(n, r!),
      nPr: (n, r) => nPr(n, r!),
    };

    const lk = t?.toLowerCase();
    const fnKey = Object.keys(funcs).find(k => k.toLowerCase() === lk);
    if (fnKey) {
      this.consume();
      if (!this.match("(")) throw new Error(`Expected '(' after ${fnKey}`);
      const arg1 = this.expr();
      let arg2: number | undefined;
      if (this.match(",")) arg2 = this.expr();
      if (!this.match(")")) throw new Error(`Missing ')' for ${fnKey}`);
      return funcs[fnKey](arg1, arg2);
    }

    // Number
    if (/^-?[\d.eE]/.test(t ?? "")) {
      this.consume();
      const n = parseFloat(t);
      if (isNaN(n)) throw new Error(`Invalid number: ${t}`);
      return n;
    }

    throw new Error(`Unknown token: ${t}`);
  }
}

export function evaluate(expr: string, angleMode: AngleMode): string {
  const cleaned = expr
    .replace(/×/g, "*").replace(/÷/g, "/")
    .replace(/\u2212/g, "-")  // minus sign
    .replace(/π/g, "π")
    .trim();

  if (!cleaned) return "";

  try {
    const tokens = tokenize(cleaned);
    const parser = new Parser(tokens, angleMode);
    const result = parser.parse();

    if (isNaN(result)) return "Error: Result is NaN";
    if (!isFinite(result)) return result > 0 ? "Infinity" : "-Infinity";

    // Format result smartly
    if (Number.isInteger(result) && Math.abs(result) < 1e15) return String(result);
    const s = parseFloat(result.toPrecision(12));
    return String(s);
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

// ── Button definitions ─────────────────────────────────────────────

export interface CalcBtn {
  label: string;
  value?: string;
  action?: string;
  wide?: boolean;
  color?: "blue" | "orange" | "dark" | "red" | "green" | "gray";
  sciOnly?: boolean;
}

export const SCIENTIFIC_ROWS: CalcBtn[][] = [
  [
    { label: "2nd", action: "2nd", color: "gray" },
    { label: "π", value: "π", color: "gray" },
    { label: "e", value: "e", color: "gray" },
    { label: "φ", value: "phi", color: "gray" },
    { label: "Ans", action: "ans", color: "gray" },
  ],
  [
    { label: "sin", value: "sin(", color: "gray" },
    { label: "cos", value: "cos(", color: "gray" },
    { label: "tan", value: "tan(", color: "gray" },
    { label: "log", value: "log(", color: "gray" },
    { label: "ln", value: "ln(", color: "gray" },
  ],
  [
    { label: "asin", value: "asin(", color: "gray", sciOnly: true },
    { label: "acos", value: "acos(", color: "gray", sciOnly: true },
    { label: "atan", value: "atan(", color: "gray", sciOnly: true },
    { label: "log₂", value: "log2(", color: "gray", sciOnly: true },
    { label: "√", value: "sqrt(", color: "gray" },
  ],
  [
    { label: "x²", value: "^2", color: "gray" },
    { label: "xⁿ", value: "^", color: "gray" },
    { label: "∛", value: "cbrt(", color: "gray", sciOnly: true },
    { label: "nCr", value: "nCr(", color: "gray", sciOnly: true },
    { label: "nPr", value: "nPr(", color: "gray", sciOnly: true },
  ],
  [
    { label: "abs", value: "abs(", color: "gray", sciOnly: true },
    { label: "ceil", value: "ceil(", color: "gray", sciOnly: true },
    { label: "floor", value: "floor(", color: "gray", sciOnly: true },
    { label: "sinh", value: "sinh(", color: "gray", sciOnly: true },
    { label: "cosh", value: "cosh(", color: "gray", sciOnly: true },
  ],
];

export const MAIN_ROWS: CalcBtn[][] = [
  [
    { label: "MC", action: "MC", color: "orange" },
    { label: "MR", action: "MR", color: "orange" },
    { label: "M+", action: "M+", color: "orange" },
    { label: "M-", action: "M-", color: "orange" },
    { label: "MS", action: "MS", color: "orange" },
  ],
  [
    { label: "(", value: "(", color: "dark" },
    { label: ")", value: ")", color: "dark" },
    { label: "%", value: "%", color: "dark" },
    { label: "!", value: "!", color: "dark" },
    { label: "AC", action: "AC", color: "red" },
  ],
  [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "DEL", action: "DEL", color: "red" },
    { label: "÷", value: "÷", color: "blue" },
  ],
  [
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "×", value: "×", color: "blue" },
    { label: "−", value: "-", color: "blue" },
  ],
  [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "+", value: "+", color: "blue" },
    { label: "=", action: "=", color: "green", wide: false },
  ],
  [
    { label: "0", value: "0", wide: false },
    { label: "00", value: "00" },
    { label: ".", value: "." },
    { label: "±", action: "neg" },
    { label: "=", action: "=", color: "green" },
  ],
];

// ── Button colors ──────────────────────────────────────────────────

export const BTN_COLORS: Record<string, string> = {
  blue: "bg-blue-500 hover:bg-blue-400 text-white border-blue-600 shadow-sm",
  orange: "bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50",
  dark: "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-foreground border-slate-300 dark:border-slate-600",
  red: "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800",
  green: "bg-blue-500 hover:bg-blue-400 text-white border-blue-600 shadow-sm text-lg font-black",
  gray: "bg-muted/60 hover:bg-muted text-foreground border-border",
  default: "bg-card hover:bg-muted/40 text-foreground border-border",
};