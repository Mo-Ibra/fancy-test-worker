// ── Types ──────────────────────────────────────────────────────────

export interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  labelColor: string;
  barColor: string;
  entropy: number;
  crackTime: CrackTimes;
  charsetSize: number;
  length: number;
  checks: CheckItem[];
  patterns: PatternWarning[];
  suggestions: string[];
  commonWord: boolean;
  hasSequence: boolean;
  hasRepeat: boolean;
  charTypes: CharTypes;
}

export interface CrackTimes {
  onlineThrottled: string;   // 100/hr — online attack throttled
  onlineUnthrottled: string;   // 10/sec — online attack
  offline: string;   // 1B/sec — offline (weak hash)
  offlineFast: string;   // 100B/sec — offline bcrypt cracking rig
}

export interface CheckItem {
  label: string;
  ok: boolean;
  note?: string;
}

export interface PatternWarning {
  type: string;
  label: string;
  value: string;
}

export interface CharTypes {
  hasUpper: boolean;
  hasLower: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  hasUnicode: boolean;
}

// ── Common passwords list (sample) ────────────────────────────────

export const COMMON_PASSWORDS = new Set([
  "password", "password1", "123456", "12345678", "1234567890", "111111", "000000",
  "123123", "abc123", "qwerty", "qwerty123", "letmein", "welcome", "admin", "admin123",
  "login", "master", "dragon", "monkey", "sunshine", "princess", "football", "baseball",
  "soccer", "batman", "superman", "shadow", "iloveyou", "trustno1", "hello", "hello123",
  "pass", "passw0rd", "p@ssword", "p@ssw0rd", "test", "test123", "demo", "user", "guest",
  "secret", "1q2w3e", "1q2w3e4r", "zxcvbn", "password123", "pass123", "password!",
  "summer", "winter", "spring", "autumn", "january", "february", "march", "april",
  "january1", "password2", "password2024", "password2025", "abcdef", "abcdef123",
]);

// ── Keyboard sequences ─────────────────────────────────────────────

export const KEYBOARD_SEQS = [
  "qwerty", "qwertyuiop", "asdfgh", "asdfghjkl", "zxcvbn", "zxcvbnm",
  "1234567890", "0987654321", "abcdefghij", "zyxwvutsrq",
  "qazwsx", "!@#$%^", "poiuyt", "lkjhgf", "mnbvcx",
];

export const ALPHA_SEQS = ["abcde", "bcdef", "cdefg", "defgh", "efghi", "fghij", "ghijk", "hijkl",
  "ijklm", "jklmn", "klmno", "lmnop", "mnopq", "nopqr", "opqrs", "pqrst", "qrstu",
  "rstuv", "stuvw", "tuvwx", "uvwxy", "vwxyz"];

// ── Pattern detectors ──────────────────────────────────────────────

export function detectPatterns(pw: string, t: (key: string, params?: Record<string, any>) => string): PatternWarning[] {
  const warnings: PatternWarning[] = [];
  const lower = pw.toLowerCase();

  // Common words
  if (COMMON_PASSWORDS.has(lower)) {
    warnings.push({ type: "common", label: t("patternsList.common.label"), value: t("patternsList.common.value") });
  }

  // Keyboard sequences
  for (const seq of KEYBOARD_SEQS) {
    if (lower.includes(seq) || lower.includes(seq.split("").reverse().join(""))) {
      warnings.push({ type: "keyboard", label: t("patternsList.keyboard.label"), value: t("patternsList.keyboard.value", { seq }) });
      break;
    }
  }

  // Alpha sequences
  for (const seq of ALPHA_SEQS) {
    if (lower.includes(seq)) {
      warnings.push({ type: "alpha", label: t("patternsList.alpha.label"), value: t("patternsList.alpha.value", { seq }) });
      break;
    }
  }

  // Numeric sequences
  for (let i = 0; i <= 7; i++) {
    const seq = Array.from({ length: 4 }, (_, k) => (i + k) % 10).join("");
    if (pw.includes(seq)) {
      warnings.push({ type: "numeric", label: t("patternsList.numeric.label"), value: t("patternsList.numeric.value", { seq }) });
      break;
    }
  }

  // Repeated characters (aaaa, 1111)
  const repeatMatch = pw.match(/(.)\1{3,}/);
  if (repeatMatch) {
    warnings.push({ type: "repeat", label: t("patternsList.repeat.label"), value: t("patternsList.repeat.value", { seq: repeatMatch[0] }) });
  }

  // Repeated patterns (abcabc)
  const patternMatch = pw.match(/^(.{2,})\1+$/);
  if (patternMatch) {
    warnings.push({ type: "pattern", label: t("patternsList.pattern.label"), value: t("patternsList.pattern.value", { seq: patternMatch[1] }) });
  }

  // All same character type (only digits, only letters)
  if (/^\d+$/.test(pw) && pw.length < 12) {
    warnings.push({ type: "digits-only", label: t("patternsList.digitsOnly.label"), value: t("patternsList.digitsOnly.value") });
  }
  if (/^[a-zA-Z]+$/.test(pw) && pw.length < 12) {
    warnings.push({ type: "letters-only", label: t("patternsList.lettersOnly.label"), value: t("patternsList.lettersOnly.value") });
  }

  // Leetspeak (e4sy to detect substitutions that don't add much)
  const leet = pw.replace(/[@4]/g, "a").replace(/[3]/g, "e").replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o").replace(/[5\$]/g, "s").replace(/[7]/g, "t").toLowerCase();
  if (leet !== lower && COMMON_PASSWORDS.has(leet)) {
    warnings.push({ type: "leet", label: t("patternsList.leet.label"), value: t("patternsList.leet.value") });
  }

  // Year patterns (1990-2030)
  const yearMatch = pw.match(/(?:19|20)\d{2}/);
  if (yearMatch) {
    warnings.push({ type: "year", label: t("patternsList.year.label"), value: t("patternsList.year.value", { seq: yearMatch[0] }) });
  }

  return warnings;
}

// ── Charset & entropy ─────────────────────────────────────────────

export function getCharsetSize(pw: string): number {
  let size = 0;
  if (/[a-z]/.test(pw)) size += 26;
  if (/[A-Z]/.test(pw)) size += 26;
  if (/[0-9]/.test(pw)) size += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) size += 32;
  return size || 26;
}

export function calcEntropy(pw: string): number {
  const charset = getCharsetSize(pw);
  return pw.length * Math.log2(charset);
}

// ── Crack time ────────────────────────────────────────────────────

export function formatSeconds(secs: number, t: (key: string, params?: Record<string, any>) => string): string {
  if (!isFinite(secs) || secs > 1e30) return t("time.centuries");
  if (secs < 1) return t("time.lessThanSec");
  if (secs < 60) return t("time.seconds", { count: Math.round(secs) });
  if (secs < 3600) return t("time.minutes", { count: Math.round(secs / 60) });
  if (secs < 86400) return t("time.hours", { count: Math.round(secs / 3600) });
  if (secs < 2592000) return t("time.days", { count: Math.round(secs / 86400) });
  if (secs < 31536000) return t("time.months", { count: Math.round(secs / 2592000) });
  if (secs < 1e9) return t("time.years", { count: Math.round(secs / 31536000) });
  if (secs < 1e12) return t("time.billionYears", { count: (secs / 1e9).toFixed(1) });
  return t("time.centuries");
}

export function getCrackTimes(entropy: number, t: (key: string, params?: Record<string, any>) => string): CrackTimes {
  const combinations = Math.pow(2, entropy);
  const avgGuesses = combinations / 2;
  return {
    onlineThrottled: formatSeconds(avgGuesses / (100 / 3600), t),  // 100/hr
    onlineUnthrottled: formatSeconds(avgGuesses / 10, t),               // 10/sec
    offline: formatSeconds(avgGuesses / 1e9, t),              // 1B/sec
    offlineFast: formatSeconds(avgGuesses / 1e11, t),             // 100B/sec (GPU)
  };
}

// ── Score calculation ──────────────────────────────────────────────

export function scorePassword(pw: string, t: (key: string, params?: Record<string, any>) => string): StrengthResult {
  if (!pw) {
    return {
      score: 0, label: t("strengthLabels.none"), labelColor: "text-muted-foreground", barColor: "bg-border",
      entropy: 0, crackTime: { onlineThrottled: "—", onlineUnthrottled: "—", offline: "—", offlineFast: "—" },
      charsetSize: 0, length: 0, checks: [], patterns: [], suggestions: [], commonWord: false,
      hasSequence: false, hasRepeat: false,
      charTypes: { hasUpper: false, hasLower: false, hasDigit: false, hasSymbol: false, hasUnicode: false },
    };
  }

  const length = pw.length;
  const entropy = calcEntropy(pw);
  const charsetSize = getCharsetSize(pw);
  const patterns = detectPatterns(pw, t);
  const crackTime = getCrackTimes(entropy, t);

  const charTypes: CharTypes = {
    hasUpper: /[A-Z]/.test(pw),
    hasLower: /[a-z]/.test(pw),
    hasDigit: /[0-9]/.test(pw),
    hasSymbol: /[^a-zA-Z0-9]/.test(pw),
    hasUnicode: /[^\x00-\x7F]/.test(pw),
  };

  const commonWord = patterns.some(p => p.type === "common" || p.type === "leet");
  const hasSequence = patterns.some(p => ["keyboard", "alpha", "numeric"].includes(p.type));
  const hasRepeat = patterns.some(p => ["repeat", "pattern"].includes(p.type));

  // Checks
  const checks: CheckItem[] = [
    { label: t("checksList.min8"), ok: length >= 8, note: t("notes.charsLength", { length }) },
    { label: t("checksList.min12"), ok: length >= 12, note: length >= 12 ? t("notes.goodLength") : t("notes.moreNeeded", { count: 12 - length }) },
    { label: t("checksList.min16"), ok: length >= 16, note: length >= 16 ? t("notes.excellent") : undefined },
    { label: t("checksList.upper"), ok: charTypes.hasUpper },
    { label: t("checksList.lower"), ok: charTypes.hasLower },
    { label: t("checksList.digits"), ok: charTypes.hasDigit },
    { label: t("checksList.symbols"), ok: charTypes.hasSymbol, note: t("notes.symbolsExample") },
    { label: t("checksList.noCommon"), ok: !commonWord },
    { label: t("checksList.noSeq"), ok: !hasSequence },
    { label: t("checksList.noRepeat"), ok: !hasRepeat },
  ];

  // Suggestions
  const suggestions: string[] = [];
  if (length < 12) suggestions.push(t("suggestionsList.min12"));
  if (!charTypes.hasUpper) suggestions.push(t("suggestionsList.upper"));
  if (!charTypes.hasLower) suggestions.push(t("suggestionsList.lower"));
  if (!charTypes.hasDigit) suggestions.push(t("suggestionsList.digits"));
  if (!charTypes.hasSymbol) suggestions.push(t("suggestionsList.symbols"));
  if (commonWord) suggestions.push(t("suggestionsList.noCommon"));
  if (hasSequence) suggestions.push(t("suggestionsList.noSeq"));
  if (hasRepeat) suggestions.push(t("suggestionsList.noRepeat"));
  if (length >= 12 && !suggestions.length) suggestions.push(t("suggestionsList.passphrase"));

  // Score 0–4
  let score: 0 | 1 | 2 | 3 | 4 = 0;
  const typeCount = [charTypes.hasUpper, charTypes.hasLower, charTypes.hasDigit, charTypes.hasSymbol].filter(Boolean).length;

  if (entropy < 20 || commonWord) score = 0;
  else if (entropy < 35 || length < 8) score = 1;
  else if (entropy < 50 || typeCount < 2) score = 2;
  else if (entropy < 70 || typeCount < 3) score = 3;
  else score = 4;

  // Penalize patterns
  if (hasSequence || hasRepeat) score = Math.max(0, score - 1) as 0 | 1 | 2 | 3 | 4;
  if (commonWord) score = 0;

  const SCORES: Record<number, [string, string, string]> = {
    0: [t("strengthLabels.veryWeak"), "text-red-500", "bg-red-500"],
    1: [t("strengthLabels.weak"), "text-orange-500", "bg-orange-500"],
    2: [t("strengthLabels.fair"), "text-yellow-500", "bg-yellow-500"],
    3: [t("strengthLabels.strong"), "text-blue-500", "bg-blue-500"],
    4: [t("strengthLabels.veryStrong"), "text-emerald-500", "bg-emerald-500"],
  };
  const [label, labelColor, barColor] = SCORES[score];

  return {
    score, label, labelColor, barColor, entropy: Math.round(entropy * 10) / 10,
    crackTime, charsetSize, length, checks, patterns, suggestions,
    commonWord, hasSequence, hasRepeat, charTypes,
  };
}