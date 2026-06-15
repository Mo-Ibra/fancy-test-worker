export default function StatCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`flex flex-col items-center py-3 px-2 rounded-xl border transition-colors ${accent
      ? "border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20"
      : "border-border bg-card"
      }`}>
      <span className={`text-xl font-bold ${accent ? "text-blue-500" : "text-foreground"}`}>{value}</span>
      <span className="text-[10px] text-muted-foreground mt-0.5 text-center leading-tight">{label}</span>
    </div>
  );
}