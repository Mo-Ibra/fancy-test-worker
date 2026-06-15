"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Star,
  Heart,
  Zap,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/math-tools/RelatedTools";
import { calculateAge, FAMOUS } from "@/funcs/math-tools/AgeCalculatorToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import QuickExamples from "@/components/math-tools/age-calculator/QuickExamples";
import DateInputs from "@/components/math-tools/age-calculator/DateInputs";
import ProgressBar from "@/components/math-tools/age-calculator/ProgressBar";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function AgeCalculatorTool() {
  const t = useT("math-tools/AgeCalculatorTool.json");

  const todayStr = new Date().toISOString().split("T")[0];
  const [birthStr, setBirthStr] = useState("1995-03-15");
  const [targetStr, setTargetStr] = useState(todayStr);
  const [nowTick, setNowTick] = useState(Date.now());

  // Live tick for seconds
  useEffect(() => {
    const interval = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const isTargetToday = targetStr === todayStr;

  const result = useMemo(() => {
    if (!birthStr || !targetStr) return null;
    const bd = new Date(birthStr + "T00:00:00");
    const td = isTargetToday ? new Date() : new Date(targetStr + "T00:00:00");
    if (isNaN(bd.getTime()) || isNaN(td.getTime())) return null;
    if (bd > td) return null;
    // Use live time for seconds tick
    void nowTick;
    return calculateAge(bd, isTargetToday ? new Date() : td);
  }, [birthStr, targetStr, isTargetToday, nowTick]);

  const birthDate = useMemo(() => birthStr ? new Date(birthStr + "T00:00:00") : null, [birthStr]);
  const birthKey = birthDate ? `${String(birthDate.getMonth() + 1).padStart(2, "0")}-${String(birthDate.getDate()).padStart(2, "0")}` : "";
  const famousPeople = FAMOUS[birthKey] ?? [];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="math-tools/AgeCalculatorTool.json" href="/math-tools" />

        {/* Header */}
        <Header tKey="math-tools/AgeCalculatorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Inputs ── */}
          <div className="flex flex-col gap-5">

            {/* Date inputs */}
            <DateInputs
              birthStr={birthStr}
              setBirthStr={setBirthStr}
              targetStr={targetStr}
              setTargetStr={setTargetStr}
              todayStr={todayStr}
              isTargetToday={isTargetToday}
              t={t} />

            {/* Birth facts */}
            {result && birthDate && (
              <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("birthFacts")}</p>

                {[
                  { label: t("dayOfWeek"), value: result.dayOfWeek },
                  { label: t("season"), value: result.season },
                  { label: t("zodiac"), value: `${result.zodiac.symbol} ${result.zodiac.sign}`, sub: result.zodiac.dates },
                  { label: t("chineseZodiac"), value: `${result.chinese.symbol} ${result.chinese.year}` },
                  { label: t("generation"), value: result.generation.name, sub: result.generation.years },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="flex items-start justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-24 shrink-0 pt-0.5">{label}</span>
                    <div className="flex-1 text-right">
                      <span className="text-xs font-bold text-foreground">{value}</span>
                      {sub && <p className="text-[9px] text-muted-foreground">{sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Famous same birthday */}
            {famousPeople.length > 0 && (
              <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-400" /> {t("birthdayFacts.title")}
                </p>
                {famousPeople.map(p => (
                  <div key={p.name} className="flex items-center gap-2.5 py-2">
                    <div className="w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center text-sm">🎂</div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.year} · {p.field}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick examples */}
            <QuickExamples setBirthStr={setBirthStr} setTargetStr={setTargetStr} todayStr={todayStr} />
          </div>

          {/* ── Right: Results ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {result ? (
              <>
                {/* Primary age display */}
                <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">{t("exactAge")}</p>
                  <div className="flex items-end gap-3 flex-wrap mb-4">
                    <span className="text-5xl font-black text-blue-600 dark:text-blue-400 tabular-nums leading-none">{result.years}</span>
                    <div className="flex gap-4 pb-1">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground tabular-nums">{result.months}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t("age.months")}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground tabular-nums">{result.days}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{t("age.days")}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground pb-1">{t("age.yearsOld")}</span>
                  </div>

                  {/* Compact total stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { label: t("totalStats.totalDays"), value: result.totalDays.toLocaleString() },
                      { label: t("totalStats.totalWeeks"), value: result.totalWeeks.toLocaleString() },
                      { label: t("totalStats.totalMonths"), value: result.totalMonths.toLocaleString() },
                      { label: t("totalStats.totalHours"), value: result.totalHours.toLocaleString() },
                      { label: t("totalStats.totalMinutes"), value: result.totalMinutes.toLocaleString() },
                      { label: t("totalStats.seconds"), value: result.totalSeconds.toLocaleString() },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col items-center py-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-white/60 dark:bg-black/10">
                        <span className="text-sm font-bold font-mono tabular-nums text-foreground">{value}</span>
                        <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>
                  {isTargetToday && (
                    <p className="text-[10px] text-blue-400/70 mt-2 text-right">🔴 {t("secondsUpdate")}</p>
                  )}
                </div>

                {/* Next birthday */}
                <div className={`flex items-center gap-4 p-5 rounded-2xl border shadow-sm ${result.nextBirthday.days === 0
                  ? "border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10"
                  : "border-border bg-card"
                  }`}>
                  <div className="text-3xl">{result.nextBirthday.days === 0 ? "🎂" : "🎁"}</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {result.nextBirthday.days === 0
                        ? `🎉 ${t("nextBirthday.happyBirthday")}`
                        : `${t("nextBirthday.nextBirthdayIn")} ${result.nextBirthday.days.toLocaleString()} ${t("nextBirthday.days")}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {result.nextBirthday.date} · {t("turning")} {result.nextBirthday.age}
                    </p>
                  </div>
                  {result.nextBirthday.days > 0 && (
                    <div className="flex flex-col items-center px-3 py-2 rounded-xl border border-border bg-background">
                      <span className="text-lg font-black tabular-nums text-foreground">{result.nextBirthday.days}</span>
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wide">{t("nextBirthday.days")}</span>
                    </div>
                  )}
                </div>

                {/* Life progress */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-red-400" /> {t("lifeJourney")}
                    </p>
                    <span className="text-xs font-bold text-foreground">{result.lifePercent}%</span>
                  </div>
                  <ProgressBar pct={result.lifePercent} color="bg-gradient-to-r from-blue-400 to-purple-500" />
                  <p className="text-[10px] text-muted-foreground mt-1.5">{t("lifeExpectancy")}</p>
                </div>

                {/* Milestones */}
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 bg-muted/20 border-b border-border">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">{t("ageMilestones")}</span>
                  </div>
                  <div className="divide-y divide-border max-h-72 overflow-y-auto">
                    {result.milestones.map(({ label, date, passed, daysAway }) => (
                      <div key={label} className={`flex items-center gap-3 px-5 py-3 ${passed ? "" : "hover:bg-muted/20"} transition-colors`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${passed
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted/40 text-muted-foreground"
                          }`}>
                          {passed ? "✓" : "○"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${passed ? "text-muted-foreground line-through" : "text-foreground"}`}>{label}</p>
                          <p className="text-[10px] text-muted-foreground">{date}</p>
                        </div>
                        {!passed && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 shrink-0">
                            {t("inDays")} {daysAway.toLocaleString()}d
                          </span>
                        )}
                        {passed && (
                          <span className="text-[10px] text-muted-foreground/50 shrink-0">
                            {daysAway.toLocaleString()} {t("daysAgo")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/30 gap-3">
                <Calendar className="w-12 h-12" />
                <p className="text-sm">{t("enterDob")}</p>
              </div>
            )}
          </div>
        </div>

        <HowToUse tKey="math-tools/AgeCalculatorTool.json" count={4} />
        <FAQ tKey="math-tools/AgeCalculatorTool.json" />
        <Examples tKey="math-tools/AgeCalculatorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}