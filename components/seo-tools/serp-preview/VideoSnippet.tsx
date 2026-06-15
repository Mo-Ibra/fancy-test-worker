import { parseDisplayUrl, truncate, SerpData } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import { Play } from "lucide-react";

export default function VideoSnippet({ d, isMobile }: { d: SerpData; isMobile?: boolean }) {
  const { path } = parseDisplayUrl(d.url, d.breadcrumb);
  const title = truncate(d.title || "Video Title", isMobile ? 50 : 70);
  const desc = truncate(d.description || "Watch this video to learn more…", 120);
  return (
    <div className={`flex gap-3 ${isMobile ? "flex-col" : ""}`}>
      {/* Thumbnail */}
      <div className={`relative shrink-0 rounded-xl overflow-hidden bg-[#e8eaed] dark:bg-[#3c4043] flex items-center justify-center ${isMobile ? "w-full h-36" : "w-40 h-24"}`}>
        <Play className="w-8 h-8 text-[#5f6368] dark:text-[#9aa0a6]" />
        {d.videoDuration && (
          <span className="absolute bottom-1.5 right-1.5 text-[10px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded-sm">{d.videoDuration}</span>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <a href="#" onClick={e => e.preventDefault()}
          className="text-base font-normal text-[#1a0dab] dark:text-[#8ab4f8] leading-snug hover:underline line-clamp-2">
          {title}
        </a>
        <div className="flex items-center gap-1.5 text-xs text-[#70757a] dark:text-[#9aa0a6]">
          {d.videoDate && <span>{new Date(d.videoDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
          {d.videoDate && <span>·</span>}
          <span>{path || "youtube.com"}</span>
        </div>
        {!isMobile && <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">{desc}</p>}
      </div>
    </div>
  );
}