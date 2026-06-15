import { useT } from "@/context/TranslationProvider";
import DensityBadge from "./DensityBadge";

export default function TopKeywordsSummary({ keywords }: { keywords: any[] }) {
  const t = useT("seo-tools/KeywordDensityCheckerTool.json");
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("topKeywords.top5NonStop")}</p>
      <div className="flex flex-col gap-1.5">
        {keywords
          .filter(k => !k.isStopWord)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map((k, i) => (
            <div key={k.word} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card">
              <span className="text-[10px] font-bold text-muted-foreground/40 w-4">{i + 1}</span>
              <code className="text-xs font-mono font-bold text-foreground flex-1">{k.word}</code>
              <span className="text-[10px] text-muted-foreground">{k.count}×</span>
              <DensityBadge density={k.density} isStop={false} />
            </div>
          ))}
      </div>
    </div>
  )
}