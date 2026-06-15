export default function NumInput({
  label, value, onChange, suffix, prefix, placeholder = "0",
}: {
  label: string; value: string; onChange: (v: string) => void;
  suffix?: string; prefix?: string; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="flex items-center gap-0">
        {prefix && (
          <span className="px-3 py-3 rounded-l-xl border border-r-0 border-border bg-muted/40 text-muted-foreground text-sm font-mono select-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={label}
          className={`flex-1 px-4 py-3 border border-border bg-card text-foreground text-base font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40 ${prefix ? "" : "rounded-l-xl"} ${suffix ? "" : "rounded-r-xl"}`}
        />
        {suffix && (
          <span className="px-3 py-3 rounded-r-xl border border-l-0 border-border bg-muted/40 text-muted-foreground text-sm font-mono select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}