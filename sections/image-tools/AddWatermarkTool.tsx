"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Stamp,
  Download,
  Sparkles,
  RefreshCw,
  Type,
  Image as ImageIcon,
  Move,
  AlignCenter,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { applyWatermark, fmtSize, fontOptions, formatOpts, ImageState, ImageWatermark, OutputFmt, positions, ProcessResult, TextWatermark, WatermarkOptions, WatermarkType } from "@/funcs/image-tools/AddWatermarkToolFuncs";
import DropZone from "@/components/image-tools/add-watermark/DropZone";
import SliderRow from "@/components/image-tools/add-watermark/SliderRow";
import RelatedTools from "@/components/image-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function AddWatermarkTool() {
  const t = useT("image-tools/AddWatermarkTool.json");

  const [baseImage, setBaseImage] = useState<ImageState | null>(null);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [outputFmt, setOutputFmt] = useState<OutputFmt>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [autoApply, setAutoApply] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [opts, setOpts] = useState<WatermarkOptions>({
    type: "text",
    position: "bottom-right",
    offsetX: 0,
    offsetY: 0,
    text: {
      text: "© Your Brand",
      font: "Arial",
      fontSize: 36,
      color: "#ffffff",
      opacity: 70,
      bold: true,
      italic: false,
      rotation: 0,
    },
    image: { url: "", scale: 20, opacity: 70, rotation: 0 },
  });

  const setOpt = <K extends keyof WatermarkOptions>(k: K, v: WatermarkOptions[K]) =>
    setOpts((o) => ({ ...o, [k]: v }));
  const setTextOpt = <K extends keyof TextWatermark>(k: K, v: TextWatermark[K]) =>
    setOpts((o) => ({ ...o, text: { ...o.text, [k]: v } }));
  const setImgOpt = <K extends keyof ImageWatermark>(k: K, v: ImageWatermark[K]) =>
    setOpts((o) => ({ ...o, image: { ...o.image, [k]: v } }));

  const loadBase = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setBaseImage({ file, url, width: img.naturalWidth, height: img.naturalHeight, sizeKb: Math.round(file.size / 1024) });
      setResult(null);
    };
    img.src = url;
  }, []);

  const loadWatermarkImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setImgOpt("url", url);
  }, []);

  const handleProcess = useCallback(async () => {
    if (!baseImage) return;
    setProcessing(true);
    try {
      const img = new window.Image();
      await new Promise<void>((res) => { img.onload = () => res(); img.src = baseImage.url; });
      const r = await applyWatermark(img, opts, outputFmt, quality);
      setResult(r);
    } finally {
      setProcessing(false);
    }
  }, [baseImage, opts, outputFmt, quality]);

  useEffect(() => {
    if (!baseImage || !autoApply) return;
    if (opts.type === "image" && !opts.image.url) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(handleProcess, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [baseImage, opts, outputFmt, quality, autoApply, handleProcess]);

  const handleDownload = () => {
    if (!result || !baseImage) return;
    const ext = formatOpts.find((f) => f.value === outputFmt)?.ext ?? "jpg";
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `${baseImage.file.name.replace(/\.[^.]+$/, "")}-watermarked.${ext}`;
    a.click();
  };

  const reset = () => { setBaseImage(null); setResult(null); };

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="image-tools/AddWatermarkTool.json" href="/image-tools" />

        {/* Header */}
        <Header tKey="image-tools/AddWatermarkTool.json" />

        {!baseImage ? (
          <div className="max-w-2xl mx-auto">
            <DropZone onFile={loadBase} label={t("dropzone.label")} />
            <p className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" /> {t("dropzone.privacyNote")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Controls ── */}
            <div className="flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-120px)] pr-1">

              {/* Watermark type */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.type")}</p>
                <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                  {[
                    { key: "text" as WatermarkType, icon: Type, label: t("options.text") },
                    { key: "image" as WatermarkType, icon: ImageIcon, label: t("options.image") },
                  ].map(({ key, icon: Icon, label }) => (
                    <button key={key} onClick={() => setOpt("type", key)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${opts.type === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text watermark settings */}
              {opts.type === "text" && (
                <div className="flex flex-col gap-4 p-4 rounded-2xl border border-border bg-card">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Type className="w-3.5 h-3.5" /> {t("options.textOptions")}
                  </p>
                  {/* Text input */}
                  <input
                    value={opts.text.text}
                    onChange={(e) => setTextOpt("text", e.target.value)}
                    placeholder={t("options.watermarkText")}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200"
                    aria-label={t("options.watermarkText")}
                  />
                  {/* Font */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">{t("options.font")}</label>
                    <select
                      value={opts.text.font}
                      onChange={(e) => setTextOpt("font", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all duration-200"
                    >
                      {fontOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  {/* Color + bold/italic */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">{t("options.color")}</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={opts.text.color}
                          onChange={(e) => setTextOpt("color", e.target.value)}
                          className="w-10 h-8 rounded-lg border border-border cursor-pointer"
                          aria-label={t("options.color")}
                        />
                        <span className="text-xs font-mono text-muted-foreground">{opts.text.color}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button onClick={() => setTextOpt("bold", !opts.text.bold)}
                        className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all duration-200 ${opts.text.bold ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-background text-foreground hover:border-blue-300"}`}
                        title={t("options.bold")}
                      >
                        B
                      </button>
                      <button onClick={() => setTextOpt("italic", !opts.text.italic)}
                        className={`w-9 h-9 rounded-lg border text-sm italic font-bold transition-all duration-200 ${opts.text.italic ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-background text-foreground hover:border-blue-300"}`}
                        title={t("options.italic")}
                      >
                        I
                      </button>
                    </div>
                  </div>
                  {/* Sliders */}
                  <div className="flex flex-col gap-3">
                    <SliderRow label={t("options.fontSize")} value={opts.text.fontSize} min={8} max={200} unit="px" onChange={(v) => setTextOpt("fontSize", v)} />
                    <SliderRow label={t("options.opacity")} value={opts.text.opacity} min={5} max={100} unit="%" onChange={(v) => setTextOpt("opacity", v)} />
                    <SliderRow label={t("options.rotation")} value={opts.text.rotation} min={-180} max={180} unit="°" onChange={(v) => setTextOpt("rotation", v)} />
                  </div>
                </div>
              )}

              {/* Image watermark settings */}
              {opts.type === "image" && (
                <div className="flex flex-col gap-4 p-4 rounded-2xl border border-border bg-card">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" /> {t("options.imageOptions")}
                  </p>
                  {opts.image.url ? (
                    <div className="flex items-center gap-3">
                      <img src={opts.image.url} alt="Watermark" className="w-16 h-16 object-contain rounded-lg border border-border bg-muted/40" />
                      <button onClick={() => setImgOpt("url", "")}
                        className="text-xs text-red-500 hover:underline">{t("options.remove")}</button>
                    </div>
                  ) : (
                    <DropZone onFile={loadWatermarkImage} label={t("options.label")} />
                  )}
                  <div className="flex flex-col gap-3">
                    <SliderRow label={t("options.scale")} value={opts.image.scale} min={1} max={100} unit="%" onChange={(v) => setImgOpt("scale", v)} />
                    <SliderRow label={t("options.opacity")} value={opts.image.opacity} min={5} max={100} unit="%" onChange={(v) => setImgOpt("opacity", v)} />
                    <SliderRow label={t("options.rotation")} value={opts.image.rotation} min={-180} max={180} unit="°" onChange={(v) => setImgOpt("rotation", v)} />
                  </div>
                </div>
              )}

              {/* Position picker */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
                  <Move className="w-3.5 h-3.5" /> {t("options.position")}
                </p>
                <div className="grid grid-cols-3 gap-1.5 w-40 mx-auto mb-3">
                  {positions.map(({ key, label }) => (
                    <button key={key} onClick={() => setOpt("position", key)}
                      className={`aspect-square rounded-lg border text-lg font-bold transition-all duration-200 ${opts.position === key
                        ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                        }`}
                      title={t(`positions.${key}`)}
                    >{label}</button>
                  ))}
                </div>
                {/* Tile option */}
                <button onClick={() => setOpt("position", "tile")}
                  className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${opts.position === "tile"
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"
                    }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" /> {t("options.tile")}
                </button>
              </div>

              {/* Offset (non-tile) */}
              {opts.position !== "tile" && (
                <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.fineTuneOffset")}</p>
                  <SliderRow label={t("options.xOffset")} value={opts.offsetX} min={-200} max={200} unit="px" onChange={(v) => setOpt("offsetX", v)} />
                  <SliderRow label={t("options.yOffset")} value={opts.offsetY} min={-200} max={200} unit="px" onChange={(v) => setOpt("offsetY", v)} />
                  <button onClick={() => { setOpt("offsetX", 0); setOpt("offsetY", 0); }}
                    className="text-xs text-muted-foreground hover:text-blue-500 transition-colors text-right">
                    {t("options.resetOffset")}
                  </button>
                </div>
              )}

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
                <button onClick={handleProcess} disabled={processing}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold transition-all duration-200">
                  {processing ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("apply.applying")}</> : <><Stamp className="w-4 h-4" /> {t("apply.button")}</>}
                </button>
              )}

              {result && (
                <button onClick={handleDownload}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40">
                  <Download className="w-4 h-4" /> {t("download")}
                  <span className="text-emerald-100 text-xs font-normal ml-1">
                    {formatOpts.find((f) => f.value === outputFmt)?.ext?.toUpperCase()}
                  </span>
                </button>
              )}

              <button onClick={reset}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200">
                <RefreshCw className="w-4 h-4" /> {t("options.uploadNewImage")}
              </button>
            </div>

            {/* ── Preview ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t("preview.originalSize"), value: fmtSize(baseImage.sizeKb) },
                  { label: t("preview.dimensions"), value: `${baseImage.width}×${baseImage.height}` },
                  { label: t("preview.outputSize"), value: result ? fmtSize(result.sizeKb) : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                    <span className="text-sm font-bold text-foreground">{value}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                  </div>
                ))}
              </div>

              {/* Processing */}
              {processing && (
                <div className="flex items-center justify-center gap-2 py-2 text-xs text-blue-500 font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t("apply.applying")}
                </div>
              )}

              {/* Side-by-side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("preview.original")}</span>
                  <div className="aspect-video rounded-xl border border-border overflow-hidden flex items-center justify-center bg-muted/20"
                    style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}>
                    <img src={baseImage.url} alt="Original" className="max-h-full max-w-full object-contain" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("preview.withWatermark")}</span>
                    {result && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {opts.position === "tile" ? t("preview.tiled") : t(`positions.${opts.position}`)}
                      </span>
                    )}
                  </div>
                  <div className="aspect-video rounded-xl border border-border overflow-hidden flex items-center justify-center bg-muted/20"
                    style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}>
                    {result ? (
                      <img src={result.url} alt="Watermarked" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
                        <Stamp className="w-8 h-8" />
                        <span className="text-xs">{t("preview.watermarkWillAppear")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Full preview */}
              {result && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("preview.fullPreview")}</span>
                  <div className="rounded-2xl border border-border overflow-hidden flex items-center justify-center bg-muted/20 max-h-[480px]"
                    style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}>
                    <img src={result.url} alt="Watermarked full" className="max-h-[480px] max-w-full object-contain" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <HowToUse tKey="image-tools/AddWatermarkTool.json" count={4} />
        <FAQ tKey="image-tools/AddWatermarkTool.json" />
        <Examples tKey="image-tools/AddWatermarkTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}