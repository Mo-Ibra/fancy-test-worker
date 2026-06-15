import { SplitRange, parsePageList } from "@/funcs/pdf-tools/PDFSplitterToolFuncs";
import { X } from "lucide-react";

export default function RangeRow({
  range, totalPages, index,
  onChange, onRemove,
}: {
  range: SplitRange;
  totalPages: number;
  index: number;
  onChange: (id: string, field: "value" | "label", val: string) => void;
  onRemove: (id: string) => void;
}) {
  const pages = parsePageList(range.value, totalPages);
  const isValid = pages.length > 0;

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border bg-card">
      <span className="w-6 h-6 rounded-full bg-muted/40 flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5">
        {index + 1}
      </span>
      <div className="flex-1 flex flex-col gap-2 min-w-0">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              value={range.value}
              onChange={e => onChange(range.id, "value", e.target.value)}
              placeholder="e.g. 1-3, 5, 8-10"
              aria-label="Page range"
              className={`w-full px-3 py-2 rounded-xl border text-xs font-mono bg-background text-foreground focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40 ${range.value && !isValid ? "border-red-300 dark:border-red-700" : "border-border"
                }`}
            />
          </div>
          <div className="w-36">
            <input
              value={range.label}
              onChange={e => onChange(range.id, "label", e.target.value)}
              placeholder={`part-${index + 1}`}
              aria-label="Output label"
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40"
            />
          </div>
          <button onClick={() => onRemove(range.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        {range.value && (
          <p className={`text-[10px] font-medium ${isValid ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
            {isValid ? `✓ ${pages.length} page${pages.length !== 1 ? "s" : ""}: ${pages.slice(0, 10).join(", ")}${pages.length > 10 ? "…" : ""}` : "⚠ No valid pages"}
          </p>
        )}
      </div>
    </div>
  );
}