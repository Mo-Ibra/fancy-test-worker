import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLang, useT } from "@/context/TranslationProvider";
import { getLocalizedPath } from "@/lib/i18n";

export default function RelatedTools() {
  const t = useT("security-tools/RelatedTools.json");
  const lang = useLang();
  const isAr = lang === "ar";
  return (
    <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("related.title")}</p>
      <div className={`flex flex-wrap gap-3 ${isAr ? "flex-row-reverse" : ""}`}>
        {[
          { label: t("related.passwordGenerator"), href: getLocalizedPath('/security-tools/password-generator', lang) },
          { label: t("related.passwordStrengthChecker"), href: getLocalizedPath('/security-tools/password-strength-checker', lang) },
          { label: t("related.md5HashGenerator"), href: getLocalizedPath('/security-tools/md5-hash-generator', lang) },
          { label: t("related.bcrypt"), href: getLocalizedPath('/security-tools/bcrypt', lang) },
        ].map(({ label, href }) => (
          <Link key={label} href={href}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background hover:border-emerald-300 dark:hover:border-emerald-700 hover:text-emerald-600 text-sm font-medium text-foreground transition-all duration-200">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
            {label}
            {isAr ? <ArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" /> : <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />}
          </Link>
        ))}
      </div>
    </div>
  )
}