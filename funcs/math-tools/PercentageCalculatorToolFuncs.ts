// ── Types ──────────────────────────────────────────────────────────

import { ArrowRight, Calculator, Percent, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";

export type CalcMode =
  | "whatPercent"      // X is what % of Y?
  | "percentOf"        // X% of Y = ?
  | "increase"         // X increased/decreased by Y% = ?
  | "percentChange"    // % change from X to Y
  | "reversePercent"   // Y is X% of what?
  | "splitPercent"     // split a total by percentages
  | "percentDiff"      // percentage difference between X and Y
  | "markup";          // cost + markup % = selling price


export function smart(n: number, decimals = 4): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  const rounded = parseFloat(n.toFixed(decimals));
  return rounded.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

export function pct(n: number): string {
  return smart(n, 4) + "%";
}

export const MODES: { mode: CalcMode; label: string; shortLabel: string; desc: string; icon: React.ElementType }[] = [
  { mode: "percentOf", label: "Percentage Of", shortLabel: "% of", desc: "X% of Y = ?", icon: Percent },
  { mode: "whatPercent", label: "What Percentage", shortLabel: "What %?", desc: "X is what % of Y?", icon: Calculator },
  { mode: "increase", label: "Increase / Decrease", shortLabel: "Inc / Dec", desc: "Value after % change", icon: TrendingUp },
  { mode: "percentChange", label: "Percentage Change", shortLabel: "% Change", desc: "% change from X to Y", icon: TrendingDown },
  { mode: "reversePercent", label: "Reverse Percentage", shortLabel: "Reverse %", desc: "Y is X% of what number?", icon: RefreshCw },
  { mode: "percentDiff", label: "Percentage Difference", shortLabel: "% Diff", desc: "Difference between X and Y", icon: ArrowRight },
  { mode: "markup", label: "Markup / Margin", shortLabel: "Markup", desc: "Cost + markup % = selling price", icon: TrendingUp },
];