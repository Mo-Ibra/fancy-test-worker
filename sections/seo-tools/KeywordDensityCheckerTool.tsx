"use client";

import { useState, useMemo } from "react";
import {
  BarChart2,
  ClipboardPaste,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Info,
  FileText,
  Hash,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { analyzeText, extractPhrases, SortKey } from "@/funcs/seo-tools/KeywordDensityCheckerFuncs";
import DensityBadge from "@/components/seo-tools/keyword-density-checker/DensityBadge";
import BarRow from "@/components/seo-tools/keyword-density-checker/BarRow";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import TopKeywordsSummary from "@/components/seo-tools/keyword-density-checker/TopKeywordsSummary";
import SEOTips from "@/components/seo-tools/keyword-density-checker/SEOTips";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main ───────────────────────────────────────────────────────────

export default function KeywordDensityCheckerTool() {
  const t = useT("seo-tools/KeywordDensityCheckerTool.json");

  const [text, setText] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");
  const [minLength, setMinLength] = useState(3);
  const [includeStop, setIncludeStop] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("count");
  const [topN, setTopN] = useState(30);
  const [phraseN, setPhraseN] = useState(2);
  const [showPositions, setShowPositions] = useState(false);
  const [activeTab, setActiveTab] = useState<"keywords" | "phrases" | "stats">("keywords");
  const [highlightedWord, setHighlightedWord] = useState("");

  const { keywords, stats } = useMemo(
    () => analyzeText(text, minLength, includeStop),
    [text, minLength, includeStop]
  );

  const sorted = useMemo(() => {
    const kws = [...keywords];
    if (sortBy === "count") kws.sort((a, b) => b.count - a.count);
    if (sortBy === "density") kws.sort((a, b) => b.density - a.density);
    if (sortBy === "alpha") kws.sort((a, b) => a.word.localeCompare(b.word));
    return kws.slice(0, topN);
  }, [keywords, sortBy, topN]);

  const maxCount = useMemo(() => Math.max(...sorted.map(k => k.count), 1), [sorted]);

  const phrases = useMemo(() => extractPhrases(text, phraseN), [text, phraseN]);

  // Target keyword info
  const targetInfo = useMemo(() => {
    if (!targetKeyword.trim()) return null;
    const word = targetKeyword.toLowerCase().trim();
    return keywords.find(k => k.word === word) ?? null;
  }, [keywords, targetKeyword]);

  const pasteText = () => navigator.clipboard.readText().then(setText).catch(() => { });

  const exportCSV = () => {
    const rows = [["Word", "Count", "Density%", "Stop Word"]]
      .concat(sorted.map(k => [k.word, String(k.count), k.density.toFixed(2), k.isStopWord ? "Yes" : "No"]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "keyword-density.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Density legend bands
  const LEGEND = [
    { color: "bg-muted-foreground/30", label: t("densityScale.scale.stopWord") },
    { color: "bg-blue-400", label: t("densityScale.scale.veryLow") },
    { color: "bg-emerald-400", label: t("densityScale.scale.ideal") },
    { color: "bg-amber-400", label: t("densityScale.scale.caution") },
    { color: "bg-red-400", label: t("densityScale.scale.stuffing") },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/KeywordDensityCheckerTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/KeywordDensityCheckerTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Input + Options ── */}
          <div className="flex flex-col gap-5">

            {/* Target keyword */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-blue-400" /> {t("input.keyword")}
              </p>
              <input
                value={targetKeyword}
                onChange={e => setTargetKeyword(e.target.value)}
                placeholder={t("input.keywordPlaceholder")}
                className="px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/40"
                aria-label={t("input.keyword")}
              />

              {/* Target result */}
              {targetKeyword && (
                <div className={`flex flex-col gap-1.5 p-3 rounded-xl border ${!targetInfo ? "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10"
                  : targetInfo.density > 4 ? "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10"
                    : targetInfo.density > 2.5 ? "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10"
                      : targetInfo.density >= 0.5 ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10"
                        : "border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10"
                  }`}>
                  {!targetInfo ? (
                    <p className="text-xs text-red-500 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Not found in text
                    </p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono font-bold text-foreground">{targetInfo.word}</code>
                        <DensityBadge density={targetInfo.density} isStop={false} />
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Found <strong>{targetInfo.count}</strong> time{targetInfo.count !== 1 ? "s" : ""} out of{" "}
                        <strong>{stats.wordCount}</strong> words
                      </p>
                      {targetInfo.density > 4 && (
                        <p className="text-[10px] text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Over-optimized — may trigger spam filters
                        </p>
                      )}
                      {targetInfo.density < 0.5 && (
                        <p className="text-[10px] text-blue-500 flex items-center gap-1">
                          <Info className="w-3 h-3" /> Under-optimized — consider using it more
                        </p>
                      )}
                      {targetInfo.density >= 0.5 && targetInfo.density <= 2.5 && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ideal density range
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-3.5 h-3.5" /> {t("options.title")}
              </div>

              {/* Min word length */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-foreground font-medium">{t("options.minWordLength")}</p>
                  <span className="text-sm font-bold font-mono text-blue-500">{minLength}</span>
                </div>
                <input type="range" min={2} max={8} value={minLength} aria-label={t("options.minWordLength")}
                  onChange={e => setMinLength(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer" />
              </div>

              {/* Show top N */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-foreground font-medium">{t("options.showTop")}</p>
                  <span className="text-sm font-bold font-mono text-blue-500">{topN}</span>
                </div>
                <input type="range" min={10} max={100} step={10} value={topN} aria-label={t("options.showTop")}
                  onChange={e => setTopN(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer" />
              </div>

              {/* Include stop words */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-foreground">{t("options.includeStopWords")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("options.stopWordsHint")}</p>
                </div>
                <button onClick={() => setIncludeStop(p => !p)}
                  className={`relative shrink-0 rounded-full transition-colors ${includeStop ? "bg-blue-500" : "bg-border"}`}
                  style={{ width: 36, height: 20 }}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${includeStop ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>

            {/* Density legend */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("densityScale.title")}</p>
              <div className="flex flex-col gap-2">
                {LEGEND.map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-sm shrink-0 ${color}`} />
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-3">
                {t("densityScale.idealRange")}
              </p>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("sort.label")}</p>
              <div className="flex gap-2">
                {(["count", "density", "alpha"] as SortKey[]).map(s => (
                  <button key={s} onClick={() => setSortBy(s)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${sortBy === s ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-muted/20 text-muted-foreground hover:text-foreground"
                      }`}>
                    {t(`sort.${s}`)}
                  </button>
                ))}</div>
            </div>
          </div>

          {/* ── Right: Text input + Results ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Text input */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.content")}</p>
                  <div className="flex items-center gap-2">
                    {text && <span className="text-xs text-muted-foreground/60">{stats.wordCount} {t("results.words").toLowerCase()}</span>}
                    <button onClick={pasteText}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                      <ClipboardPaste className="w-3.5 h-3.5" /> {t("actions.paste")}
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
                placeholder={t("input.contentPlaceholder")}
                className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all placeholder:text-muted-foreground/30 min-h-[180px] resize-y shadow-sm leading-relaxed"
              />
            </div>

            {/* Results tabs */}
            {text && (
              <>
                {/* Quick stats strip */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: t("results.words"), value: stats.wordCount.toLocaleString() },
                    { label: t("results.chars"), value: stats.charCount.toLocaleString() },
                    { label: t("results.sentences"), value: stats.sentenceCount.toLocaleString() },
                    { label: t("results.readTime"), value: stats.readTimeMin < 1 ? t("results.minLessThan") : `${Math.ceil(stats.readTimeMin)} ${t("results.min")}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card shadow-sm">
                      <span className="text-sm font-bold font-mono tabular-nums text-foreground">{value}</span>
                      <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Tab bar */}
                <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                  {([
                    { k: "keywords" as const, icon: BarChart2, label: t("tabs.keywords") },
                    { k: "phrases" as const, icon: Layers, label: t("tabs.phrases") },
                    { k: "stats" as const, icon: FileText, label: t("tabs.fullStats") },
                  ]).map(({ k, icon: Icon, label }) => (
                    <button key={k} onClick={() => setActiveTab(k)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === k ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}>
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </button>
                  ))}
                </div>

                {/* ── Keywords tab ── */}
                {activeTab === "keywords" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {t("results.uniqueWords", { count: keywords.length })}
                        {!includeStop && t("results.stopWordsExcluded")}
                      </p>
                      <div className="flex gap-2">
                        <button onClick={exportCSV}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                          {t("actions.exportCsv")}
                        </button>
                        <button onClick={() => setShowPositions(p => !p)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${showPositions ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                            }`}>
                          {showPositions ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          {t("actions.positions")}
                        </button>
                      </div>
                    </div>

                    {/* Keyword rows */}
                    <div className="flex flex-col gap-0.5 max-h-96 overflow-y-auto pr-1">
                      {sorted.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/40 gap-2">
                          <BarChart2 className="w-8 h-8" />
                          <p className="text-sm">{t("results.noKeywords")}</p>
                        </div>
                      ) : sorted.map(kw => (
                        <div key={kw.word}>
                          <BarRow
                            word={kw.word} count={kw.count} density={kw.density}
                            maxCount={maxCount} isStop={kw.isStopWord}
                            positions={kw.positions}
                            targetWord={highlightedWord}
                            onClick={() => setHighlightedWord(kw.word === highlightedWord ? "" : kw.word)}
                          />
                          {/* Positions (if enabled) */}
                          {showPositions && highlightedWord === kw.word && kw.positions.length > 0 && (
                            <div className="mt-3 p-3 rounded-xl bg-muted/40 border border-border">
                              <p className="text-[10px] font-bold text-muted-foreground mb-2">
                                {t("results.positionsLabel")}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {kw.positions.slice(0, 30).map(p => (
                                  <span key={p} className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                    {p}
                                  </span>
                                ))}
                                {kw.positions.length > 30 && (
                                  <span className="text-[10px] text-muted-foreground">+{kw.positions.length - 30} more</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Phrases tab ── */}
                {activeTab === "phrases" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex-1">{t("options.phraseLength")}</p>
                      <div className="flex gap-1.5">
                        {[2, 3, 4].map(n => (
                          <button key={n} onClick={() => setPhraseN(n)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${phraseN === n ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                              }`}>{n}-word</button>
                        ))}
                      </div>
                    </div>

                    {phrases.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30 gap-3">
                        <Layers className="w-8 h-8" />
                        <p className="text-sm">{t("results.noPhrases", { phraseN })}</p>
                        <p className="text-xs">{t("results.tryMoreContent")}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-0.5 max-h-96 overflow-y-auto pr-1">
                        {phrases.map(({ phrase, count, density }) => {
                          const maxPh = phrases[0]?.count ?? 1;
                          const pct = (count / maxPh) * 100;
                          return (
                            <div key={phrase} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-transparent hover:border-border hover:bg-muted/20 transition-all">
                              <code className="text-xs font-mono font-bold text-foreground flex-1 truncate">{phrase}</code>
                              <div className="w-24 h-2 rounded-full bg-border overflow-hidden">
                                <div className="h-full rounded-full bg-blue-400" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[10px] font-mono tabular-nums text-muted-foreground w-6 text-right">{count}×</span>
                              <DensityBadge density={density} isStop={false} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Stats tab ── */}
                {activeTab === "stats" && (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: t("results.totalWords"), value: stats.wordCount.toLocaleString() },
                        { label: t("results.chars"), value: stats.charCount.toLocaleString() },
                        { label: t("results.charsNoSpaces"), value: stats.charNoSpaces.toLocaleString() },
                        { label: t("results.sentences"), value: stats.sentenceCount.toLocaleString() },
                        { label: t("results.paragraphs"), value: stats.paragraphCount.toLocaleString() },
                        { label: t("results.avgWordLength"), value: stats.avgWordLength.toFixed(1) + " " + t("results.chars").toLowerCase() },
                        { label: t("results.uniqueKeywords"), value: keywords.length.toLocaleString() },
                        { label: t("results.readTime"), value: stats.readTimeMin < 1 ? t("results.minLessThan") : `~${Math.ceil(stats.readTimeMin)} ${t("results.min")}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col gap-0.5 p-3.5 rounded-xl border border-border bg-card">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                          <span className="text-base font-bold font-mono text-foreground">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Top 5 keywords summary */}
                    <TopKeywordsSummary keywords={keywords} />

                    {/* SEO tips based on analysis */}
                    <SEOTips keywords={keywords} stats={stats} targetKeyword={targetKeyword} targetInfo={targetInfo} />
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {!text && (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/30 gap-3 rounded-2xl border border-dashed border-border">
                <BarChart2 className="w-12 h-12" />
                <p className="text-sm font-medium">{t("emptyState.title")}</p>
                <p className="text-xs">{t("emptyState.subtitle")}</p>
              </div>
            )}
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/KeywordDensityCheckerTool.json" count={4} />
        <FAQ tKey="seo-tools/KeywordDensityCheckerTool.json" />
        <Examples tKey="seo-tools/KeywordDensityCheckerTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}