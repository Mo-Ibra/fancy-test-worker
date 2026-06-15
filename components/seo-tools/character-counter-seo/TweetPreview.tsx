export default function TweetPreview({ text }: { text: string }) {
  const remaining = 280 - text.length;
  const pct = (text.length / 280) * 100;
  const circColor = text.length > 280 ? "#ef4444" : text.length > 252 ? "#f59e0b" : "#1da1f2";
  const r = 14, circ = 2 * Math.PI * r;
  return (
    <div className="p-3 rounded-xl border border-[#cfd9de] dark:border-[#2f3336] bg-white dark:bg-[#15202b]">
      <div className="flex items-start gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-400 shrink-0" />
        <div>
          <p className="text-sm font-bold text-foreground">Your Name</p>
          <p className="text-[11px] text-[#536471] dark:text-[#71767b]">@yourhandle</p>
        </div>
      </div>
      <p className="text-sm text-[#0f1419] dark:text-[#e7e9ea] leading-relaxed whitespace-pre-wrap">
        {text || <span className="text-[#536471]">Compose your tweet…</span>}
      </p>
      <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-[#eff3f4] dark:border-[#2f3336]">
        <svg className="w-8 h-8 -rotate-90 shrink-0" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r={r} fill="none" stroke="#e1e8ed" strokeWidth="2" />
          <circle cx="18" cy="18" r={r} fill="none" stroke={circColor} strokeWidth="2"
            strokeDasharray={`${circ * Math.min(1, pct / 100)} ${circ}`} strokeLinecap="round" />
        </svg>
        <span className={`text-xs font-bold ${remaining < 0 ? "text-red-500" : remaining < 28 ? "text-amber-500" : "text-[#536471] dark:text-[#71767b]"}`}>
          {remaining < 0 ? remaining : remaining}
        </span>
      </div>
    </div>
  );
}