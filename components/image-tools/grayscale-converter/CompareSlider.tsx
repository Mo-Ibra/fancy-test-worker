import { ZoomIn } from "lucide-react";
import { useRef, useState } from "react";

export default function CompareSlider({ original, result }: { original: string; result: string }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-xl overflow-hidden border border-border select-none cursor-col-resize"
      onMouseDown={() => setDragging(true)}
      onMouseMove={(e) => dragging && updatePos(e.clientX)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={(e) => updatePos(e.touches[0].clientX)}
      style={{ backgroundImage: "linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%)", backgroundSize: "12px 12px", backgroundPosition: "0 0,0 6px,6px -6px,-6px 0" }}
    >
      {/* Original (right side) */}
      <img src={original} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
      {/* Result (left side, clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={result} alt="Grayscale" className="absolute inset-0 h-full object-contain"
          style={{ width: `${10000 / pos}%`, maxWidth: "none" }}
        />
      </div>
      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-col-resize">
          <ZoomIn className="w-4 h-4 text-slate-600" />
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-2 left-3 text-[10px] font-bold bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">Grayscale</span>
      <span className="absolute top-2 right-3 text-[10px] font-bold bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm pointer-events-none">Original</span>
    </div>
  );
}