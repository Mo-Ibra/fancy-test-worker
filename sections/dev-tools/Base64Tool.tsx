"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Code2,
  Trash2,
  ClipboardPaste,
  ArrowLeftRight,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { b64ToBlob, decodeBase64, encodeBase64, encodeFileToBase64, EXAMPLES, fmtSize, InputType, Mode, sniffMime, Variant, VARIANT_INFO } from "@/funcs/dev-tools/Base64ToolFuncs";
import StatCard from "@/components/dev-tools/base64/StatCard";
import FileDropZone from "@/components/dev-tools/base64/FileDropZone";
import CopyButton from "@/components/dev-tools/base64/CopyButton";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import Header from "@/components/Header";
import BreadCrumb from "@/components/BreadCrumb";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function Base64Tool() {
  const t = useTranslations("dev-tools.Base64Tool");

  const [mode, setMode] = useState<Mode>("encode");
  const [inputType, setInputType] = useState<InputType>("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [variant, setVariant] = useState<Variant>("standard");
  const [error, setError] = useState("");
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; mime: string } | null>(null);
  const [processing, setProcessing] = useState(false);

  // Derived stats
  const inputBytes = useMemo(() => new Blob([input]).size, [input]);
  const outputBytes = useMemo(() => new Blob([output]).size, [output]);
  const overhead = inputBytes > 0 && outputBytes > 0
    ? `${output ? (((outputBytes / inputBytes) - 1) * 100).toFixed(0) : 0}%`
    : "—";

  const reset = () => { setInput(""); setOutput(""); setError(""); setFileInfo(null); };

  // Auto-process text as user types
  const processText = useCallback((raw: string, m: Mode, v: Variant) => {
    setError("");
    if (!raw.trim()) { setOutput(""); return; }
    try {
      setOutput(m === "encode" ? encodeBase64(raw, v) : decodeBase64(raw, v));
    } catch (e: any) {
      setOutput("");
      setError(e.message);
    }
  }, []);

  const handleInput = (val: string) => {
    setInput(val);
    processText(val, mode, variant);
  };

  const handleModeSwitch = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    // Swap input/output
    const prev = output;
    setInput(prev);
    setOutput("");
    setError("");
    processText(prev, newMode, variant);
  };

  const handleVariantChange = (v: Variant) => {
    setVariant(v);
    processText(input, mode, v);
  };

  const handleFile = async (file: File) => {
    setProcessing(true);
    setError("");
    try {
      const b64 = await encodeFileToBase64(file);
      setFileInfo({ name: file.name, size: file.size, mime: file.type || "application/octet-stream" });
      setInput(b64);
      setOutput(variant === "urlsafe" ? b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "") :
        variant === "mime" ? b64.match(/.{1,76}/g)?.join("\r\n") ?? b64 : b64);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadDecoded = () => {
    if (!output || mode !== "decode") return;
    const mime = sniffMime(input.replace(/\s/g, ""));
    const blob = b64ToBlob(input.replace(/\s/g, ""), mime);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `decoded.${mime.split("/")[1] ?? "bin"}`;
    a.click();
  };

  const isImageOutput = useMemo(() => {
    if (mode !== "decode" || !input.trim()) return false;
    const mime = sniffMime(input.replace(/\s/g, ""));
    return mime.startsWith("image/");
  }, [mode, input]);

  const imagePreviewSrc = useMemo(() => {
    if (!isImageOutput) return null;
    const mime = sniffMime(input.replace(/\s/g, ""));
    return `data:${mime};base64,${input.replace(/\s/g, "")}`;
  }, [isImageOutput, input]);

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/Base64Tool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/Base64Tool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Controls ── */}
          <div className="flex flex-col gap-5">

            {/* Mode toggle */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("mode.title")}</p>
              <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                {(["encode", "decode"] as Mode[]).map((m) => (
                  <button key={m} onClick={() => { setMode(m); reset(); }}
                    className={`flex-1 py-2.5 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${mode === m ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >{m === "encode" ? t("mode.encode") : t("mode.decode")}</button>
                ))}
              </div>
            </div>

            {/* Input type (encode only) */}
            {mode === "encode" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("inputType.title")}</p>
                <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                  {([
                    { key: "text" as InputType, icon: FileText, label: t("inputType.text") },
                    { key: "file" as InputType, icon: Upload, label: t("inputType.file") },
                  ]).map(({ key, icon: Icon, label }) => (
                    <button key={key} onClick={() => { setInputType(key); reset(); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${inputType === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("variant.title")}</p>
              <div className="flex flex-col gap-1.5">
                {(Object.entries(VARIANT_INFO) as [Variant, typeof VARIANT_INFO[Variant]][]).map(([key, { label, description }]) => (
                  <button key={key} onClick={() => handleVariantChange(key)}
                    className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${variant === key
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                      : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40"
                      }`}
                  >
                    <div className={`mt-0.5 w-3 h-3 rounded-full border-2 shrink-0 transition-colors ${variant === key ? "border-blue-500 bg-blue-500" : "border-muted-foreground"}`} />
                    <div>
                      <p className={`text-xs font-bold ${variant === key ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            {(input || output) && (
              <div className="grid grid-cols-2 gap-2">
                <StatCard label={t("stats.input")} value={fmtSize(inputBytes)} />
                <StatCard label={t("stats.output")} value={fmtSize(outputBytes)} />
                <StatCard label={t("stats.ratio")} value={inputBytes > 0 ? `${(outputBytes / Math.max(inputBytes, 1)).toFixed(2)}×` : "—"} accent />
                <StatCard label={t("stats.overhead")} value={mode === "encode" ? overhead : "—"} />
              </div>
            )}

            {/* Examples */}
            {mode === "encode" && inputType === "text" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("examples.title")}</p>
                <div className="flex flex-col gap-1.5">
                  {EXAMPLES.map(({ label, value }) => (
                    <button key={label} onClick={() => handleInput(value)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground text-left transition-all duration-200">
                      <Code2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Swap shortcut */}
            {output && (
              <button onClick={handleModeSwitch}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card text-sm font-semibold text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all duration-200">
                <ArrowLeftRight className="w-4 h-4" />
                {t("swap.label")}
              </button>
            )}
          </div>

          {/* ── Input / Output panels ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {mode === "encode" ? (inputType === "file" ? t("input.fileInput") : t("input.textToEncode")) : t("input.base64ToDecode")}
                </span>
                {inputType === "text" && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground/60">{input.length.toLocaleString()} chars</span>
                    <button onClick={() => navigator.clipboard.readText().then((t) => handleInput(t)).catch(() => { })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all duration-200">
                      <ClipboardPaste className="w-3.5 h-3.5" /> Paste
                    </button>
                    <button onClick={reset} disabled={!input}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* File upload (encode mode) */}
              {mode === "encode" && inputType === "file" ? (
                <>
                  <FileDropZone onFile={handleFile} />
                  {fileInfo && (
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{fileInfo.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{fileInfo.mime} · {fmtSize(fileInfo.size)}</p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <textarea
                  value={input}
                  onChange={(e) => handleInput(e.target.value)}
                  placeholder={mode === "encode" ? t("input.encodePlaceholder") : t("input.decodePlaceholder")}
                  className={`h-52 px-5 py-4 rounded-2xl border text-sm leading-relaxed font-mono resize-none focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm bg-card text-foreground placeholder:text-muted-foreground/50 ${error
                    ? "border-red-300 dark:border-red-800 focus:border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30"
                    : output
                      ? "border-emerald-300 dark:border-emerald-800 focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
                      : "border-border focus:border-blue-400 dark:focus:border-blue-600 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    }`}
                />
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Output */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {mode === "encode" ? t("output.base64Output") : t("output.decodedText")}
                </span>
                <div className="flex items-center gap-2">
                  {output && <span className="text-xs text-muted-foreground/60">{output.length.toLocaleString()} chars</span>}
                  {mode === "decode" && output && (
                    <button onClick={handleDownloadDecoded}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200">
                      <Download className="w-3.5 h-3.5" /> {t("actions.download")}
                    </button>
                  )}
                  <CopyButton text={output} />
                </div>
              </div>

              {/* Image preview (decode → image) */}
              {isImageOutput && imagePreviewSrc && (
                <div className="h-40 rounded-2xl border border-border overflow-hidden flex items-center justify-center bg-muted/20"
                  style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}>
                  <img src={imagePreviewSrc} alt="Decoded" className="max-h-full max-w-full object-contain" />
                </div>
              )}

              <div className="min-h-52 max-h-[400px] overflow-auto px-5 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm">
                {output ? (
                  <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all">{output}</pre>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic font-sans">
                    {error ? t("output.emptyError") : input ? t("output.emptyProcessing") : t("output.emptyOutput")}
                  </p>
                )}
              </div>
            </div>

            {/* Copy button strip */}
            {output && (
              <CopyButton
                text={output}
                label={mode === "encode" ? t("output.copyBase64") : t("output.copyDecoded")}
                full
              />
            )}

            {/* Variant quick-reference */}
            <div className="p-5 rounded-2xl border border-border bg-card">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("quickRef.title")}</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: t("quickRef.standardAlphabet"), value: "A–Z a–z 0–9 + / =" },
                  { label: t("quickRef.urlSafeAlphabet"), value: "A–Z a–z 0–9 - _ (no padding)" },
                  { label: t("quickRef.sizeOverhead"), value: "~33% larger than original" },
                  { label: t("quickRef.commonUses"), value: "Email (MIME), JWT tokens, Data URLs, API payloads" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-28 shrink-0 mt-0.5">{label}</span>
                    <span className="text-xs text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/Base64Tool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/Base64Tool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/Base64Tool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}