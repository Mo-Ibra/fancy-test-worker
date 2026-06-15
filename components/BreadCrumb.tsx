import { useLang, useT } from "@/context/TranslationProvider";
import { getLocalizedPath } from "@/lib/i18n";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NextLink from "next/link";

export default function BreadCrumb({ tKey, href }: { tKey: string, href: string }) {
  const t = useT(tKey);
  const lang = useLang();
  const isAr = lang === "ar";
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
      <NextLink href={getLocalizedPath('/tools', lang)} className="hover:text-blue-500 transition-colors">{t("breadcrumb.allTools")}</NextLink>
      {isAr ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      <NextLink href={getLocalizedPath(href, lang)} className="hover:text-blue-500 transition-colors">{t("breadcrumb.toolTitle")}</NextLink>
      {isAr ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      <span className="text-foreground font-medium">{t("header.title")}</span>
    </div>
  )
}