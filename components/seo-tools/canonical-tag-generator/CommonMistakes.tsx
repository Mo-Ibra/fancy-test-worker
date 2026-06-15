import { useT } from "@/context/TranslationProvider";
import { AlertCircle } from "lucide-react";

export default function CommonMistakes() {
  const t = useT("seo-tools/CanonicalTagGeneratorTool.json");
  return (
    <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5" /> {t("mistakes.title")}
      </p>
      <div className="flex flex-col gap-2 text-[10px] text-amber-700 dark:text-amber-300">
        {[
          t("mistakes.redirectChain"),
          t("mistakes.relativeUrls"),
          t("mistakes.noindexPage"),
          t("mistakes.mismatchedHreflang"),
          t("mistakes.inBody"),
        ].map((item, i) => (
          <p key={i} className="flex items-start gap-1.5">
            <span className="shrink-0">✗</span> {item}
          </p>
        ))}
      </div>
    </div>
  )
}