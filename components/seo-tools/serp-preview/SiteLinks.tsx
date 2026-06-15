import { SerpData } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";

export default function SiteLinks({ data, set, t }: { data: SerpData; set: (k: keyof SerpData, v: SerpData[keyof SerpData]) => void; t: any }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("sitelinks.title")}</p>
        <button onClick={() => set("showSitelinks", !data.showSitelinks)}
          className={`relative shrink-0 rounded-full transition-colors ${data.showSitelinks ? "bg-blue-500" : "bg-border"}`} style={{ width: 36, height: 20 }}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.showSitelinks ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
      </div>
      {data.showSitelinks && (
        <div className="flex flex-col gap-1.5">
          {data.sitelinks.map((sl, i) => (
            <div key={i} className="flex gap-2">
              <input value={sl.label} onChange={e => set("sitelinks", data.sitelinks.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                placeholder="Label" aria-label="Sitelink label"
                className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
              <input value={sl.url} onChange={e => set("sitelinks", data.sitelinks.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                placeholder="/path" aria-label="Sitelink URL"
                className="flex-1 px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}