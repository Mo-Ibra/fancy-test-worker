import { ExternalLink } from "lucide-react";
import { useT } from "@/context/TranslationProvider";

export default function TestTool() {
  const t = useT("seo-tools/HreflangGeneratorTool.json");

  const TOOLS = [
    { key: "hreflangTest", url: "https://technicalseo.com/tools/hreflang/" },
    { key: "searchConsole", url: "https://search.google.com/search-console" },
    { key: "merkle", url: "https://technicalseo.com/tools/hreflang/" },
  ];

  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("validate.title")}</p>
      {TOOLS.map(({ key, url }) => (
        <a key={key} href={url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-blue-500 hover:underline transition-colors mb-1.5">
          <ExternalLink className="w-3 h-3 shrink-0" /> {t(`validate.${key}`)}
        </a>
      ))}
    </div>
  )
}