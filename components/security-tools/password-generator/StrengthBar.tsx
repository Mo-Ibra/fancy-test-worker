export default function StrengthBar({ score, bgColor }: { score: number; bgColor: string }) {
  return (
    <div className="flex gap-1" >
      {
        [0, 1, 2, 3, 4].map(i => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= score ? bgColor : "bg-border"}`} />
        ))
      }
    </div>
  );
}