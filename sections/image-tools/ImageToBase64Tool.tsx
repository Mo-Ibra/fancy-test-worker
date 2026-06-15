"use client";

import { useState, useCallback } from "react";
import {
  Code2,
  FileImage,
  Sparkles,
  RefreshCw,
  Download,
  ArrowLeftRight,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { b64Size, decodeBase64, fileToInfo, fmtSize, getWrapper, ImageInfo, Mode, OutputWrapper, wrapperOptions } from "@/funcs/image-tools/ImageToBase64ToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import WrapperBtn from "@/components/image-tools/image-to-base64/WrapperBtn";
import DropZone from "@/components/image-tools/image-to-base64/DropZone";
import CopyButton from "@/components/image-tools/image-to-base64/CopyButton";
import RelatedTools from "@/components/image-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function ImageToBase64Tool() {
  const t = useT("image-tools/ImageToBase64Tool.json");

  const [mode, setMode] = useState<Mode>("encode");
  const [info, setInfo] = useState<ImageInfo | null>(null);
  const [wrapper, setWrapper] = useState<OutputWrapper>("dataurl");
  const [showFull, setShowFull] = useState(false);

  // Decode mode state
  const [decodeInput, setDecodeInput] = useState("");
  const [decodeResult, setDecodeResult] = useState<{ dataUrl: string; type: string; sizeKb: number } | null>(null);
  const [decodeError, setDecodeError] = useState("");
  const [decodeImgInfo, setDecodeImgInfo] = useState<{ width: number; height: number } | null>(null);

  const loadFile = useCallback(async (file: File) => {
    const result = await fileToInfo(file);
    setInfo(result);
    setShowFull(false);
  }, []);

  const outputValue = info ? getWrapper(info, wrapper) : "";
  const displayValue = showFull ? outputValue : outputValue.slice(0, 800) + (outputValue.length > 800 ? "…" : "");

  const handleDecode = () => {
    setDecodeError("");
    setDecodeResult(null);
    setDecodeImgInfo(null);
    if (!decodeInput.trim()) return;
    const result = decodeBase64(decodeInput);
    if (!result) { setDecodeError(t("decode.invalid")); return; }
    setDecodeResult(result);
    // Get dimensions
    const img = new window.Image();
    img.onload = () => setDecodeImgInfo({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = result.dataUrl;
  };

  const downloadDecoded = () => {
    if (!decodeResult) return;
    const ext = decodeResult.type.split("/")[1] ?? "jpg";
    const a = document.createElement("a");
    a.href = decodeResult.dataUrl;
    a.download = `decoded-image.${ext}`;
    a.click();
  };

  const reset = () => { setInfo(null); setDecodeInput(""); setDecodeResult(null); setDecodeError(""); };

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="image-tools/ImageToBase64Tool.json" href="/image-tools" />

        {/* Header */}
        <Header tKey="image-tools/ImageToBase64Tool.json" />

        {/* Mode toggle */}
        <div className="flex gap-1 p-1 rounded-xl border border-border bg-card w-fit mb-8">
          {([
            { key: "encode" as Mode, label: t("tabs.encodeLabel") },
            { key: "decode" as Mode, label: t("tabs.decodeLabel") },
          ]).map(({ key, label }) => (
            <button key={key} onClick={() => { setMode(key); reset(); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* ── ENCODE MODE ── */}
        {mode === "encode" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: settings */}
            <div className="flex flex-col gap-5">

              {/* Output wrapper */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("encode.outputFormat")}</p>
                <div className="flex flex-col gap-2">
                  {wrapperOptions.map(({ key, label, preview }) => (
                    <WrapperBtn
                      key={key}
                      active={wrapper === key}
                      onClick={() => setWrapper(key)}
                      label={label}
                      preview={preview}
                    />
                  ))}
                </div>
              </div>

              {/* Image info */}
              {info && (
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("encode.imageInfo")}</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: t("encode.filename"), value: info.name },
                      { label: t("encode.type"), value: info.type },
                      { label: t("encode.dimensions"), value: `${info.width} × ${info.height} px` },
                      { label: t("encode.fileSize"), value: fmtSize(info.sizeKb) },
                      { label: t("encode.base64Size"), value: fmtSize(b64Size(info.base64)) },
                      { label: t("encode.sizeRatio"), value: t("encode.sizeRatio", { ratio: Math.round(b64Size(info.base64) / info.sizeKb * 100) }) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 mt-0.5">{label}</span>
                        <span className="text-xs text-foreground font-medium truncate max-w-[140px] text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {info && (
                <button onClick={() => setInfo(null)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200">
                  <RefreshCw className="w-4 h-4" /> {t("encode.uploadNewImage")}
                </button>
              )}
            </div>

            {/* Right: upload + output */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {!info ? (
                <>
                  <DropZone onFile={loadFile} />
                  <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    {t("dropzone.privacyNote")}
                  </p>
                </>
              ) : (
                <>
                  {/* Image preview */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("preview.label")}</span>
                    <div className="relative h-44 rounded-2xl border border-border overflow-hidden flex items-center justify-center"
                      style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}>
                      <div className="absolute inset-0 opacity-10 dark:opacity-5" />
                      <img src={info.dataUrl} alt={info.name} className="relative max-h-full max-w-full object-contain" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: t("stats.original"), value: fmtSize(info.sizeKb) },
                      { label: t("stats.base64Size"), value: fmtSize(b64Size(info.base64)) },
                      { label: t("stats.overhead"), value: `+${Math.round((b64Size(info.base64) / info.sizeKb - 1) * 100)}%` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                        <span className="text-base font-bold text-foreground">{value}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Output */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {wrapperOptions.find((w) => w.key === wrapper)?.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground/60">{t("encode.charsCount", { count: outputValue.length.toLocaleString() })}</span>
                        <button
                          onClick={() => setShowFull((p) => !p)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all duration-200"
                        >
                          {showFull ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          {showFull ? t("encode.collapse") : t("encode.expand")}
                        </button>
                        <CopyButton text={outputValue} label={t("encode.copy")} />
                      </div>
                    </div>

                    <div
                      className={`relative rounded-2xl border border-border bg-muted/30 dark:bg-muted/10 overflow-hidden transition-all duration-300 ${showFull ? "max-h-[500px] overflow-y-auto" : "max-h-40"}`}
                    >
                      <pre className="px-5 py-4 text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all">
                        {displayValue}
                      </pre>
                      {!showFull && outputValue.length > 800 && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-muted/60 dark:from-background/80 to-transparent pointer-events-none" />
                      )}
                    </div>
                  </div>

                  {/* Copy full button */}
                  <CopyButton text={outputValue} label={t("encode.copyWrapper", { label: wrapperOptions.find((w) => w.key === wrapper)?.label ?? "" })} full />
                </>
              )}
            </div>
          </div>
        )}

        {/* ── DECODE MODE ── */}
        {mode === "decode" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Input */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("decode.input")}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/60">{t("encode.charsCount", { count: decodeInput.length.toLocaleString() })}</span>
                  <button onClick={() => { setDecodeInput(""); setDecodeResult(null); setDecodeError(""); }}
                    disabled={!decodeInput}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-red-300 dark:hover:border-red-800 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
                    <Trash2 className="w-3.5 h-3.5" /> {t("decode.clear")}
                  </button>
                </div>
              </div>
              <textarea
                value={decodeInput}
                onChange={(e) => { setDecodeInput(e.target.value); setDecodeResult(null); setDecodeError(""); }}
                placeholder={t("decode.inputPlaceholder")}
                className="h-64 px-5 py-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 text-xs font-mono leading-relaxed resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm"
              />

              {decodeError && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                  <span className="text-red-500 text-xs mt-0.5">⚠</span>
                  <p className="text-xs text-red-600 dark:text-red-400">{decodeError}</p>
                </div>
              )}

              <button
                onClick={handleDecode}
                disabled={!decodeInput.trim()}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-blue-200 dark:shadow-blue-900/40"
              >
                <Code2 className="w-4 h-4" /> {t("decode.button")}
              </button>

              {/* Tips */}
              <div className="p-4 rounded-xl border border-border bg-card">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("decode.acceptedFormats")}</p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: t("decode.dataUrl"), ex: "data:image/png;base64,iVBO..." },
                    { label: t("decode.rawBase64"), ex: "/9j/4AAQSkZJRgABAQE..." },
                  ].map(({ label, ex }) => (
                    <div key={label} className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-blue-500 mt-0.5 w-16 shrink-0">{label}</span>
                      <code className="text-[10px] text-muted-foreground font-mono break-all">{ex}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("decode.decodedImage")}</span>

              <div className="relative flex-1 min-h-64 rounded-2xl border border-border overflow-hidden flex items-center justify-center"
                style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}>
                <div className="absolute inset-0 opacity-10 dark:opacity-5" />
                {decodeResult ? (
                  <img src={decodeResult.dataUrl} alt="Decoded" className="relative max-h-full max-w-full object-contain" />
                ) : (
                  <div className="relative flex flex-col items-center gap-2 text-muted-foreground/40 py-12">
                    <FileImage className="w-10 h-10" />
                    <span className="text-xs">{t("decode.emptyPreview")}</span>
                  </div>
                )}
              </div>

              {decodeResult && (
                <>
                  {/* Info */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: t("decode.format"), value: decodeResult.type.split("/")[1].toUpperCase() },
                      { label: t("decode.size"), value: fmtSize(decodeResult.sizeKb) },
                      { label: t("decode.dimensions"), value: decodeImgInfo ? `${decodeImgInfo.width}×${decodeImgInfo.height}` : "…" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                        <span className="text-sm font-bold text-foreground">{value}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={downloadDecoded}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-all duration-200 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40">
                    <Download className="w-4 h-4" /> {t("decode.download")}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <HowToUse tKey="image-tools/ImageToBase64Tool.json" count={4} />
        <FAQ tKey="image-tools/ImageToBase64Tool.json" />
        <Examples tKey="image-tools/ImageToBase64Tool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}