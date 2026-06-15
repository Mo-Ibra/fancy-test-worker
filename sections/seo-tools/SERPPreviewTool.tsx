"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Star,
  Link,
  Sparkles,
  BookOpen,
  ShoppingBag,
  Play,
  Code2,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import { ResultType, Device, SerpData } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import SerpMockup from "@/components/seo-tools/serp-preview/SerpMockup";
import { DEFAULTS } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import { TITLE_MAX, TITLE_WARN, DESC_MAX, DESC_WARN } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import { getBarColor, getCharColor } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import Field from "@/components/seo-tools/serp-preview/Field";
import SEOTips from "@/components/seo-tools/serp-preview/SEOTips";
import CharacterAnalysis from "@/components/seo-tools/serp-preview/CharacterAnalysis";
import DeviceToggle from "@/components/seo-tools/serp-preview/DeviceToggle";
import SiteLinks from "@/components/seo-tools/serp-preview/SiteLinks";
import CopyButton from "@/components/seo-tools/serp-preview/CopyButton";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

const RESULT_TYPES: { key: ResultType; labelKey: string; icon: React.ElementType }[] = [
  { key: "organic", labelKey: "organic", icon: Search },
  { key: "rich-review", labelKey: "reviews", icon: Star },
  { key: "rich-product", labelKey: "product", icon: ShoppingBag },
  { key: "rich-recipe", labelKey: "recipe", icon: Sparkles },
  { key: "rich-faq", labelKey: "faq", icon: BookOpen },
  { key: "rich-video", labelKey: "video", icon: Play },
  { key: "rich-event", labelKey: "event", icon: Link },
];

export default function SERPPreviewTool() {
  const t = useT("seo-tools/SERPPreviewTool.json");

  const [data, setData] = useState<SerpData>(DEFAULTS);
  const [device, setDevice] = useState<Device>("desktop");

  const set = <K extends keyof SerpData>(k: K, v: SerpData[K]) =>
    setData(prev => ({ ...prev, [k]: v }));

  const titleLen = data.title.length;
  const descLen = data.description.length;

  const metaTagCode = useMemo(() => {
    const lines: string[] = [];
    if (data.title) lines.push(`<title>${data.title}</title>`);
    if (data.description) lines.push(`<meta name="description" content="${data.description}">`);
    if (data.url) lines.push(`<link rel="canonical" href="${data.url}">`);
    return lines.join("\n");
  }, [data.title, data.description, data.url]);

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">
      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/SERPPreviewTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/SERPPreviewTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Controls ── */}
          <div className="flex flex-col gap-5">

            {/* Core SEO fields */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">{t("labels.coreSeo")}</p>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("input.title")}</label>
                  <span className={`text-[10px] font-mono font-bold ${getCharColor(titleLen, TITLE_WARN, TITLE_MAX)}`}>{titleLen}/{TITLE_MAX}</span>
                </div>
                <input value={data.title} onChange={e => set("title", e.target.value)}
                  placeholder={t("input.titlePlaceholder")}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("input.title")} />
                <div className="w-full h-0.5 rounded-full bg-border overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${getBarColor(titleLen, TITLE_WARN, TITLE_MAX)}`}
                    style={{ width: `${Math.min(100, (titleLen / 80) * 100)}%` }} />
                </div>
                <p className={`text-[9px] font-medium ${getCharColor(titleLen, TITLE_WARN, TITLE_MAX)}`}>
                  {titleLen === 0 ? t("status.idealTitle")
                    : titleLen < 30 ? t("status.tooShort")
                      : titleLen <= TITLE_WARN ? t("status.goodLength")
                        : titleLen <= TITLE_MAX ? t("status.gettingLong")
                          : t("status.tooLongTruncated", { count: titleLen - TITLE_MAX })}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("input.description")}</label>
                  <span className={`text-[10px] font-mono font-bold ${getCharColor(descLen, DESC_WARN, DESC_MAX)}`}>{descLen}/{DESC_MAX}</span>
                </div>
                <textarea value={data.description} onChange={e => set("description", e.target.value)}
                  placeholder={t("input.descriptionPlaceholder")}
                  rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
                <div className="w-full h-0.5 rounded-full bg-border overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${getBarColor(descLen, DESC_WARN, DESC_MAX)}`}
                    style={{ width: `${Math.min(100, (descLen / 200) * 100)}%` }} />
                </div>
                <p className={`text-[9px] font-medium ${getCharColor(descLen, DESC_WARN, DESC_MAX)}`}>
                  {descLen === 0 ? t("status.idealDesc")
                    : descLen < 70 ? t("status.tooShort")
                      : descLen <= DESC_WARN ? t("status.goodLength")
                        : descLen <= DESC_MAX ? t("status.nearLimit")
                          : t("status.tooLong", { count: descLen - DESC_MAX })}
                </p>
              </div>

              <Field label={t("input.url")} value={data.url} onChange={v => set("url", v)} placeholder={t("input.urlPlaceholder")} mono hint="Used to generate the breadcrumb path" />
              <Field label={t("input.breadcrumb")} value={data.breadcrumb} onChange={v => set("breadcrumb", v)} placeholder={t("input.breadcrumbPlaceholder")} mono hint="Override auto-generated breadcrumb" />
              <Field label={t("input.favicon")} value={data.faviconUrl} onChange={v => set("faviconUrl", v)} placeholder={t("input.faviconPlaceholder")} mono />
              <Field label={t("input.searchQuery")} value={data.searchQuery} onChange={v => set("searchQuery", v)} placeholder={t("input.searchQueryPlaceholder")} hint="Query terms are bolded in the preview" />

              <div className="flex items-center justify-between gap-3 pt-1">
                <div>
                  <p className="text-xs font-medium text-foreground">{t("input.showPublishDate")}</p>
                  <p className="text-[10px] text-muted-foreground">{t("input.publishDateHint")}</p>
                </div>
                <button onClick={() => set("showDate", !data.showDate)}
                  className={`relative shrink-0 rounded-full transition-colors ${data.showDate ? "bg-blue-500" : "bg-border"}`} style={{ width: 36, height: 20 }}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.showDate ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
              {data.showDate && <Field label={t("labels.publishDate")} value={data.publishDate} onChange={v => set("publishDate", v)} type="date" />}
            </div>

            {/* Result type */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("richResult.title")}</p>
              <div className="grid grid-cols-2 gap-1.5">
                {RESULT_TYPES.map(({ key, labelKey, icon: Icon }) => (
                  <button key={key} onClick={() => set("resultType", key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${data.resultType === key
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-blue-200"
                      }`}>
                    <Icon className="w-3.5 h-3.5 shrink-0" /> {t(`resultTypes.${labelKey}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Rich result options */}
            {data.resultType !== "organic" && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
                  {data.resultType === "rich-review" && t("richResult.reviewSettings")}
                  {data.resultType === "rich-product" && t("richResult.productSettings")}
                  {data.resultType === "rich-recipe" && t("richResult.recipeSettings")}
                  {data.resultType === "rich-faq" && t("richResult.faqSettings")}
                  {data.resultType === "rich-video" && t("richResult.videoSettings")}
                  {data.resultType === "rich-event" && t("richResult.eventSettings")}
                </p>

                {(data.resultType === "rich-review" || data.resultType === "rich-product") && (
                  <>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("labels.rating", { value: data.ratingValue })}</label>
                      <input type="range" min={1} max={5} step={0.5} value={parseFloat(data.ratingValue) || 4.5} aria-label={t("labels.rating", { value: data.ratingValue })}
                        onChange={e => set("ratingValue", e.target.value)}
                        className="w-full h-2 rounded-full appearance-none bg-border accent-amber-400 cursor-pointer" />
                    </div>
                    <Field label={t("richResult.reviewCount")} value={data.ratingCount} onChange={v => set("ratingCount", v)} placeholder="128" />
                    {data.resultType === "rich-product" && (
                      <>
                        <div className="grid grid-cols-2 gap-2">
                          <Field label="Price" value={data.productPrice} onChange={v => set("productPrice", v)} placeholder="29.99" />
                          <Field label="Currency" value={data.productCurrency} onChange={v => set("productCurrency", v)} placeholder="USD" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Availability</label>
                          <select value={data.productAvail} onChange={e => set("productAvail", e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all">
                            {["InStock", "OutOfStock", "PreOrder"].map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                      </>
                    )}
                  </>
                )}

                {data.resultType === "rich-recipe" && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <Field label={t("richResult.cookTime")} value={data.cookTime} onChange={v => set("cookTime", v)} placeholder="30 min" />
                      <Field label={t("richResult.calories")} value={data.calories} onChange={v => set("calories", v)} placeholder="320 cal" />
                      <Field label={t("richResult.yield")} value={data.recipeYield} onChange={v => set("recipeYield", v)} placeholder="4 servings" />
                    </div>
                  </>
                )}

                {data.resultType === "rich-faq" && (
                  <div className="flex flex-col gap-2">
                    {data.faqItems.map((item, i) => (
                      <div key={i} className="flex flex-col gap-1 p-2 rounded-xl border border-border bg-background">
                        <input value={item.q} onChange={e => set("faqItems", data.faqItems.map((x, j) => j === i ? { ...x, q: e.target.value } : x))}
                          placeholder={t("labels.question", { count: i + 1 })}
                          className="px-2 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("labels.question", { count: i + 1 })} />
                        <textarea value={item.a} onChange={e => set("faqItems", data.faqItems.map((x, j) => j === i ? { ...x, a: e.target.value } : x))}
                          placeholder={t("labels.answer")} rows={2}
                          className="px-2 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs resize-none focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
                      </div>
                    ))}
                  </div>
                )}

                {data.resultType === "rich-video" && (
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Duration" value={data.videoDuration} onChange={v => set("videoDuration", v)} placeholder="5:30" />
                    <Field label="Date" value={data.videoDate} onChange={v => set("videoDate", v)} type="date" />
                  </div>
                )}

                {data.resultType === "rich-event" && (
                  <>
                    <Field label={t("richResult.eventDate")} value={data.eventDate} onChange={v => set("eventDate", v)} type="date" />
                    <Field label={t("richResult.location")} value={data.eventLocation} onChange={v => set("eventLocation", v)} placeholder="New York, NY" />
                  </>
                )}
              </div>
            )}

            {/* Sitelinks */}
            <SiteLinks data={data} set={set} t={t} />
          </div>

          {/* ── Right: Preview ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Device toggle */}
            <DeviceToggle device={device} setDevice={setDevice} t={t} />

            {/* SERP preview */}
            <div className={`${device === "mobile" ? "flex justify-center" : ""}`}>
              <SerpMockup d={data} device={device} />
            </div>

            {/* Character analysis */}
            <CharacterAnalysis titleLen={titleLen} descLen={descLen} />

            {/* Generated meta tags */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                <Code2 className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("metaTags.title")}</span>
                <CopyButton text={metaTagCode} />
              </div>
              <pre className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950 dark:bg-black/40">
                <code className="text-slate-300">{metaTagCode || t("labels.placeholder")}</code>
              </pre>
            </div>

            {/* SEO tips */}
            <SEOTips />
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/SERPPreviewTool.json" count={4} />
        <FAQ tKey="seo-tools/SERPPreviewTool.json" />
        <Examples tKey="seo-tools/SERPPreviewTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}