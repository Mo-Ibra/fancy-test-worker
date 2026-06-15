export default function CrackRow({ label, time, icon: Icon, rate }: { label: string; time: string; icon: React.ElementType; rate: string }) {
  const isInstant = time === "less than a second";
  const isSafe = time.includes("billion") || time === "centuries+";
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isInstant ? "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10"
      : isSafe ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10"
        : "border-border bg-card"
      }`}>
      <Icon className={`w-4 h-4 shrink-0 ${isInstant ? "text-red-500" : isSafe ? "text-emerald-500" : "text-muted-foreground"}`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground/60">{rate}</p>
      </div>
      <span className={`text-xs font-bold tabular-nums ${isInstant ? "text-red-500" : isSafe ? "text-emerald-500" : "text-foreground"}`}>
        {time}
      </span>
    </div>
  );
}