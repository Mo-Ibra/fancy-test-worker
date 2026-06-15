export default function DateInputs({ birthStr, setBirthStr, targetStr, setTargetStr, todayStr, isTargetToday, t }: { birthStr: string; setBirthStr: (date: string) => void; targetStr: string; setTargetStr: (date: string) => void; todayStr: string; isTargetToday: boolean; t: (key: string) => string }) {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("dateInputs.dateOfBirth")}</p>
      <input
        type="date"
        value={birthStr}
        max={todayStr}
        onChange={e => setBirthStr(e.target.value)}
        aria-label={t("dateInputs.dateOfBirth")}
        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all"
      />

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("dateInputs.calculateAgeAt")}</p>
          <button
            onClick={() => setTargetStr(todayStr)}
            className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${isTargetToday
              ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
              : "border-border bg-card text-muted-foreground hover:border-blue-300 hover:text-blue-500"
              }`}
          >
            {t("dateInputs.today")}
          </button>
        </div>
        <input
          type="date"
          value={targetStr}
          min={birthStr}
          max="2100-12-31"
          onChange={e => setTargetStr(e.target.value)}
          aria-label={t("dateInputs.calculateAgeAt")}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all"
        />
      </div>

      {/* Error state */}
      {birthStr && targetStr && new Date(birthStr) > new Date(targetStr) && (
        <p className="text-xs text-red-500">{t("errors.birthBeforeTarget")}</p>
      )}
    </div>
  )
}