"use client";

import { useState } from "react";
import {
  ClipboardPaste,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  Type,
  Smartphone,
  Monitor,
  BarChart2,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import { countWords, fmtNum, getStatus, Mode, PLATFORMS, STATUS_BAR, STATUS_BG, STATUS_COLOR } from "@/funcs/seo-tools/CharacterCounterSEOToolFuncs";
import CopyButton from "@/components/seo-tools/character-counter-seo/CopyButton";
import GoogleTitlePreview from "@/components/seo-tools/character-counter-seo/GoogleTitlePreview";
import GoogleDescPreview from "@/components/seo-tools/character-counter-seo/GoogleDescPreview";
import TweetPreview from "@/components/seo-tools/character-counter-seo/TweetPreview";
import EmailSubjectPreview from "@/components/seo-tools/character-counter-seo/EmailSubjectPreview";
import LinkedInHeadlinePreview from "@/components/seo-tools/character-counter-seo/LinkedInHeadlinePreview";
import InstagramPreview from "@/components/seo-tools/character-counter-seo/InstagramPreview";
import BulkChecker from "@/components/seo-tools/character-counter-seo/BulkChecker";
import QuickReferenceTable from "@/components/seo-tools/character-counter-seo/QuickReferenceTable";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

const CATEGORIES = [
  { key: "seo", label: "SEO" },
  { key: "social", label: "Social" },
  { key: "email", label: "Email" },
  { key: "custom", label: "Custom" },
];

export default function CharacterCounterSEOTool() {
  const t = useT("seo-tools/CharacterCounterSEOTool.json");

  const [mode, setMode] = useState<Mode>("seo-title");
  const [text, setText] = useState("");
  const [customSoft, setCustomSoft] = useState(160);
  const [customHard, setCustomHard] = useState(200);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [emailDevice, setEmailDevice] = useState<"desktop" | "mobile">("desktop");

  const cfg = PLATFORMS.find(p => p.key === mode) ?? PLATFORMS[0];
  const soft = mode === "custom" ? customSoft : cfg.soft;
  const hard = mode === "custom" ? customHard : cfg.hard;

  const len = text.length;
  const words = countWords(text);
  const status = getStatus(len, cfg, customSoft);
  const pct = soft > 0 ? Math.min(100, (len / (hard || soft * 1.3)) * 100) : 0;
  const remain = soft - len;
  const overBy = len - hard;

  const bulkLines = bulkText.split("\n");

  const showPreview = !bulkMode && ["seo-title", "seo-description", "tweet", "email-subject", "linkedin-headline", "instagram"].includes(mode);

  // Group platforms by category
  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    items: PLATFORMS.filter(p => p.category === cat.key),
  }));

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/CharacterCounterSEOTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/CharacterCounterSEOTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Platform picker ── */}
          <div className="flex flex-col gap-5">

            {/* Platform categories */}
            {grouped.map(cat => (
              <div key={cat.key}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t(`categories.${cat.key}`)}</p>
                <div className="flex flex-col gap-1">
                  {cat.items.map(p => {
                    const Icon = p.icon;
                    return (
                      <button key={p.key} onClick={() => { setMode(p.key); setText(""); }}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${mode === p.key
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                          : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40"
                          }`}>
                        <Icon className={`w-4 h-4 shrink-0 ${mode === p.key ? "text-blue-500" : p.iconColor}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold leading-tight ${mode === p.key ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>
                            {t(`platforms.${p.key}`)}
                          </p>
                          <p className="text-[9px] text-muted-foreground/70">
                            {p.key === "custom" ? `${customSoft} ${t("reference.ideal")} · ${customHard} ${t("reference.hard")}`
                              : p.min > 0 ? `${p.min}–${p.soft} ${t("reference.ideal")} · ${p.hard} ${t("reference.max")}`
                                : `${t("mode.singleDesc")} ${p.soft} · ${t("reference.max")} ${p.hard === 63206 ? "∞" : p.hard}`}
                          </p>
                        </div>
                        {p.badge && (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-muted/40 text-muted-foreground shrink-0">{p.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Custom limit controls */}
            {mode === "custom" && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("custom.title")}</p>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-foreground">{t("custom.softLabel")}</p>
                    <span className="text-sm font-black font-mono text-blue-500">{customSoft}</span>
                  </div>
                  <input type="range" min={10} max={500} value={customSoft} aria-label={t("custom.softLabel")}
                    onChange={e => setCustomSoft(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-foreground">{t("custom.hardLabel")}</p>
                    <span className="text-sm font-black font-mono text-blue-500">{customHard}</span>
                  </div>
                  <input type="range" min={10} max={10000} step={10} value={customHard} aria-label={t("custom.hardLabel")}
                    onChange={e => setCustomHard(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer" />
                </div>
                <div className="flex gap-2">
                  <input type="number" value={customSoft} onChange={e => setCustomSoft(Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all" aria-label={t("custom.softLabel")} />
                  <input type="number" value={customHard} onChange={e => setCustomHard(Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all" aria-label={t("custom.hardLabel")} />
                </div>
              </div>
            )}

            {/* Platform hint */}
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-700 dark:text-blue-400 leading-relaxed">{t(`hints.${cfg.key}`)}</p>
            </div>
          </div>

          {/* ── Right: Input + Results ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Mode toggle */}
            <div className="flex items-center gap-3">
              <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                <button onClick={() => setBulkMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!bulkMode ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  <Type className="w-3.5 h-3.5" /> {t("mode.single")}
                </button>
                <button onClick={() => setBulkMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${bulkMode ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  <BarChart2 className="w-3.5 h-3.5" /> {t("mode.bulk")}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {bulkMode ? t("mode.bulkDesc") : `${t(`platforms.${cfg.key}`)} · ${t("mode.singleDesc")} ≤ ${soft}`}
              </p>
            </div>

            {/* ── Single mode ── */}
            {!bulkMode && (
              <>
                {/* Textarea */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t(`platforms.${cfg.key}`)}</p>
                    <div className="flex gap-2">
                      <button onClick={() => navigator.clipboard.readText().then(setText).catch(() => { })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                        <ClipboardPaste className="w-3.5 h-3.5" /> {t("bulk.paste")}
                      </button>
                      <button onClick={() => setText("")} disabled={!text}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={text}
                    onChange={e => cfg.hardLimit ? e.target.value.length <= hard && setText(e.target.value) : setText(e.target.value)}
                    placeholder={t("input.placeholder")}
                    rows={mode === "instagram" || mode === "linkedin-post" ? 5 : mode === "seo-description" || mode === "og-description" ? 4 : 3}
                    maxLength={cfg.hardLimit ? hard : undefined}
                    className={`w-full px-5 py-4 rounded-2xl border text-foreground text-sm resize-none focus:outline-none transition-all placeholder:text-muted-foreground/40 shadow-sm leading-relaxed ${STATUS_BG[status]} focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40`}
                  />
                </div>

                {/* Main counter display */}
                <div className={`flex flex-col gap-3 p-5 rounded-2xl border shadow-sm ${STATUS_BG[status]}`}>
                  {/* Big counter */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-5xl font-black tabular-nums tracking-tight ${STATUS_COLOR[status]}`}>{fmtNum(len)}</span>
                        <span className="text-lg text-muted-foreground font-bold">/ {fmtNum(soft)}</span>
                      </div>
                      <p className={`text-xs font-bold mt-0.5 ${STATUS_COLOR[status]}`}>{t(`status.${status}`)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <CopyButton text={text} />
                      <p className="text-[10px] text-muted-foreground text-right">
                        {words} {t("counts.words").toLowerCase()}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="w-full h-3 rounded-full bg-border/60 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${STATUS_BAR[status]}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    {/* Markers */}
                    <div className="relative h-4 mt-0.5">
                      {soft > 0 && (
                        <div className="absolute top-0 flex flex-col items-center gap-0"
                          style={{ left: `${Math.min(100, (soft / (hard * 1.2)) * 100)}%`, transform: "translateX(-50%)" }}>
                          <div className="w-0.5 h-2 bg-emerald-400" />
                          <span className="text-[8px] text-emerald-500 font-bold whitespace-nowrap">{soft}</span>
                        </div>
                      )}
                      {hard > 0 && hard !== soft && hard < 100000 && (
                        <div className="absolute top-0 flex flex-col items-center gap-0"
                          style={{ left: `${Math.min(100, (hard / (hard * 1.2)) * 100)}%`, transform: "translateX(-50%)" }}>
                          <div className="w-0.5 h-2 bg-red-400" />
                          <span className="text-[8px] text-red-500 font-bold whitespace-nowrap">{hard}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-4 flex-wrap pt-1 border-t border-border/40">
                    {[
                      { label: t("counts.characters"), value: fmtNum(len) },
                      { label: t("counts.noSpaces"), value: fmtNum(text.replace(/\s/g, "").length) },
                      { label: t("counts.words"), value: fmtNum(words) },
                      {
                        label: remain >= 0 ? t("counts.remaining") : t("counts.overBy"),
                        value: Math.abs(remain) + " " + t("counts.chars"),
                        color: remain >= 0 ? "text-foreground" : "text-red-500"
                      },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex flex-col">
                        <span className={`text-sm font-bold tabular-nums ${color ?? "text-foreground"}`}>{value}</span>
                        <span className="text-[9px] text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Warnings */}
                {status === "over" && hard < 100000 && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {cfg.hardLimit
                        ? t("warnings.limitReached", { max: hard })
                        : t("warnings.overLimit", { count: overBy, plural: overBy !== 1 ? "s" : "" })}
                    </p>
                  </div>
                )}
                {status === "too-short" && cfg.min > 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {t("warnings.tooShort", { min: cfg.min })}
                    </p>
                  </div>
                )}
                {status === "ideal" && len > 0 && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      {t("warnings.perfectLength", { label: cfg.label, remain: remain > 0 ? t("warnings.remainText", { count: remain }) : "" })}
                    </p>
                  </div>
                )}

                {/* Platform preview */}
                {showPreview && text && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("preview.title")}</p>
                      {mode === "email-subject" && (
                        <div className="flex gap-1 ml-auto">
                          {(["desktop", "mobile"] as const).map(d => (
                            <button key={d} onClick={() => setEmailDevice(d)}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${emailDevice === d ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-200"
                                }`}>
                              {d === "desktop" ? <Monitor className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
                              {t(`preview.${d}`)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {mode === "seo-title" && <GoogleTitlePreview text={text} />}
                    {mode === "seo-description" && <GoogleDescPreview text={text} />}
                    {mode === "tweet" && <TweetPreview text={text} />}
                    {mode === "email-subject" && <EmailSubjectPreview text={text} device={emailDevice} />}
                    {mode === "linkedin-headline" && <LinkedInHeadlinePreview text={text} />}
                    {mode === "instagram" && <InstagramPreview text={text} />}
                  </div>
                )}
              </>
            )}

            {/* ── Bulk mode ── */}
            {bulkMode && (
              <>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {t("bulk.pasteLabel")}
                    </p>
                    <div className="flex gap-2">
                      <button onClick={() => navigator.clipboard.readText().then(setBulkText).catch(() => { })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                        <ClipboardPaste className="w-3.5 h-3.5" /> {t("bulk.paste")}
                      </button>
                      <button onClick={() => setBulkText("")} disabled={!bulkText}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={bulkText} onChange={e => setBulkText(e.target.value)}
                    placeholder={t("bulk.placeholder")}
                    rows={7}
                    className="w-full px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm resize-none focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40 shadow-sm font-mono" />
                </div>

                {bulkLines.filter(Boolean).length > 0 && (
                  <>
                    {/* Bulk stats */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: t("bulk.total"), value: bulkLines.filter(Boolean).length },
                        { label: t("bulk.ideal"), value: bulkLines.filter(Boolean).filter(l => getStatus(l.length, cfg, customSoft) === "ideal").length },
                        { label: t("bulk.warn"), value: bulkLines.filter(Boolean).filter(l => ["warning", "too-short"].includes(getStatus(l.length, cfg, customSoft))).length },
                        { label: t("bulk.over"), value: bulkLines.filter(Boolean).filter(l => getStatus(l.length, cfg, customSoft) === "over").length },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-card">
                          <span className="text-sm font-bold font-mono text-foreground">{value}</span>
                          <span className="text-[9px] text-muted-foreground">{label}</span>
                        </div>
                      ))}
                    </div>
                    <BulkChecker lines={bulkLines} cfg={cfg} customSoft={customSoft} />
                  </>
                )}
              </>
            )}

            {/* Quick reference table */}
            <QuickReferenceTable setMode={setMode} setText={setText} setBulkMode={setBulkMode} />
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/CharacterCounterSEOTool.json" count={4} />
        <FAQ tKey="seo-tools/CharacterCounterSEOTool.json" />
        <Examples tKey="seo-tools/CharacterCounterSEOTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}