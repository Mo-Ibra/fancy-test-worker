
// ── Types ──────────────────────────────────────────────────────────

export interface DateDiff {
  years: number;
  months: number;
  weeks: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  workingDays: number;
  weekends: number;
  isForward: boolean;
  label: string;
}

export interface AddSubResult {
  result: Date;
  formatted: string;
}

// ── Helpers ────────────────────────────────────────────────────────

export function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

export function countWorkingDays(from: Date, to: Date): { working: number; weekends: number } {
  const start = new Date(Math.min(from.getTime(), to.getTime()));
  const end = new Date(Math.max(from.getTime(), to.getTime()));
  let working = 0, weekends = 0;
  const cur = new Date(start);
  while (cur <= end) {
    if (isWeekend(cur)) weekends++; else working++;
    cur.setDate(cur.getDate() + 1);
  }
  return { working, weekends };
}

export function diffDates(d1: Date, d2: Date): DateDiff {
  const isForward = d2 >= d1;
  const [from, to] = isForward ? [d1, d2] : [d2, d1];

  // Precise years / months / days
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) { years--; months += 12; }

  const msPerDay = 86_400_000;
  const totalMs = Math.abs(to.getTime() - from.getTime());
  const totalDays = Math.floor(totalMs / msPerDay);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;
  const totalMins = totalHours * 60;
  const totalSecs = totalMins * 60;
  const remWeeks = Math.floor(totalDays / 7);
  const remDays = totalDays % 7;

  const { working, weekends } = countWorkingDays(from, to);
  const label = ""; // Localization handled in component

  return {
    years, months, weeks: remWeeks, days,
    totalDays, totalWeeks, totalMonths,
    totalHours, totalMinutes: totalMins, totalSeconds: totalSecs,
    workingDays: working, weekends,
    isForward, label,
  };
}

// Add or subtract duration from a date
export function addSubDate(
  base: Date,
  unit: "days" | "weeks" | "months" | "years",
  amount: number,
  op: "add" | "sub"
): AddSubResult {
  const d = new Date(base);
  const v = op === "add" ? amount : -amount;
  if (unit === "days") d.setDate(d.getDate() + v);
  if (unit === "weeks") d.setDate(d.getDate() + v * 7);
  if (unit === "months") d.setMonth(d.getMonth() + v);
  if (unit === "years") d.setFullYear(d.getFullYear() + v);
  return {
    result: d,
    formatted: d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
  };
}

// Format a date nicely
export function fmtDate(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function todayStr() { return new Date().toISOString().split("T")[0]; }
export function offsetDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export const PRESETS = [
  { label: "last7Days", from: () => offsetDate(-7), to: todayStr },
  { label: "last30Days", from: () => offsetDate(-30), to: todayStr },
  { label: "last90Days", from: () => offsetDate(-90), to: todayStr },
  { label: "lastYear", from: () => offsetDate(-365), to: todayStr },
  { label: "thisYear", from: () => `${new Date().getFullYear()}-01-01`, to: todayStr },
  { label: "year2000", from: () => "2000-01-01", to: todayStr },
];

export const NOTABLE = [
  { label: "unixEpoch", date: "1970-01-01" },
  { label: "y2k", date: "2000-01-01" },
  { label: "sept11", date: "2001-09-11" },
  { label: "iphoneLaunch", date: "2007-06-29" },
  { label: "newYear2025", date: "2025-01-01" },
  { label: "newYear2030", date: "2030-01-01" },
];