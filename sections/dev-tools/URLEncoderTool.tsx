"use client";

import { useState, useMemo } from "react";
import {
  Link2,
  Copy,
  Trash2,
  ClipboardPaste,
  ArrowLeftRight,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { decodeURL, ENCODE_MODES, EncodeMode, encodeURL, ENCODING_TABLE, EXAMPLES, Mode, parseURLParts } from "@/funcs/dev-tools/UrlEncoderToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import CopyButton from "@/components/dev-tools/url-encoder/CopyButton";
import diffHighlight from "@/components/dev-tools/url-encoder/diffHighlight";
import Collapsible from "@/components/dev-tools/url-encoder/Collapsible";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function URLEncoderTool() {
  const t = useTranslations("dev-tools.URLEncoderTool");

  const [mode, setMode] = useState<Mode>("encode");
  const [encMode, setEncMode] = useState<EncodeMode>("component");
  const [input, setInput] = useState("");
  const [charFilter, setCharFilter] = useState<"All" | "Common" | "Unicode">("All");

  const { result: encoded, error: encError } = useMemo(
    () => (mode === "encode" ? encodeURL(input, encMode) : { result: "", error: "" }),
    [input, encMode, mode]
  );

  const { result: decoded, error: decError } = useMemo(
    () => (mode === "decode" ? decodeURL(input) : { result: "", error: "" }),
    [input, mode]
  );

  const output = mode === "encode" ? encoded : decoded;
  const error = mode === "encode" ? encError : decError;

  const urlParts = useMemo(() => {
    const src = mode === "encode" ? output : input;
    if (!src.trim()) return null;
    return parseURLParts(src);
  }, [output, input, mode]);

  // Stats
  const encodedCount = useMemo(() => {
    if (!encoded) return 0;
    return (encoded.match(/%[0-9A-F]{2}/gi) ?? []).length;
  }, [encoded]);

  const compressionRatio = useMemo(() => {
    if (!input || !output) return null;
    return Math.round((output.length / input.length) * 100);
  }, [input, output]);

  const filteredTable = charFilter === "All"
    ? ENCODING_TABLE
    : ENCODING_TABLE.filter((r) => r.category === charFilter);

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/URLEncoderTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/URLEncoderTool.json" />

        {/* ── Mode toggle ── */}
        <div className="flex gap-1 p-1 rounded-2xl border border-border bg-card shadow-sm mb-6 max-w-sm">
          {(["encode", "decode"] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setInput(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold capitalize transition-all duration-200 ${mode === m ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {m === "encode" ? <Link2 className="w-4 h-4" /> : <ArrowLeftRight className="w-4 h-4" />}
              {t(`mode.${m}`)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: controls ── */}
          <div className="flex flex-col gap-5">

            {/* Encoding mode (encode only) */}
            {mode === "encode" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("encoding.method")}</p>
                <div className="flex flex-col gap-2">
                  {ENCODE_MODES.map(({ key, label, desc, example }) => (
                    <button key={key} onClick={() => setEncMode(key)}
                      className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${encMode === key
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                        : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40"
                        }`}
                    >
                      <div className={`mt-1 w-3 h-3 rounded-full border-2 shrink-0 ${encMode === key ? "border-blue-500 bg-blue-500" : "border-muted-foreground"}`} />
                      <div className="min-w-0">
                        <p className={`text-xs font-bold font-mono ${encMode === key ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}()</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{desc}</p>
                        <p className="text-[10px] text-blue-400 dark:text-blue-500 mt-1 italic">{example}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            {input && output && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("encoding.stats")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: t("encoding.inputLength"), value: `${input.length} ${t("encoding.chars")}` },
                    { label: t("encoding.outputLength"), value: `${output.length} ${t("encoding.chars")}` },
                    ...(mode === "encode" ? [
                      { label: t("encoding.encodedCountLabel"), value: encodedCount },
                      { label: t("encoding.sizeRatio"), value: `${compressionRatio}%` },
                    ] : [
                      { label: t("encoding.decodedCountLabel"), value: output.length },
                      { label: t("encoding.sizeRatio"), value: `${compressionRatio}%` },
                    ]),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                      <span className="text-sm font-bold text-foreground">{value}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 text-center">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* URL breakdown */}
            {urlParts && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("encoding.urlBreakdown")}</p>
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  {[
                    { label: t("encoding.protocol"), value: urlParts.protocol },
                    { label: t("encoding.host"), value: urlParts.host },
                    { label: t("encoding.port"), value: urlParts.port || "—" },
                    { label: t("encoding.path"), value: urlParts.pathname },
                    { label: t("encoding.query"), value: urlParts.search || "—" },
                    { label: t("encoding.hash"), value: urlParts.hash || "—" },
                  ].filter(({ value }) => value && value !== "—").map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-3 px-4 py-2.5 border-b last:border-0 border-border hover:bg-muted/20 transition-colors">
                      <span className="text-[10px] font-bold text-muted-foreground w-14 shrink-0 pt-0.5 uppercase tracking-wide">{label}</span>
                      <code className="text-xs font-mono text-foreground break-all flex-1">{value}</code>
                      <button onClick={() => navigator.clipboard.writeText(value)}
                        className="shrink-0 opacity-0 hover:opacity-100 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-all">
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                  {urlParts.params.length > 0 && (
                    <div className="px-4 py-3 bg-muted/20 dark:bg-muted/10 border-t border-border">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("encoding.parameters")}</p>
                      <div className="flex flex-col gap-2">
                        {urlParts.params.map(({ key, value, encodedKey, encodedValue }, i) => (
                          <div key={i} className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 font-mono">{key}</span>
                              <span className="text-[10px] text-muted-foreground">=</span>
                              <code className="text-[10px] font-mono text-foreground">{value}</code>
                            </div>
                            <code className="text-[9px] font-mono text-muted-foreground/60">{encodedKey}={encodedValue}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Examples */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("encoding.examples")}</p>
              <div className="flex flex-col gap-1.5">
                {EXAMPLES[mode].map(({ label, value }) => (
                  <button key={label} onClick={() => setInput(value)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground text-left transition-all">
                    <FileCode className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: input / output ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {mode === "encode" ? t("encoding.toEncode") : t("encoding.encoded")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/60">{input.length} {t("encoding.chars")}</span>
                  <button onClick={() => navigator.clipboard.readText().then(setInput).catch(() => { })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all">
                    <ClipboardPaste className="w-3.5 h-3.5" /> {t("encoding.paste")}
                  </button>
                  <button onClick={() => setInput("")} disabled={!input}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === "encode"
                    ? `${t("encoding.pasteUrl")}\n\n${t("encoding.exampleUrl")}`
                    : `${t("encoding.pasteEncoded")}\n\n${t("encoding.exampleEncoded")}`
                }
                className="h-40 px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Swap button */}
            {output && !error && (
              <div className="flex justify-center">
                <button
                  onClick={() => { setInput(output); setMode(mode === "encode" ? "decode" : "encode"); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium transition-all"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  {t("encoding.swap")}
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
              </div>
            )}

            {/* Output */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {mode === "encode" ? t("encoding.output") : t("encoding.outputDecoded")}
                </span>
                <div className="flex items-center gap-2">
                  {output && <span className="text-xs text-muted-foreground/60">{output.length} {t("encoding.chars")}</span>}
                  <CopyButton text={output} />
                </div>
              </div>

              <div className="min-h-40 px-5 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm overflow-auto">
                {output ? (
                  <div>
                    {/* Diff highlight for encode mode */}
                    {mode === "encode" && encodedCount > 0 ? (
                      <div className="mb-3 pb-3 border-b border-border">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          {t("encoding.highlighted")} <span className="text-blue-500">{t("encoding.blueEncoded")}</span>
                          {encMode === "form" && <>, <span className="text-orange-500">{t("encoding.orangeSpace")}</span></>}
                        </p>
                        <pre className="text-sm font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all">
                          {diffHighlight(input, output)}
                        </pre>
                      </div>
                    ) : null}
                    <pre className="text-sm font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all select-all">
                      {output}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic font-sans">
                    {input ? (error ? t("encoding.fixError") : t("encoding.processing")) : t("encoding.outputPlaceholder")}
                  </p>
                )}
              </div>

              {output && !error && <CopyButton text={output} label={mode === "encode" ? t("encoding.copyEncoded") : t("encoding.copyDecoded")} full />}
            </div>

            {/* ── Encoding reference table (collapsible) ── */}
            <Collapsible title={t("encoding.encodingReference")}>
              <div className="flex gap-2 mb-3">
                {(["All", "Common", "Unicode"] as const).map((f) => (
                  <button key={f} onClick={() => setCharFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${charFilter === f ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                      }`}>{f}</button>
                ))}
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-4 gap-0 bg-muted/40 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                  <span>{t("encoding.char")}</span><span>{t("encoding.encodedChars")}</span><span className="col-span-2">{t("encoding.description")}</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-border">
                  {filteredTable.map(({ char, encoded, description }) => (
                    <div key={char} className="grid grid-cols-4 gap-0 px-4 py-2.5 hover:bg-muted/20 transition-colors items-center group">
                      <code className="text-sm font-mono font-bold text-foreground">{char}</code>
                      <button
                        onClick={() => navigator.clipboard.writeText(encoded)}
                        className="flex items-center gap-1 group/code"
                        title="Click to copy"
                      >
                        <code className="text-xs font-mono text-blue-500 dark:text-blue-400">{encoded}</code>
                        <Copy className="w-2.5 h-2.5 text-muted-foreground/40 group/code-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all ml-1" />
                      </button>
                      <span className="text-[10px] text-muted-foreground col-span-2">{description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Collapsible>

            {/* ── When to use what ── */}
            <Collapsible title={t("encoding.whenToUse")}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ENCODE_MODES.map(({ key, label, desc, example }) => (
                  <div key={key} className={`p-3 rounded-xl border transition-all ${encMode === key && mode === "encode" ? "border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20" : "border-border bg-muted/20"}`}>
                    <code className="text-xs font-bold text-blue-500 dark:text-blue-400 block mb-1">{label}()</code>
                    <p className="text-[10px] text-muted-foreground leading-snug mb-1.5">{desc}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 italic">{example}</p>
                  </div>
                ))}
              </div>
            </Collapsible>

          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/URLEncoderTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/URLEncoderTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/URLEncoderTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}