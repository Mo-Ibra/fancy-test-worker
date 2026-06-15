import { ZoomIn } from "lucide-react";
import { useState } from "react";

export default function CompareSlider({ original, result }: { original: string; result: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border select-none cursor-col-resize bg-muted/30"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
      }}
    >
      {/* Checkerboard */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "linear-gradient(45deg,#aaa 25%,transparent 25%),linear-gradient(-45deg,#aaa 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#aaa 75%),linear-gradient(-45deg,transparent 75%,#aaa 75%)", backgroundSize: "10px 10px", backgroundPosition: "0 0,0 5px,5px -5px,-5px 0" }}
      />
      {/* Original (full) */}
      <img src={original} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
      {/* Result (clipped left) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={result} alt="Compressed" className="absolute inset-0 w-full h-full object-contain" style={{ width: `${10000 / pos}%`, maxWidth: "none" }} />
      </div>
      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg shadow-black/40" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white shadow-lg flex items-center justify-center">
          <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
        </div>
      </div>
      {/* Labels */}
      <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/50 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">Original</span>
      <span className="absolute top-2 right-2 text-[10px] font-bold bg-blue-500/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">Compressed</span>
    </div>
  );
}