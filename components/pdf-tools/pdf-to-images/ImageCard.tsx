import { useState } from "react";
import { Download, ZoomIn, CheckCircle2, X } from "lucide-react";
import { fmtSize } from "@/funcs/pdf-tools/PDFToImagesToolFuncs";
import type { RenderedPage } from "@/funcs/pdf-tools/PDFToImagesToolFuncs";

export default function ImageCard({ page, onDownload, selected, onSelect }: {
  page: RenderedPage;
  onDownload: () => void;
  selected: boolean;
  onSelect: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      <div
        onClick={onSelect}
        className={`relative flex flex-col gap-0 rounded-2xl border overflow-hidden cursor-pointer transition-all ${selected ? "border-blue-500 shadow-md shadow-blue-100 dark:shadow-blue-900/30" : "border-border hover:border-blue-200 dark:hover:border-blue-800"
          }`}
      >
        {/* Thumbnail */}
        <div className="relative bg-muted/20 flex items-center justify-center" style={{ minHeight: 140 }}>
          <img
            src={page.dataUrl}
            alt={`Page ${page.pageNum}`}
            className="max-w-full max-h-48 object-contain"
          />
          {/* Zoom button */}
          <button
            onClick={e => { e.stopPropagation(); setZoomed(true); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          {/* Page badge */}
          <span className="absolute bottom-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/50 text-white">
            p.{page.pageNum}
          </span>
        </div>
        {/* Info row */}
        <div className="flex items-center gap-2 px-3 py-2.5 bg-card border-t border-border">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-foreground truncate">page-{String(page.pageNum).padStart(3, "0")}</p>
            <p className="text-[9px] text-muted-foreground">
              {page.width}×{page.height} · {fmtSize(page.sizeKb)}
            </p>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onDownload(); }}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
        {/* Selection indicator */}
        {selected && (
          <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Zoom lightbox */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img src={page.dataUrl} alt={`Page ${page.pageNum}`} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            <button onClick={() => setZoomed(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-all">
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-black/60 text-white">
                Page {page.pageNum} · {page.width}×{page.height} · {fmtSize(page.sizeKb)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}