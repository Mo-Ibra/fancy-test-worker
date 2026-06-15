import { Calendar, Hash, Plus, X } from "lucide-react";
import { ChangeFreq, SitemapUrl } from "@/funcs/seo-tools/SitemapGeneratorToolFuncs";
import Sel from "./Sel";

export default function UrlRow({
  url, index, onChange, onRemove, showImages, t,
}: {
  url: SitemapUrl; index: number;
  onChange: (u: SitemapUrl) => void; onRemove: () => void;
  showImages: boolean; t: any;
}) {
  const set = <K extends keyof SitemapUrl>(k: K, v: SitemapUrl[K]) =>
    onChange({ ...url, [k]: v });

  const FREQS: { v: ChangeFreq; l: string }[] = [
    { v: "always", l: "Always" }, { v: "hourly", l: "Hourly" }, { v: "daily", l: "Daily" },
    { v: "weekly", l: "Weekly" }, { v: "monthly", l: "Monthly" },
    { v: "yearly", l: "Yearly" }, { v: "never", l: "Never" },
  ];

  const PRIOS = ["1.0", "0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1"];

  const priorityColor =
    url.priority === "1.0" ? "text-emerald-500"
      : url.priority >= "0.7" ? "text-blue-500"
        : url.priority >= "0.4" ? "text-amber-500"
          : "text-muted-foreground";

  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start gap-2">
        {/* Row number */}
        <span className="text-[10px] font-bold text-muted-foreground/40 tabular-nums w-5 shrink-0 pt-2.5">
          {index + 1}
        </span>

        {/* URL input */}
        <div className="flex-1 min-w-0">
          <input
            value={url.loc}
            onChange={e => set("loc", e.target.value)}
            placeholder="https://example.com/page"
            aria-label="Page URL"
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40"
          />
        </div>

        <button onClick={onRemove}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all shrink-0 mt-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metadata row */}
      <div className="flex items-center gap-2 flex-wrap pl-7">
        {/* Last modified */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-muted-foreground/50 shrink-0" />
          <input type="date" value={url.lastmod} onChange={e => set("lastmod", e.target.value)} aria-label="Last modified"
            className="px-2 py-1.5 rounded-xl border border-border bg-background text-foreground text-[10px] font-mono focus:outline-none focus:border-blue-400 transition-all w-32" />
        </div>

        {/* Changefreq */}
        <Sel value={url.changefreq} onChange={v => set("changefreq", v as ChangeFreq)}
          options={FREQS} className="text-[10px]" />

        {/* Priority */}
        <div className="flex items-center gap-1.5">
          <Hash className="w-3 h-3 text-muted-foreground/50 shrink-0" />
          <Sel value={url.priority} onChange={v => set("priority", v)}
            options={PRIOS.map(p => ({ v: p, l: p }))} className={`text-[10px] font-mono font-bold ${priorityColor}`} />
        </div>
      </div>

      {/* Image URLs */}
      {showImages && (
        <div className="pl-7 flex flex-col gap-1.5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{t("urls.imageUrls")}</p>
          {url.images.map((img, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={img} onChange={e => {
                const imgs = [...url.images]; imgs[i] = e.target.value; set("images", imgs);
              }}
                placeholder="https://example.com/image.jpg" aria-label="Image URL"
                className="flex-1 px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-[10px] font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
              <button onClick={() => set("images", url.images.filter((_, j) => j !== i))}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:text-red-500 transition-all">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button onClick={() => set("images", [...url.images, ""])}
            className="self-start flex items-center gap-1 px-2 py-1 rounded-lg border border-dashed border-border hover:border-blue-300 hover:text-blue-500 text-[9px] font-bold transition-all text-muted-foreground">
            <Plus className="w-2.5 h-2.5" /> {t("urls.addImage")}
          </button>
        </div>
      )}
    </div>
  );
}