import { fmtSize, ImageItem } from "@/funcs/image-tools/ImageMergerToolFuncs";
import { ArrowDown, ArrowUp, GripVertical, X } from "lucide-react";

export function ImageRow({
  item, index, total,
  onRemove, onMoveUp, onMoveDown,
}: {
  item: ImageItem; index: number; total: number;
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-200">
      {/* Drag handle / index */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-bold text-muted-foreground/50 w-4 text-center">{index + 1}</span>
        <GripVertical className="w-4 h-4 text-muted-foreground/30" />
      </div>
      {/* Thumb */}
      <div className="w-12 h-10 rounded-lg border border-border overflow-hidden shrink-0 flex items-center justify-center bg-muted/30"
        style={{ backgroundImage: "linear-gradient(45deg,#aaa 25%,transparent 25%),linear-gradient(-45deg,#aaa 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#aaa 75%),linear-gradient(-45deg,transparent 75%,#aaa 75%)", backgroundSize: "8px 8px", backgroundPosition: "0 0,0 4px,4px -4px,-4px 0" }}>
        <img src={item.url} alt={item.file.name} className="w-full h-full object-cover" />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground truncate">{item.file.name}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{item.width}×{item.height} · {fmtSize(Math.round(item.file.size / 1024))}</p>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onMoveUp(item.id)} disabled={index === 0}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ArrowUp className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button onClick={() => onMoveDown(item.id)} disabled={index === total - 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button onClick={() => onRemove(item.id)}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}