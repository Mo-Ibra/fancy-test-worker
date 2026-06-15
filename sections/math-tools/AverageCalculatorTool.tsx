"use client";

import { useState, useMemo } from "react";
import {
  BarChart2,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { calcStats, fmt, parseNumbers } from "@/funcs/math-tools/AverageCalculatorToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import RelatedTools from "@/components/math-tools/RelatedTools";
import StatRow from "@/components/math-tools/average-calculator/StatRow";
import BoxPlot from "@/components/math-tools/average-calculator/BoxPlot";
import FrequencyChart from "@/components/math-tools/average-calculator/FrequencyChart";
import CopyButton from "@/components/math-tools/average-calculator/CopyButton";
import InputArea from "@/components/math-tools/average-calculator/InputArea";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Examples ───────────────────────────────────────────────────────

const EXAMPLES = [
  { labelKey: "examples.simple", nums: "4 8 6 5 3 2 8 9 2 5" },
  { labelKey: "examples.testScores", nums: "85 92 78 95 88 72 91 84 90 76" },
  { labelKey: "examples.withOutlier", nums: "10 12 11 13 10 12 100 11 9 12" },
  { labelKey: "examples.negative", nums: "-5 -3 -1 0 1 3 5 7 9" },
  { labelKey: "examples.salary", nums: "45000 52000 48000 61000 55000 49000 58000 47000" },
  { labelKey: "examples.allSame", nums: "7 7 7 7 7 7" },
];

// ── Main ───────────────────────────────────────────────────────────

export default function AverageCalculatorTool() {
  const t = useT("math-tools/AverageCalculatorTool.json");

  const [input, setInput] = useState("4 8 6 5 3 2 8 9 2 5");
  const [newNum, setNewNum] = useState("");
  const [showSorted, setShowSorted] = useState(false);

  const { nums, errors } = useMemo(() => parseNumbers(input), [input]);

  const stats = useMemo(() => {
    if (nums.length === 0) return null;
    try { return calcStats(nums); }
    catch { return null; }
  }, [nums]);

  const addNumber = () => {
    const n = parseFloat(newNum);
    if (isNaN(n)) return;
    setInput(p => (p.trim() ? p.trim() + " " : "") + newNum.trim());
    setNewNum("");
  };

  const removeIndex = (i: number) => {
    const arr = [...nums];
    arr.splice(i, 1);
    setInput(arr.join(" "));
  };

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="math-tools/AverageCalculatorTool.json" href="/math-tools" />

        {/* Header */}
        <Header tKey="math-tools/AverageCalculatorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Input ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input area */}
            <InputArea
              nums={nums}
              input={input}
              setInput={setInput}
              newNum={newNum}
              setNewNum={setNewNum}
              addNumber={addNumber}
              errors={errors}
            />

            {/* Number chips */}
            {nums.length > 0 && nums.length <= 50 && (
              <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("stats.values")}</p>
                  <button onClick={() => setShowSorted(p => !p)}
                    className="text-[10px] font-bold text-muted-foreground hover:text-blue-500 transition-colors">
                    {showSorted ? t("stats.originalOrder") : t("stats.sorted")}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                  {(showSorted ? [...nums].sort((a, b) => a - b) : nums).map((n, i) => {
                    const isOutlier = stats?.outliers.includes(n);
                    const isMode = stats?.mode.includes(n) && (stats?.mode.length ?? 0) > 0;
                    return (
                      <button key={i} onClick={() => removeIndex(showSorted ? nums.indexOf(n) : i)}
                        title={t("stats.clickToRemove")}
                        className={`px-2 py-1 rounded-lg border text-[10px] font-mono font-bold transition-all hover:opacity-70 ${isOutlier
                          ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                          : isMode
                            ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                            : "border-border bg-muted/20 text-foreground"
                          }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                {nums.length > 50 && (
                  <p className="text-[10px] text-muted-foreground/50 mt-1">{t("stats.chipView")}</p>
                )}
                <div className="flex gap-3 mt-2 flex-wrap text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-200 dark:bg-blue-800" /> {t("stats.mode")}</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-200 dark:bg-amber-800" /> {t("stats.outlierChip")}</span>
                  <span className="text-muted-foreground/50">{t("stats.clickRemove")}</span>
                </div>
              </div>
            )}

            {/* Examples */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("examples.title")}</p>
              <div className="flex flex-col gap-1.5">
                {EXAMPLES.map(({ labelKey, nums: n }) => (
                  <button key={labelKey} onClick={() => setInput(n)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground text-left transition-all">
                    <BarChart2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="flex-1">{t(labelKey)}</span>
                    <span className="text-[10px] font-mono text-muted-foreground/60 truncate max-w-[100px]">{n}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Results ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {stats ? (
              <>
                {/* Primary 4: mean, median, mode, range */}
                <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-3">{t("stats.coreStatistics")}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: t("stats.meanAverage"), value: fmt(stats.mean), sub: t("stats.arithmeticMean"), highlight: true },
                      { label: t("stats.median"), value: fmt(stats.median), sub: t("stats.middleValue"), highlight: false },
                      { label: t("stats.mode"), value: stats.mode.length ? stats.mode.map(v => fmt(v, 6)).join(", ") : t("stats.noMode"), sub: stats.mode.length ? t("stats.appearsTimes", { count: stats.frequencies.get(stats.mode[0]) ?? 0 }) : t("stats.allUnique"), highlight: false },
                      { label: t("stats.range"), value: fmt(stats.range), sub: `${fmt(stats.min)} ${t("stats.to")} ${fmt(stats.max)}`, highlight: false },
                    ].map(({ label, value, sub, highlight }) => (
                      <div key={label} className={`flex flex-col gap-0.5 p-3.5 rounded-xl border ${highlight
                        ? "border-blue-300 dark:border-blue-700 bg-white/70 dark:bg-black/20"
                        : "border-blue-100 dark:border-blue-900/30 bg-white/50 dark:bg-black/10"
                        }`}>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">{label}</span>
                        <span className={`text-xl font-black font-mono tabular-nums ${highlight ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{value}</span>
                        <span className="text-[9px] text-muted-foreground">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Count + sum strip */}
                <div className="grid grid-cols-3 gap-3">
                  <StatRow label={t("stats.count")} value={String(stats.count)} sub={t("stats.n")} accent />
                  <StatRow label={t("stats.sum")} value={fmt(stats.sum)} sub={t("stats.sigmaX")} />
                  <StatRow label={t("stats.min")} value={fmt(stats.min)} sub={t("stats.smallest")} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <StatRow label={t("stats.max")} value={fmt(stats.max)} sub={t("stats.largest")} />
                  <StatRow label={t("stats.q1")} value={fmt(stats.q1)} sub={t("stats.q1Sub")} />
                  <StatRow label={t("stats.q3")} value={fmt(stats.q3)} sub={t("stats.q3Sub")} />
                </div>

                {/* Spread */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("stats.spread")}</p>
                  <div className="flex flex-col gap-2">
                    <StatRow label={t("stats.iqr")} value={fmt(stats.iqr)} sub={t("stats.iqrSub")} />
                    <StatRow label={t("stats.stdDevPop")} value={fmt(stats.stdDev)} sub={t("stats.stdDevPopSub")} accent />
                    <StatRow label={t("stats.stdDevSample")} value={fmt(stats.sStdDev)} sub={t("stats.stdDevSampleSub")} />
                    <StatRow label={t("stats.varPop")} value={fmt(stats.variance)} sub={t("stats.varPopSub")} />
                    <StatRow label={t("stats.varSample")} value={fmt(stats.sVariance)} sub={t("stats.varSampleSub")} />
                    <StatRow label={t("stats.rms")} value={fmt(stats.rms)} sub={t("stats.rmsSub")} />
                  </div>
                </div>

                {/* Other means */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("stats.otherMeans")}</p>
                  <div className="flex flex-col gap-2">
                    <StatRow label={t("stats.arithmeticMeanFull")} value={fmt(stats.mean)} sub={t("stats.arithmeticMeanSub")} highlight />
                    <StatRow label={t("stats.geometricMean")} value={stats.geometric != null ? fmt(stats.geometric) : t("stats.naPositive")} sub={t("stats.geometricMeanSub")} />
                    <StatRow label={t("stats.harmonicMean")} value={stats.harmonic != null ? fmt(stats.harmonic) : t("stats.naZero")} sub={t("stats.harmonicMeanSub")} />
                  </div>
                </div>

                {/* Distribution info */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("stats.distribution")}</p>
                  <div className="flex flex-col gap-2">
                    <StatRow label={t("stats.skewness")} value={fmt(stats.skewness, 4)}
                      sub={Math.abs(stats.skewness) < 0.5 ? t("stats.skewnessSymmetric") : stats.skewness > 0 ? t("stats.skewnessRight") : t("stats.skewnessLeft")} />
                    {stats.outliers.length > 0 && (
                      <StatRow label={t("stats.outliers")}
                        value={stats.outliers.map(v => fmt(v, 4)).join(", ")}
                        sub={t("stats.outliersSub", { count: stats.outliers.length, s: stats.outliers.length > 1 ? "s" : "" })} />
                    )}
                    {stats.outliers.length === 0 && (
                      <StatRow label={t("stats.outliersNone")} value={t("stats.noneDetected")} sub={t("stats.noneDetectedSub")} accent />
                    )}
                  </div>
                </div>

                {/* Box plot */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("stats.boxPlot")}</p>
                  <BoxPlot stats={stats} />
                  <div className="flex gap-4 mt-2 flex-wrap text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400/20 border border-blue-500" /> {t("stats.iqrBox")}</span>
                    <span className="flex items-center gap-1"><span className="w-0.5 h-3 bg-blue-500 inline-block" /> {t("stats.median")}</span>
                    {stats.outliers.length > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> {t("stats.outlier")}</span>}
                  </div>
                </div>

                {/* Frequency distribution */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    {t("stats.frequency")} ({t("stats.uniqueValues", { count: stats.frequencies.size })})
                  </p>
                  <FrequencyChart freq={stats.frequencies} sorted={stats.sorted} />

                  {/* Frequency table */}
                  {stats.frequencies.size <= 20 && (
                    <div className="mt-4 rounded-xl border border-border overflow-hidden">
                      <div className="grid grid-cols-3 bg-muted/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                        <span>{t("stats.value")}</span><span className="text-center">{t("stats.count")}</span><span className="text-right">{t("stats.freqPercent")}</span>
                      </div>
                      <div className="divide-y divide-border max-h-52 overflow-y-auto">
                        {[...stats.frequencies.entries()]
                          .sort((a, b) => a[0] - b[0])
                          .map(([val, cnt]) => {
                            const pct = (cnt / stats.count * 100).toFixed(1);
                            const isMode = cnt === Math.max(...stats.frequencies.values()) && cnt > 1;
                            return (
                              <div key={val} className={`grid grid-cols-3 px-3 py-2.5 items-center ${isMode ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-muted/20"} transition-colors`}>
                                <code className={`text-xs font-mono font-bold ${isMode ? "text-blue-500" : "text-foreground"}`}>{fmt(val, 6)}</code>
                                <span className="text-xs font-mono text-center tabular-nums">{cnt}</span>
                                <div className="flex items-center justify-end gap-2">
                                  <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
                                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-10 text-right">{pct}%</span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Copy all stats */}
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{t("stats.copySummary")}</p>
                    <code className="text-[10px] font-mono text-muted-foreground">Mean={fmt(stats.mean)} Median={fmt(stats.median)} Mode={stats.mode.length ? stats.mode.join(",") : "none"} Range={fmt(stats.range)} StdDev={fmt(stats.stdDev)}</code>
                  </div>
                  <CopyButton text={`Count=${stats.count} Sum=${fmt(stats.sum)} Mean=${fmt(stats.mean)} Median=${fmt(stats.median)} Mode=${stats.mode.length ? stats.mode.join(",") : "none"} Range=${fmt(stats.range)} Min=${fmt(stats.min)} Max=${fmt(stats.max)} StdDev(pop)=${fmt(stats.stdDev)} StdDev(sample)=${fmt(stats.sStdDev)} Q1=${fmt(stats.q1)} Q3=${fmt(stats.q3)} IQR=${fmt(stats.iqr)}`} />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/30 gap-3">
                <BarChart2 className="w-12 h-12" />
                <p className="text-sm">{t("stats.enterNumbers")}</p>
              </div>
            )}
          </div>
        </div>

        <HowToUse tKey="math-tools/AverageCalculatorTool.json" count={4} />
        <FAQ tKey="math-tools/AverageCalculatorTool.json" />
        <Examples tKey="math-tools/AverageCalculatorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}