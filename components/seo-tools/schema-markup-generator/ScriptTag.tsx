import { Code2, Download } from "lucide-react";
import CopyButton from "./CopyButton";
import { useT } from "@/context/TranslationProvider";

export default function ScriptTag({ scriptTag, download }: { scriptTag: string; download: () => void }) {
  const t = useT("seo-tools/SchemaMarkupGeneratorTool.json");
  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
        <Code2 className="w-4 h-4 text-blue-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("output.scriptTag")}</span>
        <div className="flex gap-2">
          <CopyButton text={scriptTag} />
          <button onClick={download}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
            <Download className="w-3.5 h-3.5" /> {t("output.download")}
          </button>
        </div>
      </div>
      <pre dir="ltr" className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-950 dark:bg-black/40 max-h-[500px] overflow-y-auto text-left">
        <code className="text-slate-300">{scriptTag}</code>
      </pre>
    </div>
  )
}