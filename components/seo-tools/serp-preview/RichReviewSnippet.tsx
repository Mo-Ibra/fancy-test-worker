import { SerpData } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import Stars from "./Stars";

export default function RichReviewSnippet({ d, isMobile }: { d: SerpData; isMobile?: boolean }) {
  const rating = parseFloat(d.ratingValue) || 4.5;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Stars rating={rating} size={isMobile ? "xs" : "sm"} />
      <span className={`${isMobile ? "text-[11px]" : "text-sm"} text-[#70757a] dark:text-[#9aa0a6]`}>
        {rating} · {parseInt(d.ratingCount) > 0 ? `${parseInt(d.ratingCount).toLocaleString()} reviews` : "reviews"}
      </span>
    </div>
  );
}