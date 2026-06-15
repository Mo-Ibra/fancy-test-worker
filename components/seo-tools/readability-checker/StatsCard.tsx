export default function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col items-center py-3 px-2 rounded-xl border border-border bg-card">
      <span className="text-sm font-bold font-mono tabular-nums text-foreground leading-tight">{value}</span>
      <span className="text-[9px] text-muted-foreground mt-0.5 text-center leading-tight">{label}</span>
      {sub && <span className="text-[8px] text-muted-foreground/60">{sub}</span>}
    </div>
  );
}