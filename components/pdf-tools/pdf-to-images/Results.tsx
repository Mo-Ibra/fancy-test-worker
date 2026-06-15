import { fmtSize, RenderedPage, RenderOptions } from "@/funcs/pdf-tools/PDFToImagesToolFuncs";
import { Archive, Download } from "lucide-react";
import ImageCard from "./ImageCard";
import { useT } from "@/context/TranslationProvider";

export default function Results({ pages, toggleSelect, opts, selected, totalSizeKb, selectAll, deselectAll, downloadSelected, downloadAll, downloadPage }: { pages: RenderedPage[]; toggleSelect: (pageNum: number) => void; opts: RenderOptions; selected: Set<number>; totalSizeKb: number; selectAll: () => void; deselectAll: () => void; downloadSelected: () => void; downloadAll: () => void; downloadPage: (page: RenderedPage) => void }) {
  const t = useT("pdf-tools/PDFToImagesTool.json");

  return (
    <div className="flex flex-col gap-4">
      {/* Action bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1.5">
          <button onClick={selectAll} className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">{t("result.selectAll")}</button>
          <button onClick={deselectAll} className="px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">{t("result.deselectAll")}</button>
        </div>
        <span className="text-xs text-muted-foreground">
          {t("result.title", { count: pages.length })} · {t("result.totalSize", { size: fmtSize(totalSizeKb) })}
        </span>
        <div className="flex gap-2 ml-auto">
          {selected.size > 0 && (
            <button onClick={downloadSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-300 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-xs font-bold transition-all">
              <Download className="w-3.5 h-3.5" /> {t("result.downloadSelected", { count: selected.size })}
            </button>
          )}
          <button onClick={downloadAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-emerald-300 hover:text-emerald-600 text-xs font-medium transition-all">
            <Archive className="w-3.5 h-3.5" /> {t("result.downloadZip")}
          </button>
        </div>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {pages.map(page => (
          <div key={page.pageNum} className="group">
            <ImageCard
              page={page}
              onDownload={() => downloadPage(page)}
              selected={selected.has(page.pageNum)}
              onSelect={() => toggleSelect(page.pageNum)}
            />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: t("result.imagesLabel"), value: pages.length },
          { label: "Format", value: opts.format.toUpperCase() },
          { label: "Resolution", value: `${opts.dpi} DPI` },
          { label: t("result.totalSizeLabel"), value: fmtSize(totalSizeKb) },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
            <span className="text-sm font-bold font-mono tabular-nums text-foreground">{value}</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}