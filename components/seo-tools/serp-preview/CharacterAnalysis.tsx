import { DESC_MAX, DESC_WARN, getBarColor, getCharColor, TITLE_MAX, TITLE_WARN } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";

export default function CharacterAnalysis({ titleLen, descLen }: { titleLen: number; descLen: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {[
        {
          label: "Title",
          len: titleLen, max: TITLE_MAX, warn: TITLE_WARN,
          tip: titleLen === 0 ? "Empty" : titleLen < 30 ? "Too short" : titleLen <= TITLE_WARN ? "Ideal" : titleLen <= TITLE_MAX ? "Near limit" : "Too long",
        },
        {
          label: "Description",
          len: descLen, max: DESC_MAX, warn: DESC_WARN,
          tip: descLen === 0 ? "Empty" : descLen < 70 ? "Too short" : descLen <= DESC_WARN ? "Ideal" : descLen <= DESC_MAX ? "Near limit" : "Too long",
        },
      ].map(({ label, len, max, warn, tip }) => {
        const color = getCharColor(len, warn, max);
        const barCol = getBarColor(len, warn, max);
        const pct = Math.min(100, (len / (max + 20)) * 100);
        return (
          <div key={label} className="p-4 rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-foreground">{label}</p>
              <span className={`text-sm font-black tabular-nums ${color}`}>{len}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-border overflow-hidden mb-1">
              <div className={`h-full rounded-full transition-all ${barCol}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className={`font-bold ${color}`}>{tip}</span>
              <span className="text-muted-foreground">max {max}</span>
            </div>
          </div>
        );
      })}
    </div>
  )
}