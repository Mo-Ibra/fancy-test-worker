"use client";

import { useState, useRef, useCallback } from "react";
import {
  FileText,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { fmtSize, loadJSZip, loadPdfJs, OutputFormat, PageSelection, parsePageList, RenderedPage, RenderOptions, renderPdfPages } from "@/funcs/pdf-tools/PDFToImagesToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import RelatedTools from "@/components/pdf-tools/RelatedTools";
import Results from "@/components/pdf-tools/pdf-to-images/Results";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main ───────────────────────────────────────────────────────────

export default function PDFToImagesTool() {
  const t = useT("pdf-tools/PDFToImagesTool.json");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [opts, setOpts] = useState<RenderOptions>({
    format: "png",
    quality: 0.85,
    dpi: 150,
    background: "#ffffff",
    pageSelection: "all",
    customPages: "",
  });

  const setOpt = <K extends keyof RenderOptions>(k: K, v: RenderOptions[K]) =>
    setOpts(o => ({ ...o, [k]: v }));

  const pdfBufRef = useRef<ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseName = useRef("");

  const handleFile = useCallback(async (file: File) => {
    setPdfFile(file);
    baseName.current = file.name.replace(/\.pdf$/i, "");
    setPages([]); setError(""); setSelected(new Set());
    const buf = await file.arrayBuffer();
    pdfBufRef.current = buf;

    // Quick page count
    try {
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ data: buf.slice(0) }).promise;
      setPageCount(doc.numPages);
    } catch { setPageCount(null); }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files).find(f => f.name.endsWith(".pdf") || f.type === "application/pdf");
    if (f) handleFile(f);
  };

  const render = useCallback(async () => {
    if (!pdfBufRef.current) return;
    setRendering(true);
    setError("");
    setPages([]);
    setSelected(new Set());
    setProgress(0);
    try {
      const results = await renderPdfPages(
        pdfBufRef.current,
        opts,
        (pct, page, total) => {
          setProgress(pct);
          setProgressMsg(`Rendering page ${page} of ${total}…`);
        }
      );
      setPages(results);
      setProgress(100);
      setProgressMsg("Done!");
    } catch (e: any) {
      setError(e.message ?? t("errors.renderFailed"));
    } finally {
      setRendering(false);
    }
  }, [opts]);

  const downloadPage = (page: RenderedPage) => {
    const ext = opts.format;
    const name = `${baseName.current}_page-${String(page.pageNum).padStart(3, "0")}.${ext}`;
    const url = URL.createObjectURL(page.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSelected = async () => {
    const toDownload = pages.filter(p => selected.has(p.pageNum));
    if (toDownload.length === 1) { downloadPage(toDownload[0]); return; }
    const JSZip = await loadJSZip();
    const zip = new JSZip();
    toDownload.forEach(p => {
      zip.file(`${baseName.current}_page-${String(p.pageNum).padStart(3, "0")}.${opts.format}`, p.blob);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName.current}_images.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    if (pages.length === 1) { downloadPage(pages[0]); return; }
    const JSZip = await loadJSZip();
    const zip = new JSZip();
    pages.forEach(p => {
      zip.file(`${baseName.current}_page-${String(p.pageNum).padStart(3, "0")}.${opts.format}`, p.blob);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName.current}_pages.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelect = (pageNum: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(pageNum) ? next.delete(pageNum) : next.add(pageNum);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(pages.map(p => p.pageNum)));
  const deselectAll = () => setSelected(new Set());

  const reset = () => {
    setPdfFile(null); setPageCount(null); setPages([]);
    setError(""); setProgress(0); pdfBufRef.current = null;
  };

  const totalSizeKb = pages.reduce((s, p) => s + p.sizeKb, 0);

  const customPagesPreview = opts.pageSelection === "custom" && pageCount
    ? parsePageList(opts.customPages, pageCount)
    : [];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">
      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="pdf-tools/PDFToImagesTool.json" href="/pdf-tools" />

        {/* Header */}
        <Header tKey="pdf-tools/PDFToImagesTool.json" />

        {/* Privacy */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 mb-6">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {t("privacy.notice")}
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
                  <p className="text-[10px] text-muted-foreground">
                    {fmtSize(pdfFile.size / 1024)}
                    {pageCount !== null ? ` · ${pageCount} ${t("fileInfo.pages")}` : ""}
                  </p>
                </div>
                <button onClick={reset} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Format */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.format")}</p>
              <div className="grid grid-cols-3 gap-2">
                {(["png", "jpeg", "webp"] as OutputFormat[]).map(f => (
                  <button key={f} onClick={() => setOpt("format", f)}
                    className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all ${opts.format === f ? "bg-emerald-500 border-emerald-500 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-emerald-300 hover:text-emerald-600"
                      }`}>
                    <div className="text-[9px] font-normal opacity-70 mb-0.5 normal-case">
                      {t(`format.${f}`)}
                    </div>
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* DPI */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.dpi")}</p>
                <span className="text-sm font-black text-emerald-500 font-mono">{opts.dpi}</span>
              </div>
              <input type="range" min={72} max={300} step={12} value={opts.dpi}
                onChange={e => setOpt("dpi", Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-border accent-emerald-500 cursor-pointer"
                aria-label={t("options.dpi")} />
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {[72, 96, 150, 200, 300].map(d => (
                  <button key={d} onClick={() => setOpt("dpi", d)}
                    className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${opts.dpi === d ? "bg-emerald-500 border-emerald-500 text-white" : "border-border bg-card text-muted-foreground hover:border-emerald-300"
                      }`}>{d}</button>
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground/60 mt-1">
                {opts.dpi <= 96 ? t("dpi.screen") : opts.dpi <= 150 ? t("dpi.good") : opts.dpi <= 200 ? t("dpi.high") : t("dpi.print")}
                {" · "}{t("dpi.a4Size", { width: Math.round((opts.dpi / 72) * 595), height: Math.round((opts.dpi / 72) * 842) })}
              </p>
            </div>

            {/* Quality (jpeg/webp) */}
            {opts.format !== "png" && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.quality")}</p>
                  <span className="text-sm font-black text-emerald-500 font-mono">{Math.round(opts.quality * 100)}%</span>
                </div>
                <input type="range" min={10} max={100} value={Math.round(opts.quality * 100)}
                  onChange={e => setOpt("quality", Number(e.target.value) / 100)}
                  className="w-full h-2 rounded-full appearance-none bg-border accent-emerald-500 cursor-pointer"
                  aria-label={t("options.quality")} />
                <div className="flex justify-between text-[9px] text-muted-foreground/60 mt-1">
                  <span>{t("quality.tiny")}</span><span>{t("quality.recommended")}</span><span>{t("quality.max")}</span>
                </div>
              </div>
            )}

            {/* Background */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("options.background")}</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "#ffffff", label: t("background.white") },
                  { value: "#000000", label: t("background.black") },
                  { value: "#f8fafc", label: t("background.lightGray") },
                  { value: "transparent", label: t("background.transparent") },
                ].map(({ value, label }) => (
                  <button key={value}
                    onClick={() => setOpt("background", value)}
                    disabled={value === "transparent" && opts.format !== "png"}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${opts.background === value ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "border-border bg-card text-muted-foreground hover:border-emerald-300"
                      }`}>
                    {value !== "transparent" && (
                      <span className="w-3 h-3 rounded-sm border border-border/50 shrink-0"
                        style={{ background: value }} />
                    )}
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Page selection */}
            {pageCount && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("options.pages")}</p>
                <div className="flex gap-2 mb-2">
                  {([
                    { key: "all" as PageSelection, label: t("pageSelection.all", { count: pageCount }) },
                    { key: "custom" as PageSelection, label: t("pageSelection.custom") },
                  ]).map(({ key, label }) => (
                    <button key={key} onClick={() => setOpt("pageSelection", key)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${opts.pageSelection === key ? "bg-emerald-500 border-emerald-500 text-white" : "border-border bg-card text-muted-foreground hover:border-emerald-300"
                        }`}>{label}</button>
                  ))}
                </div>
                {opts.pageSelection === "custom" && (
                  <div>
                    <input
                      value={opts.customPages}
                      onChange={e => setOpt("customPages", e.target.value)}
                      placeholder={t("pageSelection.placeholder", { max: pageCount })}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs font-mono focus:outline-none focus:border-emerald-400 transition-all placeholder:text-muted-foreground/40"
                      aria-label={t("options.pages")}
                    />
                    {customPagesPreview.length > 0 && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                        ✓ {customPagesPreview.length} pages: {customPagesPreview.slice(0, 8).join(", ")}{customPagesPreview.length > 8 ? "…" : ""}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Upload + Results ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Drop zone */}
            {!pdfFile && (
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-12 rounded-2xl border-2 border-dashed border-border bg-muted/10 hover:border-emerald-300 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 cursor-pointer transition-all"
              >
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" aria-label="Upload file"
                  onChange={e => { const f = e.target.files?.[0]; if (f) { handleFile(f); e.target.value = ""; } }} />
                <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{t("dropzone.dropHere")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("dropzone.hint")}</p>
                </div>
              </div>
            )}

            {/* Render button */}
            {pdfFile && (
              <button onClick={render} disabled={rendering}
                className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-sm font-bold shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40 transition-all active:scale-[0.98]">
                {rendering
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("render.rendering")}</>
                  : <><ImageIcon className="w-5 h-5" /> {t("render.button")}</>}
              </button>
            )}

            {/* Progress */}
            {rendering && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {progressMsg}
                  </span>
                  <span className="font-bold text-emerald-500">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
              </div>
            )}

            {/* Results */}
            {pages.length > 0 && !rendering && (
              <Results
                pages={pages}
                toggleSelect={toggleSelect}
                opts={opts}
                selected={selected}
                totalSizeKb={totalSizeKb}
                selectAll={selectAll}
                deselectAll={deselectAll}
                downloadSelected={downloadSelected}
                downloadAll={downloadAll}
                downloadPage={downloadPage}
              />
            )}
          </div>
        </div>

        <HowToUse tKey="pdf-tools/PDFToImagesTool.json" count={4} />
        <FAQ tKey="pdf-tools/PDFToImagesTool.json" />
        <Examples tKey="pdf-tools/PDFToImagesTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}