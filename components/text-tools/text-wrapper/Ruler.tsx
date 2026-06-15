export default function Ruler({ width }: { width: number }) {
  const marks = [];
  for (let i = 1; i <= Math.min(width, 120); i++) {
    if (i % 10 === 0) marks.push({ pos: i, label: String(i) });
    else if (i % 5 === 0) marks.push({ pos: i, label: "·" });
  }
  return (
    <div className="relative h-6 overflow-hidden select-none mb-1">
      <div
        className="absolute top-0 left-0 h-full font-mono text-[10px] text-muted-foreground/50 whitespace-pre leading-6"
        style={{ letterSpacing: "0.5px" }}
      >
        {Array.from({ length: Math.min(width, 120) }, (_, i) => {
          const n = i + 1;
          if (n % 10 === 0) return "|";
          if (n % 5 === 0) return "·";
          return "─";
        }).join("")}
      </div>
      {marks
        .filter((m) => m.label !== "·")
        .map((m) => (
          <span
            key={m.pos}
            className="absolute top-0 text-[9px] font-mono text-blue-500/60"
            style={{ left: `${(m.pos / Math.min(width, 120)) * 100}%` }}
          >
            {m.label}
          </span>
        ))}
    </div>
  );
}