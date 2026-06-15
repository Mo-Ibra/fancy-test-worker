import { Color, getLuminance, rgbToHex, rgbToHsl } from "@/funcs/image-tools/ColorPickerToolFuncs";
import { Pipette } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function EyedropperCanvas({
  src,
  onPick,
}: {
  src: string;
  onPick: (color: Color) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number; color: Color | null }>({ x: 0, y: 0, color: null });
  const [magnifier, setMagnifier] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
    };
    img.src = src;
  }, [src]);

  const getColorAt = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = Math.floor((e.clientX - rect.left) * scaleX);
    const py = Math.floor((e.clientY - rect.top) * scaleY);
    const [r, g, b] = canvas.getContext("2d")!.getImageData(px, py, 1, 1).data;
    return { r, g, b, hex: rgbToHex(r, g, b), rgb: `rgb(${r},${g},${b})`, hsl: rgbToHsl(r, g, b), count: 1 };
  };

  return (
    <div className="relative group">
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl border border-border cursor-crosshair object-contain max-h-[420px]"
        style={{ imageRendering: "pixelated" }}
        onMouseMove={(e) => {
          const color = getColorAt(e);
          if (color) setCursor({ x: e.clientX, y: e.clientY, color });
        }}
        onMouseEnter={() => setMagnifier(true)}
        onMouseLeave={() => { setMagnifier(false); setCursor((c) => ({ ...c, color: null })); }}
        onClick={(e) => { const color = getColorAt(e); if (color) onPick(color); }}
      />
      {/* Cursor tooltip */}
      {magnifier && cursor.color && (
        <div
          className="fixed z-50 pointer-events-none flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20 shadow-xl backdrop-blur-sm text-white text-xs font-mono"
          style={{
            left: cursor.x + 16,
            top: cursor.y - 40,
            background: cursor.color.hex,
            color: getLuminance(cursor.color.r, cursor.color.g, cursor.color.b) > 128 ? "#000" : "#fff",
          }}
        >
          <div className="w-3 h-3 rounded-full border border-white/30" style={{ background: cursor.color.hex }} />
          {cursor.color.hex}
        </div>
      )}
      {/* Hint */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <Pipette className="w-3.5 h-3.5 text-white" />
        <span className="text-white text-xs font-medium">Click to pick a color</span>
      </div>
    </div>
  );
}