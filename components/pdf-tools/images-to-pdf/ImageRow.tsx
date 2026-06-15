import { ImageFile, fmtSize } from "@/funcs/pdf-tools/ImagesToPDFToolFuncs";
import { AlertCircle, ArrowDown, ArrowUp, GripVertical, RefreshCw, X } from "lucide-react";

export default function ImageRow({
  item, index, total,
  onMoveUp, onMoveDown, onRemove,
}: {
  item: ImageFile; index: number; total: number;
  onMoveUp: () => void; onMoveDown: () => void; onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card shadow-sm">
      <GripVertical className="w-4 h-4 text-muted-foreground/30 shrink-0" />
      <span className="text-[10px] font-bold text-muted-foreground/40 tabular-nums w-4 shrink-0">{index + 1}</span>

      {/* Thumbnail */}
      {item.status === "ready" ? (
        <img src={item.dataUrl} alt={item.name}
          className="w-12 h-12 object-cover rounded-xl border border-border shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center shrink-0">
          {item.status === "loading"
            ? <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />
            : <AlertCircle className="w-4 h-4 text-red-400" />}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground truncate">{item.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground">{fmtSize(item.sizeKb)}</span>
          {item.status === "ready" && (
            <span className="text-[10px] text-muted-foreground">{item.width}×{item.height}</span>
          )}
          {item.error && <span className="text-[10px] text-red-500">{item.error}</span>}
        </div>
      </div>

      <div className="flex gap-1 shrink-0">
        <button onClick={onMoveUp} disabled={index === 0}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-30 transition-all">
          <ArrowUp className="w-3 h-3" />
        </button>
        <button onClick={onMoveDown} disabled={index === total - 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-30 transition-all">
          <ArrowDown className="w-3 h-3" />
        </button>
        <button onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}