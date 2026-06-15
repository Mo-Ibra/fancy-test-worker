export default function SliderRow({ label, value, min, max, unit = "", onChange }: {
  label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-16 shrink-0">{label}</span>
      <input type="range" min={min} max={max} value={value} aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer" />
      <span className="text-xs font-bold text-blue-500 w-12 text-right tabular-nums">{value}{unit}</span>
    </div>
  );
}