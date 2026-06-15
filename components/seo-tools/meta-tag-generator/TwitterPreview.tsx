import { ImageIcon } from "lucide-react";

export default function TwitterPreview({ card, title, description, image, site, t }: {
  card: string; title: string; description: string; image: string; site: string; t: any;
}) {
  const isLarge = card === "summary_large_image";
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t("preview.twitterPreview")}</p>
      <div className={`rounded-xl border border-border overflow-hidden bg-white dark:bg-slate-900 max-w-sm ${isLarge ? "" : "flex"}`}>
        {/* Image */}
        {isLarge ? (
          <div className="w-full h-40 bg-muted/30 flex items-center justify-center">
            {image ? (
              <img src={image} alt="Twitter" className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                <ImageIcon className="w-8 h-8" />
                <span className="text-[10px]">summary_large_image</span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-24 h-24 shrink-0 bg-muted/30 flex items-center justify-center">
            {image ? <img src={image} alt="Twitter" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-muted-foreground/30" />}
          </div>
        )}
        {/* Content */}
        <div className="p-3 border-t border-border flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground leading-snug line-clamp-1">
            {title || "Page Title"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
            {description || "Page description…"}
          </p>
          {site && <p className="text-[10px] text-muted-foreground/50 mt-1">{site}</p>}
        </div>
      </div>
    </div>
  );
}