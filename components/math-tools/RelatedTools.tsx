import { useLang, useT } from "@/context/TranslationProvider";
import { getLocalizedPath } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";

export default function RelatedTools() {
  const t = useT("math-tools/RelatedTools.json");
  const lang = useLang();
  const isAr = lang === "ar";

  return (
    <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("related.title")}</p>
      <div className="flex flex-wrap gap-3">
        {[
          { label: t("related.unitConverter"), href: getLocalizedPath('/math-tools/unit-converter', lang) },
          { label: t("related.percentage"), href: getLocalizedPath('/math-tools/percentage-calculator', lang) },
          { label: t("related.age"), href: getLocalizedPath('/math-tools/age-calculator', lang) },
          { label: t("related.dateDiff"), href: getLocalizedPath('/math-tools/date-difference', lang) },
          { label: t("related.average"), href: getLocalizedPath('/math-tools/average-calculator', lang) },
        ].map(({ label, href }) => (
          <Link key={label} href={href}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-500 text-sm font-medium text-foreground transition-all duration-200">
            <Calculator className="w-3.5 h-3.5 text-muted-foreground group-hover:text-amber-500 transition-colors" />
            {label}
            {isAr ? <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" /> : <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />}
          </Link>
        ))}
      </div>
    </div>
  )
}