"use client";

import { useState, useMemo } from "react";
import {
  Trash2,
  Sparkles,
  Settings2,
  BarChart2,
} from "lucide-react";
import { useT, useLang } from "@/context/TranslationProvider";
import RelatedTools from "@/components/text-tools/RelatedTools";
import DotGrid from "@/components/text-tools/DotGrid";

import CopyButton from "@/components/text-tools/text-repeater/CopyButton";
import StatCard from "@/components/text-tools/text-repeater/StatCard";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import { buildOutput, countPresets, RepeatOptions, separatorOptions } from "@/funcs/text-tools/TextRepeaterToolFuncs";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main component ────────────────────────────────────────────────

export default function TextRepeaterTool() {

  const t = useT("text-tools/TextRepeaterTool.json");
  const lang = useLang();
  const isAr = lang === "ar";

  const [input, setInput] = useState("");
  const [opts, setOpts] = useState<RepeatOptions>({
    count: 3,
    separatorType: "newline",
    customSeparator: " | ",
    addNumbering: false,
    numberingStyle: "1.",
    trimInput: true,
  });

  const set = <K extends keyof RepeatOptions>(key: K, val: RepeatOptions[K]) =>
    setOpts((o) => ({ ...o, [key]: val }));

  const output = useMemo(() => buildOutput(input, opts), [input, opts]);

  // Stats
  const outputWords = output.trim() ? output.trim().split(/\s+/).length : 0;
  const outputLines = output ? output.split("\n").length : 0;
  const outputChars = output.length;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* Dot grid */}
      <DotGrid />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="text-tools/TextRepeaterTool.json" href="/text-tools" />

        {/* ── Header ── */}
        <Header tKey="text-tools/TextRepeaterTool.json" />

        {/* ── Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Controls ── */}
          <div className="flex flex-col gap-6">

            {/* Repeat count */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5" /> {t("controls.repeatCount")}
                </p>
                <span className="text-sm font-bold text-blue-500 tabular-nums">{opts.count}×</span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={1}
                max={500}
                value={opts.count}
                onChange={(e) => set("count", Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer mb-3"
                aria-label={t("controls.repeatCount")}
              />

              {/* Number input */}
              <input
                type="number"
                min={1}
                max={10000}
                value={opts.count}
                onChange={(e) => set("count", Math.max(1, Math.min(10000, Number(e.target.value))))}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm text-center font-bold focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                aria-label={t("controls.repeatCount")}
              />

              {/* Quick preset buttons */}
              <div className="flex flex-wrap gap-2 mt-3">
                {countPresets.map((n) => (
                  <button
                    key={n}
                    onClick={() => set("count", n)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${opts.count === n
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                  >
                    {n}×
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("controls.separator")}</p>
              <div className="flex flex-col gap-1.5">
                {separatorOptions.map(({ key, label, preview }) => (
                  <button
                    key={key}
                    onClick={() => set("separatorType", key)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 ${opts.separatorType === key
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-border bg-card text-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                  >
                    <span className="font-semibold">{t(`separators.${key}`)}</span>
                    <code className={`text-[11px] font-mono ${opts.separatorType === key ? "text-blue-100" : "text-muted-foreground"}`}>
                      {preview}
                    </code>
                  </button>
                ))}
              </div>

              {/* Custom separator input */}
              {opts.separatorType === "custom" && (
                <div className="mt-2">
                  <input
                    value={opts.customSeparator}
                    onChange={(e) => set("customSeparator", e.target.value)}
                    placeholder={t("controls.customSeparatorPlaceholder")}
                    className="w-full px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-card text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                    aria-label={t("controls.separator")}
                  />
                </div>
              )}
            </div>

            {/* Numbering */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("controls.numbering")}</p>
                <button
                  onClick={() => set("addNumbering", !opts.addNumbering)}
                  className={`relative shrink-0 rounded-full transition-colors duration-200 ${opts.addNumbering ? "bg-blue-500" : "bg-border"}`}
                  style={{ width: 36, height: 20 }}
                >
                  <span className={`absolute top-0.5 inset-s-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${opts.addNumbering
                      ? (isAr ? "-translate-x-4" : "translate-x-4")
                      : "translate-x-0"
                    }`} />
                </button>
              </div>
              {opts.addNumbering && (
                <div className="flex gap-2">
                  {(["1.", "1)", "[1]"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => set("numberingStyle", style)}
                      className={`flex-1 py-2 rounded-lg border font-mono text-xs font-bold transition-all duration-200 ${opts.numberingStyle === style
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                        }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Trim toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div>
                <p className="text-sm font-semibold text-foreground">{t("controls.trimInput")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("controls.trimInputDesc")}</p>
              </div>
              <button
                onClick={() => set("trimInput", !opts.trimInput)}
                className={`relative shrink-0 rounded-full transition-colors duration-200 ${opts.trimInput ? "bg-blue-500" : "bg-border"}`}
                style={{ width: 36, height: 20 }}
              >
                <span className={`absolute top-0.5 inset-s-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${opts.trimInput
                    ? (isAr ? "-translate-x-4" : "translate-x-4")
                    : "translate-x-0"
                  }`} />
              </button>
            </div>

          </div>

          {/* ── Input / Output ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Stats */}
            {output && (
              <div className="grid grid-cols-4 gap-3">
                <StatCard label={t("stats.repetitions")} value={`${opts.count}×`} accent />
                <StatCard label={t("stats.characters")} value={outputChars} />
                <StatCard label={t("stats.words")} value={outputWords} />
                <StatCard label={t("stats.lines")} value={outputLines} />
              </div>
            )}

            {/* Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.label")}</span>
                <button
                  onClick={() => setInput("")}
                  disabled={!input}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-red-300 dark:hover:border-red-800 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {t("input.clear")}
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("input.placeholder")}
                className="h-36 px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm"
              />
              <p className="text-xs text-muted-foreground/60 px-1">
                {input.length} {t("input.charCount")} · {t("input.repeatedTimes")} <span className="font-bold text-foreground">{opts.count}</span> {t("input.times")}
              </p>
            </div>

            {/* Separator indicator */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {opts.count}× · {t(`separators.${opts.separatorType}`)} {t("separator.label")}
                  {opts.addNumbering ? ` · ${t("separator.numbered")}` : ""}
                </span>
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Output */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <BarChart2 className="w-3.5 h-3.5" /> {t("output.label")}
                </span>
                <CopyButton text={output} />
              </div>
              <div className="relative min-h-[200px] max-h-[360px] overflow-y-auto px-5 py-4 rounded-2xl border border-border bg-muted/30 dark:bg-muted/10 shadow-sm">
                {output ? (
                  <pre className="text-sm text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word font-sans">
                    {output}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic">
                    {t("output.placeholder")}
                  </p>
                )}
              </div>
            </div>

            {/* Copy full */}
            <CopyButton text={output} full />
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="text-tools/TextRepeaterTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="text-tools/TextRepeaterTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="text-tools/TextRepeaterTool.json" />

        {/* ── Related tools ── */}
        <RelatedTools />

      </div>
    </section>
  );
}