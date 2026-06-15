import { RotateCcw, RotateCw, CheckCircle2, FileText, RefreshCw, X } from "lucide-react";
import { PageInfo, normalizeAngle } from "@/funcs/pdf-tools/RotatePDFToolFuncs";

export default function PageCard({
  page, onRotateCW, onRotateCCW, onReset, onSelect,
}: {
  page: PageInfo;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onReset: () => void;
  onSelect: () => void;
}) {
  const totalAngle = normalizeAngle(page.origAngle + page.rotation);
  const hasRotation = page.rotation !== 0;

  return (
    <div
      onClick={onSelect}
      className={`flex flex-col gap-0 rounded-2xl border overflow-hidden cursor-pointer transition-all ${page.selected
        ? "border-blue-500 shadow-md shadow-blue-100 dark:shadow-blue-900/30"
        : "border-border hover:border-blue-200 dark:hover:border-blue-800"
        }`}
    >
      {/* Thumbnail */}
      <div className="relative flex items-center justify-center bg-muted/20" style={{ minHeight: 120 }}>
        {page.previewUrl ? (
          <img
            src={page.previewUrl}
            alt={`Page ${page.pageNum}`}
            style={{ transform: `rotate(${page.rotation}deg)`, transition: "transform 0.3s ease" }}
            className="max-w-full max-h-36 object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/30 py-6">
            <FileText className="w-8 h-8" />
            <RefreshCw className="w-4 h-4 animate-spin" />
          </div>
        )}

        {/* Selection badge */}
        {page.selected && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Rotation badge */}
        {hasRotation && (
          <span className="absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-400 text-white shadow">
            +{page.rotation}°
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 px-2.5 py-2 bg-card border-t border-border">
        <span className="text-[10px] font-bold text-muted-foreground/60 w-6 shrink-0 tabular-nums">p{page.pageNum}</span>
        <button
          onClick={e => { e.stopPropagation(); onRotateCCW(); }}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all"
          title="Rotate 90° counter-clockwise"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
        <span className={`flex-1 text-center text-[10px] font-mono font-bold tabular-nums ${hasRotation ? "text-amber-500" : "text-muted-foreground/40"}`}>
          {totalAngle}°
        </span>
        <button
          onClick={e => { e.stopPropagation(); onRotateCW(); }}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all"
          title="Rotate 90° clockwise"
        >
          <RotateCw className="w-3 h-3" />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onReset(); }}
          disabled={!hasRotation}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-20 transition-all"
          title="Reset rotation"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}