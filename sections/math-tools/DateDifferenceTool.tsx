"use client";

import { useState, useMemo, useEffect } from "react";
import {
  CalendarRange,
  ArrowRight,
  ArrowLeftRight,
  Clock,
  Plus,
} from "lucide-react";
import { useT, useLang } from "@/context/TranslationProvider";
import { addSubDate, diffDates, fmtDate, NOTABLE, offsetDate, PRESETS, todayStr } from "@/funcs/math-tools/DateDifferenceToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import TimelineBar from "@/components/math-tools/date-difference/TimelineBar";
import StatBox from "@/components/math-tools/date-difference/StatBox";
import CopyButton from "@/components/math-tools/date-difference/CopyButton";
import RelatedTools from "@/components/math-tools/RelatedTools";
import SubtractResult from "@/components/math-tools/date-difference/SubtractResult";
import MultiUnitPreview from "@/components/math-tools/date-difference/MultiUnitPreview";
import WorkingDays from "@/components/math-tools/date-difference/WorkingDays";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function DateDifferenceTool() {
  const t = useT("math-tools/DateDifferenceTool.json");

  const today = todayStr();

  const [date1, setDate1] = useState(() => offsetDate(-30));
  const [date2, setDate2] = useState(today);
  const [tick, setTick] = useState(Date.now());

  // Add/Subtract tab
  const [addBase, setAddBase] = useState(today);
  const [addAmount, setAddAmount] = useState("30");
  const [addUnit, setAddUnit] = useState<"days" | "weeks" | "months" | "years">("days");

  // Tick for live second display
  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const [activeTab, setActiveTab] = useState<"diff" | "addSub">("diff");

  const d1 = useMemo(() => date1 ? new Date(date1 + "T00:00:00") : null, [date1]);
  const d2 = useMemo(() => date2 ? new Date(date2 + "T00:00:00") : null, [date2]);

  const diff = useMemo(() => {
    if (!d1 || !d2) return null;
    return diffDates(d1, d2);
  }, [d1, d2, tick]); // tick re-evaluates when tab is live

  const lang = useLang();

  const localizedLabel = useMemo(() => {
    if (!diff) return "";

    const getPluralKey = (unit: string, count: number) => {
      if (lang !== "ar") {
        return count === 1 ? `${unit}_one` : `${unit}_other`;
      }
      // Arabic pluralization rules
      if (count === 0) return `${unit}_other`; // Usually treated as other
      if (count === 1) return `${unit}_one`;
      if (count === 2) return `${unit}_two`;
      if (count >= 3 && count <= 10) return `${unit}_few`;
      if (count >= 11 && count <= 99) return `${unit}_many`;
      return `${unit}_other`;
    };

    const parts = [];
    if (diff.years) parts.push(t(`durationUnits.${getPluralKey("years", diff.years)}`, { count: diff.years }));
    if (diff.months) parts.push(t(`durationUnits.${getPluralKey("months", diff.months)}`, { count: diff.months }));
    if (diff.days) parts.push(t(`durationUnits.${getPluralKey("days", diff.days)}`, { count: diff.days }));
    
    return parts.length ? parts.join(t("durationUnits.separator")) : t("durationUnits.sameDay");
  }, [diff, t, lang]);

  // Add/Sub result
  const addBase_d = useMemo(() => addBase ? new Date(addBase + "T00:00:00") : null, [addBase]);
  const addAmount_n = useMemo(() => parseInt(addAmount) || 0, [addAmount]);
  const addResult = useMemo(() => {
    if (!addBase_d) return null;
    return {
      add: addSubDate(addBase_d, addUnit, addAmount_n, "add"),
      sub: addSubDate(addBase_d, addUnit, addAmount_n, "sub"),
    };
  }, [addBase_d, addUnit, addAmount_n]);

  const swap = () => { setDate1(date2); setDate2(date1); };

  // Life-context: % of current year elapsed
  const yearPct = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    return ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
  }, [tick]);

  const TABS = [
    { key: "diff" as const, label: t("tabs.diff") },
    { key: "addSub" as const, label: t("tabs.addSub") },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="math-tools/DateDifferenceTool.json" href="/math-tools" />

        {/* Header */}
        <Header tKey="math-tools/DateDifferenceTool.json" />

        {/* ── Year progress strip ── */}
        <div className="mb-6 p-4 rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{new Date().getFullYear()} {t("yearProgress")}</span>
            <span className="text-xs font-bold text-blue-500">{yearPct.toFixed(1)}%</span>
          </div>
          <TimelineBar pct={yearPct} />
          <p className="text-[10px] text-muted-foreground mt-1">
            {t("todayLabel")} {fmtDate(new Date())}
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-1 p-1 rounded-xl border border-border bg-card shadow-sm mb-6 max-w-sm">
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}>{label}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: inputs ── */}
          <div className="flex flex-col gap-5">

            {activeTab === "diff" && (
              <>
                {/* Date inputs */}
                <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> {t("date1")}</span>
                    </label>
                    <input type="date" value={date1} onChange={e => setDate1(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all" aria-label={t("date1")} />
                  </div>

                  <div className="flex justify-center">
                    <button onClick={swap}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-muted/30 hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                      <ArrowLeftRight className="w-3.5 h-3.5" /> {t("swap")}
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> {t("date2")}</span>
                    </label>
                    <div className="flex gap-2">
                      <input type="date" value={date2} onChange={e => setDate2(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all" aria-label={t("date2")} />
                      <button onClick={() => setDate2(today)} title="Set to today"
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${date2 === today
                          ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                          : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                          }`}>{t("presets.today")}</button>
                    </div>
                  </div>
                </div>

                {/* Quick presets */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("presets.title")}</p>
                  <div className="flex flex-col gap-1.5">
                    {PRESETS.map(({ label, from, to }) => (
                      <button key={label} onClick={() => { setDate1(from()); setDate2(to()); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground text-left transition-all">
                        <CalendarRange className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        {t(`presets.${label}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notable dates */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("notableDates.title")}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {NOTABLE.map(({ label, date }) => (
                      <button key={label}
                        onClick={() => { setDate1(date); setDate2(today); }}
                        className="flex flex-col items-start px-3 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all text-left group">
                        <span className="text-[10px] font-bold text-foreground group-hover:text-blue-500 transition-colors">{t(`notableDates.${label}`)}</span>
                        <span className="text-[9px] font-mono text-muted-foreground">{date}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "addSub" && (
              <>
                <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("addSub.baseDate")}</label>
                    <div className="flex gap-2">
                      <input type="date" value={addBase} onChange={e => setAddBase(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" aria-label={t("addSub.baseDate")} />
                      <button onClick={() => setAddBase(today)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${addBase === today
                          ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                          : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                          }`}>{t("presets.today")}</button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("addSub.amount")}</label>
                    <input type="number" value={addAmount} min={0} onChange={e => setAddAmount(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-xl font-mono font-bold focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/30"
                      placeholder="30" aria-label={t("addSub.amount")} />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("addSub.unit")}</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(["days", "weeks", "months", "years"] as const).map(u => (
                        <button key={u} onClick={() => setAddUnit(u)}
                          className={`py-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${addUnit === u ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                            }`}>{t(`addSub.${u}`)}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick amounts */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("quickAmounts")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[1, 7, 14, 30, 60, 90, 180, 365].map(n => (
                      <button key={n} onClick={() => setAddAmount(String(n))}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${addAmount === String(n) ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                          }`}>{n}</button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Right: results ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* ── Diff results ── */}
            {activeTab === "diff" && (
              <>
                {diff ? (
                  <>
                    {/* Primary result */}
                    <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10 shadow-sm">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">
                            {diff.isForward ? t("duration") : t("durationReversed")}
                          </p>
                          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-tight">{localizedLabel}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {d1 && d2 && (
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${diff.isForward
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                              }`}>
                              {diff.isForward ? t("forward") : t("backward")}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Date labels */}
                      {d1 && d2 && (
                        <div className="flex items-center gap-2 text-xs mb-4 flex-wrap">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                            <span className="text-muted-foreground">{fmtDate(new Date(Math.min(d1.getTime(), d2.getTime())))}</span>
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-400" />
                            <span className="text-muted-foreground">{fmtDate(new Date(Math.max(d1.getTime(), d2.getTime())))}</span>
                          </span>
                        </div>
                      )}

                      {/* Stats grid */}
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        <StatBox label={t("years")} value={diff.years} accent />
                        <StatBox label={t("months")} value={diff.months} accent />
                        <StatBox label={t("weeksRem")} value={diff.weeks} />
                        <StatBox label={t("daysRem")} value={diff.days} />
                      </div>
                    </div>

                    {/* Total breakdowns */}
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("totalDuration")}</p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        <StatBox label={t("result.days")} value={diff.totalDays} />
                        <StatBox label={t("result.weeks")} value={diff.totalWeeks} />
                        <StatBox label={t("result.months")} value={diff.totalMonths} />
                        <StatBox label={t("hours")} value={diff.totalHours} />
                        <StatBox label={t("minutes")} value={diff.totalMinutes} />
                        <StatBox label={t("seconds")} value={diff.totalSeconds} />
                      </div>
                      {d1 && date2 === today && (
                        <p className="text-[10px] text-muted-foreground/50 mt-2">{t("secondsLive")}</p>
                      )}
                    </div>

                    {/* Working days */}
                    <WorkingDays diff={diff} />

                    {/* Copy row */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{t("summary")}</p>
                        <code className="text-xs font-mono text-foreground">{localizedLabel} ({diff.totalDays.toLocaleString()} {t("result.days")})</code>
                      </div>
                      <CopyButton text={`${localizedLabel} (${diff.totalDays.toLocaleString()} ${t("result.days")})`} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/30 gap-3">
                    <CalendarRange className="w-12 h-12" />
                    <p className="text-sm">{t("selectDates")}</p>
                  </div>
                )}
              </>
            )}

            {/* ── Add/Sub results ── */}
            {activeTab === "addSub" && (
              <>
                {addResult && addBase_d ? (
                  <>
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("addSub.baseDate")}</p>
                      <p className="text-sm font-bold text-foreground">{fmtDate(addBase_d)}</p>
                    </div>

                    {/* Add result */}
                    <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <Plus className="w-4 h-4 text-emerald-500" />
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          {t("addSub.afterAdding")} {addAmount_n.toLocaleString()} {t(`addSub.${addUnit}`)}
                        </p>
                      </div>
                      <p className="text-lg font-black text-foreground mb-1">{addResult.add.formatted}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <code className="text-xs font-mono text-muted-foreground">
                          {addResult.add.result.toISOString().split("T")[0]}
                        </code>
                        <CopyButton text={addResult.add.formatted} />
                      </div>
                    </div>

                    {/* Subtract result */}
                    <SubtractResult addAmount_n={addAmount_n} addUnit={addUnit} addResult={addResult} />

                    {/* Multi-unit preview */}
                    <MultiUnitPreview addBase_d={addBase_d} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/30 gap-3">
                    <Clock className="w-12 h-12" />
                    <p className="text-sm">{t("enterBaseDate")}</p>
                  </div>
                )}
              </>
            )}

          </div>
        </div>

        <HowToUse tKey="math-tools/DateDifferenceTool.json" count={4} />
        <FAQ tKey="math-tools/DateDifferenceTool.json" />
        <Examples tKey="math-tools/DateDifferenceTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}