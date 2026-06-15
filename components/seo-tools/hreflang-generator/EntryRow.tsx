import { buildHreflang, HreflangEntry, LANGUAGES, REGIONS } from "@/funcs/seo-tools/HreflangGeneratorToolFuncs";
import { Globe, X } from "lucide-react";

export default function EntryRow({
  entry, onUpdate, onRemove, showRemove,
}: {
  entry: HreflangEntry;
  onUpdate: (e: HreflangEntry) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  const hreflang = entry.isDefault ? "x-default" : buildHreflang(entry.lang, entry.region);

  return (
    <div className={`flex flex-col gap-2 p-3.5 rounded-2xl border shadow-sm ${entry.isDefault ? "border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-900/10" : "border-border bg-card"
      }`}>
      {/* Top row: lang + region + x-default */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* x-default toggle */}
        <button
          onClick={() => onUpdate({ ...entry, isDefault: !entry.isDefault })}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all shrink-0 ${entry.isDefault
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            : "border-border bg-card text-muted-foreground hover:border-blue-300"
            }`}>
          <Globe className="w-3 h-3" /> x-default
        </button>

        {!entry.isDefault && (
          <>
            {/* Language select */}
            <select value={entry.lang}
              onChange={e => onUpdate({ ...entry, lang: e.target.value })}
              className="flex-1 min-w-0 px-2.5 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all">
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.code} — {l.name}</option>
              ))}
            </select>

            {/* Region select */}
            <select value={entry.region}
              onChange={e => onUpdate({ ...entry, region: e.target.value })}
              className="flex-1 min-w-0 px-2.5 py-2 rounded-xl border border-border bg-card text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all">
              {REGIONS.map(r => (
                <option key={r.code} value={r.code}>{r.code || "—"} {r.name}</option>
              ))}
            </select>
          </>
        )}

        {/* Hreflang preview badge */}
        <span className={`text-[10px] font-black px-2.5 py-1.5 rounded-lg shrink-0 ${entry.isDefault
          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          : "bg-muted/40 text-foreground"
          }`}>
          {hreflang}
        </span>

        {showRemove && (
          <button onClick={onRemove}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* URL row */}
      <input
        value={entry.url}
        onChange={e => onUpdate({ ...entry, url: e.target.value })}
        placeholder={entry.isDefault ? "https://example.com/ (fallback URL)" : `https://example.com/${entry.lang}${entry.region ? `/${entry.region.toLowerCase()}` : ""}/`}
        aria-label="Hreflang URL"
        className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40"
      />
    </div>
  );
}