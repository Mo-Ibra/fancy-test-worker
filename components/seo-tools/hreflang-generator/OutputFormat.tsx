import type { OutputFormatType } from "@/funcs/seo-tools/HreflangGeneratorToolFuncs";
import { Code2, FileText, Zap } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function OutputFormat({ outputFmt, setOutputFmt }: { outputFmt: OutputFormatType; setOutputFmt: (outputFmt: OutputFormatType) => void }) {
  const t = useT("seo-tools/HreflangGeneratorTool.json");
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("outputFormat.title")}</p>
      <div className="flex flex-col gap-1.5">
        {([
          { k: "html" as OutputFormatType, icon: Code2, label: t("outputFormat.html"), sub: t("outputFormat.htmlSub") },
          { k: "xml-sitemap" as OutputFormatType, icon: FileText, label: t("outputFormat.xml"), sub: t("outputFormat.xmlSub") },
          { k: "http-header" as OutputFormatType, icon: Zap, label: t("outputFormat.http"), sub: t("outputFormat.httpSub") },
        ] as { k: OutputFormatType; icon: React.ElementType; label: string; sub: string }[]).map(({ k, icon: Icon, label, sub }) => (
          <button key={k} onClick={() => setOutputFmt(k)}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${outputFmt === k
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
              : "border-border bg-card hover:border-blue-200"
              }`}>
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${outputFmt === k ? "text-blue-500" : "text-muted-foreground"}`} />
            <div>
              <p className={`text-xs font-bold ${outputFmt === k ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}