import { Color, getLuminance } from "@/funcs/image-tools/ColorPickerToolFuncs";
import { Copy } from "lucide-react";

export default function ColorDetail({ color }: { color: Color }) {
  const lum = getLuminance(color.r, color.g, color.b);
  const textColor = lum > 128 ? "#000" : "#fff";

  const formats = [
    { label: "HEX", value: color.hex },
    { label: "RGB", value: color.rgb },
    { label: "HSL", value: color.hsl },
    { label: "R", value: String(color.r) },
    { label: "G", value: String(color.g) },
    { label: "B", value: String(color.b) },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Big swatch */}
      <div className="h-28 w-full relative" style={{ background: color.hex }}>
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <span className="text-sm font-bold font-mono" style={{ color: textColor, opacity: 0.9 }}>{color.hex}</span>
        </div>
      </div>
      {/* Values */}
      <div className="p-4 grid grid-cols-2 gap-2">
        {formats.map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/40 dark:bg-muted/20 group hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground w-7">{label}</span>
            <span className="text-xs font-mono text-foreground flex-1 px-2 truncate">{value}</span>
            <button
              onClick={() => navigator.clipboard.writeText(value)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy className="w-3 h-3 text-muted-foreground hover:text-blue-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}