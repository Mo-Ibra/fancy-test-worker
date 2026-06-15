"use client";

import { useState, useCallback } from "react";
import {
  RotateCw,
  RotateCcw,
  Download,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { BgFill, fmtSize, formatOpts, ImageState, OutputFmt, PRESET_ANGLES, rotateImage, RotateResult } from "@/funcs/image-tools/ImageRotatorToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import DropZone from "@/components/image-tools/image-rotator/DropZone";
import AngleDial from "@/components/image-tools/image-rotator/AngleDial";
import RelatedTools from "@/components/image-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function ImageRotatorTool() {
  const t = useT("image-tools/ImageRotatorTool.json");

  const [image, setImage] = useState<ImageState | null>(null);
  const [result, setResult] = useState<RotateResult | null>(null);
  const [angle, setAngle] = useState<number>(90);
  const [customMode, setCustomMode] = useState(false);
  const [customVal, setCustomVal] = useState("45");
  const [outputFmt, setOutputFmt] = useState<OutputFmt>("image/png");
  const [quality, setQuality] = useState(90);
  const [bgFill, setBgFill] = useState<BgFill>("transparent");
  const [processing, setProcessing] = useState(false);

  const loadFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImage({ file, originalUrl: url, width: img.naturalWidth, height: img.naturalHeight, sizeKb: Math.round(file.size / 1024) });
      setResult(null);
    };
    img.src = url;
  }, []);

  const effectiveAngle = customMode ? (Number(customVal) || 0) : angle;

  const handleRotate = async () => {
    if (!image) return;
    setProcessing(true);
    try {
      const res = await rotateImage(image.originalUrl, effectiveAngle, outputFmt, quality, bgFill);
      setResult(res);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !image) return;
    const ext = formatOpts.find((f) => f.value === outputFmt)?.ext ?? "png";
    const name = image.file.name.replace(/\.[^.]+$/, "");
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${name}-rotated-${effectiveAngle}deg.${ext}`;
    a.click();
  };

  const reset = () => { setImage(null); setResult(null); };

  // Quick rotate buttons (step by 90)
  const quickRotate = (delta: number) => {
    setCustomMode(false);
    setAngle((prev) => {
      const next = ((prev + delta) % 360 + 360) % 360;
      return next > 180 ? next - 360 : next;
    });
    setResult(null);
  };

  const bgOptions: { value: BgFill; label: string; preview: string }[] = [
    { value: "transparent", label: t("result.transparentBg"), preview: "checkerboard" },
    { value: "white", label: t("result.whiteBg"), preview: "#ffffff" },
    { value: "black", label: t("result.blackBg"), preview: "#000000" },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="image-tools/ImageRotatorTool.json" href="/image-tools" />

        {/* Header */}
        <Header tKey="image-tools/ImageRotatorTool.json" />

        {!image ? (
          <div className="max-w-2xl mx-auto">
            <DropZone onFile={loadFile} />
            <p className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" /> {t("privacy.localProcessing")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Controls ── */}
            <div className="flex flex-col gap-5">

              {/* Quick rotate */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("options.quickRotate")}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => quickRotate(-90)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4" /> {t("rotate.ccw")}
                  </button>
                  <button
                    onClick={() => quickRotate(90)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all duration-200"
                  >
                    <RotateCw className="w-4 h-4" /> {t("rotate.cw")}
                  </button>
                </div>
              </div>

              {/* Angle selector */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.rotationAngle")}</p>

                {/* Dial + value display */}
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card mb-3">
                  <AngleDial angle={effectiveAngle} />
                  <div>
                    <p className="text-3xl font-bold text-blue-500 tabular-nums leading-none">
                      {effectiveAngle > 0 ? "+" : ""}{effectiveAngle}°
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {effectiveAngle === 0 ? t("result.noRotation") :
                        effectiveAngle > 0 ? t("result.clockwise") : t("result.counterClockwise")}
                    </p>
                  </div>
                </div>

                {/* Preset grid */}
                <div className="grid grid-cols-4 gap-1.5 mb-3">
                  {PRESET_ANGLES.map(({ label, value }) => {
                    const isCustom = value === null;
                    const isActive = isCustom ? customMode : !customMode && angle === value;
                    return (
                      <button
                        key={label}
                        onClick={() => {
                          if (isCustom) { setCustomMode(true); }
                          else { setCustomMode(false); setAngle(value!); setResult(null); }
                        }}
                        className={`py-2 rounded-lg border text-[11px] font-bold transition-all duration-200 ${isActive
                          ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                          }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom input */}
                {customMode && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={-360} max={360}
                      value={customVal}
                      onChange={(e) => { setCustomVal(e.target.value); setResult(null); }}
                      placeholder="e.g. 33"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-card text-foreground text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                      aria-label={t("options.rotationAngle")}
                    />
                    <span className="text-sm font-bold text-muted-foreground">{t("options.degrees")}</span>
                  </div>
                )}

                {/* Slider for fine control */}
                {!customMode && (
                  <div className="mt-3">
                    <input
                      type="range" min={-180} max={180} value={angle}
                      onChange={(e) => { setAngle(Number(e.target.value)); setResult(null); }}
                      className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                      aria-label={t("options.rotationAngle")}
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
                      <span>-180°</span><span>0°</span><span>+180°</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Background fill */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.backgroundFill")}</p>
                <div className="grid grid-cols-3 gap-2">
                  {bgOptions.map(({ value, label, preview }) => (
                    <button
                      key={value}
                      onClick={() => { setBgFill(value); setResult(null); }}
                      className={`flex flex-col items-center gap-2 py-3 rounded-xl border transition-all duration-200 ${bgFill === value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                        : "border-border bg-card hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                    >
                      {preview === "checkerboard" ? (
                        <div className="w-6 h-6 rounded border border-border"
                          style={{ backgroundImage: "linear-gradient(45deg,#aaa 25%,transparent 25%),linear-gradient(-45deg,#aaa 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#aaa 75%),linear-gradient(-45deg,transparent 75%,#aaa 75%)", backgroundSize: "6px 6px", backgroundPosition: "0 0,0 3px,3px -3px,-3px 0" }}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded border border-border" style={{ background: preview }} />
                      )}
                      <span className={`text-[10px] font-bold ${bgFill === value ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}>{label}</span>
                    </button>
                  ))}
                </div>
                {bgFill === "transparent" && outputFmt === "image/jpeg" && (
                  <p className="text-[10px] text-amber-500 mt-2 flex items-start gap-1">
                    ⚠ {t("warnings.jpegNoTransparency")}
                  </p>
                )}
              </div>

              {/* Output format */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.outputFormat")}</p>
                <div className="grid grid-cols-3 gap-2">
                  {formatOpts.map(({ value, label }) => (
                    <button key={value} onClick={() => { setOutputFmt(value); setResult(null); }}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 ${outputFmt === value
                        ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                        }`}
                    >{label}</button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              {outputFmt !== "image/png" && (
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.quality")}</p>
                    <span className="text-sm font-bold text-blue-500">{quality}%</span>
                  </div>
                  <input type="range" min={1} max={100} value={quality}
                    onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }}
                    className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                    aria-label={t("options.quality")}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
                    <span>{t("options.smallest")}</span><span>{t("options.bestQuality")}</span>
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20">
                <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {t("options.angle")} <strong>{effectiveAngle > 0 ? "+" : ""}{effectiveAngle}°</strong>
                  {" · "}{formatOpts.find((f) => f.value === outputFmt)?.label}
                  {" · "}{bgFill === "transparent" ? t("result.transparentBg") : bgFill === "white" ? t("result.whiteBg") : t("result.blackBg")}
                </p>
              </div>

              {/* Actions */}
              <button
                onClick={handleRotate}
                disabled={processing || effectiveAngle === 0}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-blue-200 dark:shadow-blue-900/40"
              >
                {processing
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("rotate.processing")}</>
                  : <><RotateCw className="w-4 h-4" /> {t("rotate.button")}</>}
              </button>

              {result && (
                <button onClick={handleDownload}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40"
                >
                  <Download className="w-4 h-4" />
                  {t("download")}
                  <span className="text-emerald-100 text-xs font-normal ml-1">
                    {result.width}×{result.height} · {formatOpts.find((f) => f.value === outputFmt)?.ext?.toUpperCase()}
                  </span>
                </button>
              )}

              <button onClick={reset}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" /> {t("actions.uploadNew")}
              </button>
            </div>

            {/* ── Preview ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: t("stats.angle"), value: `${effectiveAngle > 0 ? "+" : ""}${effectiveAngle}°` },
                  { label: t("stats.original"), value: `${image.width}×${image.height}` },
                  { label: t("stats.output"), value: result ? `${result.width}×${result.height}` : "—" },
                  { label: t("stats.outputSize"), value: result ? fmtSize(result.sizeKb) : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                    <span className="text-base font-bold text-foreground">{value}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                  </div>
                ))}
              </div>

              {/* Before */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  {t("result.original2")}
                  <span className="font-normal text-muted-foreground/60">{image.width}×{image.height} · {fmtSize(image.sizeKb)}</span>
                </span>
                <div className="relative aspect-video rounded-xl border border-border overflow-hidden flex items-center justify-center bg-muted/20"
                  style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}>
                  <div className="absolute inset-0 opacity-10 dark:opacity-5" />
                  <img src={image.originalUrl} alt="Original" className="relative max-h-full max-w-full object-contain" />
                </div>
              </div>

              {/* After */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  {t("result.result")}
                  {result && <span className="font-normal text-muted-foreground/60">{result.width}×{result.height} · {fmtSize(result.sizeKb)}</span>}
                </span>
                <div className="relative aspect-video rounded-xl border border-border overflow-hidden flex items-center justify-center bg-muted/20"
                  style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}>
                  <div className="absolute inset-0 opacity-10 dark:opacity-5" />
                  {result ? (
                    <>
                      <img
                        src={result.url}
                        alt="Rotated"
                        className="relative max-h-full max-w-full object-contain"
                      />
                      <span className="absolute top-2 right-2 text-[10px] font-bold bg-blue-500/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {effectiveAngle > 0 ? "+" : ""}{effectiveAngle}° {t("result.rotated")}
                      </span>
                    </>
                  ) : (
                    <div className="relative flex flex-col items-center gap-2 text-muted-foreground/40">
                      <RotateCw className="w-8 h-8" />
                      <span className="text-xs">{t("result.clickToPreview")}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        <HowToUse tKey="image-tools/ImageRotatorTool.json" count={4} />
        <FAQ tKey="image-tools/ImageRotatorTool.json" />
        <Examples tKey="image-tools/ImageRotatorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}