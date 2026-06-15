import { parseDisplayUrl, SerpData, truncate } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import HighlightText from "./HighlightText";
import RichReviewSnippet from "./RichReviewSnippet";
import RichRecipeSnippet from "./RichRecipeSnippet";
import RichProductSnippet from "./RichProductSnippet";
import VideoSnippet from "./VideoSnippet";
import EventSnippet from "./EventSnippet";
import FAQSnippet from "./FAQSnippet";

export default function MobileCard({ d, query }: { d: SerpData; query: string }) {
  const { path } = parseDisplayUrl(d.url, d.breadcrumb);
  const title = truncate(d.title || "Page Title", 50);
  const desc = truncate(d.description || "Your description will appear here. Keep it under 120 characters for mobile.", 120);
  const host = d.url ? (() => { try { return new URL(d.url.startsWith("http") ? d.url : `https://${d.url}`).hostname; } catch { return d.url; } })() : "example.com";

  return (
    <div className="flex flex-col gap-1 max-w-[360px]">
      <div className="flex items-center gap-2">
        {d.faviconUrl ? (
          <img src={d.faviconUrl} alt="" className="w-4 h-4 rounded-sm object-cover shrink-0"
            onError={e => (e.currentTarget.style.display = "none")} />
        ) : (
          <div className="w-4 h-4 rounded-sm bg-[#bdc1c6] shrink-0" />
        )}
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-[#202124] dark:text-[#bdc1c6]">{host}</span>
          <span className="text-[10px] text-[#4d5156] dark:text-[#9aa0a6] truncate max-w-[280px]">{path || "example.com"}</span>
        </div>
      </div>
      <a href="#" onClick={e => e.preventDefault()}
        className="text-base font-normal text-[#1a0dab] dark:text-[#8ab4f8] leading-snug hover:underline line-clamp-3">
        <HighlightText text={title} query={query} />
      </a>
      <p className="text-[13px] text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-3">
        <HighlightText text={desc} query={query} />
      </p>
      {/* Rich snippets for mobile */}
      {d.resultType === "rich-review" && <RichReviewSnippet d={d} isMobile />}
      {d.resultType === "rich-recipe" && <RichRecipeSnippet d={d} />}
      {d.resultType === "rich-product" && <RichProductSnippet d={d} />}
      {d.resultType === "rich-video" && <VideoSnippet d={d} isMobile />}
      {d.resultType === "rich-event" && <EventSnippet d={d} />}
      {d.resultType === "rich-faq" && <FAQSnippet d={d} />}
    </div>
  );
}