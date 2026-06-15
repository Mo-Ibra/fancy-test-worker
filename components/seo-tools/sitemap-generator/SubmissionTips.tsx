import { Info } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function SubmissionTips() {
  const t = useT("seo-tools/SitemapGeneratorTool.json");
  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-blue-400" /> {t("tips.title")}
      </p>
      <div className="flex flex-col gap-2 text-[10px] text-muted-foreground">
        {Array.isArray(t.raw("tips.list")) && (t.raw("tips.list") as string[]).map((tip, i) => (
          <p key={i} className="flex items-start gap-1.5">
            <span className="text-blue-400 shrink-0">›</span> {tip}
          </p>
        ))}
      </div>
    </div>
  )
}