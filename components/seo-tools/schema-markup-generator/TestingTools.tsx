import { ArrowRight } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function TestingTools() {
  const t = useT("seo-tools/SchemaMarkupGeneratorTool.json");
  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("testing.title")}</p>
      <div className="flex flex-col gap-2">
        {[
          { label: t("testing.googleTest"), url: t("testing.googleTestUrl"), desc: t("testing.googleTestDesc") || "Official Google validator" },
          { label: t("testing.schemaValidator"), url: t("testing.schemaValidatorUrl"), desc: t("testing.schemaValidatorDesc") || "Check against schema.org spec" },
          { label: t("testing.searchConsole"), url: t("testing.searchConsoleUrl"), desc: t("testing.searchConsoleDesc") || "Monitor rich results in production" },
        ].map(({ label, url, desc }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-background hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</p>
              <p className="text-[10px] text-muted-foreground">{desc}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all rtl:rotate-180" />
          </a>
        ))}
      </div>
    </div>
  )
}