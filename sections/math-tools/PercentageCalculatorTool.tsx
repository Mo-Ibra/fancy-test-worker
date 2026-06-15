"use client";

import { useState, useMemo } from "react";
import {
  Percent,
  RefreshCw,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { CalcMode, MODES, pct, smart } from "@/funcs/math-tools/PercentageCalculatorToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import NumInput from "@/components/math-tools/percentage-calculator/NumInput";
import Tip from "@/components/math-tools/numberbase-converter/Tip";
import ResultBox from "@/components/math-tools/percentage-calculator/ResultBox";
import ModeCard from "@/components/math-tools/percentage-calculator/ModeCard";
import RelatedTools from "@/components/math-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function PercentageCalculatorTool() {
  const t = useT("math-tools/PercentageCalculatorTool.json");

  const [mode, setMode] = useState<CalcMode>("percentOf");

  // Shared inputs per mode
  const [a, setA] = useState("");  // primary input (pct or value)
  const [b, setB] = useState("");  // secondary input
  const [c, setC] = useState("");  // tertiary (split parts)

  const na = useMemo(() => parseFloat(a), [a]);
  const nb = useMemo(() => parseFloat(b), [b]);
  const nc = useMemo(() => parseFloat(c), [c]);

  const reset = () => { setA(""); setB(""); setC(""); };

  // ── Computations ───────────────────────────────────────────────

  const results = useMemo(() => {
    switch (mode) {

      case "percentOf": {
        // na% of nb
        const res = (na / 100) * nb;
        return [
          { label: `${smart(na, 2)}% of ${smart(nb, 2)}`, value: smart(res, 4), highlight: true },
          { label: t("results.remainder"), value: smart(nb - res, 4) },
          { label: t("results.fraction"), value: `${smart(na, 2)} / 100` },
        ];
      }

      case "whatPercent": {
        // na is what % of nb?
        const res = (na / nb) * 100;
        return [
          { label: `${smart(na, 2)} is what % of ${smart(nb, 2)}?`, value: pct(res), highlight: true },
          { label: t("results.asDecimal"), value: smart(na / nb, 6) },
          { label: t("results.remainderPercent"), value: pct(100 - res) },
        ];
      }

      case "increase": {
        // nb increased/decreased by na%
        const increased = nb * (1 + na / 100);
        const decreased = nb * (1 - na / 100);
        const diff = nb * (na / 100);
        return [
          { label: `${smart(nb, 2)} ${t("results.increased")} ${smart(na, 2)}%`, value: smart(increased, 4), highlight: true },
          { label: `${smart(nb, 2)} ${t("results.decreased")} ${smart(na, 2)}%`, value: smart(decreased, 4) },
          { label: `${smart(na, 2)}% of ${smart(nb, 2)} ${t("results.theChange")}`, value: smart(diff, 4) },
        ];
      }

      case "percentChange": {
        // % change from na to nb
        const change = ((nb - na) / Math.abs(na)) * 100;
        const diff = nb - na;
        const isInc = nb >= na;
        return [
          { label: `% ${isInc ? t("results.increase") : t("results.decrease")} from ${smart(na, 2)} to ${smart(nb, 2)}`, value: pct(Math.abs(change)), highlight: true, sub: isInc ? "▲ Increase" : "▼ Decrease" },
          { label: t("results.absoluteDifference"), value: smart(Math.abs(diff), 4) },
          { label: t("results.signedPercent"), value: pct(change), sub: change > 0 ? t("results.positive") : t("results.negative") },
          { label: t("results.ratio"), value: smart(nb / na, 6) },
        ];
      }

      case "reversePercent": {
        // nb is na% of what?
        const res = nb / (na / 100);
        return [
          { label: `${smart(nb, 2)} is ${smart(na, 2)}% of:`, value: smart(res, 4), highlight: true },
          { label: t("results.verification"), value: `${smart(na, 2)}% × ${smart(res, 4)} = ${smart((na / 100) * res, 4)}` },
        ];
      }

      case "percentDiff": {
        // % difference between na and nb
        const avg = (na + nb) / 2;
        const diff = Math.abs(na - nb);
        const pctD = (diff / avg) * 100;
        const relA = ((nb - na) / na) * 100;
        return [
          { label: `% difference between ${smart(na, 2)} and ${smart(nb, 2)}`, value: pct(pctD), highlight: true, sub: t("results.symmetric") },
          { label: t("results.absoluteDifference"), value: smart(diff, 4) },
          { label: `% change (${smart(na, 2)} → ${smart(nb, 2)})`, value: pct(relA), sub: t("results.relativeChange") },
          { label: t("results.average"), value: smart(avg, 4) },
        ];
      }

      case "markup": {
        // Cost = na, Markup % = nb
        const markupAmt = na * (nb / 100);
        const selling = na + markupAmt;
        const margin = (markupAmt / selling) * 100;
        const multiplier = selling / na;
        return [
          { label: `Selling price (cost + ${smart(nb, 2)}% markup)`, value: smart(selling, 4), highlight: true },
          { label: t("results.markupAmount"), value: smart(markupAmt, 4) },
          { label: t("results.profitMargin"), value: pct(margin), sub: t("results.profitMarginSub") },
          { label: t("results.priceMultiplier"), value: `×${smart(multiplier, 4)}` },
          { label: `To reverse: selling × ${smart(100 / (100 + nb), 6)}`, value: smart(na, 4), sub: t("results.recoversOriginal") },
        ];
      }

      case "splitPercent": {
        // Split nb total by na% and (100-na)%
        const p1 = nb * (na / 100);
        const p2 = nb - p1;
        const p3 = nc ? nb * (nc / 100) : null;
        const rows = [
          { label: `${smart(na, 2)}% of ${smart(nb, 2)}`, value: smart(p1, 4), highlight: true },
          { label: `${smart(100 - na, 2)}% of ${smart(nb, 2)}`, value: smart(p2, 4) },
        ];
        if (p3 !== null && !isNaN(nc)) {
          rows.push({ label: `${smart(nc, 2)}% of ${smart(nb, 2)}`, value: smart(p3 ?? 0, 4) });
          rows.push({ label: `${smart(100 - na - nc, 2)}% ${t("results.remaining")}`, value: smart(nb - p1 - (p3 ?? 0), 4) });
        }
        return rows;
      }

      default: return [];
    }
  }, [mode, na, nb, nc]);

  const activeMode = MODES.find(m => m.mode === mode)!;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="math-tools/PercentageCalculatorTool.json" href="/math-tools" />

        {/* Header */}
        <Header tKey="math-tools/PercentageCalculatorTool.json" />

        {/* ── Mode tabs (horizontal scroll on mobile) ── */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 mb-6 scrollbar-none">
          {MODES.map(({ mode: m, shortLabel, icon: Icon }) => (
            <button key={m} onClick={() => { setMode(m); reset(); }}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all ${mode === m
                ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t(`modes.${m}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: inputs ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Mode description card */}
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-border bg-card shadow-sm">
              <activeMode.icon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-foreground">{t(`modes.${mode}`)}</p>
                <p className="text-xs text-muted-foreground">{activeMode.desc}</p>
              </div>
            </div>

            {/* Dynamic inputs */}
            <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">

              {mode === "percentOf" && (
                <>
                  <NumInput label={t("input.percentage")} value={a} onChange={setA} suffix="%" placeholder="e.g. 20" />
                  <NumInput label={t("input.ofNumber")} value={b} onChange={setB} placeholder="e.g. 500" />
                  <Tip text={t("tips.percentOf")} />
                </>
              )}

              {mode === "whatPercent" && (
                <>
                  <NumInput label={t("input.valueX")} value={a} onChange={setA} placeholder="e.g. 75" />
                  <NumInput label={t("input.totalY")} value={b} onChange={setB} placeholder="e.g. 300" />
                  <Tip text={t("tips.whatPercent")} />
                </>
              )}

              {mode === "increase" && (
                <>
                  <NumInput label={t("input.percentageChange")} value={a} onChange={setA} suffix="%" placeholder="e.g. 15" />
                  <NumInput label={t("input.originalValue")} value={b} onChange={setB} placeholder="e.g. 200" />
                  <Tip text={t("tips.increase")} />
                </>
              )}

              {mode === "percentChange" && (
                <>
                  <NumInput label={t("input.originalValueFrom")} value={a} onChange={setA} placeholder="e.g. 80" />
                  <NumInput label={t("input.newValueTo")} value={b} onChange={setB} placeholder="e.g. 100" />
                  <Tip text={t("tips.percentChange")} />
                </>
              )}

              {mode === "reversePercent" && (
                <>
                  <NumInput label={t("input.percentage")} value={a} onChange={setA} suffix="%" placeholder="e.g. 25" />
                  <NumInput label={t("input.isThisValue")} value={b} onChange={setB} placeholder="e.g. 75" />
                  <Tip text={t("tips.reversePercent")} />
                </>
              )}

              {mode === "percentDiff" && (
                <>
                  <NumInput label={t("input.valueA")} value={a} onChange={setA} placeholder="e.g. 120" />
                  <NumInput label={t("input.valueB")} value={b} onChange={setB} placeholder="e.g. 150" />
                  <Tip text={t("tips.percentDiff")} />
                </>
              )}

              {mode === "markup" && (
                <>
                  <NumInput label={t("input.costPrice")} value={a} onChange={setA} prefix="$" placeholder="e.g. 50" />
                  <NumInput label={t("input.markupPercentage")} value={b} onChange={setB} suffix="%" placeholder="e.g. 40" />
                  <Tip text={t("tips.markup")} />
                </>
              )}

              {mode === "splitPercent" && (
                <>
                  <NumInput label={t("input.totalAmount")} value={b} onChange={setB} placeholder="e.g. 1000" />
                  <NumInput label={t("input.firstShare")} value={a} onChange={setA} suffix="%" placeholder="e.g. 30" />
                  <NumInput label={t("input.secondShare")} value={c} onChange={setC} suffix="%" placeholder="e.g. 20" />
                  <Tip text={t("tips.split")} />
                </>
              )}

              {/* Reset */}
              <button onClick={reset}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border bg-muted/20 hover:border-red-200 hover:text-red-500 text-xs font-medium text-muted-foreground transition-all">
                <RefreshCw className="w-3.5 h-3.5" /> {t("ui.reset")}
              </button>
            </div>

            {/* All modes list (compact) */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("ui.allModes")}</p>
              <div className="flex flex-col gap-1.5">
                {MODES.map(m => (
                  <ModeCard
                    key={m.mode}
                    {...m}
                    active={mode === m.mode}
                    onClick={() => { setMode(m.mode); reset(); }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: results ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Main result */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("ui.results")}</p>
              {results.map((r, i) => (
                <ResultBox key={i} label={r.label} value={r.value} highlight={!!(r as any).highlight} sub={(r as any).sub} />
              ))}
              {results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30 gap-3">
                  <Percent className="w-12 h-12" />
                  <p className="text-sm">{t("ui.enterValues")}</p>
                </div>
              )}
            </div>

            {/* Formula explanation */}
            {results.length > 0 && (
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("ui.formula")}</p>
                <div className="text-sm font-mono text-foreground">
                  {mode === "percentOf" && <p className="leading-loose">result = (<span className="text-blue-500">{a || "X"}</span> ÷ 100) × <span className="text-purple-500">{b || "Y"}</span></p>}
                  {mode === "whatPercent" && <p className="leading-loose">result = (<span className="text-blue-500">{a || "X"}</span> ÷ <span className="text-purple-500">{b || "Y"}</span>) × 100</p>}
                  {mode === "increase" && <p className="leading-loose">increased = <span className="text-purple-500">{b || "Y"}</span> × (1 + <span className="text-blue-500">{a || "X"}</span>/100)<br />decreased = <span className="text-purple-500">{b || "Y"}</span> × (1 − <span className="text-blue-500">{a || "X"}</span>/100)</p>}
                  {mode === "percentChange" && <p className="leading-loose">% change = ((<span className="text-purple-500">{b || "new"}</span> − <span className="text-blue-500">{a || "old"}</span>) ÷ |<span className="text-blue-500">{a || "old"}</span>|) × 100</p>}
                  {mode === "reversePercent" && <p className="leading-loose">whole = <span className="text-purple-500">{b || "part"}</span> ÷ (<span className="text-blue-500">{a || "X"}</span> ÷ 100)</p>}
                  {mode === "percentDiff" && <p className="leading-loose">% diff = (|<span className="text-blue-500">{a || "A"}</span> − <span className="text-purple-500">{b || "B"}</span>|) ÷ ((<span className="text-blue-500">{a || "A"}</span> + <span className="text-purple-500">{b || "B"}</span>) ÷ 2) × 100</p>}
                  {mode === "markup" && <p className="leading-loose">selling = <span className="text-blue-500">{a || "cost"}</span> × (1 + <span className="text-purple-500">{b || "markup"}</span>/100)<br />margin = markup ÷ selling × 100</p>}
                  {mode === "splitPercent" && <p className="leading-loose">part₁ = <span className="text-purple-500">{b || "total"}</span> × <span className="text-blue-500">{a || "X"}</span>/100<br />part₂ = total − part₁</p>}
                </div>
              </div>
            )}

            {/* Quick reference table */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("ui.quickReference")}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  ["1%", "÷ 100"],
                  ["5%", "÷ 20"],
                  ["10%", "÷ 10"],
                  ["12.5%", "÷ 8"],
                  ["20%", "÷ 5"],
                  ["25%", "÷ 4"],
                  ["33.3%", "÷ 3"],
                  ["50%", "÷ 2"],
                  ["66.7%", "× 2/3"],
                  ["75%", "× 3/4"],
                  ["100%", "× 1 (same)"],
                  ["200%", "× 2 (double)"],
                ].map(([pct, equiv]) => (
                  <div key={pct} className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400 w-16">{pct}</span>
                    <span className="text-xs font-mono text-muted-foreground">{equiv}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <HowToUse tKey="math-tools/PercentageCalculatorTool.json" count={4} />
        <FAQ tKey="math-tools/PercentageCalculatorTool.json" />
        <Examples tKey="math-tools/PercentageCalculatorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}