// ── Types ──────────────────────────────────────────────────────────

export interface BaseInfo {
  base: number;
  label: string;
  prefix: string;
  color: string;
  badge: string;
  chars: string;
}

// ── Constants ──────────────────────────────────────────────────────

export const DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const BASES: BaseInfo[] = [
  { base: 2, label: "Binary", prefix: "0b", color: "text-blue-500 dark:text-blue-400", badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", chars: "0–1" },
  { base: 8, label: "Octal", prefix: "0o", color: "text-purple-500 dark:text-purple-400", badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400", chars: "0–7" },
  { base: 10, label: "Decimal", prefix: "", color: "text-emerald-500 dark:text-emerald-400", badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400", chars: "0–9" },
  { base: 16, label: "Hexadecimal", prefix: "0x", color: "text-orange-500 dark:text-orange-400", badge: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400", chars: "0–F" },
  { base: 32, label: "Base 32", prefix: "", color: "text-pink-500 dark:text-pink-400", badge: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400", chars: "0–V" },
  { base: 36, label: "Base 36", prefix: "", color: "text-amber-500 dark:text-amber-400", badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", chars: "0–Z" },
  { base: 64, label: "Base 64", prefix: "", color: "text-teal-500 dark:text-teal-400", badge: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400", chars: "custom" },
];

export const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// ── Core conversion ────────────────────────────────────────────────

export function toDecimal(value: string, fromBase: number): bigint | null {
  const v = value.trim().toUpperCase();
  if (!v) return null;
  if (fromBase === 64) {
    // Custom base-64 digit set
    let result = BigInt(0);
    for (const ch of v) {
      const idx = BASE64_CHARS.indexOf(ch);
      if (idx === -1) return null;
      result = result * BigInt(64) + BigInt(idx);
    }
    return result;
  }
  const chars = DIGITS.slice(0, fromBase);
  let result = BigInt(0);
  for (const ch of v) {
    const idx = chars.indexOf(ch);
    if (idx === -1) return null;
    result = result * BigInt(fromBase) + BigInt(idx);
  }
  return result;
}

export function fromDecimal(decimal: bigint, toBase: number): string {
  if (decimal < BigInt(0)) return "-" + fromDecimal(-decimal, toBase);
  if (decimal === BigInt(0)) return "0";
  if (toBase === 64) {
    let result = "";
    let n = decimal;
    while (n > BigInt(0)) {
      result = BASE64_CHARS[Number(n % BigInt(64))] + result;
      n = n / BigInt(64);
    }
    return result || "0";
  }
  const chars = DIGITS.slice(0, toBase);
  let result = "";
  let n = decimal;
  while (n > BigInt(0)) {
    result = chars[Number(n % BigInt(toBase))] + result;
    n = n / BigInt(toBase);
  }
  return result || "0";
}

export function isValidForBase(char: string, base: number): boolean {
  if (base === 64) return BASE64_CHARS.includes(char);
  return DIGITS.slice(0, base).includes(char.toUpperCase());
}

export function validateInput(value: string, base: number): string {
  if (!value.trim()) return "";
  for (const ch of value.trim().toUpperCase()) {
    if (ch === " " || ch === "_") continue;
    if (!isValidForBase(ch, base)) return `Invalid character "${ch}" for base ${base}`;
  }
  return "";
}

// ── Bit analysis ───────────────────────────────────────────────────

export function analyzeBits(decimal: bigint) {
  if (decimal < BigInt(0)) return null;
  const bin = fromDecimal(decimal, 2);
  const bits = bin.length;
  const bytes = Math.ceil(bits / 8);
  const isPow2 = decimal > BigInt(0) && (decimal & (decimal - BigInt(1))) === BigInt(0);
  const lsb = decimal > BigInt(0) ? Number(decimal & BigInt(1)) : 0;
  const msb = bits;
  const popcount = [...bin].filter(b => b === "1").length;

  // Byte segments (groups of 8 bits)
  const padded = bin.padStart(bytes * 8, "0");
  const byteSegs: string[] = [];
  for (let i = 0; i < padded.length; i += 8) {
    byteSegs.push(padded.slice(i, i + 8));
  }

  return { bits, bytes, isPow2, lsb, msb, popcount, bin, byteSegs };
}

export const EXAMPLES: { label: string; decimal: string; note: string }[] = [
  { label: "42", decimal: "42", note: "The answer to everything" },
  { label: "255", decimal: "255", note: "Max unsigned 8-bit (0xFF)" },
  { label: "256", decimal: "256", note: "2⁸ — power of 2" },
  { label: "1024", decimal: "1024", note: "2¹⁰ = 1 KiB" },
  { label: "65535", decimal: "65535", note: "Max unsigned 16-bit (0xFFFF)" },
  { label: "1000000", decimal: "1000000", note: "One million" },
];