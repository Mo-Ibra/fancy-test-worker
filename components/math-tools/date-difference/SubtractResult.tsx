import { Minus } from "lucide-react";
import CopyButton from "./CopyButton";
import { useT } from "@/context/TranslationProvider";

export default function SubtractResult({ addAmount_n, addUnit, addResult }: { addAmount_n: number; addUnit: string; addResult: any }) {
  const t = useT("math-tools/DateDifferenceTool.json");
  return (
    <div className="p-5 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Minus className="w-4 h-4 text-red-400" />
        <p className="text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
          {t("addSub.afterSubtracting")} {addAmount_n.toLocaleString()} {t(`addSub.${addUnit}`)}
        </p>
      </div>
      <p className="text-lg font-black text-foreground mb-1">{addResult.sub.formatted}</p>
      <div className="flex items-center gap-2 mt-2">
        <code className="text-xs font-mono text-muted-foreground">
          {addResult.sub.result.toISOString().split("T")[0]}
        </code>
        <CopyButton text={addResult.sub.formatted} />
      </div>
    </div>
  )
}