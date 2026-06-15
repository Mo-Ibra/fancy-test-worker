import { Code2 } from "lucide-react";
import CopyButton from "./CopyButton";
import { useT } from "@/context/TranslationProvider";

export default function JSONOnly({ jsonStr }: { jsonStr: string }) {
  const t = useT("seo-tools/SchemaMarkupGeneratorTool.json");
  return (
    <div className="flex flex-col gap-0 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border">
        <Code2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-bold uppercase tracking-wider text-foreground flex-1">{t("output.jsonOnly")}</span>
        <CopyButton text={jsonStr} />
      </div>
      <pre dir="ltr" className="p-4 text-[11px] font-mono leading-relaxed overflow-x-auto bg-slate-900 dark:bg-black/30 max-h-80 overflow-y-auto text-left">
        <code className="text-slate-200">{jsonStr}</code>
      </pre>
    </div>
  )
}