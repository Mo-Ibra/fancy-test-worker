"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Fingerprint,
  Sparkles,
  Trash2,
  RefreshCw,
  History,
  Download,
  Hash,
  Settings2,
  CheckCircle2,
  XCircle,
  ClipboardPaste,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { applyFormat, GeneratedID, nanoid, objectId, OutputCase, OutputFormat, ulid, uuidV1, uuidV4, uuidV5, UUIDVersion, validateUUID, VERSION_INFO } from "@/funcs/dev-tools/UUIDGeneratorToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import CopyButton from "@/components/dev-tools/uuid-generator/CopyButton";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function UUIDGeneratorTool() {
  const t = useT("dev-tools/UUIDGeneratorTool.json");

  const [version, setVersion] = useState<UUIDVersion>("v4");
  const [outputCase, setOutputCase] = useState<OutputCase>("lower");
  const [format, setFormat] = useState<OutputFormat>("plain");
  const [bulkCount, setBulkCount] = useState(10);
  const [nanoidSize, setNanoidSize] = useState(21);
  const [v5Namespace, setV5Namespace] = useState("6ba7b810-9dad-11d1-80b4-00c04fd430c8");
  const [v5Name, setV5Name] = useState("");
  const [history, setHistory] = useState<GeneratedID[]>([]);
  const [bulk, setBulk] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"single" | "bulk" | "validate" | "history">("single");

  // Single generated ID
  const [single, setSingle] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  // Validate tab
  const [validateInput, setValidateInput] = useState("");
  const validationResult = useMemo(() => {
    if (!validateInput.trim()) return null;
    return validateUUID(validateInput);
  }, [validateInput]);

  const generate = useCallback(async (): Promise<string> => {
    switch (version) {
      case "v4": return uuidV4();
      case "v1": return uuidV1();
      case "v5": return uuidV5(v5Namespace, v5Name || "example");
      case "ulid": return ulid();
      case "nanoid": return nanoid(nanoidSize);
      case "objectid": return objectId();
    }
  }, [version, v5Namespace, v5Name, nanoidSize]);

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const id = await generate();
      const fmt = applyFormat(id, format, outputCase);
      setSingle(fmt);
      setHistory((h) => [{ id: fmt, version, ts: Date.now() }, ...h].slice(0, 50));
    } finally {
      setGenerating(false);
    }
  }, [generate, format, outputCase, version]);

  const handleBulk = useCallback(async () => {
    setGenerating(true);
    try {
      const ids: string[] = [];
      for (let i = 0; i < bulkCount; i++) {
        const id = await generate();
        ids.push(applyFormat(id, format, outputCase));
      }
      setBulk(ids);
      setHistory((h) => [...ids.map((id) => ({ id, version, ts: Date.now() })), ...h].slice(0, 100));
    } finally {
      setGenerating(false);
    }
  }, [generate, bulkCount, format, outputCase, version]);

  const downloadBulk = () => {
    if (!bulk.length) return;
    const blob = new Blob([bulk.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${version}-ids-${Date.now()}.txt`;
    a.click();
  };

  const info = VERSION_INFO[version];

  const TABS = [
    { key: "single" as const, label: t("tabs.single") },
    { key: "bulk" as const, label: t("tabs.bulk") },
    { key: "validate" as const, label: t("tabs.validate") },
    { key: "history" as const, label: t("tabs.history") },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        <BreadCrumb tKey="dev-tools/UUIDGeneratorTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/UUIDGeneratorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Controls ── */}
          <div className="flex flex-col gap-5">

            {/* Version selector */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.version")}</p>
              <div className="flex flex-col gap-1.5">
                {(Object.entries(VERSION_INFO) as [UUIDVersion, typeof VERSION_INFO[UUIDVersion]][]).map(([key, { label, subtitle, badge, badgeColor }]) => (
                  <button key={key} onClick={() => setVersion(key)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 ${version === key
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                      : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40"
                      }`}
                  >
                    <div className={`mt-0.5 w-3 h-3 rounded-full border-2 shrink-0 ${version === key ? "border-blue-500 bg-blue-500" : "border-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${version === key ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{subtitle}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${badgeColor}`}>{badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* v5 options */}
            {version === "v5" && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5" /> {t("options.v5Settings")}
                </p>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">{t("options.namespaceUuid")}</label>
                  <input value={v5Namespace} onChange={(e) => setV5Namespace(e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all"
                    aria-label={t("options.namespaceUuid")} />
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {[
                      { label: "DNS", val: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" },
                      { label: "URL", val: "6ba7b811-9dad-11d1-80b4-00c04fd430c8" },
                      { label: "OID", val: "6ba7b812-9dad-11d1-80b4-00c04fd430c8" },
                    ].map(({ label: l, val }) => (
                      <button key={l} onClick={() => setV5Namespace(val)}
                        className="px-2 py-1 rounded-lg border border-border bg-muted/30 text-[10px] font-bold text-muted-foreground hover:border-blue-300 hover:text-blue-500 transition-all">
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">{t("options.name")}</label>
                  <input value={v5Name} onChange={(e) => setV5Name(e.target.value)}
                    placeholder="e.g. example.com"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:border-blue-400 transition-all"
                    aria-label={t("options.name")} />
                </div>
              </div>
            )}

            {/* NanoID size */}
            {version === "nanoid" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.nanoidLength")}</p>
                  <span className="text-sm font-bold text-blue-500">{nanoidSize}</span>
                </div>
                <input type="range" min={8} max={64} value={nanoidSize}
                  onChange={(e) => setNanoidSize(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                  aria-label={t("options.nanoidLength")} />
                <div className="flex justify-between text-[10px] text-muted-foreground/60 mt-1">
                  <span>8</span><span>{t("options.default")}</span><span>64</span>
                </div>
              </div>
            )}

            {/* Output options */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" /> {t("options.outputOptions")}
              </p>

              {/* Case */}
              {["v4", "v1", "v5"].includes(version) && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">{t("options.case")}</label>
                  <div className="flex gap-2">
                    {(["lower", "upper"] as OutputCase[]).map((c) => (
                      <button key={c} onClick={() => setOutputCase(c)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-bold capitalize transition-all ${outputCase === c ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-muted/20 text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                          }`}>{c}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Format */}
              {["v4", "v1", "v5"].includes(version) && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">{t("options.format")}</label>
                  <div className="flex flex-col gap-1.5">
                    {([
                      { key: "plain", preview: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
                      { key: "braces", preview: "{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}" },
                      { key: "urn", preview: "urn:uuid:xxxxxxxx-xxxx-..." },
                    ] as { key: OutputFormat; preview: string }[]).map(({ key, preview }) => (
                      <button key={key} onClick={() => setFormat(key)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition-all ${format === key ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-border bg-muted/20 hover:border-blue-200"
                          }`}
                      >
                        <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${format === key ? "border-blue-500 bg-blue-500" : "border-muted-foreground"}`} />
                        <div>
                          <p className={`text-[10px] font-bold capitalize ${format === key ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{key}</p>
                          <code className="text-[9px] text-muted-foreground font-mono">{preview}</code>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Tab bar */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
              {TABS.map(({ key, label }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${activeTab === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                >{label}{key === "history" && history.length > 0 ? ` (${history.length})` : ""}</button>
              ))}
            </div>

            {/* ── Single tab ── */}
            {activeTab === "single" && (
              <div className="flex flex-col gap-4">
                {/* Type info */}
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                  <Fingerprint className="w-5 h-5 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{info.label}</p>
                    <p className="text-xs text-muted-foreground">{info.subtitle}</p>
                  </div>
                  <span className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-full ${info.badgeColor}`}>{info.badge}</span>
                </div>

                {/* Generated ID display */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("output.generatedId")}</span>
                    {single && <CopyButton text={single} />}
                  </div>
                  <div className="flex items-center gap-3 px-5 py-5 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm min-h-[80px]">
                    {single ? (
                      <code className="flex-1 text-sm font-mono text-foreground break-all leading-relaxed select-all">{single}</code>
                    ) : (
                      <p className="text-sm text-muted-foreground/50 italic">{t("output.empty")}</p>
                    )}
                  </div>
                </div>

                {/* Generate button */}
                <button onClick={handleGenerate} disabled={generating}
                  className="flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-bold transition-all duration-200 shadow-sm shadow-blue-200 dark:shadow-blue-900/40">
                  {generating
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("generate.generating")}</>
                    : <><Sparkles className="w-4 h-4" /> {t("generate.buttonWithType", { type: info.label })}</>}
                </button>

                {single && <CopyButton text={single} label={t("actions.copyId", { type: info.label })} full />}

                {/* v5 determinism note */}
                {version === "v5" && (
                  <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-purple-50 dark:bg-purple-900/20">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      {t("v5note")}
                    </p>
                  </div>
                )}

                {/* Stats */}
                {single && (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: t("stats.type"), value: info.label },
                      { label: t("stats.length"), value: t("stats.outputChars", { count: single.length }) },
                      { label: t("stats.format"), value: format === "plain" ? t("output.standard") : format === "braces" ? t("output.braces") : t("output.urn") },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                        <span className="text-sm font-bold text-foreground">{value}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Bulk tab ── */}
            {activeTab === "bulk" && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("options.bulkCount")}</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min={1} max={1000} value={bulkCount}
                        onChange={(e) => setBulkCount(Number(e.target.value))}
                        className="flex-1 h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                        aria-label={t("options.bulkCount")} />
                      <input type="number" min={1} max={1000} value={bulkCount}
                        onChange={(e) => setBulkCount(Math.min(1000, Math.max(1, Number(e.target.value))))}
                        className="w-16 px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm text-center font-bold focus:outline-none focus:border-blue-400 transition-all"
                        aria-label={t("options.bulkCount")} />
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[10, 50, 100, 500].map((n) => (
                        <button key={n} onClick={() => setBulkCount(n)}
                          className={`flex-1 py-1 rounded-lg border text-[10px] font-bold transition-all ${bulkCount === n ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                            }`}>{n}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <button onClick={handleBulk} disabled={generating}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-bold transition-all duration-200">
                  {generating ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("generate.generating")}</> : <><Sparkles className="w-4 h-4" /> {t("generate.bulkButton", { count: bulkCount })}</>}
                </button>

                {bulk.length > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("output.idsGenerated", { count: bulk.length })}</span>
                      <div className="flex gap-2">
                        <CopyButton text={bulk.join("\n")} label={t("actions.copyAll")} />
                        <button onClick={downloadBulk}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-emerald-300 hover:text-emerald-600 transition-all">
                          <Download className="w-3.5 h-3.5" /> {t("actions.downloadFull")}
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm">
                      {bulk.map((id, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0 border-border hover:bg-muted/30 group transition-colors">
                          <span className="text-[10px] text-muted-foreground/50 w-8 shrink-0 text-right tabular-nums">{i + 1}</span>
                          <code className="flex-1 text-xs font-mono text-foreground">{id}</code>
                          <CopyButton text={id} label="" small className="opacity-0 group-hover:opacity-100" />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Validate tab ── */}
            {activeTab === "validate" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("validation.placeholder")}</span>
                  <div className="flex gap-2">
                    <input
                      value={validateInput}
                      onChange={(e) => setValidateInput(e.target.value)}
                      placeholder={t("validation.placeholder")}
                      className="flex-1 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/50"
                      aria-label={t("validation.placeholder")}
                    />
                    <button onClick={() => navigator.clipboard.readText().then(setValidateInput).catch(() => { })}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs transition-all">
                      <ClipboardPaste className="w-4 h-4" />
                    </button>
                    <button onClick={() => setValidateInput("")} disabled={!validateInput}
                      className="w-10 flex items-center justify-center rounded-xl border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {validationResult && (
                  <div className={`p-5 rounded-2xl border ${validationResult.ok
                    ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20"
                    }`}>
                    <div className="flex items-center gap-3 mb-3">
                      {validationResult.ok
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        : <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
                      <p className={`text-sm font-bold ${validationResult.ok ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {validationResult.ok ? t("validation.valid") : t("validation.invalid")} {validationResult.version || "ID"}
                      </p>
                    </div>
                    {validationResult.ok && (
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {[
                          { label: t("validation.detectedType"), value: validationResult.version },
                          { label: t("stats.length"), value: t("stats.outputChars", { count: validateInput.trim().length }) },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex flex-col items-center py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/30 bg-white/50 dark:bg-black/10">
                            <span className="text-sm font-bold text-foreground">{value}</span>
                            <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!validateInput && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40 gap-2">
                    <Hash className="w-8 h-8" />
                    <span className="text-xs">{t("validation.emptyHint")}</span>
                  </div>
                )}

                {/* Valid examples */}
                <div className="p-4 rounded-xl border border-border bg-card">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("validation.examples")}</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: "UUID v4", ex: "550e8400-e29b-41d4-a716-446655440000" },
                      { label: "UUID v1", ex: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" },
                      { label: "UUID v4 (Braces)", ex: "{550e8400-e29b-41d4-a716-446655440000}" },
                      { label: "URN", ex: "urn:uuid:550e8400-e29b-41d4-a716-446655440000" },
                      { label: "ULID", ex: "01ARZ3NDEKTSV4RRFFQ69G5FAV" },
                    ].map(({ label: l, ex }) => (
                      <button key={l} onClick={() => setValidateInput(ex)}
                        className="flex items-center gap-3 group hover:bg-muted/30 px-2 py-1.5 rounded-lg transition-colors text-left">
                        <span className="text-[10px] font-bold text-muted-foreground w-24 shrink-0">{l}</span>
                        <code className="text-xs font-mono text-foreground/70 group-hover:text-foreground truncate transition-colors">{ex}</code>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── History tab ── */}
            {activeTab === "history" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {history.length === 1 ? t("history.title1") : `${history.length} ${t("history.title")}`}
                  </span>
                  <div className="flex gap-2">
                    {history.length > 0 && (
                      <>
                        <CopyButton text={history.map((h) => h.id).join("\n")} label={t("actions.copyAll")} />
                        <button onClick={() => setHistory([])}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
                          <Trash2 className="w-3.5 h-3.5" /> {t("actions.clear")}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {history.length > 0 ? (
                  <div className="max-h-[500px] overflow-y-auto rounded-2xl border border-border bg-muted/10 shadow-sm">
                    {history.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0 border-border hover:bg-muted/30 group transition-colors">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${VERSION_INFO[h.version].badgeColor}`}>
                          {VERSION_INFO[h.version].label}
                        </span>
                        <code className="flex-1 text-xs font-mono text-foreground truncate">{h.id}</code>
                        <span className="text-[10px] text-muted-foreground/50 shrink-0 hidden sm:block">
                          {new Date(h.ts).toLocaleTimeString()}
                        </span>
                        <CopyButton text={h.id} label="" small className="opacity-0 group-hover:opacity-100" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40 gap-2">
                    <History className="w-8 h-8" />
                    <span className="text-xs">{t("history.empty")}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/UUIDGeneratorTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/UUIDGeneratorTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/UUIDGeneratorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}