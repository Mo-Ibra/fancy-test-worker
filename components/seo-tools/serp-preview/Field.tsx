import { getBarColor, getCharColor } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";

export default function Field({ label, value, onChange, placeholder, type = "text", hint, mono = false,
  textarea = false, rows = 2, charLimit, warnAt }: {
    label: string; value: string; onChange: (v: string) => void;
    placeholder?: string; type?: string; hint?: string; mono?: boolean;
    textarea?: boolean; rows?: number; charLimit?: number; warnAt?: number;
  }) {
  const len = value.length;
  const hasLim = charLimit !== undefined && warnAt !== undefined;

  const cls = `w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm transition-all focus:outline-none focus:border-blue-400 placeholder:text-muted-foreground/40 ${mono ? "font-mono text-xs" : ""}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
        {hasLim && <span className={`text-[10px] font-mono font-bold ${getCharColor(len, warnAt!, charLimit!)}`}>{len}/{charLimit}</span>}
      </div>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls + " resize-none"} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} aria-label={label} />}
      {hasLim && (
        <div className="w-full h-0.5 rounded-full bg-border overflow-hidden">
          <div className={`h-full rounded-full transition-all ${getBarColor(len, warnAt!, charLimit!)}`}
            style={{ width: `${Math.min(100, (len / (charLimit! + 20)) * 100)}%` }} />
        </div>
      )}
      {hint && <p className="text-[9px] text-muted-foreground/60">{hint}</p>}
    </div>
  );
}