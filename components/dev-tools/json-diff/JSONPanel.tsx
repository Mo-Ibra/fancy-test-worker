import { AlertCircle, ClipboardPaste, Trash2 } from "lucide-react";

export default function JSONPanel({
  label, value, onChange, error, color,
}: {
  label: string; value: string; onChange: (v: string) => void; error: string; color: "blue" | "purple";
}) {
  const dot = color === "blue" ? "bg-blue-400" : "bg-purple-400";
  const ring = color === "blue"
    ? "focus:border-blue-400 dark:focus:border-blue-600 focus:ring-blue-100 dark:focus:ring-blue-900/40"
    : "focus:border-purple-400 dark:focus:border-purple-600 focus:ring-purple-100 dark:focus:ring-purple-900/40";
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dot}`} /> {label}
        </span>
        <div className="flex gap-2">
          <button onClick={() => navigator.clipboard.readText().then(onChange).catch(() => { })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
            <ClipboardPaste className="w-3.5 h-3.5" /> Paste
          </button>
          <button onClick={() => onChange("")} disabled={!value}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={`Paste ${label} JSON here…\n\n{\n  "key": "value"\n}`}
        className={`h-52 px-5 py-4 rounded-2xl border bg-card text-foreground text-xs leading-relaxed font-mono resize-none focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm placeholder:text-muted-foreground/50 ${error ? "border-red-300 dark:border-red-700" : value ? "border-emerald-300 dark:border-emerald-700" : "border-border"
          } ${ring}`}
        spellCheck={false}
      />
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
        </div>
      )}
    </div>
  );
}
