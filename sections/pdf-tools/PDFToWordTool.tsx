"use client";

import { useState, useRef, useCallback } from "react";
import {
  FileText,
  Upload,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Info,
  SlidersHorizontal,
  FileOutput,
  AlignLeft,
  Type,
  Layers,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { buildDocx, ConversionOptions, ExtractedPage, extractText, fmtSize } from "@/funcs/pdf-tools/PDFToWordToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import Toggle from "@/components/pdf-tools/pdf-to-word/Toggle";
import RelatedTools from "@/components/pdf-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main ───────────────────────────────────────────────────────────

export default function PDFToWordTool() {
  const t = useT("pdf-tools/PDFToWordTool.json");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [pages, setPages] = useState<ExtractedPage[]>([]);
  const [convError, setConvError] = useState("");
  const [outputName, setOutputName] = useState("");
  const [previewPage, setPreviewPage] = useState(0);

  const [opts, setOpts] = useState<ConversionOptions>({
    preserveLineBreaks: true,
    addPageBreaks: true,
    addPageNumbers: true,
    cleanWhitespace: true,
    fontSize: 11,
    fontFamily: "sans",
  });

  const setOpt = <K extends keyof ConversionOptions>(k: K, v: ConversionOptions[K]) =>
    setOpts(o => ({ ...o, [k]: v }));

  const pdfBufRef = useRef<ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setPdfFile(file);
    setOutputName(file.name.replace(/\.pdf$/i, ""));
    setPages([]);
    setConvError("");
    const buf = await file.arrayBuffer();
    pdfBufRef.current = buf;
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files).find(f => f.name.endsWith(".pdf") || f.type === "application/pdf");
    if (f) handleFile(f);
  };

  const convert = useCallback(async () => {
    if (!pdfBufRef.current) return;
    setConverting(true);
    setConvError("");
    setPages([]);
    setProgress(0);

    try {
      setProgressMsg(t("progress.loading"));
      setProgress(5);

      const extracted = await extractText(
        pdfBufRef.current,
        (pct, page, total) => {
          setProgress(pct);
          setProgressMsg(t("progress.extracting", { page, total }));
        }
      );

      setPages(extracted);
      setProgress(90);
      setProgressMsg(t("progress.building"));

      const blob = buildDocx(extracted, opts, pdfFile?.name ?? "document.pdf");
      setProgress(100);
      setProgressMsg(t("progress.done"));

      // Auto download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${outputName || "document"}.docx`;
      a.click();
      URL.revokeObjectURL(url);

    } catch (e: any) {
      setConvError(e.message ?? "Conversion failed");
    } finally {
      setConverting(false);
    }
  }, [opts, pdfFile, outputName]);

  const downloadDocx = useCallback(() => {
    if (!pages.length) return;
    const blob = buildDocx(pages, opts, pdfFile?.name ?? "document.pdf");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${outputName || "document"}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }, [pages, opts, pdfFile, outputName]);

  const reset = () => {
    setPdfFile(null); setPages([]); setConvError("");
    setProgress(0); pdfBufRef.current = null;
  };

  const totalChars = pages.reduce((s, p) => s + p.charCount, 0);
  const totalWords = pages.reduce((s, p) => s + p.text.split(/\s+/).filter(Boolean).length, 0);

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="pdf-tools/PDFToWordTool.json" href="/pdf-tools" />

        {/* Header */}
        <Header tKey="pdf-tools/PDFToWordTool.json" />

        {/* Notice */}
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 mb-6">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700 dark:text-amber-400">
            <strong>{t("notice.title")}</strong> {t("notice.description")}
          </div>
        </div>

        {/* Privacy */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 mb-6">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            <strong>{t("privacy.title")}</strong> {t("privacy.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Options ── */}
          <div className="flex flex-col gap-5">

            {/* File info */}
            {pdfFile && (
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{pdfFile.name}</p>
                  <p className="text-[10px] text-muted-foreground">{fmtSize(pdfFile.size / 1024)}</p>
                </div>
                <button onClick={reset} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Output options */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" /> {t("options.title")}
              </p>
              <Toggle checked={opts.addPageBreaks} onChange={v => setOpt("addPageBreaks", v)}
                label={t("options.addPageBreaks")} sub={t("options.addPageBreaksSub")} />
              <Toggle checked={opts.addPageNumbers} onChange={v => setOpt("addPageNumbers", v)}
                label={t("options.addPageNumbers")} sub={t("options.addPageNumbersSub")} />
              <Toggle checked={opts.cleanWhitespace} onChange={v => setOpt("cleanWhitespace", v)}
                label={t("options.cleanWhitespace")} sub={t("options.cleanWhitespaceSub")} />
            </div>

            {/* Typography */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Type className="w-3.5 h-3.5 text-blue-400" /> {t("options.typography")}
              </p>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("options.font")}</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { key: "sans", label: t("options.sansSerif"), sample: "Calibri" },
                    { key: "serif", label: t("options.serif"), sample: "Times" },
                    { key: "mono", label: t("options.mono"), sample: "Courier" },
                  ].map(({ key, label, sample }) => (
                    <button key={key} onClick={() => setOpt("fontFamily", key)}
                      className={`py-2.5 rounded-xl border text-[10px] font-bold transition-all ${opts.fontFamily === key ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                        }`}>
                      <div className="font-normal text-[9px] opacity-70">{sample}</div>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("options.fontSize")}</label>
                  <span className="text-sm font-bold font-mono text-blue-500">{opts.fontSize}pt</span>
                </div>
                <input type="range" min={8} max={18} value={opts.fontSize}
                  onChange={e => setOpt("fontSize", Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                  aria-label={t("options.fontSize")} />
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {[9, 10, 11, 12, 14].map(n => (
                    <button key={n} onClick={() => setOpt("fontSize", n)}
                      className={`px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${opts.fontSize === n ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                        }`}>{n}pt</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output filename */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("options.outputFilename")}</p>
              <div className="flex items-center gap-0">
                <input value={outputName} onChange={e => setOutputName(e.target.value)} placeholder="document"
                  className="flex-1 px-4 py-3 rounded-l-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40"
                  aria-label={t("options.outputFilename")} />
                <span className="px-3 py-3 rounded-r-xl border border-l-0 border-border bg-muted/40 text-muted-foreground text-sm font-mono select-none">.docx</span>
              </div>
            </div>
          </div>

          {/* ── Right: Drop + Results ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Drop zone */}
            {!pdfFile && (
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-12 rounded-2xl border-2 border-dashed border-border bg-muted/10 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-all"
              >
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" aria-label="Upload file"
                  onChange={e => { const f = e.target.files?.[0]; if (f) { handleFile(f); e.target.value = ""; } }} />
                <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{t("dropzone.dropHere")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("dropzone.textBasedOnly")}</p>
                </div>
              </div>
            )}

            {/* Convert button */}
            {pdfFile && (
              <button onClick={convert} disabled={converting}
                className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white text-sm font-bold transition-all active:scale-[0.98]">
                {converting
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("convert.converting")}</>
                  : <><FileOutput className="w-5 h-5" /> {t("convert.button")}</>}
              </button>
            )}

            {/* Progress */}
            {converting && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {progressMsg || t("progress.loading")}
                  </span>
                  <span className="font-bold text-blue-500">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Error */}
            {convError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs text-red-600 dark:text-red-400">{convError}</span>
              </div>
            )}

            {/* Success + preview */}
            {pages.length > 0 && !converting && (
              <>
                {/* Result stats */}
                <div className="flex flex-col gap-3 p-5 rounded-2xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">{t("result.complete")}</p>
                      <p className="text-lg font-black text-foreground">
                        {t("result.pagesExtracted", { count: pages.length, plural: pages.length !== 1 ? "s" : "" })}
                      </p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: t("result.pages"), value: pages.length },
                      { label: t("result.words"), value: totalWords.toLocaleString() },
                      { label: t("result.characters"), value: totalChars.toLocaleString() },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col items-center py-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-white/60 dark:bg-black/10">
                        <span className="text-sm font-bold font-mono tabular-nums text-foreground">{value}</span>
                        <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={downloadDocx}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold transition-all active:scale-[0.98]">
                    <Download className="w-4 h-4" /> {t("result.download", { filename: outputName || "document" })}
                  </button>
                </div>

                {/* Text preview */}
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 bg-muted/20 border-b border-border">
                    <AlignLeft className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("preview.title")}</span>
                    {/* Page nav */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPreviewPage(p => Math.max(0, p - 1))} disabled={previewPage === 0}
                        className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-card hover:border-blue-300 disabled:opacity-30 text-xs transition-all">‹</button>
                      <span className="text-[10px] font-mono text-muted-foreground">{previewPage + 1} / {pages.length}</span>
                      <button onClick={() => setPreviewPage(p => Math.min(pages.length - 1, p + 1))} disabled={previewPage === pages.length - 1}
                        className="w-6 h-6 flex items-center justify-center rounded-lg border border-border bg-card hover:border-blue-300 disabled:opacity-30 text-xs transition-all">›</button>
                    </div>
                  </div>
                  <div className="p-5 max-h-80 overflow-y-auto">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      {t("preview.pageInfo", { pageNum: pages[previewPage]?.pageNum, charCount: pages[previewPage]?.charCount.toLocaleString() })}
                    </p>
                    {pages[previewPage]?.text ? (
                      <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap wrap-break-word">
                        {pages[previewPage].text.slice(0, 2000)}
                        {pages[previewPage].text.length > 2000 && (
                          <span className="text-muted-foreground/50">{t("preview.moreChars", { count: (pages[previewPage].text.length - 2000).toLocaleString() })}</span>
                        )}
                      </pre>
                    ) : (
                      <p className="text-xs text-muted-foreground/50 italic">{t("preview.noText")}</p>
                    )}
                  </div>
                </div>

                {/* Per-page breakdown */}
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 bg-muted/20 border-b border-border">
                    <Layers className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">{t("breakdown.title")}</span>
                  </div>
                  <div className="divide-y divide-border max-h-56 overflow-y-auto">
                    {pages.map((p, i) => {
                      const words = p.text.split(/\s+/).filter(Boolean).length;
                      const pct = totalChars > 0 ? (p.charCount / totalChars) * 100 : 0;
                      return (
                        <button key={p.pageNum}
                          onClick={() => setPreviewPage(i)}
                          className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors ${previewPage === i ? "bg-blue-50 dark:bg-blue-900/10" : ""}`}>
                          <span className="text-[10px] font-mono text-muted-foreground/60 w-8 text-right shrink-0">p.{p.pageNum}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                            {words.toLocaleString()} {t("breakdown.words")}
                          </span>
                          {p.charCount === 0 && (
                            <span className="text-[9px] text-amber-500 font-bold shrink-0">{t("breakdown.empty")}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <HowToUse tKey="pdf-tools/PDFToWordTool.json" count={4} />
        <FAQ tKey="pdf-tools/PDFToWordTool.json" />
        <Examples tKey="pdf-tools/PDFToWordTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}