import { ImageIcon } from "lucide-react";

export default function OGPreview({ title, description, image, url, siteName, type, t }: {
  title: string; description: string; image: string;
  url: string; siteName: string; type: string; t: any;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("preview.openGraph")}</p>
      <div className="rounded-xl border border-border overflow-hidden bg-white dark:bg-slate-900 max-w-sm">
        {/* Image */}
        <div className="w-full h-40 bg-muted/30 flex items-center justify-center">
          {image ? (
            <img src={image} alt="OG" className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
              <ImageIcon className="w-8 h-8" />
              <span className="text-[10px]">1200 × 630 px recommended</span>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="p-3 border-t border-border">
          {(url || siteName) && (
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 truncate">
              {siteName || url}
            </p>
          )}
          <p className="text-sm font-bold text-foreground leading-snug line-clamp-1">
            {title || "Page Title"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
            {description || "Page description will appear here…"}
          </p>
        </div>
      </div>
    </div>
  );
}