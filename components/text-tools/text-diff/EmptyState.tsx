import { Scissors } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function EmptyState({ loadExample }: { loadExample: () => void }) {
  const t = useT("text-tools/TextDiffTool.json");
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center mb-6">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
        <Scissors className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">{t("empty.title")}</p>
      <p className="text-xs text-muted-foreground mb-4">{t("empty.subtitle")}</p>
      <button
        onClick={loadExample}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors duration-200"
      >
        {t("empty.loadExample")}
      </button>
    </div>
  )
}