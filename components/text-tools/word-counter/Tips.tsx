import { useT } from "@/context/TranslationProvider";

export default function Tips({ stats }: { stats: any }) {
  const t = useT("text-tools/WordCounterTool.json");
  return (
    <div className="mt-10 p-6 rounded-2xl border border-border bg-card">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("tips.title")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("tips.twitter"), value: "280 chars", current: stats.characters, limit: 280 },
          { label: t("tips.linkedin"), value: "3,000 chars", current: stats.characters, limit: 3000 },
          { label: t("tips.meta"), value: "160 chars", current: stats.characters, limit: 160 },
          { label: t("tips.pageTitle"), value: "60 chars", current: stats.characters, limit: 60 },
        ].map(({ label, value, current, limit }) => {
          const over = current > limit;
          return (
            <div key={label} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${over
                  ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  }`}>
                  {over ? t("tips.over") : t("tips.ok")}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${over ? "bg-red-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(100, (current / limit) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{t("tips.limit")} {value}</span>
            </div>
          );
        })}
      </div>
    </div>
  )
}