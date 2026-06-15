import { useT } from "@/context/TranslationProvider";
import { HeadingEntry, LEVEL_COLORS } from "@/funcs/seo-tools/HeadingStructureAnalyzerFuncs";

export default function OutlineRow({ entry }: { entry: HeadingEntry }) {
  const t = useT("seo-tools/HeadingStructureAnalyzerTool.json");
  const c = LEVEL_COLORS[entry.level];
  const indent = (entry.level - 1) * 16;

  return (
    <div className={`flex items-center gap-2 py-1 rounded-lg ${entry.hasIssue ? "bg-amber-50 dark:bg-amber-900/10" : ""}`}
      style={{ paddingLeft: `${8 + indent}px` }}>
      <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
      <span className="text-xs text-foreground leading-snug flex-1 truncate">{entry.text || <em className="text-muted-foreground/40">{t("ui.emptyHeading")}</em>}</span>
      <span className={`text-[9px] font-bold ${c.text} shrink-0`}>H{entry.level}</span>
    </div>
  );
}