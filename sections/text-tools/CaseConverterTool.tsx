"use client";

import { useState } from "react";
import {
  CaseSensitive,
  Trash2,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { conversions, CaseType, caseOptions } from "@/funcs/text-tools/CaseConverterToolFuncs";
import CopyButton from "@/components/text-tools/case-converter/CopyButton";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import RelatedTools from "@/components/text-tools/RelatedTools";
import DotGrid from "@/components/text-tools/DotGrid";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function CaseConverterTool() {
  const t = useT("text-tools/CaseConverterTool.json");
  const [input, setInput] = useState("");
  const [active, setActive] = useState<CaseType>("uppercase");

  const output = conversions[active](input);

  const groups = ["Standard", "Developer"];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* Dot grid */}
      <DotGrid />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="text-tools/CaseConverterTool.json" href="/text-tools" />

        {/* ── Header ── */}
        <Header tKey="text-tools/CaseConverterTool.json" />

        {/* ── Case type selector ── */}
        <div className="mb-6 space-y-4">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t(`groups.${group}`)}</p>
              <div className="flex flex-wrap gap-2">
                {caseOptions.filter((o) => o.group === group).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setActive(opt.key)}
                    className={`group px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${active === opt.key
                      ? "bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/40"
                      : "border-border bg-card text-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                    title={t(`cases.${opt.key}.description`)}
                  >
                    {t(`cases.${opt.key}.label`)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Active case info banner ── */}
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-900/20">
          <CaseSensitive className="w-4 h-4 text-blue-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-blue-500">
              {t(`cases.${active}.label`)}
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              — {t(`cases.${active}.description`)}
            </span>
          </div>
          <code className="text-xs text-blue-400 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-md font-mono shrink-0">
            {t("activeInfo.eg")} {caseOptions.find((o) => o.key === active)?.example}
          </code>
        </div>

        {/* ── Input / Output ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.label")}</span>
              <button
                onClick={() => setInput("")}
                disabled={!input}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-red-300 dark:hover:border-red-800 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t("input.clear")}
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("input.placeholder")}
              className="h-64 px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm"
            />
            <p className="text-xs text-muted-foreground/60 px-1">
              {input.length} {t("stats.characters")} · {input.trim() === "" ? 0 : input.trim().split(/\s+/).length} {t("stats.words")}
            </p>
          </div>

          {/* Output */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("output.label")} <span className="text-blue-500 normal-case font-semibold ml-1">— {t(`cases.${active}.label`)}</span>
              </span>
              <CopyButton text={output} />
            </div>
            <div className="relative h-64 px-5 py-4 rounded-2xl border border-border bg-muted/40 dark:bg-muted/20 overflow-auto shadow-sm">
              {output ? (
                <p className="text-sm leading-relaxed text-foreground wrap-break-word whitespace-pre-wrap font-mono">
                  {output}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/50 italic">
                  {t("output.placeholder")}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground/60 px-1">
              {output.length} {t("stats.characters")} · {output.trim() === "" ? 0 : output.trim().split(/\s+/).length} {t("stats.words")}
            </p>
          </div>
        </div>

        {/* ── All conversions preview ── */}
        {input && (
          <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              {t("preview.title")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {caseOptions.map((opt) => {
                const result = conversions[opt.key](input);
                const isActive = active === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setActive(opt.key)}
                    className={`group text-left p-4 rounded-xl border transition-all duration-200 ${isActive
                      ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20"
                      : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800 hover:bg-muted/40"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold uppercase tracking-wide ${isActive ? "text-blue-500" : "text-muted-foreground"}`}>
                        {t(`cases.${opt.key}.label`)}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white">{t("preview.active")}</span>
                      )}
                    </div>
                    <p className="text-sm font-mono text-foreground truncate">
                      {result || <span className="text-muted-foreground/50 italic">—</span>}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── How to Use ── */}
        <HowToUse tKey="text-tools/CaseConverterTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="text-tools/CaseConverterTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="text-tools/CaseConverterTool.json" />

        <RelatedTools />

      </div>
    </section>
  );
}