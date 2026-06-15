import { Info } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function Tips() {
  const t = useT("seo-tools/MetaTagGeneratorTool.json");
  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-blue-400" /> {t("tips.quickTips")}
      </p>
      <div className="flex flex-col gap-2 text-[10px] text-muted-foreground">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <p key={i} className="flex items-start gap-1.5">
            <span className="text-blue-400 shrink-0 mt-0.5">›</span> {t(`tips.tips.${i}`)}
          </p>
        ))}
      </div>
    </div>
  )
}