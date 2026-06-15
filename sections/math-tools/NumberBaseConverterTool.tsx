"use client";

import { useState, useMemo } from "react";
import {
  Hash,
  RefreshCw,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { analyzeBits, BASES, DIGITS, fromDecimal, toDecimal, validateInput, EXAMPLES } from "@/funcs/math-tools/NumberBaseConverterToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import Tip from "@/components/math-tools/numberbase-converter/Tip";
import CopyButton from "@/components/math-tools/numberbase-converter/CopyButton";
import BinaryDisplay from "@/components/math-tools/numberbase-converter/BinaryDisplay";
import Collapsible from "@/components/math-tools/numberbase-converter/Collapsible";
import BaseArithmetic from "@/components/math-tools/numberbase-converter/BaseArithmetic";
import RelatedTools from "@/components/math-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function NumberBaseConverterTool() {
  const t = useT("math-tools/NumberBaseConverterTool.json");

  const [inputVal, setInputVal] = useState("255");
  const [fromBase, setFromBase] = useState(10);
  const [customBase, setCustomBase] = useState(12);
  const [showArith, setShowArith] = useState(false);

  const validationError = useMemo(() => validateInput(inputVal, fromBase), [inputVal, fromBase]);

  const decimal: bigint | null = useMemo(() => {
    if (validationError || !inputVal.trim()) return null;
    return toDecimal(inputVal.trim().replace(/[\s_]/g, "").toUpperCase(), fromBase);
  }, [inputVal, fromBase, validationError]);

  // All base conversions
  const conversions = useMemo(() => {
    if (decimal === null) return [];
    return [
      ...BASES,
      ...(customBase >= 2 && customBase <= 36 && !BASES.find(b => b.base === customBase)
        ? [{ base: customBase, label: `Base ${customBase}`, prefix: "", color: "text-rose-500 dark:text-rose-400", badge: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400", chars: `0–${DIGITS[customBase - 1]}` }]
        : []),
    ].map(b => ({
      ...b,
      result: fromDecimal(decimal, b.base),
    }));
  }, [decimal, customBase]);

  const bitInfo = useMemo(() => decimal !== null ? analyzeBits(decimal) : null, [decimal]);

  const fromInfo = BASES.find(b => b.base === fromBase) ?? { label: `Base ${fromBase}`, color: "text-foreground", badge: "", chars: "" };
  const fromLabel = BASES.find(b => b.base === fromBase) ? t(`bases.${fromInfo.label}`) : t("input.baseLabel", { base: fromBase });

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="math-tools/NumberBaseConverterTool.json" href="/math-tools" />

        {/* Header */}
        <Header tKey="math-tools/NumberBaseConverterTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: Input + Options ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Input card */}
            <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("input.title")}</p>

              {/* From base selector */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">{t("input.base")}</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BASES.slice(0, 4).map(b => (
                    <button key={b.base} onClick={() => { setFromBase(b.base); setInputVal(""); }}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${fromBase === b.base
                        ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                        : "border-border bg-muted/20 text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                        }`}>{t(`bases.${b.label}`).length > 6 ? t(`bases.${b.label}`).slice(0, 5) + ".." : t(`bases.${b.label}`)}</button>
                  ))}
                </div>
                {/* Custom from-base slider */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-muted-foreground w-14">{t("input.custom")}:</span>
                  <input type="range" min={2} max={36} value={fromBase}
                    onChange={e => { setFromBase(Number(e.target.value)); setInputVal(""); }}
                    className="flex-1 h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                    aria-label={t("input.base")} />
                  <span className="text-xs font-bold text-blue-500 w-12 text-right">{t("input.baseLabel", { base: fromBase })}</span>
                </div>
              </div>

              {/* Value input */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  {t("input.value", { base: fromLabel })}
                </label>
                <input
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value.toUpperCase())}
                  placeholder={`e.g. ${fromBase === 2 ? "11001010" : fromBase === 8 ? "377" : fromBase === 16 ? "FF" : "255"}`}
                  aria-label={t("input.value", { base: fromLabel })}
                  className={`w-full px-4 py-3.5 rounded-xl border bg-background text-foreground text-xl font-mono font-bold focus:outline-none focus:ring-2 transition-all placeholder:text-muted-foreground/30 ${validationError
                    ? "border-red-300 dark:border-red-700 focus:border-red-400 focus:ring-red-100"
                    : inputVal && !validationError
                      ? "border-emerald-300 dark:border-emerald-700 focus:border-emerald-400 focus:ring-emerald-100"
                      : "border-border focus:border-blue-400 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    }`}
                />
                {validationError && (
                  <p className="text-xs text-red-500 mt-1.5">{validationError}</p>
                )}
                {!validationError && decimal !== null && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {t("input.decimalValue")}: <code className="font-mono font-bold text-foreground">{decimal.toLocaleString()}</code>
                  </p>
                )}
              </div>

              {/* Allowed chars tip */}
              <Tip text={`${t("input.accepts", { base: fromBase })}: ${fromBase <= 36 ? DIGITS.slice(0, fromBase).split("").join(" ") : "A–Z a–z 0–9 + /"}`} />

              {/* Clear */}
              <button onClick={() => setInputVal("")} disabled={!inputVal}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border bg-muted/20 hover:border-red-200 hover:text-red-500 text-xs font-medium text-muted-foreground disabled:opacity-40 transition-all">
                <RefreshCw className="w-3.5 h-3.5" /> {t("clear")}
              </button>
            </div>

            {/* Custom base output */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("output.customBase")}</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[10px] text-muted-foreground w-10">{t("output.base")}</span>
                <input type="range" min={2} max={36} value={customBase}
                  onChange={e => setCustomBase(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer"
                  aria-label={t("output.base")} />
                <span className="text-xs font-bold text-rose-500 w-6">{customBase}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10">
                <code className="flex-1 text-base font-mono font-bold text-foreground">
                  {decimal !== null ? fromDecimal(decimal, customBase) : "—"}
                </code>
                <CopyButton text={decimal !== null ? fromDecimal(decimal, customBase) : ""} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                {t("output.chars")}: {DIGITS.slice(0, customBase)}
              </p>
            </div>

            {/* Bit analysis */}
            {bitInfo && (
              <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("bitInfo.title")}</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: t("bitInfo.bitWidth"), value: bitInfo.bits },
                    { label: t("bitInfo.bytes"), value: bitInfo.bytes },
                    { label: t("bitInfo.setBits"), value: bitInfo.popcount },
                    { label: t("bitInfo.zeroBits"), value: bitInfo.bits - bitInfo.popcount },
                    { label: t("bitInfo.lsb"), value: bitInfo.lsb },
                    { label: t("bitInfo.msbPos"), value: bitInfo.msb },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center py-2.5 rounded-xl border border-border bg-muted/20">
                      <span className="text-sm font-bold font-mono text-foreground">{value}</span>
                      <span className="text-[9px] text-muted-foreground mt-0.5">{label}</span>
                    </div>
                  ))}
                </div>
                {bitInfo.isPow2 && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20 mb-3">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">✓ {t("bitInfo.powerOf2")}</span>
                    <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                      2<sup>{Math.log2(Number(decimal!))}</sup>
                    </span>
                  </div>
                )}
                {/* Byte segments */}
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("bitInfo.byteSegments")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {bitInfo.byteSegs.map((seg, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5">
                      <code className="text-[10px] font-mono px-2 py-1 rounded-lg border border-border bg-muted/20 tracking-wider">
                        {seg.slice(0, 4)}·{seg.slice(4)}
                      </code>
                      <span className="text-[9px] text-muted-foreground">0x{parseInt(seg, 2).toString(16).toUpperCase().padStart(2, "0")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("examples.title")}</p>

              <div className="grid grid-cols-2 gap-1.5">
                {EXAMPLES.map(({ label, decimal: dec, note }) => (
                  <button key={label}
                    onClick={() => { setInputVal(dec); setFromBase(10); }}
                    className="flex flex-col items-start px-3 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group">
                    <code className="text-xs font-bold font-mono text-foreground group-hover:text-blue-500 transition-colors">{label}</code>
                    <span className="text-[9px] text-muted-foreground leading-tight mt-0.5">{note}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: All conversions ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Conversion table */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 bg-muted/20 border-b border-border">
                <Hash className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("allBases.title")}</span>
                {decimal !== null && (
                  <span className="text-xs text-muted-foreground">
                    = <code className="font-mono font-bold text-foreground">{decimal.toLocaleString()}</code> {t("allBases.dec")}
                  </span>
                )}
              </div>

              <div className="divide-y divide-border">
                {conversions.map(({ base, label, prefix, color, badge, chars, result }) => {
                  const isFrom = base === fromBase;
                  const baseLabel = BASES.find(b => b.base === base) ? t(`bases.${label}`) : t("input.baseLabel", { base });
                  return (
                    <div key={base}
                      className={`flex items-start gap-3 px-5 py-4 transition-colors group cursor-pointer ${isFrom ? "bg-blue-50/50 dark:bg-blue-900/10" : "hover:bg-muted/20"
                        }`}
                      onClick={() => {
                        if (result && result !== "invalid") {
                          setFromBase(base);
                          setInputVal(result);
                        }
                      }}
                    >
                      {/* Base badge */}
                      <div className="shrink-0 w-20">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${badge}`}>
                          {baseLabel}
                        </span>
                        <p className="text-[9px] text-muted-foreground mt-1 font-medium">{label}</p>
                      </div>

                      {/* Value */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {prefix && <code className="text-[10px] font-mono text-muted-foreground">{prefix}</code>}
                          {base === 2 && result && result !== "invalid" ? (
                            <BinaryDisplay bin={result} />
                          ) : (
                            <code className={`text-base font-mono font-bold break-all ${result === "invalid" ? "text-red-400" :
                              isFrom ? "text-blue-600 dark:text-blue-400" :
                                color
                              }`}>
                              {result || "—"}
                            </code>
                          )}
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-1">{t("allBases.chars")}: {chars}</p>
                      </div>

                      {/* Length + copy */}
                      <div className="flex items-center gap-2 shrink-0">
                        {result && result !== "invalid" && (
                          <span className="text-[10px] text-muted-foreground/50 tabular-nums">{result.length}c</span>
                        )}
                        <CopyButton text={result ?? ""} small />
                      </div>
                    </div>
                  );
                })}
              </div>

              {decimal === null && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/30 gap-2">
                  <Hash className="w-8 h-8" />
                  <p className="text-xs">{t("allBases.enterToConvert")}</p>
                </div>
              )}
            </div>

            {/* Binary visual full */}
            {bitInfo && (
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  {t("binary.title", { count: bitInfo.bits })}
                </p>
                <div className="px-4 py-3 rounded-xl border border-border bg-muted/20 overflow-x-auto">
                  <BinaryDisplay bin={bitInfo.bin} />
                </div>
                <div className="flex gap-3 mt-2 flex-wrap text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-muted-foreground">{t("binary.oneSet")}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/20" /> <span className="text-muted-foreground">{t("binary.zeroClear")}</span>
                  </span>
                  <span className="text-muted-foreground ml-auto">{t("binary.nibbleSeparator")}</span>
                </div>
              </div>
            )}

            {/* Base arithmetic */}
            <Collapsible title={t("arithmetic.title")} defaultOpen={false}>
              <div className="flex flex-col gap-4">
                <p className="text-xs text-muted-foreground">{t("arithmetic.description")}</p>
                <div className="flex gap-2 flex-wrap">
                  {BASES.slice(0, 4).map(b => (
                    <button key={b.base}
                      onClick={() => { setShowArith(true); setFromBase(b.base); }}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${fromBase === b.base && showArith
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                        }`}>
                      {t("arithmetic.base", { base: b.base })}
                    </button>
                  ))}
                </div>
                <BaseArithmetic base={fromBase} />
              </div>
            </Collapsible>

            {/* Reference table */}
            <Collapsible title={t("reference.title")} defaultOpen={false}>

              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-5 bg-muted/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                  <span>{t("reference.dec")}</span><span className="text-blue-500">{t("reference.bin")}</span><span className="text-purple-500">{t("reference.oct")}</span><span className="text-orange-500">{t("reference.hex")}</span><span className="text-pink-500">{t("reference.b32")}</span>
                </div>
                <div className="divide-y divide-border max-h-80 overflow-y-auto">
                  {Array.from({ length: 16 }, (_, i) => ({
                    dec: i,
                    bin: fromDecimal(BigInt(i), 2).padStart(4, "0"),
                    oct: fromDecimal(BigInt(i), 8),
                    hex: fromDecimal(BigInt(i), 16),
                    b32: fromDecimal(BigInt(i), 32),
                  })).map(({ dec, bin, oct, hex, b32 }) => (
                    <div key={dec}
                      className="grid grid-cols-5 px-3 py-2.5 items-center hover:bg-muted/20 transition-colors cursor-pointer group"
                      onClick={() => { setInputVal(String(dec)); setFromBase(10); }}
                    >
                      <span className="text-xs font-bold font-mono text-emerald-500 group-hover:text-emerald-400">{dec}</span>
                      <code className="text-xs font-mono text-blue-500 dark:text-blue-400 tracking-widest">{bin}</code>
                      <code className="text-xs font-mono text-purple-500 dark:text-purple-400">{oct}</code>
                      <code className="text-xs font-mono text-orange-500 dark:text-orange-400">{hex}</code>
                      <code className="text-xs font-mono text-pink-500 dark:text-pink-400">{b32}</code>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">{t("reference.clickRow")}</p>
            </Collapsible>
          </div>
        </div>

        <HowToUse tKey="math-tools/NumberBaseConverterTool.json" count={4} />
        <FAQ tKey="math-tools/NumberBaseConverterTool.json" />
        <Examples tKey="math-tools/NumberBaseConverterTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}