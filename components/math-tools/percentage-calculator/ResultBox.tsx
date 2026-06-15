import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

export default function ResultBox({ label, value, sub, highlight = false }: {
  label: string; value: string; sub?: string; highlight?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all ${highlight
      ? "border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10"
      : "border-border bg-card"
      }`}>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
        <p className={`text-2xl font-bold font-mono tabular-nums ${value === "—" ? "text-muted-foreground/30" : highlight ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <button onClick={copy} disabled={value === "—"}
        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-background hover:border-blue-300 hover:text-blue-500 disabled:opacity-30 transition-all">
        {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}