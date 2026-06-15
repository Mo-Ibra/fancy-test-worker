"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  LayoutGrid,
  Download,
  Sparkles,
  RefreshCw,
  Columns,
  Rows,
  Grid2x2,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { Alignment, FitMode, fmtSize, formatOpts, ImageItem, loadImageItem, mergeImages, MergeLayout, MergeOptions, OutputFmt, ProcessResult } from "@/funcs/image-tools/ImageMergerToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import SliderRow from "@/components/image-tools/image-merger/SliderRow";
import DropZone from "@/components/image-tools/image-merger/DropZone";
import { ImageRow } from "@/components/image-tools/image-merger/ImageRow";
import RelatedTools from "@/components/image-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function ImageMergerTool() {
  const t = useT("image-tools/ImageMergerTool.json");

  const [items, setItems] = useState<ImageItem[]>([]);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [outputFmt, setOutputFmt] = useState<OutputFmt>("image/png");
  const [quality, setQuality] = useState(90);
  const [autoApply, setAutoApply] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [opts, setOpts] = useState<MergeOptions>({
    layout: "horizontal",
    alignment: "center",
    gap: 0,
    bgColor: "#ffffff",
    gridCols: 2,
    fitMode: "contain",
    fixedWidth: 400,
    fixedHeight: 400,
    useFixedSize: false,
  });

  const set = <K extends keyof MergeOptions>(k: K, v: MergeOptions[K]) =>
    setOpts((o) => ({ ...o, [k]: v }));

  const addFiles = useCallback(async (files: File[]) => {
    const newItems = await Promise.all(files.map(loadImageItem));
    setItems((p) => [...p, ...newItems]);
    setResult(null);
  }, []);

  const removeItem = (id: string) => { setItems((p) => p.filter((i) => i.id !== id)); setResult(null); };
  const moveUp = (id: string) => setItems((p) => { const i = p.findIndex((x) => x.id === id); if (i <= 0) return p; const n = [...p];[n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; });
  const moveDown = (id: string) => setItems((p) => { const i = p.findIndex((x) => x.id === id); if (i >= p.length - 1) return p; const n = [...p];[n[i], n[i + 1]] = [n[i + 1], n[i]]; return n; });
  const clearAll = () => { setItems([]); setResult(null); };

  const handleMerge = useCallback(async () => {
    if (items.length < 2) return;
    setProcessing(true);
    try {
      const r = await mergeImages(items, opts, outputFmt, quality);
      setResult(r);
    } finally {
      setProcessing(false);
    }
  }, [items, opts, outputFmt, quality]);

  useEffect(() => {
    if (items.length < 2 || !autoApply) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(handleMerge, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [items, opts, outputFmt, quality, autoApply, handleMerge]);

  const handleDownload = () => {
    if (!result) return;
    const ext = formatOpts.find((f) => f.value === outputFmt)?.ext ?? "png";
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `merged-${opts.layout}-${Date.now()}.${ext}`;
    a.click();
  };

  const layoutOptions = [
    { key: "horizontal" as MergeLayout, icon: Columns, label: t("layout.horizontal") },
    { key: "vertical" as MergeLayout, icon: Rows, label: t("layout.vertical") },
    { key: "grid" as MergeLayout, icon: Grid2x2, label: t("layout.grid") },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="image-tools/ImageMergerTool.json" href="/image-tools" />

        {/* Header */}
        <Header tKey="image-tools/ImageMergerTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Controls ── */}
          <div className="flex flex-col gap-5">

            {/* Layout */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.layout")}</p>
              <div className="grid grid-cols-3 gap-2">
                {layoutOptions.map(({ key, icon: Icon, label }) => (
                  <button key={key} onClick={() => set("layout", key)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all duration-200 ${opts.layout === key
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid columns (grid only) */}
            {opts.layout === "grid" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.columns")}</p>
                  <span className="text-sm font-bold text-blue-500">{opts.gridCols}</span>
                </div>
                <div className="flex gap-2">
                  {[2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => set("gridCols", n)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all duration-200 ${opts.gridCols === n
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                        }`}>{n}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Alignment (horizontal/vertical only) */}
            {opts.layout !== "grid" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.alignment")}</p>
                <div className="flex gap-2">
                  {(["start", "center", "end"] as Alignment[]).map((a) => (
                    <button key={a} onClick={() => set("alignment", a)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all duration-200 ${opts.alignment === a
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                        }`}>{a}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Fit mode */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.fitMode")}</p>
              <div className="grid grid-cols-3 gap-2">
                {(["contain", "cover", "stretch"] as FitMode[]).map((f) => (
                  <button key={f} onClick={() => set("fitMode", f)}
                    className={`py-2.5 rounded-xl border text-xs font-bold capitalize transition-all duration-200 ${opts.fitMode === f
                      ? "bg-blue-500 border-blue-500 text-white"
                      : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}>{f}</button>
                ))}
              </div>
            </div>

            {/* Gap + background */}
            <div className="flex flex-col gap-4 p-4 rounded-2xl border border-border bg-card">
              <SliderRow label={t("options.gap")} value={opts.gap} min={0} max={100} unit="px" onChange={(v) => set("gap", v)} />
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-16 shrink-0">{t("options.backgroundColor")}</span>
                <input type="color" value={opts.bgColor} onChange={(e) => set("bgColor", e.target.value)}
                  className="w-10 h-8 rounded-lg border border-border cursor-pointer" aria-label={t("options.backgroundColor")} />
                <span className="text-xs font-mono text-muted-foreground">{opts.bgColor}</span>
                <button onClick={() => set("bgColor", "#ffffff")} className="text-[10px] text-muted-foreground hover:text-blue-500 ml-auto">{t("color.white")}</button>
                <button onClick={() => set("bgColor", "#000000")} className="text-[10px] text-muted-foreground hover:text-blue-500">{t("color.black")}</button>
                <button onClick={() => set("bgColor", "#transparent")} className="text-[10px] text-muted-foreground hover:text-blue-500">{t("color.none")}</button>
              </div>
            </div>

            {/* Fixed cell size */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.fixedCellSize")}</p>
                <button onClick={() => set("useFixedSize", !opts.useFixedSize)}
                  className={`relative shrink-0 rounded-full transition-colors duration-200 ${opts.useFixedSize ? "bg-blue-500" : "bg-border"}`}
                  style={{ width: 36, height: 20 }}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${opts.useFixedSize ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
              {opts.useFixedSize && (
                <div className="grid grid-cols-2 gap-2">
                  {([[t("options.width"), "fixedWidth"], [t("options.height"), "fixedHeight"]] as [string, keyof MergeOptions][]).map(([label, key]) => (
                    <div key={key}>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">{label} {t("options.px")}</label>
                      <input type="number" min={10} value={opts[key] as number} aria-label={label}
                        onChange={(e) => set(key, Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm text-center font-bold focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Output format */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.outputFormat")}</p>
              <div className="grid grid-cols-3 gap-2">
                {formatOpts.map(({ value, label }) => (
                  <button key={value} onClick={() => setOutputFmt(value)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${outputFmt === value
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                      }`}>{label}</button>
                ))}
              </div>
            </div>

            {outputFmt !== "image/png" && (
              <SliderRow label={t("options.quality")} value={quality} min={1} max={100} unit="%" onChange={(v) => setQuality(v)} />
            )}

            {/* Auto apply */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
              <p className="text-xs font-semibold text-foreground">{t("options.autoApply")}</p>
              <button onClick={() => setAutoApply((p) => !p)}
                className={`relative shrink-0 rounded-full transition-colors duration-200 ${autoApply ? "bg-blue-500" : "bg-border"}`}
                style={{ width: 36, height: 20 }}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${autoApply ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>

            {!autoApply && (
              <button onClick={handleMerge} disabled={processing || items.length < 2}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200">
                {processing ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("buttons.merging")}</> : <><LayoutGrid className="w-4 h-4" /> {t("buttons.mergeImages")}</>}
              </button>
            )}

            {result && (
              <button onClick={handleDownload}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40">
                <Download className="w-4 h-4" /> {t("buttons.download")}
                <span className="text-emerald-100 text-xs font-normal ml-1">{result.width}×{result.height} · {formatOpts.find((f) => f.value === outputFmt)?.ext?.toUpperCase()}</span>
              </button>
            )}
          </div>

          {/* ── Image list + preview ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            <DropZone onFiles={addFiles} />

            {items.length > 0 && (
              <>
                {/* Image list */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {items.length} {t("info.images")} — {t("info.dragToReorder")}
                    </span>
                    <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-red-500 transition-colors font-medium">{t("buttons.clearAll")}</button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {items.map((item, idx) => (
                      <ImageRow
                        key={item.id}
                        item={item}
                        index={idx}
                        total={items.length}
                        onRemove={removeItem}
                        onMoveUp={moveUp}
                        onMoveDown={moveDown}
                      />
                    ))}
                  </div>
                  {items.length < 2 && (
                    <p className="text-xs text-amber-500 mt-2 text-center">{t("info.minImagesRequired")}</p>
                  )}
                </div>

                {/* Stats */}
                {result && (
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: t("stats.images"), value: items.length },
                      { label: t("stats.layout"), value: opts.layout },
                      { label: t("stats.output"), value: `${result.width}×${result.height}` },
                      { label: t("stats.fileSize"), value: fmtSize(result.sizeKb) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                        <span className="text-sm font-bold text-foreground capitalize truncate px-1">{value}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Processing indicator */}
                {processing && (
                  <div className="flex items-center justify-center gap-2 py-3 text-xs text-blue-500 font-medium">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t("status.mergingImages")}
                  </div>
                )}

                {/* Result preview */}
                {result && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("result.mergedResult")}</span>
                      <span className="text-xs text-muted-foreground/60">{result.width}×{result.height} · {fmtSize(result.sizeKb)}</span>
                    </div>
                    <div className="rounded-2xl border border-border overflow-auto max-h-[500px] flex items-center justify-center bg-muted/20"
                      style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}>
                      <img src={result.url} alt="Merged" className="max-w-full object-contain" style={{ maxHeight: 500 }} />
                    </div>
                    <button onClick={handleDownload}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40">
                      <Download className="w-4 h-4" /> {t("buttons.downloadMerged")}
                      <span className="text-emerald-100 text-xs font-normal ml-1">{result.width}×{result.height}</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <HowToUse tKey="image-tools/ImageMergerTool.json" count={4} />
        <FAQ tKey="image-tools/ImageMergerTool.json" />
        <Examples tKey="image-tools/ImageMergerTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}