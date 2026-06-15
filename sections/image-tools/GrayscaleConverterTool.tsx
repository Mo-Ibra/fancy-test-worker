"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  CircleOff,
  Download,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { fmtSize, formatOpts, GrayscaleMethod, ImageState, methods, OutputFmt, processImage, ProcessResult } from "@/funcs/image-tools/GrayscaleConverterToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import DropZone from "@/components/image-tools/grayscale-converter/DropZone";
import SliderControl from "@/components/image-tools/grayscale-converter/SliderControl";
import CompareSlider from "@/components/image-tools/grayscale-converter/CompareSlider";
import RelatedTools from "@/components/image-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";


export default function GrayscaleConverterTool() {
  const t = useT("image-tools/GrayscaleConverterTool.json");

  const [image, setImage] = useState<ImageState | null>(null);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [method, setMethod] = useState<GrayscaleMethod>("luminance");
  const [intensity, setIntensity] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [outputFmt, setOutputFmt] = useState<OutputFmt>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [processing, setProcessing] = useState(false);
  const [autoApply, setAutoApply] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setImage({ file, originalUrl: url, width: img.naturalWidth, height: img.naturalHeight, sizeKb: Math.round(file.size / 1024) });
      setResult(null);
    };
    img.src = url;
  }, []);

  const handleProcess = useCallback(async (
    img: ImageState,
    m: GrayscaleMethod,
    i: number,
    c: number,
    br: number,
    fmt: OutputFmt,
    q: number
  ) => {
    setProcessing(true);
    try {
      const res = await processImage(img.originalUrl, m, i, c, br, fmt, q);
      setResult(res);
    } finally {
      setProcessing(false);
    }
  }, []);

  // Auto-apply on change
  useEffect(() => {
    if (!image || !autoApply) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleProcess(image, method, intensity, contrast, brightness, outputFmt, quality);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [image, method, intensity, contrast, brightness, outputFmt, quality, autoApply, handleProcess]);

  const handleDownload = () => {
    if (!result || !image) return;
    const ext = formatOpts.find((f) => f.value === outputFmt)?.ext ?? "jpg";
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${image.file.name.replace(/\.[^.]+$/, "")}-grayscale.${ext}`;
    a.click();
  };

  const reset = () => { setImage(null); setResult(null); };

  const selectedMethod = methods.find((m) => m.key === method)!;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="image-tools/GrayscaleConverterTool.json" href="/" />

        {/* Header */}
        <Header tKey="image-tools/GrayscaleConverterTool.json" />

        {!image ? (
          <div className="max-w-2xl mx-auto">
            <DropZone onFile={loadFile} />
            <p className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" /> {t("privacy")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Controls ── */}
            <div className="flex flex-col gap-5">

              {/* Method selector */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.conversionMethod")}</p>
                <div className="flex flex-col gap-1.5">
                  {methods.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMethod(m.key)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all duration-200 ${method === m.key
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                        : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/50"
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Mini color preview swatch */}
                        <div className={`w-5 h-5 rounded-md shrink-0 ${m.key === "sepia" ? "bg-linear-to-br from-yellow-700 to-yellow-900" :
                          m.key === "cool" ? "bg-linear-to-br from-blue-300 to-slate-500" :
                            m.key === "warm" ? "bg-linear-to-br from-orange-300 to-amber-600" :
                              "bg-linear-to-br from-slate-300 to-slate-600"
                          }`} />
                        <span className={`text-xs font-semibold ${method === m.key ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
                          {m.label}
                        </span>
                      </div>
                      {m.tag && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${m.tag === "Best" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
                          m.tag === "Tinted" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" : ""
                          }`}>{m.tag}</span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground/70 mt-2 px-1">{selectedMethod.description}</p>
              </div>

              {/* Adjustments */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> {t("options.adjustments")}
                </p>
                <div className="flex flex-col gap-4">
                  <SliderControl label="Intensity" value={intensity} min={0} max={100} unit="%" onChange={(v) => setIntensity(v)} tKey="options.intensity" />
                  <SliderControl label="Brightness" value={brightness} min={50} max={150} unit="%" onChange={(v) => setBrightness(v)} tKey="options.brightness" />
                  <SliderControl label="Contrast" value={contrast} min={50} max={150} unit="%" onChange={(v) => setContrast(v)} tKey="options.contrast" />
                </div>
                <button
                  onClick={() => { setIntensity(100); setBrightness(100); setContrast(100); }}
                  className="mt-3 w-full py-2 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-blue-500 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                >
                  {t("options.resetAdjustments")}
                </button>
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
                        }`}
                    >{label}</button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              {outputFmt !== "image/png" && (
                <SliderControl label="Quality" value={quality} min={1} max={100} unit="%" onChange={(v) => setQuality(v)} tKey="options.quality" />
              )}

              {/* Auto-apply toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t("options.autoApply")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("options.updatePreview")}</p>
                </div>
                <button
                  onClick={() => setAutoApply((p) => !p)}
                  className={`relative shrink-0 rounded-full transition-colors duration-200 ${autoApply ? "bg-blue-500" : "bg-border"}`}
                  style={{ width: 36, height: 20 }}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${autoApply ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* Manual apply if autoApply off */}
              {!autoApply && (
                <button
                  onClick={() => handleProcess(image, method, intensity, contrast, brightness, outputFmt, quality)}
                  disabled={processing}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-blue-200 dark:shadow-blue-900/40"
                >
                  {processing ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("convert.processing")}</> : <><CircleOff className="w-4 h-4" /> {t("convert.apply")}</>}
                </button>
              )}

              {/* Download */}
              {result && (
                <button onClick={handleDownload}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40"
                >
                  <Download className="w-4 h-4" />
                  {t("download.button")}
                  <span className="text-emerald-100 text-xs font-normal ml-1">
                    {formatOpts.find((f) => f.value === outputFmt)?.ext?.toUpperCase()}
                  </span>
                </button>
              )}

              <button onClick={reset}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" /> {t("download.uploadNew")}
              </button>
            </div>

            {/* ── Preview ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: t("options.method"), value: selectedMethod.label },
                  { label: t("options.intensity"), value: `${intensity}%` },
                  { label: t("preview.original"), value: fmtSize(image.sizeKb) },
                  { label: t("preview.result"), value: result ? fmtSize(result.sizeKb) : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                    <span className="text-sm font-bold text-foreground truncate max-w-full px-2 text-center">{value}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                  </div>
                ))}
              </div>

              {/* Processing indicator */}
              {processing && (
                <div className="flex items-center justify-center gap-2 py-2 text-xs text-blue-500 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t("convert.converting")}
                </div>
              )}

              {/* Compare slider */}
              {result ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("preview.beforeAfter")}</span>
                    <span className="text-xs text-muted-foreground/60">{t("preview.dragSlider")}</span>
                  </div>
                  <CompareSlider original={image.originalUrl} result={result.url} />
                </div>
              ) : (
                /* Plain original while processing */
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("preview.original")}</span>
                  <div className="aspect-video rounded-xl border border-border overflow-hidden flex items-center justify-center"
                    style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}>
                    <img src={image.originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                  </div>
                </div>
              )}

              {/* Side-by-side originals for reference */}
              {result && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("preview.original")}</span>
                    <div className="aspect-video rounded-xl border border-border overflow-hidden flex items-center justify-center bg-muted/20">
                      <img src={image.originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("preview.result")}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {selectedMethod.label}
                      </span>
                    </div>
                    <div className="aspect-video rounded-xl border border-border overflow-hidden flex items-center justify-center bg-muted/20">
                      <img src={result.url} alt="Grayscale" className="max-h-full max-w-full object-contain" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <HowToUse tKey="image-tools/GrayscaleConverterTool.json" count={4} />
        <FAQ tKey="image-tools/GrayscaleConverterTool.json" />
        <Examples tKey="image-tools/GrayscaleConverterTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}