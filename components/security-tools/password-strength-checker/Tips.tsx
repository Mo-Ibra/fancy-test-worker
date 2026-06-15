import { useT } from "@/context/TranslationProvider";
import { Info } from "lucide-react";

export default function Tips() {
  const t = useT("security-tools/PasswordStrengthChecker.json");
  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-blue-400" /> {t("bestPractices.title")}
      </p>
      <div className="flex flex-col gap-2 text-xs text-muted-foreground">
        {[
          t("bestPractices.passphraseTip"),
          t("bestPractices.tip1"),
          t("bestPractices.tip2"),
          t("bestPractices.tip3"),
          t("bestPractices.tip4"),
        ].map((tip, i) => (
          <p key={i} className="flex items-start gap-1.5">
            <span className="text-blue-400 mt-0.5 shrink-0">›</span> {tip}
          </p>
        ))}
      </div>
    </div>
  )
}