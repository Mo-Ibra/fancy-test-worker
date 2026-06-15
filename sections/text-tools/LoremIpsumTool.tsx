"use client";

import { useState, useCallback } from "react";
import {
  AlignLeft,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { useT, useLang } from "@/context/TranslationProvider";
import DotGrid from "@/components/text-tools/DotGrid";
import RelatedTools from "@/components/text-tools/RelatedTools";
import { generate, type GenType, presets, typeOptions } from "@/funcs/text-tools/LoremIpsumToolFuncs";

import CopyButton from "@/components/text-tools/lorem-ipsum/CopyButton";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function LoremIpsumTool() {
  const t = useT("text-tools/LoremIpsumTool.json");
  const lang = useLang();
  const isAr = lang === "ar";
  const [type, setType] = useState<GenType>("paragraphs");
  const [count, setCount] = useState(3);
  const [startLorem, setStartLorem] = useState(true);
  const [seed, setSeed] = useState(42);

  const output = generate(type, count, startLorem, seed);

  const regenerate = useCallback(() => setSeed((s) => s + 1), []);

  const applyPreset = (p: typeof presets[0]) => {
    setType(p.type);
    setCount(p.count);
    setSeed((s) => s + 1);
  };

  const maxCount = type === "paragraphs" ? 20 : type === "sentences" ? 50 : 500;

  const wordCount = output.trim().split(/\s+/).filter(Boolean).length;
  const charCount = output.length;
  const paraCount = output.split(/\n\n/).filter(Boolean).length;
  const sentCount = output.split(/[.!?]+/).filter((s) => s.trim()).length;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* Dot grid */}
      <DotGrid />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="text-tools/LoremIpsumTool.json" href="/text-tools" />

        {/* ── Header ── */}
        <Header tKey="text-tools/LoremIpsumTool.json" />

        {/* ── Two-col layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Controls sidebar ── */}
          <div className="flex flex-col gap-6">

            {/* Type selector */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("sidebar.generateBy")}</p>
              <div className="flex flex-col gap-2">
                {typeOptions.map(({ key }) => (
                  <button
                    key={key}
                    onClick={() => { setType(key); setCount(key === "words" ? 50 : key === "sentences" ? 5 : 3); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${type === key
                      ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/40"
                      : "border-border bg-card text-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                  >
                    <AlignLeft className="w-4 h-4 shrink-0" />
                    {t(`types.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Count slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {type === "paragraphs" ? t("slider.paragraphs") : type === "sentences" ? t("slider.sentences") : t("slider.words")}
                </p>
                <span className="text-sm font-bold text-blue-500 tabular-nums">{count}</span>
              </div>
              <input
                type="range"
                min={1}
                max={maxCount}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                aria-label={type === "paragraphs" ? t("slider.paragraphs") : type === "sentences" ? t("slider.sentences") : t("slider.words")}
              />
              <div className="flex justify-between text-xs text-muted-foreground/60 mt-1.5">
                <span>1</span>
                <span>{maxCount}</span>
              </div>
            </div>

            {/* Count input */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("sidebar.exactNumber")}</p>
              <input
                type="number"
                min={1}
                max={maxCount}
                value={count}
                onChange={(e) => setCount(Math.min(maxCount, Math.max(1, Number(e.target.value))))}
                aria-label={t("sidebar.exactNumber")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
              />
            </div>

            {/* Start with "Lorem ipsum" toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div>
                <p className="text-sm font-semibold text-foreground">{t("sidebar.startWith")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("sidebar.classicOpening")}</p>
              </div>
              <button
                onClick={() => setStartLorem((v) => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${startLorem ? "bg-blue-500" : "bg-border"}`}
              >
                <span className={`absolute top-0.5 inset-s-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${startLorem
                  ? (isAr ? "-translate-x-5" : "translate-x-5")
                  : "translate-x-0"
                  }`} />
              </button>
            </div>

            {/* Presets */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("sidebar.quickPresets")}</p>
              <div className="grid grid-cols-2 gap-2">
                {presets.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => applyPreset(p)}
                    className="px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all duration-200"
                  >
                    {t(`presets.${p.key}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Regenerate */}
            <button
              onClick={regenerate}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors duration-200 shadow-sm shadow-blue-200 dark:shadow-blue-900/40"
            >
              <RefreshCw className="w-4 h-4" />
              {t("sidebar.regenerate")}
            </button>
          </div>

          {/* ── Output panel ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Stats strip */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: t("stats.words"), value: wordCount },
                { label: t("stats.characters"), value: charCount },
                { label: t("stats.sentences"), value: sentCount },
                { label: t("stats.paragraphs"), value: paraCount },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                  <span className="text-xl font-bold text-blue-500">{value}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{label}</span>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5" />
                {t("output.label")}
              </span>
              <CopyButton text={output} />
            </div>

            {/* Output text */}
            <div className="min-h-[420px] max-h-[600px] overflow-y-auto px-6 py-5 rounded-2xl border border-border bg-card shadow-sm">
              {output.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-foreground leading-[1.85] mb-5 last:mb-0">
                  {para}
                </p>
              ))}
            </div>

            {/* Copy full button */}
            <CopyButton text={output} full />
          </div>

        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="text-tools/LoremIpsumTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="text-tools/LoremIpsumTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="text-tools/LoremIpsumTool.json" />

        {/* ── Related tools ── */}
        <RelatedTools />

      </div>
    </section>
  );
}