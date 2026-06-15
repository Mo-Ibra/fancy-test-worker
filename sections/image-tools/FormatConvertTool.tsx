"use client";

import { useState, useCallback } from "react";
import {
  ImagePlus,
  Download,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { convertImage, ConvertOptions, FileItem, formats, loadImageInfo, uid } from "@/funcs/image-tools/FormatConvertToolFuncs";
import DropZone from "@/components/image-tools/format-convert/DropZone";
import FileRow from "@/components/image-tools/format-convert/FileRow";
import RelatedTools from "@/components/image-tools/RelatedTools";
import Header from "@/components/Header";
import BreadCrumb from "@/components/BreadCrumb";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function FormatConverterTool() {
  const t = useT("image-tools/FormatConvertTool.json");
  const [items, setItems] = useState<FileItem[]>([]);
  const [opts, setOpts] = useState<ConvertOptions>({
    outputFormat: "image/webp",
    quality: 85,
    maxWidth: null,
    maxHeight: null,
    resizeEnabled: false,
  });
  const [converting, setConverting] = useState(false);

  const set = <K extends keyof ConvertOptions>(key: K, val: ConvertOptions[K]) =>
    setOpts((o) => ({ ...o, [key]: val }));

  const addFiles = useCallback(async (files: File[]) => {
    const newItems: FileItem[] = await Promise.all(
      files.map(async (file) => {
        const { width, height, previewUrl } = await loadImageInfo(file);
        return {
          id: uid(),
          file,
          previewUrl,
          originalSizeKb: Math.round(file.size / 1024),
          width,
          height,
          status: "idle" as const,
        };
      })
    );
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clearAll = () => setItems([]);

  const convertAll = async () => {
    setConverting(true);
    for (const item of items) {
      if (item.status === "done") continue;
      setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: "processing" } : i));
      try {
        const result = await convertImage(item, opts);
        setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: "done", result } : i));
      } catch (e: any) {
        setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, status: "error", error: e.message } : i));
      }
    }
    setConverting(false);
  };

  const downloadAll = () => {
    const ext = formats.find((f) => f.value === opts.outputFormat)?.ext ?? "jpg";
    items.forEach((item) => {
      if (!item.result) return;
      const a = document.createElement("a");
      a.href = item.result.url;
      a.download = item.file.name.replace(/\.[^.]+$/, "") + "." + ext;
      a.click();
    });
  };

  const doneCount = items.filter((i) => i.status === "done").length;
  const selectedFmt = formats.find((f) => f.value === opts.outputFormat)!;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="image-tools/FormatConvertTool.json" href="/image-tools" />

        {/* ── Header ── */}
        <Header tKey="image-tools/FormatConvertTool.json" />

        {/* ── Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Settings ── */}
          <div className="flex flex-col gap-5">

            {/* Output format */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.outputFormat")}</p>
              <div className="flex flex-col gap-2">
                {formats.map((fmt) => (
                  <button
                    key={fmt.value}
                    onClick={() => set("outputFormat", fmt.value)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${opts.outputFormat === fmt.value
                      ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                      : "border-border bg-card text-foreground hover:border-blue-300 dark:hover:border-blue-700"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${opts.outputFormat === fmt.value
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                        }`}>.{fmt.ext}</span>
                      <span className="font-semibold">{fmt.label}</span>
                    </div>
                    <span className={`text-xs ${opts.outputFormat === fmt.value ? "text-blue-100" : "text-muted-foreground"}`}>
                      {fmt.lossy ? t("formatTypes.lossy") : t("formatTypes.lossless")}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground/70 mt-2 px-1">{selectedFmt.desc}</p>
            </div>

            {/* Quality (lossy only) */}
            {selectedFmt.lossy && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.quality")}</p>
                  <span className="text-sm font-bold text-blue-500">{opts.quality}%</span>
                </div>
                <input
                  type="range" min={1} max={100} value={opts.quality}
                  onChange={(e) => set("quality", Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                  aria-label={t("options.quality")}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
                  <span>{t("options.smallestFile")}</span><span>{t("options.bestQuality")}</span>
                </div>
              </div>
            )}

            {/* Optional resize */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.resizeOnConvert")}</p>
                <button
                  onClick={() => set("resizeEnabled", !opts.resizeEnabled)}
                  className={`relative shrink-0 rounded-full transition-colors duration-200 ${opts.resizeEnabled ? "bg-blue-500" : "bg-border"}`}
                  style={{ width: 36, height: 20 }}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${opts.resizeEnabled ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>

              {opts.resizeEnabled && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">{t("options.maxWidth")}</label>
                    <input
                      type="number" min={1} placeholder="e.g. 1920"
                      value={opts.maxWidth ?? ""}
                      onChange={(e) => set("maxWidth", e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                      aria-label={t("options.maxWidth")}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">{t("options.maxHeight")}</label>
                    <input
                      type="number" min={1} placeholder="e.g. 1080"
                      value={opts.maxHeight ?? ""}
                      onChange={(e) => set("maxHeight", e.target.value ? Number(e.target.value) : null)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                      aria-label={t("options.maxHeight")}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Summary badge */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {t("summary.convertingTo")} <strong>.{selectedFmt.ext.toUpperCase()}</strong>
                {selectedFmt.lossy ? ` ${t("summary.atQuality", { quality: opts.quality })}` : ` ${t("summary.lossless")}`}
                {opts.resizeEnabled && (opts.maxWidth || opts.maxHeight) ? ` · ${t("summary.maxDimensions", { width: opts.maxWidth ?? "∞", height: opts.maxHeight ?? "∞" })}` : ""}
              </p>
            </div>

            {/* Privacy note */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              {t("privacy.note")}
            </div>
          </div>

          {/* ── File list ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Drop zone */}
            <DropZone onFiles={addFiles} />

            {/* File list */}
            {items.length > 0 && (
              <>
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {items.length === 1 ? t("files.fileCount", { count: 1 }) : t("files.fileCount_plural", { count: items.length })}
                    {doneCount > 0 && <span className="text-emerald-500 ml-1">· {t("files.converted", { count: doneCount })}</span>}
                  </span>
                  <button
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-red-500 transition-colors duration-200 font-medium"
                  >
                    {t("clear")}
                  </button>
                </div>

                {/* List */}
                <div className="flex flex-col gap-2">
                  {items.map((item) => (
                    <FileRow
                      key={item.id}
                      item={item}
                      outputFmt={opts.outputFormat}
                      onRemove={removeItem}
                    />
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={convertAll}
                    disabled={converting || items.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-blue-200 dark:shadow-blue-900/40"
                  >
                    {converting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("convert.converting")}</>
                      : <><ImagePlus className="w-4 h-4" /> {t("convert.button")}</>}
                  </button>

                  {doneCount > 1 && (
                    <button
                      onClick={downloadAll}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40"
                    >
                      <Download className="w-4 h-4" />
                      {t("download.downloadAll")}
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                {converting && (
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${(doneCount / items.length) * 100}%` }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <HowToUse tKey="image-tools/FormatConvertTool.json" count={4} />
        <FAQ tKey="image-tools/FormatConvertTool.json" />
        <Examples tKey="image-tools/FormatConvertTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}