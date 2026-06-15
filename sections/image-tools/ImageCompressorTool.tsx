"use client";

import { useState, useCallback } from "react";
import {
  Minimize2,
  Download,
  Sparkles,
  Loader2,
  BarChart2,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { compressImage, CompressionMode, CompressOptions, FileItem, fmtSize, formatOpts, loadImageInfo, uid } from "@/funcs/image-tools/ImageCompressorToolFuncs";
import DropZone from "@/components/image-tools/image-compressor/DropZone";
import FileRow from "@/components/image-tools/image-compressor/FileRow";
import CompareSlider from "@/components/image-tools/image-compressor/CompareSlider";
import RelatedTools from "@/components/image-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function ImageCompressorTool() {
  const t = useT("image-tools/ImageCompressorTool.json");
  const [items, setItems] = useState<FileItem[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [preview, setPreview] = useState<FileItem | null>(null);
  const [opts, setOpts] = useState<CompressOptions>({
    mode: "quality",
    quality: 80,
    targetSizeKb: 200,
    outputFormat: "image/jpeg",
    maxWidthEnabled: false,
    maxWidth: 1920,
    stripMetadata: true,
  });

  const set = <K extends keyof CompressOptions>(k: K, v: CompressOptions[K]) =>
    setOpts((o) => ({ ...o, [k]: v }));

  const addFiles = useCallback(async (files: File[]) => {
    const newItems: FileItem[] = await Promise.all(
      files.map(async (file) => {
        const { width, height, previewUrl } = await loadImageInfo(file);
        return { id: uid(), file, previewUrl, originalSizeKb: Math.round(file.size / 1024), width, height, status: "idle" as const };
      })
    );
    setItems((p) => [...p, ...newItems]);
  }, []);

  const removeItem = (id: string) => {
    setItems((p) => p.filter((i) => i.id !== id));
    if (preview?.id === id) setPreview(null);
  };

  const clearAll = () => { setItems([]); setPreview(null); };

  const compressAll = async () => {
    setCompressing(true);
    for (const item of items) {
      if (item.status === "done") continue;
      setItems((p) => p.map((i) => i.id === item.id ? { ...i, status: "processing" } : i));
      try {
        const result = await compressImage(item, opts);
        setItems((p) => p.map((i) => {
          if (i.id !== item.id) return i;
          const updated = { ...i, status: "done" as const, result };
          if (preview?.id === item.id) setPreview(updated);
          return updated;
        }));
      } catch (e: any) {
        setItems((p) => p.map((i) => i.id === item.id ? { ...i, status: "error", error: e.message } : i));
      }
    }
    setCompressing(false);
  };

  const downloadAll = () => {
    const ext = formatOpts.find((f) => f.value === opts.outputFormat)?.ext ?? "jpg";
    items.filter((i) => i.result).forEach((item) => {
      const a = document.createElement("a");
      a.href = item.result!.url;
      a.download = item.file.name.replace(/\.[^.]+$/, "") + `-compressed.${ext}`;
      a.click();
    });
  };

  const doneItems = items.filter((i) => i.status === "done" && i.result);
  const doneCount = doneItems.length;
  const totalSaved = doneItems.reduce((acc, i) => acc + (i.originalSizeKb - (i.result?.sizeKb ?? 0)), 0);
  const avgPct = doneCount
    ? Math.round(doneItems.reduce((acc, i) => acc + ((i.originalSizeKb - (i.result?.sizeKb ?? 0)) / i.originalSizeKb) * 100, 0) / doneCount)
    : 0;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="image-tools/ImageCompressorTool.json" href="/image-tools" />

        {/* Header */}
        <Header tKey="image-tools/ImageCompressorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Settings ── */}
          <div className="flex flex-col gap-5">

            {/* Mode */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.modeLabel")}</p>
              <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                {(["quality", "target"] as CompressionMode[]).map((m) => (
                  <button key={m} onClick={() => set("mode", m)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${opts.mode === m ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    {m === "quality" ? t("options.byQuality") : t("options.bySize")}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality slider */}
            {opts.mode === "quality" && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.quality")}</p>
                  <span className="text-sm font-bold text-blue-500">{opts.quality}%</span>
                </div>
                <input type="range" min={1} max={99} value={opts.quality}
                  onChange={(e) => set("quality", Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                  aria-label={t("options.quality")}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
                  <span>{t("options.qualityMaxCompression")}</span><span>{t("options.qualityBestQuality")}</span>
                </div>
                {/* Quality presets */}
                <div className="flex gap-2 mt-3">
                  {[{ l: t("options.qualityLow"), v: 40 }, { l: t("options.qualityMed"), v: 70 }, { l: t("options.qualityHigh"), v: 85 }, { l: t("options.qualityMax"), v: 95 }].map(({ l, v }) => (
                    <button key={v} onClick={() => set("quality", v)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${opts.quality === v ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Target size */}
            {opts.mode === "target" && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.targetSizeLabel")}</p>
                  <span className="text-sm font-bold text-blue-500">{opts.targetSizeKb} KB</span>
                </div>
                <input type="range" min={10} max={2000} step={10} value={opts.targetSizeKb}
                  onChange={(e) => set("targetSizeKb", Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                  aria-label={t("options.targetSizeLabel")}
                />
                <div className="flex gap-2 mt-3">
                  {[50, 100, 200, 500].map((v) => (
                    <button key={v} onClick={() => set("targetSizeKb", v)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${opts.targetSizeKb === v ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"}`}>
                      {v}KB
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-2">{t("options.targetSizeDesc")}</p>
              </div>
            )}

            {/* Output format */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.outputFormat")}</p>
              <div className="grid grid-cols-3 gap-2">
                {formatOpts.map(({ value, label }) => (
                  <button key={value} onClick={() => set("outputFormat", value)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${opts.outputFormat === value ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Max width */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.limitWidth")}</p>
                <button onClick={() => set("maxWidthEnabled", !opts.maxWidthEnabled)}
                  className={`relative shrink-0 rounded-full transition-colors duration-200 ${opts.maxWidthEnabled ? "bg-blue-500" : "bg-border"}`}
                  style={{ width: 36, height: 20 }}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${opts.maxWidthEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>
              {opts.maxWidthEnabled && (
                <input type="number" min={100} value={opts.maxWidth}
                  onChange={(e) => set("maxWidth", Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm text-center font-bold focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                  aria-label={t("options.limitWidth")}
                />
              )}
            </div>

            {/* Summary */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {opts.mode === "quality"
                  ? <><strong>{opts.quality}% {t("options.quality").toLowerCase()}</strong> · {opts.outputFormat.split("/")[1].toUpperCase()}</>
                  : <><strong>{t("options.targetSizeLabel")} {opts.targetSizeKb} KB</strong> · {opts.outputFormat.split("/")[1].toUpperCase()}</>}
                {opts.maxWidthEnabled ? ` · max ${opts.maxWidth}px wide` : ""}
              </p>
            </div>

            {/* Stats (after compression) */}
            {doneCount > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t("result.files"), value: doneCount },
                  { label: t("result.saved"), value: fmtSize(Math.max(0, totalSaved)) },
                  { label: t("result.avg"), value: `${avgPct}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20">
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{value}</span>
                    <span className="text-[10px] text-emerald-500/70 mt-0.5">{label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── File list ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            <DropZone onFiles={addFiles} />

            {items.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {items.length === 1 ? t("fileList.fileCount").replace("{count}", "1") : t("fileList.fileCountPlural").replace("{count}", String(items.length))}
                    {doneCount > 0 && <span className="text-emerald-500 ml-1">· {t("fileList.compressedCount").replace("{count}", String(doneCount))}</span>}
                  </span>
                  <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-red-500 transition-colors font-medium">
                    {t("fileList.clearAll")}
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <div key={item.id}>
                      <FileRow item={item} fmt={opts.outputFormat} onRemove={removeItem} />
                      {/* Expand compare on click */}
                      {item.status === "done" && item.result && (
                        <button
                          onClick={() => setPreview(preview?.id === item.id ? null : item)}
                          className="w-full mt-1 py-1.5 text-xs text-muted-foreground hover:text-blue-500 transition-colors font-medium flex items-center justify-center gap-1"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                          {preview?.id === item.id ? t("result.hideComparison") : t("result.showComparison")}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Before/after comparison */}
                {preview?.result && (
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      {t("result.dragToCompare")}
                    </p>
                    <CompareSlider original={preview.previewUrl} result={preview.result.url} />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground px-1">
                      <span>{t("result.original")} · {fmtSize(preview.originalSizeKb)}</span>
                      <span>{t("result.compressed")} · {fmtSize(preview.result.sizeKb)}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={compressAll}
                    disabled={compressing || items.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-blue-200 dark:shadow-blue-900/40"
                  >
                    {compressing
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("compress.compressing")}</>
                      : <><Minimize2 className="w-4 h-4" /> {t("compress.button")} ({items.length})</>}
                  </button>
                  {doneCount > 1 && (
                    <button onClick={downloadAll}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40">
                      <Download className="w-4 h-4" /> {t("download.downloadAll")} ({doneCount})
                    </button>
                  )}
                </div>

                {compressing && (
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${(doneCount / items.length) * 100}%` }} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <HowToUse tKey="image-tools/ImageCompressorTool.json" count={4} />
        <FAQ tKey="image-tools/ImageCompressorTool.json" />
        <Examples tKey="image-tools/ImageCompressorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}