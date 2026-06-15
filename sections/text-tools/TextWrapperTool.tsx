"use client";

import { useState, useMemo } from "react";
import {
  WrapText,
  Trash2,
  Settings2,
  AlignLeft,
  AlignJustify,
  Minus,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/text-tools/RelatedTools";

import CopyButton from "@/components/text-tools/text-wrapper/CopyButton";
import Toggle from "@/components/text-tools/text-wrapper/Toggle";
import Ruler from "@/components/text-tools/text-wrapper/Ruler";

import { BreakOn, wrapText, type WrapOptions, widthPresets, EXAMPLE } from "@/funcs/text-tools/TextWrapperToolFuncs";
import DotGrid from "@/components/text-tools/DotGrid";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import Separator from "@/components/text-tools/text-wrapper/Separator";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";


// ── Main component ────────────────────────────────────────────────

export default function TextWrapperTool() {
  const t = useT("text-tools/TextWrapperTool.json");

  const [input, setInput] = useState("");
  const [opts, setOpts] = useState<WrapOptions>({
    lineWidth: 80,
    mode: "hard",
    breakOn: "words",
    addLineNumbers: false,
    prefix: "",
    suffix: "",
    trimLines: true,
    preserveBlankLines: true,
  });

  const set = <K extends keyof WrapOptions>(key: K, val: WrapOptions[K]) =>
    setOpts((o) => ({ ...o, [key]: val }));

  const output = useMemo(() => wrapText(input, opts), [input, opts]);

  const inputLines = input ? input.split("\n").length : 0;
  const outputLines = output ? output.split("\n").length : 0;
  const longestLine = output
    ? Math.max(...output.split("\n").map((l) => l.length))
    : 0;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* Dot grid */}
      <DotGrid />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="text-tools/TextWrapperTool.json" href="/text-tools" />

        {/* ── Header ── */}
        <Header tKey="text-tools/TextWrapperTool.json" />

        {/* ── Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Controls sidebar ── */}
          <div className="flex flex-col gap-5">

            {/* Line width */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5" /> {t("controls.lineWidth")}
                </p>
                <span className="text-sm font-bold text-blue-500 tabular-nums">{opts.lineWidth} {t("controls.chars")}</span>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                value={opts.lineWidth}
                onChange={(e) => set("lineWidth", Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer mb-3"
                aria-label={t("controls.lineWidth")}
              />
              <input
                type="number"
                min={1}
                max={1000}
                value={opts.lineWidth}
                onChange={(e) => set("lineWidth", Math.max(1, Math.min(1000, Number(e.target.value))))}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm text-center font-bold focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 mb-3"
                aria-label={t("controls.lineWidth")}
              />
              {/* Width presets */}
              <div className="grid grid-cols-3 gap-1.5">
                {widthPresets.map(({ label, value, desc }) => (
                  <button
                    key={value}
                    onClick={() => set("lineWidth", value)}
                    title={desc}
                    className={`py-2 rounded-lg border text-xs font-bold transition-all duration-200 ${opts.lineWidth === value
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Break mode */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("controls.breakOn")}</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { key: "words" as BreakOn, icon: AlignJustify, label: t("controls.words"), desc: t("controls.wordsDesc") },
                  { key: "chars" as BreakOn, icon: AlignLeft, label: t("controls.characters"), desc: t("controls.charactersDesc") },
                ]).map(({ key, icon: Icon, label, desc }) => (
                  <button
                    key={key}
                    onClick={() => set("breakOn", key)}
                    title={desc}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${opts.breakOn === key
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prefix / Suffix */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
                <Minus className="w-3.5 h-3.5" /> {t("controls.prefixSuffix")}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">{t("controls.prefix")}</label>
                  <input
                    value={opts.prefix}
                    onChange={(e) => set("prefix", e.target.value)}
                    placeholder="e.g. // "
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                    aria-label={t("controls.prefix")}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">{t("controls.suffix")}</label>
                  <input
                    value={opts.suffix}
                    onChange={(e) => set("suffix", e.target.value)}
                    placeholder="e.g. \\n"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                    aria-label={t("controls.suffix")}
                  />
                </div>
              </div>
              {/* Quick prefix presets */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["// ", "# ", "* ", "> "].map((p) => (
                  <button
                    key={p}
                    onClick={() => set("prefix", opts.prefix === p ? "" : p)}
                    className={`px-2.5 py-1 rounded-md border font-mono text-[11px] font-bold transition-all duration-200 ${opts.prefix === p
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                  >
                    {p.trim() || '""'}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-2">
              <Toggle
                checked={opts.addLineNumbers}
                onChange={() => set("addLineNumbers", !opts.addLineNumbers)}
                label={t("toggles.lineNumbers")}
                description={t("toggles.lineNumbersDesc")}
              />
              <Toggle
                checked={opts.trimLines}
                onChange={() => set("trimLines", !opts.trimLines)}
                label={t("toggles.trimLines")}
                description={t("toggles.trimLinesDesc")}
              />
              <Toggle
                checked={opts.preserveBlankLines}
                onChange={() => set("preserveBlankLines", !opts.preserveBlankLines)}
                label={t("toggles.preserveBlankLines")}
                description={t("toggles.preserveBlankLinesDesc")}
              />
            </div>

            {/* Load example */}
            <button
              onClick={() => setInput(EXAMPLE)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-blue-500 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
            >
              <WrapText className="w-4 h-4" /> {t("controls.loadExample")}
            </button>
          </div>

          {/* ── Input / Output ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Stats */}
            {output && (
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: t("stats.width"), value: `${opts.lineWidth}`, accent: true },
                  { label: t("stats.inputLines"), value: inputLines, accent: false },
                  { label: t("stats.outputLines"), value: outputLines, accent: false },
                  { label: t("stats.longestLine"), value: longestLine, accent: longestLine > opts.lineWidth },
                ].map(({ label, value, accent }) => (
                  <div key={label} className={`flex flex-col items-center py-3 rounded-xl border transition-colors ${accent
                    ? longestLine > opts.lineWidth
                      ? "border-amber-100 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20"
                      : "border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20"
                    : "border-border bg-card"
                    }`}>
                    <span className={`text-xl font-bold ${label === t("stats.longestLine") && longestLine > opts.lineWidth ? "text-amber-500" : accent ? "text-blue-500" : "text-foreground"
                      }`}>{value}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 text-center">{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.label")}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/60">{input.length} {t("input.chars")}</span>
                  <button
                    onClick={() => setInput("")}
                    disabled={!input}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-red-300 dark:hover:border-red-800 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {t("input.clear")}
                  </button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("input.placeholder")}
                className="h-48 px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Separator */}
            <Separator opts={opts} />

            {/* Output with ruler */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("output.label")}</span>
                <CopyButton text={output} />
              </div>

              {/* Column ruler */}
              <div className="px-5 overflow-hidden">
                <Ruler width={opts.lineWidth} />
              </div>

              <div className="relative min-h-[200px] max-h-[380px] overflow-y-auto px-5 py-4 rounded-2xl border border-border bg-muted/30 dark:bg-muted/10 shadow-sm">
                {output ? (
                  <pre className="text-sm text-foreground leading-relaxed whitespace-pre font-mono overflow-x-auto">
                    {output}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic font-sans">
                    {t("output.placeholder")}
                  </p>
                )}
              </div>
            </div>

            <CopyButton text={output} full />
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="text-tools/TextWrapperTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="text-tools/TextWrapperTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="text-tools/TextWrapperTool.json" />

        {/* ── Related tools ── */}
        <RelatedTools />

      </div>
    </section>
  );
}