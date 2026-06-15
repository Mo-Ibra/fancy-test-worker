export default function NumInput({ label, value, onChange, min = 0, max }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        type="number" min={min} max={max} value={value} aria-label={label}
        onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
        className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-mono text-center focus:outline-none focus:border-blue-400 transition-all"
      />
    </div>
  );
}