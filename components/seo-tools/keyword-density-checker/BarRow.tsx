import DensityBadge from "./DensityBadge";

export default function BarRow({
  word, count, density, maxCount, isStop, positions, targetWord, onClick,
}: {
  word: string; count: number; density: number; maxCount: number;
  isStop: boolean; positions: number[]; targetWord: string; onClick: () => void;
}) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const isTarget = word === targetWord;
  const barColor =
    isStop ? "bg-muted-foreground/30"
      : density > 4 ? "bg-red-400"
        : density > 2.5 ? "bg-amber-400"
          : density > 0.5 ? "bg-blue-400"
            : "bg-muted-foreground/40";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${isTarget
        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/10"
        : "border-transparent hover:border-border hover:bg-muted/20"
        }`}
    >
      {/* Word */}
      <span className={`text-xs font-bold w-28 shrink-0 truncate ${isStop ? "text-muted-foreground/50" : "text-foreground"
        }`}>{word}</span>

      {/* Bar */}
      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
      </div>

      {/* Count */}
      <span className="text-[10px] font-mono tabular-nums text-muted-foreground w-6 text-right">{count}</span>

      {/* Density badge */}
      <DensityBadge density={density} isStop={isStop} />
    </div>
  );
}