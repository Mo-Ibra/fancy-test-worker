import { FileItem, fmtSize, formatOpts, OutputFmt } from "@/funcs/image-tools/ImageCompressorToolFuncs";
import { useT } from "@/context/TranslationProvider";
import { AlertCircle, CheckCircle2, Download, Loader2, X } from "lucide-react";

export default function FileRow({ item, fmt, onRemove }: { item: FileItem; fmt: OutputFmt; onRemove: (id: string) => void }) {
  const t = useT();
  const ext = formatOpts.find((f) => f.value === fmt)?.ext ?? "jpg";
  const saved = item.result ? item.originalSizeKb - item.result.sizeKb : 0;
  const pct = item.result ? Math.round((saved / item.originalSizeKb) * 100) : 0;

  const dl = () => {
    if (!item.result) return;
    const a = document.createElement("a");
    a.href = item.result.url;
    a.download = item.file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`;
    a.click();
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-200">
      {/* Thumb */}
      <div className="w-12 h-12 shrink-0 rounded-lg border border-border overflow-hidden"
        style={{ background: "repeating-conic-gradient(#aaa 0% 25%,transparent 0% 50%) 0/8px 8px" }}>
        <img src={item.previewUrl} alt="" className="w-full h-full object-cover" />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{item.file.name}</p>
        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
          <span>{item.width}×{item.height}px</span>
          <span>{fmtSize(item.originalSizeKb)}</span>
          {item.result && (
            <>
              <span className="text-blue-400">→</span>
              <span className="font-semibold text-foreground">{fmtSize(item.result.sizeKb)}</span>
            </>
          )}
        </div>
      </div>
      {/* Status */}
      <div className="flex items-center gap-3 shrink-0">
        {item.status === "idle" && <span className="text-xs text-muted-foreground/50">{t("fileRow.queued")}</span>}
        {item.status === "processing" && <div className="flex items-center gap-1.5 text-xs text-blue-500"><Loader2 className="w-3.5 h-3.5 animate-spin" /> {t("fileRow.working")}</div>}
        {item.status === "error" && <div className="flex items-center gap-1.5 text-xs text-red-500"><AlertCircle className="w-3.5 h-3.5" /> {t("fileRow.failed")}</div>}
        {item.status === "done" && item.result && (
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className={`text-xs font-bold ${pct > 0 ? "text-emerald-500" : "text-amber-500"}`}>
                {pct > 0 ? `-${pct}%` : `+${Math.abs(pct)}%`}
              </p>
              <p className="text-[10px] text-muted-foreground">{pct > 0 ? `${t("fileRow.saved")} ${fmtSize(saved)}` : t("fileRow.larger")}</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <button onClick={dl} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold transition-colors duration-200">
              <Download className="w-3 h-3" /> {t("fileRow.save")}
            </button>
          </div>
        )}
        <button onClick={() => onRemove(item.id)} className="text-muted-foreground/30 hover:text-red-500 transition-colors ml-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}