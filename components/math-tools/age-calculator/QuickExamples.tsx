export default function QuickExamples({ setBirthStr, setTargetStr, todayStr }: { setBirthStr: (date: string) => void; setTargetStr: (date: string) => void; todayStr: string; }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">Quick Examples</p>
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { label: "Born 1990", date: "1990-06-15" },
          { label: "Born 2000", date: "2000-01-01" },
          { label: "Born 1980", date: "1980-12-25" },
          { label: "Born 2010", date: "2010-08-10" },
        ].map(({ label, date }) => (
          <button key={date} onClick={() => { setBirthStr(date); setTargetStr(todayStr); }}
            className="px-3 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground transition-all">
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}