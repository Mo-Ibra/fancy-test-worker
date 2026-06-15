"use client";

import { useState, useMemo } from "react";
import {
  Code2,
  Trash2,
  ClipboardPaste,
  Minimize2,
  AlertCircle,
  CheckCircle2,
  FileCode,
  SlidersHorizontal,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { BracketStyle, ColorFormat, countStats, detectIssues, EXAMPLES, formatCSS, FormatOptions, IndentChar, IndentSize, minifyCSS, PropSort, ViewMode } from "@/funcs/dev-tools/CSSFormatterToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import Toggle from "@/components/dev-tools/css-formatter/Toggle";
import StatCard from "@/components/dev-tools/css-formatter/StatCard";
import CopyButton from "@/components/dev-tools/css-formatter/CopyButton";
import HighlightCSS from "@/components/dev-tools/css-formatter/HighlightCSS";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function CSSFormatterTool() {
  const t = useTranslations("dev-tools.CSSFormatterTool");
  const locale = useLocale();
  const isAr = locale === "ar";

  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");
  const [highlight, setHighlight] = useState(true);

  const [opts, setOpts] = useState<FormatOptions>({
    indentChar: "spaces",
    indentSize: 2,
    bracketStyle: "same-line",
    propSort: "none",
    removeComments: false,
    addSemicolons: true,
    singleLineRules: false,
    colorFormat: "none",
    spaceAfterColon: true,
  });

  const setOpt = <K extends keyof FormatOptions>(k: K, v: FormatOptions[K]) =>
    setOpts((o) => ({ ...o, [k]: v }));

  const formatted = useMemo(
    () => (input.trim() ? formatCSS(input, opts) : ""),
    [input, opts]
  );

  const minified = useMemo(
    () => (input.trim() ? minifyCSS(input, opts.removeComments) : ""),
    [input, opts.removeComments]
  );

  const outputText = viewMode === "formatted" ? formatted : minified;
  const inputStats = useMemo(() => countStats(input), [input]);
  const outputStats = useMemo(() => countStats(outputText), [outputText]);
  const issues = useMemo(() => (input.trim() ? detectIssues(input) : []), [input]);

  const savingsPct = inputStats.sizeKb > 0 && viewMode === "minified"
    ? Math.round((1 - outputStats.sizeKb / inputStats.sizeKb) * 100)
    : 0;

  const errors = issues.filter((i) => i.type === "error");
  const warnings = issues.filter((i) => i.type === "warning");

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/CSSFormatterTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/CSSFormatterTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Controls ── */}
          <div className="flex flex-col gap-5">

            {/* Indentation */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.indentChar")}</p>
              <div className="flex gap-2 mb-2">
                {(["spaces", "tabs"] as IndentChar[]).map((c) => (
                  <button key={c} onClick={() => setOpt("indentChar", c)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${opts.indentChar === c ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                      }`}>{c === "spaces" ? t("options.indentSpaces") : t("options.indentTabs")}</button>
                ))}
              </div>
              {opts.indentChar === "spaces" && (
                <div className="flex gap-2">
                  {([2, 4] as IndentSize[]).map((n) => (
                    <button key={n} onClick={() => setOpt("indentSize", n)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${opts.indentSize === n ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                        }`}>{n} {t("options.indentSpaces")}</button>
                  ))}
                </div>
              )}
            </div>

            {/* Brace style */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.braceStyle")}</p>
              <div className="flex flex-col gap-1.5">
                {([
                  { key: "same-line" as BracketStyle, label: t("options.sameLine"), preview: t("options.sameLinePreview") },
                  { key: "new-line" as BracketStyle, label: t("options.newLine"), preview: t("options.newLinePreview") },
                ]).map(({ key, label, preview }) => (
                  <button key={key} onClick={() => setOpt("bracketStyle", key)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-start transition-all ${opts.bracketStyle === key ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm" : "border-border bg-card hover:border-blue-200"
                      }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${opts.bracketStyle === key ? "border-blue-500 bg-blue-500" : "border-muted-foreground"}`} />
                    <div>
                      <p className={`text-xs font-bold ${opts.bracketStyle === key ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
                      <code className="text-[10px] text-muted-foreground font-mono">{preview}</code>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Property sort */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.propSort")}</p>
              <div className="flex flex-col gap-1.5">
                {([
                  { key: "none" as PropSort, label: t("options.none"), desc: t("options.noneDesc") },
                  { key: "alpha" as PropSort, label: t("options.alpha"), desc: t("options.alphaDesc") },
                  { key: "grouped" as PropSort, label: t("options.grouped"), desc: t("options.groupedDesc") },
                ]).map(({ key, label, desc }) => (
                  <button key={key} onClick={() => setOpt("propSort", key)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-start transition-all ${opts.propSort === key ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm" : "border-border bg-card hover:border-blue-200"
                      }`}
                  >
                    <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${opts.propSort === key ? "border-blue-500 bg-blue-500" : "border-muted-foreground"}`} />
                    <div>
                      <p className={`text-xs font-bold ${opts.propSort === key ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color conversion */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.colorFormat")}</p>
              <div className="grid grid-cols-4 gap-1.5">
                {([
                  { key: "none" as ColorFormat, label: t("options.keep") },
                  { key: "hex" as ColorFormat, label: t("options.hex") },
                  { key: "rgb" as ColorFormat, label: t("options.rgb") },
                  { key: "hsl" as ColorFormat, label: t("options.hsl") },
                ]).map(({ key, label }) => (
                  <button key={key} onClick={() => setOpt("colorFormat", key)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${opts.colorFormat === key ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                      }`}>{label}</button>
                ))}
              </div>
            </div>

            {/* Toggle options */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" /> {t("options.title")}
              </p>
              {[
                { key: "removeComments" as keyof FormatOptions, label: t("options.removeComments"), desc: t("options.removeCommentsDesc") },
                { key: "singleLineRules" as keyof FormatOptions, label: t("options.singleLineRules"), desc: t("options.singleLineRulesDesc") },
                { key: "spaceAfterColon" as keyof FormatOptions, label: t("options.spaceAfterColon"), desc: t("options.spaceAfterColonDesc") },
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

            {/* Issues */}
            {input.trim() && (
              <div className={`flex items-start gap-3 p-4 rounded-xl border ${errors.length ? "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20" :
                warnings.length ? "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20" :
                  "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20"
                }`}>
                {errors.length
                  ? <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  : warnings.length
                    ? <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    : <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-xs font-bold ${errors.length ? "text-red-600 dark:text-red-400" : warnings.length ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                    {errors.length ? (errors.length === 1 ? t("issues.error", { count: errors.length }) : t("issues.errors", { count: errors.length })) :
                      warnings.length ? (warnings.length === 1 ? t("issues.warning", { count: warnings.length }) : t("issues.warnings", { count: warnings.length })) :
                        t("issues.noIssues")}
                  </p>
                  {issues.slice(0, 4).map((iss, i) => (
                    <p key={i} className={`text-[10px] mt-0.5 ${iss.type === "error" ? "text-red-500" : "text-amber-500"}`}>{iss.message}</p>
                  ))}
                  {issues.length > 4 && <p className="text-[10px] text-muted-foreground mt-0.5">{t("issues.more", { count: issues.length - 4 })}</p>}
                </div>
              </div>
            )}

            {/* Stats */}
            {input && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("stats.title")}</p>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard label={t("stats.rules")} value={inputStats.rules} />
                  <StatCard label={t("stats.declarations")} value={inputStats.decls} />
                  <StatCard label={t("stats.input")} value={`${inputStats.sizeKb} KB`} />
                  <StatCard label={t("stats.output")} value={`${outputStats.sizeKb} KB`} accent />
                  {viewMode === "minified" && <StatCard label={t("stats.saved")} value={`${savingsPct}%`} accent />}
                  <StatCard label={t("stats.lines")} value={outputStats.lines} />
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
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.title")}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/60">{input.length.toLocaleString()} chars</span>
                  <button onClick={() => navigator.clipboard.readText().then(setInput).catch(() => { })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all">
                    <ClipboardPaste className="w-3.5 h-3.5" /> {t("actions.paste")}
                  </button>
                  <button onClick={() => setInput("")} disabled={!input}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={"Paste your CSS here...\n\n.selector{color:red;background:#fff;margin:0 auto;}"}
                className="h-52 px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm placeholder:text-muted-foreground/50"
              />
            </div>

            {/* View mode toggle */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                {([
                  { key: "formatted" as ViewMode, icon: Code2, label: t("viewMode.formatted") },
                  { key: "minified" as ViewMode, icon: Minimize2, label: t("viewMode.minified") },
                ]).map(({ key, icon: Icon, label }) => (
                  <button key={key} onClick={() => setViewMode(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${viewMode === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t("syntaxHighlight")}</span>
                <Toggle checked={highlight} onChange={setHighlight} />
              </div>
            </div>

            {/* Output */}
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

              <div className="min-h-64 max-h-[520px] overflow-auto px-5 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm" dir="ltr">
                {outputText ? (
                  highlight && viewMode === "formatted"
                    ? <HighlightCSS code={outputText} />
                    : <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all">{outputText}</pre>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic font-sans">
                    {input ? t("processing") : t("output.empty")}
                  </p>
                )}
              </div>

              {outputText && (
                <CopyButton
                  text={outputText}
                  label={viewMode === "formatted" ? "Copy Formatted CSS" : "Copy Minified CSS"}
                  full
                />
              )}
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/CSSFormatterTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/CSSFormatterTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/CSSFormatterTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}