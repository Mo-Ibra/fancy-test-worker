"use client";

import { useState, useMemo, useCallback } from "react";
import {
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Key,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Hash,
  Type,
  Shuffle,
  History,
  Trash2,
  Download,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { analyzeStrength, generateMemorable, generatePassphrase, generatePassword, generatePIN, GenMode, PassphraseOptions, PasswordOptions } from "@/funcs/security-tools/PasswordGeneratorToolFuncs";
import Toggle from "@/components/security-tools/password-generator/Toggle";
import StrengthBar from "@/components/security-tools/password-generator/StrengthBar";
import CopyButton from "@/components/security-tools/password-generator/CopyButton";
import RelatedTools from "@/components/security-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Mode tabs ──────────────────────────────────────────────────────

const MODES: { key: GenMode; icon: React.ElementType; label: string; desc: string }[] = [
  { key: "password", icon: Lock, label: "Password", desc: "Random chars" },
  { key: "passphrase", icon: Type, label: "Passphrase", desc: "Words chain" },
  { key: "pin", icon: Hash, label: "PIN", desc: "Digits only" },
  { key: "memorable", icon: Shuffle, label: "Memorable", desc: "Word+num+sym" },
];

// ── Main ───────────────────────────────────────────────────────────

export default function PasswordGeneratorTool() {
  const t = useT("security-tools/PasswordGeneratorTool.json");

  const [mode, setMode] = useState<GenMode>("password");
  const [generated, setGenerated] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [bulkCount, setBulkCount] = useState(5);
  const [pinLength, setPinLength] = useState(6);

  // Password opts
  const [pwOpts, setPwOpts] = useState<PasswordOptions>({
    length: 16, uppercase: true, lowercase: true, digits: true, symbols: true,
    exclude: "", noAmbiguous: false, noRepeats: false, customChars: "",
  });

  // Passphrase opts
  const [ppOpts, setPpOpts] = useState<PassphraseOptions>({
    wordCount: 4, separator: "-", capitalize: true, addNumber: true, addSymbol: false,
  });

  const setPwOpt = <K extends keyof PasswordOptions>(k: K, v: PasswordOptions[K]) =>
    setPwOpts(o => ({ ...o, [k]: v }));

  const setPpOpt = <K extends keyof PassphraseOptions>(k: K, v: PassphraseOptions[K]) =>
    setPpOpts(o => ({ ...o, [k]: v }));

  // Check your own password
  const [checkPw, setCheckPw] = useState("");
  const [showCheckPw, setShowCheckPw] = useState(false);
  const checkStrength = useMemo(() => analyzeStrength(checkPw), [checkPw]);

  const generate = useCallback(() => {
    const results: string[] = [];
    for (let i = 0; i < bulkCount; i++) {
      let pw = "";
      if (mode === "password") pw = generatePassword(pwOpts);
      else if (mode === "passphrase") pw = generatePassphrase(ppOpts);
      else if (mode === "pin") pw = generatePIN(pinLength);
      else if (mode === "memorable") pw = generateMemorable(pwOpts);
      results.push(pw);
    }
    setGenerated(results);
    setHistory(h => [...results, ...h].slice(0, 100));
  }, [mode, pwOpts, ppOpts, bulkCount, pinLength]);

  const firstPassword = generated[0] ?? "";
  const firstStrength = useMemo(() => analyzeStrength(firstPassword), [firstPassword]);

  const downloadAll = () => {
    const blob = new Blob([generated.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "passwords.txt";
    a.click();
  };

  const separatorOptions = [
    { label: "Hyphen -", value: "-" },
    { label: "Dot .", value: "." },
    { label: "Underscore", value: "_" },
    { label: "Space", value: " " },
    { label: "None", value: "" },
    { label: "CamelCase", value: "CC" }, // special
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="security-tools/PasswordGeneratorTool.json" href="/security-tools" />

        {/* Header */}
        <Header tKey="security-tools/PasswordGeneratorTool.json" />

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

            {/* Mode tabs */}
            <div className="grid grid-cols-2 gap-2">
              {MODES.map(({ key, icon: Icon }) => (
                <button key={key} onClick={() => setMode(key)}
                  className={`flex items-start gap-2.5 px-3.5 py-3 rounded-xl border text-left transition-all ${mode === key
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm"
                    : "border-border bg-card hover:border-emerald-200 dark:hover:border-emerald-800/40"
                    }`}>
                  <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${mode === key ? "text-emerald-500" : "text-muted-foreground"}`} />
                  <div>
                    <p className={`text-xs font-bold ${mode === key ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"}`}>{t(`modes.${key}`)}</p>
                    <p className="text-[10px] text-muted-foreground">{t(`modes.${key}Desc`)}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Password options */}
            {(mode === "password" || mode === "memorable") && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.title")}</p>

                {mode === "password" && (
                  <>
                    {/* Length */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs text-foreground font-medium">{t("options.length")}</label>
                        <span className="text-sm font-bold text-emerald-500 font-mono">{pwOpts.length}</span>
                      </div>
                      <input type="range" min={4} max={128} value={pwOpts.length}
                        onChange={e => setPwOpt("length", Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none bg-border accent-emerald-500 cursor-pointer"
                        aria-label={t("options.length")} />
                      <div className="flex justify-between text-[9px] text-muted-foreground/60 mt-1">
                        <span>4</span><span>8</span><span>16</span><span>32</span><span>64</span><span>128</span>
                      </div>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {[8, 12, 16, 24, 32, 64].map(n => (
                          <button key={n} onClick={() => setPwOpt("length", n)}
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all ${pwOpts.length === n ? "bg-emerald-500 border-emerald-500 text-white" : "border-border bg-card text-muted-foreground hover:border-emerald-300"
                              }`}>{n}</button>
                        ))}
                      </div>
                    </div>

                    {/* Character types */}
                    <div className="flex flex-col gap-2">
                      {[
                        { key: "uppercase" as keyof PasswordOptions, preview: "ABC" },
                        { key: "lowercase" as keyof PasswordOptions, preview: "abc" },
                        { key: "digits" as keyof PasswordOptions, preview: "123" },
                        { key: "symbols" as keyof PasswordOptions, preview: "!@#" },
                      ].map(({ key, preview }) => (
                        <div key={key} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <code className="text-[10px] font-mono text-muted-foreground/60 w-8">{preview}</code>
                            <span className="text-xs text-foreground">{t(`options.${key}`)}</span>
                          </div>
                          <Toggle checked={pwOpts[key] as boolean} onChange={v => setPwOpt(key, v as any)} />
                        </div>
                      ))}
                    </div>

                    {/* Advanced */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-border">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-foreground">{t("options.noAmbiguous")}</span>
                        <Toggle checked={pwOpts.noAmbiguous} onChange={v => setPwOpt("noAmbiguous", v)} />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-foreground">{t("options.noRepeats")}</span>
                        <Toggle checked={pwOpts.noRepeats} onChange={v => setPwOpt("noRepeats", v)} />
                      </div>
                    </div>

                    {/* Exclude chars */}
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        {t("options.excludeChars")}
                      </label>
                      <input value={pwOpts.exclude} onChange={e => setPwOpt("exclude", e.target.value)}
                        placeholder={t("options.excludeCharsPlaceholder")}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-emerald-400 transition-all placeholder:text-muted-foreground/40"
                        aria-label={t("options.excludeChars")} />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Passphrase options */}
            {mode === "passphrase" && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("passphrase.title")}</p>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-foreground font-medium">{t("passphrase.wordCount")}</label>
                    <span className="text-sm font-bold text-emerald-500 font-mono">{ppOpts.wordCount}</span>
                  </div>
                  <input type="range" min={2} max={10} value={ppOpts.wordCount}
                    onChange={e => setPpOpt("wordCount", Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-border accent-emerald-500 cursor-pointer"
                    aria-label={t("passphrase.wordCount")} />
                  <div className="flex justify-between text-[9px] text-muted-foreground/60 mt-1">
                    <span>2</span><span>4</span><span>6</span><span>8</span><span>10</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{t("passphrase.separator")}</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {separatorOptions.map(({ value }) => (
                      <button key={value} onClick={() => setPpOpt("separator", value)}
                        className={`py-2 rounded-xl border text-[10px] font-bold transition-all ${ppOpts.separator === value
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-border bg-card text-muted-foreground hover:border-emerald-300 hover:text-emerald-600"
                          }`}>{t(`separators.${value}`)}</button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1 border-t border-border">
                  {[
                    { key: "capitalize" as keyof PassphraseOptions },
                    { key: "addNumber" as keyof PassphraseOptions },
                    { key: "addSymbol" as keyof PassphraseOptions },
                  ].map(({ key }) => (
                    <div key={key} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-foreground">{t(`passphrase.${key}`)}</span>
                      <Toggle checked={ppOpts[key] as boolean} onChange={v => setPpOpt(key, v as any)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PIN options */}
            {mode === "pin" && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("pin.title")}</p>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs text-foreground font-medium">{t("pin.length")}</label>
                    <span className="text-sm font-bold text-emerald-500 font-mono">{pinLength} {t("pin.digits")}</span>
                  </div>
                  <input type="range" min={4} max={12} value={pinLength}
                    onChange={e => setPinLength(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-border accent-emerald-500 cursor-pointer"
                    aria-label={t("pin.length")} />
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {[4, 5, 6, 8, 10, 12].map(n => (
                      <button key={n} onClick={() => setPinLength(n)}
                        className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all ${pinLength === n ? "bg-emerald-500 border-emerald-500 text-white" : "border-border bg-card text-muted-foreground hover:border-emerald-300"
                          }`}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bulk count */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("generate.count")}</p>
                <span className="text-sm font-bold text-blue-500 font-mono">{bulkCount}</span>
              </div>
              <input type="range" min={1} max={20} value={bulkCount}
                onChange={e => setBulkCount(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                aria-label={t("generate.count")} />
              <div className="flex gap-1.5 mt-2">
                {[1, 5, 10, 20].map(n => (
                  <button key={n} onClick={() => setBulkCount(n)}
                    className={`flex-1 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${bulkCount === n ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                      }`}>{n}</button>
                ))}
              </div>
            </div>

            {/* Check your own password */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> {t("check.title")}
              </p>
              <div className="relative mb-2">
                <input
                  type={showCheckPw ? "text" : "password"}
                  value={checkPw}
                  onChange={e => setCheckPw(e.target.value)}
                  placeholder={t("check.placeholder")}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-emerald-400 transition-all placeholder:text-muted-foreground/40"
                  aria-label={t("check.placeholder")}
                />
                <button onClick={() => setShowCheckPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showCheckPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {checkPw && (
                <div className="flex flex-col gap-2">
                  <StrengthBar score={checkStrength.score} bgColor={checkStrength.bgColor} />
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${checkStrength.color}`}>{checkStrength.label}</span>
                    <span className="text-[10px] text-muted-foreground">{checkStrength.entropy} {t("check.bitsEntropy")}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{t("check.crackTime")} <strong>{checkStrength.crackTime}</strong></p>
                  {checkStrength.tips.slice(0, 2).map(tip => (
                    <p key={tip} className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" /> {tip}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Output ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Generate button */}
            <button onClick={generate}
              className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-base font-bold shadow-sm shadow-emerald-200 dark:shadow-emerald-900/40 transition-all duration-200 active:scale-[0.98]">
              <RefreshCw className="w-5 h-5" />
              {t("generate.button")} {bulkCount > 1 ? `${bulkCount} ` : ""}{bulkCount > 1 ? t("generate.multiple") : t("generate.single")}
            </button>

            {/* Generated list */}
            {generated.length > 0 && (
              <>
                {/* First password hero */}
                <div className="flex flex-col gap-3 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">{t("output.topPick")}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${firstStrength.bgColor} text-white`}>
                        {firstStrength.label}
                      </span>
                    </div>
                  </div>

                  {/* Password display */}
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-black/20">
                    <code className="flex-1 text-base font-mono font-bold text-foreground break-all select-all tracking-wide">
                      {showAll ? firstPassword : "•".repeat(firstPassword.length)}
                    </code>
                    <button onClick={() => setShowAll(p => !p)}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                      {showAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <CopyButton text={firstPassword} />
                  </div>

                  {/* Strength details */}
                  <div className="flex flex-col gap-1.5">
                    <StrengthBar score={firstStrength.score} bgColor={firstStrength.bgColor} />
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className={`font-bold ${firstStrength.color}`}>{firstStrength.label}</span>
                        <span className="text-muted-foreground">{firstStrength.entropy} {t("check.bitsEntropy")}</span>
                        <span className="text-muted-foreground">{firstPassword.length} {t("strength.chars")}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {t("check.crackTime")} <strong className={firstStrength.color}>{firstStrength.crackTime}</strong>
                      </span>
                    </div>
                    {firstStrength.tips.map(tip => (
                      <p key={tip} className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" /> {tip}
                      </p>
                    ))}
                    {firstStrength.score >= 4 && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 shrink-0" /> {t("strength.excellent")}
                      </p>
                    )}
                  </div>
                </div>

                {/* All generated */}
                {generated.length > 1 && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 bg-muted/20 border-b border-border">
                      <Key className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("output.allGenerated")}</span>
                      <div className="flex gap-2">
                        <CopyButton text={generated.join("\n")} label={t("output.copyAll")} />
                        <button onClick={downloadAll}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-emerald-300 hover:text-emerald-600 transition-all">
                          <Download className="w-3.5 h-3.5" /> {t("output.downloadTxt")}
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-border">
                      {generated.map((pw, i) => {
                        const s = analyzeStrength(pw);
                        return (
                          <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 group transition-colors">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.bgColor}`} />
                            <code className="flex-1 text-xs font-mono text-foreground break-all">{pw}</code>
                            <span className={`text-[9px] font-bold shrink-0 ${s.color}`}>{s.label}</span>
                            <CopyButton text={pw} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("bestPractices.title")}</p>
                  <div className="flex flex-col gap-2">
                    {[
                      t("bestPractices.tip1"),
                      t("bestPractices.tip2"),
                      t("bestPractices.tip3"),
                      t("bestPractices.tip4"),
                      t("bestPractices.tip5"),
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History */}
                {history.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-5 py-3 bg-muted/20 border-b border-border">
                      <History className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">
                        {t("output.sessionHistory")} ({history.length})
                      </span>
                      <div className="flex gap-2">
                        <CopyButton text={history.join("\n")} label={t("output.copyAll")} />
                        <button onClick={() => setHistory([])}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
                          <Trash2 className="w-3 h-3" /> {t("output.clear")}
                        </button>
                      </div>
                    </div>
                    <div className="max-h-52 overflow-y-auto divide-y divide-border">
                      {history.map((pw, i) => {
                        const s = analyzeStrength(pw);
                        return (
                          <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/20 group transition-colors">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.bgColor}`} />
                            <code className="flex-1 text-[10px] font-mono text-muted-foreground break-all">{pw}</code>
                            <CopyButton text={pw} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Empty state */}
            {generated.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30 gap-3 rounded-2xl border border-border border-dashed">
                <ShieldCheck className="w-14 h-14" />
                <p className="text-sm font-medium">{t("output.emptyState")}</p>
                <p className="text-xs">{t("output.emptyStateHint")}</p>
              </div>
            )}
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="security-tools/PasswordGeneratorTool.json" count={4} />
        <FAQ tKey="security-tools/PasswordGeneratorTool.json" />
        <Examples tKey="security-tools/PasswordGeneratorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}