import { Lightbulb } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function ReadabilityTips() {
  const t = useT("seo-tools/ReadabilityCheckerTool.json");
  const tips = t("writingTips.list", { returnObjects: true }) as unknown as string[];

  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> {t("writingTips.title")}
      </p>
      <div className="flex flex-col gap-2 text-[10px] text-muted-foreground">
        {Array.isArray(tips) && tips.map((tip, i) => (
          <p key={i} className="flex items-start gap-1.5">
            <span className="text-blue-400 shrink-0 mt-0.5">›</span> {tip}
          </p>
        ))}
      </div>
    </div>
  );
}