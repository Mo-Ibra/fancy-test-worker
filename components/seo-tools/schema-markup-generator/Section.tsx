export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">{title}</p>
      {children}
    </div>
  );
}