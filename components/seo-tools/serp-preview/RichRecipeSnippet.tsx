import { SerpData } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import { Clock, Sparkles } from "lucide-react";

export default function RichRecipeSnippet({ d }: { d: SerpData }) {
  return (
    <div className="flex items-center gap-3 flex-wrap text-sm text-[#70757a] dark:text-[#9aa0a6]">
      {d.cookTime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{d.cookTime}</span>}
      {d.calories && <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />{d.calories}</span>}
      {d.recipeYield && <span>{d.recipeYield}</span>}
    </div>
  );
}