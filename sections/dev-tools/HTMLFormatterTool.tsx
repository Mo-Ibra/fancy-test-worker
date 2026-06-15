"use client";

import { useState, useMemo } from "react";
import {
  Code,
  Trash2,
  ClipboardPaste,
  Minimize2,
  AlertCircle,
  CheckCircle2,
  Eye,
  FileCode,
} from "lucide-react";
import { useT, useLang } from "@/context/TranslationProvider";
import { countStats, EXAMPLES, formatHTML, FormatOptions, IndentChar, IndentSize, minifyHTML, ViewMode } from "@/funcs/dev-tools/HTMLFormatterToolFuncs";
import Toggle from "@/components/dev-tools/html-formatter/Toggle";
import StatCard from "@/components/dev-tools/html-formatter/StatCard";
import CopyButton from "@/components/dev-tools/html-formatter/CopyButton";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function HTMLFormatterTool() {
  const t = useT("dev-tools/HTMLFormatterTool.json");
  const lang = useLang();

  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");
  const [opts, setOpts] = useState<FormatOptions>({
    indentChar: "spaces",
    indentSize: 2,
    attrSort: "none",
    sortAttrs: false,
    wrapAttrs: false,
    maxLineLen: 120,
    removeComments: false,
    collapseWhitespace: true,
  });

  const setOpt = <K extends keyof FormatOptions>(k: K, v: FormatOptions[K]) =>
    setOpts((o) => ({ ...o, [k]: v }));

  const { result: formatted, errors } = useMemo(
    () => (input.trim() ? formatHTML(input, opts) : { result: "", errors: [] }),
    [input, opts]
  );

  const minified = useMemo(
    () => (input.trim() ? minifyHTML(input, opts.removeComments) : ""),
    [input, opts.removeComments]
  );

  const outputText = viewMode === "minified" ? minified : formatted;

  const inputStats = useMemo(() => countStats(input), [input]);
  const outputStats = useMemo(() => countStats(outputText), [outputText]);

  const savingsKb = inputStats.sizeKb > 0
    ? Math.round((1 - outputStats.sizeKb / inputStats.sizeKb) * 100)
    : 0;

  const VIEW_MODES: { key: ViewMode; icon: React.ElementType; label: string }[] = [
    { key: "formatted", icon: Code, label: t("viewMode.formatted") },
    { key: "minified", icon: Minimize2, label: t("viewMode.minified") },
    { key: "preview", icon: Eye, label: t("viewMode.preview") },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/HTMLFormatterTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/HTMLFormatterTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Controls ── */}
          <div className="flex flex-col gap-5">

            {/* Indent */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("indent.title")}</p>
              <div className="flex gap-2 mb-2">
                {(["spaces", "tabs"] as IndentChar[]).map((c) => (
                  <button key={c} onClick={() => setOpt("indentChar", c)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${opts.indentChar === c ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}>{c}</button>
                ))}
              </div>
              {opts.indentChar === "spaces" && (
                <div className="flex gap-2">
                  {([2, 4] as IndentSize[]).map((n) => (
                    <button key={n} onClick={() => setOpt("indentSize", n)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${opts.indentSize === n ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                        }`}>{n} spaces</button>
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.title")}</p>
              {[
                { key: "sortAttrs" as keyof FormatOptions, label: t("options.sortAttrs"), desc: t("options.sortAttrsDesc") },
                { key: "removeComments" as keyof FormatOptions, label: t("options.removeComments"), desc: t("options.removeCommentsDesc") },
                { key: "collapseWhitespace" as keyof FormatOptions, label: t("options.collapseWhitespace"), desc: t("options.collapseWhitespaceDesc") },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{label}</p>
                    <p className="text-[10px] text-muted-foreground">{desc}</p>
                  </div>
                  <Toggle checked={opts[key] as boolean} onChange={(v) => setOpt(key, v as any)} />
                </div>
              ))}
            </div>

            {/* Validation */}
            {input.trim() && (
              <div className={`flex items-start gap-3 p-4 rounded-xl border ${errors.length === 0
                ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20"
                }`}>
                {errors.length === 0
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  : <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-xs font-bold ${errors.length === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {errors.length === 0 ? t("validation.noIssues") : t("validation.issues", { count: errors.length })}
                  </p>
                  {errors.map((e, i) => (
                    <p key={i} className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">{e}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            {input && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("stats.title")}</p>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard label={t("stats.tags")} value={inputStats.tags} />
                  <StatCard label={t("stats.attrs")} value={inputStats.attrs} />
                  <StatCard label={t("stats.comments")} value={inputStats.comments} />
                  <StatCard label={t("stats.input")} value={`${inputStats.sizeKb} KB`} />
                  <StatCard label={t("stats.output")} value={`${outputStats.sizeKb} KB`} accent />
                  <StatCard label={viewMode === "minified" ? t("stats.saved") : t("stats.lines")} value={viewMode === "minified" ? `${savingsKb}%` : outputStats.lines} accent />
                </div>
              </div>
            )}

            {/* Examples */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("examples.title")}</p>
              <div className="flex flex-col gap-1.5">
                {EXAMPLES.map(({ label, value }) => (
                  <button key={label} onClick={() => setInput(value)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground text-start transition-all">
                    <FileCode className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Input / Output ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.label")}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/60">{input.length.toLocaleString()} chars</span>
                  <button onClick={() => navigator.clipboard.readText().then(setInput).catch(() => { })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all">
                    <ClipboardPaste className="w-3.5 h-3.5" /> Paste
                  </button>
                  <button onClick={() => setInput("")} disabled={!input}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("input.placeholder")}
                className="h-52 px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm placeholder:text-muted-foreground/50"
              />
            </div>

            {/* View mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
              {VIEW_MODES.map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setViewMode(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${viewMode === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* Output: formatted or minified */}
            {viewMode !== "preview" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {viewMode === "formatted" ? t("output.formatted") : t("output.minified")}
                  </span>
                  <div className="flex items-center gap-2">
                    {outputText && <span className="text-xs text-muted-foreground/60">{outputText.length.toLocaleString()} chars</span>}
                    <CopyButton text={outputText} />
                  </div>
                </div>
                <div className="min-h-64 max-h-[480px] overflow-auto px-5 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm" dir="ltr">
                  {outputText ? (
                    <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all">
                      {outputText}
                    </pre>
                  ) : (
                    <p className="text-sm text-muted-foreground/50 italic font-sans">
                      {input ? t("output.emptyProcessing") : t("output.emptyOutput")}
                    </p>
                  )}
                </div>
                {outputText && <CopyButton text={outputText} label={viewMode === "formatted" ? t("output.copyFormatted") : t("output.copyMinified")} full />}
              </div>
            )}

            {/* Preview */}
            {viewMode === "preview" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("output.preview")}</span>
                  <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1.5">
                    <Eye className="w-3 h-3" /> {t("output.sandboxNote")}
                  </span>
                </div>
                <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
                  {/* Browser chrome mockup */}
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border">
                    <div className="flex gap-1.5">
                      {["bg-red-400", "bg-yellow-400", "bg-emerald-400"].map((c) => (
                        <div key={c} className={`w-3 h-3 rounded-full ${c}`} />
                      ))}
                    </div>
                    <div className="flex-1 mx-3 px-3 py-1 rounded-lg bg-background border border-border text-[10px] text-muted-foreground font-mono">
                      preview://html-formatter
                    </div>
                  </div>
                  {input ? (
                    <iframe
                      srcDoc={formatted || input}
                      className="w-full bg-white"
                      style={{ height: 400 }}
                      sandbox="allow-same-origin"
                      title="HTML Preview"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground/40 gap-2 bg-white dark:bg-background">
                      <Eye className="w-8 h-8" />
                      <span className="text-xs">{t("output.emptyPreview")}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/HTMLFormatterTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/HTMLFormatterTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/HTMLFormatterTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}