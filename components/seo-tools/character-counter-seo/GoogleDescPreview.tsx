export default function GoogleDescPreview({ text }: { text: string }) {
  const display = text.slice(0, 160) + (text.length > 160 ? "…" : "");
  return (
    <div className="flex flex-col gap-0.5 p-3 rounded-xl border border-border bg-white dark:bg-slate-900">
      <p className="text-[10px] text-green-700 dark:text-green-500">example.com</p>
      <p className="text-base font-normal text-[#1a0dab] dark:text-[#8ab4f8]">Example Page Title</p>
      <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
        {display || "Your meta description will appear here in search results…"}
      </p>
    </div>
  );
}