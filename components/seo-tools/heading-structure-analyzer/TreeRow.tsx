import { useT } from "@/context/TranslationProvider";
import { HeadingEntry, LEVEL_COLORS, LEVEL_SIZES } from "@/funcs/seo-tools/HeadingStructureAnalyzerFuncs";
import { AlertCircle } from "lucide-react";

export default function TreeRow({ entry, showId }: { entry: HeadingEntry; showId: boolean }) {
  const t = useT("seo-tools/HeadingStructureAnalyzerTool.json");
  const c = LEVEL_COLORS[entry.level];
  const indent = entry.depth * 20;

  return (
    <div className={`flex items-start gap-2 py-1.5 px-3 rounded-lg transition-colors ${entry.hasIssue ? "bg-amber-50 dark:bg-amber-900/10" : "hover:bg-muted/20"}`}
      style={{ paddingLeft: `${12 + indent}px` }}>

      {/* Tree lines */}
      {entry.depth > 0 && (
        <div className="flex items-center shrink-0" style={{ width: indent, marginLeft: -indent }}>
          {Array.from({ length: entry.depth }).map((_, i) => (
            <div key={i} className={`shrink-0 ${i === entry.depth - 1 ? "flex items-center gap-1" : ""}`}
              style={{ width: 20 }}>
              {i === entry.depth - 1 ? (
                <div className="flex items-center">
                  <div className="w-3 border-l border-b border-border/50 h-3 rounded-bl-sm mr-1" />
                </div>
              ) : (
                <div className="w-px h-full border-l border-border/30 mx-2.5" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Level badge */}
      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border shrink-0 ${c.bg} ${c.text} ${c.border}`}>
        H{entry.level}
      </span>

      {/* Text */}
      <span className={`flex-1 min-w-0 ${LEVEL_SIZES[entry.level]} text-foreground leading-snug wrap-break-word`}>
        {entry.text || <span className="text-muted-foreground/40 italic">{t("ui.emptyHeading")}</span>}
      </span>

      {/* ID badge */}
      {showId && entry.id && (
        <code className="text-[9px] font-mono text-muted-foreground/60 bg-muted/30 px-1.5 py-0.5 rounded shrink-0">#{entry.id}</code>
      )}

      {/* Issue indicator */}
      {entry.hasIssue && (
        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
      )}
    </div>
  );
}