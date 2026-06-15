"use client";

import { useState, useMemo } from "react";
import {
  BookOpen,
  ClipboardPaste,
  Trash2,
  CheckCircle2,
  Info,
  BarChart2,
  Eye,
  FileText,
  Layers,
  TrendingUp,
  Users,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import { automatedReadability, colemanLiau, daleChall, extractMetrics, fleschKincaidGrade, fleschLabel, fleschReadingEase, gradeToDesc, gunningFog, linsearWrite, sentimentScore, smogIndex, topWords } from "@/funcs/seo-tools/ReadabilityCheckerToolFuncs";
import ScoreGauge from "@/components/seo-tools/readability-checker/ScoreGauge";
import StatCard from "@/components/seo-tools/readability-checker/StatsCard";
import GradeBadge from "@/components/seo-tools/readability-checker/GradeBadge";
import HighlightedText from "@/components/seo-tools/readability-checker/HighlightedText";
import Header from "@/components/Header";
import BreadCrumb from "@/components/BreadCrumb";
import ReadabilityTips from "@/components/seo-tools/readability-checker/ReadabilityTips";
import TopKeywords from "@/components/seo-tools/readability-checker/TopKeywords";
import WordStats from "@/components/seo-tools/readability-checker/WordStats";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

type ActiveTab = "overview" | "scores" | "sentences" | "words";

export default function ReadabilityCheckerTool() {
  const t = useT("seo-tools/ReadabilityCheckerTool.json");

  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [showHL, setShowHL] = useState(false);

  const m = useMemo(() => extractMetrics(text), [text]);
  const fre = useMemo(() => fleschReadingEase(m), [m]);
  const fkg = useMemo(() => fleschKincaidGrade(m), [m]);
  const fog = useMemo(() => gunningFog(m), [m]);
  const smi = useMemo(() => smogIndex(m), [m]);
  const cli = useMemo(() => colemanLiau(m), [m]);
  const ari = useMemo(() => automatedReadability(m), [m]);
  const lw = useMemo(() => linsearWrite(m), [m]);
  const dc = useMemo(() => daleChall(m), [m]);

  const freInfo = useMemo(() => fleschLabel(fre), [fre]);

  const avgGrade = useMemo(() => {
    const grades = [fkg, fog, cli, ari].filter(g => g > 0 && isFinite(g));
    return grades.length ? grades.reduce((s, g) => s + g, 0) / grades.length : 0;
  }, [fkg, fog, cli, ari]);

  const sentiment = useMemo(() => sentimentScore(m.words), [m]);
  const topKws = useMemo(() => topWords(m.words), [m]);
  const readTimeMin = m.wordCount / 200;

  const freColor =
    fre >= 70 ? "#22c55e" :
      fre >= 50 ? "#3b82f6" :
        fre >= 30 ? "#f59e0b" : "#ef4444";

  const SCORES = [
    { label: t("formula.fleschKincaid.label"), value: fkg, desc: t("formula.fleschKincaid.desc"), show: true },
    { label: t("formula.gunningFog.label"), value: fog, desc: t("formula.gunningFog.desc"), show: true },
    { label: t("formula.smog.label"), value: smi, desc: t("formula.smog.desc"), show: m.sentenceCount >= 30 },
    { label: t("formula.colemanLiau.label"), value: cli, desc: t("formula.colemanLiau.desc"), show: true },
    { label: t("formula.automated.label"), value: ari, desc: t("formula.automated.desc"), show: true },
    { label: t("formula.linsear.label"), value: lw, desc: t("formula.linsear.desc"), show: true },
    { label: t("formula.daleChall.label"), value: dc, desc: t("formula.daleChall.desc"), show: true },
  ];

  const hasText = text.trim().length > 0;

  // Improvement suggestions
  const suggestions: string[] = [];
  if (m.avgWordsPerSent > 25) suggestions.push(t("suggestions.avgLength", { count: m.avgWordsPerSent.toFixed(1) }));
  if (m.complexWordCount / Math.max(1, m.wordCount) > 0.15) suggestions.push(t("suggestions.complexWords", { pct: ((m.complexWordCount / m.wordCount) * 100).toFixed(0) }));
  if (m.longSentences.length > 0) suggestions.push(t("suggestions.longSentences", { count: m.longSentences.length, plural: m.longSentences.length !== 1 ? "s are" : " is" }));
  if (fre < 50 && hasText) suggestions.push(t("suggestions.lowReadability"));
  if (m.paragraphCount === 1 && m.wordCount > 100) suggestions.push(t("suggestions.noParagraphs"));
  if (m.avgSyllPerWord > 1.7) suggestions.push(t("suggestions.highSyllables"));

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        <BreadCrumb tKey="seo-tools/ReadabilityCheckerTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/ReadabilityCheckerTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Input ── */}
          <div className="flex flex-col gap-5">

            {/* Text input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.yourContent")}</p>
                <div className="flex gap-2">
                  {hasText && <span className="text-xs text-muted-foreground/60">{m.wordCount} {t("input.words")}</span>}
                  <button onClick={() => navigator.clipboard.readText().then(setText).catch(() => { })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                    <ClipboardPaste className="w-3.5 h-3.5" /> {t("input.paste")}
                  </button>
                  <button onClick={() => setText("")} disabled={!text}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={t("input.placeholder")}
                rows={10}
                className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/40 shadow-sm leading-relaxed"
              />
            </div>

            {/* Flesch gauge + level */}
            {hasText && (
              <>
                <div className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground self-start w-full">{t("flesch.title")}</p>
                  <ScoreGauge score={fre} min={0} max={100} label={freInfo.label} color={freColor} />
                  <div className="w-full grid grid-cols-2 gap-2 mt-1">
                    <div className="flex flex-col items-center py-2 rounded-xl bg-muted/20">
                      <GraduationCap className="w-4 h-4 text-muted-foreground mb-1" />
                      <span className="text-[10px] font-bold text-foreground">{freInfo.grade}</span>
                      <span className="text-[9px] text-muted-foreground">{t("flesch.readingLevel")}</span>
                    </div>
                    <div className="flex flex-col items-center py-2 rounded-xl bg-muted/20">
                      <Users className="w-4 h-4 text-muted-foreground mb-1" />
                      <span className="text-[10px] font-bold text-foreground text-center">{freInfo.audience}</span>
                      <span className="text-[9px] text-muted-foreground">{t("flesch.targetAudience")}</span>
                    </div>
                  </div>
                </div>

                {/* Avg grade level */}
                <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("gradeLevel.title")}</p>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-black tabular-nums text-blue-500">{Math.round(avgGrade)}</div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{gradeToDesc(avgGrade)}</p>
                      <p className="text-[10px] text-muted-foreground">{t("gradeLevel.averageAcross")}</p>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2">
                  <StatCard label={t("quickStats.words")} value={m.wordCount} />
                  <StatCard label={t("quickStats.sentences")} value={m.sentenceCount} />
                  <StatCard label={t("quickStats.readTime")} value={readTimeMin < 1 ? t("quickStats.lessThanMin") : t("quickStats.min", { min: Math.ceil(readTimeMin) })} />
                  <StatCard label={t("quickStats.avgSentence")} value={m.avgWordsPerSent.toFixed(1)} sub={t("quickStats.wordsUnit")} />
                  <StatCard label={t("quickStats.avgWord")} value={m.avgSyllPerWord.toFixed(2)} sub={t("quickStats.syllsUnit")} />
                  <StatCard label={t("quickStats.complex")} value={`${((m.complexWordCount / Math.max(1, m.wordCount)) * 100).toFixed(0)}%`} sub={t("quickStats.complexSub")} />
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="flex flex-col gap-2 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <Lightbulb className="w-3.5 h-3.5" /> {t("suggestions.title")}
                    </p>
                    {suggestions.map((s, i) => (
                      <p key={i} className="text-[10px] text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
                        <span className="shrink-0 mt-0.5">›</span> {s}
                      </p>
                    ))}
                  </div>
                )}

                {/* All good */}
                {suggestions.length === 0 && hasText && (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      {t("allGood.message")}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {!hasText && (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/30 gap-2 rounded-2xl border border-dashed border-border">
                <BookOpen className="w-10 h-10" />
                <p className="text-sm">{t("emptyState.analyze")}</p>
              </div>
            )}
          </div>

          {/* ── Right: Results ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {hasText && (
              <>
                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                  {([
                    { k: "overview" as ActiveTab, icon: Eye, label: t("tabs.overview") },
                    { k: "scores" as ActiveTab, icon: BarChart2, label: t("tabs.allScores") },
                    { k: "sentences" as ActiveTab, icon: FileText, label: t("tabs.sentences") },
                    { k: "words" as ActiveTab, icon: Layers, label: t("tabs.words") },
                  ]).map(({ k, icon: Icon, label }) => (
                    <button key={k} onClick={() => setActiveTab(k)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === k ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}>
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </button>
                  ))}
                </div>

                {/* ── Overview tab ── */}
                {activeTab === "overview" && (
                  <div className="flex flex-col gap-5">

                    {/* Grade levels grid */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("gradeEstimates.title")}</p>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {[
                          { label: "FK", value: fkg },
                          { label: "Fog", value: fog },
                          { label: "SMOG", value: smi, na: m.sentenceCount < 30 },
                          { label: "CL", value: cli },
                          { label: "ARI", value: ari },
                          { label: "LW", value: lw },
                          { label: "D-C", value: dc },
                        ].map(({ label, value, na }) => (
                          <div key={label} className="flex flex-col items-center">
                            {na
                              ? <div className="w-full py-3 rounded-xl border border-border bg-card text-center">
                                <span className="text-xs text-muted-foreground/40">N/A</span>
                              </div>
                              : <GradeBadge grade={value} label={label} />}
                          </div>
                        ))}
                      </div>
                      <p className="text-[9px] text-muted-foreground/60 mt-2">{t("gradeEstimates.legend")}</p>
                    </div>

                    {/* Stats row */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("fullStats.title")}</p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {[
                          { label: t("fullStats.words"), value: m.wordCount.toLocaleString() },
                          { label: t("fullStats.sentences"), value: m.sentenceCount.toLocaleString() },
                          { label: t("fullStats.paragraphs"), value: m.paragraphCount.toLocaleString() },
                          { label: t("fullStats.characters"), value: m.charCount.toLocaleString() },
                          { label: t("fullStats.charsNoSpace"), value: m.charNoSpaces.toLocaleString() },
                          { label: t("fullStats.syllables"), value: m.syllableCount.toLocaleString() },
                          { label: t("fullStats.uniqueWords"), value: m.uniqueWordCount.toLocaleString() },
                          { label: t("fullStats.complexWords"), value: m.complexWordCount.toLocaleString() },
                          { label: t("fullStats.longWords"), value: m.longWordCount.toLocaleString() },
                          { label: t("fullStats.longSentences"), value: m.longSentences.length.toLocaleString() },
                          { label: t("fullStats.avgWordsSent"), value: m.avgWordsPerSent.toFixed(1) },
                          { label: t("fullStats.avgSyllW"), value: m.avgSyllPerWord.toFixed(2) },
                        ].map(({ label, value }) => (
                          <StatCard key={label} label={label} value={value} />
                        ))}
                      </div>
                    </div>

                    {/* Sentiment */}
                    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> {t("toneIndicator.title")}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 rounded-full bg-border overflow-hidden relative">
                          <div className="absolute inset-0 flex">
                            <div className="flex-1 bg-red-100 dark:bg-red-900/30" />
                            <div className="flex-1 bg-muted/20" />
                            <div className="flex-1 bg-emerald-100 dark:bg-emerald-900/30" />
                          </div>
                          {/* Needle */}
                          <div className="absolute top-0 bottom-0 w-1 rounded-full bg-foreground shadow-sm transition-all duration-500"
                            style={{ left: `calc(${((sentiment + 1) / 2) * 100}% - 2px)` }} />
                        </div>
                      </div>
                      <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                        <span>{t("toneIndicator.negative")}</span><span>{t("toneIndicator.neutral")}</span><span>{t("toneIndicator.positive")}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {sentiment > 0.2 ? t("toneIndicator.positiveMsg")
                          : sentiment < -0.2 ? t("toneIndicator.negativeMsg")
                            : t("toneIndicator.neutralMsg")} · {t("toneIndicator.basedOn")}
                      </p>
                    </div>

                    {/* Top keywords */}
                    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("topKeywords.title")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {topKws.map(({ word, count }) => (
                          <span key={word} className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-muted/20 text-xs font-medium text-foreground">
                            {word}
                            <span className="text-[9px] text-muted-foreground/60 font-mono">×{count}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── All scores tab ── */}
                {activeTab === "scores" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10">
                      <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        {t("gradeLevel.scoreInfo")}
                      </p>
                    </div>

                    {/* Flesch RE special row */}
                    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-foreground">{t("flesch.title")}</p>
                          <p className="text-[10px] text-muted-foreground">{t("flesch.scoreDesc")}</p>
                        </div>
                        <span className="text-2xl font-black tabular-nums" style={{ color: freColor }}>{fre.toFixed(1)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, fre)}%`, background: freColor }} />
                      </div>
                      <p className="text-[10px] mt-1.5 font-bold" style={{ color: freColor }}>{freInfo.label} — {freInfo.grade} — {freInfo.audience}</p>
                    </div>

                    {/* Other scores */}
                    {SCORES.map(({ label, value, desc, show }) => {
                      if (!show || !isFinite(value) || value === 0) return null;
                      const g = Math.round(value);
                      const pct = Math.min(100, Math.max(0, (value / 20) * 100));
                      const bColor =
                        g <= 6 ? "#22c55e" :
                          g <= 10 ? "#3b82f6" :
                            g <= 14 ? "#f59e0b" : "#ef4444";
                      return (
                        <div key={label} className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                          <div className="flex items-center justify-between mb-1.5">
                            <div>
                              <p className="text-sm font-bold text-foreground">{label}</p>
                              <p className="text-[10px] text-muted-foreground">{desc}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="text-xl font-black tabular-nums" style={{ color: bColor }}>{value.toFixed(1)}</span>
                              <span className="text-[9px] text-muted-foreground">{t("formula.approxGrade", { grade: g })}</span>
                            </div>
                          </div>
                          <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: bColor }} />
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">{gradeToDesc(value)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── Sentences tab ── */}
                {activeTab === "sentences" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("sentenceAnalysis.title")}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {m.longSentences.length > 0
                            ? t("sentenceAnalysis.longSentenceHint", { count: m.longSentences.length, plural: m.longSentences.length !== 1 ? "s" : "" })
                            : t("sentenceAnalysis.allGood")}
                        </p>
                      </div>
                      <button onClick={() => setShowHL(p => !p)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${showHL ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-600" : "border-border bg-card text-muted-foreground hover:border-amber-300"
                          }`}>
                        <Eye className="w-3.5 h-3.5" /> {showHL ? t("sentenceAnalysis.highlightOn") : t("sentenceAnalysis.highlightLong")}
                      </button>
                    </div>

                    {/* Sentence length distribution */}
                    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("sentenceDistribution.title")}</p>
                      <div className="flex flex-col gap-1.5">
                        {m.sentences.slice(0, 20).map((s, i) => {
                          const wc = s.split(/\s+/).filter(Boolean).length;
                          const pct = Math.min(100, (wc / 40) * 100);
                          const col = wc <= 15 ? "bg-emerald-400" : wc <= 25 ? "bg-blue-400" : "bg-amber-400";
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-[9px] font-mono text-muted-foreground/50 w-4 text-right shrink-0">{i + 1}</span>
                              <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                                <div className={`h-full rounded-full ${col}`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[9px] font-mono text-muted-foreground w-7 text-right shrink-0">{wc}{t("input.words").substring(0, 1)}</span>
                            </div>
                          );
                        })}
                        {m.sentences.length > 20 && (
                          <p className="text-[10px] text-muted-foreground/50 mt-1">{t("sentenceDistribution.andMore", { count: m.sentences.length - 20 })}</p>
                        )}
                      </div>
                      <div className="flex gap-4 mt-3 text-[9px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />&le;15{t("input.words").substring(0, 1)} {t("sentenceDistribution.ideal")}</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />16–25{t("input.words").substring(0, 1)} {t("sentenceDistribution.ok")}</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />&gt;25{t("input.words").substring(0, 1)} {t("sentenceDistribution.long")}</span>
                      </div>
                    </div>

                    {/* Highlighted text */}
                    {showHL && (
                      <div className="p-5 rounded-2xl border border-border bg-card shadow-sm max-h-72 overflow-y-auto">
                        <HighlightedText text={text} longSentences={m.longSentences} />
                      </div>
                    )}

                    {/* Long sentences list */}
                    {m.longSentences.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("longSentences.title", { count: m.longSentences.length })}</p>
                        {m.longSentences.map((s, i) => {
                          const wc = s.split(/\s+/).filter(Boolean).length;
                          return (
                            <div key={i} className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10">
                              <p className="text-xs text-foreground leading-relaxed">{s}</p>
                              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">{t("longSentences.wordsConsider", { count: wc })}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Words tab ── */}
                {activeTab === "words" && (
                  <div className="flex flex-col gap-4">

                    {/* Word stats */}
                    <WordStats m={m} />

                    {/* Top keywords */}
                    <TopKeywords topKws={topKws} />

                    {/* Readability tips */}
                    <ReadabilityTips />
                  </div>
                )}
              </>
            )}

            {!hasText && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30 gap-3 rounded-2xl border border-dashed border-border">
                <BookOpen className="w-14 h-14" />
                <p className="text-base font-medium">{t("emptyState.analyze")}</p>
                <p className="text-xs">{t("emptyState.subtitle")}</p>
              </div>
            )}
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/ReadabilityCheckerTool.json" count={4} />
        <FAQ tKey="seo-tools/ReadabilityCheckerTool.json" />
        <Examples tKey="seo-tools/ReadabilityCheckerTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}