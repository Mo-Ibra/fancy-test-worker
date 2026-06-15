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
  X,
  RotateCw,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import PDFLib from "@/funcs/pdf-tools/pdf-lib";
import { fmtSize, loadPdfJs, normalizeAngle, PageInfo, renderThumbnail } from "@/funcs/pdf-tools/RotatePDFToolFuncs";
import PageCard from "@/components/pdf-tools/rotate-pdf/PageCard";
import RelatedTools from "@/components/pdf-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function RotatePDFTool() {
  const t = useT("pdf-tools/RotatePDFTool.json");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [progress, setProgress] = useState(0);
  const [resultKb, setResultKb] = useState<number | null>(null);
  const [outputName, setOutputName] = useState("");

  const pdfBufRef = useRef<ArrayBuffer | null>(null);
  const pdfJsRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected page indices
  const selectedPages = pages.filter(p => p.selected);
  const anySelected = selectedPages.length > 0;
  const allSelected = pages.length > 0 && pages.every(p => p.selected);
  const anyChanged = pages.some(p => p.rotation !== 0);

  // Load file
  const handleFile = useCallback(async (file: File) => {
    setPdfFile(file);
    setOutputName(file.name.replace(/\.pdf$/i, "") + "_rotated");
    setPages([]); setLoadError(""); setResultKb(null);
    setLoadingPDF(true);

    try {
      const pdfjs = await loadPdfJs();
      pdfJsRef.current = pdfjs;

      const buf = await file.arrayBuffer();
      pdfBufRef.current = buf;

      // Get page count + original rotations
      const doc = await PDFLib.PDFDocument.load(buf, { ignoreEncryption: true });
      const count = doc.getPageCount();

      const pageInfos: PageInfo[] = [];
      for (let i = 0; i < count; i++) {
        const page = doc.getPage(i);
        const origAngle = normalizeAngle(page.getRotation().angle ?? 0);
        pageInfos.push({
          pageNum: i + 1,
          rotation: 0,
          origAngle,
          selected: false,
          previewUrl: null,
        });
      }
      setPages(pageInfos);
      setLoadingPDF(false);

      // Render thumbnails asynchronously
      for (let i = 0; i < count; i++) {
        try {
          const url = await renderThumbnail(pdfjs, buf, i + 1);
          setPages(prev => prev.map(p => p.pageNum === i + 1 ? { ...p, previewUrl: url } : p));
        } catch {/* thumbnail failed, just skip */ }
      }
    } catch (e: any) {
      setLoadError(e.message ?? "Could not load PDF");
      setLoadingPDF(false);
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files).find(f => f.name.endsWith(".pdf") || f.type === "application/pdf");
    if (f) handleFile(f);
  };

  // Rotate helpers
  const rotatePage = (pageNum: number, delta: number) => {
    setPages(prev => prev.map(p =>
      p.pageNum === pageNum
        ? { ...p, rotation: normalizeAngle(p.rotation + delta) }
        : p
    ));
  };

  const resetPage = (pageNum: number) => {
    setPages(prev => prev.map(p => p.pageNum === pageNum ? { ...p, rotation: 0 } : p));
  };

  const toggleSelect = (pageNum: number) => {
    setPages(prev => prev.map(p => p.pageNum === pageNum ? { ...p, selected: !p.selected } : p));
  };

  const selectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: true })));
  const deselectAll = () => setPages(prev => prev.map(p => ({ ...p, selected: false })));

  // Bulk rotate selected (or all if none selected)
  const bulkRotate = (delta: number, targets?: "all" | "selected" | "even" | "odd") => {
    setPages(prev => prev.map(p => {
      const include =
        targets === "all" ? true :
          targets === "even" ? p.pageNum % 2 === 0 :
            targets === "odd" ? p.pageNum % 2 !== 0 :
              targets === "selected" ? p.selected :
                p.selected || !anySelected; // default: selected or all if none selected
      return include ? { ...p, rotation: normalizeAngle(p.rotation + delta) } : p;
    }));
  };

  const resetAll = () => setPages(prev => prev.map(p => ({ ...p, rotation: 0 })));

  // Apply rotations and save PDF
  const apply = useCallback(async () => {
    if (!pdfBufRef.current) return;
    setApplying(true);
    setApplyError("");
    setResultKb(null);
    setProgress(0);

    try {
      const doc = await PDFLib.PDFDocument.load(pdfBufRef.current, { ignoreEncryption: true });

      for (let i = 0; i < pages.length; i++) {
        setProgress(Math.round((i / pages.length) * 95));
        const { rotation, origAngle } = pages[i];
        if (rotation === 0) continue;

        const page = doc.getPage(i);
        const newAngle = normalizeAngle(origAngle + rotation);
        page.setRotation(PDFLib.degrees(newAngle));
      }

      setProgress(98);
      const bytes = await doc.save();
      setProgress(100);
      setResultKb(bytes.length / 1024);

      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${outputName || "rotated"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setApplyError(e.message ?? "Could not save PDF");
    } finally {
      setApplying(false);
    }
  }, [pages, outputName]);

  const reset = () => {
    setPdfFile(null); setPages([]); setLoadError(""); setResultKb(null); setApplyError("");
    pdfBufRef.current = null;
  };

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="pdf-tools/RotatePDFTool.json" href="/pdf-tools" />

        {/* Header */}
        <Header tKey="pdf-tools/RotatePDFTool.json" />

        {/* Privacy */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 mb-6">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {t("privacy.notice")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Controls ── */}
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
                    {pages.length > 0 && ` · ${pages.length} ${t("pages.count")}`}
                  </p>
                </div>
                <button onClick={reset} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Bulk rotation controls */}
            {pages.length > 0 && (
              <>
                <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5" /> {t("bulkRotate.title")}
                  </p>

                  {/* All pages */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground mb-1.5">{t("bulkRotate.allPages")}</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: t("bulkRotate.90CW"), delta: 90, icon: RotateCw },
                        { label: t("bulkRotate.90CCW"), delta: -90, icon: RotateCcw },
                        { label: t("bulkRotate.180"), delta: 180, icon: RotateCw },
                        { label: t("bulkRotate.resetAll"), delta: 0, icon: X },
                      ].map(({ label, delta, icon: Icon }) => (
                        <button key={label}
                          onClick={() => delta === 0 ? resetAll() : bulkRotate(delta, "all")}
                          className="flex flex-col items-center gap-0.5 py-2 rounded-xl border border-border bg-card hover:border-red-300 hover:text-red-500 text-[9px] font-bold transition-all">
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Even / Odd pages */}
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground mb-1.5">{t("bulkRotate.evenOdd")}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: t("bulkRotate.even90CW"), target: "even" as const, delta: 90 },
                        { label: t("bulkRotate.odd90CW"), target: "odd" as const, delta: 90 },
                        { label: t("bulkRotate.even90CCW"), target: "even" as const, delta: -90 },
                        { label: t("bulkRotate.odd90CCW"), target: "odd" as const, delta: -90 },
                      ].map(({ label, target, delta }) => (
                        <button key={label} onClick={() => bulkRotate(delta, target)}
                          className="py-2 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-[9px] font-bold transition-all">
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected pages */}
                  {anySelected && (
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground mb-1.5">
                        {t("bulkRotate.selectedPages")} ({selectedPages.length}) {t("pages.count")}
                      </p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: t("bulkRotate.CW90"), delta: 90 },
                          { label: t("bulkRotate.CCW90"), delta: -90 },
                          { label: t("bulkRotate.180"), delta: 180 },
                        ].map(({ label, delta }) => (
                          <button key={label} onClick={() => bulkRotate(delta, "selected")}
                            className="py-2 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-[9px] font-bold transition-all">
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selection controls */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("selection.title")}</p>
                  <div className="flex gap-2">
                    <button onClick={selectAll} className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${allSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"}`}>
                      {t("selection.selectAll")}
                    </button>
                    <button onClick={deselectAll} disabled={!anySelected}
                      className="flex-1 py-2.5 rounded-xl border border-border bg-card text-xs font-bold text-muted-foreground hover:border-blue-300 hover:text-blue-500 disabled:opacity-40 transition-all">
                      {t("selection.deselect")}
                    </button>
                  </div>
                  {anySelected && (
                    <p className="text-[10px] text-blue-500 font-medium">
                      {selectedPages.length !== 1 ? t("selection.pagesSelected") : t("selection.pageSelected")}
                    </p>
                  )}
                </div>

                {/* Changes summary */}
                {anyChanged && (
                  <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">{t("changes.title")}</p>
                    <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
                      {pages.filter(p => p.rotation !== 0).map(p => (
                        <div key={p.pageNum} className="flex items-center gap-2 text-[10px]">
                          <span className="font-mono text-muted-foreground w-8 text-right">p.{p.pageNum}</span>
                          <span className="text-foreground">{p.origAngle}°</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />
                          <span className="font-bold text-amber-600 dark:text-amber-400">{normalizeAngle(p.origAngle + p.rotation)}°</span>
                          <span className="text-muted-foreground/50">(+{p.rotation}°)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Output name */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("output.title")}</p>
                  <div className="flex items-center gap-0">
                    <input value={outputName} onChange={e => setOutputName(e.target.value)} placeholder={t("output.placeholder")}
                      className="flex-1 px-4 py-3 rounded-l-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-red-400 transition-all placeholder:text-muted-foreground/40"
                      aria-label={t("output.title")} />
                    <span className="px-3 py-3 rounded-r-xl border border-l-0 border-border bg-muted/40 text-muted-foreground text-sm font-mono select-none">.pdf</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── Right: Drop + Page grid + Apply ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Drop zone */}
            {!pdfFile && (
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
            )}

            {/* Loading */}
            {loadingPDF && (
              <div className="flex flex-col items-center gap-3 py-12">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-sm text-muted-foreground">{t("loading.message")}</p>
              </div>
            )}

            {/* Load error */}
            {loadError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs text-red-600 dark:text-red-400">{loadError}</span>
              </div>
            )}

            {/* Page grid */}
            {pages.length > 0 && !loadingPDF && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {pages.length} {t("pages.count")}
                  </p>
                  {anyChanged && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                      {t("changes.pagesModified", { count: pages.filter(p => p.rotation !== 0).length })}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {pages.map(page => (
                    <PageCard
                      key={page.pageNum}
                      page={page}
                      onRotateCW={() => rotatePage(page.pageNum, 90)}
                      onRotateCCW={() => rotatePage(page.pageNum, -90)}
                      onReset={() => resetPage(page.pageNum)}
                      onSelect={() => toggleSelect(page.pageNum)}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Apply button */}
            {pages.length > 0 && (
              <div className="flex flex-col gap-3">

                {/* Progress */}
                {applying && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t("apply.applying")}
                      </span>
                      <span className="font-bold text-red-500">{progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Apply error */}
                {applyError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-xs text-red-600 dark:text-red-400">{applyError}</span>
                  </div>
                )}

                {/* Success */}
                {resultKb !== null && !applying && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t("success.saved")}</p>
                      <p className="text-xs text-muted-foreground">{outputName || "rotated"}.pdf · {fmtSize(resultKb)}</p>
                    </div>
                  </div>
                )}

                <button onClick={apply} disabled={applying || !anyChanged}
                  className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm shadow-red-200 dark:shadow-red-900/40 transition-all active:scale-[0.98]">
                  {applying
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("apply.saving")}</>
                    : anyChanged
                      ? <><Download className="w-4 h-4" /> {t("apply.downloadAndApply")}</>
                      : <><RotateCw className="w-4 h-4" /> {t("apply.rotateFirst")}</>}
                </button>
              </div>
            )}
          </div>
        </div>

        <HowToUse tKey="pdf-tools/RotatePDFTool.json" count={4} />
        <FAQ tKey="pdf-tools/RotatePDFTool.json" />
        <Examples tKey="pdf-tools/RotatePDFTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}