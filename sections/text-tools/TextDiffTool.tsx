"use client";

import { useState, useMemo } from "react";
import {
  Trash2,
  LayoutPanelLeft,
  AlignLeft,
  Circle,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";

import CopyButton from "@/components/text-tools/text-diff/CopyButton";
import InlineDiff from "@/components/text-tools/text-diff/InlineDiff";

import { DiffMode, diffTexts, getStats, ViewMode, EXAMPLE_A, EXAMPLE_B } from "@/funcs/text-tools/TextDiffToolFuncs";
import SplitDiff from "@/components/text-tools/text-diff/SplitDiff";
import RelatedTools from "@/components/text-tools/RelatedTools";
import DotGrid from "@/components/text-tools/DotGrid";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import EmptyState from "@/components/text-tools/text-diff/EmptyState";
import DiffResult from "@/components/text-tools/text-diff/DiffResult";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function TextDiffTool() {
  const t = useT("text-tools/TextDiffTool.json");
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [diffMode, setDiffMode] = useState<DiffMode>("words");

  const parts = useMemo(
    () => (textA || textB) ? diffTexts(textA, textB, diffMode) : [],
    [textA, textB, diffMode]
  );

  const stats = useMemo(() => getStats(parts), [parts]);

  const loadExample = () => { setTextA(EXAMPLE_A); setTextB(EXAMPLE_B); };
  const clearAll = () => { setTextA(""); setTextB(""); };

  const hasDiff = textA.length > 0 || textB.length > 0;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* Dot grid */}
      <DotGrid />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="text-tools/TextDiffTool.json" href="/text-tools" />

        {/* ── Header ── */}
        <Header tKey="text-tools/TextDiffTool.json" />

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {/* Diff mode */}
            <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-card">
              {(["words", "chars", "lines"] as DiffMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setDiffMode(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${diffMode === m
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* View mode */}
            <div className="flex items-center gap-1 p-1 rounded-xl border border-border bg-card">
              <button
                onClick={() => setViewMode("split")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${viewMode === "split" ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <LayoutPanelLeft className="w-3.5 h-3.5" />
                {t("toolbar.split")}
              </button>
              <button
                onClick={() => setViewMode("unified")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${viewMode === "unified" ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                {t("toolbar.unified")}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadExample}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all duration-200"
            >
              {t("toolbar.loadExample")}
            </button>
            <button
              onClick={clearAll}
              disabled={!hasDiff}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-red-300 dark:hover:border-red-800 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t("toolbar.clearAll")}
            </button>
          </div>
        </div>

        {/* ── Input panels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Text A */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Circle className="w-2.5 h-2.5 fill-red-400 text-red-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("inputs.originalText")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/60">{textA.length} {t("inputs.chars")}</span>
                <CopyButton text={textA} />
              </div>
            </div>
            <textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder={t("inputs.originalPlaceholder")}
              className="h-52 px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-red-300 dark:focus:border-red-800 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 transition-all duration-200 shadow-sm"
            />
          </div>

          {/* Text B */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("inputs.modifiedText")}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/60">{textB.length} {t("inputs.chars")}</span>
                <CopyButton text={textB} />
              </div>
            </div>
            <textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder={t("inputs.modifiedPlaceholder")}
              className="h-52 px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-emerald-300 dark:focus:border-emerald-800 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        {/* ── Stats bar ── */}
        {hasDiff && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="flex flex-col items-center py-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">+{stats.added}</span>
              <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">{t("stats.added")}</span>
            </div>
            <div className="flex flex-col items-center py-3 rounded-xl border border-red-100 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
              <span className="text-xl font-bold text-red-600 dark:text-red-400">-{stats.removed}</span>
              <span className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">{t("stats.removed")}</span>
            </div>
            <div className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
              <span className="text-xl font-bold text-foreground">{stats.unchanged}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{t("stats.unchanged")}</span>
            </div>
            <div className="flex flex-col items-center py-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20">
              <span className="text-xl font-bold text-blue-500">{stats.similarity}%</span>
              <span className="text-xs text-blue-500/70 mt-0.5">{t("stats.similarity")}</span>
            </div>
          </div>
        )}

        {/* ── Diff result ── */}
        {hasDiff && (
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-6">
            {/* Legend */}
            <DiffResult />

            <div className="p-5">
              {parts.length === 0 || (stats.added === 0 && stats.removed === 0) ? (
                <p className="text-sm text-center py-8 text-muted-foreground">
                  {textA === textB && textA !== ""
                    ? t("diff.identical")
                    : t("diff.pasteBoth")}
                </p>
              ) : viewMode === "unified" ? (
                <InlineDiff parts={parts} />
              ) : (
                <SplitDiff parts={parts} />
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasDiff && (
          <EmptyState loadExample={() => { setTextA(EXAMPLE_A); setTextB(EXAMPLE_B); }} />
        )}

        {/* ── How to Use ── */}
        <HowToUse tKey="text-tools/TextDiffTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="text-tools/TextDiffTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="text-tools/TextDiffTool.json" />

        <RelatedTools />

      </div>
    </section>
  );
}