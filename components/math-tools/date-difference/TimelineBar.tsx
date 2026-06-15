export default function TimelineBar({ pct }: { pct: number }) {
  return (
    <div className="relative w-full h-3 rounded-full bg-border overflow-hidden">
      <div className="absolute inset-y-0 inset-s-0 bg-linear-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}