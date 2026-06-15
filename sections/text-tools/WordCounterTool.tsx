"use client";

import { useState, useMemo } from "react";
import {
  Hash,
  Type,
  AlignLeft,
  Clock,
  BarChart2,
  Copy,
  Trash2,
  CheckCheck,
  FileText,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import DotGrid from "@/components/text-tools/DotGrid";
import RelatedTools from "@/components/text-tools/RelatedTools";
import { analyze } from "@/funcs/text-tools/WordCounterToolFuncs";
import StatCard from "@/components/text-tools/word-counter/StatCard";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import Tips from "@/components/text-tools/word-counter/Tips";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function WordCounterTool() {
  const t = useT("text-tools/WordCounterTool.json");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => analyze(text), [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => setText("");

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* DotGrid */}
      <DotGrid />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="text-tools/WordCounterTool.json" href="/text-tools" />

        {/* ── Header ── */}
        <Header tKey="text-tools/WordCounterTool.json" />

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Textarea (2 cols) ── */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {t("input.label")}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t("copy.copied") : t("copy.button")}
                </button>
                <button
                  onClick={handleClear}
                  disabled={!text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-red-300 dark:hover:border-red-800 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t("input.clear")}
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("input.placeholder")}
                className="w-full h-[420px] px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm"
              />
              {/* Character count inside textarea */}
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground/50 font-medium select-none pointer-events-none">
                {stats.characters} {t("stats.chars")}
              </div>
            </div>

            {/* Quick inline stats strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 text-xs text-muted-foreground">
              {[
                { label: t("stats.words"), value: stats.words },
                { label: t("stats.characters"), value: stats.characters },
                { label: t("stats.sentences"), value: stats.sentences },
                { label: t("stats.readingTimeLabel"), value: `~${stats.readingTime} ${t("stats.min")}` },
              ].map(({ label, value }) => (
                <span key={label} className="flex items-center gap-1">
                  <span className="font-bold text-foreground">{value}</span>
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* ── Stats sidebar ── */}
          <div className="flex flex-col gap-4">

            {/* Main stats grid */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("sidebar.statistics")}</p>
              <div className="grid grid-cols-2 gap-2">
                <StatCard icon={Hash} label={t("stats.words")} value={stats.words} accent />
                <StatCard icon={Type} label={t("stats.characters")} value={stats.characters} />
                <StatCard icon={Type} label={t("stats.noSpaces")} value={stats.charactersNoSpaces} />
                <StatCard icon={AlignLeft} label={t("stats.sentences")} value={stats.sentences} />
                <StatCard icon={FileText} label={t("stats.paragraphs")} value={stats.paragraphs} />
                <StatCard icon={AlignLeft} label={t("stats.lines")} value={stats.lines} />
              </div>
            </div>

            {/* Reading / Speaking time */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("sidebar.timeEstimates")}</p>
              <div className="grid grid-cols-2 gap-2">
                <StatCard icon={Clock} label={t("sidebar.readingTime")} value={`~${stats.readingTime} ${t("stats.min")}`} />
                <StatCard icon={Clock} label={t("sidebar.speakingTime")} value={`~${stats.speakingTime} ${t("stats.min")}`} />
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-2 px-0.5">{t("sidebar.timeNote")}</p>
            </div>

            {/* Top keywords */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5" />
                {t("sidebar.topKeywords")}
              </p>
              {stats.topKeywords.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {stats.topKeywords.map(({ word, count }, i) => {
                    const max = stats.topKeywords[0].count;
                    const pct = Math.round((count / max) * 100);
                    return (
                      <div key={word} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-4 text-right shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-semibold text-foreground truncate">{word}</span>
                            <span className="text-xs text-muted-foreground ml-2 shrink-0">{count}×</span>
                          </div>
                          <div className="h-1 rounded-full bg-border overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-500 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/60 italic">
                  {t("sidebar.keywordsEmpty")}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="text-tools/WordCounterTool.json" count={5} />

        {/* ── FAQ ── */}
        <FAQ tKey="text-tools/WordCounterTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="text-tools/WordCounterTool.json" />

        {/* ── Tips ── */}
        <Tips stats={stats} />

        {/* Related Tools */}
        <RelatedTools />

      </div>
    </section>
  );
}