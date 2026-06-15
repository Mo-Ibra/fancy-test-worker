export default function WrapperBtn({ active, onClick, label, preview }: {
  active: boolean; onClick: () => void; label: string; preview: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-1 p-3 rounded-xl border text-left transition-all duration-200 ${active
        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
        : "border-border bg-card hover:border-blue-300 dark:hover:border-blue-700"
        }`}
    >
      <span className={`text-xs font-bold ${active ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}>{label}</span>
      <code className="text-[10px] text-muted-foreground font-mono truncate">{preview}</code>
    </button>
  );
}