import { useTranslations, useLocale } from "next-intl";
import { getLocalizedPath } from "@/lib/i18n";
import { ArrowLeft, ArrowRight, Code2 } from "lucide-react";
import Link from "next/link";

export default function RelatedTools() {
  const t = useTranslations("dev-tools.RelatedTools");
  const locale = useLocale();
  const isAr = locale === "ar";
  return (
    <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("related.title")}</p>
      <div className="flex flex-wrap gap-3">
        {[
          { label: t("related.jsonFormatter"), href: getLocalizedPath('/dev-tools/json-formatter', locale) },
          { label: t("related.jsonDiff"), href: getLocalizedPath('/dev-tools/json-diff', locale) },
          { label: t("related.csvToJson"), href: getLocalizedPath('/dev-tools/csv-to-json', locale) },
          { label: t("related.regexTester"), href: getLocalizedPath('/dev-tools/regex-tester', locale) },
          { label: t("related.jwtDecoder"), href: getLocalizedPath('/dev-tools/jwt-decoder', locale) },
        ].map(({ label, href }) => (
          <Link key={label} href={href}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-sm font-medium text-foreground transition-all duration-200">
            <Code2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
            {label}
            {isAr ? <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" /> : <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />}
          </Link>
        ))}
      </div>
    </div>
  )
}