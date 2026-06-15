"use client";

import { useState, useMemo } from "react";
import {
  Copy,
  ArrowLeftRight,
  Search,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { CATEGORIES, smartFormat } from "@/funcs/math-tools/UnitConverterToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import CopyButton from "@/components/math-tools/unit-converter/CopyButton";
import RelatedTools from "@/components/math-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function UnitConverterTool() {
  const t = useT("math-tools/UnitConverterTool.json");

  const [categoryKey, setCategoryKey] = useState("length");
  const [fromKey, setFromKey] = useState("m");
  const [toKey, setToKey] = useState("ft");
  const [inputVal, setInputVal] = useState("1");
  const [search, setSearch] = useState("");

  const category = useMemo(
    () => CATEGORIES.find(c => c.key === categoryKey)!,
    [categoryKey]
  );

  const fromUnit = useMemo(() => category.units.find(u => u.key === fromKey) ?? category.units[0], [category, fromKey]);
  const toUnit = useMemo(() => category.units.find(u => u.key === toKey) ?? category.units[1], [category, toKey]);

  // Compute conversion
  const numInput = useMemo(() => parseFloat(inputVal), [inputVal]);
  const result = useMemo(() => {
    if (isNaN(numInput)) return NaN;
    const base = fromUnit.toBase(numInput);
    return toUnit.fromBase(base);
  }, [numInput, fromUnit, toUnit]);

  // All conversions from current input
  const allConversions = useMemo(() => {
    if (isNaN(numInput)) return [];
    const base = fromUnit.toBase(numInput);
    return category.units.map(u => ({
      unit: u,
      result: u.fromBase(base),
    }));
  }, [numInput, fromUnit, category]);

  // Swap
  const swap = () => {
    setFromKey(toKey);
    setToKey(fromKey);
    if (!isNaN(result)) setInputVal(smartFormat(result));
  };

  // Change category — pick sensible defaults
  const changeCategory = (key: string) => {
    const cat = CATEGORIES.find(c => c.key === key)!;
    setCategoryKey(key);
    setFromKey(cat.units[0].key);
    setToKey(cat.units[Math.min(1, cat.units.length - 1)].key);
    setInputVal("1");
  };

  // Search filter for all conversions table
  const filteredConversions = useMemo(() => {
    if (!search) return allConversions;
    const q = search.toLowerCase();
    return allConversions.filter(({ unit }) =>
      unit.label.toLowerCase().includes(q) || unit.symbol.toLowerCase().includes(q)
    );
  }, [allConversions, search]);

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="math-tools/UnitConverterTool.json" href="/math-tools" />

        {/* Header */}
        <Header tKey="math-tools/UnitConverterTool.json" />

        {/* ── Category selector ── */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => changeCategory(cat.key)}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border text-center transition-all duration-200 ${categoryKey === cat.key
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40"
                }`}
            >
              <span className="text-lg leading-none">{cat.icon}</span>
              <span className={`text-[9px] font-bold leading-tight ${categoryKey === cat.key ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}>
                {cat.label.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Converter card ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{category.icon}</span>
                <p className="text-sm font-bold text-foreground">{category.label}</p>
              </div>

              {/* From */}
              <div className="flex flex-col gap-1.5 mb-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("from")}</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-lg font-mono font-bold focus:outline-none focus:border-blue-400 transition-all"
                    placeholder="Enter value"
                    aria-label={t("from")}
                  />
                  <select value={fromKey} onChange={e => setFromKey(e.target.value)}
                    className="w-40 px-3 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium focus:outline-none focus:border-blue-400 transition-all cursor-pointer">
                    {category.units.map(u => (
                      <option key={u.key} value={u.key}>{u.label} ({u.symbol})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap */}
              <div className="flex justify-center my-2">
                <button onClick={swap}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-muted/30 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-xs font-medium transition-all">
                  <ArrowLeftRight className="w-3.5 h-3.5" /> {t("swap")}
                </button>
              </div>

              {/* To */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("to")}</label>
                <div className="flex gap-2">
                  <div className="flex-1 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/10 text-foreground text-lg font-mono font-bold select-all min-h-[52px] flex items-center">
                    <span className={isNaN(result) ? "text-muted-foreground/50 text-sm" : ""}>
                      {isNaN(result) ? "Enter a value" : smartFormat(result)}
                    </span>
                  </div>
                  <select value={toKey} onChange={e => setToKey(e.target.value)}
                    className="w-40 px-3 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium focus:outline-none focus:border-blue-400 transition-all cursor-pointer">
                    {category.units.map(u => (
                      <option key={u.key} value={u.key}>{u.label} ({u.symbol})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Formula */}
              {!isNaN(result) && (
                <div className="mt-4 px-4 py-3 rounded-xl border border-border bg-muted/20 dark:bg-muted/10">
                  <p className="text-xs text-muted-foreground mb-1 font-medium">{t("formula")}</p>
                  <code className="text-xs font-mono text-foreground">
                    {smartFormat(numInput)} {fromUnit.symbol} = {smartFormat(result)} {toUnit.symbol}
                  </code>
                </div>
              )}

              {/* Copy result */}
              {!isNaN(result) && (
                <button
                  onClick={() => navigator.clipboard.writeText(smartFormat(result))}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                  <Copy className="w-3.5 h-3.5" /> {t("copyResult")}
                </button>
              )}
            </div>

            {/* Quick conversions: common reference */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("quickReference")}</p>
              <div className="flex flex-col gap-1.5">
                {category.key === "length" && [
                  ["1 inch", "2.54 cm"],
                  ["1 foot", "30.48 cm"],
                  ["1 mile", "1.609 km"],
                  ["1 km", "0.621 mi"],
                  ["1 yard", "0.914 m"],
                  ["1 meter", "3.281 ft"],
                ].map(([from, to]) => (
                  <div key={from} className="flex justify-between text-xs px-2 py-1.5 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className="text-muted-foreground">{from}</span>
                    <span className="font-mono font-bold text-foreground">{to}</span>
                  </div>
                ))}
                {category.key === "temperature" && [
                  ["0°C", "32°F / 273.15 K"],
                  ["100°C", "212°F / 373.15 K"],
                  ["37°C", "98.6°F (body temp)"],
                  ["-40°C", "-40°F"],
                  ["20°C", "68°F (room temp)"],
                  ["0°F", "-17.78°C"],
                ].map(([from, to]) => (
                  <div key={from} className="flex justify-between text-xs px-2 py-1.5 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className="text-muted-foreground">{from}</span>
                    <span className="font-mono font-bold text-foreground">{to}</span>
                  </div>
                ))}
                {category.key === "weight" && [
                  ["1 lb", "453.59 g"],
                  ["1 kg", "2.205 lb"],
                  ["1 oz", "28.35 g"],
                  ["1 stone", "6.35 kg"],
                  ["1 metric ton", "2204.6 lb"],
                  ["1 short ton", "907.18 kg"],
                ].map(([from, to]) => (
                  <div key={from} className="flex justify-between text-xs px-2 py-1.5 rounded-lg hover:bg-muted/30 transition-colors">
                    <span className="text-muted-foreground">{from}</span>
                    <span className="font-mono font-bold text-foreground">{to}</span>
                  </div>
                ))}
                {!["length", "temperature", "weight"].includes(category.key) && (
                  <p className="text-xs text-muted-foreground/50 italic text-center py-2">
                    Select a value above to see all conversions on the right →
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── All conversions table ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("allConversions", { category: category.label })}
              </p>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t("filter")}
                  className="pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all w-40"
                  aria-label={t("filter")}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-4 py-2.5 bg-muted/30 dark:bg-muted/10 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>Unit</span>
                <span className="text-center w-16">Symbol</span>
                <span className="text-right w-40">Value</span>
                <span className="w-7" />
              </div>
              {/* Rows */}
              <div className="divide-y divide-border max-h-[520px] overflow-y-auto">
                {filteredConversions.map(({ unit, result: r }) => {
                  const isFrom = unit.key === fromKey;
                  const isTo = unit.key === toKey;
                  return (
                    <div key={unit.key}
                      className={`grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center px-4 py-3 transition-colors cursor-pointer group
                        ${isFrom ? "bg-blue-50 dark:bg-blue-900/15" : isTo ? "bg-purple-50 dark:bg-purple-900/15" : "hover:bg-muted/20"}`}
                      onClick={() => { setToKey(unit.key); }}
                    >
                      {/* Unit name */}
                      <div className="flex items-center gap-2 min-w-0">
                        {isFrom && <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">FROM</span>}
                        {isTo && <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">TO</span>}
                        <span className={`text-xs font-medium truncate ${isFrom || isTo ? "text-foreground font-bold" : "text-foreground"}`}>
                          {unit.label}
                        </span>
                      </div>
                      {/* Symbol */}
                      <code className={`text-xs font-mono w-16 text-center ${isFrom ? "text-blue-500" : isTo ? "text-purple-500" : "text-muted-foreground"}`}>
                        {unit.symbol}
                      </code>
                      {/* Value */}
                      <code className={`text-sm font-mono font-bold w-40 text-right tabular-nums ${isFrom ? "text-blue-600 dark:text-blue-400" :
                        isTo ? "text-purple-600 dark:text-purple-400" :
                          "text-foreground"
                        }`}>
                        {isNaN(numInput) ? "—" : smartFormat(r)}
                      </code>
                      {/* Copy */}
                      <CopyButton text={isNaN(numInput) ? "" : smartFormat(r)} />
                    </div>
                  );
                })}
                {filteredConversions.length === 0 && (
                  <div className="py-10 text-center text-sm text-muted-foreground/50">No units match "{search}"</div>
                )}
              </div>
            </div>

            {/* Hint */}
            <p className="text-[10px] text-muted-foreground/50 text-center">
              Click any row to set it as the "To" unit
            </p>
          </div>
        </div>

        <HowToUse tKey="math-tools/UnitConverterTool.json" count={4} />
        <FAQ tKey="math-tools/UnitConverterTool.json" />
        <Examples tKey="math-tools/UnitConverterTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}