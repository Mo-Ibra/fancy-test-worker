import { AlertCircle } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function Rules() {
  const t = useT("seo-tools/HreflangGeneratorTool.json");
  const rules = t.raw("rules.items") as string[];

  return (
    <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
        <AlertCircle className="w-3.5 h-3.5" /> {t("rules.title")}
      </p>
      <div className="flex flex-col gap-1.5 text-[10px] text-amber-700 dark:text-amber-300">
        {Array.isArray(rules) && rules.map((r, i) => (
          <p key={i} className="flex items-start gap-1.5">
            <span className="shrink-0 font-bold">{i + 1}.</span> {r}
          </p>
        ))}
      </div>
    </div>
  )
}