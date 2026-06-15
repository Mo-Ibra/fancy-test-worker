"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
  Regex,
  Code2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Replace,
  List,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { buildRegex, CHEAT_SHEET, EXAMPLES, Flag, FLAGS_META, getMatches, SAMPLE_TEXTS, ViewTab } from "@/funcs/dev-tools/RegexTesterToolFuncs";
import CopyButton from "@/components/dev-tools/regex-tester/CopyButton";
import highlightText from "@/components/dev-tools/regex-tester/highlightText";
import CheatSection from "@/components/dev-tools/regex-tester/CheatSection";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function RegexTesterTool() {
  const t = useT("dev-tools/RegexTesterTool.json");

  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<Set<Flag>>(new Set(["g"]));
  const [testText, setTestText] = useState("");
  const [replaceWith, setReplaceWith] = useState("");
  const [activeTab, setActiveTab] = useState<ViewTab>("matches");
  const patternRef = useRef<HTMLInputElement>(null);

  const toggleFlag = (f: Flag) => setFlags((prev) => {
    const next = new Set(prev);
    next.has(f) ? next.delete(f) : next.add(f);
    return next;
  });

  const { re, error } = useMemo(() => buildRegex(pattern, flags), [pattern, flags]);

  const matches = useMemo(() => {
    if (error || !pattern || !testText) return [];
    return getMatches(re, testText);
  }, [re, error, pattern, testText]);

  const replaceResult = useMemo(() => {
    if (!pattern || !testText || error) return testText;
    try {
      const reG = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
      return testText.replace(reG, replaceWith);
    } catch { return testText; }
  }, [re, testText, replaceWith, error, pattern]);

  // Insert token into pattern at cursor
  const insertToken = useCallback((token: string) => {
    const el = patternRef.current;
    if (!el) { setPattern((p) => p + token); return; }
    const start = el.selectionStart ?? pattern.length;
    const end = el.selectionEnd ?? pattern.length;
    const next = pattern.slice(0, start) + token + pattern.slice(end);
    setPattern(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + token.length, start + token.length);
    });
  }, [pattern]);

  const loadExample = (ex: typeof EXAMPLES[number]) => {
    setPattern(ex.pattern);
    setFlags(new Set(ex.flags));
    setTestText(SAMPLE_TEXTS[ex.label] ?? "");
  };

  const flagsString = [...flags].sort().join("");
  const regexDisplay = pattern ? `/${pattern}/${flagsString}` : "—";

  const hasNamedGroups = matches.some((m) => Object.keys(m.groups).length > 0);
  const captureGroupCount = pattern ? (pattern.match(/(?<!\\)\((?!\?[^<]|\?:)/g) ?? []).length : 0;

  const TABS: { key: ViewTab; icon: React.ElementType; label: string }[] = [
    { key: "matches", icon: CheckCircle2, label: t("tabs.matches") },
    { key: "groups", icon: List, label: t("tabs.groups") },
    { key: "replace", icon: Replace, label: t("tabs.replace") },
    { key: "cheatsheet", icon: BookOpen, label: t("tabs.cheatsheet") },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/RegexTesterTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/RegexTesterTool.json" />

        {/* ── Pattern bar ── */}
        <div className="mb-6 p-5 rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4">

            {/* Pattern input */}
            <div className="flex items-center gap-0">
              <span className="shrink-0 px-4 py-3 rounded-l-xl border border-r-0 border-border bg-muted/40 text-muted-foreground text-base font-mono select-none">/</span>
              <input
                ref={patternRef}
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter your regex pattern..."
                className={`flex-1 px-4 py-3 border-y text-sm font-mono focus:outline-none transition-all duration-200 bg-card text-foreground placeholder:text-muted-foreground/50 ${error
                  ? "border-red-300 dark:border-red-700"
                  : pattern && !error
                    ? "border-emerald-300 dark:border-emerald-700"
                    : "border-border"
                  }`}
                aria-label={t("testString")}
              />
              <span className="shrink-0 px-3 py-3 border border-l-0 rounded-r-xl border-border bg-muted/40 text-muted-foreground text-base font-mono select-none">/</span>

              {/* Flags */}
              <div className="flex items-center gap-1.5 ml-3 shrink-0 flex-wrap">
                {FLAGS_META.map(({ flag, label, description }) => (
                  <button
                    key={flag}
                    onClick={() => toggleFlag(flag)}
                    title={description}
                    className={`w-8 h-9 rounded-lg border text-xs font-bold font-mono transition-all duration-200 ${flags.has(flag)
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                  >{label}</button>
                ))}
              </div>
            </div>

            {/* Error / status row */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {error ? (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs">{error}</span>
                  </div>
                ) : pattern ? (
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <code className="text-xs font-mono">{regexDisplay}</code>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground/50 italic">{t("startTyping")}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!error && matches.length > 0 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                    {matches.length} {t("match.count", { count: matches.length })}
                  </span>
                )}
                {pattern && !error && matches.length === 0 && testText && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">No matches</span>
                )}
                <CopyButton text={regexDisplay !== "—" ? regexDisplay : ""} label="Copy regex" />
                <button onClick={() => { setPattern(""); setTestText(""); setReplaceWith(""); }}
                  disabled={!pattern && !testText}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: test text + examples ── */}
          <div className="flex flex-col gap-5">

            {/* Test text */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("testString")}</span>
                <span className="text-xs text-muted-foreground/60">{testText.length.toLocaleString()} {t("chars")}</span>
              </div>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Paste or type the text you want to test against..."
                className="h-52 px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Live highlighted preview */}
            {testText && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Highlighted Preview
                  {matches.length > 0 && (
                    <span className="ml-2 text-[10px] font-normal text-muted-foreground/60 normal-case">
                      {t("yellowMatch")}
                    </span>
                  )}
                </span>
                <div className="max-h-48 overflow-auto px-5 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm">
                  <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all">
                    {highlightText(testText, matches)}
                  </pre>
                </div>
              </div>
            )}

            {/* Example patterns */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("examplePatterns")}</p>
              <div className="grid grid-cols-2 gap-2">
                {EXAMPLES.map((ex) => (
                  <button key={ex.label} onClick={() => loadExample(ex)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground text-left transition-all duration-200">
                    <Code2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: tabs ── */}
          <div className="flex flex-col gap-4">

            {/* Tab bar */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
              {TABS.map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${activeTab === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1">

              {/* Matches tab */}
              {activeTab === "matches" && (
                <div className="flex flex-col gap-3">
                  {/* Stats strip */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: t("tabs.matches"), value: matches.length },
                      { label: t("tabs.groups"), value: captureGroupCount },
                      { label: t("flagsLabel"), value: flagsString || t("noMatches") },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                        <span className="text-base font-bold text-foreground">{value}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>

                  {matches.length > 0 ? (
                    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                      {matches.map((m, i) => (
                        <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/50 transition-all group">
                          <span className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold mt-0.5">{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <code className="text-xs font-mono font-bold text-foreground break-all">{m.value || <span className="text-muted-foreground/50 italic">{t("emptyMatch")}</span>}</code>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {t("position", { start: m.start, end: m.end })} · {t("length", { len: m.value.length })}
                            </p>
                          </div>
                          <CopyButton text={m.value} label="" className="opacity-0 group-hover:opacity-100 px-2!" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40 gap-2">
                      <Regex className="w-8 h-8" />
                      <span className="text-xs">{!pattern ? t("enterPattern") : !testText ? t("enterTestText") : t("noMatchesFound")}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Groups tab */}
              {activeTab === "groups" && (
                <div className="flex flex-col gap-3">
                  {matches.length > 0 && captureGroupCount > 0 ? (
                    <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
                      {matches.map((m, mi) => (
                        <div key={mi} className="rounded-xl border border-border bg-card overflow-hidden">
                          <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 dark:bg-muted/10 border-b border-border">
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold">
                              {mi + 1}
                            </span>
                            <code className="text-xs font-mono text-foreground font-bold">{m.value || "(empty)"}</code>
                            <span className="text-[10px] text-muted-foreground ml-auto">at {m.start}–{m.end}</span>
                          </div>
                          {/* Numbered capture groups from indices */}
                          {m.indices.length > 1 && (
                            <div className="px-4 py-2 flex flex-col gap-1.5">
                              {m.indices.slice(1).map((range, gi) => {
                                const groupVal = range ? testText.slice(range[0], range[1]) : undefined;
                                return (
                                  <div key={gi} className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-muted-foreground w-14">Group {gi + 1}</span>
                                    <code className="text-xs font-mono text-blue-500 dark:text-blue-400">
                                      {groupVal ?? <span className="text-muted-foreground/50 italic">undefined</span>}
                                    </code>
                                    {range && <span className="text-[10px] text-muted-foreground/50 ml-auto">{range[0]}–{range[1]}</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {/* Named groups */}
                          {hasNamedGroups && Object.keys(m.groups).length > 0 && (
                            <div className="px-4 pb-3 flex flex-col gap-1.5 border-t border-border mt-1 pt-2">
                              {Object.entries(m.groups).map(([name, val]) => (
                                <div key={name} className="flex items-center gap-3">
                                  <span className="text-[10px] font-bold text-purple-500 dark:text-purple-400 w-14 truncate">?&lt;{name}&gt;</span>
                                  <code className="text-xs font-mono text-foreground">{val ?? <span className="text-muted-foreground/50 italic">undefined</span>}</code>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40 gap-2">
                      <List className="w-8 h-8" />
<span className="text-xs text-center">
                          {!pattern ? t("enterPattern") :
                            captureGroupCount === 0 ? t("captureGroups") :
                              matches.length === 0 ? t("noMatchesFound") :
                                t("enableFlag")}
                        </span>
                    </div>
                  )}
                </div>
              )}

              {/* Replace tab */}
              {activeTab === "replace" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("replaceWith")}</span>
                    <input
                      value={replaceWith}
                      onChange={(e) => setReplaceWith(e.target.value)}
                      placeholder="Replacement string... use $1, $2 for groups, $& for full match"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 placeholder:text-muted-foreground/50"
                      aria-label={t("replaceWith")}
                    />
                    <div className="flex gap-2 flex-wrap">
                      {[["$&", t("fullMatch")], ["$1", t("groupN", { n: 1 })], ["$2", t("groupN", { n: 2 })], ["$`", t("before")], ["$'", t("after")]].map(([token, desc]) => (
                        <button key={token} onClick={() => setReplaceWith((p) => p + token)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all"
                          title={desc}>
                          <code className="text-xs font-mono text-blue-500">{token}</code>
                          <span className="text-[10px] text-muted-foreground">{desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Result</span>
                      <CopyButton text={replaceResult} label="Copy result" />
                    </div>
                    <div className="max-h-72 overflow-auto px-5 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm">
                      <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all">
                        {replaceResult || <span className="text-muted-foreground/50 italic">{t("resultPlaceholder")}</span>}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Cheat sheet tab */}
              {activeTab === "cheatsheet" && (
                <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                  <p className="text-xs text-muted-foreground/70">Click any token to insert it into the pattern.</p>
                  {CHEAT_SHEET.map(({ section, items }) => (
                    <CheatSection key={section} section={section} items={items} onInsert={insertToken} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/RegexTesterTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/RegexTesterTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/RegexTesterTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}