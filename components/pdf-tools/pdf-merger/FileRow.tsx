import { useState } from "react";
import { PDFFile, PageRange, fmtSize, parsePageRange } from "@/funcs/pdf-tools/PDFMergerToolFuncs";
import { FileText, ArrowUp, ArrowDown, X, GripVertical, RefreshCw, AlertCircle } from "lucide-react";

export default function FileRow({
  item, index, total,
  onMoveUp, onMoveDown, onRemove, onPageRangeChange,
}: {
  item: PDFFile;
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onPageRangeChange: (mode: PageRange["mode"], custom: string) => void;
}) {
  const [showRange, setShowRange] = useState(false);

  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Drag handle + position */}
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <GripVertical className="w-4 h-4 text-muted-foreground/30" />
          <span className="text-[10px] font-bold text-muted-foreground/40 tabular-nums">{index + 1}</span>
        </div>

        {/* File icon */}
        <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-red-500" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-muted-foreground">{fmtSize(item.sizeKb)}</span>
            {item.status === "reading" && (
              <span className="flex items-center gap-1 text-[10px] text-blue-500">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Reading…
              </span>
            )}
            {item.status === "ready" && item.pageCount !== null && (
              <span className="text-[10px] text-muted-foreground">{item.pageCount} page{item.pageCount !== 1 ? "s" : ""}</span>
            )}
            {item.status === "error" && (
              <span className="text-[10px] text-red-500 flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5" /> {item.error ?? "Error"}
              </span>
            )}
            {item.status === "ready" && item.pageCount !== null && (
              <button onClick={() => setShowRange(p => !p)}
                className={`text-[10px] font-bold transition-colors ${showRange ? "text-blue-500" : "text-muted-foreground/60 hover:text-blue-500"}`}>
                {item.pages.mode === "all" ? "All pages" : `Pages: ${item.pages.custom}`} ›
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onMoveUp} disabled={index === 0}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 disabled:opacity-30 transition-all">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={onMoveDown} disabled={index === total - 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 disabled:opacity-30 transition-all">
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={onRemove}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Page range selector */}
      {showRange && item.status === "ready" && item.pageCount !== null && (
        <div className="px-4 py-3 border-t border-border bg-muted/20 flex flex-col gap-2">
          <div className="flex gap-2">
            <button onClick={() => onPageRangeChange("all", "")}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${item.pages.mode === "all" ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                }`}>All {item.pageCount} pages</button>
            <button onClick={() => onPageRangeChange("custom", item.pages.custom || `1-${item.pageCount}`)}
              className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${item.pages.mode === "custom" ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                }`}>Custom range</button>
          </div>
          {item.pages.mode === "custom" && (
            <div>
              <input
                value={item.pages.custom}
                onChange={e => onPageRangeChange("custom", e.target.value)}
                placeholder={`e.g. 1-3, 5, 7-${item.pageCount}`}
                aria-label="Custom page range"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Separate with commas. Ranges with dash. E.g. <code className="font-mono">1-3, 5, 8-10</code>
              </p>
              {item.pages.custom && (() => {
                const pages = parsePageRange(item.pages.custom, item.pageCount!);
                return pages.length > 0 ? (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">
                    ✓ {pages.length} page{pages.length !== 1 ? "s" : ""} selected: {pages.join(", ")}
                  </p>
                ) : (
                  <p className="text-[10px] text-red-500 mt-0.5">⚠ No valid pages in range</p>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}