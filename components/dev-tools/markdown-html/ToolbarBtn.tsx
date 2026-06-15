export default function ToolbarBtn({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} title={label}
      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs text-muted-foreground transition-all">
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}