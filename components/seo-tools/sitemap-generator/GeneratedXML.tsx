import { Code2, Download } from "lucide-react";
import CopyButton from "./CopyButton";

export default function GeneratedXML({ xml, viewMode, download, t }: { xml: string; viewMode: string; download: () => void; t: any }) {
  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
        <Code2 className="w-4 h-4 text-blue-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">
          {viewMode === "url-list" ? "sitemap.xml" : "sitemap-index.xml"}
        </span>
        <div className="flex gap-2">
          <CopyButton text={xml} />
          <button onClick={download} disabled={!xml}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 disabled:opacity-40 text-xs font-medium transition-all">
            <Download className="w-3.5 h-3.5" /> {t("output.download")}
          </button>
        </div>
      </div>
      <pre className="p-4 text-[10px] font-mono text-foreground leading-relaxed overflow-x-auto bg-slate-950 dark:bg-black/40 max-h-[450px] overflow-y-auto whitespace-pre-wrap">
        <code className="text-slate-300">{xml || "<!-- Add URLs to generate sitemap -->"}</code>
      </pre>
    </div>
  )
}