export default function AngleDial({ angle }: { angle: number }) {
  const rad = ((angle - 90) * Math.PI) / 180;
  const cx = 40, cy = 40, r = 28;
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);
  return (
    <svg width="80" height="80" className="shrink-0">
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="2" className="text-border" />
      {/* Filled arc indicator */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="3"
        strokeDasharray={`${(Math.abs(angle) / 360) * 2 * Math.PI * r} ${2 * Math.PI * r}`}
        strokeDashoffset={2 * Math.PI * r * 0.25}
        strokeLinecap="round"
        className="text-blue-500"
        transform={angle < 0 ? `rotate(180 ${cx} ${cy})` : ""}
      />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="3" className="fill-blue-500" />
      {/* Needle */}
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500" />
      <circle cx={x} cy={y} r="4" className="fill-blue-500" />
      {/* 0° mark */}
      <line x1={cx} y1={cy - r - 4} x2={cx} y2={cy - r + 2} stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40" />
    </svg>
  );
}