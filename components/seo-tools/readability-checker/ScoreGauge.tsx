export default function ScoreGauge({ score, min = 0, max = 100, label, sublabel, color }: {
  score: number; min?: number; max?: number; label: string; sublabel?: string; color: string;
}) {
  const pct = Math.min(100, Math.max(0, ((score - min) / (max - min)) * 100));
  const r = 42;
  const circ = 2 * Math.PI * r;
  // Half arc (180°)
  const half = circ / 2;
  const fill = (pct / 100) * half;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-28 h-16">
        <svg viewBox="0 0 100 52" className="w-28 h-16">
          {/* Track */}
          <path d="M 9 50 A 42 42 0 0 1 91 50" fill="none" stroke="var(--border)" strokeWidth="9" strokeLinecap="round" />
          {/* Fill */}
          <path d="M 9 50 A 42 42 0 0 1 91 50" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
            strokeDasharray={`${fill} ${half}`} style={{ transition: "stroke-dasharray 0.6s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-xl font-black tabular-nums leading-none" style={{ color }}>{Math.round(score)}</span>
        </div>
      </div>
      <p className="text-xs font-bold text-foreground">{label}</p>
      {sublabel && <p className="text-[10px] text-muted-foreground text-center">{sublabel}</p>}
    </div>
  );
}