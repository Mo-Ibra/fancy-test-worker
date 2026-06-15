import { DateDiff } from "@/funcs/math-tools/DateDifferenceToolFuncs";
import { Zap } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function WorkingDays({ diff }: { diff: DateDiff }) {
  const t = useT("math-tools/DateDifferenceTool.json");
  return (
    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-amber-400" /> {t("workingDays.title")}
      </p>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center py-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10">
          <span className="text-2xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {diff.workingDays.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground mt-1">{t("workingDaysLabel")}</span>
          <span className="text-[9px] text-muted-foreground/60">{t("monFri")}</span>
        </div>
        <div className="flex flex-col items-center py-4 rounded-xl border border-border bg-card">
          <span className="text-2xl font-black font-mono tabular-nums text-foreground">
            {diff.weekends.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground mt-1">{t("weekendDays")}</span>
          <span className="text-[9px] text-muted-foreground/60">{t("satSun")}</span>
        </div>
        <div className="flex flex-col items-center py-4 rounded-xl border border-border bg-card">
          <span className="text-2xl font-black font-mono tabular-nums text-foreground">
            {diff.totalDays.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground mt-1">{t("totalDaysLabel")}</span>
          <span className="text-[9px] text-muted-foreground/60">{t("inclWeekends")}</span>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground/50 mt-2">
        {t("noteHolidays")}
      </p>
    </div>
  )
}