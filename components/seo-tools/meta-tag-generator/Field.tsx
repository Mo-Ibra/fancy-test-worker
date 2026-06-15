import { getCharBg, getCharColor } from "@/funcs/seo-tools/MetaTagGeneratorToolFuncs";

export default function Field({
  label, value, onChange, placeholder, type = "text",
  minChars, maxChars, warnChars, hint, mono = false, textarea = false, rows = 3,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; minChars?: number; maxChars?: number;
  warnChars?: number; hint?: string; mono?: boolean; textarea?: boolean; rows?: number;
}) {
  const len = value.length;
  const hasLimit = minChars !== undefined && maxChars !== undefined;
  const color = hasLimit ? getCharColor(len, minChars!, maxChars!, warnChars ?? maxChars! + 20) : "text-muted-foreground/60";
  const bgColor = hasLimit ? getCharBg(len, minChars!, maxChars!) : "bg-border";

  const cls = `w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/40 ${mono ? "font-mono" : ""}`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
        {hasLimit && (
          <span className={`text-[10px] font-mono font-bold ${color}`}>
            {len} / {maxChars}
          </span>
        )}
        {!hasLimit && value && (
          <span className="text-[10px] font-mono text-muted-foreground/50">{len}</span>
        )}
      </div>

      {textarea ? (
        <textarea value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} rows={rows}
          className={cls + " resize-none"} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} className={cls} aria-label={label} />
      )}

      {/* Progress bar */}
      {hasLimit && (
        <div className="w-full h-0.5 rounded-full bg-border overflow-hidden">
          <div className={`h-full rounded-full transition-all ${bgColor}`}
            style={{ width: `${Math.min(100, (len / (warnChars ?? maxChars! + 20)) * 100)}%` }} />
        </div>
      )}

      {hint && <p className="text-[9px] text-muted-foreground/60">{hint}</p>}
    </div>
  );
}