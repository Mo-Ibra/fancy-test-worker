export default function Field({ label, value, onChange, placeholder, type = "text", hint, mono = false, textarea = false, rows = 2 }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; hint?: string; mono?: boolean;
  textarea?: boolean; rows?: number;
}) {
  const cls = `w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm transition-all focus:outline-none focus:border-blue-400 placeholder:text-muted-foreground/40 ${mono ? "font-mono" : ""}`;
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls + " resize-none"} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} aria-label={label} />}
      {hint && <p className="text-[9px] text-muted-foreground/60">{hint}</p>}
    </div>
  );
}