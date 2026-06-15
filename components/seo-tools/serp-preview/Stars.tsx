import { Star } from "lucide-react";

export default function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "xs" }) {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const sz = size === "xs" ? "w-2.5 h-2.5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`${sz} ${i <= filled ? "text-amber-400" : half && i === filled + 1 ? "text-amber-300" : "text-gray-300"}`}>
          <Star className="w-full h-full fill-current" />
        </span>
      ))}
    </div>
  );
}