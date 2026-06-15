export default function ScoreRing({ score }: { score: number }) {
  const r = 24, c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  const col = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-16 h-16">
      <svg className="-rotate-90" width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--border)" strokeWidth="7" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={col} strokeWidth="7"
          strokeDasharray={`${fill} ${c - fill}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.5s ease" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-black leading-none" style={{ color: col }}>{score}</span>
      </div>
    </div>
  );
}