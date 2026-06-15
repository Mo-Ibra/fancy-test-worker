export default function InstagramPreview({ text }: { text: string }) {
  const preview = text.slice(0, 125) + (text.length > 125 ? "… more" : "");
  return (
    <div className="p-3 rounded-xl border border-[#dbdbdb] dark:border-[#363636] bg-white dark:bg-black">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 via-pink-500 to-purple-600 shrink-0" />
        <p className="text-xs font-semibold text-[#000000] dark:text-white">yourhandle</p>
      </div>
      <div className="w-full h-36 bg-linear-to-br from-muted/40 to-muted/20 rounded-lg mb-2 flex items-center justify-center">
        <span className="text-muted-foreground/30 text-xs">Your photo</span>
      </div>
      <p className="text-xs text-[#000000] dark:text-white leading-relaxed">
        <span className="font-semibold">yourhandle</span>{" "}
        {preview || <span className="text-[#8e8e8e]">Your caption will appear here…</span>}
      </p>
    </div>
  );
}