"use client";

import { useState, useMemo, useCallback } from "react";
import {
  BarChart2,
  Search,
  Download,
  Hash,
  ArrowUpDown,
  X,
  FileText,
  AlignLeft,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import { analyzeWords, cloudColor, cloudSize, fmtDensity, getBarColor, getDensityColor, sortEntries, SortKey, tokenize, ViewMode } from "@/funcs/seo-tools/WordFrequencyCounterToolFuncs";
import CopyButton from "@/components/seo-tools/word-frequency-counter/CopyButton";
import TextInput from "@/components/seo-tools/word-frequency-counter/TextInput";
import Options from "@/components/seo-tools/word-frequency-counter/Options";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function WordFrequencyCounter() {
  const t = useT("seo-tools/WordFrequencyCounter.json");

  const [text, setText] = useState("");
  const [minLen, setMinLen] = useState(3);
  const [topN, setTopN] = useState(50);
  const [excludeStop, setExcludeStop] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [filterQuery, setFilterQuery] = useState("");
  const [customIgnore, setCustomIgnore] = useState("");
  const [highlighted, setHighlighted] = useState("");
  const [showIgnoreBox, setShowIgnoreBox] = useState(false);

  // Compute
  const ignoreList = useMemo(() =>
    customIgnore.split(/[\s,]+/).map(w => w.trim().toLowerCase()).filter(Boolean),
    [customIgnore]
  );

  const allEntries = useMemo(
    () => analyzeWords(text, minLen, excludeStop, ignoreList),
    [text, minLen, excludeStop, ignoreList]
  );

  const sorted = useMemo(
    () => sortEntries(allEntries, sortKey, sortAsc),
    [allEntries, sortKey, sortAsc]
  );

  const filtered = useMemo(() => {
    const q = filterQuery.toLowerCase().trim();
    const base = q ? sorted.filter(e => e.word.includes(q)) : sorted;
    return base.slice(0, topN);
  }, [sorted, filterQuery, topN]);

  const maxCount = filtered[0]?.count ?? 1;
  const totalWords = useMemo(() => tokenize(text, 1).length, [text]);
  const uniqueCount = allEntries.length;

  // Stats
  const stats = useMemo(() => ({
    totalWords,
    uniqueWords: uniqueCount,
    avgFreq: uniqueCount ? (totalWords / uniqueCount).toFixed(1) : "0",
    topWord: sorted[0]?.word ?? "—",
    topWordCount: sorted[0]?.count ?? 0,
    lexicalDensity: totalWords ? `${((uniqueCount / totalWords) * 100).toFixed(0)}%` : "0%",
  }), [totalWords, uniqueCount, sorted]);

  // Export CSV
  const exportCsv = useCallback(() => {
    const rows = [[t("csv.word"), t("csv.count"), t("csv.density"), t("csv.length"), t("csv.position")]]
      .concat(filtered.map(e => [e.word, String(e.count), e.density.toFixed(4), String(e.charLen), String(e.firstPos)]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "word-frequency.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  // Export TXT (word list)
  const exportTxt = useCallback(() => {
    const txt = filtered.map(e => `${e.word}\t${e.count}\t${e.density.toFixed(2)}%`).join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "word-frequency.txt"; a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => toggleSort(k)}
      className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${sortKey === k ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "border-border bg-card text-muted-foreground hover:border-blue-200"
        }`}>
      {label}
      <ArrowUpDown className={`w-2.5 h-2.5 ${sortKey === k ? "text-blue-500" : "text-muted-foreground/40"}`} />
    </button>
  );

  const hasText = text.trim().length > 0;

  // Highlighted text with word occurrences
  const highlightedHtml = useMemo(() => {
    if (!highlighted || !text) return null;
    const parts = text.split(new RegExp(`(\\b${highlighted}\\b)`, "gi"));
    return parts;
  }, [highlighted, text]);

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/WordFrequencyCounter.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/WordFrequencyCounter.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Input + Options ── */}
          <div className="flex flex-col gap-5">

            {/* Text input */}
            <TextInput text={text}
              setText={setText}
              setHighlighted={setHighlighted}
              totalWords={totalWords}
              hasText={hasText}
              t={t}
            />

            {/* Options */}
            <Options minLen={minLen}
              setMinLen={setMinLen}
              topN={topN}
              setTopN={setTopN}
              excludeStop={excludeStop}
              setExcludeStop={setExcludeStop}
              customIgnore={customIgnore}
              setCustomIgnore={setCustomIgnore}
              ignoreList={ignoreList}
              showIgnoreBox={showIgnoreBox}
              setShowIgnoreBox={setShowIgnoreBox}
            />

            {/* Stats */}
            {hasText && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: t("results.totalWords"), value: totalWords.toLocaleString() },
                  { label: t("results.uniqueWords"), value: uniqueCount.toLocaleString() },
                  { label: t("results.lexicalDensity"), value: stats.lexicalDensity },
                  { label: t("results.avgFrequency"), value: `${stats.avgFreq}×` },
                  { label: t("results.topWord"), value: stats.topWord },
                  { label: t("results.topCount"), value: `${stats.topWordCount}×` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                    <span className="text-sm font-bold font-mono tabular-nums text-foreground truncate max-w-full px-1">{value}</span>
                    <span className="text-[9px] text-muted-foreground mt-0.5 text-center">{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Highlighted word context */}
            {highlighted && highlightedHtml && (
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/20 border-b border-border">
                  <AlignLeft className="w-3.5 h-3.5 text-blue-500" />
                  <p className="text-xs font-bold text-foreground flex-1">
                    {t("common.inContext", { word: highlighted })}
                  </p>
                  <button onClick={() => setHighlighted("")}
                    className="w-6 h-6 flex items-center justify-center hover:text-red-500 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-4 max-h-40 overflow-y-auto text-sm leading-relaxed text-foreground">
                  {highlightedHtml.map((part, i) =>
                    part.toLowerCase() === highlighted.toLowerCase()
                      ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-500/30 text-foreground rounded px-0.5 font-bold">{part}</mark>
                      : <span key={i}>{part}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Results ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {hasText && filtered.length > 0 ? (
              <>
                {/* Toolbar */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* View mode */}
                  <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                    {([
                      { k: "table" as ViewMode, icon: FileText, label: t("viewModes.table") },
                      { k: "chart" as ViewMode, icon: BarChart2, label: t("viewModes.chart") },
                      { k: "cloud" as ViewMode, icon: Hash, label: t("viewModes.cloud") },
                    ]).map(({ k, icon: Icon, label }) => (
                      <button key={k} onClick={() => setViewMode(k)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === k ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}>
                        <Icon className="w-3.5 h-3.5" /> {label}
                      </button>
                    ))}
                  </div>

                  {/* Filter */}
                  <div className="relative flex-1 min-w-36">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
                    <input value={filterQuery} onChange={e => setFilterQuery(e.target.value)}
                      placeholder={t("filter.placeholder")}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("filter.placeholder")} />
                    {filterQuery && (
                      <button onClick={() => setFilterQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 hover:text-red-500 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Export */}
                  <div className="flex gap-1.5 ml-auto">
                    <button onClick={exportCsv}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                      <Download className="w-3.5 h-3.5" /> CSV
                    </button>
                    <button onClick={exportTxt}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                      <Download className="w-3.5 h-3.5" /> TXT
                    </button>
                    <CopyButton text={filtered.map(e => `${e.word}\t${e.count}`).join("\n")} label="Copy" />
                  </div>
                </div>

                {/* Sort row (table only) */}
                {viewMode === "table" && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("sort.label")}</span>
                    <SortBtn k="count" label={t("sort.frequency")} />
                    <SortBtn k="density" label={t("sort.density")} />
                    <SortBtn k="alpha" label={t("sort.alpha")} />
                    <SortBtn k="length" label={t("sort.length")} />
                    <span className="text-[10px] text-muted-foreground/60 ml-auto">
                      {t("table.wordCountSummary", { count: filtered.length, total: allEntries.length })}
                    </span>
                  </div>
                )}

                {/* ── TABLE VIEW ── */}
                {viewMode === "table" && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-0 px-4 py-2 bg-muted/30 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span className="col-span-1">#</span>
                      <span className="col-span-3">{t("table.word")}</span>
                      <span className="col-span-4">{t("table.bar")}</span>
                      <span className="col-span-2 text-right">{t("table.count")}</span>
                      <span className="col-span-2 text-right">{t("table.density")}</span>
                    </div>
                    <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
                      {filtered.map((e, i) => (
                        <div key={e.word}
                          onClick={() => setHighlighted(highlighted === e.word ? "" : e.word)}
                          className={`grid grid-cols-12 gap-0 items-center px-4 py-2 cursor-pointer transition-colors ${highlighted === e.word ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-muted/20"
                            }`}>
                          <span className="col-span-1 text-[10px] font-mono text-muted-foreground/40 tabular-nums">{i + 1}</span>
                          <span className="col-span-3 text-sm font-bold text-foreground truncate pr-2">{e.word}</span>
                          <div className="col-span-4 pr-4">
                            <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${getBarColor(e.density)}`}
                                style={{ width: `${(e.count / maxCount) * 100}%` }} />
                            </div>
                          </div>
                          <span className="col-span-2 text-xs font-mono font-bold tabular-nums text-right text-foreground">{e.count.toLocaleString()}</span>
                          <span className={`col-span-2 text-[10px] font-mono font-bold tabular-nums text-right ${getDensityColor(e.density)}`}>
                            {fmtDensity(e.density)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── CHART VIEW ── */}
                {viewMode === "chart" && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                      <BarChart2 className="w-4 h-4 text-blue-500" />
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground">{t("chart.topWords", { count: Math.min(filtered.length, 30) })}</p>
                    </div>
                    <div className="p-5 flex flex-col gap-1.5 max-h-[500px] overflow-y-auto">
                      {filtered.slice(0, 30).map((e, i) => (
                        <div key={e.word}
                          onClick={() => setHighlighted(highlighted === e.word ? "" : e.word)}
                          className={`flex items-center gap-3 cursor-pointer rounded-xl px-3 py-1.5 transition-colors ${highlighted === e.word ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-muted/20"
                            }`}>
                          <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums w-5 text-right shrink-0">{i + 1}</span>
                          <span className="text-xs font-bold text-foreground w-24 shrink-0 truncate">{e.word}</span>
                          <div className="flex-1 h-5 rounded-full bg-border overflow-hidden">
                            <div className={`h-full rounded-full flex items-center justify-end pr-2 transition-all ${getBarColor(e.density)}`}
                              style={{ width: `${Math.max(4, (e.count / maxCount) * 100)}%` }}>
                              {((e.count / maxCount) * 100) > 15 && (
                                <span className="text-[9px] font-bold text-white tabular-nums">{e.count}</span>
                              )}
                            </div>
                          </div>
                          {((e.count / maxCount) * 100) <= 15 && (
                            <span className="text-xs font-mono font-bold text-foreground w-8 text-right shrink-0">{e.count}</span>
                          )}
                          <span className={`text-[10px] font-mono font-bold w-12 text-right shrink-0 ${getDensityColor(e.density)}`}>
                            {fmtDensity(e.density)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── CLOUD VIEW ── */}
                {viewMode === "cloud" && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                      <Hash className="w-4 h-4 text-blue-500" />
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground">{t("cloud.title")}</p>
                      <p className="text-[10px] text-muted-foreground ml-auto">{t("cloud.hint")}</p>
                    </div>
                    <div className="p-6 flex flex-wrap gap-x-3 gap-y-2.5 items-center justify-center min-h-48">
                      {filtered.slice(0, 60).map(e => (
                        <button key={e.word}
                          onClick={() => setHighlighted(highlighted === e.word ? "" : e.word)}
                          title={`${e.word}: ${e.count}× (${fmtDensity(e.density)})`}
                          className={`font-bold cursor-pointer transition-all hover:opacity-80 rounded px-1 ${highlighted === e.word ? "bg-yellow-100 dark:bg-yellow-500/20 ring-2 ring-yellow-400" : ""
                            }`}
                          style={{
                            fontSize: `${cloudSize(e.count, maxCount)}px`,
                            color: highlighted === e.word ? "#d97706" : cloudColor(e.count, maxCount),
                            lineHeight: 1.2,
                          }}>
                          {e.word}
                        </button>
                      ))}
                    </div>
                    {/* Cloud legend */}
                    <div className="flex gap-4 px-6 py-3 border-t border-border bg-muted/10 flex-wrap text-[10px] text-muted-foreground">
                      <span>{t("cloud.legendSize")}</span>
                      <span className="text-blue-500">{t("cloud.legendHigh")}</span>
                      <span className="text-violet-500">{t("cloud.legendMedium")}</span>
                      <span className="text-cyan-500">{t("cloud.legendLow")}</span>
                      <span className="text-slate-400">{t("cloud.legendRare")}</span>
                    </div>
                  </div>
                )}

                {/* Density legend */}
                <div className="flex flex-wrap gap-4 px-4 py-3 rounded-xl border border-border bg-card text-[10px] text-muted-foreground">
                  {[
                    { color: "bg-blue-400", label: t("density.rare") },
                    { color: "bg-emerald-400", label: t("density.ideal") },
                    { color: "bg-amber-400", label: t("density.frequent") },
                    { color: "bg-red-400", label: t("density.overUsed") },
                    { color: "bg-muted-foreground/30", label: t("density.veryRare") },
                  ].map(({ color, label }) => (
                    <span key={label} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-sm ${color} shrink-0`} />
                      {label}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30 gap-3 rounded-2xl border border-dashed border-border">
                <BarChart2 className="w-14 h-14" />
                <p className="text-base font-medium">{t("emptyState.title")}</p>
                <p className="text-xs">{t("emptyState.subtitle")}</p>
              </div>
            )}
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/WordFrequencyCounter.json" count={4} />
        <FAQ tKey="seo-tools/WordFrequencyCounter.json" />
        <Examples tKey="seo-tools/WordFrequencyCounter.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}