"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  FileCode,
  Code2,
  Trash2,
  ClipboardPaste,
  Eye,
  Columns2,
  Maximize2,
  Download,
  Hash,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Table,
  Code,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { CHEAT_SHEET, EXAMPLE_MD, getStats, markdownToHTML, ViewLayout, wrapHTMLDocument } from "@/funcs/dev-tools/MarkdownHTMLToolFuncs";
import ToolbarBtn from "@/components/dev-tools/markdown-html/ToolbarBtn";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import CopyButton from "@/components/dev-tools/markdown-html/CopyButton";
import Collapsible from "@/components/dev-tools/markdown-html/Collapsible";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function MarkdownHTMLTool() {
  const t = useTranslations("dev-tools.MarkdownHTMLTool");

  const [markdown, setMarkdown] = useState(EXAMPLE_MD);
  const [layout, setLayout] = useState<ViewLayout>("split");
  const [wrapDoc, setWrapDoc] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const html = useMemo(() => markdownToHTML(markdown), [markdown]);
  const fullDoc = useMemo(() => wrapDoc ? wrapHTMLDocument(html) : html, [html, wrapDoc]);
  const stats = useMemo(() => getStats(markdown, html), [markdown, html]);

  // Insert markdown syntax at cursor
  const insert = useCallback((before: string, after = "", placeholder = "text") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = markdown.slice(start, end) || placeholder;
    const next = markdown.slice(0, start) + before + selected + after + markdown.slice(end);
    setMarkdown(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + before.length + selected.length + after.length;
      el.setSelectionRange(cursor, cursor);
    });
  }, [markdown]);

  // Download HTML file
  const downloadHTML = () => {
    const blob = new Blob([fullDoc], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "document.html";
    a.click();
  };

  const LAYOUTS: { key: ViewLayout; icon: React.ElementType; label: string }[] = [
    { key: "editor", icon: FileCode, label: t("layout.markdown") },
    { key: "split", icon: Columns2, label: t("layout.split") },
    { key: "preview", icon: Eye, label: t("layout.preview") },
    { key: "html", icon: Code2, label: t("layout.html") },
  ];

  const showEditor = layout === "editor" || layout === "split";
  const showPreview = layout === "preview" || layout === "split";
  const showHTML = layout === "html";

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle,#BFDBFE 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute -top-20 -left-20 w-[500px] h-[400px] rounded-full bg-blue-100/50 dark:bg-blue-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-blue-50/60 dark:bg-blue-900/10 blur-[80px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/MarkdownHTMLTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/MarkdownHTMLTool.json" />

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-2 flex-wrap mb-4 p-3 rounded-2xl border border-border bg-card shadow-sm">
          {/* Insert buttons */}
          <div className="flex gap-1.5 flex-wrap">
            <ToolbarBtn icon={Bold} label="Bold" onClick={() => insert("**", "**", "bold text")} />
            <ToolbarBtn icon={Italic} label="Italic" onClick={() => insert("*", "*", "italic text")} />
            <ToolbarBtn icon={Hash} label="H1" onClick={() => insert("# ", "", "Heading")} />
            <ToolbarBtn icon={List} label="List" onClick={() => insert("- ", "", "item")} />
            <ToolbarBtn icon={LinkIcon} label="Link" onClick={() => insert("[", "](url)", "link text")} />
            <ToolbarBtn icon={ImageIcon} label="Image" onClick={() => insert("![", "](url)", "alt text")} />
            <ToolbarBtn icon={Code} label="Code" onClick={() => insert("`", "`", "code")} />
            <ToolbarBtn icon={Minus} label="HR" onClick={() => insert("\n---\n")} />
            <ToolbarBtn icon={Table} label="Table" onClick={() => insert("\n| Col 1 | Col 2 |\n|-------|-------|\n| A     | B     |\n")} />
          </div>

          <div className="flex-1" />

          {/* Layout toggle */}
          <div className="flex gap-1 p-1 rounded-xl border border-border bg-muted/30">
            {LAYOUTS.map(({ key, icon: Icon, label }) => (
              <button key={key} onClick={() => setLayout(key)} title={label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${layout === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Stats strip ── */}
        {markdown && (
          <div className="flex items-center gap-4 flex-wrap mb-4 px-4 py-2.5 rounded-xl border border-border bg-card text-xs text-muted-foreground">
            {[
              { label: t("words"), value: stats.words },
              { label: t("headings"), value: stats.headings },
              { label: t("links"), value: stats.links },
              { label: t("images"), value: stats.images },
              { label: t("tables"), value: stats.tables },
              { label: t("codeBlocks"), value: stats.codeBlocks },
            ].map(({ label, value }) => (
              <span key={label} className={value > 0 ? "text-foreground" : ""}>
                <strong>{value}</strong> {label}
              </span>
            ))}
            <span className="ml-auto text-muted-foreground/60">
              {markdown.length.toLocaleString()} {t("mdChars")} · {html.length.toLocaleString()} {t("htmlChars")}
            </span>
          </div>
        )}

        {/* ── Main editor area ── */}
        <div className={`grid gap-6 ${layout === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>

          {/* Editor pane */}
          {showEditor && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" /> {t("editor")}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.readText().then(setMarkdown).catch(() => { })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 hover:text-blue-500 transition-all">
                    <ClipboardPaste className="w-3.5 h-3.5" /> {t("paste")}
                  </button>
                  <button onClick={() => setMarkdown(EXAMPLE_MD)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-emerald-300 hover:text-emerald-600 transition-all">
                    {t("example")}
                  </button>
                  <button onClick={() => setMarkdown("")} disabled={!markdown}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={markdown}
                onChange={e => setMarkdown(e.target.value)}
                placeholder="Write or paste your Markdown here…"
                className="h-[520px] px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-sm leading-relaxed font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm placeholder:text-muted-foreground/50"
                spellCheck={false}
              />
            </div>
          )}

          {/* Preview pane */}
          {showPreview && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> {t("preview")}
                </span>
              </div>
              <div className="h-[520px] overflow-auto rounded-2xl border border-border bg-white dark:bg-zinc-900 shadow-sm">
                {/* Injected preview styles */}
                <style>{`
                  .md-preview { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 2rem; color: inherit; line-height: 1.7; }
                  .md-preview h1,.md-preview h2,.md-preview h3,.md-preview h4,.md-preview h5,.md-preview h6 { font-weight: 700; margin: 1.25rem 0 0.6rem; }
                  .md-preview h1 { font-size: 1.75rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.4rem; }
                  .md-preview h2 { font-size: 1.35rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
                  .md-preview h3 { font-size: 1.1rem; }
                  .md-preview p  { margin: 0 0 0.875rem; }
                  .md-preview a  { color: #3b82f6; text-decoration: none; }
                  .md-preview a:hover { text-decoration: underline; }
                  .md-preview code { background: #f1f5f9; border-radius: 4px; padding: 0.1rem 0.35rem; font-size: 0.85em; font-family: monospace; }
                  .dark .md-preview code { background: #1e293b; color: #e2e8f0; }
                  .md-preview pre  { background: #1e293b; border-radius: 8px; padding: 1rem; overflow-x: auto; margin: 0 0 1rem; }
                  .md-preview pre code { background: none; padding: 0; color: #e2e8f0; font-size: 0.875rem; }
                  .md-preview blockquote { border-left: 4px solid #3b82f6; margin: 1rem 0; padding: 0.4rem 1rem; background: #eff6ff; border-radius: 0 8px 8px 0; }
                  .dark .md-preview blockquote { background: #1e3a5f; }
                  .md-preview blockquote p { margin: 0; }
                  .md-preview table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
                  .md-preview th,.md-preview td { border: 1px solid #e2e8f0; padding: 0.5rem 0.75rem; }
                  .dark .md-preview th,.dark .md-preview td { border-color: #334155; }
                  .md-preview th { background: #f8fafc; font-weight: 600; }
                  .dark .md-preview th { background: #1e293b; }
                  .md-preview tr:nth-child(even) { background: #f8fafc; }
                  .dark .md-preview tr:nth-child(even) { background: #0f172a; }
                  .md-preview ul,.md-preview ol { padding-left: 1.5rem; margin: 0 0 0.875rem; }
                  .md-preview li { margin-bottom: 0.25rem; }
                  .md-preview hr { border: none; border-top: 2px solid #e2e8f0; margin: 1.5rem 0; }
                  .dark .md-preview hr { border-color: #334155; }
                  .md-preview img { max-width: 100%; border-radius: 8px; }
                  .md-preview mark { background: #fef08a; padding: 0 0.2rem; border-radius: 3px; }
                  .md-preview del  { color: #94a3b8; }
                  .md-preview dl dt { font-weight: 600; margin-top: 0.75rem; }
                  .md-preview dl dd { margin-left: 1.5rem; color: #64748b; }
                `}</style>
                <div
                  className="md-preview"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            </div>
          )}

          {/* HTML output pane */}
          {showHTML && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400" /> {t("htmlOutput")}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Full document toggle */}
                  <button onClick={() => setWrapDoc(p => !p)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${wrapDoc
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                      }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    {t("fullDocument")}
                  </button>
                  <CopyButton text={fullDoc} label="Copy HTML" />
                  <button onClick={downloadHTML}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-emerald-300 hover:text-emerald-600 transition-all">
                    <Download className="w-3.5 h-3.5" /> {t("downloadHtml")}
                  </button>
                </div>
              </div>

              <div className="h-[520px] overflow-auto px-5 py-4 rounded-2xl border border-border bg-muted/20 dark:bg-muted/10 shadow-sm">
                <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap break-all">
                  {fullDoc || <span className="text-muted-foreground/50 italic font-sans">HTML output will appear here</span>}
                </pre>
              </div>

              <CopyButton text={fullDoc} label={wrapDoc ? "Copy Full HTML Document" : "Copy HTML Fragment"} full />
            </div>
          )}
        </div>

        {/* ── Cheat sheet & reference ── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

          <Collapsible title={t("syntaxReference")}>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-3 gap-0 bg-muted/40 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                <span>{t("syntax")}</span><span>{t("output")}</span><span>{t("element")}</span>
              </div>
              <div className="divide-y divide-border max-h-72 overflow-y-auto">
                {CHEAT_SHEET.map(({ syntax, output, icon: Icon }) => (
                  <button key={syntax}
                    onClick={() => {
                      const ex: Record<string, () => void> = {
                        "**bold**": () => insert("**", "**", "bold text"),
                        "*italic*": () => insert("*", "*", "italic text"),
                        "`code`": () => insert("`", "`", "code"),
                        "[text](url)": () => insert("[", "](url)", "link text"),
                        "![alt](url)": () => insert("![", "](url)", "alt text"),
                        "---": () => insert("\n---\n"),
                      };
                      ex[syntax]?.();
                    }}
                    className="grid grid-cols-3 gap-0 px-4 py-2.5 hover:bg-muted/20 transition-colors items-center w-full text-left group"
                  >
                    <code className="text-xs font-mono text-blue-500 dark:text-blue-400 font-bold truncate">{syntax}</code>
                    <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{output}</code>
                    <span className="flex items-center gap-1.5">
                      <LinkIcon className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors capitalize">{output.replace(/<|>/g, "")}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Collapsible>

          <Collapsible title={t("extensions")}>
            <div className="flex flex-col gap-2">
              {[
                { label: "CommonMark", desc: "Standard Markdown spec — headings, paragraphs, lists, code, links, images, blockquotes, HR", supported: true },
                { label: "GFM Tables", desc: "| Col | Col | with alignment :---: ---: ---", supported: true },
                { label: "Strikethrough ~~...~~", desc: "Renders as <del>", supported: true },
                { label: "Highlight ==...==", desc: "Renders as <mark>", supported: true },
                { label: "Auto-links", desc: "https://... becomes a clickable <a> tag", supported: true },
                { label: "Fenced code blocks", desc: "``` with optional language class", supported: true },
                { label: "Setext headings", desc: "Underline with === or ---", supported: true },
                { label: "Definition lists", desc: "dt / dd pairs with : prefix", supported: true },
                { label: "Footnotes", desc: "[^1] syntax not yet supported", supported: false },
                { label: "Math / LaTeX", desc: "$...$  $$...$$ not supported", supported: false },
                { label: "Nested lists", desc: "Deeply nested lists may collapse", supported: false },
              ].map(({ label, desc, supported }) => (
                <div key={label} className="flex items-start gap-3 py-1.5">
                  <span className={`w-4 h-4 shrink-0 rounded-full flex items-center justify-center mt-0.5 ${supported ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground/40"}`}>
                    {supported ? "✓" : "✗"}
                  </span>
                  <div>
                    <p className={`text-xs font-semibold ${supported ? "text-foreground" : "text-muted-foreground/60"}`}>{label}</p>
                    <p className="text-[10px] text-muted-foreground/70 leading-snug">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Collapsible>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/MarkdownHTMLTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/MarkdownHTMLTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/MarkdownHTMLTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}