import { ArrowLeft, ArrowRight, Type } from "lucide-react";
import Link from "next/link";
import { useLang, useT } from "@/context/TranslationProvider";
import { getLocalizedPath } from "@/lib/i18n";

export default function RelatedTools() {
  const t = useT("text-tools/RelatedTools.json");
  const lang = useLang();
  const isAr = lang === "ar";
  return (
    <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("related.title")}</p>
      <div className="flex flex-wrap gap-3">
        {[
          { label: t("related.wordCounter"), href: getLocalizedPath('/text-tools/word-counter', lang) },
          { label: t("related.diffChecker"), href: getLocalizedPath('/text-tools/diff', lang) },
          { label: t("related.slugGenerator"), href: getLocalizedPath('/text-tools/slug-generator', lang) },
          { label: t("related.textRepeater"), href: getLocalizedPath('/text-tools/text-repeater', lang) },
          { label: t("related.removeFormatting"), href: getLocalizedPath('/text-tools/remove-formatting', lang) },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-sm font-medium text-foreground transition-all duration-200"
          >
            <Type className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            {label}
            {isAr ? <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" /> : <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />}
          </Link>
        ))}
      </div>
    </div>
  )
}