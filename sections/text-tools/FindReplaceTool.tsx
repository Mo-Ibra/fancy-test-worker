"use client";

import { useState, useMemo, useRef } from "react";
import {
  Search,
  Replace,
  Trash2,
  ChevronUp,
  ChevronDown,
  Regex,
  CaseSensitive,
  WholeWord,
  ClipboardPaste,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { applyReplace, buildHighlightedHTML, findMatches, Options, EXAMPLE_TEXT } from "@/funcs/text-tools/FindReplaceToolFuncs";
import OptionToggle from "@/components/text-tools/find-replace/OptionToggle";
import CopyButton from "@/components/text-tools/find-replace/CopyButton";
import RelatedTools from "@/components/text-tools/RelatedTools";
import DotGrid from "@/components/text-tools/DotGrid";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main Component ────────────────────────────────────────────────

export default function FindReplaceTool() {
  const t = useT("text-tools/FindReplaceTool.json");
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [replacement, setReplacement] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [opts, setOpts] = useState<Options>({ caseSensitive: false, wholeWord: false, useRegex: false });
  const [regexError, setRegexError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Validate regex
  useMemo(() => {
    if (!opts.useRegex || !query) { setRegexError(""); return; }
    try { new RegExp(query); setRegexError(""); } catch (e: any) { setRegexError(e.message); }
  }, [query, opts.useRegex]);

  const matches = useMemo(() => findMatches(text, query, opts), [text, query, opts]);

  const safeActiveIdx = matches.length > 0 ? Math.min(activeIdx, matches.length - 1) : 0;

  const highlightedHTML = useMemo(
    () => buildHighlightedHTML(text, matches, safeActiveIdx),
    [text, matches, safeActiveIdx]
  );

  const toggle = (key: keyof Options) => setOpts((o) => ({ ...o, [key]: !o[key] }));

  const goPrev = () => setActiveIdx((i) => (i - 1 + matches.length) % matches.length);
  const goNext = () => setActiveIdx((i) => (i + 1) % matches.length);

  const handleReplace = () => {
    const updated = applyReplace(text, query, replacement, opts, false, safeActiveIdx);
    setText(updated);
    // keep activeIdx in bounds
    const newMatches = findMatches(updated, query, opts);
    setActiveIdx((i) => Math.min(i, Math.max(0, newMatches.length - 1)));
  };

  const handleReplaceAll = () => {
    setText(applyReplace(text, query, replacement, opts, true, 0));
    setActiveIdx(0);
  };

  const matchCount = matches.length;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* Dot grid */}
      <DotGrid />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="text-tools/FindReplaceTool.json" href="/text-tools" />

        {/* ── Header ── */}
        <Header tKey="text-tools/FindReplaceTool.json" />

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Controls ── */}
          <div className="flex flex-col gap-5">

            {/* Find input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                {t("controls.find")}
              </label>
              <div className="relative">
                <Search className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
                  placeholder={opts.useRegex ? t("placeholders.searchRegex") : t("placeholders.searchText")}
                  className={`w-full ps-10 pe-4 py-3 rounded-xl border bg-card text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${regexError
                    ? "border-red-400 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30"
                    : "border-border focus:border-blue-400 dark:focus:border-blue-600 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    }`}
                  aria-label={t("controls.find")}
                />
              </div>
              {regexError && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="font-bold">{t("regexError")}</span> {regexError}
                </p>
              )}
            </div>

            {/* Replace input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                {t("controls.replaceWith")}
              </label>
              <div className="relative">
                <Replace className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  value={replacement}
                  onChange={(e) => setReplacement(e.target.value)}
                  placeholder={t("placeholders.replacement")}
                  className="w-full ps-10 pe-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm"
                  aria-label={t("controls.replaceWith")}
                />
              </div>
            </div>

            {/* Options */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("controls.options")}</p>
              <div className="flex flex-wrap gap-2">
                <OptionToggle active={opts.caseSensitive} onClick={() => toggle("caseSensitive")} icon={CaseSensitive} label="Aa" title={t("controls.caseSensitive")} />
                <OptionToggle active={opts.wholeWord} onClick={() => toggle("wholeWord")} icon={WholeWord} label={t("controls.wholeWord")} title={t("controls.wholeWord")} />
                <OptionToggle active={opts.useRegex} onClick={() => toggle("useRegex")} icon={Regex} label=".*" title={t("controls.useRegex")} />
              </div>
            </div>

            {/* Match navigator */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("controls.matches")}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${matchCount > 0
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-muted text-muted-foreground"
                  }`}>
                  {matchCount > 0 ? `${safeActiveIdx + 1} / ${matchCount}` : t("controls.notFound")}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  disabled={matchCount === 0}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-blue-300 dark:hover:border-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronUp className="w-4 h-4" /> {t("controls.prev")}
                </button>
                <button
                  onClick={goNext}
                  disabled={matchCount === 0}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-blue-300 dark:hover:border-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronDown className="w-4 h-4" /> {t("controls.next")}
                </button>
              </div>
            </div>

            {/* Replace buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleReplace}
                disabled={matchCount === 0 || !query}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Replace className="w-4 h-4" />
                {t("controls.replaceThis")}
              </button>
              <button
                onClick={handleReplaceAll}
                disabled={matchCount === 0 || !query}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-blue-200 dark:shadow-blue-900/40"
              >
                <Replace className="w-4 h-4" />
                {t("controls.replaceAll")} ({matchCount})
              </button>
            </div>

            {/* Quick actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setText(EXAMPLE_TEXT)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-blue-500 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
              >
                <ClipboardPaste className="w-3.5 h-3.5" /> {t("controls.example")}
              </button>
              <button
                onClick={() => { setText(""); setQuery(""); setReplacement(""); setActiveIdx(0); }}
                disabled={!text && !query}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> {t("controls.clearAll")}
              </button>
            </div>
          </div>

          {/* ── Text panel (2 cols) ── */}
          <div className="lg:col-span-2 flex flex-col gap-3">

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("textarea.label")}
                {matchCount > 0 && (
                  <span className="ml-2 normal-case font-normal text-muted-foreground/70">
                    — <span className="text-yellow-500 font-semibold">{matchCount} {matchCount !== 1 ? t("textarea.matches") : t("textarea.match")}</span> {t("textarea.matchHighlighted")}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/60">{text.length} {t("textarea.chars")}</span>
                <CopyButton text={text} />
              </div>
            </div>

            {/* Highlight overlay + textarea stack */}
            <div className="relative">
              {/* Highlight layer */}
              <div
                aria-hidden
                className="absolute inset-0 px-5 py-4 text-sm leading-relaxed font-mono whitespace-pre-wrap wrap-break-word pointer-events-none rounded-2xl overflow-hidden text-transparent"
                style={{ fontFamily: "ui-monospace, monospace" }}
                dangerouslySetInnerHTML={{ __html: highlightedHTML }}
              />
              {/* Real textarea */}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("placeholders.searchText")}
                className="relative w-full h-[480px] px-5 py-4 rounded-2xl border border-border bg-transparent text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm caret-foreground"
                style={{ fontFamily: "ui-monospace, monospace", background: "transparent" }}
                spellCheck={false}
              />
              {/* Background fill for the card */}
              <div className="absolute inset-0 rounded-2xl border border-border bg-card -z-10 shadow-sm" />
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1 text-xs text-muted-foreground">
              {[
                { label: t("stats.characters"), value: text.length },
                { label: t("stats.words"), value: text.trim() ? text.trim().split(/\s+/).length : 0 },
                { label: t("stats.lines"), value: text ? text.split("\n").length : 0 },
              ].map(({ label, value }) => (
                <span key={label}>
                  <span className="font-bold text-foreground">{value}</span> {label}
                </span>
              ))}
              {matchCount > 0 && (
                <span className="text-yellow-500 font-semibold">
                  {matchCount} {matchCount !== 1 ? t("stats.matchesFound") : t("stats.matchFound")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="text-tools/FindReplaceTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="text-tools/FindReplaceTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="text-tools/FindReplaceTool.json" />

        {/* ── Related tools ── */}
        <RelatedTools />

      </div>
    </section>
  );
}