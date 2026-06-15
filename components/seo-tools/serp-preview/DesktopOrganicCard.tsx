import { parseDisplayUrl, truncate, TITLE_MAX, DESC_MAX, SerpData } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import HighlightText from "./HighlightText";

export default function DesktopOrganicCard({ d, query }: { d: SerpData; query: string }) {
  const { path } = parseDisplayUrl(d.url, d.breadcrumb);
  const title = truncate(d.title || "Page Title", TITLE_MAX);
  const desc = truncate(d.description || "Your meta description will appear here. Make it compelling and around 155 characters for best results in Google search.", DESC_MAX);
  const host = d.url ? (() => { try { return new URL(d.url.startsWith("http") ? d.url : `https://${d.url}`).hostname; } catch { return d.url; } })() : "example.com";
  const dateStr = d.showDate && d.publishDate ? `${new Date(d.publishDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — ` : "";

  return (
    <div className="flex flex-col gap-1 max-w-[600px]">
      {/* URL row */}
      <div className="flex items-center gap-2">
        {d.faviconUrl ? (
          <img src={d.faviconUrl} alt="" className="w-4 h-4 rounded-sm object-cover shrink-0"
            onError={e => (e.currentTarget.style.display = "none")} />
        ) : (
          <div className="w-4 h-4 rounded-sm bg-[#bdc1c6] shrink-0" />
        )}
        <div className="flex flex-col leading-none">
          <span className="text-[13px] text-[#202124] dark:text-[#bdc1c6]">{host}</span>
          <span className="text-xs text-[#4d5156] dark:text-[#9aa0a6] truncate max-w-[500px]">{path || "example.com › page"}</span>
        </div>
      </div>

      {/* Title */}
      <a href="#" onClick={e => e.preventDefault()}
        className="text-[20px] font-normal text-[#1a0dab] dark:text-[#8ab4f8] leading-[1.3] hover:underline cursor-pointer line-clamp-2">
        <HighlightText text={title} query={query} />
      </a>

      {/* Description */}
      <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-[1.57] line-clamp-2">
        <span className="text-[#70757a] dark:text-[#9aa0a6]">{dateStr}</span>
        <HighlightText text={desc} query={query} />
      </p>

      {/* Sitelinks */}
      {d.showSitelinks && d.sitelinks.filter(s => s.label).length > 0 && (
        <div className="flex gap-1 flex-wrap mt-0.5">
          {d.sitelinks.filter(s => s.label).slice(0, 6).map((sl, i) => (
            <a key={i} href="#" onClick={e => e.preventDefault()}
              className="text-xs text-[#1a0dab] dark:text-[#8ab4f8] border border-[#dadce0] dark:border-[#3c4043] rounded px-2 py-1 hover:bg-[#f8f9fa] dark:hover:bg-[#303134] hover:underline cursor-pointer whitespace-nowrap">
              {sl.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}