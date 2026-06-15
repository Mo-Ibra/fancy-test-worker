export default function EmailSubjectPreview({ text, device }: { text: string; device: "desktop" | "mobile" }) {
  const maxDisplay = device === "mobile" ? 40 : 60;
  const display = text.slice(0, maxDisplay) + (text.length > maxDisplay ? "…" : "");

  return (
    <div className={`p-3 rounded-xl border border-border ${device === "mobile" ? "bg-[#f9fafb] dark:bg-[#1f2937] max-w-[280px]" : "bg-white dark:bg-[#1a1a2e]"}`}>
      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{device === "mobile" ? "📱 Mobile inbox" : "🖥️ Desktop inbox"}</p>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
          <span className="text-[9px] font-black text-white">S</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className="text-xs font-bold text-foreground">Sender Name</p>
            <p className="text-[9px] text-muted-foreground shrink-0">12:34 PM</p>
          </div>
          <p className="text-xs font-medium text-foreground truncate">{display || "Your subject line…"}</p>
          <p className="text-[10px] text-muted-foreground truncate">Preview text would appear here after the subject…</p>
        </div>
      </div>
    </div>
  );
}