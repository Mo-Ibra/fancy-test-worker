"use client";

import { useState, useRef, useCallback } from "react";
import {
  FileText,
  Upload,
  Download,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Minimize2,
  TrendingDown,
  X,
  Info,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { CompressionOptions, CompressionResult, compressPDF, fmtSize, PRESETS } from "@/funcs/pdf-tools/PDFCompressorToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import SizeBar from "@/components/pdf-tools/pdf-compressor/SizeBar";
import RelatedTools from "@/components/pdf-tools/RelatedTools";
import ImageOptions from "@/components/pdf-tools/pdf-compressor/ImageOptions";
import AdvancedOptions from "@/components/pdf-tools/pdf-compressor/AdvancedOptions";
import PresetLevels from "@/components/pdf-tools/pdf-compressor/PresetLevels";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function PDFCompressorTool() {
  const t = useT("pdf-tools/PDFCompressorTool.json");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [opts, setOpts] = useState<CompressionOptions>(PRESETS.medium);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [compError, setCompError] = useState("");
  const [outputName, setOutputName] = useState("");
  const pdfBufRef = useRef<ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setOpt = <K extends keyof CompressionOptions>(k: K, v: CompressionOptions[K]) =>
    setOpts(o => ({ ...o, [k]: v }));

  const handleFile = useCallback(async (file: File) => {
    setPdfFile(file);
    setOutputName(file.name.replace(/\.pdf$/i, ""));
    setPdfError("");
    setResult(null);
    try {
      const buf = await file.arrayBuffer();
      pdfBufRef.current = buf;
    } catch {
      setPdfError(t("file.error"));
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files).find(f => f.name.endsWith(".pdf") || f.type === "application/pdf");
    if (f) handleFile(f);
  }, [handleFile]);

  const compress = useCallback(async () => {
    if (!pdfBufRef.current) return;
    setCompressing(true);
    setCompError("");
    setResult(null);
    setProgress(10);

    try {
      // Simulate progress ticks while compressing
      const timer = setInterval(() => setProgress(p => Math.min(p + 8, 88)), 400);
      const res = await compressPDF(pdfBufRef.current, opts);
      clearInterval(timer);
      setProgress(100);
      setResult(res);
    } catch (e: any) {
      setCompError(e.message ?? "Compression failed");
    } finally {
      setCompressing(false);
    }
  }, [opts]);

  const download = () => {
    if (!result) return;
    const blob = new Blob([result.bytes as any], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${outputName || "compressed"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setPdfFile(null); setPdfError(""); setResult(null);
    setCompError(""); setProgress(0); pdfBufRef.current = null;
  };

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="pdf-tools/PDFCompressorTool.json" href="/pdf-tools" />

        {/* Header */}
        <Header tKey="pdf-tools/PDFCompressorTool.json" />

        {/* Privacy notice */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 mb-6">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {t("privacy.notice")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Controls ── */}
          <div className="flex flex-col gap-5">

            {/* Preset levels */}
            <PresetLevels opts={opts} setOpt={setOpt} />

            {/* Advanced options */}
            <AdvancedOptions opts={opts} setOpt={setOpt} />

            {/* Image options */}
            <ImageOptions opts={opts} setOpt={setOpt} />

            {/* Output name */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("output.label")}</p>
              <div className="flex items-center gap-0">
                <input value={outputName} onChange={e => setOutputName(e.target.value)} placeholder="compressed"
                  className="flex-1 px-4 py-3 rounded-l-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-red-400 transition-all placeholder:text-muted-foreground/40"
                  aria-label={t("output.label")} />
                <span className="px-3 py-3 rounded-r-xl border border-l-0 border-border bg-muted/40 text-muted-foreground text-sm font-mono select-none">.pdf</span>
              </div>
            </div>

            {/* What this tool does */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-blue-400" /> {t("whatGetsCompressed.title")}
              </p>
              <div className="flex flex-col gap-1.5 text-[10px] text-muted-foreground">
                {[
                  { icon: "✓", text: t("whatGetsCompressed.metadata") },
                  { icon: "✓", text: t("whatGetsCompressed.objectCompression") },
                  { icon: "✓", text: t("whatGetsCompressed.jpegReencode") },
                  { icon: "✓", text: t("whatGetsCompressed.annotations") },
                  { icon: "–", text: t("whatGetsCompressed.not1") },
                  { icon: "–", text: t("whatGetsCompressed.not2") },
                ].map(({ icon, text }) => (
                  <p key={text} className={`flex items-start gap-1.5 ${icon === "–" ? "text-muted-foreground/40" : ""}`}>
                    <span className={`font-bold shrink-0 ${icon === "✓" ? "text-emerald-500" : "text-muted-foreground/30"}`}>{icon}</span>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Upload + Result ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Drop zone / File info */}
            {!pdfFile ? (
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-12 rounded-2xl border-2 border-dashed border-border bg-muted/10 hover:border-red-300 hover:bg-red-50/30 dark:hover:bg-red-900/10 cursor-pointer transition-all"
              >
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" aria-label="Upload file"
                  onChange={e => { const f = e.target.files?.[0]; if (f) { handleFile(f); e.target.value = ""; } }} />
                <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{t("dropzone.dropHere")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("dropzone.orClick")}</p>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full border border-border bg-card text-muted-foreground">{t("dropzone.pdfOnly")}</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{pdfFile.name}</p>
                  <p className="text-[10px] text-muted-foreground">{fmtSize(pdfFile.size / 1024)}</p>
                </div>
                <button onClick={reset}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Compress button */}
            {pdfFile && (
              <button onClick={compress} disabled={compressing}
                className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-bold shadow-sm shadow-red-200 dark:shadow-red-900/40 transition-all active:scale-[0.98]">
                {compressing
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("compress.compressing")}</>
                  : <><Minimize2 className="w-5 h-5" /> {t("compress.button")}</>}
              </button>
            )}

            {/* Progress */}
            {compressing && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t("compress.processing")}
                  </span>
                  <span className="font-bold text-red-500">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Error */}
            {compError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs text-red-600 dark:text-red-400">{compError}</span>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="flex flex-col gap-4 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">{t("result.title")}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums leading-none">
                        {result.savings}%
                      </span>
                      <span className="text-base text-muted-foreground pb-0.5">{t("result.smaller")}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <TrendingDown className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-foreground">{fmtSize(result.originalKb)}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{fmtSize(result.compressedKb)}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Saved {fmtSize(result.originalKb - result.compressedKb)}
                    </span>
                  </div>
                </div>

                {/* Size comparison bar */}
                <SizeBar origKb={result.originalKb} compKb={result.compressedKb} />

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: t("result.original"), value: fmtSize(result.originalKb) },
                    { label: t("result.compressed"), value: fmtSize(result.compressedKb), accent: true },
                    { label: t("result.saved"), value: `${result.savings}%` },
                  ].map(({ label, value, accent }) => (
                    <div key={label} className={`flex flex-col items-center py-3 rounded-xl border ${accent ? "border-emerald-200 dark:border-emerald-800 bg-white/60 dark:bg-black/10" : "border-emerald-100 dark:border-emerald-900/30 bg-white/40 dark:bg-black/5"}`}>
                      <span className={`text-sm font-black font-mono tabular-nums ${accent ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>{value}</span>
                      <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
                    </div>
                  ))}
                </div>

                {result.savings === 0 && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10">
                    <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <p className="text-[10px] text-amber-700 dark:text-amber-400">
                      {t("result.noReduction")}
                    </p>
                  </div>
                )}

                {/* Download */}
                <button onClick={download}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all active:scale-[0.98]">
                  <Download className="w-4 h-4" /> {t("result.download")}
                </button>

                <button onClick={compress}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
                  <RefreshCw className="w-3.5 h-3.5" /> {t("result.recompress")}
                </button>
              </div>
            )}
          </div>
        </div>

        <HowToUse tKey="pdf-tools/PDFCompressorTool.json" count={4} />
        <FAQ tKey="pdf-tools/PDFCompressorTool.json" />
        <Examples tKey="pdf-tools/PDFCompressorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}