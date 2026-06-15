"use client";

import { useState, useMemo } from "react";
import {
  Layers,
  ClipboardPaste,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  Code2,
  FileText,
  AlignLeft,
  Eye,
  EyeOff,
  TreePine,
  BarChart2,
  Download,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { analyzeHeadings, computeDepths, HeadingLevel, InputMode, LEVEL_COLORS, parseHtml, parseText } from "@/funcs/seo-tools/HeadingStructureAnalyzerFuncs";
import ScoreRing from "@/components/seo-tools/heading-structure-analyzer/ScoreRing";
import CopyButton from "@/components/seo-tools/heading-structure-analyzer/CopyButton";
import TreeRow from "@/components/seo-tools/heading-structure-analyzer/TreeRow";
import OutlineRow from "@/components/seo-tools/heading-structure-analyzer/OutlineRow";
import RelatedTools from "@/components/seo-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

// ── Main ───────────────────────────────────────────────────────────

type ViewTab = "tree" | "outline" | "table" | "chart";

export default function HeadingStructureAnalyzerTool() {
  const t = useT("seo-tools/HeadingStructureAnalyzerTool.json");

  const [inputMode, setInputMode] = useState<InputMode>("html");
  const [input, setInput] = useState("");
  const [viewTab, setViewTab] = useState<ViewTab>("tree");
  const [showIds, setShowIds] = useState(true);
  const [showIssueOnly, setShowIssueOnly] = useState(false);

  // Parse
  const rawEntries = useMemo(() => {
    if (!input.trim()) return [];
    return inputMode === "html" ? parseHtml(input) : parseText(input);
  }, [input, inputMode]);

  // Analyze
  const { processed, issues, stats } = useMemo(() => analyzeHeadings(rawEntries, t as (key: string, params?: Record<string, any>, fallback?: string) => string), [rawEntries, t]);

  // Compute tree depths
  const withDepths = useMemo(() => computeDepths(processed), [processed]);

  // Score
  const score = useMemo(() => {
    if (withDepths.length === 0) return 0;
    let s = 100;
    const errs = issues.filter(i => i.type === "error").length;
    const warns = issues.filter(i => i.type === "warning").length;
    s -= errs * 20;
    s -= warns * 10;
    s -= withDepths.filter(e => e.hasIssue).length * 5;
    return Math.max(0, Math.min(100, s));
  }, [issues, withDepths]);

  const displayEntries = showIssueOnly ? withDepths.filter(e => e.hasIssue) : withDepths;
  const hasText = input.trim().length > 0;
  const totalHeadings = withDepths.length;

  // Export as text outline
  const exportOutline = () => {
    const lines = withDepths.map(e => `${"  ".repeat(e.level - 1)}H${e.level}: ${e.text}`).join("\n");
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "heading-structure.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  // Export as JSON
  const exportJson = () => {
    const data = withDepths.map(({ level, text, id, position, hasIssue, issues }) => ({
      level, text, id, position, hasIssue, issues
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "headings.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // Sample HTML
  const SAMPLE_HTML = `<h1>The Complete Guide to React Development</h1>
<h2>Getting Started</h2>
<h3>Installing Node.js and npm</h3>
<h3>Creating Your First Project</h3>
<h2>Core Concepts</h2>
<h3>Components and Props</h3>
<h4>Functional Components</h4>
<h4>Class Components</h4>
<h3>State and Lifecycle</h3>
<h5>useState Hook</h5>
<h5>useEffect Hook</h5>
<h2>Advanced Topics</h2>
<h3>Context API</h3>
<h3>Performance Optimization</h3>
<h2>Conclusion</h2>`;

  const SAMPLE_MD = `# The Complete Guide to React
## Getting Started
### Prerequisites
### Installation
## Core Concepts
### Components
#### Functional Components
#### Class Components
### Hooks
## Deployment
### Build Process
### Hosting Options`;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="seo-tools/HeadingStructureAnalyzerTool.json" href="/seo-tools" />

        {/* Header */}
        <Header tKey="seo-tools/HeadingStructureAnalyzerTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Input + Stats ── */}
          <div className="flex flex-col gap-5">

            {/* Input mode tabs */}
            <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
              {([
                { k: "html" as InputMode, icon: Code2, label: t("input.htmlLabel") },
                { k: "text" as InputMode, icon: AlignLeft, label: t("input.markdownLabel") },
              ]).map(({ k, icon: Icon, label }) => (
                <button key={k} onClick={() => { setInputMode(k); setInput(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${inputMode === k ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            {/* Input textarea */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {inputMode === "html" ? t("input.pasteHtml") : t("input.pasteMarkdown")}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.readText().then(setInput).catch(() => { })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                    <ClipboardPaste className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setInput("")} disabled={!input}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={inputMode === "html"
                  ? t("input.htmlPlaceholder")
                  : t("input.markdownPlaceholder")}
                rows={10}
                className="w-full px-4 py-4 rounded-2xl border border-border bg-card text-foreground text-xs font-mono resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/40 shadow-sm leading-relaxed"
              />
            </div>

            {/* Try sample */}
            <button onClick={() => setInput(inputMode === "html" ? SAMPLE_HTML : SAMPLE_MD)}
              className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">
              <Layers className="w-3.5 h-3.5" /> {inputMode === "html" ? t("input.loadSampleHtml") : t("input.loadSampleMarkdown")}
            </button>

            {/* Score + level breakdown */}
            {hasText && totalHeadings > 0 && (
              <>
                {/* Score */}
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card shadow-sm">
                  <ScoreRing score={score} />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {score >= 80 ? t("score.good") : score >= 60 ? t("score.needsImprovement") : t("score.poor")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("score.headingsCount", { count: totalHeadings, label: totalHeadings === 1 ? t("score.headingLabel") : t("score.headingsLabel") })}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {t("score.statsCount", {
                        errors: issues.filter(i => i.type === "error").length,
                        errorsLabel: issues.filter(i => i.type === "error").length === 1 ? t("score.errorLabel") : t("score.errorsLabel"),
                        warnings: issues.filter(i => i.type === "warning").length,
                        warningsLabel: issues.filter(i => i.type === "warning").length === 1 ? t("score.warningLabel") : t("score.warningsLabel")
                      })}
                    </p>
                  </div>
                </div>

                {/* Level distribution */}
                <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{t("distribution.title")}</p>
                  {([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map(level => {
                    const count = stats[level];
                    const c = LEVEL_COLORS[level];
                    const pct = totalHeadings > 0 ? (count / totalHeadings) * 100 : 0;
                    return (
                      <div key={level} className="flex items-center gap-3">
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border w-8 text-center shrink-0 ${c.bg} ${c.text} ${c.border}`}>
                          H{level}
                        </span>
                        <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                          <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-bold font-mono tabular-nums text-foreground w-4 text-right shrink-0">{count}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Issues list */}
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("issues.analysis")}</p>
                  {issues.map((issue, i) => (
                    <div key={i} className={`flex items-start gap-2 px-3 py-2.5 rounded-xl border text-xs ${issue.type === "error" ? "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400"
                      : issue.type === "warning" ? "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400"
                        : "border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400"
                      }`}>
                      {issue.type === "error" ? <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        : issue.type === "warning" ? <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          : <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                      <span className="leading-relaxed">{issue.message}</span>
                    </div>
                  ))}
                </div>

                {/* Export */}
                <div className="flex gap-2">
                  <button onClick={exportOutline}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                    <Download className="w-3.5 h-3.5" /> {t("export.outline")}
                  </button>
                  <button onClick={exportJson}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                    <Download className="w-3.5 h-3.5" /> {t("export.json")}
                  </button>
                </div>
              </>
            )}

            {/* SEO tips */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-blue-400" /> {t("tips.title")}
              </p>
              <div className="flex flex-col gap-2 text-[10px] text-muted-foreground">
                {[
                  t("tips.oneH1"),
                  t("tips.sequential"),
                  t("tips.h2Section"),
                  t("tips.primaryKeyword"),
                  t("tips.contentHierarchy"),
                  t("tips.usersScan"),
                  t("tips.headingLength")
                ].map((tip, i) => (
                  <p key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-400 shrink-0">›</span> {tip}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Visualization ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {hasText && totalHeadings > 0 ? (
              <>
                {/* Tab bar + controls */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                    {([
                      { k: "tree" as ViewTab, icon: TreePine, label: t("view.tree") },
                      { k: "outline" as ViewTab, icon: AlignLeft, label: t("view.outline") },
                      { k: "table" as ViewTab, icon: FileText, label: t("view.table") },
                      { k: "chart" as ViewTab, icon: BarChart2, label: t("view.chart") },
                    ]).map(({ k, icon: Icon, label }) => (
                      <button key={k} onClick={() => setViewTab(k)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${viewTab === k ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}>
                        <Icon className="w-3.5 h-3.5" /> {label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2 ml-auto">
                    <button onClick={() => setShowIssueOnly(p => !p)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${showIssueOnly ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-600" : "border-border bg-card text-muted-foreground hover:border-amber-300"
                        }`}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      {showIssueOnly ? t("view.issuesOnly") : t("view.allHeadings")}
                    </button>
                    {viewTab === "tree" && (
                      <button onClick={() => setShowIds(p => !p)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${showIds ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-border bg-card text-muted-foreground hover:border-blue-300"
                          }`}>
                        {showIds ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {t("view.idAttrs")}
                      </button>
                    )}
                    <CopyButton text={withDepths.map(e => `${"  ".repeat(e.level - 1)}H${e.level}: ${e.text}`).join("\n")} />
                  </div>
                </div>

                {/* ── TREE VIEW ── */}
                {viewTab === "tree" && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                      <TreePine className="w-4 h-4 text-blue-500" />
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("view.headingTree")}</p>
                      <div className="flex gap-2 text-[9px] flex-wrap">
                        {([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map(l => stats[l] > 0 && (
                          <span key={l} className={`px-1.5 py-0.5 rounded-md ${LEVEL_COLORS[l].bg} ${LEVEL_COLORS[l].text} font-bold`}>
                            H{l}:{stats[l]}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 flex flex-col gap-0.5 max-h-[600px] overflow-y-auto">
                      {displayEntries.map((e, i) => (
                        <TreeRow key={i} entry={e} showId={showIds} />
                      ))}
                      {displayEntries.length === 0 && (
                        <p className="text-xs text-muted-foreground/50 italic text-center py-6">{t("ui.noIssues")}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── OUTLINE VIEW ── */}
                {viewTab === "outline" && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                      <AlignLeft className="w-4 h-4 text-blue-500" />
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground">{t("view.contentOutline")}</p>
                    </div>
                    <div className="p-4 flex flex-col gap-0.5 max-h-[600px] overflow-y-auto">
                      {displayEntries.map((e, i) => <OutlineRow key={i} entry={e} />)}
                    </div>
                  </div>
                )}

                {/* ── TABLE VIEW ── */}
                {viewTab === "table" && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 px-4 py-2.5 bg-muted/30 border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span className="col-span-1">{t("table.position")}</span>
                      <span className="col-span-1">{t("table.level")}</span>
                      <span className="col-span-7">{t("table.text")}</span>
                      <span className="col-span-2">{t("table.characters")}</span>
                      <span className="col-span-1">{t("table.ok")}</span>
                    </div>
                    <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
                      {displayEntries.map((e, i) => {
                        const c = LEVEL_COLORS[e.level];
                        return (
                          <div key={i} className={`grid grid-cols-12 items-center px-4 py-2 ${e.hasIssue ? "bg-amber-50/50 dark:bg-amber-900/5" : i % 2 === 0 ? "bg-muted/10" : ""}`}>
                            <span className="col-span-1 text-[10px] font-mono text-muted-foreground/40 tabular-nums">{e.position}</span>
                            <span className={`col-span-1 text-[10px] font-black px-1.5 py-0.5 rounded-md border text-center ${c.bg} ${c.text} ${c.border}`}>H{e.level}</span>
                            <div className="col-span-7 px-2">
                              <p className="text-xs text-foreground leading-snug truncate">{e.text || <em className="text-muted-foreground/40">empty</em>}</p>
                              {e.hasIssue && e.issues[0] && (
                                <p className="text-[9px] text-amber-600 dark:text-amber-400 truncate mt-0.5">{e.issues[0]}</p>
                              )}
                            </div>
                            <span className="col-span-2 text-xs font-mono tabular-nums text-muted-foreground">{e.text.length}</span>
                            <span className="col-span-1">
                              {e.hasIssue
                                ? <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                                : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ── CHART VIEW ── */}
                {viewTab === "chart" && (
                  <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
                      <BarChart2 className="w-4 h-4 text-blue-500" />
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground">{t("chart.headingDistribution")}</p>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      {/* Bar chart */}
                      <div className="flex flex-col gap-3">
                        {([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map(level => {
                          const count = stats[level];
                          const c = LEVEL_COLORS[level];
                          const pct = totalHeadings > 0 ? (count / totalHeadings) * 100 : 0;
                          return (
                            <div key={level} className="flex items-center gap-4">
                              <span className={`text-xs font-black px-2 py-1 rounded-md border w-10 text-center shrink-0 ${c.bg} ${c.text} ${c.border}`}>
                                H{level}
                              </span>
                              <div className="flex-1 h-6 rounded-full bg-border overflow-hidden">
                                <div className={`h-full rounded-full flex items-center justify-end pr-3 transition-all ${c.bar}`}
                                  style={{ width: `${Math.max(0, pct)}%` }}>
                                  {pct > 10 && <span className="text-[10px] font-bold text-white">{count}</span>}
                                </div>
                              </div>
                              <div className="flex flex-col items-end w-20 shrink-0">
                                <span className="text-xs font-bold font-mono text-foreground">{count} heading{count !== 1 ? "s" : ""}</span>
                                <span className="text-[9px] text-muted-foreground">{pct.toFixed(0)}% of total</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Nesting depth chart */}
                      <div className="border-t border-border pt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("chart.nestingDepth")}</p>
                        <div className="flex items-end gap-0.5 h-24 border-b border-border">
                          {withDepths.map((e, i) => {
                            const c = LEVEL_COLORS[e.level];
                            const pct = Math.max(10, ((6 - e.level + 1) / 6) * 100);
                            return (
                              <div key={i} title={`H${e.level}: ${e.text.slice(0, 40)}`}
                                className={`flex-1 rounded-t-sm cursor-pointer hover:opacity-80 transition-opacity ${c.bar}`}
                                style={{ height: `${pct}%`, minWidth: 2 }} />
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                          <span>{t("chart.position1")}</span>
                          <span>{`${t("chart.positionTotal")} ${totalHeadings}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Level legend */}
                <div className="flex flex-wrap gap-2">
                  {([1, 2, 3, 4, 5, 6] as HeadingLevel[]).map(l => {
                    const c = LEVEL_COLORS[l];
                    return (
                      <span key={l} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold ${c.bg} ${c.text} ${c.border}`}>
                        H{l} — {t(`headingLevels.${l}`)}
                      </span>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30 gap-3 rounded-2xl border border-dashed border-border">
                <Layers className="w-14 h-14" />
                <p className="text-base font-medium">{t("emptyState.instruction")}</p>
                <p className="text-xs text-center max-w-xs">{t("emptyState.description")}</p>
              </div>
            )}
          </div>
        </div>

        {/* How‑to / FAQ / Examples */}
        <HowToUse tKey="seo-tools/HeadingStructureAnalyzerTool.json" count={4} />
        <FAQ tKey="seo-tools/HeadingStructureAnalyzerTool.json" />
        <Examples tKey="seo-tools/HeadingStructureAnalyzerTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}