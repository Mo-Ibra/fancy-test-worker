"use client";

import { useState, useRef, useCallback } from "react";
import {
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Scissors,
  Hash,
  List,
  Plus,
  X,
  Archive,
  SplitSquareHorizontal,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import PDFLib from "@/funcs/pdf-tools/pdf-lib";
import { downloadBytes, fmtSize, loadJSZip, parsePageList, SplitMode, SplitRange, SplitResult, uid } from "@/funcs/pdf-tools/PDFSplitterToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import DropZone from "@/components/pdf-tools/pdf-splitter/DropZone";
import RangeRow from "@/components/pdf-tools/pdf-splitter/RangeRow";
import ResultCard from "@/components/pdf-tools/pdf-splitter/ResultCard";
import RelatedTools from "@/components/pdf-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main ───────────────────────────────────────────────────────────

export default function PDFSplitterTool() {
  const t = useT("pdf-tools/PDFSplitterTool.json");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [pdfError, setPdfError] = useState("");

  const [mode, setMode] = useState<SplitMode>("every-page");
  const [chunkSize, setChunkSize] = useState(1);
  const [ranges, setRanges] = useState<SplitRange[]>([
    { id: uid(), value: "", label: "" },
  ]);

  const [splitting, setSplitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<SplitResult[]>([]);
  const [splitError, setSplitError] = useState("");
  const [outputBase, setOutputBase] = useState("");

  const pdfBufRef = useRef<ArrayBuffer | null>(null);

  // Load file
  const handleFile = useCallback(async (file: File) => {
    setPdfFile(file);
    setOutputBase(file.name.replace(/\.pdf$/i, ""));
    setLoadingPDF(true);
    setPdfError("");
    setResults([]);
    try {
      const buf = await file.arrayBuffer();
      pdfBufRef.current = buf;
      const doc = await PDFLib.PDFDocument.load(buf, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
    } catch (e: any) {
      setPdfError(e.message ?? t("file.readError"));
    } finally {
      setLoadingPDF(false);
    }
  }, []);

  // Add / remove / change range rows
  const addRange = () => setRanges(r => [...r, { id: uid(), value: "", label: "" }]);
  const removeRange = (id: string) => setRanges(r => r.filter(x => x.id !== id));
  const changeRange = (id: string, field: "value" | "label", val: string) =>
    setRanges(r => r.map(x => x.id === id ? { ...x, [field]: val } : x));

  // Build split plan
  function buildPlan(): { pages: number[]; name: string }[] {
    if (!pageCount) return [];
    const base = outputBase || "split";

    if (mode === "every-page") {
      return Array.from({ length: pageCount }, (_, i) => ({
        pages: [i + 1],
        name: `${base}_page-${String(i + 1).padStart(String(pageCount).length, "0")}.pdf`,
      }));
    }

    if (mode === "fixed-pages") {
      const plan: { pages: number[]; name: string }[] = [];
      let part = 1;
      for (let i = 1; i <= pageCount; i += chunkSize) {
        const end = Math.min(i + chunkSize - 1, pageCount);
        const pages = Array.from({ length: end - i + 1 }, (_, k) => i + k);
        plan.push({ pages, name: `${base}_part-${part}_pages-${i}-${end}.pdf` });
        part++;
      }
      return plan;
    }

    if (mode === "ranges") {
      return ranges
        .map((r, i) => {
          const pages = parsePageList(r.value, pageCount);
          if (!pages.length) return null;
          const label = r.label.trim() || `part-${i + 1}`;
          return { pages, name: `${base}_${label}.pdf` };
        })
        .filter(Boolean) as { pages: number[]; name: string }[];
    }

    return [];
  }

  const plan = buildPlan();
  const canSplit = pdfFile && pageCount && !loadingPDF && plan.length > 0;

  // Do the split
  const split = useCallback(async () => {
    if (!canSplit || !pdfBufRef.current) return;
    setSplitting(true);
    setProgress(0);
    setSplitError("");
    setResults([]);

    try {
      const srcDoc = await PDFLib.PDFDocument.load(pdfBufRef.current, { ignoreEncryption: true });
      const builtPlan = buildPlan();
      const out: SplitResult[] = [];

      for (let i = 0; i < builtPlan.length; i++) {
        setProgress(Math.round((i / builtPlan.length) * 95));
        const { pages, name } = builtPlan[i];
        const newDoc = await PDFLib.PDFDocument.create();
        const indices = pages.map(p => p - 1).filter(idx => idx >= 0 && idx < srcDoc.getPageCount());
        if (!indices.length) continue;
        const copied = await newDoc.copyPages(srcDoc, indices);
        copied.forEach((page: any) => newDoc.addPage(page));
        const bytes = await newDoc.save();
        out.push({ name, pages: indices.length, sizeKb: bytes.length / 1024, bytes });
      }

      setResults(out);
      setProgress(100);
    } catch (e: any) {
      setSplitError(e.message ?? t("button.splitError"));
    } finally {
      setSplitting(false);
    }
  }, [canSplit, buildPlan]);

  // Download all as zip
  const downloadAll = useCallback(async () => {
    if (!results.length) return;
    const JSZip = await loadJSZip();
    const zip = new JSZip();
    results.forEach(r => zip.file(r.name, r.bytes));
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${outputBase || "split"}_pages.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results, outputBase]);

  const reset = () => {
    setPdfFile(null); setPageCount(null); setPdfError("");
    setResults([]); setSplitError(""); setProgress(0);
    pdfBufRef.current = null;
  };

  const MODES: { key: SplitMode; icon: React.ElementType; label: string; desc: string }[] = [
    { key: "every-page", icon: Hash, label: t("splitMode.everyPage.label"), desc: t("splitMode.everyPage.desc") },
    { key: "fixed-pages", icon: SplitSquareHorizontal, label: t("splitMode.fixedPages.label"), desc: t("splitMode.fixedPages.desc") },
    { key: "ranges", icon: List, label: t("splitMode.ranges.label"), desc: t("splitMode.ranges.desc") },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="pdf-tools/PDFSplitterTool.json" href="/pdf-tools" />

        {/* Header */}
        <Header tKey="pdf-tools/PDFSplitterTool.json" />

        {/* Privacy notice */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 mb-6">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {t("privacy.notice")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Config ── */}
          <div className="flex flex-col gap-5">

            {/* File info */}
            {pdfFile && (
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{pdfFile.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{fmtSize(pdfFile.size / 1024)}</span>
                    {loadingPDF && <span className="text-[10px] text-blue-500 flex items-center gap-1"><RefreshCw className="w-2.5 h-2.5 animate-spin" /> {t("file.loading")}</span>}
                    {pageCount && <span className="text-[10px] text-muted-foreground">{pageCount} {t("file.pages")}</span>}
                    {pdfError && <span className="text-[10px] text-red-500">{pdfError}</span>}
                  </div>
                </div>
                <button onClick={reset}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mode selector */}
            {pageCount && (
              <>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("splitMode.title")}</p>
                  <div className="flex flex-col gap-2">
                    {MODES.map(({ key, icon: Icon, label, desc }) => (
                      <button key={key} onClick={() => setMode(key)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${mode === key
                          ? "border-red-400 bg-red-50 dark:bg-red-900/20 shadow-sm"
                          : "border-border bg-card hover:border-red-200 dark:hover:border-red-800/40"
                          }`}>
                        <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${mode === key ? "border-red-500 bg-red-500" : "border-muted-foreground"}`} />
                        <Icon className={`w-4 h-4 shrink-0 ${mode === key ? "text-red-500" : "text-muted-foreground"}`} />
                        <div>
                          <p className={`text-xs font-bold ${mode === key ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>{label}</p>
                          <p className="text-[10px] text-muted-foreground">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fixed-page chunk size */}
                {mode === "fixed-pages" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("chunkSize.label")}</p>
                      <span className="text-sm font-black text-red-500 font-mono">{chunkSize}</span>
                    </div>
                    <input type="range" min={1} max={Math.max(1, Math.floor((pageCount ?? 2) / 2))} value={chunkSize}
                      onChange={e => setChunkSize(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none bg-border accent-red-500 cursor-pointer"
                      aria-label={t("chunkSize.label")} />
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {[1, 2, 3, 5, 10].filter(n => n <= (pageCount ?? 1)).map(n => (
                        <button key={n} onClick={() => setChunkSize(n)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all ${chunkSize === n ? "bg-red-500 border-red-500 text-white" : "border-border bg-card text-muted-foreground hover:border-red-300"
                            }`}>{n}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Output base name */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("output.label")}</p>
                  <input value={outputBase} onChange={e => setOutputBase(e.target.value)}
                    placeholder={t("output.placeholder")}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-red-400 transition-all placeholder:text-muted-foreground/40"
                    aria-label={t("output.label")} />
                </div>

                {/* Plan summary */}
                {plan.length > 0 && (
                  <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("plan.title")}</p>
                    <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                      {plan.slice(0, 20).map((p, i) => (
                        <div key={i} className="flex items-center gap-2 py-1.5 border-b last:border-0 border-border/50">
                          <span className="text-[9px] font-bold text-muted-foreground/50 w-5 text-right tabular-nums">{i + 1}</span>
                          <span className="text-[10px] font-mono text-foreground flex-1 truncate">{p.name.split("/").pop()}</span>
                          <span className="text-[9px] text-muted-foreground">{p.pages.length}p</span>
                        </div>
                      ))}
                      {plan.length > 20 && (
                        <p className="text-[10px] text-muted-foreground/50 text-center py-1">{t("plan.andMore", { count: plan.length - 20 })}</p>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-foreground mt-2">{plan.length} {t("plan.outputFiles")}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Right: Drop + Ranges + Results ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Drop zone */}
            <DropZone onFile={handleFile} hasFile={!!pdfFile} />

            {/* Custom ranges builder */}
            {mode === "ranges" && pageCount && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("pageRanges.title")} <span className="normal-case font-normal text-muted-foreground/60">({pageCount} {t("pageRanges.totalPages")})</span>
                  </p>
                  <button onClick={addRange}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
                    <Plus className="w-3.5 h-3.5" /> {t("pageRanges.addRange")}
                  </button>
                </div>

                {/* Column headers */}
                <div className="flex gap-3 px-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  <span className="w-6" />
                  <span className="flex-1 ml-0">{t("pageRanges.pageRange")}</span>
                  <span className="w-36">{t("pageRanges.outputLabel")}</span>
                  <span className="w-8" />
                </div>

                {ranges.map((r, i) => (
                  <RangeRow
                    key={r.id} range={r} totalPages={pageCount} index={i}
                    onChange={changeRange} onRemove={removeRange}
                  />
                ))}

                {ranges.length === 0 && (
                  <div className="flex flex-col items-center py-6 text-muted-foreground/40 gap-2">
                    <List className="w-6 h-6" />
                    <p className="text-xs">{t("pageRanges.addRangeEmpty")}</p>
                  </div>
                )}

                {/* Quick add presets */}
                <div className="flex gap-2 flex-wrap">
                  <p className="text-[10px] text-muted-foreground/60 mr-1 self-center">{t("pageRanges.quickAdd")}</p>
                  {[
                    { label: t("pageRanges.firstHalf"), value: `1-${Math.floor((pageCount ?? 2) / 2)}` },
                    { label: t("pageRanges.secondHalf"), value: `${Math.floor((pageCount ?? 2) / 2) + 1}-${pageCount}` },
                    { label: t("pageRanges.oddPages"), value: Array.from({ length: Math.ceil((pageCount ?? 0) / 2) }, (_, i) => i * 2 + 1).join(",") },
                    { label: t("pageRanges.evenPages"), value: Array.from({ length: Math.floor((pageCount ?? 0) / 2) }, (_, i) => (i + 1) * 2).join(",") },
                  ].map(({ label, value }) => (
                    <button key={label}
                      onClick={() => setRanges(r => [...r, { id: uid(), value, label: label.toLowerCase().replace(/ /g, "-") }])}
                      className="px-2.5 py-1 rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 text-[10px] font-bold transition-all">
                      + {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Split button */}
            {canSplit && (
              <div className="flex flex-col gap-3">

                {splitting && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t("button.splitting")}
                      </span>
                      <span className="font-bold text-red-500">{progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {splitError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-xs text-red-600 dark:text-red-400">{splitError}</span>
                  </div>
                )}

                <button onClick={split} disabled={splitting}
                  className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white text-sm font-bold shadow-sm shadow-red-200 dark:shadow-red-900/40 transition-all active:scale-[0.98]">
                  {splitting
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("button.splitting")}</>
                    : <><Scissors className="w-5 h-5" /> {t("button.split", { count: plan.length })}</>}
                </button>
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("result.title", { count: results.length })}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={downloadAll}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                      <Archive className="w-3.5 h-3.5" /> {t("result.downloadZip")}
                    </button>
                    <button
                      onClick={() => results.forEach((r, i) => setTimeout(() => downloadBytes(r.bytes, r.name), i * 120))}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                      <Download className="w-3.5 h-3.5" /> {t("result.downloadAll")}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
                  {results.map((r, i) => (
                    <ResultCard key={r.name} result={r} index={i}
                      onDownload={() => downloadBytes(r.bytes, r.name)} />
                  ))}
                </div>

                {/* Summary */}
                <div className="flex items-center gap-4 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-emerald-700 dark:text-emerald-400">
                    {t("result.splitComplete", { count: results.length, size: fmtSize(results.reduce((s, r) => s + r.sizeKb, 0)) })}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <HowToUse tKey="pdf-tools/PDFSplitterTool.json" count={4} />
        <FAQ tKey="pdf-tools/PDFSplitterTool.json" />
        <Examples tKey="pdf-tools/PDFSplitterTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}