import { FileItem, fmtSize, formats, getExt, OutputFmt } from "@/funcs/image-tools/FormatConvertToolFuncs";
import { AlertCircle, CheckCircle2, Download, Loader2, X } from "lucide-react";

export default function FileRow({ item, outputFmt, onRemove }: {
  item: FileItem;
  outputFmt: OutputFmt;
  onRemove: (id: string) => void;
}) {
  const ext = formats.find((f) => f.value === outputFmt)?.ext ?? "jpg";
  const outName = item.file.name.replace(/\.[^.]+$/, "") + "." + ext;
  const savingPct = item.result
    ? Math.round((1 - item.result.sizeKb / item.originalSizeKb) * 100)
    : 0;

  const handleDownload = () => {
    if (!item.result) return;
    const a = document.createElement("a");
    a.href = item.result.url;
    a.download = outName;
    a.click();
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/60 transition-all duration-200">
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg border border-border bg-muted/40 overflow-hidden shrink-0 flex items-center justify-center"
        style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "8px 8px", backgroundPosition: "0 0,0 4px,4px -4px,-4px 0" }}
      >
        <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{item.file.name}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
          <span>{item.width}×{item.height}</span>
          <span>{fmtSize(item.originalSizeKb)}</span>
          <span className="text-blue-400">{getExt(item.file.name)} → {ext.toUpperCase()}</span>
        </div>
      </div>

      {/* Status / result */}
      <div className="flex items-center gap-3 shrink-0">
        {item.status === "idle" && (
          <span className="text-xs text-muted-foreground/60">Ready</span>
        )}
        {item.status === "processing" && (
          <div className="flex items-center gap-1.5 text-xs text-blue-500">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Converting...
          </div>
        )}
        {item.status === "done" && item.result && (
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-500">{fmtSize(item.result.sizeKb)}</p>
              <p className="text-[10px] text-emerald-500/70">
                {savingPct > 0 ? `-${savingPct}%` : savingPct < 0 ? `+${Math.abs(savingPct)}%` : "same"}
              </p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors duration-200"
            >
              <Download className="w-3 h-3" /> Save
            </button>
          </div>
        )}
        {item.status === "error" && (
          <div className="flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle className="w-3.5 h-3.5" /> Error
          </div>
        )}

        <button onClick={() => onRemove(item.id)} className="text-muted-foreground/40 hover:text-red-500 transition-colors duration-200 ml-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}