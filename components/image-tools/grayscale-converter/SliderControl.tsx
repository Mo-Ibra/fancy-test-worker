import { useT } from "@/context/TranslationProvider";

export default function SliderControl({ label, value, min, max, unit = "", onChange, tKey }: {
  label: string; value: number; min: number; max: number; unit?: string; onChange: (v: number) => void; tKey?: string;
}) {
  const t = useT();
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{tKey ? t(tKey) : label}</p>
        <span className="text-sm font-bold text-blue-500 tabular-nums">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} aria-label={tKey ? t(tKey) : label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}