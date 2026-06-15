import { useT } from "@/context/TranslationProvider";
import { Filter, SlidersHorizontal } from "lucide-react";

export default function Options({ minLen, setMinLen, topN, setTopN, excludeStop, setExcludeStop, customIgnore, setCustomIgnore, ignoreList, showIgnoreBox, setShowIgnoreBox }: { minLen: number; setMinLen: (v: number) => void; topN: number; setTopN: (v: number) => void; excludeStop: boolean; setExcludeStop: (v: boolean) => void; customIgnore: string; setCustomIgnore: (v: string) => void; ignoreList: string[]; showIgnoreBox: boolean; setShowIgnoreBox: (v: boolean) => void }) {
  const t = useT("seo-tools/WordFrequencyCounter.json");
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <SlidersHorizontal className="w-3.5 h-3.5" /> {t("common.options")}
      </p>

      {/* Min word length */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-foreground">{t("options.minLength")}</p>
          <span className="text-sm font-black font-mono text-blue-500">{minLen}</span>
        </div>
        <input type="range" min={1} max={10} value={minLen} aria-label={t("options.minLength")}
          onChange={e => setMinLen(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer" />
        <div className="flex justify-between text-[9px] text-muted-foreground/60 mt-0.5">
          <span>1 (all)</span><span>3 (rec)</span><span>10</span>
        </div>
      </div>

      {/* Show top N */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-foreground">{t("options.showTop")}</p>
          <span className="text-sm font-black font-mono text-blue-500">{topN}</span>
        </div>
        <input type="range" min={10} max={200} step={10} value={topN} aria-label={t("options.showTop")}
          onChange={e => setTopN(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none bg-border accent-blue-500 cursor-pointer" />
      </div>

      {/* Exclude stop words */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-foreground">{t("options.excludeStopWords")}</p>
          <p className="text-[10px] text-muted-foreground">{t("common.excludeHint")}</p>
        </div>
        <button onClick={() => setExcludeStop(!excludeStop)}
          className={`relative shrink-0 rounded-full transition-colors ${excludeStop ? "bg-blue-500" : "bg-border"}`}
          style={{ width: 36, height: 20 }}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${excludeStop ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
      </div>

      {/* Custom ignore */}
      <div>
        <button onClick={() => setShowIgnoreBox(!showIgnoreBox)}
          className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 mb-2">
          <Filter className="w-3.5 h-3.5" />
          {showIgnoreBox ? t("common.hideIgnore") : t("common.showIgnore")}
        </button>
        {showIgnoreBox && (
          <div className="flex flex-col gap-1.5">
            <textarea value={customIgnore} onChange={e => setCustomIgnore(e.target.value)}
              placeholder={t("common.ignorePlaceholder")}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs resize-none focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40 font-mono" />
            {ignoreList.length > 0 && (
              <p className="text-[10px] text-blue-500">{t("common.wordCount", { count: ignoreList.length })} {t("common.ignored")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}