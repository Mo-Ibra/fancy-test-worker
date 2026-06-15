export default function ScoreRing({ score }: { score: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const pct = score / 100;
  const color =
    score >= 80 ? "#22c55e" :
      score >= 60 ? "#f59e0b" :
        score >= 40 ? "#f97316" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-20 h-20">
      <svg className="-rotate-90" width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--border)" strokeWidth="7" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${c * pct} ${c * (1 - pct)}`}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-black tabular-nums" style={{ color }}>{score}</span>
        <span className="text-[8px] text-muted-foreground uppercase tracking-wider">SEO</span>
      </div>
    </div>
  );
}