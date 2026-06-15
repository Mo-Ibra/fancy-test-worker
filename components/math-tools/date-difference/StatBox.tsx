export default function StatBox({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`flex flex-col items-center py-3 rounded-xl border ${accent
      ? "border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10"
      : "border-border bg-card"
      }`}>
      <span className={`text-base font-bold font-mono tabular-nums leading-tight ${accent ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>
      <span className="text-[9px] text-muted-foreground mt-0.5 text-center px-1">{label}</span>
    </div>
  );
}