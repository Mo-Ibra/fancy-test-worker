"use client";

import { useState, useMemo } from "react";
import {
  Trash2,
  ClipboardPaste,
  Sparkles,
} from "lucide-react";
import { useT, useLang } from "@/context/TranslationProvider";
import { cleanOptions, applyCleaners, EXAMPLE } from "@/funcs/text-tools/RemoveFormattingToolFuncs";

import CopyButton from "@/components/text-tools/remove-formatting/CopyButton";
import MiniStat from "@/components/text-tools/remove-formatting/MiniStat";
import DotGrid from "@/components/text-tools/DotGrid";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import RelatedTools from "@/components/text-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main component ────────────────────────────────────────────────

export default function RemoveFormattingTool() {
  const t = useT("text-tools/RemoveFormattingTool.json");
  const lang = useLang();
  const isAr = lang === "ar";
  const [input, setInput] = useState("");
  const [enabled, setEnabled] = useState<Set<string>>(
    new Set(cleanOptions.filter((o) => o.default).map((o) => o.key))
  );

  const output = useMemo(() => applyCleaners(input, enabled), [input, enabled]);

  const toggle = (key: string) =>
    setEnabled((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const enableAll = () => setEnabled(new Set(cleanOptions.map((o) => o.key)));
  const disableAll = () => setEnabled(new Set());
  const resetToDefaults = () => setEnabled(new Set(cleanOptions.filter((o) => o.default).map((o) => o.key)));

  const groups = ["Format", "Content"];

  // Stats
  const beforeChars = input.length;
  const afterChars = output.length;
  const beforeWords = input.trim() ? input.trim().split(/\s+/).length : 0;
  const afterWords = output.trim() ? output.trim().split(/\s+/).length : 0;
  const removed = beforeChars - afterChars;
  const pct = beforeChars > 0 ? Math.round((removed / beforeChars) * 100) : 0;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* Dot grid */}
      <DotGrid />

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="text-tools/RemoveFormattingTool.json" href="/text-tools" />

        {/* ── Header ── */}
        <Header tKey="text-tools/RemoveFormattingTool.json" />

        {/* ── Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Options sidebar ── */}
          <div className="flex flex-col gap-5">

            {/* Quick actions */}
            <div className="flex gap-2">
              <button onClick={enableAll} className="flex-1 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-blue-500 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">{t("controls.allOn")}</button>
              <button onClick={disableAll} className="flex-1 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200">{t("controls.allOff")}</button>
              <button onClick={resetToDefaults} className="flex-1 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-200">{t("controls.reset")}</button>
            </div>

            {/* Option groups */}
            {groups.map((group) => (
              <div key={group}>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t(`groups.${group}`)}</p>
                <div className="flex flex-col gap-2">
                  {cleanOptions.filter((o) => o.group === group).map((opt) => {
                    const isOn = enabled.has(opt.key);
                    return (
                      <button
                        key={opt.key}
                        onClick={() => toggle(opt.key)}
                        className={`group flex items-start gap-3 p-3 rounded-xl border text-start transition-all duration-200 ${isOn
                          ? "border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-900/20"
                          : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40"
                          }`}
                      >
                        {/* Toggle pill */}
                        <div className={`relative mt-0.5 w-8 h-4.5 rounded-full shrink-0 transition-colors duration-200 ${isOn ? "bg-blue-500" : "bg-border"}`}
                          style={{ width: 32, height: 18 }}>
                          <span className={`absolute top-0.5 inset-s-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all duration-200 ${
                            isOn 
                              ? (isAr ? "-translate-x-3.5" : "translate-x-3.5") 
                              : "translate-x-0"
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold leading-tight ${isOn ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
                            {t(`options.${opt.key}.label`)}
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                            {t(`options.${opt.key}.description`)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Load example */}
            <button
              onClick={() => setInput(EXAMPLE)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-blue-500 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
            >
              <ClipboardPaste className="w-4 h-4" />
              {t("controls.loadExample")}
            </button>
          </div>

          {/* ── Input / Output ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Stats row */}
            {input && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MiniStat label={t("stats.characters")} before={beforeChars} after={afterChars} />
                <MiniStat label={t("stats.words")} before={beforeWords} after={afterWords} />
                <div className="flex flex-col p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20 text-center">
                  <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mb-1">{t("stats.removed")}</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{removed >= 0 ? removed : 0}</span>
                  <span className="text-[10px] text-emerald-500/70 mt-0.5">{t("stats.chars")}</span>
                </div>
                <div className="flex flex-col p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20 text-center">
                  <span className="text-xs text-blue-500/80 mb-1">{t("stats.cleaned")}</span>
                  <span className="text-lg font-bold text-blue-500">{pct}%</span>
                  <span className="text-[10px] text-blue-400/70 mt-0.5">{t("stats.reduction")}</span>
                </div>
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
                className="h-56 px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Arrow indicator */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {enabled.size} {enabled.size !== 1 ? t("cleaners.activePlural") : t("cleaners.active")} {t("cleaners.activeSuffix")}
                </span>
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Output */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("output.label")}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/60">{output.length} {t("output.chars")}</span>
                  <CopyButton text={output} />
                </div>
              </div>
              <div className="h-56 px-5 py-4 rounded-2xl border border-border bg-muted/30 dark:bg-muted/10 overflow-auto shadow-sm">
                {output ? (
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap wrap-break-word font-mono">
                    {output}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic">
                    {input ? t("output.placeholderAllRemoved") : t("output.placeholderEmpty")}
                  </p>
                )}
              </div>
            </div>

            {/* Full copy */}
            <CopyButton text={output} full />
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="text-tools/RemoveFormattingTool.json" count={3} />

        {/* ── FAQ ── */}
        <FAQ tKey="text-tools/RemoveFormattingTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="text-tools/RemoveFormattingTool.json" />

        {/* ── Related tools ── */}
        <RelatedTools />

      </div>
    </section>
  );
}