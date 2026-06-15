import { addSubDate } from "@/funcs/math-tools/DateDifferenceToolFuncs";
import { useT } from "@/context/TranslationProvider";

export default function MultiUnitPreview({ addBase_d }: { addBase_d: Date }) {
  const t = useT("math-tools/DateDifferenceTool.json");
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-3 bg-muted/20 border-b border-border">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground">{t("addSub.result")}</p>
      </div>
      <div className="divide-y divide-border">
        {([
          { unit: "days" as const, amounts: [1, 7, 14, 30, 90, 365] },
          { unit: "weeks" as const, amounts: [1, 2, 4, 8, 26, 52] },
          { unit: "months" as const, amounts: [1, 3, 6, 12, 24, 36] },
          { unit: "years" as const, amounts: [1, 2, 5, 10, 20, 50] },
        ]).map(({ unit, amounts }) => (
          <div key={unit} className="px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t(`addSub.${unit}`)}</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {amounts.map(n => {
                const added = addSubDate(addBase_d, unit, n, "add");
                const subbed = addSubDate(addBase_d, unit, n, "sub");
                return (
                  <div key={n} className="shrink-0 text-center">
                    <p className="text-[9px] font-bold text-muted-foreground/50 mb-0.5">+{n}</p>
                    <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">{added.result.toISOString().split("T")[0]}</p>
                    <p className="text-[9px] font-bold text-muted-foreground/50 mt-1 mb-0.5">−{n}</p>
                    <p className="text-[10px] font-mono text-red-500 dark:text-red-400">{subbed.result.toISOString().split("T")[0]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}