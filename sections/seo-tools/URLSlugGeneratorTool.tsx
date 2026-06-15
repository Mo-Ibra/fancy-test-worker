"use client";

import { useState, useMemo } from "react";
import {
  Copy,
  ClipboardPaste, CheckCircle2, AlertCircle,
  Layers, Hash, Globe, Zap, Trash2,
  ArrowRight,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import Separator from "@/components/seo-tools/url-slug-generator/Separator";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";
import { analyzeSlug, CHAR_MAP, generateSlug, SlugOptions } from "@/funcs/seo-tools/URLSlugGeneratorToolFuncs";
import CopyButton from "@/components/seo-tools/url-slug-generator/CopyButton";
import Options from "@/components/seo-tools/url-slug-generator/Options";

export default function URLSlugGeneratorTool() {
  const t = useT("seo-tools/URLSlugGeneratorTool.json");

  const [input, setInput] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [bulk, setBulk] = useState("");
  const [tab, setTab] = useState<"single" | "bulk">("single");
  const [history, setHistory] = useState<string[]>([]);

  const [opts, setOpts] = useState<SlugOptions>({
    separator: "-", lowercase: true, maxLength: null,
    removeStopWords: false, trim: true, customReplace: "",
  });

  const setOpt = <K extends keyof SlugOptions>(k: K, v: SlugOptions[K]) =>
    setOpts(o => ({ ...o, [k]: v }));

  const slug = useMemo(() => generateSlug(input, opts), [input, opts]);
  const analysis = useMemo(() => analyzeSlug(slug, t), [slug, t]);

  const bulkResults = useMemo(() =>
    bulk.split("\n").map(l => l.trim()).filter(Boolean).map(l => ({
      input: l, slug: generateSlug(l, opts)
    }))
    , [bulk, opts]);

  const save = () => slug && setHistory(h => [slug, ...h.filter(x => x !== slug)].slice(0, 20));

  const EXAMPLES = [
    "How to Build a React App in 2024",
    "The Best Coffee Shops in New York City",
    "10 Tips für bessere SEO-Ergebnisse",
    "مقالة عن تطوير المواقع الإلكترونية",
    "Café & Résumé: À propos de nous",
  ];

  const scoreBg =
    !slug ? "border-border bg-card"
      : analysis.score === "good" ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10"
        : analysis.score === "ok" ? "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10"
          : "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10";

  const base = (baseUrl.replace(/\/$/, "") || "https://example.com");
  const fullUrl = `${base}/${slug || "your-slug"}`;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/URLSlugGeneratorTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/URLSlugGeneratorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Options ── */}
          <div className="flex flex-col gap-5">

            {/* Separator */}
            <Separator opts={opts} setOpt={setOpt} />

            {/* Options */}
            <Options opts={opts} setOpt={setOpt} />

            {/* Custom replacements */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("customReplacements.title")}</p>
              <p className="text-[10px] text-muted-foreground">{t("customReplacements.hint")}</p>
              <textarea value={opts.customReplace} onChange={e => setOpt("customReplace", e.target.value)}
                placeholder={"&=and\n@=at\n+=plus"} rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40 resize-none" />
            </div>

            {/* Base URL */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("baseUrl.title")}</p>
              <div className="flex items-center gap-0">
                <span className="px-3 py-3 rounded-l-xl border border-r-0 border-border bg-muted/40 text-muted-foreground">
                  <Globe className="w-3.5 h-3.5" />
                </span>
                <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 px-4 py-3 rounded-r-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("baseUrl.title")} />
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("history.title")}</p>
                  <button onClick={() => setHistory([])} className="text-[10px] text-muted-foreground hover:text-red-500 font-bold transition-colors">{t("history.clear")}</button>
                </div>
                <div className="divide-y divide-border max-h-44 overflow-y-auto">
                  {history.map((h, i) => (
                    <button key={i} onClick={() => { setInput(h); setTab("single"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted/20 transition-colors group text-left">
                      <code className="text-[10px] font-mono text-blue-500 dark:text-blue-400 flex-1 truncate">{h}</code>
                      <span className="opacity-0 group-hover:opacity-100"><CopyButton text={h} small /></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Main ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
              {([
                { k: "single" as const, icon: Hash, label: t("modes.single") },
                { k: "bulk" as const, icon: Layers, label: t("modes.bulk") },
              ]).map(({ k, icon: Icon, label }) => (
                <button key={k} onClick={() => setTab(k)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${tab === k ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* ── Single ── */}
            {tab === "single" && (
              <>
                {/* Input */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.inputText")}</p>
                    <div className="flex gap-2">
                      <button onClick={() => navigator.clipboard.readText().then(setInput).catch(() => { })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                        <ClipboardPaste className="w-3.5 h-3.5" /> {t("input.paste")}
                      </button>
                      <button onClick={() => setInput("")} disabled={!input}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <input value={input} onChange={e => setInput(e.target.value)}
                    placeholder={t("input.pageTitlePlaceholder")}
                    className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-base focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/40 shadow-sm" aria-label={t("input.inputText")} />
                </div>

                {/* Examples */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("input.quickExamples")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLES.map(ex => (
                      <button key={ex} onClick={() => setInput(ex)}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-[10px] font-medium transition-all truncate max-w-[180px]">
                        {ex.slice(0, 32)}{ex.length > 32 ? "…" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output */}
                <div className={`flex flex-col gap-3 p-5 rounded-2xl border shadow-sm ${scoreBg}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("output.result")}</p>
                    {slug && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${analysis.score === "good" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : analysis.score === "ok" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-500"
                        }`}>
                        {analysis.score === "good" ? `✓ ${t("output.good")}` : analysis.score === "ok" ? `⚠ ${t("output.ok")}` : `✗ ${t("output.issues")}`}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-border bg-white dark:bg-black/20">
                    <code className={`flex-1 text-base font-mono font-bold break-all ${slug ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground/30"}`}>
                      {slug || t("output.placeholder")}
                    </code>
                    <CopyButton text={slug} />
                  </div>
                  {slug && (
                    <div className="flex items-center gap-4 flex-wrap text-[10px]">
                      <span className="text-muted-foreground">{analysis.length} {t("output.chars")} · {analysis.wordCount} {t("output.words")}</span>
                      {analysis.tips.map((tip, i) => (
                        <span key={i} className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <AlertCircle className="w-2.5 h-2.5" /> {tip}
                        </span>
                      ))}
                      {analysis.score === "good" && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-2.5 h-2.5" /> {t("output.seoFriendly")}
                        </span>
                      )}
                    </div>
                  )}
                  {slug && (
                    <button onClick={save}
                      className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-[10px] font-medium transition-all">
                      <Zap className="w-3 h-3" /> {t("output.saveToHistory")}
                    </button>
                  )}
                </div>

                {/* URL Preview */}
                <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-card">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("output.urlPreview")}</p>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-muted/20">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                    <span className="text-sm font-mono text-foreground flex-1 truncate">
                      <span className="text-muted-foreground">{base}/</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{slug || t("output.placeholder")}</span>
                    </span>
                    <CopyButton text={fullUrl} small />
                  </div>
                </div>

                {/* Transformation steps */}
                {input && (
                  <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("output.transformationSteps")}</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: "Input", val: input },
                        { label: "Transliterated", val: input.split("").map(c => CHAR_MAP[c] !== undefined ? CHAR_MAP[c] : c).join("") },
                        { label: "Lowercased", val: opts.lowercase ? input.split("").map(c => CHAR_MAP[c] !== undefined ? CHAR_MAP[c] : c).join("").toLowerCase() : "(skipped)" },
                        { label: "Final slug", val: slug },
                      ].map(({ label, val }) => (
                        <div key={label} className="flex items-start gap-3">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/50 w-24 shrink-0 pt-0.5">{label}</span>
                          <code className={`text-[11px] font-mono break-all flex-1 ${label === "Final slug" ? "text-blue-500 font-bold" : "text-muted-foreground"}`}>{val || "—"}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── Bulk ── */}
            {tab === "bulk" && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.bulkInput")}</p>
                    <div className="flex gap-2">
                      <button onClick={() => navigator.clipboard.readText().then(setBulk).catch(() => { })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                        <ClipboardPaste className="w-3.5 h-3.5" /> {t("input.paste")}
                      </button>
                      <button onClick={() => setBulk("")} disabled={!bulk}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <textarea value={bulk} onChange={e => setBulk(e.target.value)}
                    placeholder={"How to Build a React App\nBest Coffee Shops in NYC\nأفضل تطبيقات الهاتف 2024\nSEO Tips für Anfänger"}
                    rows={6}
                    className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/40 shadow-sm font-mono" />
                </div>

                {bulkResults.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 bg-muted/20 border-b border-border">
                      <Layers className="w-4 h-4 text-blue-500" />
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{bulkResults.length} {t("output.slugs")}</p>
                      <div className="flex gap-2">
                        <button onClick={() => navigator.clipboard.writeText(bulkResults.map(x => x.slug).join("\n"))}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                          <Copy className="w-3.5 h-3.5" /> {t("output.copyAll")}
                        </button>
                        <button onClick={() => {
                          const blob = new Blob([bulkResults.map(x => `${x.input}\t→\t${x.slug}`).join("\n")], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a"); a.href = url; a.download = "slugs.txt"; a.click();
                          URL.revokeObjectURL(url);
                        }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                          <ArrowRight className="w-3.5 h-3.5" /> {t("output.downloadTxt")}
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-border max-h-96 overflow-y-auto">
                      {bulkResults.map(({ input: inp, slug: s }, i) => {
                        const a = analyzeSlug(s, t);
                        return (
                          <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/10 transition-colors group">
                            <span className="text-[10px] text-muted-foreground/40 font-mono w-5 shrink-0 pt-0.5 tabular-nums">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[11px] text-muted-foreground truncate mb-0.5">{inp}</p>
                              <code className={`text-xs font-mono font-bold break-all ${a.score === "good" ? "text-blue-600 dark:text-blue-400" : a.score === "ok" ? "text-amber-600 dark:text-amber-400" : "text-red-500"
                                }`}>{s || "—"}</code>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[9px] text-muted-foreground/40">{s.length}c</span>
                              <CopyButton text={s} small />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/URLSlugGeneratorTool.json" count={4} />
        <FAQ tKey="seo-tools/URLSlugGeneratorTool.json" />
        <Examples tKey="seo-tools/URLSlugGeneratorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}