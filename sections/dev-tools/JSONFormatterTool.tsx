"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
  Braces,
  Trash2,
  ClipboardPaste,
  Minimize2,
  AlertCircle,
  CheckCircle2,
  FileJson,
  Search,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { countNodes, EXAMPLES, formatJSON, IndentSize, minifyJSON, parseJSON, ViewMode } from "@/funcs/dev-tools/JSONFormatterToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import StatCard from "@/components/dev-tools/json-formatter/StatCard";
import CopyButton from "@/components/dev-tools/json-formatter/CopyButton";
import TreeNode from "@/components/dev-tools/json-formatter/TreeNode";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function JSONFormatterTool() {
  const t = useTranslations("dev-tools.JSONFormatterTool");
  const locale = useLocale();
  const isAr = locale === "ar";
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<IndentSize>(2);
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");
  const [sortKeys, setSortKeys] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const parsed = useMemo(() => parseJSON(input), [input]);

  // Optionally sort keys
  const processedValue = useMemo(() => {
    if (!parsed.ok || !sortKeys) return parsed.value;
    return JSON.parse(JSON.stringify(parsed.value, (_, v) => {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        return Object.keys(v).sort().reduce((acc: Record<string, unknown>, k) => { acc[k] = v[k]; return acc; }, {});
      }
      return v;
    }));
  }, [parsed.value, parsed.ok, sortKeys]);

  const formatted = useMemo(() => {
    if (!parsed.ok || processedValue === undefined) return "";
    return formatJSON(processedValue, indent);
  }, [processedValue, parsed.ok, indent]);

  const minified = useMemo(() => {
    if (!parsed.ok || processedValue === undefined) return "";
    return minifyJSON(processedValue);
  }, [processedValue, parsed.ok]);

  const outputText = viewMode === "minified" ? minified : formatted;

  // Stats
  const nodeCount = parsed.ok && processedValue !== undefined ? countNodes(processedValue) : 0;
  const inputLines = input ? input.split("\n").length : 0;
  const outputLines = formatted ? formatted.split("\n").length : 0;
  const inputSizeKb = Math.round(new Blob([input]).size / 1024 * 10) / 10;
  const outputSizeKb = Math.round(new Blob([outputText]).size / 1024 * 10) / 10;

  // Search in formatted output
  const highlightSearch = useCallback((text: string): string => {
    if (!searchTerm || !text) return text;
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return text.replace(new RegExp(escaped, "gi"), (m) => `【${m}】`);
  }, [searchTerm]);

  const searchMatches = useMemo(() => {
    if (!searchTerm || !formatted) return 0;
    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return (formatted.match(new RegExp(escaped, "gi")) ?? []).length;
  }, [searchTerm, formatted]);

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/JSONFormatterTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/JSONFormatterTool.json" />

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Controls ── */}
          <div className="flex flex-col gap-5">

            {/* Validation status */}
            {input && (
              <div className={`flex items-start gap-3 p-4 rounded-xl border ${parsed.ok
                ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20"
                }`}>
                {parsed.ok
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  : <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                <div>
                  <p className={`text-xs font-bold ${parsed.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {parsed.ok ? t("validation.valid") : t("validation.invalid")}
                  </p>
                  {!parsed.ok && (
                    <p className="text-xs text-red-500 mt-0.5 leading-relaxed">
                      {parsed.error}
                      {parsed.errorLine && <span className="font-bold"> ({t("validation.line")} {parsed.errorLine})</span>}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Indent size */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.indent")}</p>
              <div className="grid grid-cols-3 gap-2">
                {([2, 4, 8] as IndentSize[]).map((n) => (
                  <button key={n} onClick={() => setIndent(n)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${indent === n
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                  >{n} {t("options.spaces", { defaultValue: "spaces" })}</button>
                ))}
              </div>
            </div>

            {/* View mode */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.viewMode")}</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { key: "formatted" as ViewMode, icon: Braces, label: t("options.formatted"), desc: t("options.formattedDesc") },
                  { key: "tree" as ViewMode, icon: FileJson, label: t("options.tree"), desc: t("options.treeDesc") },
                  { key: "minified" as ViewMode, icon: Minimize2, label: t("options.minified"), desc: t("options.minifiedDesc") },
                ].map(({ key, icon: Icon, label, desc }) => (
                  <button key={key} onClick={() => setViewMode(key)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all duration-200 ${viewMode === key
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                      : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40"
                      }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${viewMode === key ? "text-blue-500" : "text-muted-foreground"}`} />
                    <div>
                      <p className={`text-xs font-bold ${viewMode === key ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort keys toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div>
                <p className="text-sm font-semibold text-foreground">{t("options.sortKeys")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("options.sortKeysDesc")}</p>
              </div>
              <button onClick={() => setSortKeys((p) => !p)}
                className={`relative shrink-0 rounded-full transition-colors duration-200 ${sortKeys ? "bg-blue-500" : "bg-border"}`}
                style={{ width: 36, height: 20 }}>
                <span className={`absolute top-0.5 inset-s-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${sortKeys
                  ? (isAr ? "-translate-x-4" : "translate-x-4")
                  : "translate-x-0"
                  }`} />
              </button>
            </div>

            {/* Search */}
            {viewMode !== "tree" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("search.title")}</p>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t("search.placeholder")}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                    aria-label={t("search.title")}
                  />
                </div>
                {searchTerm && (
                  <p className={`text-xs mt-1.5 px-1 ${searchMatches > 0 ? "text-blue-500" : "text-muted-foreground/60"}`}>
                    {searchMatches > 0 ? t("search.matches", { count: searchMatches }) : t("search.noMatches")}
                  </p>
                )}
              </div>
            )}

            {/* Stats */}
            {parsed.ok && (
              <div className="grid grid-cols-2 gap-2">
                <StatCard label={t("stats.nodes")} value={nodeCount} accent />
                <StatCard label={t("stats.inputLines")} value={inputLines} />
                <StatCard label={t("stats.outputLines")} value={outputLines} />
                <StatCard label={t("stats.size")} value={`${inputSizeKb}→${outputSizeKb}KB`} />
              </div>
            )}

            {/* Examples */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("examples.title")}</p>
              <div className="flex flex-col gap-1.5">
                {EXAMPLES.map(({ label, value }) => (
                  <button key={label} onClick={() => setInput(value)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground text-start transition-all duration-200">
                    <FileJson className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
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
                  <span className="text-xs text-muted-foreground/60">{input.length.toLocaleString()} {t("actions.chars")}</span>
                  <button
                    onClick={() => navigator.clipboard.readText().then(setInput).catch(() => { })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all duration-200"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" /> Paste
                  </button>
                  <button
                    onClick={() => setInput("")}
                    disabled={!input}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-red-300 dark:hover:border-red-800 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("input.placeholder")}
                className={`h-52 px-5 py-4 rounded-2xl border text-sm leading-relaxed font-mono resize-none focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm bg-card text-foreground placeholder:text-muted-foreground/50 ${input && !parsed.ok
                  ? "border-red-300 dark:border-red-800 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30"
                  : input && parsed.ok
                    ? "border-emerald-300 dark:border-emerald-800 focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
                    : "border-border focus:border-blue-400 dark:focus:border-blue-600 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                  }`}
              />
            </div>

            {/* Output */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {viewMode === "formatted" ? t("output.formatted") : viewMode === "minified" ? t("output.minified") : t("output.treeView")}
                </span>
                {viewMode !== "tree" && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground/60">{outputText.length.toLocaleString()} {t("actions.chars")}</span>
                    <CopyButton text={outputText} />
                  </div>
                )}
              </div>

              {/* Formatted / Minified */}
              {viewMode !== "tree" && (
                <div className="relative" dir="ltr">
                  <div className="min-h-64 max-h-[500px] overflow-auto px-5 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm text-left">
                    {outputText ? (
                      <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all">
                        {searchTerm
                          ? outputText.split(new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")).map((part, i) =>
                            part.toLowerCase() === searchTerm.toLowerCase()
                              ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 text-foreground rounded-sm px-0.5">{part}</mark>
                              : part
                          )
                          : outputText
                        }
                      </pre>
                    ) : (
                      <p className="text-sm text-muted-foreground/50 italic font-sans">
                        {input ? (parsed.ok ? t("output.emptyProcessing") : t("output.emptyFixErrors")) : t("output.emptyOutput")}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tree view */}
              {viewMode === "tree" && (
                <div className="min-h-64 max-h-[500px] overflow-auto px-3 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm" dir="ltr">
                  {parsed.ok && processedValue !== undefined ? (
                    <TreeNode value={processedValue} defaultOpen />
                  ) : (
                    <p className="text-sm text-muted-foreground/50 italic px-2">
                      {input ? t("output.treeEmptyFix") : t("output.treeEmptyInput")}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Action strip */}
            {parsed.ok && viewMode !== "tree" && (
              <CopyButton text={outputText} label={viewMode === "minified" ? t("actions.copyMinified") : t("actions.copyFormatted")} full />
            )}
            {parsed.ok && viewMode === "tree" && (
              <div className="flex gap-3">
                <CopyButton text={formatted} label={t("actions.copyFormattedShort")} full />
                <CopyButton text={minified} label={t("actions.copyMinifiedShort")} full />
              </div>
            )}
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/JSONFormatterTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/JSONFormatterTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/JSONFormatterTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}