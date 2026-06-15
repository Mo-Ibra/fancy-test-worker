// ── Tip strip ─────────────────────────────────────────────────────

export default function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
      <span className="text-blue-400 text-sm">💡</span>
      <p className="text-xs text-blue-700 dark:text-blue-300">{text}</p>
    </div>
  );
}