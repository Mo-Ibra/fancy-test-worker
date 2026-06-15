export default function DensityBadge({ density, isStop }: { density: number; isStop: boolean }) {
  const d = density;
  let color: string;
  let label: string;

  if (isStop) {
    color = "bg-muted/40 text-muted-foreground";
    label = d.toFixed(2) + "%";
  } else if (d < 0.5) {
    color = "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
    label = d.toFixed(2) + "%";
  } else if (d <= 2.5) {
    color = "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400";
    label = d.toFixed(2) + "%";
  } else if (d <= 4) {
    color = "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400";
    label = d.toFixed(2) + "% ⚠";
  } else {
    color = "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    label = d.toFixed(2) + "% ✗";
  }

  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
  );
}