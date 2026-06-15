export default function EntropyGauge({ entropy }: { entropy: number }) {
  const max = 128;
  const pct = Math.min(100, (entropy / max) * 100);
  const color =
    entropy < 28 ? "bg-red-500" :
      entropy < 45 ? "bg-orange-500" :
        entropy < 60 ? "bg-yellow-500" :
          entropy < 80 ? "bg-blue-500" :
            "bg-emerald-500";

  const zones = [
    { label: "28", pct: (28 / max) * 100 },
    { label: "45", pct: (45 / max) * 100 },
    { label: "60", pct: (60 / max) * 100 },
    { label: "80", pct: (80 / max) * 100 },
    { label: "128", pct: 100 },
  ];

  return (
    <div className="flex flex-col gap-1">
      <div className="relative w-full h-3 rounded-full bg-border overflow-hidden">
        {/* Zone markers */}
        {zones.slice(0, -1).map(z => (
          <div key={z.pct} className="absolute top-0 bottom-0 w-px bg-background/40" style={{ left: `${z.pct}%` }} />
        ))}
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[9px] text-muted-foreground/50">
        <span>Weak</span><span>Fair</span><span>Strong</span><span>Very Strong</span><span>128 bits</span>
      </div>
    </div>
  );
}