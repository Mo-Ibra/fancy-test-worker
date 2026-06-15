import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

export default function Header({ tKey }: { tKey: string }) {
  const t = useTranslations(tKey.replace('.json', '').replace(/\//g, '.'));
  return (
    <div className="mb-8">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 mb-4">
        <Search className="w-3.5 h-3.5 text-blue-500" />
        <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">{t("header.badge")}</span>
      </div>
      <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-2">{t("header.title")}</h1>
      <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
        {t("header.description")}
      </p>
    </div>
  )
}