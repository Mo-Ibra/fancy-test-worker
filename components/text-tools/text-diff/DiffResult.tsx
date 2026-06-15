import { useT } from "@/context/TranslationProvider";

export default function DiffResult() {
  const t = useT("text-tools/TextDiffTool.json");
  return (
    <div className="flex items-center gap-5 px-5 py-3 border-b border-border bg-muted/30">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("diff.result")}</span>
      <div className="flex items-center gap-4 ml-auto">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800" />
          <span className="text-xs text-muted-foreground">{t("diff.legendAdded")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800" />
          <span className="text-xs text-muted-foreground">{t("diff.legendRemoved")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-muted border border-border" />
          <span className="text-xs text-muted-foreground">{t("diff.legendUnchanged")}</span>
        </div>
      </div>
    </div>
  )
}