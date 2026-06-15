import { SerpData, truncate } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import { MapPin } from "lucide-react";

export default function EventSnippet({ d }: { d: SerpData }) {
  return (
    <div className="flex items-start gap-3 p-3 border border-[#dadce0] dark:border-[#3c4043] rounded-lg">
      <div className="w-10 h-10 rounded-lg bg-[#1a73e8] flex flex-col items-center justify-center shrink-0">
        <span className="text-[8px] font-bold text-white uppercase">
          {d.eventDate ? new Date(d.eventDate).toLocaleDateString("en-US", { month: "short" }) : "JAN"}
        </span>
        <span className="text-base font-black text-white leading-none">
          {d.eventDate ? new Date(d.eventDate).getDate() : "1"}
        </span>
      </div>
      <div>
        <a href="#" onClick={e => e.preventDefault()}
          className="text-sm font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline line-clamp-1">
          {truncate(d.title || "Event Name", 60)}
        </a>
        {d.eventDate && (
          <p className="text-xs text-[#70757a] dark:text-[#9aa0a6]">
            {new Date(d.eventDate).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
          </p>
        )}
        {d.eventLocation && (
          <p className="text-xs text-[#70757a] dark:text-[#9aa0a6] flex items-center gap-1">
            <MapPin className="w-3 h-3" />{d.eventLocation}
          </p>
        )}
      </div>
    </div>
  );
}