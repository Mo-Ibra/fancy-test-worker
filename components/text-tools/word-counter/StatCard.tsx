export default function StatCard({ icon: Icon, label, value, accent = false }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 p-4 rounded-xl border transition-colors duration-200 ${accent
      ? "border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-900/20"
      : "border-border bg-card"
      }`}>
      <div className="flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${accent ? "text-blue-500" : "text-muted-foreground"}`} />
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <span className={`text-2xl font-bold ${accent ? "text-blue-500" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}