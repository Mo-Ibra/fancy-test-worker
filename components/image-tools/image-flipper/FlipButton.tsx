import { FlipMode } from "@/funcs/image-tools/ImageFlipperToolFuncs";

export default function FlipButton({
  mode, active, onClick, icon: Icon, label, description,
}: {
  mode: FlipMode; active: boolean; onClick: () => void;
  icon: React.ElementType; label: string; description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${active
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
        : "border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/40 dark:hover:bg-blue-900/10"
        }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${active ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500"
        }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-center">
        <p className={`text-xs font-bold ${active ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
    </button>
  );
}