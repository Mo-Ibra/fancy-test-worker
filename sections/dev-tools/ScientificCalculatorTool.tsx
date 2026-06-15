"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  History,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AngleMode, BTN_COLORS, CalcMode, evaluate, HistoryEntry, MAIN_ROWS, SCIENTIFIC_ROWS } from "@/funcs/dev-tools/ScientificCalculatorToolFuncs";
import CopyButton from "@/components/dev-tools/scientific-calculator/CopyButton";
import Collapsible from "@/components/dev-tools/scientific-calculator/Collapsible";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";

export default function ScientificCalculatorTool() {
  const t = useTranslations("dev-tools.ScientificCalculatorTool");

  const [expr, setExpr] = useState("");
  const [display, setDisplay] = useState("0");
  const [prevResult, setPrevResult] = useState("");
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [calcMode, setCalcMode] = useState<CalcMode>("scientific");
  const [memory, setMemory] = useState(0);
  const [hasMemory, setHasMemory] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [is2nd, setIs2nd] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard input
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement && e.target !== inputRef.current) return;
      const k = e.key;
      if (/^[\d.]$/.test(k)) { handleInput(k); e.preventDefault(); }
      else if (k === "+" || k === "-" || k === "*" || k === "/" || k === "^" || k === "%" || k === "(" || k === ")") { handleInput(k === "*" ? "×" : k === "/" ? "÷" : k); e.preventDefault(); }
      else if (k === "Enter" || k === "=") { handleAction("="); e.preventDefault(); }
      else if (k === "Backspace") { handleAction("DEL"); e.preventDefault(); }
      else if (k === "Escape") { handleAction("AC"); e.preventDefault(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expr, isResult]);

  const handleInput = useCallback((val: string) => {
    setIsResult(false);
    setExpr(prev => {
      if (isResult && /^[\d.]/.test(val)) return val;
      return prev + val;
    });
  }, [isResult]);

  const handleAction = useCallback((action: string) => {
    switch (action) {
      case "AC":
        setExpr(""); setDisplay("0"); setIsResult(false);
        break;
      case "DEL":
        setExpr(prev => {
          const next = prev.slice(0, -1);
          if (!next) setDisplay("0");
          return next;
        });
        setIsResult(false);
        break;
      case "=": {
        const e = expr.trim();
        if (!e) return;
        const result = evaluate(e, angleMode);
        const isErr = result.startsWith("Error:");
        if (!isErr) {
          setHistory(h => [{ expression: e, result, ts: Date.now() }, ...h].slice(0, 50));
          setPrevResult(result);
        }
        setDisplay(result);
        setExpr(isErr ? e : result);
        setIsResult(!isErr);
        break;
      }
      case "neg":
        if (expr.startsWith("-")) setExpr(e => e.slice(1));
        else setExpr(e => "-" + e);
        setIsResult(false);
        break;
      case "ans":
        if (prevResult) { handleInput(prevResult); }
        break;
      case "2nd":
        setIs2nd(p => !p);
        break;
      case "MC":
        setMemory(0); setHasMemory(false); break;
      case "MR":
        if (hasMemory) { handleInput(String(memory)); } break;
      case "M+": {
        const cur = parseFloat(evaluate(expr, angleMode));
        if (!isNaN(cur)) { setMemory(m => m + cur); setHasMemory(true); }
        break;
      }
      case "M-": {
        const cur = parseFloat(evaluate(expr, angleMode));
        if (!isNaN(cur)) { setMemory(m => m - cur); setHasMemory(true); }
        break;
      }
      case "MS": {
        const cur = parseFloat(evaluate(expr, angleMode));
        if (!isNaN(cur)) { setMemory(cur); setHasMemory(true); }
        break;
      }
    }
  }, [expr, angleMode, prevResult, hasMemory, memory, handleInput]);

  // Live preview
  const liveResult = useMemo(() => {
    if (!expr || isResult) return "";
    const r = evaluate(expr, angleMode);
    if (r === "" || r.startsWith("Error:")) return "";
    if (r === expr) return "";
    return r;
  }, [expr, angleMode, isResult]);

  const displayValue = expr || display;

  const rows = calcMode === "scientific" ? [...SCIENTIFIC_ROWS, ...MAIN_ROWS] : MAIN_ROWS;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/ScientificCalculatorTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/ScientificCalculatorTool.json" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Calculator ── */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">

              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border gap-2 flex-wrap">
                {/* Mode toggle */}
                <div className="flex gap-1 p-0.5 rounded-lg border border-border bg-background">
                  {(["basic", "scientific"] as CalcMode[]).map(m => (
                    <button key={m} onClick={() => setCalcMode(m)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${calcMode === m ? "bg-blue-500 text-white" : "text-muted-foreground hover:text-foreground"
                        }`}>{m}</button>
                  ))}
                </div>

                {/* Angle mode */}
                <div className="flex gap-0.5 p-0.5 rounded-lg border border-border bg-background">
                  {(["DEG", "RAD", "GRAD"] as AngleMode[]).map(m => (
                    <button key={m} onClick={() => setAngleMode(m)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${angleMode === m ? "bg-orange-400 text-white" : "text-muted-foreground hover:text-foreground"
                        }`}>{m}</button>
                  ))}
                </div>

                {/* Memory indicator */}
                <div className="flex items-center gap-2">
                  {hasMemory && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                      M: {memory}
                    </span>
                  )}
                  <button onClick={() => setShowHistory(p => !p)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${showHistory ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600" : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                      }`}>
                    <History className="w-3 h-3" /> {history.length}
                  </button>
                </div>
              </div>

              {/* Display */}
              <div className="px-5 py-4 bg-slate-900 dark:bg-slate-950">
                {/* Expression */}
                <div className="flex items-center gap-2 min-h-6">
                  <span className="flex-1 text-right text-sm font-mono text-slate-400 truncate">{expr || " "}</span>
                  {expr && <CopyButton text={expr} />}
                </div>
                {/* Live preview */}
                {liveResult && !isResult && (
                  <div className="flex justify-end">
                    <span className="text-sm font-mono text-blue-400 opacity-70">= {liveResult}</span>
                  </div>
                )}
                {/* Main display */}
                <div className="flex items-center gap-2 mt-1">
                  <p className={`flex-1 text-right font-mono font-bold leading-none transition-all ${displayValue.startsWith("Error")
                    ? "text-red-400 text-sm"
                    : displayValue.length > 14
                      ? "text-2xl text-white"
                      : displayValue.length > 10
                        ? "text-3xl text-white"
                        : "text-4xl text-white"
                    }`}>
                    {isResult ? displayValue : (displayValue || "0")}
                  </p>
                  {isResult && <CopyButton text={displayValue} />}
                </div>
              </div>

              {/* Keyboard hint */}
              <div className="px-5 py-1.5 bg-slate-800 dark:bg-slate-900 border-b border-border">
                <p className="text-[9px] text-slate-500 text-right">Keyboard supported · Enter = · Esc = AC · Backspace = DEL</p>
              </div>

              {/* Buttons */}
              <div className="p-3 flex flex-col gap-1.5">
                {rows.map((row, ri) => (
                  <div key={ri} className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))` }}>
                    {row.map((btn, bi) => {
                      const color = btn.color ?? "default";
                      const classes = BTN_COLORS[color];
                      const label2nd: Record<string, string> = {
                        sin: "asin", cos: "acos", tan: "atan",
                        log: "log2", "√": "cbrt", "x²": "x³",
                      };
                      const lbl = is2nd && label2nd[btn.label] ? label2nd[btn.label] : btn.label;
                      const val = is2nd && label2nd[btn.label]
                        ? { sin: "asin(", cos: "acos(", tan: "atan(", log: "log2(", "√": "cbrt(", "x²": "^3" }[btn.label] ?? btn.value
                        : btn.value;

                      return (
                        <button key={bi}
                          onClick={() => {
                            if (is2nd && label2nd[btn.label]) setIs2nd(false);
                            if (btn.action) handleAction(btn.action);
                            else if (val) handleInput(val);
                          }}
                          className={`h-12 rounded-xl border text-sm font-bold transition-all duration-150 active:scale-95 ${classes} ${is2nd && label2nd[btn.label] ? "ring-2 ring-orange-400" : ""
                            }`}
                        >
                          {lbl}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: History + Reference ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* History */}
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3.5 bg-muted/20 border-b border-border">
                <History className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("history.title")}</span>
                {history.length > 0 && (
                  <button onClick={() => setHistory([])}
                    className="text-[10px] text-muted-foreground hover:text-red-500 transition-colors font-bold">
                    {t("history.clear")}
                  </button>
                )}
              </div>
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {history.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground/40">{t("history.empty")}</div>
                ) : history.map((h, i) => (
                  <button key={i}
                    onClick={() => { setExpr(h.result); setDisplay(h.result); setIsResult(true); }}
                    className="w-full flex flex-col items-end gap-0.5 px-4 py-3 hover:bg-muted/20 transition-colors group text-right">
                    <span className="text-[10px] font-mono text-muted-foreground/60 group-hover:text-muted-foreground transition-colors truncate max-w-full">{h.expression}</span>
                    <span className="text-sm font-bold font-mono text-foreground group-hover:text-blue-500 transition-colors">{h.result}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Function reference */}
            <Collapsible title={t("functionReference")} defaultOpen>
              <div className="flex flex-col gap-3">
                {[
                  {
                    group: t("trigonometric"),
                    items: [
                      ["sin(x)", t("sine")],
                      ["cos(x)", t("cosine")],
                      ["tan(x)", t("tangent")],
                      ["asin(x)", t("invSine")],
                      ["acos(x)", t("invCosine")],
                      ["atan(x)", t("invTangent")],
                    ],
                  },
                  {
                    group: t("hyperbolic"),
                    items: [
                      ["sinh(x)", t("hypSine")],
                      ["cosh(x)", t("hypCosine")],
                      ["tanh(x)", t("hypTangent")],
                    ],
                  },
                  {
                    group: t("logExp"),
                    items: [
                      ["log(x)", t("log10")],
                      ["ln(x)", t("ln")],
                      ["log2(x)", t("log2")],
                      ["exp(x)", t("exp")],
                    ],
                  },
                  {
                    group: t("rootsPowers"),
                    items: [
                      ["sqrt(x)", t("sqrt")],
                      ["cbrt(x)", t("cbrt")],
                      ["x^n", t("power")],
                      ["n!", t("factorialN")],
                    ],
                  },
                  {
                    group: t("combinatorics"),
                    items: [
                      ["nCr(n,r)", t("nCr")],
                      ["nPr(n,r)", t("nPr")],
                    ],
                  },
                  {
                    group: t("constants"),
                    items: [
                      ["π / pi", t("pi")],
                      ["e", t("eConst")],
                      ["phi / φ", t("phi")],
                    ],
                  },
                ].map(({ group, items }) => (
                  <div key={group}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">{group}</p>
                    <div className="flex flex-col gap-1">
                      {items.map(([fn, desc]) => (
                        <button key={fn}
                          onClick={() => {
                            const val = fn.includes("(") ? fn.split(")")[0] + "(" : fn;
                            handleInput(val);
                          }}
                          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/30 transition-colors group text-left">
                          <code className="text-xs font-mono font-bold text-blue-500 dark:text-blue-400 w-20 shrink-0">{fn}</code>
                          <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">{desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Collapsible>

            {/* Common expressions */}
            <Collapsible title={t("exampleExpressions")} defaultOpen={false}>
              <div className="flex flex-col gap-1.5">
                {[
                  { label: t("circleArea"), expr: "π × 5^2" },
                  { label: t("pythagoras"), expr: "sqrt(3^2 + 4^2)" },
                  { label: t("sin30"), expr: "sin(30)" },
                  { label: t("cos60Sin30"), expr: "cos(60) + sin(30)" },
                  { label: t("logBase10"), expr: "log(1000)" },
                  { label: t("eToPi"), expr: "e^π" },
                  { label: t("combinations", { n: 5 }), expr: "nCr(5,2)" },
                  { label: t("factorial", { n: 10 }), expr: "10!" },
                  { label: t("goldenRatio"), expr: "phi^2" },
                  { label: t("compoundInterest"), expr: "1000 × (1 + 0.05)^10" },
                ].map(({ label, expr: ex }) => (
                  <button key={label}
                    onClick={() => { setExpr(ex); setIsResult(false); setDisplay(ex); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-left transition-all group">
                    <code className="text-[10px] font-mono text-blue-500 dark:text-blue-400 shrink-0">{ex}</code>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors truncate">{label}</span>
                  </button>
                ))}
              </div>
            </Collapsible>
          </div>
        </div>

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}