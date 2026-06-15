"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Crop,
  Download,
  Link2,
  Link2Off,
  RefreshCw,
  Image as ImageIcon,
  Settings2,
  Sparkles,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { FitMode, fmtSize, formatOptions, ImageInfo, presets, resizeImage, ResizeMode, ResizeOptions } from "@/funcs/image-tools/ImageResizerToolFuncs";
import DropZone from "@/components/image-tools/image-resizer/DropZone";
import RelatedTools from "@/components/image-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function ImageResizerTool() {
  const t = useT("image-tools/ImageResizerTool.json");

  const [image, setImage] = useState<ImageInfo | null>(null);
  const [result, setResult] = useState<{ url: string; width: number; height: number; sizeKb: number } | null>(null);
  const [processing, setProcessing] = useState(false);

  const [opts, setOpts] = useState<ResizeOptions>({
    mode: "pixels",
    width: 800,
    height: 600,
    percentage: 50,
    lockAspect: true,
    fitMode: "contain",
    quality: 85,
    outputFormat: "image/jpeg",
  });

  const set = <K extends keyof ResizeOptions>(key: K, val: ResizeOptions[K]) =>
    setOpts((o) => ({ ...o, [key]: val }));

  // Load image
  const loadImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImage({ file, url, width: img.naturalWidth, height: img.naturalHeight, sizeKb: Math.round(file.size / 1024) });
      setOpts((o) => ({ ...o, width: img.naturalWidth, height: img.naturalHeight }));
      setResult(null);
    };
    img.src = url;
  }, []);

  // Aspect-ratio aware width/height changes
  const handleWidthChange = (val: number) => {
    if (opts.lockAspect && image) {
      set("height", Math.round(val / (image.width / image.height)));
    }
    set("width", val);
  };

  const handleHeightChange = (val: number) => {
    if (opts.lockAspect && image) {
      set("width", Math.round(val * (image.width / image.height)));
    }
    set("height", val);
  };

  const applyPreset = (p: typeof presets[0]) => {
    set("width", p.width);
    set("height", p.height);
    set("mode", "pixels");
    set("lockAspect", false);
  };

  // Compute actual target dimensions
  const targetW = opts.mode === "percentage" && image
    ? Math.round(image.width * opts.percentage / 100)
    : opts.width;
  const targetH = opts.mode === "percentage" && image
    ? Math.round(image.height * opts.percentage / 100)
    : opts.height;

  const handleResize = async () => {
    if (!image) return;
    setProcessing(true);
    try {
      const res = await resizeImage(image.url, targetW, targetH, opts.fitMode, opts.outputFormat, opts.quality);
      setResult(res);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const ext = formatOptions.find((f) => f.value === opts.outputFormat)?.ext ?? "jpg";
    const name = image?.file.name.replace(/\.[^.]+$/, "") ?? "resized";
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${name}-${result.width}x${result.height}.${ext}`;
    a.click();
  };

  const reset = () => { setImage(null); setResult(null); };

  const compressionRatio = image && result
    ? Math.round((1 - result.sizeKb / image.sizeKb) * 100)
    : 0;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* ── Breadcrumb ── */}
        <BreadCrumb tKey="image-tools/ImageResizerTool.json" href="/image-tools" />

        <Header tKey="image-tools/ImageResizerTool.json" />

        {/* ── Upload or main layout ── */}
        {!image ? (
          <div className="max-w-2xl mx-auto">
            <DropZone onFile={loadImage} />
            {/* Privacy note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              {t("privacy.localProcessing")}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Controls sidebar ── */}
            <div className="flex flex-col gap-5">

              {/* Mode tabs */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5" /> {t("options.resizeMode")}
                </p>
                <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                  {(["pixels", "percentage", "preset"] as ResizeMode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => set("mode", m)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-200 ${opts.mode === m ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pixels mode */}
              {opts.mode === "pixels" && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.dimensions")}</p>
                    <button
                      onClick={() => set("lockAspect", !opts.lockAspect)}
                      title={opts.lockAspect ? t("options.unlockAspect") : t("options.lockAspect")}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all duration-200 ${opts.lockAspect
                        ? "border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-900/20 text-blue-500"
                        : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                    >
                      {opts.lockAspect ? <Link2 className="w-3.5 h-3.5" /> : <Link2Off className="w-3.5 h-3.5" />}
                      {opts.lockAspect ? t("options.locked") : t("options.free")}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">{t("options.widthPx")}</label>
                      <input
                        type="number"
                        min={1}
                        value={opts.width}
                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm text-center font-bold focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                        aria-label={t("options.widthPx")}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">{t("options.heightPx")}</label>
                      <input
                        type="number"
                        min={1}
                        value={opts.height}
                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm text-center font-bold focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                        aria-label={t("options.heightPx")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Percentage mode */}
              {opts.mode === "percentage" && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.scale")}</p>
                    <span className="text-sm font-bold text-blue-500">{opts.percentage}%</span>
                  </div>
                  <input
                    type="range" min={1} max={200} value={opts.percentage}
                    onChange={(e) => set("percentage", Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer mb-3"
                    aria-label={t("options.scale")}
                  />
                  <div className="flex gap-2">
                    {[25, 50, 75, 100, 150, 200].map((p) => (
                      <button
                        key={p}
                        onClick={() => set("percentage", p)}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 ${opts.percentage === p
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                          }`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                  {image && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      → {Math.round(image.width * opts.percentage / 100)} × {Math.round(image.height * opts.percentage / 100)} px
                    </p>
                  )}
                </div>
              )}

              {/* Preset mode */}
              {opts.mode === "preset" && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("presets.choosePreset")}</p>
                  <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                    {presets.map((p) => {
                      const active = opts.width === p.width && opts.height === p.height;
                      return (
                        <button
                          key={p.key}
                          onClick={() => applyPreset(p)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 ${active
                            ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                            : "border-border bg-card text-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                            }`}
                        >
                          <span className="font-semibold">{t(`presets.${p.key}`)}</span>
                          <code className={`text-[11px] font-mono ${active ? "text-blue-100" : "text-muted-foreground"}`}>
                            {p.width}×{p.height}
                          </code>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Fit mode */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.fitMode")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["contain", "cover", "fill", "none"] as FitMode[]).map((fm) => (
                    <button
                      key={fm}
                      onClick={() => set("fitMode", fm)}
                      className={`py-2.5 rounded-xl border text-xs font-semibold capitalize transition-all duration-200 ${opts.fitMode === fm
                        ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                        }`}
                    >
                      {fm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output format */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.outputFormat")}</p>
                <div className="grid grid-cols-3 gap-2">
                  {formatOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => set("outputFormat", value)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${opts.outputFormat === value
                        ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality (JPEG/WebP only) */}
              {opts.outputFormat !== "image/png" && (
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
                    <span>{t("options.smallest")}</span><span>{t("options.bestQuality")}</span>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <button
                onClick={handleResize}
                disabled={processing || !image}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-blue-200 dark:shadow-blue-900/40"
              >
                {processing
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("resize.processing")}</>
                  : <><Crop className="w-4 h-4" /> {t("resize.button")}</>}
              </button>

              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" /> {t("resize.uploadNew")}
              </button>
            </div>

            {/* ── Preview panel ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Image info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: t("result.originalSize"), value: fmtSize(image.sizeKb) },
                  { label: t("result.dimensions"), value: `${image.width}×${image.height}` },
                  { label: t("result.target"), value: `${targetW}×${targetH}` },
                  { label: result ? t("result.outputSize") : t("result.format"), value: result ? fmtSize(result.sizeKb) : formatOptions.find(f => f.value === opts.outputFormat)?.label ?? "" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                    <span className="text-sm font-bold text-foreground">{value}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5 text-center">{label}</span>
                  </div>
                ))}
              </div>

              {/* Before / After preview */}
              <div className="grid grid-cols-2 gap-4">
                {/* Original */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("result.original")}</span>
                    <span className="text-[10px] text-muted-foreground/60">{image.width}×{image.height} · {fmtSize(image.sizeKb)}</span>
                  </div>
                  <div className="relative aspect-video rounded-xl border border-border bg-muted/30 dark:bg-muted/10 overflow-hidden flex items-center justify-center">
                    {/* Checkerboard for transparency */}
                    <div className="absolute inset-0 opacity-30"
                      style={{ backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px" }}
                    />
                    <img src={image.url} alt="Original" className="relative max-h-full max-w-full object-contain" />
                  </div>
                </div>

                {/* Result */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("result.result")}</span>
                      {result && (
                        <span className="text-[10px] text-muted-foreground/60">{result.width}×{result.height} · {fmtSize(result.sizeKb)}</span>
                      )}
                    </div>
                    {result && compressionRatio > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                        {t("result.sizeReduction", { ratio: compressionRatio })}
                      </span>
                    )}
                  </div>
                  <div className="relative aspect-video rounded-xl border border-border bg-muted/30 dark:bg-muted/10 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-30"
                      style={{ backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px" }}
                    />
                    {result ? (
                      <img src={result.url} alt="Resized" className="relative max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="relative flex flex-col items-center gap-2 text-muted-foreground/40">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs">{t("result.clickResize")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Download button */}
              {result && (
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40"
                >
                  <Download className="w-4 h-4" />
                  {t("downloadResized")}
                  <span className="text-emerald-100 text-xs font-normal ml-1">
                    {targetW}×{targetH} · {formatOptions.find(f => f.value === opts.outputFormat)?.label}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        <HowToUse tKey="image-tools/ImageResizerTool.json" count={4} />
        <FAQ tKey="image-tools/ImageResizerTool.json" />
        <Examples tKey="image-tools/ImageResizerTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}