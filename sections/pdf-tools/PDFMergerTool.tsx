"use client";

import { useState, useRef, useCallback } from "react";
import {
  FileText,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import PDFLib from "@/funcs/pdf-tools/pdf-lib";
import { fmtSize, MergeStatus, PageRange, parsePageRange, PDFFile, readPageCount, uid } from "@/funcs/pdf-tools/PDFMergerToolFuncs";
import DropZone from "@/components/pdf-tools/pdf-merger/DropZone";
import FileRow from "@/components/pdf-tools/pdf-merger/FileRow";
import RelatedTools from "@/components/pdf-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import Instructions from "@/components/pdf-tools/pdf-merger/Instructions";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function PDFMergerTool() {
  const t = useT("pdf-tools/PDFMergerTool.json");

  const [files, setFiles] = useState<PDFFile[]>([]);
  const [mergeStatus, setMergeStatus] = useState<MergeStatus>("idle");
  const [mergeError, setMergeError] = useState("");
  const [outputName, setOutputName] = useState("merged");
  const [progress, setProgress] = useState(0);
  const [resultKb, setResultKb] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (newFiles: File[]) => {

    const items: PDFFile[] = newFiles.map(f => ({
      id: uid(),
      file: f,
      name: f.name,
      sizeKb: f.size / 1024,
      pageCount: null,
      status: "reading",
      pages: { mode: "all", custom: "" },
    }));

    setFiles(prev => [...prev, ...items]);

    // Read page counts
    for (const item of items) {
      try {
        const count = await readPageCount(item.file);
        setFiles(prev => prev.map(f =>
          f.id === item.id ? { ...f, pageCount: count, status: "ready" } : f
        ));
      } catch (e: any) {
        setFiles(prev => prev.map(f =>
          f.id === item.id ? { ...f, status: "error", error: e.message ?? "Could not read PDF" } : f
        ));
      }
    }
  }, []);

  const removeFile = (id: string) => setFiles(f => f.filter(x => x.id !== id));
  const moveUp = (i: number) => setFiles(f => { const a = [...f];[a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; });
  const moveDown = (i: number) => setFiles(f => { const a = [...f];[a[i], a[i + 1]] = [a[i + 1], a[i]]; return a; });

  const updatePageRange = (id: string, mode: PageRange["mode"], custom: string) => {
    setFiles(f => f.map(x => x.id === id ? { ...x, pages: { mode, custom } } : x));
  };

  const totalPages = files.reduce((sum, f) => {
    if (f.status !== "ready" || f.pageCount === null) return sum;
    if (f.pages.mode === "all") return sum + f.pageCount;
    const pages = parsePageRange(f.pages.custom, f.pageCount);
    return sum + pages.length;
  }, 0);

  const canMerge = files.filter(f => f.status === "ready").length >= 2;

  const merge = useCallback(async () => {
    if (!canMerge) return;
    setMergeStatus("merging");
    setMergeError("");
    setProgress(0);
    setResultKb(null);

    try {
      const merged = await PDFLib.PDFDocument.create();
      const readyFiles = files.filter(f => f.status === "ready");

      for (let i = 0; i < readyFiles.length; i++) {
        const item = readyFiles[i];
        setProgress(Math.round((i / readyFiles.length) * 90));
        const buf = await item.file.arrayBuffer();
        const doc = await PDFLib.PDFDocument.load(buf, { ignoreEncryption: true });
        const total = doc.getPageCount();

        let pageIndices: number[];
        if (item.pages.mode === "all") {
          pageIndices = Array.from({ length: total }, (_, k) => k);
        } else {
          const oneBased = parsePageRange(item.pages.custom, total);
          pageIndices = oneBased.map(n => n - 1);
        }

        if (pageIndices.length === 0) continue;
        const copied = await merged.copyPages(doc, pageIndices);
        copied.forEach((page: any) => merged.addPage(page));
      }

      setProgress(95);
      const bytes = await merged.save();
      setProgress(100);
      setResultKb(bytes.length / 1024);

      // Trigger download
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${outputName.trim() || "merged"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setMergeStatus("done");
    } catch (e: any) {
      setMergeStatus("error");
      setMergeError(e.message ?? "Merge failed");
    }
  }, [files, canMerge, outputName]);

  const reset = () => {
    setFiles([]);
    setMergeStatus("idle");
    setMergeError("");
    setProgress(0);
    setResultKb(null);
  };

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="pdf-tools/PDFMergerTool.json" href="/pdf-tools" />

        {/* Header */}
        <Header tKey="pdf-tools/PDFMergerTool.json" />

        {/* Privacy notice */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 mb-6">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {t("privacy.notice")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Settings ── */}
          <div className="flex flex-col gap-5">

            {/* Output settings */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("output.title")}</p>
              <div className="flex items-center gap-0">
                <input
                  value={outputName}
                  onChange={e => setOutputName(e.target.value)}
                  placeholder="merged"
                  className="flex-1 px-4 py-3 rounded-l-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40"
                  aria-label={t("output.title")}
                />
                <span className="px-3 py-3 rounded-r-xl border border-l-0 border-border bg-muted/40 text-muted-foreground text-sm font-mono select-none">.pdf</span>
              </div>
            </div>

            {/* Summary */}
            {files.length > 0 && (
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("summary.title")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: t("summary.files"), value: files.length },
                    { label: t("summary.ready"), value: files.filter(f => f.status === "ready").length },
                    { label: t("summary.totalPages"), value: totalPages },
                    { label: t("summary.totalSize"), value: fmtSize(files.reduce((s, f) => s + f.sizeKb, 0)) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-muted/10">
                      <span className="text-base font-bold font-mono text-foreground">{value}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <Instructions />

            {/* Error state */}
            {mergeStatus === "error" && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">{t("error.mergeFailed")}</p>
                  <p className="text-[10px] text-red-500">{mergeError}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Files + Merge ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Drop zone */}
            <DropZone onFiles={addFiles} />

            {/* File list */}
            {files.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("fileList.title", { count: files.length })}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                      <Plus className="w-3.5 h-3.5" /> {t("fileList.addMore")}
                    </button>
                    <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" multiple className="hidden" aria-label="Upload file"
                      onChange={e => { const f = Array.from(e.target.files ?? []); if (f.length) { addFiles(f); e.target.value = ""; } }} />
                    <button onClick={reset}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
                      <Trash2 className="w-3.5 h-3.5" /> {t("fileList.clearAll")}
                    </button>
                  </div>
                </div>

                {files.map((item, i) => (
                  <FileRow
                    key={item.id}
                    item={item}
                    index={i}
                    total={files.length}
                    onMoveUp={() => moveUp(i)}
                    onMoveDown={() => moveDown(i)}
                    onRemove={() => removeFile(item.id)}
                    onPageRangeChange={(mode, custom) => updatePageRange(item.id, mode, custom)}
                  />
                ))}
              </div>
            )}

            {/* Merge button */}
            {files.length >= 2 && (
              <div className="flex flex-col gap-3">

                {/* Progress bar */}
                {mergeStatus === "merging" && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t("merge.merging")}
                      </span>
                      <span className="font-bold text-blue-500">{progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Success */}
                {mergeStatus === "done" && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t("merge.success")}</p>
                      <p className="text-xs text-muted-foreground">
                        {outputName || "merged"}.pdf {t("merge.saved", { size: resultKb !== null ? fmtSize(resultKb) : "" })}
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={merge}
                  disabled={!canMerge || mergeStatus === "merging"}
                  className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm shadow-red-200 dark:shadow-red-900/40 transition-all active:scale-[0.98]"
                >
                  {mergeStatus === "merging"
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("merge.merging")}</>
                    : <><Download className="w-5 h-5" /> {t("merge.button")}</>}
                </button>

                {!canMerge && files.length >= 2 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                    {t("merge.waiting")}
                  </p>
                )}

                {mergeStatus === "done" && (
                  <button onClick={merge}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                    <Download className="w-3.5 h-3.5" /> {t("merge.downloadAgain")}
                  </button>
                )}
              </div>
            )}

            {/* Empty state */}
            {files.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/30 gap-2">
                <FileText className="w-10 h-10" />
                <p className="text-sm">{t("empty.message")}</p>
              </div>
            )}
          </div>
        </div>

        <HowToUse tKey="pdf-tools/PDFMergerTool.json" count={4} />
        <FAQ tKey="pdf-tools/PDFMergerTool.json" />
        <Examples tKey="pdf-tools/PDFMergerTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}