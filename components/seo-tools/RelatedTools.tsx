import { useLang, useT } from "@/context/TranslationProvider";
import { getLocalizedPath } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

export default function RelatedTools() {
  const t = useT("seo-tools/RelatedTools.json");
  const lang = useLang();
  const isAr = lang === "ar";

  const tools = [
    { label: t("related.metaGenerator"), href: getLocalizedPath('/seo-tools/meta-generator', lang) },
    { label: t("related.ogPreviewer"), href: getLocalizedPath('/seo-tools/og-previewer', lang) },
    { label: t("related.serpPreview"), href: getLocalizedPath('/seo-tools/serp-preview', lang) },
    { label: t("related.robotsGenerator"), href: getLocalizedPath('/seo-tools/robots-generator', lang) },
    { label: t("related.sitemapGenerator"), href: getLocalizedPath('/seo-tools/sitemap-generator', lang) },
    { label: t("related.canonicalGenerator"), href: getLocalizedPath('/seo-tools/canonical-tag-generator', lang) },
    { label: t("related.schemaGenerator"), href: getLocalizedPath('/seo-tools/schema-markup-generator', lang) },
    { label: t("related.hreflangGenerator"), href: getLocalizedPath('/seo-tools/hreflang-generator', lang) },
    { label: t("related.keywordDensity"), href: getLocalizedPath('/seo-tools/keyword-density-checker', lang) },
    { label: t("related.slugGenerator"), href: getLocalizedPath('/seo-tools/slug-generator', lang) },
    { label: t("related.characterCounter"), href: getLocalizedPath('/seo-tools/character-counter-seo', lang) },
    { label: t("related.wordFrequency"), href: getLocalizedPath('/seo-tools/word-frequency-counter', lang) },
    { label: t("related.readability"), href: getLocalizedPath('/seo-tools/readability-checker', lang) },
    { label: t("related.headingAnalyzer"), href: getLocalizedPath('/seo-tools/heading-structure-analyzer', lang) },
  ];

  return (
    <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("related.title")}</p>
      <div className="flex flex-wrap gap-3">
        {tools.map(({ label, href }) => (
          <Link key={label} href={href}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-sm font-medium text-foreground transition-all duration-200">
            <Search className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            {label}
            {isAr ? <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" /> : <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />}
          </Link>
        ))}
      </div>
    </div>
  );
}