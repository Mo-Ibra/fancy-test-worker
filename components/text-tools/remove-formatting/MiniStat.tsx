export default function MiniStat({ label, before, after }: { label: string; before: number; after: number }) {
  const diff = after - before;
  return (
    <div className="flex flex-col p-3 rounded-xl border border-border bg-card text-center">
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      <span className="text-lg font-bold text-foreground">{after}</span>
      {diff !== 0 && (
        <span className={`text-[10px] font-semibold mt-0.5 ${diff < 0 ? "text-emerald-500" : "text-red-400"}`}>
          {diff > 0 ? `+${diff}` : diff}
        </span>
      )}
    </div>
  );
}