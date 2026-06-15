
// ── Types ──────────────────────────────────────────────────────────

export type GenMode = "password" | "passphrase" | "pin" | "memorable";

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  symbols: boolean;
  exclude: string;
  noAmbiguous: boolean;  // remove l, 1, O, 0, I
  noRepeats: boolean;
  customChars: string;
}

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  capitalize: boolean;
  addNumber: boolean;
  addSymbol: boolean;
}

export interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  bgColor: string;
  entropy: number;
  crackTime: string;
  tips: string[];
}

// ── Character sets ─────────────────────────────────────────────────

export const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
  ambiguous: "l1IO0",
};

export const WORD_LIST = [
  "apple", "brave", "cloud", "dance", "eagle", "flame", "grace", "heart", "image", "jewel",
  "knife", "lemon", "magic", "night", "ocean", "peace", "queen", "river", "stone", "tiger",
  "ultra", "viper", "water", "xenon", "yacht", "zebra", "amber", "blaze", "crisp", "drift",
  "ember", "frost", "glide", "haven", "irony", "joust", "karma", "lunar", "maple", "nexus",
  "orbit", "pixel", "quest", "radar", "solar", "track", "unify", "vivid", "waltz", "xenon",
  "yield", "zonal", "azure", "bloom", "coast", "depot", "elite", "forge", "grove", "haste",
  "input", "joint", "knack", "light", "might", "noble", "ozone", "prism", "quark", "realm",
  "scout", "thorn", "umbra", "valor", "width", "xeric", "yearn", "zones", "atlas", "blunt",
  "crane", "depth", "expel", "flint", "guise", "hinge", "ivory", "jumbo", "kneel", "lodge",
  "mercy", "notch", "onyx", "perch", "quill", "ridge", "spark", "twist", "usher", "vouch",
  "whisk", "exist", "yodel", "zoned", "agent", "brisk", "cloak", "devil", "event", "flash",
  "grain", "haven", "index", "judge", "kneel", "lance", "mirth", "nerve", "optic", "plunk",
  "quirk", "risky", "swift", "trove", "unite", "vivid", "witch", "exert", "yacht", "zippy",
];

// ── Crypto random ──────────────────────────────────────────────────

export function cryptoRandom(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

export function cryptoChoice<T>(arr: T[]): T {
  return arr[cryptoRandom(arr.length)];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = cryptoRandom(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Generators ─────────────────────────────────────────────────────

export function generatePassword(opts: PasswordOptions): string {
  let pool = "";
  const required: string[] = [];

  if (opts.customChars.trim()) {
    pool = opts.customChars;
  } else {
    if (opts.uppercase) { pool += CHARS.upper; required.push(cryptoChoice([...CHARS.upper])); }
    if (opts.lowercase) { pool += CHARS.lower; required.push(cryptoChoice([...CHARS.lower])); }
    if (opts.digits) { pool += CHARS.digits; required.push(cryptoChoice([...CHARS.digits])); }
    if (opts.symbols) { pool += CHARS.symbols; required.push(cryptoChoice([...CHARS.symbols])); }
  }

  if (opts.noAmbiguous) pool = [...pool].filter(c => !CHARS.ambiguous.includes(c)).join("");
  if (opts.exclude) pool = [...pool].filter(c => !opts.exclude.includes(c)).join("");
  if (!pool) pool = CHARS.lower;

  const poolArr = [...new Set([...pool])]; // deduplicate

  const len = Math.max(opts.length, required.length);
  const chars: string[] = [...required];

  while (chars.length < len) {
    const c = cryptoChoice(poolArr);
    if (opts.noRepeats && chars.includes(c)) continue;
    chars.push(c);
  }

  return shuffleArray(chars).join("");
}

export function generatePassphrase(opts: PassphraseOptions): string {
  const words = Array.from({ length: opts.wordCount }, () => {
    const w = cryptoChoice(WORD_LIST);
    return opts.capitalize ? w[0].toUpperCase() + w.slice(1) : w;
  });
  let phrase = words.join(opts.separator);
  if (opts.addNumber) phrase += opts.separator + String(cryptoRandom(100));
  if (opts.addSymbol) phrase += cryptoChoice([..."!@#$%"]);
  return phrase;
}

export function generatePIN(length: number): string {
  return Array.from({ length }, () => cryptoRandom(10)).join("");
}

export function generateMemorable(opts: PasswordOptions): string {
  // Pattern: Word + number + symbol + Word
  const w1 = cryptoChoice(WORD_LIST);
  const w2 = cryptoChoice(WORD_LIST);
  const num = String(cryptoRandom(100)).padStart(2, "0");
  const sym = cryptoChoice([..."!@#$%&*"]);
  const result = (w1[0].toUpperCase() + w1.slice(1)) + num + sym + (w2[0].toUpperCase() + w2.slice(1));
  return result;
}

// ── Strength analyzer ──────────────────────────────────────────────

export function analyzeStrength(pw: string): StrengthResult {
  if (!pw) return { score: 0, label: "—", color: "text-muted-foreground", bgColor: "bg-border", entropy: 0, crackTime: "—", tips: [] };

  const has = {
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /[0-9]/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
    long: pw.length >= 16,
    medium: pw.length >= 12,
    short: pw.length < 8,
  };

  // Pool size for entropy
  let pool = 0;
  if (has.upper) pool += 26;
  if (has.lower) pool += 26;
  if (has.digit) pool += 10;
  if (has.symbol) pool += 32;
  if (!pool) pool = 26;

  const entropy = pw.length * Math.log2(pool);

  // Crack time (at 1 trillion guesses/sec)
  const combinations = Math.pow(pool, pw.length);
  const seconds = combinations / 1e12 / 2; // avg half of combinations
  const crackTime = formatCrackTime(seconds);

  // Score 0–4
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  const types = [has.upper, has.lower, has.digit, has.symbol].filter(Boolean).length;

  if (has.short) score = 1;
  else if (!has.medium && types <= 2) score = 1;
  else if (has.medium && types >= 2) score = 2;
  else if (has.medium && types >= 3) score = 3;
  else if (has.long && types >= 3) score = 4;

  if (entropy >= 60 && types >= 3) score = Math.max(3, score) as 0 | 1 | 2 | 3 | 4;
  if (entropy >= 80 && types >= 4) score = 4;
  if (entropy < 28) score = 1;
  if (entropy < 18) score = 0;

  const LABELS: Record<number, [string, string, string]> = {
    0: ["Very Weak", "text-red-500", "bg-red-500"],
    1: ["Weak", "text-orange-500", "bg-orange-500"],
    2: ["Fair", "text-yellow-500", "bg-yellow-500"],
    3: ["Strong", "text-blue-500", "bg-blue-500"],
    4: ["Very Strong", "text-emerald-500", "bg-emerald-500"],
  };
  const [label, color, bgColor] = LABELS[score];

  const tips: string[] = [];
  if (!has.upper) tips.push("Add uppercase letters");
  if (!has.lower) tips.push("Add lowercase letters");
  if (!has.digit) tips.push("Add numbers");
  if (!has.symbol) tips.push("Add special characters (!@#$…)");
  if (has.short) tips.push("Use at least 12 characters");
  if (!has.long) tips.push("16+ characters is ideal");

  return { score, label, color, bgColor, entropy: Math.round(entropy), crackTime, tips };
}

export function formatCrackTime(seconds: number): string {
  if (!isFinite(seconds) || seconds > 1e30) return "Centuries+";
  if (seconds < 1) return "Instant";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 3.15e13) return `${Math.round(seconds / 3.15e9)}k years`;
  return "Millions+ years";
}