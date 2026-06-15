import { SlidersHorizontal } from "lucide-react";
import Toggle from "./Toggle";
import { useT } from "@/context/TranslationProvider";

export default function Options({ opts, setOpt }: { opts: any; setOpt: any }) {
  const t = useT("seo-tools/URLSlugGeneratorTool.json");
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <SlidersHorizontal className="w-3.5 h-3.5" /> Options
      </p>
      {([
        { k: "lowercase" as const, label: t("options.lowercase"), sub: t("options.lowercaseSub") },
        { k: "removeStopWords" as const, label: t("options.removeStopWords"), sub: t("options.removeStopWordsSub") },
        { k: "trim" as const, label: t("options.trimSeparators"), sub: t("options.trimSeparatorsSub") },
      ]).map(({ k, label, sub }) => (
        <div key={k} className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-foreground">{label}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
          <Toggle checked={opts[k] as boolean} onChange={() => setOpt(k, !opts[k])} />
        </div>
      ))}

      {/* Max length */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-xs font-medium text-foreground">{t("options.maxLength")}</p>
            <p className="text-[10px] text-muted-foreground">{t("options.maxLengthSub")}</p>
          </div>
          <Toggle checked={opts.maxLength !== null} onChange={() => setOpt("maxLength", opts.maxLength !== null ? null : 60)} />
        </div>
        {opts.maxLength !== null && (
          <div className="flex items-center gap-2 mt-2">
            <input type="range" min={20} max={150} value={opts.maxLength}
              onChange={e => setOpt("maxLength", Number(e.target.value))} aria-label={t("options.maxLength")}
              className="flex-1 h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer" />
            <span className="text-sm font-bold font-mono text-blue-500 w-8 text-right">{opts.maxLength}</span>
          </div>
        )}
      </div>
    </div>
  )
}