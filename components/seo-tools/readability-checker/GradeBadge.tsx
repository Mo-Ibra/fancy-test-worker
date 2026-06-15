export default function GradeBadge({ grade, label }: { grade: number; label: string }) {
  const g = Math.round(grade);
  const color =
    g <= 6 ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40" :
      g <= 10 ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/40" :
        g <= 14 ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40" :
          "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/40";
  return (
    <div className={`flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl border ${color}`}>
      <span className="text-base font-black tabular-nums">{g <= 0 ? "K" : `${g}`}</span>
      <span className="text-[9px] font-bold uppercase tracking-wide opacity-70">{label}</span>
    </div>
  );
}