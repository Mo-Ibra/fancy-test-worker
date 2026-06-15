export default function LinkedInHeadlinePreview({ text }: { text: string }) {
  const display = text.slice(0, 120) + (text.length > 120 ? "…" : "");
  return (
    <div className="p-3 rounded-xl border border-[#e0e0e0] dark:border-[#383838] bg-white dark:bg-[#1b1f23]">
      <div className="flex items-start gap-2.5">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-[#000000e6] dark:text-[#ffffffe6]">Your Name</p>
          <p className="text-xs text-[#00000099] dark:text-[#ffffff99] leading-snug">{display || "Your headline will appear here…"}</p>
          <p className="text-[10px] text-[#00000066] mt-0.5">Location · 500+ connections</p>
        </div>
      </div>
    </div>
  );
}