import { ExternalLink } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function TestingResources() {
  const t = useT("seo-tools/CanonicalTagGeneratorTool.json");
  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <ExternalLink className="w-3.5 h-3.5 text-blue-400" /> {t("testing.title")}
      </p>
      <div className="flex flex-col gap-2">
        {[
          { label: t("testing.searchConsole"), url: "https://search.google.com/search-console" },
          { label: t("testing.hreflangTest"), url: "https://technicalseo.com/tools/hreflang/" },
          { label: t("testing.richResults"), url: "https://search.google.com/test/rich-results" },
        ].map(({ label, url }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 hover:underline transition-colors">
            <ExternalLink className="w-3 h-3 shrink-0" /> {label}
          </a>
        ))}
      </div>
    </div>
  )
}