"use client";

import { useState, useMemo, useCallback } from "react";
import {
  GitCompare,
  Trash2,
  CheckCircle2,
  FileCode,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Eye,
  EyeOff,
  Download,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { countStats, DiffNode, diffValues, EXAMPLES, flattenDiff } from "@/funcs/dev-tools/JSONDiffToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import JSONPanel from "@/components/dev-tools/json-diff/JSONPanel";
import DiffRow from "@/components/dev-tools/json-diff/DiffRow";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function JSONDiffTool() {
  const t = useTranslations("dev-tools.JSONDiffTool");

  const [leftRaw, setLeftRaw] = useState(EXAMPLES[0].left);
  const [rightRaw, setRightRaw] = useState(EXAMPLES[0].right);
  const [showUnchanged, setShowUnchanged] = useState(true);
  const [diffNodes, setDiffNodes] = useState<DiffNode | null>(null);

  // Parse errors
  const leftError = useMemo(() => {
    if (!leftRaw.trim()) return "";
    try { JSON.parse(leftRaw); return ""; } catch (e: any) { return e.message; }
  }, [leftRaw]);

  const rightError = useMemo(() => {
    if (!rightRaw.trim()) return "";
    try { JSON.parse(rightRaw); return ""; } catch (e: any) { return e.message; }
  }, [rightRaw]);

  // Compute diff
  const diff = useMemo(() => {
    if (leftError || rightError || !leftRaw.trim() || !rightRaw.trim()) return null;
    try {
      const l = JSON.parse(leftRaw);
      const r = JSON.parse(rightRaw);
      return diffValues(l, r, "root");
    } catch { return null; }
  }, [leftRaw, rightRaw, leftError, rightError]);

  // Sync diffNodes when diff changes (preserve expand/collapse state)
  const activeDiff = useMemo(() => {
    if (!diff) return null;
    if (!diffNodes) return diff;
    // Merge expanded state
    function merge(fresh: DiffNode, old: DiffNode): DiffNode {
      const matchedChildren = fresh.children.map(fc => {
        const oc = old.children.find(c => c.path === fc.path);
        return oc ? merge(fc, oc) : fc;
      });
      return { ...fresh, expanded: old.expanded, children: matchedChildren };
    }
    return merge(diff, diffNodes);
  }, [diff]);

  // Toggle expand
  const toggleNode = useCallback((path: string) => {
    setDiffNodes(prev => {
      if (!prev && !activeDiff) return null;
      const base = prev ?? activeDiff!;
      function toggle(n: DiffNode): DiffNode {
        if (n.path === path) return { ...n, expanded: !n.expanded };
        return { ...n, children: n.children.map(toggle) };
      }
      return toggle(base);
    });
  }, [activeDiff]);

  // Expand/Collapse all
  const setAllExpanded = (v: boolean) => {
    if (!activeDiff) return;
    function set(n: DiffNode): DiffNode {
      return { ...n, expanded: v, children: n.children.map(set) };
    }
    setDiffNodes(set(activeDiff));
  };

  const stats = useMemo(() => activeDiff ? countStats(activeDiff) : null, [activeDiff]);
  const flatRows = useMemo(
    () => activeDiff ? flattenDiff(activeDiff, !showUnchanged) : [],
    [activeDiff, showUnchanged]
  );

  // Download diff report
  const downloadReport = () => {
    if (!activeDiff) return;
    const report = {
      generated: new Date().toISOString(),
      stats,
      diff: flatRows.filter(n => n.type !== "unchanged").map(n => ({
        path: n.path,
        type: n.type,
        left: n.leftVal,
        right: n.rightVal,
      })),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "diff-report.json";
    a.click();
  };

  const totalChanges = stats ? stats.added + stats.removed + stats.changed : 0;
  const isIdentical = totalChanges === 0 && !!activeDiff;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/JSONDiffTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/JSONDiffTool.json" />

        {/* ── Input panels ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <JSONPanel label={t("panels.left")} value={leftRaw} onChange={setLeftRaw} error={leftError} color="blue" />
          <JSONPanel label={t("panels.right")} value={rightRaw} onChange={setRightRaw} error={rightError} color="purple" />
        </div>

        {/* Examples */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("examples.title")}</span>
          {EXAMPLES.map(({ label, left, right }) => (
            <button key={label}
              onClick={() => { setLeftRaw(left); setRightRaw(right); setDiffNodes(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
              <FileCode className="w-3 h-3" /> {label}
            </button>
          ))}
          <button onClick={() => { setLeftRaw(""); setRightRaw(""); setDiffNodes(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all ml-auto">
            <Trash2 className="w-3 h-3" /> {t("examples.clear")}
          </button>
        </div>

        {/* ── Stats bar ── */}
        {stats && (
          <div className={`flex items-center gap-4 flex-wrap px-5 py-3.5 rounded-2xl border mb-4 ${isIdentical
            ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10"
            : "border-border bg-card"
            } shadow-sm`}>
            {isIdentical ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-bold">{t("stats.identical")}</span>
              </div>
            ) : (
              <>
                <span className="text-xs font-bold text-foreground">
                  {t("stats.changes", { count: totalChanges })}
                </span>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { label: t("stats.added"), value: stats.added, bg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
                    { label: t("stats.removed"), value: stats.removed, bg: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
                    { label: t("stats.changed"), value: stats.changed, bg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
                    { label: t("stats.unchanged"), value: stats.unchanged, bg: "bg-muted text-muted-foreground" },
                  ].map(({ label, value, bg }) => (
                    <span key={label} className={`text-xs font-bold px-2.5 py-1 rounded-full ${bg}`}>
                      {value} {label}
                    </span>
                  ))}
                </div>
              </>
            )}

            {/* Controls */}
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <button onClick={() => setShowUnchanged(p => !p)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                {showUnchanged ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showUnchanged ? t("controls.hideUnchanged") : t("controls.showUnchanged")}
              </button>
              <button onClick={() => setAllExpanded(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                <ChevronDown className="w-3.5 h-3.5" /> {t("controls.expandAll")}
              </button>
              <button onClick={() => setAllExpanded(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                <ChevronRightIcon className="w-3.5 h-3.5" /> {t("controls.collapseAll")}
              </button>
              <button onClick={downloadReport} disabled={!activeDiff}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-40 transition-all">
                <Download className="w-3.5 h-3.5" /> {t("controls.report")}
              </button>
            </div>
          </div>
        )}

        {/* ── Legend ── */}
        {activeDiff && !isIdentical && (
          <div className="flex items-center gap-4 flex-wrap mb-3 text-xs">
            {[
              { color: "bg-emerald-400", label: t("legend.added"), textColor: "text-emerald-600 dark:text-emerald-400" },
              { color: "bg-red-400", label: t("legend.removed"), textColor: "text-red-600 dark:text-red-400" },
              { color: "bg-amber-400", label: t("legend.changed"), textColor: "text-amber-600 dark:text-amber-400" },
              { color: "bg-purple-400", label: t("legend.typeChanged"), textColor: "text-purple-600 dark:text-purple-400" },
              { color: "bg-border", label: t("legend.unchanged"), textColor: "text-muted-foreground" },
            ].map(({ color, label, textColor }) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                <span className={`font-medium ${textColor}`}>{label}</span>
              </span>
            ))}
          </div>
        )}

        {/* ── Diff tree ── */}
        {activeDiff && flatRows.length > 0 && (
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3 bg-muted/20 border-b border-border">
              <GitCompare className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("diffView.title")}</span>
              <span className="text-xs text-muted-foreground/60">{t("diffView.nodes", { count: flatRows.length })}</span>
            </div>
            {/* Rows */}
            <div className="p-3 max-h-[600px] overflow-y-auto">
              {flatRows.map((node, i) => (
                <DiffRow
                  key={`${node.path}-${i}`}
                  node={node}
                  depth={node.path.split(".").length - 1 + (node.path.match(/\[/g) ?? []).length}
                  onToggle={toggleNode}
                  showUnchanged={showUnchanged}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty / loading state */}
        {!activeDiff && !leftError && !rightError && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40 gap-3">
            <GitCompare className="w-12 h-12" />
            <p className="text-sm">{t("empty.message")}</p>
          </div>
        )}

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/JSONDiffTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/JSONDiffTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/JSONDiffTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}