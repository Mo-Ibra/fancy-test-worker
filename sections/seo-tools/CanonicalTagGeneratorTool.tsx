"use client";

import { useState, useMemo } from "react";
import {
  Link,
  ClipboardPaste,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  Download,
  Plus,
  X,
  Globe,
  Layers,
  Zap,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import { analyzeUrl, makeCanonicalTag, makeHreflangTag, makeXDefaultTag, Mode, NormalizeOpts, normalizeUrl, uid, UrlEntry } from "@/funcs/seo-tools/CanonicalTagGeneratorToolFuncs";
import Toggle from "@/components/seo-tools/canonical-tag-generator/Toggle";
import CopyButton from "@/components/seo-tools/canonical-tag-generator/CopyButton";
import CodeBlock from "@/components/seo-tools/canonical-tag-generator/CodeBlock";
import TestingResources from "@/components/seo-tools/canonical-tag-generator/TestingResources";
import URLNormalizationOptions from "@/components/seo-tools/canonical-tag-generator/URL Normalization Options";
import WhatCanonical from "@/components/seo-tools/canonical-tag-generator/WhatCanonical";
import CommonMistakes from "@/components/seo-tools/canonical-tag-generator/CommonMistakes";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Hreflang languages ─────────────────────────────────────────────

const HREFLANG_OPTIONS = [
  { code: "en", labelKey: "en" },
  { code: "en-US", labelKey: "en-US" },
  { code: "en-GB", labelKey: "en-GB" },
  { code: "ar", labelKey: "ar" },
  { code: "fr", labelKey: "fr" },
  { code: "de", labelKey: "de" },
  { code: "es", labelKey: "es" },
  { code: "it", labelKey: "it" },
  { code: "pt", labelKey: "pt" },
  { code: "ru", labelKey: "ru" },
  { code: "zh", labelKey: "zh" },
  { code: "ja", labelKey: "ja" },
  { code: "ko", labelKey: "ko" },
  { code: "nl", labelKey: "nl" },
  { code: "pl", labelKey: "pl" },
  { code: "tr", labelKey: "tr" },
  { code: "sv", labelKey: "sv" },
];

interface HreflangEntry { id: string; lang: string; url: string; }

// ── Main ───────────────────────────────────────────────────────────

export default function CanonicalTagGeneratorTool() {
  const t = useT("seo-tools/CanonicalTagGeneratorTool.json");

  // Single mode
  const [singleUrl, setSingleUrl] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  // Normalization options
  const [normOpts, setNormOpts] = useState<NormalizeOpts>({
    forceHttps: true,
    preferWww: false,
    preferNonWww: false,
    removeTrailingSlash: true,
    addTrailingSlash: false,
    stripParams: false,
    lowercasePath: true,
  });
  const setNorm = <K extends keyof NormalizeOpts>(k: K, v: NormalizeOpts[K]) =>
    setNormOpts(o => ({ ...o, [k]: v }));

  // Bulk mode
  const [bulkInput, setBulkInput] = useState("");
  const [bulkUrls, setBulkUrls] = useState<UrlEntry[]>([]);

  // Cross-domain / hreflang
  const [hreflangEntries, setHreflangEntries] = useState<HreflangEntry[]>([
    { id: uid(), lang: "en", url: "" },
    { id: uid(), lang: "fr", url: "" },
  ]);
  const [addXDefault, setAddXDefault] = useState(true);
  const [xDefaultUrl, setXDefaultUrl] = useState("");

  const [mode, setMode] = useState<Mode>("single");

  // ── Single mode computed ───────────────────────────────────────

  const singleAnalysis = useMemo(() => analyzeUrl(singleUrl), [singleUrl]);
  const normalizedSingle = useMemo(() => normalizeUrl(singleUrl, normOpts), [singleUrl, normOpts]);
  const effectiveCanonical = useMemo(() => {
    if (useCustom && canonicalUrl.trim()) return canonicalUrl.trim();
    return normalizedSingle;
  }, [useCustom, canonicalUrl, normalizedSingle]);

  const singleTag = useMemo(() =>
    effectiveCanonical ? makeCanonicalTag(effectiveCanonical) : "",
    [effectiveCanonical]
  );

  const fullHeadExample = useMemo(() => {
    if (!effectiveCanonical) return "";
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Page Title</title>
  ${singleTag}
</head>
<body>
  <!-- Your content -->
</body>
</html>`;
  }, [effectiveCanonical, singleTag]);

  // ── Bulk mode ──────────────────────────────────────────────────
  const processBulk = () => {
    const lines = bulkInput.split("\n").map(l => l.trim()).filter(Boolean);
    setBulkUrls(lines.map(url => ({
      id: uid(), url,
      canonical: normalizeUrl(url, normOpts),
      note: "",
    })));
  };

  const bulkOutput = useMemo(() => {
    if (!bulkUrls.length) return "";
    return bulkUrls.map(e => {
      const can = e.canonical || normalizeUrl(e.url, normOpts);
      return `<!-- ${e.url} -->\n${makeCanonicalTag(can)}`;
    }).join("\n\n");
  }, [bulkUrls, normOpts]);

  const exportBulkCsv = () => {
    const rows = [[t("bulk.originalUrl"), t("bulk.canonicalUrl"), t("bulk.tag")]]
      .concat(bulkUrls.map(e => {
        const can = e.canonical || normalizeUrl(e.url, normOpts);
        return [e.url, can, makeCanonicalTag(can)];
      }));
    const csv = rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "canonical-tags.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Hreflang output ────────────────────────────────────────────

  const hreflangOutput = useMemo(() => {
    const lines: string[] = [];
    hreflangEntries.filter(e => e.url.trim()).forEach(e => {
      lines.push(makeHreflangTag(e.url.trim(), e.lang));
    });
    if (addXDefault && xDefaultUrl.trim()) {
      lines.push(makeXDefaultTag(xDefaultUrl.trim()));
    }
    return lines.join("\n");
  }, [hreflangEntries, addXDefault, xDefaultUrl]);

  // Common use-case examples
  const EXAMPLES = [
    { label: t("examples.removeUtm"), url: "https://example.com/page?utm_source=google&utm_medium=cpc" },
    { label: t("examples.wwwVsNonWww"), url: "https://www.example.com/page" },
    { label: t("examples.trailingSlash"), url: "https://example.com/page/" },
    { label: t("examples.httpToHttps"), url: "http://example.com/page" },
    { label: t("examples.mixedCase"), url: "https://example.com/Blog/Post-Title" },
    { label: t("examples.fragmentUrl"), url: "https://example.com/page#section2" },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/CanonicalTagGeneratorTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/CanonicalTagGeneratorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Options ── */}
          <div className="flex flex-col gap-5">

            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
              {([
                { k: "single" as Mode, icon: Link, label: t("tabs.single") },
                { k: "bulk" as Mode, icon: Layers, label: t("tabs.bulk") },
                { k: "cross-domain" as Mode, icon: Globe, label: t("tabs.crossDomain") },
              ]).map(({ k, icon: Icon, label }) => (
                <button key={k} onClick={() => setMode(k)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${mode === k ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* URL Normalization Options */}
            <URLNormalizationOptions normOpts={normOpts} setNorm={setNorm} t={t} />

            {/* What is canonical */}
            <WhatCanonical />

            {/* Common mistakes */}
            <CommonMistakes />
          </div>

          {/* ── Right: Main content ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* ── SINGLE MODE ── */}
            {mode === "single" && (
              <>
                {/* Page URL input */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("single.pageTitle")}</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <input value={singleUrl} onChange={e => setSingleUrl(e.target.value)}
                        placeholder={t("single.pagePlaceholder")}
                        className="w-full pl-9 pr-4 py-3.5 rounded-2xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/40 shadow-sm" aria-label={t("single.pageTitle")} />
                    </div>
                    <button onClick={() => navigator.clipboard.readText().then(setSingleUrl).catch(() => { })}
                      className="flex items-center gap-1.5 px-3 py-3.5 rounded-2xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                      <ClipboardPaste className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setSingleUrl(""); setCanonicalUrl(""); }} disabled={!singleUrl}
                      className="w-12 flex items-center justify-center rounded-2xl border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick examples */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("single.quickExamples")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLES.map(ex => (
                      <button key={ex.label} onClick={() => setSingleUrl(ex.url)}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-[10px] font-medium transition-all">
                        {ex.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* URL Analysis */}
                {singleUrl && singleAnalysis.isValid && (
                  <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("single.urlAnalysis")}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: t("single.https"), ok: singleAnalysis.isHttps, note: singleAnalysis.isHttps ? "✓" : t("single.httpsDetected") },
                        { label: t("single.fragment"), ok: !singleAnalysis.hasFragment, note: singleAnalysis.hasFragment ? t("single.fragmentFound") : t("single.fragmentNone") },
                        { label: t("single.query"), ok: !singleAnalysis.hasParams, note: singleAnalysis.hasParams ? t("single.queryStrip") : t("single.queryClean") },
                        { label: t("single.trailing"), ok: !singleAnalysis.hasTrailingSlash, note: singleAnalysis.hasTrailingSlash ? t("single.trailingPresent") : t("single.trailingNone") },
                      ].map(({ label, ok, note }) => (
                        <div key={label} className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-background">
                          {ok
                            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                          <div>
                            <p className="text-[10px] font-bold text-foreground">{label}</p>
                            <p className={`text-[9px] ${ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{note}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Issues + warnings */}
                    {[...singleAnalysis.issues, ...singleAnalysis.warnings].map((msg, i) => (
                      <div key={i} className={`flex items-start gap-2 mt-2 px-3 py-2 rounded-xl text-xs ${singleAnalysis.issues.includes(msg)
                        ? "border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400"
                        : "border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400"
                        }`}>
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {t(msg)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Normalized URL */}
                {singleUrl && normalizedSingle && (
                  <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{t("single.normalizedUrl")}</p>
                      <CopyButton text={normalizedSingle} />
                    </div>
                    <code className="text-xs font-mono text-foreground break-all block mt-1">{normalizedSingle}</code>
                    {normalizedSingle !== (singleUrl.startsWith("http") ? singleUrl : "https://" + singleUrl) && (
                      <p className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-1">
                        {t("single.normalizedFromOriginal")}
                      </p>
                    )}
                  </div>
                )}

                {/* Custom canonical override */}
                <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm">
                  <Toggle checked={useCustom} onChange={() => setUseCustom(p => !p)}
                    label={t("single.customCanonical")} sub={t("single.customCanonicalSub")} />
                  {useCustom && (
                    <input value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)}
                      placeholder={t("single.customPlaceholder")}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("single.customCanonical")} />
                  )}
                </div>

                {/* Generated tag */}
                {singleTag && (
                  <>
                    <CodeBlock code={singleTag} label={t("single.canonicalTag")} />

                    {/* Transformation visualization */}
                    {singleUrl && (
                      <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("single.urlTransformation")}</p>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground/50 w-20 shrink-0 pt-1">{t("single.original")}</span>
                            <code className="text-xs font-mono text-foreground break-all flex-1 bg-muted/20 px-2 py-1.5 rounded-lg">{singleUrl}</code>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-[10px] font-bold text-emerald-500 w-20 shrink-0 pt-1">{t("single.canonical")}</span>
                            <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400 break-all flex-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1.5 rounded-lg">{effectiveCanonical}</code>
                          </div>
                        </div>
                        {/* Applied normalizations */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {normOpts.forceHttps && <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{t("single.httpsLabel")}</span>}
                          {normOpts.stripParams && <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{t("single.noParams")}</span>}
                          {normOpts.removeTrailingSlash && <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{t("single.noTrailingSlash")}</span>}
                          {normOpts.lowercasePath && <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{t("single.lowercase")}</span>}
                          {normOpts.preferWww && <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{t("single.wwwLabel")}</span>}
                          {normOpts.preferNonWww && <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">{t("single.nonWwwLabel")}</span>}
                        </div>
                      </div>
                    )}

                    {/* Full HTML example */}
                    <CodeBlock code={fullHeadExample} label={t("single.fullHtmlExample")} />
                  </>
                )}
              </>
            )}

            {/* ── BULK MODE ── */}
            {mode === "bulk" && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("bulk.urlsLabel")}</p>
                    <div className="flex gap-2">
                      <button onClick={() => navigator.clipboard.readText().then(setBulkInput).catch(() => { })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                        <ClipboardPaste className="w-3.5 h-3.5" /> {t("bulk.paste")}
                      </button>
                      <button onClick={() => { setBulkInput(""); setBulkUrls([]); }} disabled={!bulkInput}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <textarea value={bulkInput} onChange={e => setBulkInput(e.target.value)}
                    placeholder={t("bulk.placeholder")}
                    rows={6}
                    className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm font-mono resize-none focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40 shadow-sm" />
                  <button onClick={processBulk} disabled={!bulkInput.trim()}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white text-sm font-bold transition-all">
                    <Zap className="w-4 h-4" /> {t("bulk.generate")} {bulkInput.split("\n").filter(l => l.trim()).length} {t("bulk.canonicalTags")}
                  </button>
                </div>

                {bulkUrls.length > 0 && (
                  <>
                    {/* Results table */}
                    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                        <Link className="w-4 h-4 text-blue-500" />
                        <p className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("bulk.results")} — {bulkUrls.length} {t("bulk.urls")}</p>
                        <div className="flex gap-2">
                          <CopyButton text={bulkOutput} label={t("bulk.copyAll")} />
                          <button onClick={exportBulkCsv}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                            <Download className="w-3.5 h-3.5" /> {t("bulk.downloadCsv")}
                          </button>
                        </div>
                      </div>
                      <div className="divide-y divide-border max-h-80 overflow-y-auto">
                        {bulkUrls.map((e, i) => {
                          const can = e.canonical || normalizeUrl(e.url, normOpts);
                          const diff = can !== e.url;
                          return (
                            <div key={e.id} className="flex flex-col gap-1 px-4 py-3 hover:bg-muted/10 transition-colors">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-muted-foreground/40 w-5 tabular-nums shrink-0">{i + 1}</span>
                                <code className="text-[10px] font-mono text-muted-foreground truncate flex-1">{e.url}</code>
                                {diff && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">{t("bulk.changed")}</span>}
                              </div>
                              <code className="text-[10px] font-mono text-blue-500 dark:text-blue-400 truncate ml-7">{makeCanonicalTag(can)}</code>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* All tags output */}
                    <CodeBlock code={bulkOutput} label={t("bulk.allTags")} />
                  </>
                )}
              </>
            )}

            {/* ── HREFLANG MODE ── */}
            {mode === "cross-domain" && (
              <>
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    {t("crossDomain.description")}
                  </p>
                </div>

                {/* Hreflang entries */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("crossDomain.languageVersions")}</p>
                    <button onClick={() => setHreflangEntries(p => [...p, { id: uid(), lang: "en", url: "" }])}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                      <Plus className="w-3.5 h-3.5" /> {t("crossDomain.addLanguage")}
                    </button>
                  </div>

                  {hreflangEntries.map((entry, i) => (
                    <div key={entry.id} className="flex items-center gap-2">
                      <select value={entry.lang}
                        onChange={e => setHreflangEntries(p => p.map(x => x.id === entry.id ? { ...x, lang: e.target.value } : x))}
                        className="w-44 px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all shrink-0">
                        {HREFLANG_OPTIONS.map(l => <option key={l.code} value={l.code}>{l.code} — {t(`languages.${l.labelKey}`)}</option>)}
                      </select>
                      <input value={entry.url}
                        onChange={e => setHreflangEntries(p => p.map(x => x.id === entry.id ? { ...x, url: e.target.value } : x))}
                        placeholder={t("crossDomain.hreflangPlaceholder")}
                        aria-label={t("crossDomain.hreflangPlaceholder")}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
                      <button onClick={() => setHreflangEntries(p => p.filter(x => x.id !== entry.id))}
                        disabled={hreflangEntries.length <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-30 transition-all shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* x-default */}
                  <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm">
                    <Toggle checked={addXDefault} onChange={() => setAddXDefault(p => !p)}
                      label={t("crossDomain.xDefault")} sub={t("crossDomain.xDefaultSub")} />
                    {addXDefault && (
                      <input value={xDefaultUrl} onChange={e => setXDefaultUrl(e.target.value)}
                        placeholder={t("crossDomain.xDefaultPlaceholder")}
                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("crossDomain.xDefault")} />
                    )}
                  </div>
                </div>

                {/* Hreflang output */}
                {hreflangOutput && (
                  <>
                    <CodeBlock code={hreflangOutput} label={t("crossDomain.outputLabel")} />

                    {/* Important note */}
                    <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        <strong>{t("crossDomain.important")}:</strong> {t("crossDomain.importantDesc")}
                      </p>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Testing resources */}
            <TestingResources />
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/CanonicalTagGeneratorTool.json" count={4} />
        <FAQ tKey="seo-tools/CanonicalTagGeneratorTool.json" />
        <Examples tKey="seo-tools/CanonicalTagGeneratorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}