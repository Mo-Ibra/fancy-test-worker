import { useT } from "@/context/TranslationProvider";
import { Mode, PLATFORMS } from "@/funcs/seo-tools/CharacterCounterSEOToolFuncs";
import { Zap } from "lucide-react";

export default function QuickReferenceTable({ setMode, setText, setBulkMode }: { setMode: (mode: Mode) => void; setText: (text: string) => void; setBulkMode: (bulkMode: boolean) => void }) {
  const t = useT("seo-tools/CharacterCounterSEOTool.json");
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
        <Zap className="w-4 h-4 text-blue-400" />
        <p className="text-xs font-bold uppercase tracking-wider text-foreground">{t("reference.title")}</p>
      </div>
      <div className="divide-y divide-border overflow-x-auto">
        {PLATFORMS.filter(p => p.key !== "custom").map(p => {
          const Icon = p.icon;
          return (
            <div key={p.key}
              onClick={() => { setMode(p.key); setText(""); setBulkMode(false); }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 cursor-pointer transition-colors">
              <Icon className={`w-3.5 h-3.5 shrink-0 ${p.iconColor}`} />
              <span className="text-xs font-medium text-foreground flex-1 truncate">{t(`platforms.${p.key}`)}</span>
              <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                {p.min > 0 && <span className="text-amber-500">{t("reference.min")} {p.min}</span>}
                <span className="text-emerald-500">{t("reference.ideal")} {p.soft}</span>
                {p.hard < 100000 && <span className="text-red-400">{t("reference.max")} {p.hard}</span>}
                {p.hardLimit && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{t("reference.hard")}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}