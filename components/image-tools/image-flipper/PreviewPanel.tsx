import { fmtSize } from "@/funcs/image-tools/ImageFlipperToolFuncs";

export default function PreviewPanel({
  label, src, width, height, sizeKb, badge,
}: {
  label: string; src: string; width: number; height: number; sizeKb: number; badge?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              {badge}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground/60">{width}×{height} · {fmtSize(sizeKb)}</span>
        </div>
      </div>
      <div
        className="relative aspect-video rounded-xl border border-border overflow-hidden flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
          backgroundSize: "12px 12px",
          backgroundPosition: "0 0,0 6px,6px -6px,-6px 0",
        }}
      >
        <div className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)",
            backgroundSize: "12px 12px",
          }}
        />
        <img
          src={src}
          alt={label}
          className="relative max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
}