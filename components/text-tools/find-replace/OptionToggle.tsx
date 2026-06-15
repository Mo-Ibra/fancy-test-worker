export default function OptionToggle({ active, onClick, icon: Icon, label, title }: {
  active: boolean; onClick: () => void; icon: React.ElementType; label: string; title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${active
        ? "bg-blue-500 border-blue-500 text-white shadow-sm"
        : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-blue-300 dark:hover:border-blue-700"
        }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}