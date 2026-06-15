export default function PermRow({ label, sub, checked, onChange, disabled }: {
  label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 py-2.5 border-b last:border-0 border-border/50 ${disabled ? 'opacity-30' : ''}`}>
      <div>
        <p className="text-xs font-semibold text-foreground">{label}</p>
        {sub && <p className="text-[9px] text-muted-foreground/70">{sub}</p>}
      </div>
      <button onClick={() => !disabled && onChange(!checked)} disabled={disabled}
        className={`relative shrink-0 rounded-full transition-colors ${checked && !disabled ? 'bg-emerald-500' : 'bg-border'}`}
        style={{ width: 32, height: 18 }}>
        <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform ${checked && !disabled ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}