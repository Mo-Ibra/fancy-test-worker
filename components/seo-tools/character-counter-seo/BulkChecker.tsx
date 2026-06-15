import { useT } from "@/context/TranslationProvider";
import { getStatus, PlatformConfig, STATUS_BAR, STATUS_COLOR } from "@/funcs/seo-tools/CharacterCounterSEOToolFuncs";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function BulkChecker({ lines, cfg, customSoft }: {
  lines: string[]; cfg: PlatformConfig; customSoft: number;
}) {
  const t = useT("seo-tools/CharacterCounterSEOTool.json");
  return (
    <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/20">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex-1">
          {t("bulk.bulkCheck")} — {lines.filter(Boolean).length} {t("bulk.items")}
        </p>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {lines.filter(Boolean).map((line, i) => {
          const len = line.length;
          const soft = cfg.key === "custom" ? customSoft : cfg.soft;
          const status = getStatus(len, cfg, customSoft);
          const pct = soft > 0 ? Math.min(100, (len / (cfg.hard || soft * 1.3)) * 100) : 0;
          return (
            <div key={i} className={`flex items-center gap-3 px-4 py-2.5 ${i % 2 === 0 ? "bg-muted/10" : ""}`}>
              <span className="text-[10px] font-mono text-muted-foreground/40 w-5 tabular-nums shrink-0">{i + 1}</span>
              <span className="flex-1 text-xs text-foreground truncate">{line}</span>
              <div className="w-20 h-1.5 rounded-full bg-border overflow-hidden shrink-0">
                <div className={`h-full rounded-full ${STATUS_BAR[status]}`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`text-[10px] font-mono font-bold tabular-nums w-8 text-right shrink-0 ${STATUS_COLOR[status]}`}>{len}</span>
              {status === "ideal" && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
              {(status === "warning" || status === "too-short") && <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />}
              {status === "over" && <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}