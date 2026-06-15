export default function FrequencyChart({ freq, sorted }: { freq: Map<number, number>; sorted: number[] }) {
  const entries = [...new Map([...freq.entries()].sort((a, b) => a[0] - b[0])).entries()];
  const maxCount = Math.max(...entries.map(([, c]) => c));
  const unique = entries.length;
  if (unique > 30) return <p className="text-xs text-muted-foreground/50 italic">Too many unique values to display chart</p>;

  return (
    <div className="overflow-x-auto">
      <div className="flex items-end gap-1.5 min-w-max pt-2">
        {entries.map(([val, cnt]) => {
          const pct = (cnt / maxCount) * 100;
          const isMode = cnt === maxCount && maxCount > 1;
          return (
            <div key={val} className="flex flex-col items-center gap-0.5 min-w-[32px]">
              <span className="text-[9px] font-bold text-muted-foreground">{cnt}</span>
              <div
                className={`w-7 rounded-t transition-all ${isMode ? "bg-blue-500" : "bg-muted-foreground/40"}`}
                style={{ height: `${Math.max(4, pct * 0.8)}px` }}
                title={`${val}: appears ${cnt} time${cnt > 1 ? "s" : ""}`}
              />
              <span className="text-[9px] font-mono text-muted-foreground rotate-45 origin-left ml-1 whitespace-nowrap mt-1">
                {String(val).length > 6 ? val.toExponential(1) : val}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-4 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-500" /> Mode</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-muted-foreground/40" /> Other</span>
      </div>
    </div>
  );
}