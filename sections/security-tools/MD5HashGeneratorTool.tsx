"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  CheckCheck,
  Upload,
  ClipboardPaste,
  Trash2,
  RefreshCw,
  FileText,
  Hash,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { ALGO_META, computeHash, HashAlgo, HashResult, InputMode, OutputCase } from "@/funcs/security-tools/MD5HashGeneratorToolFuncs";
import Toggle from "@/components/security-tools/md5hash-generator/Toggle";
import CopyButton from "@/components/security-tools/md5hash-generator/CopyButton";
import RelatedTools from "@/components/security-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main ───────────────────────────────────────────────────────────

export default function HashGeneratorTool() {
  const t = useT("security-tools/MD5HashGeneratorTool.json");

  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [textInput, setTextInput] = useState("");
  const [fileData, setFileData] = useState<{ name: string; size: number; buf: ArrayBuffer } | null>(null);
  const [outputCase, setOutputCase] = useState<OutputCase>("lower");
  const [selectedAlgos, setSelectedAlgos] = useState<Set<HashAlgo>>(new Set(["MD5", "SHA-256", "SHA-512"]));
  const [results, setResults] = useState<HashResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hmacMode, setHmacMode] = useState(false);
  const [hmacKey, setHmacKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [verifyHash, setVerifyHash] = useState("");
  const [autoHash, setAutoHash] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleAlgo = (algo: HashAlgo) => {
    setSelectedAlgos(prev => {
      const next = new Set(prev);
      next.has(algo) ? next.delete(algo) : next.add(algo);
      return next;
    });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const buf = ev.target?.result as ArrayBuffer;
      setFileData({ name: file.name, size: file.size, buf });
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const compute = useCallback(async () => {
    const data = inputMode === "text" ? textInput : fileData?.buf;
    if (!data && inputMode === "text") return;
    if (!data && inputMode === "file") return;

    setLoading(true);
    const computed: HashResult[] = [];

    for (const algo of selectedAlgos) {
      try {
        const { hex, ms } = await computeHash(
          data as string | ArrayBuffer,
          algo,
          hmacMode && hmacKey ? hmacKey : undefined,
        );
        computed.push({ algo, hex: outputCase === "upper" ? hex.toUpperCase() : hex, bits: ALGO_META[algo].bits, ms });
      } catch (err) {
        computed.push({ algo, hex: "Error computing hash", bits: 0, ms: 0 });
      }
    }

    setResults(computed);
    setLoading(false);
  }, [inputMode, textInput, fileData, selectedAlgos, outputCase, hmacMode, hmacKey]);

  // Verify
  const verifyResult = useMemo(() => {
    if (!verifyHash.trim() || results.length === 0) return null;
    const match = results.find(r => r.hex.toLowerCase() === verifyHash.trim().toLowerCase());
    return match ? { ok: true, algo: match.algo } : { ok: false, algo: "" };
  }, [verifyHash, results]);

  const ALGOS: HashAlgo[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512", "SHA3-256", "SHA3-512"];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="security-tools/MD5HashGeneratorTool.json" href="/security-tools" />

        {/* Header */}
        <Header tKey="security-tools/MD5HashGeneratorTool.json" />

        {/* Privacy notice */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 mb-6">
          <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {t("privacy.notice")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Config ── */}
          <div className="flex flex-col gap-5">

            {/* Algorithm selector */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">Algorithms</p>
              <div className="flex flex-col gap-1.5">
                {ALGOS.map(algo => {
                  const meta = ALGO_META[algo];
                  const checked = selectedAlgos.has(algo);
                  return (
                    <button key={algo} onClick={() => toggleAlgo(algo)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${checked
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                        : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40"
                        }`}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${checked ? "border-blue-500 bg-blue-500" : "border-muted-foreground"
                        }`}>
                        {checked && <CheckCheck className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold font-mono ${checked ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{algo}</span>
                          <span className="text-[9px] text-muted-foreground">{meta.bits}{t("output.bits")}</span>
                          {!meta.secure && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center gap-0.5"><AlertCircle className="w-2.5 h-2.5" /> {t("output.insecure")}</span>}
                        </div>
                        <p className="text-[9px] text-muted-foreground truncate">{t(`algo.meta.${algo}`)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setSelectedAlgos(new Set(ALGOS))}
                  className="flex-1 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-[10px] font-bold transition-all">
                  All
                </button>
                <button onClick={() => setSelectedAlgos(new Set(["SHA-256", "SHA-512"] as HashAlgo[]))}
                  className="flex-1 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-[10px] font-bold transition-all">
                  Secure only
                </button>
                <button onClick={() => setSelectedAlgos(new Set())}
                  className="flex-1 py-1.5 rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 text-[10px] font-bold transition-all">
                  None
                </button>
              </div>
            </div>

            {/* Output options */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Output</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground">Uppercase hex</span>
                <Toggle checked={outputCase === "upper"} onChange={v => setOutputCase(v ? "upper" : "lower")} />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground">HMAC mode</span>
                <Toggle checked={hmacMode} onChange={setHmacMode} />
              </div>
              {hmacMode && (
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={hmacKey}
                    onChange={e => setHmacKey(e.target.value)}
                    placeholder={t("hmac.keyPlaceholder")}
                    className="w-full px-4 py-2.5 pr-9 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40"
                    aria-label={t("hmac.keyPlaceholder")}
                  />
                  <button onClick={() => setShowKey(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Verify */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {t("verify.title")}
              </p>
              <input
                value={verifyHash}
                onChange={e => setVerifyHash(e.target.value)}
                placeholder={t("verify.placeholder")}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40"
                aria-label={t("verify.placeholder")}
              />
              {verifyResult && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${verifyResult.ok
                  ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20"
                  }`}>
                  {verifyResult.ok
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  <span className={`text-xs font-bold ${verifyResult.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                    {verifyResult.ok ? `${t("verify.match")}${verifyResult.algo}` : t("verify.noMatch")}
                  </span>
                </div>
              )}
            </div>

            {/* Example inputs */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("examples.title")}</p>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: t("examples.emptyString"), value: "" },
                  { label: t("examples.helloLower"), value: "hello" },
                  { label: t("examples.helloWorld"), value: "Hello World" },
                  { label: t("examples.password"), value: "password" },
                  { label: t("examples.lorem"), value: "The quick brown fox jumps over the lazy dog" },
                ].map(({ label, value }) => (
                  <button key={label} onClick={() => { setInputMode("text"); setTextInput(value); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground text-left transition-all">
                    <Hash className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Input + Results ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input mode toggle */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
              {([
                { key: "text" as InputMode, icon: FileText, label: t("input.textTab") },
                { key: "file" as InputMode, icon: Upload, label: t("input.fileTab") },
              ]).map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setInputMode(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${inputMode === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* Text input */}
            {inputMode === "text" && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.inputLabel")}</span>
                  <div className="flex gap-2">
                    <span className="text-xs text-muted-foreground/60">{textInput.length} {t("input.chars")}</span>
                    <button onClick={() => navigator.clipboard.readText().then(setTextInput).catch(() => { })}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                      <ClipboardPaste className="w-3.5 h-3.5" /> {t("input.paste")}
                    </button>
                    <button onClick={() => { setTextInput(""); setResults([]); }} disabled={!textInput}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder={t("input.textPlaceholder")}
                  className="h-36 px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all shadow-sm placeholder:text-muted-foreground/50"
                />
              </div>
            )}

            {/* File input */}
            {inputMode === "file" && (
              <div
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 h-36 rounded-2xl border-2 border-dashed border-border bg-muted/10 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-all"
              >
                <input ref={fileRef} type="file" className="hidden" aria-label="Upload file" onChange={handleFile} />
                {fileData ? (
                  <>
                    <FileText className="w-8 h-8 text-blue-500" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-foreground">{fileData.name}</p>
                      <p className="text-xs text-muted-foreground">{(fileData.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); setFileData(null); setResults([]); }}
                      className="text-xs text-red-500 hover:text-red-600 transition-colors">Remove</button>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground/60">Click to upload any file</p>
                    <p className="text-xs text-muted-foreground/40">Hash is computed locally</p>
                  </>
                )}
              </div>
            )}

            {/* Compute button */}
            <button
              onClick={compute}
              disabled={loading || selectedAlgos.size === 0 || (inputMode === "text" && !textInput && textInput !== "") || (inputMode === "file" && !fileData)}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all active:scale-[0.98]">
              {loading
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("output.computing")}</>
                : <><Hash className="w-4 h-4" /> {t("output.generate")}</>}
            </button>

            {/* Results */}
            {results.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("output.label")}</p>
                  <CopyButton text={results.map(r => `${r.algo}: ${r.hex}`).join("\n")} label={t("copy.copyAll")} />
                </div>
                {results.map(result => {
                  const meta = ALGO_META[result.algo];
                  const matched = verifyHash && result.hex.toLowerCase() === verifyHash.trim().toLowerCase();
                  return (
                    <div key={result.algo}
                      className={`rounded-2xl border p-4 transition-all ${matched
                        ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/10"
                        : "border-border bg-card"
                        }`}>
                      {/* Header row */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold font-mono ${meta.color}`}>{result.algo}</span>
                          <span className="text-[9px] text-muted-foreground">{meta.bits}{t("output.bits")}</span>
                          {!meta.secure && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center gap-0.5">
                              <AlertCircle className="w-2.5 h-2.5" /> {t("output.insecure")}
                            </span>
                          )}
                          {matched && <span className="text-[9px] font-bold text-emerald-500">{t("output.match")}</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          {result.ms > 0 && <span className="text-[9px] text-muted-foreground">{result.ms}ms</span>}
                          <CopyButton text={result.hex} />
                        </div>
                      </div>
                      {/* Hash value */}
                      <div className="px-3 py-2.5 rounded-xl border border-border bg-muted/20 dark:bg-muted/10 overflow-x-auto">
                        <code className={`text-xs font-mono break-all leading-relaxed select-all ${meta.color} opacity-90`}>
                          {result.hex}
                        </code>
                      </div>
                      {/* Hex groups for MD5 */}
                      {result.algo === "MD5" && !result.hex.startsWith("Error") && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {result.hex.match(/.{1,8}/g)?.map((chunk, i) => (
                            <code key={i} className="text-[9px] font-mono text-muted-foreground/60">{chunk}</code>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Compare side-by-side if >1 result */}
                {results.length >= 2 && (
                  <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Length Comparison</p>
                    <div className="flex flex-col gap-2">
                      {results.map(r => {
                        const maxLen = Math.max(...results.map(x => x.hex.length));
                        return (
                          <div key={r.algo} className="flex items-center gap-3">
                            <code className={`text-[10px] font-mono font-bold w-20 shrink-0 ${ALGO_META[r.algo].color}`}>{r.algo}</code>
                            <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                              <div className={`h-full rounded-full bg-current ${ALGO_META[r.algo].color}`}
                                style={{ width: `${(r.hex.length / maxLen) * 100}%` }} />
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground w-10 text-right">{r.hex.length}c</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="security-tools/MD5HashGeneratorTool.json" count={4} />
        <FAQ tKey="security-tools/MD5HashGeneratorTool.json" />
        <Examples tKey="security-tools/MD5HashGeneratorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}