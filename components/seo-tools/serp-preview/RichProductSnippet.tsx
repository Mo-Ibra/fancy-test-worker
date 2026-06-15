import { SerpData } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import RichReviewSnippet from "./RichReviewSnippet";

export default function RichProductSnippet({ d }: { d: SerpData }) {
  const rating = parseFloat(d.ratingValue) || 0;
  const inStock = d.productAvail === "InStock";
  return (
    <div className="flex flex-col gap-1">
      {d.productPrice && (
        <p className="text-sm text-[#202124] dark:text-[#e8eaed]">
          <span className="font-medium">{d.productCurrency} {d.productPrice}</span>
          <span className={`ml-2 text-xs ${inStock ? "text-[#0d652d] dark:text-[#34a853]" : "text-[#c5221f] dark:text-[#f28b82]"}`}>
            {inStock ? "· In Stock" : "· Out of Stock"}
          </span>
        </p>
      )}
      {rating > 0 && <RichReviewSnippet d={d} />}
    </div>
  );
}