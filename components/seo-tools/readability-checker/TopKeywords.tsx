import { useT } from "@/context/TranslationProvider";

export default function TopKeywords({ topKws }: { topKws: { word: string; count: number }[] }) {
  const t = useT("seo-tools/ReadabilityCheckerTool.json");
  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("topKeywords.desc")}</p>
      <div className="flex flex-col gap-1.5">
        {topKws.map(({ word, count }) => {
          const pct = Math.min(100, (count / (topKws[0]?.count ?? 1)) * 100);
          return (
            <div key={word} className="flex items-center gap-3">
              <code className="text-xs font-mono font-bold text-foreground w-24 shrink-0 truncate">{word}</code>
              <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground w-8 text-right shrink-0">{t("topKeywords.count", { count })}</span>
            </div>
          );
        })}
      </div>
    </div>
  )
}