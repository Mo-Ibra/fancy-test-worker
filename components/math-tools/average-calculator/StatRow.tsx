import CopyButton from "./CopyButton";

export default function StatRow({ label, value, sub, accent = false, highlight = false }: {
  label: string; value: string; sub?: string; accent?: boolean; highlight?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${highlight ? "border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10" :
      accent ? "border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10" :
        "border-border bg-card"
      }`}>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground/60">{sub}</p>}
      </div>
      <div className="flex items-center gap-2">
        <code className={`text-sm font-mono font-bold tabular-nums ${highlight ? "text-blue-600 dark:text-blue-400" :
          accent ? "text-emerald-600 dark:text-emerald-400" :
            "text-foreground"
          }`}>{value}</code>
        <CopyButton text={value} small />
      </div>
    </div>
  );
}