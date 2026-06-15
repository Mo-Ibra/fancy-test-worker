import { SerpData, Device } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import { ExternalLink, Search } from "lucide-react";
import MobileCard from "./MobileCard";
import DesktopOrganicCard from "./DesktopOrganicCard";
import RichReviewSnippet from "./RichReviewSnippet";
import RichRecipeSnippet from "./RichRecipeSnippet";
import RichProductSnippet from "./RichProductSnippet";
import VideoSnippet from "./VideoSnippet";
import EventSnippet from "./EventSnippet";
import FAQSnippet from "./FAQSnippet";

export default function SerpMockup({ d, device }: { d: SerpData; device: Device }) {
  const isMobile = device === "mobile";
  const bgClass = "bg-white dark:bg-[#202124]";

  return (
    <div className={`rounded-2xl overflow-hidden border border-border shadow-lg ${bgClass} ${isMobile ? "max-w-[390px]" : "w-full"}`}>
      {/* Google Chrome header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#f1f3f4] dark:bg-[#2d2f31] border-b border-[#dadce0] dark:border-[#3c4043]">
        <div className="flex gap-1.5">
          {["#ff5f57", "#febc2e", "#28c840"].map(c => (
            <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1 mx-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#35363a] border border-[#dadce0] dark:border-[#5f6368]">
          <div className="w-3 h-3 rounded-full bg-[#34a853] shrink-0" />
          <span className="text-[11px] text-[#4d5156] dark:text-[#9aa0a6] flex-1 truncate font-mono">
            {d.url || "https://example.com/page"}
          </span>
          <ExternalLink className="w-3 h-3 text-[#70757a] shrink-0" />
        </div>
      </div>

      {/* Google search bar */}
      <div className="px-4 pt-4 pb-3 flex flex-col items-center gap-3">
        <div className="flex items-center">
          <span style={{ color: "#4285f4", fontFamily: "serif" }} className="text-2xl font-black">G</span>
          <span style={{ color: "#ea4335", fontFamily: "serif" }} className="text-2xl font-black">o</span>
          <span style={{ color: "#fbbc05", fontFamily: "serif" }} className="text-2xl font-black">o</span>
          <span style={{ color: "#4285f4", fontFamily: "serif" }} className="text-2xl font-black">g</span>
          <span style={{ color: "#34a853", fontFamily: "serif" }} className="text-2xl font-black">l</span>
          <span style={{ color: "#ea4335", fontFamily: "serif" }} className="text-2xl font-black">e</span>
        </div>
        <div className={`flex items-center gap-3 w-full ${isMobile ? "max-w-full" : "max-w-[584px]"} px-4 py-2.5 rounded-full border border-[#dfe1e5] dark:border-[#5f6368] shadow-sm bg-white dark:bg-[#303134]`}>
          <Search className="w-4 h-4 text-[#9aa0a6]" />
          <span className="text-sm text-[#202124] dark:text-[#e8eaed] flex-1">
            {d.searchQuery || "your search query here"}
          </span>
        </div>
        {/* Nav tabs */}
        <div className={`flex items-center gap-0 w-full ${isMobile ? "" : "max-w-[700px]"} border-b border-[#dadce0] dark:border-[#3c4043]`}>
          {["All", "Images", "News", "Videos", "Maps", "Shopping"].map((tab, i) => (
            <div key={tab} className={`px-3 py-2 text-xs cursor-pointer ${i === 0 ? "border-b-2 border-[#1a73e8] text-[#1a73e8] font-medium" : "text-[#70757a] dark:text-[#9aa0a6] hover:text-[#202124]"}`}>
              {tab}
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="px-4 pb-6 flex flex-col gap-4">
        <p className="text-xs text-[#70757a] dark:text-[#9aa0a6]">About 4,230,000 results (0.42 seconds)</p>

        {/* ── Ad label (mock) ── */}
        {false && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] border border-[#70757a] text-[#70757a] px-1 rounded-sm">Ad</span>
          </div>
        )}

        {/* ── The actual result ── */}
        <div className="flex flex-col gap-2">
          {isMobile
            ? <MobileCard d={d} query={d.searchQuery} />
            : <DesktopOrganicCard d={d} query={d.searchQuery} />}

          {/* Rich result extras (desktop) */}
          {!isMobile && (
            <>
              {(d.resultType === "rich-review" || d.resultType === "rich-product") && (
                <div className="pl-0">
                  {d.resultType === "rich-review" && <RichReviewSnippet d={d} />}
                  {d.resultType === "rich-product" && <RichProductSnippet d={d} />}
                </div>
              )}
              {d.resultType === "rich-recipe" && <RichRecipeSnippet d={d} />}
              {d.resultType === "rich-video" && <VideoSnippet d={d} />}
              {d.resultType === "rich-event" && <EventSnippet d={d} />}
              {d.resultType === "rich-faq" && <FAQSnippet d={d} />}
            </>
          )}
        </div>

        {/* Other fake results for realism */}
        <div className="flex flex-col gap-3 opacity-30 pointer-events-none select-none">
          {[
            { t: "Another result title — example.com", d: "This is another search result that appears below your page in Google's search results…" },
            { t: "Third result in Google search — site.net", d: "The third organic result will appear here, after your optimized page rank above…" },
          ].map((r, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#bdc1c6]" />
                <span className="text-xs text-[#4d5156]">{isMobile ? "other-site.com" : `other-site-${i + 2}.com › page-${i + 2}`}</span>
              </div>
              <span className={`${isMobile ? "text-base" : "text-[20px]"} text-[#1a0dab] dark:text-[#8ab4f8] font-normal`}>{r.t}</span>
              <span className="text-sm text-[#4d5156]">{isMobile ? r.d.slice(0, 80) + "…" : r.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}