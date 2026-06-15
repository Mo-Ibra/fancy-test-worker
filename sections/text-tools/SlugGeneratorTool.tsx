"use client";

import { useState, useMemo } from "react";
import {
  Settings2,
  Link2,
  Sparkles,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/text-tools/RelatedTools";
import { generateSlug, SlugOptions } from "@/funcs/text-tools/SlugGeneratorToolFuncs";

import CopyButton from "@/components/text-tools/slug-generator/CopyButton";
import Toggle from "@/components/text-tools/slug-generator/Toggle";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import DotGrid from "@/components/text-tools/DotGrid";
import BulkGenerator from "@/components/text-tools/slug-generator/BulkGenerator";
import URLPreview from "@/components/text-tools/slug-generator/URLPreview";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main component ────────────────────────────────────────────────

export default function SlugGeneratorTool() {
  const t = useT("text-tools/SlugGeneratorTool.json");
  const [input, setInput] = useState("");
  const [opts, setOpts] = useState<SlugOptions>({
    separator: "-",
    lowercase: true,
    transliterate: true,
    removeStopWords: false,
    maxLength: null,
    trim: true,
  });

  const slug = useMemo(() => generateSlug(input, opts), [input, opts]);

  const set = <K extends keyof SlugOptions>(key: K, val: SlugOptions[K]) =>
    setOpts((o) => ({ ...o, [key]: val }));

  const toggle = (key: keyof SlugOptions) =>
    setOpts((o) => ({ ...o, [key]: !o[key] }));

  const slugLength = slug.length;
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const slugWords = slug ? slug.split(opts.separator).length : 0;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* Dot grid */}
      <DotGrid />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="text-tools/SlugGeneratorTool.json" href="/text-tools" />

        {/* ── Header ── */}
        <Header tKey="text-tools/SlugGeneratorTool.json" />

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Options sidebar ── */}
          <div className="flex flex-col gap-5">

            {/* Separator */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" /> {t("controls.separator")}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(["-", "_", "."] as const).map((sep) => (
                  <button
                    key={sep}
                    onClick={() => set("separator", sep)}
                    className={`py-2.5 rounded-xl border text-sm font-bold font-mono transition-all duration-200 ${opts.separator === sep
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-border bg-card text-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                  >
                    word{sep}word
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("controls.options")}</p>
              <div className="flex flex-col gap-2">
                <Toggle
                  checked={opts.lowercase}
                  onChange={() => toggle("lowercase")}
                  label={t("toggles.lowercase")}
                  description={t("toggles.lowercaseDesc")}
                />
                <Toggle
                  checked={opts.transliterate}
                  onChange={() => toggle("transliterate")}
                  label={t("toggles.transliterate")}
                  description={t("toggles.transliterateDesc")}
                />
                <Toggle
                  checked={opts.removeStopWords}
                  onChange={() => toggle("removeStopWords")}
                  label={t("toggles.removeStopWords")}
                  description={t("toggles.removeStopWordsDesc")}
                />
                <Toggle
                  checked={opts.trim}
                  onChange={() => toggle("trim")}
                  label={t("toggles.trimSeparators")}
                  description={t("toggles.trimSeparatorsDesc")}
                />
              </div>
            </div>

            {/* Max length */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("controls.maxLength")}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-500">{opts.maxLength ?? "∞"}</span>
                  {opts.maxLength && (
                    <button onClick={() => set("maxLength", null)} className="text-[10px] text-muted-foreground hover:text-red-500 transition-colors">{t("controls.remove")}</button>
                  )}
                </div>
              </div>
              <input
                type="range"
                min={10}
                max={200}
                value={opts.maxLength ?? 200}
                onChange={(e) => set("maxLength", Number(e.target.value) === 200 ? null : Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                aria-label={t("controls.maxLength")}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
                <span>10</span><span>{t("controls.noLimit")}</span>
              </div>
            </div>

          </div>

          {/* ── Input & Output ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.label")}</span>
                <span className="text-xs text-muted-foreground/60">{wordCount} {t("input.words")}</span>
              </div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("input.placeholder")}
                className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-base focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm"
                aria-label={t("input.label")}
              />
            </div>

            {/* Output slug */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" /> {t("output.label")}
                </span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${opts.maxLength && slugLength >= opts.maxLength
                    ? "text-amber-500"
                    : "text-muted-foreground/60"
                    }`}>
                    {slugLength} {t("output.chars")}
                  </span>
                  <CopyButton text={slug} />
                </div>
              </div>

              {/* Slug display */}
              <div className={`group relative flex items-center gap-3 px-5 py-5 rounded-2xl border-2 transition-all duration-200 ${slug
                ? "border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-900/20"
                : "border-dashed border-border bg-card"
                }`}>
                <Link2 className={`w-5 h-5 shrink-0 ${slug ? "text-blue-400" : "text-muted-foreground/40"}`} />
                <span className={`text-base font-mono font-semibold break-all select-all ${slug ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground/40 italic"
                  }`}>
                  {slug || t("output.placeholder")}
                </span>
              </div>

              {/* Slug stats */}
              {slug && (
                <div className="flex flex-wrap items-center gap-4 px-1 text-xs text-muted-foreground">
                  <span><span className="font-bold text-foreground">{slugLength}</span> {t("slugStats.characters")}</span>
                  <span><span className="font-bold text-foreground">{slugWords}</span> {t("slugStats.words")}</span>
                  <span className={`font-semibold ${slugLength > 75 ? "text-amber-500" : "text-emerald-500"}`}>
                    {slugLength > 75 ? t("slugStats.tooLong") : t("slugStats.goodLength")}
                  </span>
                </div>
              )}
            </div>

            {/* URL preview */}
            <URLPreview slug={slug} />

            {/* Bulk generator */}
            <BulkGenerator setInput={setInput} opts={opts} />

            {/* Copy full */}
            <CopyButton text={slug} full />
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="text-tools/SlugGeneratorTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="text-tools/SlugGeneratorTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="text-tools/SlugGeneratorTool.json" />

        {/* ── Related tools ── */}
        <RelatedTools />

      </div>
    </section>
  );
}