// ── Types ──────────────────────────────────────────────────────────

export interface Stats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  range: number;
  min: number;
  max: number;
  variance: number;         // population
  sVariance: number;         // sample
  stdDev: number;         // population
  sStdDev: number;         // sample
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  geometric: number | null;
  harmonic: number | null;
  rms: number;         // root mean square
  sorted: number[];
  frequencies: Map<number, number>;
  outliers: number[];
}

// ── Core stats engine ──────────────────────────────────────────────

export function calcStats(nums: number[]): Stats {
  const n = nums.length;
  if (n === 0) throw new Error("empty");

  const sorted = [...nums].sort((a, b) => a - b);
  const sum = nums.reduce((s, v) => s + v, 0);
  const mean = sum / n;

  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];

  // Mode
  const freq = new Map<number, number>();
  nums.forEach(v => freq.set(v, (freq.get(v) ?? 0) + 1));
  const maxFreq = Math.max(...freq.values());
  const mode = maxFreq > 1
    ? [...freq.entries()].filter(([, c]) => c === maxFreq).map(([v]) => v).sort((a, b) => a - b)
    : [];

  // Range
  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // Variance & Std Dev
  const variance = nums.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const sVariance = n > 1 ? nums.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1) : 0;
  const stdDev = Math.sqrt(variance);
  const sStdDev = Math.sqrt(sVariance);

  // Quartiles (inclusive method)
  function quartile(arr: number[], q: number): number {
    const pos = (arr.length - 1) * q;
    const lo = Math.floor(pos);
    const hi = Math.ceil(pos);
    return arr[lo] + (arr[hi] - arr[lo]) * (pos - lo);
  }
  const q1 = quartile(sorted, 0.25);
  const q3 = quartile(sorted, 0.75);
  const iqr = q3 - q1;

  // Outliers (Tukey's fences)
  const lFence = q1 - 1.5 * iqr;
  const uFence = q3 + 1.5 * iqr;
  const outliers = sorted.filter(v => v < lFence || v > uFence);

  // Skewness (Pearson's)
  const skewness = stdDev > 0
    ? (3 * (mean - median)) / stdDev
    : 0;

  // Geometric mean (only for all-positive values)
  const allPositive = nums.every(v => v > 0);
  const geometric = allPositive
    ? Math.exp(nums.reduce((s, v) => s + Math.log(v), 0) / n)
    : null;

  // Harmonic mean (only for all non-zero)
  const allNonZero = nums.every(v => v !== 0);
  const harmonic = allNonZero
    ? n / nums.reduce((s, v) => s + 1 / v, 0)
    : null;

  // Root Mean Square
  const rms = Math.sqrt(nums.reduce((s, v) => s + v * v, 0) / n);

  return {
    count: n, sum, mean, median, mode, range,
    min, max, variance, sVariance, stdDev, sStdDev,
    q1, q3, iqr, skewness, geometric, harmonic, rms,
    sorted, frequencies: freq, outliers,
  };
}

// ── Parse input string ─────────────────────────────────────────────

export function parseNumbers(raw: string): { nums: number[]; errors: string[] } {
  const errors: string[] = [];
  const parts = raw
    .replace(/,/g, " ")
    .replace(/;/g, " ")
    .replace(/\n/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  const nums: number[] = [];
  parts.forEach(p => {
    const n = parseFloat(p);
    if (isNaN(n)) errors.push(`"${p}" is not a number`);
    else nums.push(n);
  });
  return { nums, errors };
}

// ── Format helpers ─────────────────────────────────────────────────

export function fmt(n: number, d = 6): string {
  if (!isFinite(n)) return n > 0 ? "∞" : "-∞";
  const r = parseFloat(n.toPrecision(d));
  return r.toLocaleString(undefined, { maximumFractionDigits: 8 });
}