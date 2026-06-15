import { Color, ColorFormat, getLuminance } from "@/funcs/image-tools/ColorPickerToolFuncs";
import { CheckCheck, Copy } from "lucide-react";
import { useState } from "react";

export default function ColorCard({ color, format, index }: { color: Color; format: ColorFormat; index: number }) {
  const [copied, setCopied] = useState(false);
  const lum = getLuminance(color.r, color.g, color.b);
  const textColor = lum > 128 ? "text-black/70" : "text-white/90";
  const value = format === "hex" ? color.hex : format === "rgb" ? color.rgb : color.hsl;

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      onClick={copy}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] border border-white/10"
      style={{ background: color.hex }}
      title={`Click to copy ${value}`}
    >
      {/* Swatch body */}
      <div className="h-20 sm:h-24 relative">
        {/* Copy feedback */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${copied ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <CheckCheck className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-semibold">Copied!</span>
          </div>
        </div>
        {/* Copy icon on hover */}
        <div className={`absolute top-2 right-2 transition-opacity duration-200 ${copied ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`}>
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-1.5">
            <Copy className="w-3.5 h-3.5 text-white/80" />
          </div>
        </div>
        {/* Index */}
        <span className={`absolute bottom-2 left-2 text-[10px] font-bold opacity-40 ${textColor}`}>#{index + 1}</span>
      </div>

      {/* Info bar */}
      <div className="bg-black/20 backdrop-blur-sm px-3 py-2">
        <p className={`text-xs font-bold font-mono truncate ${textColor}`}>{value}</p>
        <p className={`text-[10px] opacity-50 mt-0.5 ${textColor}`}>
          {format !== "rgb" && `rgb(${color.r},${color.g},${color.b})`}
          {format !== "hex" && format !== "rgb" && " · "}
          {format !== "hex" && color.hex}
        </p>
      </div>
    </div>
  );
}