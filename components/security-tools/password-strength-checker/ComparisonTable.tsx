import { useT } from "@/context/TranslationProvider";

export default function ComparisonTable({ result, password }: { result: { entropy: number }; password: string }) {
  const t = useT("security-tools/PasswordStrengthChecker.json");
  return (
    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("entropyTable.title")}</p>
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-3 bg-muted/40 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
          <span>{t("entropyTable.bits")}</span><span>{t("entropyTable.level")}</span><span>{t("entropyTable.useCase")}</span>
        </div>
        {[
          { bits: "< 28", level: t("entropyTable.veryWeak"), color: "text-red-500", use: t("entropyTable.pins") },
          { bits: "28–45", level: t("entropyTable.weak"), color: "text-orange-500", use: t("entropyTable.simple") },
          { bits: "45–60", level: t("entropyTable.fair"), color: "text-yellow-500", use: t("entropyTable.general") },
          { bits: "60–80", level: t("entropyTable.strong"), color: "text-blue-500", use: t("entropyTable.financial") },
          { bits: "80+", level: t("entropyTable.veryStrong"), color: "text-emerald-500", use: t("entropyTable.crypto") },
        ].map(({ bits, level, color, use }) => {
          const current = (
            (bits === "< 28" && result.entropy < 28) ||
            (bits === "28–45" && result.entropy >= 28 && result.entropy < 45) ||
            (bits === "45–60" && result.entropy >= 45 && result.entropy < 60) ||
            (bits === "60–80" && result.entropy >= 60 && result.entropy < 80) ||
            (bits === "80+" && result.entropy >= 80)
          ) && password;
          return (
            <div key={bits} className={`grid grid-cols-3 px-3 py-2.5 items-center text-xs border-b last:border-0 border-border transition-colors ${current ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-muted/10"}`}>
              <code className="font-mono text-[10px] font-bold text-muted-foreground">{bits}</code>
              <span className={`text-[10px] font-bold ${color}`}>{level}</span>
              <span className="text-[10px] text-muted-foreground truncate">{use}</span>
            </div>
          );
        })}
      </div>
      {password && (
        <p className="text-[10px] text-blue-500 mt-2 font-bold">
          {t("entropyTable.yourPassword")}: {result.entropy} {t("stats.bits")}
        </p>
      )}
    </div>
  )
}