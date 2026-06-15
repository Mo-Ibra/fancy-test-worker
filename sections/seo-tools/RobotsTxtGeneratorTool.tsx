"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Download,
  CheckCircle2,
  AlertCircle,
  Info,
  Code2,
  Globe,
  X,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import { generateRobotsTxt, PRESETS, RobotRule, SitemapEntry, uid, validateRobotsTxt } from "@/funcs/seo-tools/RobotsTxtGeneratorToolFuncs";
import RuleCard from "@/components/seo-tools/robots-txt-generator/RuleCard";
import CopyButton from "@/components/seo-tools/robots-txt-generator/CopyButton";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main ───────────────────────────────────────────────────────────

export default function RobotsTxtGeneratorTool() {
  const t = useT("seo-tools/RobotsTxtGeneratorTool.json");

  const [rules, setRules] = useState<RobotRule[]>([
    { id: uid(), userAgent: "*", disallows: [""], allows: [], crawlDelay: "" },
  ]);
  const [sitemaps, setSitemaps] = useState<SitemapEntry[]>([]);
  const [host, setHost] = useState("");

  const addRule = () => setRules(r => [...r, {
    id: uid(), userAgent: "*", disallows: [""], allows: [], crawlDelay: "",
  }]);

  const updateRule = (id: string, r: RobotRule) =>
    setRules(prev => prev.map(x => x.id === id ? r : x));
  const removeRule = (id: string) =>
    setRules(prev => prev.filter(x => x.id !== id));

  const addSitemap = () => setSitemaps(s => [...s, { id: uid(), url: "" }]);
  const setSitemap = (id: string, url: string) =>
    setSitemaps(prev => prev.map(x => x.id === id ? { ...x, url } : x));
  const rmSitemap = (id: string) =>
    setSitemaps(prev => prev.filter(x => x.id !== id));

  const applyPreset = (p: typeof PRESETS[0]) => {
    setRules(p.rules.map(r => ({ id: uid(), userAgent: r.userAgent ?? "*", disallows: r.disallows ?? [], allows: r.allows ?? [], crawlDelay: r.crawlDelay ?? "" })));
    setSitemaps(p.sitemaps.map(url => ({ id: uid(), url })));
  };

  const output = useMemo(() => generateRobotsTxt(rules, sitemaps, host), [rules, sitemaps, host]);
  const validation = useMemo(() => validateRobotsTxt(output, t), [output, t]);

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "robots.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  const errors = validation.filter(v => v.type === "error");
  const warnings = validation.filter(v => v.type === "warning");
  const infos = validation.filter(v => v.type === "info");

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/RobotsTxtGeneratorTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/RobotsTxtGeneratorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Builder ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Presets */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("presets.title")}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESETS.map(p => (
                  <button key={p.key} onClick={() => applyPreset(p)}
                    className="flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left transition-all group">
                    <span className="text-base">{p.icon}</span>
                    <p className="text-xs font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t(`presets.${p.key}.label`)}</p>
                    <p className="text-[9px] text-muted-foreground">{t(`presets.${p.key}.desc`)}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("rules.title")}</p>
                <button onClick={addRule}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                  <Plus className="w-3.5 h-3.5" /> {t("rules.addRule")}
                </button>
              </div>

              {rules.map((rule, i) => (
                <RuleCard key={rule.id} rule={rule} index={i} total={rules.length}
                  onChange={r => updateRule(rule.id, r)}
                  onRemove={() => removeRule(rule.id)} t={t} />
              ))}
            </div>

            {/* Sitemaps */}
            <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> {t("sitemaps.title")}
                </p>
                <button onClick={addSitemap}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                  <Plus className="w-3.5 h-3.5" /> {t("sitemaps.add")}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {sitemaps.map(sm => (
                  <div key={sm.id} className="flex items-center gap-2">
                    <input value={sm.url} onChange={e => setSitemap(sm.id, e.target.value)}
                      placeholder={t("sitemaps.placeholder")}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("sitemaps.title")} />
                    <button onClick={() => rmSitemap(sm.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {sitemaps.length === 0 && (
                  <p className="text-[10px] text-muted-foreground/50 italic">{t("sitemaps.noSitemaps")}</p>
                )}
              </div>
            </div>

            {/* Host (optional) */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("host.label")}</p>
              <input value={host} onChange={e => setHost(e.target.value)}
                placeholder={t("host.placeholder")}
                className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" aria-label={t("host.label")} />
            </div>
          </div>

          {/* ── Right: Preview + Validation ── */}
          <div className="flex flex-col gap-5">

            {/* Validation */}
            {validation.length > 0 && (
              <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{t("validation.title")}</p>
                {errors.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {v.message}
                  </div>
                ))}
                {warnings.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {v.message}
                  </div>
                ))}
                {infos.map((v, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {v.message}
                  </div>
                ))}
                {errors.length === 0 && warnings.length === 0 && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t("validation.noErrors")}
                  </div>
                )}
              </div>
            )}

            {/* Generated code */}
            <div className="flex flex-col gap-0 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                <Code2 className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("output.title")}</span>
                <div className="flex gap-2">
                  <CopyButton text={output} />
                  <button onClick={download}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                    <Download className="w-3.5 h-3.5" /> {t("output.download")}
                  </button>
                </div>
              </div>
              <pre className="p-4 text-[11px] font-mono text-foreground leading-relaxed overflow-x-auto bg-slate-950 dark:bg-black/40 max-h-[500px] overflow-y-auto whitespace-pre-wrap">
                <code>{output}</code>
              </pre>
            </div>

            {/* How to use */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-blue-400" /> {t("howToUse.title")}
              </p>
              <div className="flex flex-col gap-2 text-[10px] text-muted-foreground">
                {Array.isArray(t.raw("howToUse.tips")) && (t.raw("howToUse.tips") as string[]).map((tip, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-400 shrink-0">›</span> {tip}
                  </p>
                ))}
              </div>
            </div>

            {/* Deployment tip */}
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {t("deployment.tip", { url: "https://yourdomain.com/robots.txt" })}
              </p>
            </div>
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/RobotsTxtGeneratorTool.json" count={4} />
        <FAQ tKey="seo-tools/RobotsTxtGeneratorTool.json" />
        <Examples tKey="seo-tools/RobotsTxtGeneratorTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}