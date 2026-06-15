import { fmt, Stats } from "@/funcs/math-tools/AverageCalculatorToolFuncs";

export default function BoxPlot({ stats }: { stats: Stats }) {
  const { min, max, q1, q3, median, outliers } = stats;
  const range = max - min || 1;
  const W = 320, PAD = 20, IW = W - PAD * 2;

  const x = (v: number) => PAD + ((v - min) / range) * IW;

  return (
    <svg viewBox={`0 0 ${W} 80`} className="w-full max-w-sm">
      {/* Axis */}
      <line x1={PAD} y1={50} x2={W - PAD} y2={50} stroke="var(--border)" strokeWidth={1} />

      {/* Whiskers */}
      <line x1={x(min)} y1={40} x2={x(q1)} y2={40} stroke="var(--muted-foreground)" strokeWidth={1.5} />
      <line x1={x(q3)} y1={40} x2={x(max)} y2={40} stroke="var(--muted-foreground)" strokeWidth={1.5} />
      <line x1={x(min)} y1={33} x2={x(min)} y2={47} stroke="var(--muted-foreground)" strokeWidth={1.5} />
      <line x1={x(max)} y1={33} x2={x(max)} y2={47} stroke="var(--muted-foreground)" strokeWidth={1.5} />

      {/* IQR box */}
      <rect x={x(q1)} y={28} width={x(q3) - x(q1)} height={24} rx={3}
        fill="rgba(59,130,246,0.15)" stroke="#3b82f6" strokeWidth={1.5} />

      {/* Median line */}
      <line x1={x(median)} y1={28} x2={x(median)} y2={52} stroke="#3b82f6" strokeWidth={2.5} />

      {/* Outliers */}
      {outliers.map((o, i) => (
        <circle key={i} cx={x(o)} cy={40} r={3} fill="#f59e0b" stroke="var(--background)" strokeWidth={1} />
      ))}

      {/* Labels */}
      {[
        { v: min, label: fmt(min, 4) },
        { v: q1, label: `Q1` },
        { v: median, label: `Md` },
        { v: q3, label: `Q3` },
        { v: max, label: fmt(max, 4) },
      ].map(({ v, label }) => (
        <text key={label} x={x(v)} y={70} textAnchor="middle" fontSize={8}
          className="fill-muted-foreground font-mono">{label}</text>
      ))}
    </svg>
  );
}