import { SerpData, truncate } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQSnippet({ d }: { d: SerpData }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const items = d.faqItems.filter(q => q.q);
  return (
    <div className="flex flex-col gap-0 border border-[#dadce0] dark:border-[#3c4043] rounded-lg overflow-hidden">
      {items.slice(0, 4).map((item, i) => (
        <div key={i} className={`border-b border-[#dadce0] dark:border-[#3c4043] last:border-0 ${openIdx === i ? "bg-[#f8f9fa] dark:bg-[#303134]" : ""}`}>
          <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#f8f9fa] dark:hover:bg-[#303134] transition-colors">
            <span className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">{item.q}</span>
            <ChevronDown className={`w-4 h-4 text-[#70757a] shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
          </button>
          {openIdx === i && item.a && (
            <div className="px-4 pb-3">
              <p className="text-sm text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed">{truncate(item.a, 200)}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}