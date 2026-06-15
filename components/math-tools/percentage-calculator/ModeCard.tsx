import { CalcMode } from "@/funcs/math-tools/PercentageCalculatorToolFuncs";

export default function ModeCard({ mode, label, desc, icon: Icon, active, onClick }: {
  mode: CalcMode; label: string; desc: string; icon: React.ElementType;
  active: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick}
      className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 ${active
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
        : "border-border bg-card hover:border-blue-200 dark:hover:border-blue-800/40 hover:bg-muted/20"
        }`}
    >
      <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${active ? "text-blue-500" : "text-muted-foreground"}`} />
      <div className="min-w-0">
        <p className={`text-xs font-bold leading-tight ${active ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{desc}</p>
      </div>
    </button>
  );
}