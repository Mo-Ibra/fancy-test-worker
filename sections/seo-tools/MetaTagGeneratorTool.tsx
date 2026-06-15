"use client";

import { useState, useMemo } from "react";
import {
  Twitter,
  Share2,
  Tag,
  Sparkles,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { ActiveTab, calcSeoScore, DEFAULTS, generateMetaTags, MetaConfig } from "@/funcs/seo-tools/MetaTagGeneratorToolFuncs";
import Field from "@/components/seo-tools/meta-tag-generator/Field";
import SerpPreview from "@/components/seo-tools/meta-tag-generator/SerpPreview";
import OGPreview from "@/components/seo-tools/meta-tag-generator/OGPreview";
import TwitterPreview from "@/components/seo-tools/meta-tag-generator/TwitterPreview";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import Tips from "@/components/seo-tools/meta-tag-generator/Tips";
import GeneratedCode from "@/components/seo-tools/meta-tag-generator/GeneratedCode";
import SEOScore from "@/components/seo-tools/meta-tag-generator/SEOScore";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function MetaTagGeneratorTool() {
  const t = useT("seo-tools/MetaTagGeneratorTool.json");

  const [config, setConfig] = useState<MetaConfig>(DEFAULTS);
  const [activeTab, setActiveTab] = useState<ActiveTab>("basic");
  const [syncOG, setSyncOG] = useState(true);
  const [syncTwitter, setSyncTwitter] = useState(true);

  const set = <K extends keyof MetaConfig>(k: K, v: MetaConfig[K]) => {
    setConfig(prev => {
      const next = { ...prev, [k]: v };
      // Auto-sync OG fields
      if (syncOG) {
        if (k === "title" && !prev.ogTitle) next.ogTitle = v as string;
        if (k === "description" && !prev.ogDescription) next.ogDescription = v as string;
        if (k === "canonical" && !prev.ogUrl) next.ogUrl = v as string;
      }
      // Auto-sync Twitter fields
      if (syncTwitter) {
        if (k === "title" && !prev.twitterTitle) next.twitterTitle = v as string;
        if (k === "description" && !prev.twitterDesc) next.twitterDesc = v as string;
      }
      return next;
    });
  };

  const generatedCode = useMemo(() => generateMetaTags(config), [config]);
  const { score, checks } = useMemo(() => calcSeoScore(config, t), [config, t]);

  const resetAll = () => setConfig(DEFAULTS);

  const TABS: { key: ActiveTab; icon: React.ElementType; label: string }[] = [
    { key: "basic", icon: Tag, label: t("tabs.basic") },
    { key: "og", icon: Share2, label: t("tabs.og") },
    { key: "twitter", icon: Twitter, label: t("tabs.twitter") },
    { key: "advanced", icon: Sparkles, label: t("tabs.advanced") },
  ];

  const OG_TYPES = ["website", "article", "product", "book", "profile", "video.movie", "music.song"];
  const TWITTER_CARDS = ["summary", "summary_large_image", "app", "player"];
  const ROBOTS_PRESETS = [
    { label: t("advanced.indexFollow"), value: "index, follow" },
    { label: t("advanced.noindexFollow"), value: "noindex, follow" },
    { label: t("advanced.indexNofollow"), value: "index, nofollow" },
    { label: t("advanced.noindexNofollow"), value: "noindex, nofollow" },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/MetaTagGeneratorTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/MetaTagGeneratorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Form (3 cols) ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Tab bar */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card shadow-sm">
              {TABS.map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* ── Basic SEO ── */}
            {activeTab === "basic" && (
              <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
                <Field label={t("basic.pageTitle")} value={config.title} onChange={v => set("title", v)}
                  placeholder={t("basic.titlePlaceholder")}
                  minChars={50} maxChars={60} warnChars={70}
                  hint={t("tips.titleLength")} />

                <Field label={t("basic.metaDescription")} value={config.description} onChange={v => set("description", v)}
                  placeholder={t("basic.descriptionPlaceholder")}
                  minChars={150} maxChars={160} warnChars={180} textarea rows={3}
                  hint={t("tips.descriptionLength")} />

                <Field label={t("basic.keywords")} value={config.keywords} onChange={v => set("keywords", v)}
                  placeholder={t("basic.keywordsPlaceholder")} />

                <Field label={t("basic.author")} value={config.author} onChange={v => set("author", v)}
                  placeholder={t("basic.authorPlaceholder")} />

                <Field label={t("basic.canonicalURL")} value={config.canonical} onChange={v => set("canonical", v)}
                  placeholder={t("basic.urlPlaceholder")} type="url" mono />

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("basic.language")}</p>
                  <input value={config.language} onChange={e => set("language", e.target.value)}
                    placeholder={t("basic.languagePlaceholder")}
                    className="w-24 px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all" aria-label={t("basic.language")} />
                </div>
              </div>
            )}

            {/* ── Open Graph ── */}
            {activeTab === "og" && (
              <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10">
                  <div>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{t("basic.autoSync")}</p>
                    <p className="text-[10px] text-muted-foreground">{t("basic.autoSyncHint")}</p>
                  </div>
                  <button onClick={() => setSyncOG(p => !p)}
                    className={`relative shrink-0 rounded-full transition-colors ${syncOG ? "bg-blue-500" : "bg-border"}`}
                    style={{ width: 36, height: 20 }}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${syncOG ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>

                <Field label={t("og.ogTitle")} value={config.ogTitle} onChange={v => set("ogTitle", v)}
                  placeholder={config.title || t("og.ogTitlePlaceholder")}
                  maxChars={95} minChars={1} warnChars={110} />

                <Field label={t("og.ogDescription")} value={config.ogDescription} onChange={v => set("ogDescription", v)}
                  placeholder={config.description || t("og.ogDescriptionPlaceholder")}
                  maxChars={200} minChars={1} warnChars={250} textarea rows={3} />

                <Field label={t("og.ogImage")} value={config.ogImage} onChange={v => set("ogImage", v)}
                  placeholder={t("og.ogImagePlaceholder")} type="url" mono
                  hint={t("og.ogImageHint")} />

                <Field label={t("og.ogUrl")} value={config.ogUrl} onChange={v => set("ogUrl", v)}
                  placeholder={config.canonical || t("og.ogUrlPlaceholder")} type="url" mono />

                <Field label={t("og.ogSiteName")} value={config.ogSiteName} onChange={v => set("ogSiteName", v)}
                  placeholder={t("og.ogSiteNamePlaceholder")} />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("og.ogType")}</p>
                    <select value={config.ogType} onChange={e => set("ogType", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all">
                      {OG_TYPES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("og.ogLocale")}</p>
                    <input value={config.ogLocale} onChange={e => set("ogLocale", e.target.value)}
                      placeholder={t("og.ogLocalePlaceholder")}
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all" aria-label={t("og.ogLocale")} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Twitter Card ── */}
            {activeTab === "twitter" && (
              <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10">
                  <div>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{t("twitter.autoSync")}</p>
                    <p className="text-[10px] text-muted-foreground">{t("twitter.autoSyncHint")}</p>
                  </div>
                  <button onClick={() => setSyncTwitter(p => !p)}
                    className={`relative shrink-0 rounded-full transition-colors ${syncTwitter ? "bg-blue-500" : "bg-border"}`}
                    style={{ width: 36, height: 20 }}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${syncTwitter ? "translate-x-4" : "translate-x-0.5"}`} />
                  </button>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("twitter.cardType")}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {TWITTER_CARDS.map(card => (
                      <button key={card} onClick={() => set("twitterCard", card)}
                        className={`py-2.5 px-3 rounded-xl border text-[10px] font-bold text-left transition-all ${config.twitterCard === card
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-border bg-card text-muted-foreground hover:border-blue-200"
                          }`}>{card}</button>
                    ))}
                  </div>
                </div>

                <Field label={t("twitter.twitterTitle")} value={config.twitterTitle} onChange={v => set("twitterTitle", v)}
                  placeholder={config.ogTitle || config.title || t("twitter.twitterTitlePlaceholder")}
                  maxChars={70} minChars={1} warnChars={80} />

                <Field label={t("twitter.twitterDesc")} value={config.twitterDesc} onChange={v => set("twitterDesc", v)}
                  placeholder={config.ogDescription || config.description || t("twitter.twitterDescPlaceholder")}
                  maxChars={200} minChars={1} warnChars={250} textarea rows={3} />

                <Field label={t("twitter.twitterImage")} value={config.twitterImage} onChange={v => set("twitterImage", v)}
                  placeholder={config.ogImage || t("twitter.twitterImagePlaceholder")}
                  type="url" mono hint={t("twitter.twitterImageHint")} />

                <div className="grid grid-cols-2 gap-3">
                  <Field label={t("twitter.siteHandle")} value={config.twitterSite} onChange={v => set("twitterSite", v)}
                    placeholder="@YourSite" />
                  <Field label={t("twitter.creatorHandle")} value={config.twitterCreator} onChange={v => set("twitterCreator", v)}
                    placeholder="@author" />
                </div>
              </div>
            )}

            {/* ── Advanced ── */}
            {activeTab === "advanced" && (
              <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("advanced.robotsPresets")}</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {ROBOTS_PRESETS.map(r => (
                      <button key={r.value}
                        onClick={() => {
                          set("noindex", r.value.includes("noindex"));
                          set("nofollow", r.value.includes("nofollow"));
                        }}
                        className={`py-2 px-3 rounded-xl border text-[10px] font-bold transition-all text-left ${((config.noindex ? "noindex" : "index") + ", " + (config.nofollow ? "nofollow" : "follow")) === r.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "border-border bg-card text-muted-foreground hover:border-blue-200"
                          }`}>{r.label}</button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { key: "noarchive" as keyof MetaConfig, label: t("advanced.noarchive"), desc: t("advanced.noarchiveDesc") },
                      { key: "nosnippet" as keyof MetaConfig, label: t("advanced.nosnippet"), desc: t("advanced.nosnippetDesc") },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-mono text-foreground">{label}</p>
                          <p className="text-[10px] text-muted-foreground">{desc}</p>
                        </div>
                        <button onClick={() => set(key, !config[key])}
                          className={`relative shrink-0 rounded-full transition-colors ${config[key] ? "bg-blue-500" : "bg-border"}`}
                          style={{ width: 36, height: 20 }}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${config[key] ? "translate-x-4" : "translate-x-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("advanced.themeColor")}</p>
                  <div className="flex items-center gap-3">
                    <input type="color" value={config.themeColor} onChange={e => set("themeColor", e.target.value)}
                      className="w-10 h-10 rounded-xl border border-border cursor-pointer" aria-label={t("advanced.themeColor")} />
                    <input type="text" value={config.themeColor} onChange={e => set("themeColor", e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all" aria-label={t("advanced.themeColor")} />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("advanced.charset")}</p>
                  <div className="flex gap-2">
                    {["UTF-8", "ISO-8859-1"].map(c => (
                      <button key={c} onClick={() => set("charset", c)}
                        className={`px-3 py-2 rounded-xl border text-xs font-bold font-mono transition-all ${config.charset === c ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                          }`}>{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Previews ── */}
            <SerpPreview
              title={config.title}
              description={config.description}
              url={config.canonical || config.ogUrl}
              t={t}
            />

            {activeTab === "og" || activeTab === "basic" ? (
              <OGPreview
                title={config.ogTitle || config.title}
                description={config.ogDescription || config.description}
                image={config.ogImage}
                url={config.ogUrl || config.canonical}
                siteName={config.ogSiteName}
                type={config.ogType}
                t={t}
              />
            ) : activeTab === "twitter" ? (
              <TwitterPreview
                card={config.twitterCard}
                title={config.twitterTitle || config.ogTitle || config.title}
                description={config.twitterDesc || config.ogDescription || config.description}
                image={config.twitterImage || config.ogImage}
                site={config.twitterSite}
                t={t}
              />
            ) : null}
          </div>

          {/* ── Right: Score + Code (2 cols) ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* SEO Score */}
            <SEOScore score={score} checks={checks} />

            {/* Generated code */}
            <GeneratedCode generatedCode={generatedCode} resetAll={resetAll} t={t} />

            {/* Tips */}
            <Tips />
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/MetaTagGeneratorTool.json" count={4} />
        <FAQ tKey="seo-tools/MetaTagGeneratorTool.json" />
        <Examples tKey="seo-tools/MetaTagGeneratorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}