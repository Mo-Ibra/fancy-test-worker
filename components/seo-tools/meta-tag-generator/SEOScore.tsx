import { AlertCircle, CheckCircle2 } from "lucide-react";
import ScoreRing from "./ScoreRing";

export default function SEOScore({ score, checks }: { score: number; checks: { label: string; ok: boolean; note?: string }[] }) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">SEO Score</p>
      <div className="flex items-start gap-4 mb-4">
        <ScoreRing score={score} />
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">
            {score >= 80 ? "Great!" : score >= 60 ? "Good" : score >= 40 ? "Needs work" : "Poor"}
          </p>
          <p className="text-xs text-muted-foreground">
            {checks.filter(c => c.ok).length} / {checks.length} checks passed
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {checks.map(({ label, ok, note }) => (
          <div key={label} className="flex items-center gap-2">
            {ok
              ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              : <AlertCircle className="w-3.5 h-3.5 text-muted-foreground/30 shrink-0" />}
            <span className={`text-[10px] flex-1 ${ok ? "text-foreground" : "text-muted-foreground/50"}`}>{label}</span>
            {note && <span className="text-[10px] font-mono text-muted-foreground/60">{note}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}