"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Globe,
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  Code2,
  Download,
  RefreshCw,
  FileText,
  Layers,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { buildHreflang, DEFAULT_ENTRIES, generateHtml, generateHttpHeader, generateXmlSitemap, HreflangEntry, type OutputFormatType, PageSet, QUICK_COMBOS, uid, validateEntries } from "@/funcs/seo-tools/HreflangGeneratorToolFuncs";
import EntryRow from "@/components/seo-tools/hreflang-generator/EntryRow";
import CopyButton from "@/components/seo-tools/hreflang-generator/CopyButton";
import CodeBlock from "@/components/seo-tools/hreflang-generator/CodeBlock";
import PageSetCard from "@/components/seo-tools/hreflang-generator/PageSetCard";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import OutputFormat from "@/components/seo-tools/hreflang-generator/OutputFormat";
import Rules from "@/components/seo-tools/hreflang-generator/Rules";
import TestTool from "@/components/seo-tools/hreflang-generator/TestTool";
import WhatHreflang from "@/components/seo-tools/hreflang-generator/WhatHreflang";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function HreflangGeneratorTool() {
  const t = useT("seo-tools/HreflangGeneratorTool.json");

  const [mode, setMode] = useState<"single" | "multi">("single");
  const [outputFmt, setOutputFmt] = useState<OutputFormatType>("html");

  // Single page mode
  const [entries, setEntries] = useState<HreflangEntry[]>(DEFAULT_ENTRIES);

  // Multi-page / sitemap mode
  const [pageSets, setPageSets] = useState<PageSet[]>([{
    id: uid(), name: "Home page",
    entries: [
      { id: uid(), lang: "en", region: "US", url: "", isDefault: false },
      { id: uid(), lang: "fr", region: "FR", url: "", isDefault: false },
      { id: uid(), lang: "en", region: "", url: "", isDefault: true },
    ],
  }]);

  // ── Entry operations (single mode) ──────────────────────────────

  const addEntry = () => setEntries(p => [...p, { id: uid(), lang: "en", region: "", url: "", isDefault: false }]);
  const removeEntry = (id: string) => setEntries(p => p.filter(e => e.id !== id));
  const updateEntry = (e: HreflangEntry) => setEntries(p => p.map(x => x.id === e.id ? e : x));

  const addQuickCombo = (combo: typeof QUICK_COMBOS[0]) => {
    setEntries(p => [...p, { id: uid(), lang: combo.lang, region: combo.region, url: "", isDefault: false }]);
  };

  const resetEntries = () => setEntries(DEFAULT_ENTRIES.map(e => ({ ...e, id: uid() })));

  // ── Page Set operations (multi mode) ──────────────────────────

  const addPageSet = () => setPageSets(p => [...p, {
    id: uid(), name: `Page ${p.length + 1}`,
    entries: [
      { id: uid(), lang: "en", region: "", url: "", isDefault: false },
      { id: uid(), lang: "fr", region: "", url: "", isDefault: false },
    ],
  }]);
  const updatePageSet = (ps: PageSet) => setPageSets(p => p.map(x => x.id === ps.id ? ps : x));
  const removePageSet = (id: string) => setPageSets(p => p.filter(x => x.id !== id));

  // ── Generated output ─────────────────────────────────────────

  const singleHtml = useMemo(() => generateHtml(entries), [entries]);
  const multiXml = useMemo(() => generateXmlSitemap(pageSets), [pageSets]);
  const singleHeader = useMemo(() => generateHttpHeader(entries), [entries]);
  const validation = useMemo(() => validateEntries(entries), [entries]);

  // Build single-mode output based on format
  const singleOutput = useMemo(() => {
    switch (outputFmt) {
      case "xml-sitemap": return generateXmlSitemap([{ id: "s", name: "", entries }]);
      case "http-header": return singleHeader;
      default: return singleHtml;
    }
  }, [outputFmt, entries, singleHtml, singleHeader]);

  // Download handlers
  const downloadXml = () => {
    const blob = new Blob([multiXml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "hreflang-sitemap.xml"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCsv = useCallback(() => {
    const rows = [["hreflang", "URL", "Tag"]]
      .concat(entries.filter(e => e.url.trim()).map(e => {
        const hl = e.isDefault ? "x-default" : buildHreflang(e.lang, e.region);
        return [hl, e.url.trim(), `<link rel="alternate" hreflang="${hl}" href="${e.url.trim()}" />`];
      }));
    const csv = rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "hreflang-tags.csv"; a.click();
    URL.revokeObjectURL(url);
  }, [entries]);

  const validCount = entries.filter(e => e.url.trim()).length;
  const errors = validation.filter(v => v.type === "error");
  const warnings = validation.filter(v => v.type === "warning");
  const infos = validation.filter(v => v.type === "info");

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/HreflangGeneratorTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/HreflangGeneratorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Options + Info ── */}
          <div className="flex flex-col gap-5">

            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
              {([
                { k: "single" as const, icon: Globe, label: t("mode.single") },
                { k: "multi" as const, icon: Layers, label: t("mode.multi") },
              ]).map(({ k, icon: Icon, label }) => (
                <button key={k} onClick={() => setMode(k)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${mode === k ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* Output format */}
            <OutputFormat outputFmt={outputFmt} setOutputFmt={setOutputFmt} />

            {/* Quick add combos */}
            {mode === "single" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("quickAdd.title")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_COMBOS.map(combo => (
                    <button key={`${combo.lang}-${combo.region}`}
                      onClick={() => addQuickCombo(combo)}
                      className="px-2 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-[10px] font-bold transition-all">
                      {combo.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Validation */}
            {mode === "single" && validCount > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("validation.title")}</p>
                {errors.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 text-xs text-red-700 dark:text-red-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {v.msg}
                  </div>
                ))}
                {warnings.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 text-xs text-amber-700 dark:text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {v.msg}
                  </div>
                ))}
                {infos.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10 text-xs text-blue-700 dark:text-blue-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {v.msg}
                  </div>
                ))}
              </div>
            )}

            {/* What is hreflang */}
            <WhatHreflang />

            {/* Rules */}
            <Rules />

            {/* Test tools */}
            <TestTool />
          </div>

          {/* ── Right: Builder + Output ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* ── Single page mode ── */}
            {mode === "single" && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("entries.title")}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={resetEntries}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
                      <RefreshCw className="w-3.5 h-3.5" /> {t("entries.reset")}
                    </button>
                    <button onClick={addEntry}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                      <Plus className="w-3.5 h-3.5" /> {t("entries.addEntry")}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {entries.map(e => (
                    <EntryRow key={e.id} entry={e}
                      onUpdate={updateEntry}
                      onRemove={() => removeEntry(e.id)}
                      showRemove={entries.length > 1} />
                  ))}
                </div>

                {/* Add CTA */}
                <button onClick={addEntry}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-xs font-medium text-muted-foreground transition-all">
                  <Plus className="w-4 h-4" /> {t("entries.addLanguage")}
                </button>

                {/* Summary */}
                {validCount > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: "Languages", value: entries.filter(e => !e.isDefault && e.url.trim()).length },
                      { label: "With URL", value: validCount },
                      { label: "x-default", value: entries.filter(e => e.isDefault && e.url.trim()).length },
                      { label: "Errors", value: errors.length },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                        <span className="text-sm font-bold font-mono tabular-nums text-foreground">{value}</span>
                        <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Output */}
                {validCount > 0 && (
                  <>
                    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                        <Code2 className="w-4 h-4 text-blue-500" />
                        <p className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">
                          {outputFmt === "html" ? "HTML Tags (copy into <head>)"
                            : outputFmt === "xml-sitemap" ? "XML Sitemap Format"
                              : "HTTP Response Headers"}
                        </p>
                        <div className="flex gap-2">
                          <CopyButton text={singleOutput} />
                          {outputFmt === "xml-sitemap" && (
                            <button onClick={downloadXml}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                              <Download className="w-3.5 h-3.5" /> {t("download.xml")}
                            </button>
                          )}
                          <button onClick={downloadCsv}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                            <Download className="w-3.5 h-3.5" /> {t("download.csv")}
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950 dark:bg-black/40 max-h-72 overflow-y-auto">
                        <code className="text-slate-300">{singleOutput}</code>
                      </pre>
                    </div>

                    {outputFmt === "html" && (
                      <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10">
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">Implementation Reminder</p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-300 leading-relaxed">
                          These tags must be copied to the <code className="font-mono bg-blue-100 dark:bg-blue-900/40 px-1 rounded">&lt;head&gt;</code> of <strong>every page in the set</strong> — including all language versions. Each page must link to all others, including itself.
                        </p>
                      </div>
                    )}

                    {outputFmt === "http-header" && (
                      <CodeBlock code={`# Add to your .htaccess or server config:\nHeader add Link '<${singleHeader.split("\n")[0]?.match(/<([^>]+)>/)?.[1] ?? ""}>'`} label="Apache .htaccess Example" />
                    )}
                  </>
                )}
              </>
            )}

            {/* ── Multi-page / sitemap mode ── */}
            {mode === "multi" && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Page Sets</p>
                  <button onClick={addPageSet}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                    <Plus className="w-3.5 h-3.5" />{t("entries.addPage")}
                  </button>
                </div>

                {pageSets.map(ps => (
                  <PageSetCard key={ps.id} ps={ps}
                    onUpdate={updatePageSet}
                    onRemove={() => removePageSet(ps.id)}
                    showRemove={pageSets.length > 1} t={t} />
                ))}

                {/* XML output */}
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <p className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">XML Sitemap with Hreflang</p>
                    <div className="flex gap-2">
                      <CopyButton text={multiXml} />
                      <button onClick={downloadXml}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                  <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950 dark:bg-black/40 max-h-96 overflow-y-auto">
                    <code className="text-slate-300">{multiXml}</code>
                  </pre>
                </div>

                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    In the XML sitemap, each <code className="font-mono font-bold bg-blue-100 dark:bg-blue-900/40 px-1 rounded">&lt;url&gt;</code> block must contain all <code className="font-mono font-bold bg-blue-100 dark:bg-blue-900/40 px-1 rounded">xhtml:link</code> alternates. Submit this sitemap in Google Search Console.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/HreflangGeneratorTool.json" count={4} />
        <FAQ tKey="seo-tools/HreflangGeneratorTool.json" />
        <Examples tKey="seo-tools/HreflangGeneratorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}