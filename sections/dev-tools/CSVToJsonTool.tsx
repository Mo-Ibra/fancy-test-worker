"use client";

import { useState, useMemo, useRef } from "react";
import {
  Table,
  Trash2,
  ClipboardPaste,
  Download,
  Upload,
  ArrowLeftRight,
  FileCode,
  Hash,
  AlignLeft,
  AlertCircle,
  CheckCircle2,
  Settings2,
  Braces,
  LayoutList,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { buildOutput, Delimiter, detectDelimiter, detectValue, EXAMPLES, getStats, jsonToCSV, NullHandling, OutputFormat, parseCSV, ParseOptions, QuoteChar, ViewMode } from "@/funcs/dev-tools/CSVToJsonToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import Toggle from "@/components/dev-tools/csv-to-json/Toggle";
import CopyButton from "@/components/dev-tools/csv-to-json/CopyButton";
import Collapsible from "@/components/dev-tools/csv-to-json/Collapsible";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function CSVToJSONTool() {
  const t = useTranslations("dev-tools.CSVToJsonTool");
  const locale = useLocale();
  const isAr = locale === "ar";

  const [csvInput, setCsvInput] = useState(EXAMPLES[0].csv);
  const [jsonInput, setJsonInput] = useState("");
  const [direction, setDirection] = useState<"csv2json" | "json2csv">("csv2json");
  const [outputFmt, setOutputFmt] = useState<OutputFormat>("object");
  const [viewMode, setViewMode] = useState<ViewMode>("json");
  const [indent, setIndent] = useState(2);
  const [autoDetect, setAutoDetect] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const [opts, setOpts] = useState<ParseOptions>({
    delimiter: ",",
    quoteChar: '"',
    hasHeader: true,
    trimSpaces: true,
    skipEmpty: true,
    nullHandling: "empty",
    detectTypes: true,
  });

  const setOpt = <K extends keyof ParseOptions>(k: K, v: ParseOptions[K]) =>
    setOpts(o => ({ ...o, [k]: v }));

  // Auto-detect delimiter when input changes
  const effectiveDelimiter = useMemo(() => {
    if (!autoDetect || !csvInput) return opts.delimiter;
    return detectDelimiter(csvInput);
  }, [csvInput, autoDetect, opts.delimiter]);

  const effectiveOpts = useMemo(
    () => ({ ...opts, delimiter: autoDetect ? effectiveDelimiter : opts.delimiter }),
    [opts, autoDetect, effectiveDelimiter]
  );

  const parsed = useMemo(
    () => direction === "csv2json" ? parseCSV(csvInput, effectiveOpts) : { headers: [], rows: [], errors: [] },
    [csvInput, effectiveOpts, direction]
  );

  const output = useMemo(
    () => direction === "csv2json"
      ? buildOutput(parsed, outputFmt, effectiveOpts, jsonInput, effectiveOpts.delimiter, indent)
      : jsonToCSV(jsonInput, effectiveOpts.delimiter),
    [parsed, outputFmt, effectiveOpts, jsonInput, indent, direction]
  );

  const stats = useMemo(() => getStats(parsed, output), [parsed, output]);

  // Swap direction
  const swap = () => {
    if (direction === "csv2json") {
      setJsonInput(output);
      setDirection("json2csv");
    } else {
      setCsvInput(output);
      setDirection("csv2json");
    }
  };

  // File upload
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      if (direction === "csv2json") setCsvInput(text);
      else setJsonInput(text);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Download output
  const download = () => {
    const isJSON = direction === "csv2json";
    const mime = isJSON ? "application/json" : "text/csv";
    const ext = isJSON ? "json" : "csv";
    const blob = new Blob([output], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `converted.${ext}`;
    a.click();
  };

  // Table preview (first 50 rows)
  const tableRows = useMemo(() => parsed.rows.slice(0, 50), [parsed]);

  const DELIMITERS: { key: Delimiter; label: string }[] = [
    { key: ",", label: t("delimiter.comma") },
    { key: ";", label: t("delimiter.semicolon") },
    { key: "\t", label: t("delimiter.tab") },
    { key: "|", label: t("delimiter.pipe") },
    { key: " ", label: t("delimiter.space") },
  ];

  const OUTPUT_FORMATS: { key: OutputFormat; icon: React.ElementType; label: string; desc: string }[] = [
    { key: "object", icon: Braces, label: t("output.object"), desc: t.raw("output.objectDesc") },
    { key: "array", icon: LayoutList, label: t("output.array"), desc: t("output.arrayDesc") },
    { key: "grouped", icon: Hash, label: t("output.grouped"), desc: t.raw("output.groupedDesc") },
  ];

  const VIEW_MODES: { key: ViewMode; icon: React.ElementType; label: string }[] = [
    { key: "json", icon: Braces, label: t("viewMode.json") },
    { key: "table", icon: Table, label: t("viewMode.table") },
    { key: "csv", icon: AlignLeft, label: t("viewMode.csv") },
  ];

  const activeInput = direction === "csv2json" ? csvInput : jsonInput;
  const setActiveInput = direction === "csv2json" ? setCsvInput : setJsonInput;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/CSVToJsonTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/CSVToJsonTool.json" />

        {/* ── Direction + Swap ── */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex gap-1 p-1 rounded-2xl border border-border bg-card shadow-sm">
            {([
              { key: "csv2json" as const, label: t("direction.csv2json") },
              { key: "json2csv" as const, label: t("direction.json2csv") },
            ]).map(({ key, label }) => (
              <button key={key} onClick={() => setDirection(key)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${direction === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}>{label}</button>
            ))}
          </div>
          <button onClick={swap}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all"
            title="Use output as new input">
            <ArrowLeftRight className="w-3.5 h-3.5" /> {t("direction.swap")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Controls ── */}
          <div className="flex flex-col gap-5">

            {/* Delimiter */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("delimiter.title")}</p>
                <Toggle checked={autoDetect} onChange={setAutoDetect} label={t("delimiter.autoDetect")} />
              </div>
              {!autoDetect && (
                <div className="flex flex-col gap-1.5">
                  {DELIMITERS.map(({ key, label }) => (
                    <button key={String(key)} onClick={() => setOpt("delimiter", key)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium text-start transition-all ${opts.delimiter === key
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "border-border bg-card text-muted-foreground hover:border-blue-200 hover:text-foreground"
                        }`}>
                      <div className={`w-2.5 h-2.5 rounded-full border-2 shrink-0 ${opts.delimiter === key ? "border-blue-500 bg-blue-500" : "border-muted-foreground"}`} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
              {autoDetect && csvInput && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-emerald-700 dark:text-emerald-400">
                    Detected: <code className="font-mono font-bold">{effectiveDelimiter === "\t" ? "\\t (Tab)" : `"${effectiveDelimiter}"`}</code>
                  </span>
                </div>
              )}
            </div>

            {/* Parse options */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Settings2 className="w-3.5 h-3.5" /> {t("parseOptions.title")}
              </p>
              {[
                { key: "hasHeader" as keyof ParseOptions, label: t("parseOptions.hasHeader") },
                { key: "trimSpaces" as keyof ParseOptions, label: t("parseOptions.trimSpaces") },
                { key: "skipEmpty" as keyof ParseOptions, label: t("parseOptions.skipEmpty") },
                { key: "detectTypes" as keyof ParseOptions, label: t("parseOptions.detectTypes") },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-foreground">{label}</span>
                  <Toggle checked={opts[key] as boolean} onChange={v => setOpt(key, v as any)} />
                </div>
              ))}

              {/* Quote char */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground">{t("parseOptions.quoteChar")}</span>
                <div className="flex gap-1.5">
                  {(['"', "'"] as QuoteChar[]).map(q => (
                    <button key={q} onClick={() => setOpt("quoteChar", q)}
                      className={`w-8 h-8 rounded-lg border text-xs font-mono font-bold transition-all ${opts.quoteChar === q ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                        }`}>{q}</button>
                  ))}
                </div>
              </div>

              {/* Null handling */}
              <div>
                <span className="text-xs text-foreground block mb-1.5">{t("parseOptions.emptyHandling")}</span>
                <div className="flex gap-1.5">
                  {([
                    { key: "empty" as NullHandling, label: t("parseOptions.nullEmpty") },
                    { key: "null" as NullHandling, label: t("parseOptions.nullNull") },
                    { key: "skip" as NullHandling, label: t("parseOptions.nullSkip") },
                  ]).map(({ key, label }) => (
                    <button key={key} onClick={() => setOpt("nullHandling", key)}
                      className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold font-mono transition-all ${opts.nullHandling === key ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                        }`}>{label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output format (csv2json only) */}
            {direction === "csv2json" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("output.title")}</p>
                <div className="flex flex-col gap-1.5">
                  {OUTPUT_FORMATS.map(({ key, icon: Icon, label, desc }) => (
                    <button key={key} onClick={() => setOutputFmt(key)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-start transition-all ${outputFmt === key
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                        : "border-border bg-card hover:border-blue-200"
                        }`}>
                      <div className={`w-3 h-3 rounded-full border-2 shrink-0 ${outputFmt === key ? "border-blue-500 bg-blue-500" : "border-muted-foreground"}`} />
                      <div>
                        <p className={`text-xs font-bold ${outputFmt === key ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
                        <code className="text-[10px] font-mono text-muted-foreground">{desc}</code>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Indent */}
            {direction === "csv2json" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("output.indent")}</p>
                  <span className="text-sm font-bold text-blue-500">{indent}</span>
                </div>
                <div className="flex gap-2">
                  {[0, 2, 4].map(n => (
                    <button key={n} onClick={() => setIndent(n)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${indent === n ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                        }`}>{n === 0 ? t("output.minified") : n === 2 ? t("output.spaces2") : t("output.spaces4")}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            {parsed.rows.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("stats.title")}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: t("stats.rows"), value: stats.rows },
                    { label: t("stats.columns"), value: stats.columns },
                    { label: t("stats.cells"), value: stats.cells },
                    { label: t("stats.output"), value: `${stats.outputKb} KB` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                      <span className="text-sm font-bold text-foreground">{value}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("examples.title")}</p>
              <div className="flex flex-col gap-1.5">
                {EXAMPLES.map(({ label, csv }) => (
                  <button key={label} onClick={() => { setCsvInput(csv); setDirection("csv2json"); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground text-start transition-all">
                    <FileCode className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Input + Output ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {direction === "csv2json" ? t("input.csvInput") : t("input.jsonInput")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground/60">{activeInput.length.toLocaleString()} chars</span>
                  <button onClick={() => navigator.clipboard.readText().then(setActiveInput).catch(() => { })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                    <ClipboardPaste className="w-3.5 h-3.5" /> {t("actions.paste")}
                  </button>
                  <button onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                    <Upload className="w-3.5 h-3.5" /> {t("actions.file")}
                  </button>
                  <input ref={fileRef} type="file" accept=".csv,.json,.tsv,.txt" className="hidden" aria-label="Upload file" onChange={handleFile} />
                  <button onClick={() => setActiveInput("")} disabled={!activeInput}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={activeInput}
                onChange={e => setActiveInput(e.target.value)}
                placeholder={direction === "csv2json"
                  ? "Paste CSV here or click File to upload…\n\nid,name,email\n1,Ahmed,ahmed@example.com"
                  : "Paste JSON array here…\n\n[{\"id\": 1, \"name\": \"Ahmed\"}]"
                }
                className="h-48 px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm placeholder:text-muted-foreground/50"
                spellCheck={false}
              />

              {/* Parse errors */}
              {parsed.errors.length > 0 && (
                <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400">{parsed.errors.length} warning{parsed.errors.length > 1 ? "s" : ""}</p>
                    {parsed.errors.slice(0, 3).map((e, i) => (
                      <p key={i} className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">{e}</p>
                    ))}
                    {parsed.errors.length > 3 && <p className="text-[10px] text-muted-foreground mt-0.5">+{parsed.errors.length - 3} more…</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Output header with view mode */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("output.title")}</span>
              <div className="flex items-center gap-2 flex-wrap">
                {/* View mode tabs */}
                <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                  {VIEW_MODES.map(({ key, icon: Icon, label }) => (
                    <button key={key} onClick={() => setViewMode(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}>
                      <Icon className="w-3.5 h-3.5" />{label}
                    </button>
                  ))}
                </div>
                <CopyButton text={output} label={t("actions.copy")} />
                <button onClick={download} disabled={!output}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-40 transition-all">
                  <Download className="w-3.5 h-3.5" /> {t("actions.download")}
                </button>
              </div>
            </div>

            {/* ── JSON view ── */}
            {viewMode === "json" && (
              <div className="max-h-[480px] overflow-auto px-5 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm" dir="ltr">
                {output ? (
                  <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all">
                    {output}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic font-sans">{t("outputEmpty")}</p>
                )}
              </div>
            )}

            {/* ── Table view ── */}
            {viewMode === "table" && (
              <div className="max-h-[480px] overflow-auto rounded-2xl border border-border shadow-sm">
                {parsed.headers.length > 0 ? (
                  <table className="w-full text-xs border-collapse">
                    <thead className="sticky top-0">
                      <tr className="bg-muted/60 dark:bg-muted/30">
                        <th className="px-3 py-2.5 border-b border-border text-center font-bold text-muted-foreground w-8">#</th>
                        {parsed.headers.map((h, i) => (
                          <th key={i} className="px-3 py-2.5 border-b border-border text-start font-bold text-foreground whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              {h}
                              <span className="text-[9px] font-normal text-muted-foreground/50">{i}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, ri) => (
                        <tr key={ri} className={ri % 2 === 0 ? "bg-card" : "bg-muted/10"}>
                          <td className="px-3 py-2 border-b border-border text-center text-muted-foreground/50 font-mono tabular-nums">{ri + 1}</td>
                          {parsed.headers.map((_, ci) => {
                            const val = row[ci] ?? "";
                            const detected = opts.detectTypes ? detectValue(val, opts.nullHandling) : val;
                            const isNum = typeof detected === "number";
                            const isBool = typeof detected === "boolean";
                            const isNull = detected === null || detected === undefined;
                            return (
                              <td key={ci} className="px-3 py-2 border-b border-border max-w-[200px] truncate">
                                <span className={
                                  isNull ? "text-muted-foreground/40 italic" :
                                    isBool ? "text-purple-500 dark:text-purple-400 font-mono" :
                                      isNum ? "text-amber-500 font-mono tabular-nums" :
                                        "text-foreground"
                                }>
                                  {isNull ? "null" : String(detected)}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40">
                    <Table className="w-8 h-8 mb-2" />
                    <p className="text-xs">{t("tableEmpty")}</p>
                  </div>
                )}
                {parsed.rows.length > 50 && (
                  <div className="px-4 py-2.5 bg-muted/30 border-t border-border text-center text-xs text-muted-foreground">
                    {t("tableShowing", { count: parsed.rows.length })}
                  </div>
                )}
              </div>
            )}

            {/* ── CSV view (reverse) ── */}
            {viewMode === "csv" && (
              <div className="max-h-[480px] overflow-auto px-5 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm" dir="ltr">
                {output ? (
                  <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                    {direction === "json2csv" ? output : (() => {
                      try {
                        return jsonToCSV(output, effectiveOpts.delimiter);
                      } catch { return output; }
                    })()}
                  </pre>
                ) : (
                  <p className="text-sm text-muted-foreground/50 italic font-sans">{t("csvOutputEmpty")}</p>
                )}
              </div>
            )}

            {output && <CopyButton text={output} label={direction === "csv2json" ? "Copy JSON" : "Copy CSV"} full />}

            {/* Field mapping info */}
            {parsed.headers.length > 0 && direction === "csv2json" && (
              <Collapsible title={t("mapping.title", { count: parsed.headers.length })} defaultOpen={false}>
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="grid grid-cols-4 bg-muted/40 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                    <span>#</span><span>CSV Header</span><span>JSON Key</span><span>Sample Value</span>
                  </div>
                  <div className="divide-y divide-border max-h-48 overflow-y-auto">
                    {parsed.headers.map((h, i) => {
                      const sample = parsed.rows[0]?.[i] ?? "";
                      const detected = opts.detectTypes ? detectValue(sample, opts.nullHandling) : sample;
                      const typeName = detected === null ? "null" : typeof detected;
                      return (
                        <div key={i} className="grid grid-cols-4 px-4 py-2.5 hover:bg-muted/20 items-center">
                          <span className="text-[10px] font-mono text-muted-foreground/60 tabular-nums">{i}</span>
                          <code className="text-xs font-mono font-bold text-blue-500 dark:text-blue-400 truncate">{h}</code>
                          <code className="text-xs font-mono text-foreground truncate">{h}</code>
                          <span className="flex items-center gap-1.5">
                            <code className="text-xs font-mono text-muted-foreground truncate">{String(sample).slice(0, 12)}</code>
                            <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${typeName === "number" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" :
                              typeName === "boolean" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" :
                                typeName === "null" ? "bg-muted text-muted-foreground" :
                                  "bg-blue-50 dark:bg-blue-900/20 text-blue-500"
                              }`}>{typeName}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Collapsible>
            )}
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/CSVToJsonTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/CSVToJsonTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/CSVToJsonTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}