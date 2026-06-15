"use client";

import { useState, useMemo } from "react";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Hash,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { scorePassword } from "@/funcs/security-tools/PasswordStrengthCheckerToolFuncs";
import CheckRow from "@/components/security-tools/password-strength-checker/CheckRow";
import EntropyGauge from "@/components/security-tools/password-strength-checker/EntropyGauge";
import CrackRow from "@/components/security-tools/password-strength-checker/CrackRow";
import RelatedTools from "@/components/security-tools/RelatedTools";
import ComparisonTable from "@/components/security-tools/password-strength-checker/ComparisonTable";
import Tips from "@/components/security-tools/password-strength-checker/Tips";
import CharsetPool from "@/components/security-tools/password-strength-checker/CharsetPool";
import Header from "@/components/Header";
import BreadCrumb from "@/components/BreadCrumb";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function PasswordStrengthChecker() {
  const t = useT("security-tools/PasswordStrengthChecker.json");

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const result = useMemo(() => scorePassword(password, t), [password, t]);

  // Character composition bar segments
  const compSegments = [
    { label: "Uppercase", count: (password.match(/[A-Z]/g) ?? []).length, color: "bg-blue-400" },
    { label: "Lowercase", count: (password.match(/[a-z]/g) ?? []).length, color: "bg-emerald-400" },
    { label: "Digits", count: (password.match(/[0-9]/g) ?? []).length, color: "bg-amber-400" },
    { label: "Symbols", count: (password.match(/[^a-zA-Z0-9]/g) ?? []).length, color: "bg-purple-400" },
  ].filter(s => s.count > 0);

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="security-tools/PasswordStrengthChecker.json" href="/security-tools" />

        {/* Header */}
        <Header tKey="security-tools/PasswordStrengthChecker.json" />

        {/* Privacy notice */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 mb-8">
          <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            {t("privacy.notice")}
          </p>
        </div>

        {/* ── Main input ── */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={t("input.placeholder")}
              autoComplete="new-password"
              className="w-full px-6 py-5 pr-14 rounded-2xl border-2 border-border bg-card text-foreground text-lg font-mono focus:outline-none focus:border-blue-400 transition-all duration-200 shadow-sm placeholder:text-muted-foreground/30 tracking-widest"
              aria-label={t("input.placeholder")}
            />
            <button onClick={() => setShow(p => !p)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
              {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Strength bar + label */}
          {password && (
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-black ${result.labelColor}`}>{result.label}</span>
                  <span className="text-sm text-muted-foreground">{result.length} {t("input.chars")} · {result.charsetSize}-{t("input.pool")}</span>
                </div>
                <span className="text-sm font-bold text-muted-foreground">{result.entropy} {t("stats.bits")}</span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-300 ${i <= result.score ? result.barColor : "bg-border"}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Results grid ── */}
        {password && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left: Checks + Patterns ── */}
            <div className="flex flex-col gap-5">

              {/* Requirements checklist */}
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("checks.title")}</p>
                <div className="divide-y divide-border/50">
                  {result.checks.map(c => (
                    <CheckRow key={c.label} {...c} />
                  ))}
                </div>
              </div>

              {/* Pattern warnings */}
              {result.patterns.length > 0 && (
                <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> {t("patterns.title")}
                  </p>
                  <div className="flex flex-col gap-2">
                    {result.patterns.map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-foreground">{p.label}</p>
                          <p className="text-[10px] text-muted-foreground">{p.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-blue-400" /> {t("suggestions.title")}
                  </p>
                  <div className="flex flex-col gap-2">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.score === 4 && result.patterns.length === 0 && (
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t("strength.excellent")}</p>
                    <p className="text-xs text-muted-foreground">{t("strength.excellentDesc")}</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Middle: Entropy + Composition ── */}
            <div className="flex flex-col gap-5">

              {/* Entropy */}
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-blue-400" /> {t("stats.entropy")}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black text-foreground font-mono tabular-nums">{result.entropy}</span>
                    <span className="text-sm text-muted-foreground">{t("stats.bits")}</span>
                  </div>
                </div>
                <EntropyGauge entropy={result.entropy} />
                <div className="mt-3 p-3 rounded-xl border border-border bg-muted/20">
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {t("entropy.formula")}<br />
                    <span className="font-mono">{result.length} × log₂({result.charsetSize}) = {result.entropy} {t("stats.bits")}</span>
                  </p>
                </div>
              </div>

              {/* Character composition */}
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <BarChart2 className="w-3.5 h-3.5 text-blue-400" /> {t("charTypes.title")}
                </p>

                {/* Type indicators */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: t("charTypes.uppercase"), has: result.charTypes.hasUpper, example: t("charTypes.exampleUpper"), color: "text-blue-500" },
                    { label: t("charTypes.lowercase"), has: result.charTypes.hasLower, example: t("charTypes.exampleLower"), color: "text-emerald-500" },
                    { label: t("charTypes.digits"), has: result.charTypes.hasDigit, example: t("charTypes.exampleDigits"), color: "text-amber-500" },
                    { label: t("charTypes.symbols"), has: result.charTypes.hasSymbol, example: t("charTypes.exampleSymbols"), color: "text-purple-500" },
                  ].map(({ label, has, example, color }) => (
                    <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${has ? "border-border bg-card" : "border-border/40 bg-muted/10 opacity-40"
                      }`}>
                      {has
                        ? <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${color}`} />
                        : <XCircle className="w-3.5 h-3.5 shrink-0 text-muted-foreground/30" />}
                      <div>
                        <p className={`text-[10px] font-bold ${has ? color : "text-muted-foreground/40"}`}>{label}</p>
                        <p className="text-[9px] text-muted-foreground/60 font-mono">{example}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stacked bar */}
                {compSegments.length > 0 && (
                  <>
                    <div className="flex h-3 rounded-full overflow-hidden gap-px mb-2">
                      {compSegments.map(({ label, count, color }) => (
                        <div key={label} className={`${color} transition-all`}
                          style={{ width: `${(count / result.length) * 100}%` }}
                          title={`${label}: ${count}`} />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {compSegments.map(({ label, count, color }) => (
                        <span key={label} className="flex items-center gap-1.5 text-[10px]">
                          <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                          <span className="text-muted-foreground">{label}: <strong className="text-foreground">{count}</strong></span>
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {/* Length bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">Length</span>
                    <span className="text-[10px] font-bold font-mono text-foreground">{result.length} / 32+</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${result.barColor}`}
                      style={{ width: `${Math.min(100, (result.length / 32) * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Charset pool */}
              <CharsetPool result={result} />
            </div>

            {/* ── Right: Crack times ── */}
            <div className="flex flex-col gap-5">

              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-blue-400" /> {t("crackTimes.title")}
                </p>
                <p className="text-[10px] text-muted-foreground mb-3">
                  {t("crackTimes.desc")}
                </p>
                <div className="flex flex-col gap-2">
                  <CrackRow
                    label={t("crackTimes.onlineThrottled")}
                    time={result.crackTime.onlineThrottled}
                    icon={Lock}
                    rate={t("crackTimes.rateThrottled")}
                  />
                  <CrackRow
                    label={t("crackTimes.onlineUnthrottled")}
                    time={result.crackTime.onlineUnthrottled}
                    icon={Zap}
                    rate={t("crackTimes.rateUnthrottled")}
                  />
                  <CrackRow
                    label={t("crackTimes.offlineSlow")}
                    time={result.crackTime.offline}
                    icon={RefreshCw}
                    rate={t("crackTimes.rateOffline")}
                  />
                  <CrackRow
                    label={t("crackTimes.offlineFast")}
                    time={result.crackTime.offlineFast}
                    icon={AlertTriangle}
                    rate={t("crackTimes.rateGPU")}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-3">
                  {t("crackTimes.note")}
                </p>
              </div>

              {/* Comparison table */}
              <ComparisonTable result={result} password={password} />

              {/* Tips */}
              <Tips />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!password && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30 gap-3">
            <ShieldCheck className="w-16 h-16" />
            <p className="text-lg font-medium">{t("emptyState.title")}</p>
            <p className="text-sm">{t("emptyState.desc")}</p>
          </div>
        )}

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="security-tools/PasswordStrengthChecker.json" count={4} />
        <FAQ tKey="security-tools/PasswordStrengthChecker.json" />
        <Examples tKey="security-tools/PasswordStrengthChecker.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}