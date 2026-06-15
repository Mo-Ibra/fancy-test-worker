"use client";

import { useState, useCallback } from "react";
import {
  FlipHorizontal,
  FlipVertical,
  Download,
  Sparkles,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { flipImage, FlipMode, FlipResult, fmtSize, formatOpts, ImageState, OutputFmt } from "@/funcs/image-tools/ImageFlipperToolFuncs";
import { DropZone } from "@/components/image-tools/image-flipper/DropZone";
import FlipButton from "@/components/image-tools/image-flipper/FlipButton";
import PreviewPanel from "@/components/image-tools/image-flipper/PreviewPanel";
import RelatedTools from "@/components/image-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function ImageFlipperTool() {
  const t = useT("image-tools/ImageFlipperTool.json");

  const [image, setImage] = useState<ImageState | null>(null);
  const [result, setResult] = useState<FlipResult | null>(null);
  const [flipMode, setFlipMode] = useState<FlipMode>("horizontal");
  const [outputFmt, setOutputFmt] = useState<OutputFmt>("image/png");
  const [quality, setQuality] = useState(90);
  const [processing, setProcessing] = useState(false);

  const loadFile = useCallback(async (file: File) => {
    return new Promise<void>((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        setImage({ file, originalUrl: url, width: img.naturalWidth, height: img.naturalHeight, sizeKb: Math.round(file.size / 1024) });
        setResult(null);
        resolve();
      };
      img.src = url;
    });
  }, []);

  const handleFlip = async () => {
    if (!image) return;
    setProcessing(true);
    try {
      const res = await flipImage(image.originalUrl, flipMode, outputFmt, quality);
      setResult(res);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !image) return;
    const ext = formatOpts.find((f) => f.value === outputFmt)?.ext ?? "png";
    const name = image.file.name.replace(/\.[^.]+$/, "");
    const suffix = flipMode === "horizontal" ? "flip-h" : flipMode === "vertical" ? "flip-v" : "flip-hv";
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${name}-${suffix}.${ext}`;
    a.click();
  };

  const reset = () => { setImage(null); setResult(null); };

  const flipModes: { mode: FlipMode; icon: React.ElementType; labelKey: string; descKey: string }[] = [
    { mode: "horizontal", icon: FlipHorizontal, labelKey: "flip.horizontal", descKey: "flip.mirrorLeftRight" },
    { mode: "vertical", icon: FlipVertical, labelKey: "flip.vertical", descKey: "flip.mirrorTopBottom" },
    { mode: "both", icon: RotateCcw, labelKey: "flip.both", descKey: "flip.bothAxes" },
  ];
  const currentFlipMode = flipModes.find((m) => m.mode === flipMode);
  const currentFlipLabel = currentFlipMode ? t(currentFlipMode.labelKey) : "";

  const modeLabel =
    flipMode === "horizontal" ? t("result.flippedHorizontally") :
      flipMode === "vertical" ? t("result.flippedVertically") :
        t("result.flippedBothAxes");

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="image-tools/ImageFlipperTool.json" href="/image-tools" />

        {/* Header */}
        <Header tKey="image-tools/ImageFlipperTool.json" />

        {/* ── Upload state ── */}
        {!image ? (
          <div className="max-w-2xl mx-auto">
            <DropZone onFile={loadFile} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Controls ── */}
            <div className="flex flex-col gap-5">

              {/* Flip mode */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("flip.direction")}</p>
                <div className="grid grid-cols-3 gap-2">
                  {flipModes.map(({ mode, icon, labelKey, descKey }) => (
                    <FlipButton
                      key={mode}
                      mode={mode}
                      active={flipMode === mode}
                      onClick={() => { setFlipMode(mode); setResult(null); }}
                      icon={icon}
                      label={t(labelKey)}
                      description={t(descKey)}
                    />
                  ))}
                </div>
              </div>

              {/* Output format */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.outputFormat")}</p>
                <div className="grid grid-cols-3 gap-2">
                  {formatOpts.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => { setOutputFmt(value); setResult(null); }}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${outputFmt === value
                        ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality (JPEG/WebP) */}
              {outputFmt !== "image/png" && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.quality")}</p>
                    <span className="text-sm font-bold text-blue-500">{quality}%</span>
                  </div>
                  <input
                    type="range" min={1} max={100} value={quality}
                    onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }}
                    className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                    aria-label={t("options.quality")}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
                    <span>{t("options.smallest")}</span><span>{t("options.bestQuality")}</span>
                  </div>
                </div>
              )}

              {/* Image info */}
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("result.imageInfo")}</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: t("result.filename"), value: image.file.name },
                    { label: t("result.dimensions"), value: `${image.width} × ${image.height} px` },
                    { label: t("result.fileSize"), value: fmtSize(image.sizeKb) },
                    { label: t("result.flipMode"), value: currentFlipLabel },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                      <span className="text-xs text-foreground font-medium truncate max-w-[140px] text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary badge */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20">
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {t("summary.flip")} <strong>{currentFlipLabel}</strong> · {formatOpts.find((f) => f.value === outputFmt)?.label}
                  {outputFmt !== "image/png" ? ` · ${quality}% ${t("options.quality").toLowerCase()}` : ""}
                </p>
              </div>

              {/* Actions */}
              <button
                onClick={handleFlip}
                disabled={processing}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-blue-200 dark:shadow-blue-900/40"
              >
                {processing ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> {t("flip.processing")}</>
                ) : (
                  <><FlipHorizontal className="w-4 h-4" /> {t("button.flip")}</>
                )}
              </button>

              {result && (
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40"
                >
                  <Download className="w-4 h-4" />
                  {t("download")}
                  <span className="text-emerald-100 text-xs font-normal ml-1">
                    {image.width}×{image.height} · {formatOpts.find((f) => f.value === outputFmt)?.ext?.toUpperCase()}
                  </span>
                </button>
              )}

              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" /> {t("actions.uploadNew")}
              </button>
            </div>

            {/* ── Previews ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t("result.dimensions"), value: `${image.width}×${image.height}` },
                  { label: t("result.originalSize"), value: fmtSize(image.sizeKb) },
                  { label: t("result.outputSize"), value: result ? fmtSize(result.sizeKb) : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                    <span className="text-base font-bold text-foreground">{value}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                  </div>
                ))}
              </div>

              {/* Before */}
              <PreviewPanel
                label={t("result.original")}
                src={image.originalUrl}
                width={image.width}
                height={image.height}
                sizeKb={image.sizeKb}
              />

              {/* After */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("result.result")}</span>
                  {result && (
                    <span className="text-[10px] text-muted-foreground/60">
                      {image.width}×{image.height} · {fmtSize(result.sizeKb)}
                    </span>
                  )}
                </div>
                <div
                  className="relative aspect-video rounded-xl border border-border overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
                    backgroundSize: "12px 12px",
                    backgroundPosition: "0 0,0 6px,6px -6px,-6px 0",
                  }}
                >
                  <div className="absolute inset-0 opacity-20 dark:opacity-10" />
                  {result ? (
                    <>
                      <img src={result.url} alt="Flipped" className="relative max-h-full max-w-full object-contain" />
                      <span className="absolute top-2 right-2 text-[10px] font-bold bg-blue-500/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {modeLabel}
                      </span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                      <FlipHorizontal className="w-8 h-8" />
                      <span className="text-xs">{t("result.clickToPreview")}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        <HowToUse tKey="image-tools/ImageFlipperTool.json" count={4} />
        <FAQ tKey="image-tools/ImageFlipperTool.json" />
        <Examples tKey="image-tools/ImageFlipperTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}