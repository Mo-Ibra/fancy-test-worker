
// ── Types ─────────────────────────────────────────────────────────

export type TimestampUnit = "seconds" | "milliseconds";
export type Direction = "toDate" | "toTimestamp";

export interface ParsedDate {
  utc: string;
  local: string;
  iso: string;
  relative: string;
  dayOfWeek: string;
  dayOfYear: number;
  weekNumber: number;
  leapYear: boolean;
  unixSeconds: number;
  unixMs: number;
  components: {
    year: number; month: number; day: number;
    hour: number; minute: number; second: number; ms: number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────

export function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const abs = Math.abs(diff);
  const future = diff < 0;
  const fmt = (n: number, unit: string) =>
    `${future ? "in " : ""}${n} ${unit}${n !== 1 ? "s" : ""}${future ? "" : " ago"}`;

  if (abs < 10_000) return "just now";
  if (abs < 60_000) return fmt(Math.round(abs / 1_000), "second");
  if (abs < 3_600_000) return fmt(Math.round(abs / 60_000), "minute");
  if (abs < 86_400_000) return fmt(Math.round(abs / 3_600_000), "hour");
  if (abs < 2_592_000_000) return fmt(Math.round(abs / 86_400_000), "day");
  if (abs < 31_536_000_000) return fmt(Math.round(abs / 2_592_000_000), "month");
  return fmt(Math.round(abs / 31_536_000_000), "year");
}

export function parseTimestamp(raw: string, unit: TimestampUnit): ParsedDate | null {
  const n = Number(raw.trim());
  if (isNaN(n)) return null;
  const ms = unit === "seconds" ? n * 1000 : n;
  const d = new Date(ms);
  if (!isFinite(d.getTime())) return null;

  const pad = (v: number, len = 2) => String(v).padStart(len, "0");
  const utcStr = d.toUTCString();

  return {
    utc: utcStr,
    local: d.toLocaleString(undefined, { dateStyle: "full", timeStyle: "long" }),
    iso: d.toISOString(),
    relative: relativeTime(ms),
    dayOfWeek: d.toLocaleDateString(undefined, { weekday: "long" }),
    dayOfYear: getDayOfYear(d),
    weekNumber: getWeekNumber(d),
    leapYear: isLeapYear(d.getUTCFullYear()),
    unixSeconds: Math.floor(ms / 1000),
    unixMs: ms,
    components: {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      day: d.getUTCDate(),
      hour: d.getUTCHours(),
      minute: d.getUTCMinutes(),
      second: d.getUTCSeconds(),
      ms: d.getUTCMilliseconds(),
    },
  };
}

export function dateToTimestamp(
  year: number, month: number, day: number,
  hour: number, minute: number, second: number, ms: number,
  tz: "utc" | "local"
): { seconds: number; milliseconds: number } | null {
  let d: Date;
  if (tz === "utc") {
    d = new Date(Date.UTC(year, month - 1, day, hour, minute, second, ms));
  } else {
    d = new Date(year, month - 1, day, hour, minute, second, ms);
  }
  if (!isFinite(d.getTime())) return null;
  return { seconds: Math.floor(d.getTime() / 1000), milliseconds: d.getTime() };
}

// ── Notable timestamps ─────────────────────────────────────────────
export const NOTABLE: { label: string; ts: number; desc: string }[] = [
  { label: "Unix Epoch", ts: 0, desc: "January 1, 1970 00:00:00 UTC" },
  { label: "Y2K", ts: 946684800, desc: "January 1, 2000 00:00:00 UTC" },
  { label: "iPhone launch", ts: 1168560000, desc: "January 11, 2007" },
  { label: "2^31 (Y2K38)", ts: 2147483647, desc: "January 19, 2038 — 32-bit overflow" },
  { label: "Year 2100", ts: 4102444800, desc: "January 1, 2100 00:00:00 UTC" },
  { label: "Max safe integer", ts: 9007199254, desc: "JS Number.MAX_SAFE_INTEGER / 1000" },
];

export const TIME_ZONES = [
  "UTC", "America/New_York", "America/Los_Angeles", "America/Chicago",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Asia/Tokyo",
  "Asia/Shanghai", "Asia/Dubai", "Asia/Kolkata", "Australia/Sydney",
  "Africa/Cairo", "America/Sao_Paulo",
];
