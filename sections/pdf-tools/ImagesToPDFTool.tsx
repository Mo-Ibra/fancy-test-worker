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
  ImageIcon,
  SlidersHorizontal,
  Layers,
  Maximize2,
  AlignCenter,
  ChevronUp,
  ChevronDown,
  Trash2,
  GripVertical,
} from "lucide-react";
import { useT, useLang } from "@/context/TranslationProvider";
import { buildPDF, ConvertOptions, fmtSize, ImageFile, ImageFit, loadImageFile, Orientation, PageSize, uid } from "@/funcs/pdf-tools/ImagesToPDFToolFuncs";
import Toggle from "@/components/pdf-tools/images-to-pdf/Toggle";
import ImageRow from "@/components/pdf-tools/images-to-pdf/ImageRow";
import RelatedTools from "@/components/pdf-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main ───────────────────────────────────────────────────────────

export default function ImagesToPDFTool() {
  const t = useT("pdf-tools/ImagesToPDFTool.json");

  const [images, setImages] = useState<ImageFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [resultKb, setResultKb] = useState<number | null>(null);
  const [convError, setConvError] = useState("");
  const [outputName, setOutputName] = useState("images");

  const [opts, setOpts] = useState<ConvertOptions>({
    pageSize: "A4",
    orientation: "portrait",
    imageFit: "contain",
    marginPt: 20,
    backgroundColor: "#ffffff",
    addPageNumbers: false,
    quality: 0.9,
  });

  const setOpt = <K extends keyof ConvertOptions>(k: K, v: ConvertOptions[K]) =>
    setOpts(o => ({ ...o, [k]: v }));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const addFiles = useCallback(async (files: File[]) => {
    const supported = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff"];
    const valid = files.filter(f => supported.includes(f.type) || /\.(jpe?g|png|webp|gif|bmp|tiff?)$/i.test(f.name));
    if (!valid.length) return;

    const newItems: ImageFile[] = valid.map(f => ({
      id: uid(), file: f, name: f.name,
      sizeKb: f.size / 1024,
      dataUrl: "", width: 0, height: 0,
      status: "loading",
    }));

    setImages(prev => [...prev, ...newItems]);

    for (const item of newItems) {
      try {
        const { dataUrl, width, height } = await loadImageFile(item.file);
        setImages(prev => prev.map(x => x.id === item.id
          ? { ...x, dataUrl, width, height, status: "ready" }
          : x
        ));
      } catch (e: any) {
        setImages(prev => prev.map(x => x.id === item.id
          ? { ...x, status: "error", error: e.message ?? "Failed to load" }
          : x
        ));
      }
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const removeImage = (id: string) => setImages(f => f.filter(x => x.id !== id));
  const moveUp = (i: number) => setImages(f => { const a = [...f];[a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; });
  const moveDown = (i: number) => setImages(f => { const a = [...f];[a[i], a[i + 1]] = [a[i + 1], a[i]]; return a; });

  const convert = useCallback(async () => {
    const ready = images.filter(f => f.status === "ready");
    if (!ready.length) return;
    setConverting(true);
    setConvError("");
    setResultKb(null);
    setProgress(0);

    try {
      const bytes = await buildPDF(ready, opts, (pct, idx) => {
        setProgress(pct);
        setProgressMsg(t("progress.processing", { current: idx + 1, total: ready.length }));
      });
      setProgress(100);
      setProgressMsg(t("progress.done"));
      setResultKb(bytes.length / 1024);

      const blob = new Blob([bytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${outputName || "images"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setConvError(e.message ?? "Conversion failed");
    } finally {
      setConverting(false);
    }
  }, [images, opts, outputName]);

  const readyCount = images.filter(f => f.status === "ready").length;
  const canConvert = readyCount > 0 && !converting;

  const totalSizeKb = images.reduce((s, i) => s + i.sizeKb, 0);

  const PAGE_SIZE_LABELS: Record<PageSize, string> = {
    A4: t("pageSize.a4"),
    A3: t("pageSize.a3"),
    Letter: t("pageSize.letter"),
    Legal: t("pageSize.legal"),
    fit: t("pageSize.fit"),
  };

  const FIT_OPTIONS: { key: ImageFit; label: string; desc: string; icon: React.ElementType }[] = [
    { key: "contain", icon: Maximize2, label: t("imageFit.contain.label"), desc: t("imageFit.contain.desc") },
    { key: "cover", icon: Layers, label: t("imageFit.cover.label"), desc: t("imageFit.cover.desc") },
    { key: "fill", icon: AlignCenter, label: t("imageFit.fill.label"), desc: t("imageFit.fill.desc") },
    { key: "center", icon: AlignCenter, label: t("imageFit.center.label"), desc: t("imageFit.center.desc") },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="pdf-tools/ImagesToPDFTool.json" href="/pdf-tools" />

        {/* Header */}
        <Header tKey="pdf-tools/ImagesToPDFTool.json" />

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

            {/* Page size */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.pageSize")}</p>
              <div className="flex flex-col gap-1.5">
                {(Object.keys(PAGE_SIZE_LABELS) as PageSize[]).map(key => (
                  <button key={key} onClick={() => setOpt("pageSize", key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-left text-xs transition-all ${opts.pageSize === key
                      ? "border-red-400 bg-red-50 dark:bg-red-900/20 shadow-sm font-bold text-red-600 dark:text-red-400"
                      : "border-border bg-card text-muted-foreground hover:border-red-200 font-medium"
                      }`}>
                    <div className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 ${opts.pageSize === key ? "border-red-500 bg-red-500" : "border-muted-foreground"}`} />
                    {PAGE_SIZE_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            {opts.pageSize !== "fit" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("options.orientation")}</p>
                <div className="flex gap-2">
                  {([
                    { key: "portrait" as Orientation, label: t("options.portrait"), icon: "◻" },
                    { key: "landscape" as Orientation, label: t("options.landscape"), icon: "▭" },
                  ]).map(({ key, label, icon }) => (
                    <button key={key} onClick={() => setOpt("orientation", key)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${opts.orientation === key ? "bg-red-500 border-red-500 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-red-300"
                        }`}>
                      <span className="text-base">{icon}</span> {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image fit */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.imageFit")}</p>
              <div className="flex flex-col gap-1.5">
                {FIT_OPTIONS.map(({ key, label, desc }) => (
                  <button key={key} onClick={() => setOpt("imageFit", key)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all ${opts.imageFit === key
                      ? "border-red-400 bg-red-50 dark:bg-red-900/20 shadow-sm"
                      : "border-border bg-card hover:border-red-200"
                      }`}>
                    <div className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 ${opts.imageFit === key ? "border-red-500 bg-red-500" : "border-muted-foreground"}`} />
                    <div>
                      <p className={`text-xs font-bold ${opts.imageFit === key ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>{label}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Margin */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.margin")}</p>
                <span className="text-sm font-black text-red-500 font-mono">{opts.marginPt}pt</span>
              </div>
              <input type="range" min={0} max={72} step={4} value={opts.marginPt}
                onChange={e => setOpt("marginPt", Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-border accent-red-500 cursor-pointer"
                aria-label={t("options.margin")} />
              <div className="flex justify-between text-[9px] text-muted-foreground/60 mt-1">
                <span>{t("margin.none")}</span><span>{t("margin.recommended")}</span><span>36</span><span>{t("margin.oneInch")}</span>
              </div>
            </div>

            {/* Quality */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.quality")}</p>
                <span className="text-sm font-black text-red-500 font-mono">{Math.round(opts.quality * 100)}%</span>
              </div>
              <input type="range" min={30} max={100} value={Math.round(opts.quality * 100)}
                onChange={e => setOpt("quality", Number(e.target.value) / 100)}
                className="w-full h-2 rounded-full appearance-none bg-border accent-red-500 cursor-pointer"
                aria-label={t("options.quality")} />
              <p className="text-[9px] text-muted-foreground/60 mt-1">
                {opts.quality >= 1 ? t("quality.original") : t("quality.lower")}
              </p>
            </div>

            {/* Background + page numbers */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" /> {t("moreOptions")}
              </p>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("backgroundColor")}</label>
                <div className="flex gap-1.5 flex-wrap">
                  {["#ffffff", "#000000", "#f8fafc", "#fef3c7", "transparent"].map(c => (
                    <button key={c} onClick={() => setOpt("backgroundColor", c)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${opts.backgroundColor === c ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "border-border bg-card text-muted-foreground hover:border-red-200"
                        }`}>
                      {c !== "transparent" && <span className="w-3 h-3 rounded border border-border/50 shrink-0" style={{ background: c }} />}
                      {c === "#ffffff" ? t("white") : c === "#000000" ? t("black") : c === "#f8fafc" ? t("gray") : c === "#fef3c7" ? t("cream") : t("none")}
                    </button>
                  ))}
                </div>
              </div>
              <Toggle checked={opts.addPageNumbers} onChange={v => setOpt("addPageNumbers", v)}
                label={t("options.pageNumbers")} sub={t("addPageNumbersSub")} />
            </div>

            {/* Output name */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("outputLabel")}</p>
              <div className="flex items-center gap-0">
                <input value={outputName} onChange={e => setOutputName(e.target.value)} placeholder="images"
                  className="flex-1 px-4 py-3 rounded-l-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-red-400 transition-all placeholder:text-muted-foreground/40"
                  aria-label={t("outputLabel")} />
                <span className="px-3 py-3 rounded-r-xl border border-l-0 border-border bg-muted/40 text-muted-foreground text-sm font-mono select-none">.pdf</span>
              </div>
            </div>
          </div>

          {/* ── Right: Drop + Images + Convert ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Drop zone */}
            <div
              ref={dropRef}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-border bg-muted/10 hover:border-red-300 hover:bg-red-50/30 dark:hover:bg-red-900/10 cursor-pointer transition-all"
            >
              <input ref={fileInputRef} type="file" aria-label="Upload file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,.jpg,.jpeg,.png,.webp,.gif,.bmp"
                multiple className="hidden"
                onChange={e => { addFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
              <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center">
                <Upload className="w-6 h-6 text-muted-foreground/50" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">{t("dropzone.dropHere")} {t("dropzone.orClick")}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("dropzone.imageFormats")}</p>
              </div>
            </div>

            {/* Image list */}
            {images.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {t("imageList.title", { ready: readyCount, total: images.length })}
                    <span className="ml-2 font-normal text-muted-foreground/60">{t("imageList.size", { size: fmtSize(totalSizeKb) })}</span>
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
                      {t("imageList.addMore")}
                    </button>
                    <button onClick={() => setImages([])}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
                      <X className="w-3.5 h-3.5" /> {t("imageList.clear")}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {images.map((item, i) => (
                    <ImageRow
                      key={item.id} item={item} index={i} total={images.length}
                      onMoveUp={() => moveUp(i)} onMoveDown={() => moveDown(i)}
                      onRemove={() => removeImage(item.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Convert button */}
            {images.length > 0 && (
              <div className="flex flex-col gap-3">

                {/* Progress */}
                {converting && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {progressMsg}
                      </span>
                      <span className="font-bold text-red-500">{progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Error */}
                {convError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span className="text-xs text-red-600 dark:text-red-400">{t("errors.conversionFailed")}</span>
                  </div>
                )}

                {/* Success */}
                {resultKb !== null && !converting && (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t("result.created")}</p>
                      <p className="text-xs text-muted-foreground">
                        {outputName || "images"}.pdf {t("result.size", { size: fmtSize(resultKb) })}
                      </p>
                    </div>
                  </div>
                )}

                <button onClick={convert} disabled={!canConvert}
                  className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm shadow-red-200 dark:shadow-red-900/40 transition-all active:scale-[0.98]">
                  {converting
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("convertButton.converting")}</>
                    : <><FileText className="w-5 h-5" /> {images.length === 1 ? t("convertButton.create", { count: readyCount }) : t("convertButton.create_plural", { count: readyCount })}</>}
                </button>

                {resultKb !== null && !converting && (
                  <button onClick={convert}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card hover:border-red-300 hover:text-red-500 text-xs font-medium transition-all">
                    <Download className="w-3.5 h-3.5" /> {t("result.redownload")}
                  </button>
                )}
              </div>
            )}

            {/* Empty state */}
            {images.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/30 gap-2">
                <ImageIcon className="w-10 h-10" />
                <p className="text-sm">{t("empty.message")}</p>
              </div>
            )}
          </div>
        </div>

        <HowToUse tKey="pdf-tools/ImagesToPDFTool.json" count={4} />
        <FAQ tKey="pdf-tools/ImagesToPDFTool.json" />
        <Examples tKey="pdf-tools/ImagesToPDFTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}