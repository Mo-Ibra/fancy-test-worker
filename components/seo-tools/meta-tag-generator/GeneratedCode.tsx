import { Code2, RefreshCw } from "lucide-react";
import CopyButton from "./CopyButton";

export default function GeneratedCode({ generatedCode, resetAll, t }: { generatedCode: string; resetAll: () => void; t: (key: string) => string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 bg-muted/20 border-b border-border">
        <Code2 className="w-4 h-4 text-blue-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("output.htmlCode")}</span>
        <div className="flex gap-2">
          <button onClick={resetAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 text-[10px] font-medium transition-all">
            <RefreshCw className="w-3 h-3" /> {t("output.reset")}
          </button>
          <CopyButton text={generatedCode} label={t("output.copyAll")} />
        </div>
      </div>
      <div className="relative">
        <pre className="p-4 text-[11px] font-mono text-foreground leading-relaxed overflow-x-auto max-h-96 overflow-y-auto bg-slate-950 dark:bg-black/40">
          <code>{generatedCode}</code>
        </pre>
      </div>
    </div>
  )
}