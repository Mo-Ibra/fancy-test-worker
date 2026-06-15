import { getCharColor } from "@/funcs/seo-tools/MetaTagGeneratorToolFuncs";
import { Globe } from "lucide-react";

export default function SerpPreview({ title, description, url, t }: { title: string; description: string; url: string; t: any }) {
  const displayTitle = title || "Page Title";
  const displayDesc = description || "Page description will appear here…";
  const displayUrl = url || "https://example.com";

  const titleLen = title.length;
  const descLen = description.length;

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-card">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{t("preview.google")}</p>
      {/* Google result card */}
      <div className="flex flex-col gap-0.5 p-3 rounded-lg border border-border bg-white dark:bg-slate-900">
        {/* URL */}
        <div className="flex items-center gap-1 text-[11px] text-green-700 dark:text-green-500 font-medium truncate">
          <Globe className="w-3 h-3 shrink-0" />
          <span className="truncate">{displayUrl}</span>
        </div>
        {/* Title */}
        <p className={`text-base font-medium text-blue-700 dark:text-blue-400 leading-snug truncate ${titleLen > 60 ? "opacity-70" : ""
          }`}>
          {displayTitle.slice(0, 70)}{displayTitle.length > 70 ? "…" : ""}
        </p>
        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
          {displayDesc.slice(0, 160)}{displayDesc.length > 160 ? "…" : ""}
        </p>
      </div>
      {/* Character feedback */}
      <div className="flex gap-4 text-[10px] flex-wrap">
        <span className={getCharColor(titleLen, 50, 60, 70)}>
          Title: {titleLen}/60 {titleLen < 50 ? "↑ too short" : titleLen > 60 ? "↑ too long" : "✓ ideal"}
        </span>
        <span className={getCharColor(descLen, 150, 160, 180)}>
          Desc: {descLen}/160 {descLen < 150 ? "↑ too short" : descLen > 160 ? "↑ too long" : "✓ ideal"}
        </span>
      </div>
    </div>
  );
}