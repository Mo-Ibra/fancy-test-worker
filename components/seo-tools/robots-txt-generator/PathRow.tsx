import { X } from "lucide-react";

export default function PathRow({ value, onChange, onRemove, placeholder }: {
  value: string; onChange: (v: string) => void; onRemove: () => void; placeholder?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? "/path/"} aria-label={placeholder ?? "Path"}
        className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
      <button onClick={onRemove}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all shrink-0">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}