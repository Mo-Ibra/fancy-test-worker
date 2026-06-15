export default function GoogleTitlePreview({ text }: { text: string }) {
  const display = text.slice(0, 60) + (text.length > 60 ? "…" : "");
  return (
    <div className="flex flex-col gap-0.5 p-3 rounded-xl border border-border bg-white dark:bg-slate-900">
      <p className="text-[10px] text-green-700 dark:text-green-500 font-medium">example.com › your-page</p>
      <p className="text-base font-normal text-[#1a0dab] dark:text-[#8ab4f8] leading-snug hover:underline cursor-pointer line-clamp-2">
        {display || "Your SEO title will appear here…"}
      </p>
    </div>
  );
}