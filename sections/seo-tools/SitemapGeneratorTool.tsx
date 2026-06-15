"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  Globe,
  SlidersHorizontal,
  FileText,
  X,
  Layers,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import { ChangeFreq, generateIndexXml, generateUrlsetXml, SitemapIndex, SitemapUrl, TODAY, uid, validateSitemap, ViewMode } from "@/funcs/seo-tools/SitemapGeneratorToolFuncs";
import UrlRow from "@/components/seo-tools/sitemap-generator/UrlRow";
import SubmissionTips from "@/components/seo-tools/sitemap-generator/SubmissionTips";
import GeneratedXML from "@/components/seo-tools/sitemap-generator/GeneratedXML";
import Header from "@/components/Header";
import BreadCrumb from "@/components/BreadCrumb";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main ───────────────────────────────────────────────────────────

export default function SitemapGeneratorTool() {
  const t = useT("seo-tools/SitemapGeneratorTool.json");

  const [viewMode, setViewMode] = useState<ViewMode>("url-list");
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { id: uid(), loc: "", lastmod: TODAY, changefreq: "weekly", priority: "0.8", images: [] },
  ]);
  const [indexes, setIndexes] = useState<SitemapIndex[]>([
    { id: uid(), loc: "", lastmod: TODAY },
  ]);
  const [showImages, setShowImages] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [showBulk, setShowBulk] = useState(false);
  const [defaultFreq, setDefaultFreq] = useState<ChangeFreq>("weekly");
  const [defaultPrio, setDefaultPrio] = useState("0.8");
  const [baseUrl, setBaseUrl] = useState("");

  // Add / update / remove URLs
  const addUrl = () => setUrls(u => [...u, {
    id: uid(), loc: "", lastmod: TODAY,
    changefreq: defaultFreq, priority: defaultPrio, images: [],
  }]);

  const updateUrl = (id: string, u: SitemapUrl) =>
    setUrls(prev => prev.map(x => x.id === id ? u : x));
  const removeUrl = (id: string) =>
    setUrls(prev => prev.filter(x => x.id !== id));

  // Bulk import
  const importBulk = useCallback(() => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split("\n").map(l => l.trim()).filter(Boolean);
    const newUrls: SitemapUrl[] = lines.map(loc => ({
      id: uid(),
      loc: baseUrl && !loc.startsWith("http") ? `${baseUrl.replace(/\/$/, "")}/${loc.replace(/^\//, "")}` : loc,
      lastmod: TODAY,
      changefreq: defaultFreq,
      priority: defaultPrio,
      images: [],
    }));
    setUrls(prev => [...prev.filter(u => u.loc.trim()), ...newUrls]);
    setBulkText("");
    setShowBulk(false);
  }, [bulkText, baseUrl, defaultFreq, defaultPrio]);

  // Sitemap index
  const addIndex = () => setIndexes(i => [...i, { id: uid(), loc: "", lastmod: TODAY }]);
  const updateIndex = (id: string, loc: string, lastmod: string) =>
    setIndexes(prev => prev.map(x => x.id === id ? { ...x, loc, lastmod } : x));
  const removeIndex = (id: string) =>
    setIndexes(prev => prev.filter(x => x.id !== id));

  // Generated XML
  const xml = useMemo(() =>
    viewMode === "url-list"
      ? generateUrlsetXml(urls)
      : generateIndexXml(indexes),
    [viewMode, urls, indexes]
  );

  // Validation
  const validation = useMemo(() =>
    viewMode === "url-list" ? validateSitemap(urls, t) : [],
    [viewMode, urls, t]
  );

  const validUrls = urls.filter(u => u.loc.trim());
  const errors = validation.filter(v => v.type === "error");
  const warnings = validation.filter(v => v.type === "warning");
  const infos = validation.filter(v => v.type === "info");

  const download = () => {
    const fname = viewMode === "url-list" ? "sitemap.xml" : "sitemap-index.xml";
    const blob = new Blob([xml], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = fname; a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setUrls([{ id: uid(), loc: "", lastmod: TODAY, changefreq: defaultFreq, priority: defaultPrio, images: [] }]);
  };

  const applyToAll = (field: "lastmod" | "changefreq" | "priority", value: string) => {
    setUrls(prev => prev.map(u => ({ ...u, [field]: value })));
  };

  const FREQS: { v: ChangeFreq; l: string }[] = [
    { v: "always", l: "Always" }, { v: "hourly", l: "Hourly" }, { v: "daily", l: "Daily" },
    { v: "weekly", l: "Weekly" }, { v: "monthly", l: "Monthly" },
    { v: "yearly", l: "Yearly" }, { v: "never", l: "Never" },
  ];

  const PRIOS = ["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"];

  // Pre-built templates
  const TEMPLATES = [
    {
      label: t("templates.blog"),
      icon: "📝",
      urls: ["/", "/blog", "/about", "/contact", "/privacy-policy"].map((p, i) => ({
        id: uid(), loc: (baseUrl || "https://example.com") + p,
        lastmod: TODAY, changefreq: (["daily", "weekly", "monthly", "yearly", "never"] as ChangeFreq[])[i],
        priority: ["1.0", "0.8", "0.5", "0.5", "0.3"][i], images: [],
      })),
    },
    {
      label: t("templates.ecommerce"),
      icon: "🛒",
      urls: ["/", "/products", "/categories", "/about", "/contact", "/sitemap-products.xml"].map((p, i) => ({
        id: uid(), loc: (baseUrl || "https://example.com") + (p.endsWith(".xml") ? p : p),
        lastmod: TODAY, changefreq: (["daily", "daily", "weekly", "monthly", "monthly", "weekly"] as ChangeFreq[])[i],
        priority: ["1.0", "0.9", "0.8", "0.5", "0.5", "0.8"][i], images: [],
      })),
    },
    {
      label: t("templates.landingPage"),
      icon: "🏠",
      urls: ["/"].map(p => ({
        id: uid(), loc: (baseUrl || "https://example.com") + p,
        lastmod: TODAY, changefreq: "monthly" as ChangeFreq, priority: "1.0", images: [],
      })),
    },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/SitemapGeneratorTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/SitemapGeneratorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: URL builder ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
              {([
                { k: "url-list" as ViewMode, icon: FileText, label: t('mode.urlSitemap') },
                { k: "sitemap-index" as ViewMode, icon: Layers, label: t('mode.sitemapIndex') },
              ]).map(({ k, icon: Icon, label }) => (
                <button key={k} onClick={() => setViewMode(k)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${viewMode === k ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* ── URL Sitemap mode ── */}
            {viewMode === "url-list" && (
              <>
                {/* Templates */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t('templates.title')}</p>
                  <div className="flex gap-2 flex-wrap">
                    {TEMPLATES.map(tp => (
                      <button key={tp.label} onClick={() => setUrls(tp.urls)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-medium transition-all group">
                        <span>{tp.icon}</span>
                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{tp.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Global defaults + apply-all */}
                <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> {t('defaults.title')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{t('defaults.freq')}</span>
                      <select value={defaultFreq} onChange={e => setDefaultFreq(e.target.value as ChangeFreq)}
                        className="px-2 py-1.5 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all">
                        {FREQS.map(f => <option key={f.v} value={f.v}>{f.l}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{t('defaults.priority')}</span>
                      <select value={defaultPrio} onChange={e => setDefaultPrio(e.target.value)}
                        className="px-2 py-1.5 rounded-xl border border-border bg-card text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all">
                        {PRIOS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-[10px] text-muted-foreground">{t('defaults.applyToAll')}</span>
                      <button onClick={() => applyToAll("changefreq", defaultFreq)}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-[10px] font-bold transition-all">
                        {t('defaults.freq')}
                      </button>
                      <button onClick={() => applyToAll("priority", defaultPrio)}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-[10px] font-bold transition-all">
                        {t('defaults.priority')}
                      </button>
                      <button onClick={() => applyToAll("lastmod", TODAY)}
                        className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-[10px] font-bold transition-all">
                        {t('defaults.today')}
                      </button>
                    </div>
                  </div>

                  {/* Image sitemap toggle */}
                  <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                    <div>
                      <p className="text-xs font-medium text-foreground">{t('imageSitemap.title')}</p>
                      <p className="text-[10px] text-muted-foreground">{t('imageSitemap.desc')}</p>
                    </div>
                    <button onClick={() => setShowImages(p => !p)}
                      className={`relative shrink-0 rounded-full transition-colors ${showImages ? "bg-blue-500" : "bg-border"}`}
                      style={{ width: 36, height: 20 }}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${showImages ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                </div>

                {/* Base URL */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t('baseUrl.label')}</p>
                  <div className="flex items-center gap-0">
                    <span className="px-3 py-3 rounded-l-xl border border-r-0 border-border bg-muted/40 text-muted-foreground">
                      <Globe className="w-3.5 h-3.5" />
                    </span>
                    <input value={baseUrl} onChange={e => setBaseUrl(e.target.value)}
                      placeholder={t('baseUrl.placeholder')}
                      className="flex-1 px-4 py-3 rounded-r-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t('baseUrl.label')} />
                  </div>
                </div>

                {/* Bulk import */}
                <div>
                  <button onClick={() => setShowBulk(p => !p)}
                    className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors mb-2">
                    <Layers className="w-3.5 h-3.5" />
                    {showBulk ? "Hide" : "Show"} Bulk Import
                  </button>
                  {showBulk && (
                    <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm">
                      <p className="text-[10px] text-muted-foreground">
                        {t("bulkImport.desc")}
                      </p>
                      <textarea value={bulkText} onChange={e => setBulkText(e.target.value)}
                        placeholder={"/blog/post-1\n/blog/post-2\nhttps://example.com/page"}
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-xs font-mono resize-none focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
                      <div className="flex items-center gap-2">
                        <button onClick={importBulk} disabled={!bulkText.trim()}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-bold transition-all">
                          <Plus className="w-3.5 h-3.5" /> Import {bulkText.trim().split("\n").filter(Boolean).length} URLs
                        </button>
                        <button onClick={() => { setBulkText(""); setShowBulk(false); }}
                          className="px-3 py-2 rounded-xl border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* URL rows */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("urls.title")} <span className="font-normal text-muted-foreground/60">({validUrls.length} {t("urls.valid")})</span>
                    </p>
                    <div className="flex gap-2">
                      <button onClick={clearAll}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
                        <Trash2 className="w-3.5 h-3.5" /> {t("urls.clearAll")}
                      </button>
                      <button onClick={addUrl}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                        <Plus className="w-3.5 h-3.5" /> {t("urls.addUrl")}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
                    {urls.map((url, i) => (
                      <UrlRow key={url.id} url={url} index={i}
                        onChange={u => updateUrl(url.id, u)}
                        onRemove={() => removeUrl(url.id)}
                        showImages={showImages} t={t} />
                    ))}
                  </div>

                  <button onClick={addUrl}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-xs font-medium text-muted-foreground transition-all">
                    <Plus className="w-4 h-4" /> {t("urls.addAnother")}
                  </button>
                </div>
              </>
            )}

            {/* ── Sitemap Index mode ── */}
            {viewMode === "sitemap-index" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    {t("sitemapIndex.info")}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sitemap files</p>
                    <button onClick={addIndex}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                      <Plus className="w-3.5 h-3.5" />{t("sitemapIndex.addIndex")}
                    </button>
                  </div>

                  {indexes.map((idx, i) => (
                    <div key={idx.id} className="flex items-center gap-2 p-3.5 rounded-2xl border border-border bg-card shadow-sm">
                      <span className="text-[10px] font-bold text-muted-foreground/40 w-5 shrink-0 tabular-nums">{i + 1}</span>
                      <input value={idx.loc} onChange={e => updateIndex(idx.id, e.target.value, idx.lastmod)}
                        placeholder="https://example.com/sitemap-blog.xml"
                        className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label="Sitemap file URL" />
                      <input type="date" value={idx.lastmod} onChange={e => updateIndex(idx.id, idx.loc, e.target.value)}
                        className="px-2 py-2 rounded-xl border border-border bg-background text-foreground text-[10px] font-mono focus:outline-none focus:border-blue-400 transition-all w-32" aria-label="Last modified" />
                      <button onClick={() => removeIndex(idx.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Preview + Validation ── */}
          <div className="flex flex-col gap-5">

            {/* Validation */}
            {(errors.length > 0 || warnings.length > 0 || infos.length > 0) && (
              <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t("validation.title")}</p>
                {errors.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {v.msg}
                  </div>
                ))}
                {warnings.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {v.msg}
                  </div>
                ))}
                {infos.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {v.msg}
                  </div>
                ))}
                {errors.length === 0 && warnings.length === 0 && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t("validation.valid")}
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            {viewMode === "url-list" && validUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: t("stats.urls"), value: validUrls.length },
                  { label: t("stats.withImages"), value: urls.filter(u => u.images.some(Boolean)).length },
                  { label: t("stats.priorityOne"), value: validUrls.filter(u => u.priority === "1.0").length },
                  { label: t("stats.dailyPlus"), value: validUrls.filter(u => ["always", "hourly", "daily"].includes(u.changefreq)).length },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                    <span className="text-sm font-bold font-mono text-foreground">{value}</span>
                    <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Generated XML */}
            <GeneratedXML xml={xml} viewMode={viewMode} download={download} t={t} />

            {/* Submission tip */}
            <SubmissionTips />
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/SitemapGeneratorTool.json" count={4} />
        <FAQ tKey="seo-tools/SitemapGeneratorTool.json" />
        <Examples tKey="seo-tools/SitemapGeneratorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}