import { useT } from "@/context/TranslationProvider";
import { CheckCircle2, XCircle } from "lucide-react";

export default function CharsetPool({ result }: { result: { entropy: number; charTypes: { hasLower: boolean; hasUpper: boolean; hasDigit: boolean; hasSymbol: boolean; }; charsetSize: number; } }) {
  const t = useT("security-tools/PasswordStrengthChecker.json");
  return (
    <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("stats.charsetSize")}</p>
      <div className="flex flex-col gap-1.5">
        {[
          { label: t("entropy.charsetLower"), size: 26, has: result.charTypes.hasLower },
          { label: t("entropy.charsetUpper"), size: 26, has: result.charTypes.hasUpper },
          { label: t("entropy.charsetDigits"), size: 10, has: result.charTypes.hasDigit },
          { label: t("entropy.charsetSymbols"), size: 32, has: result.charTypes.hasSymbol },
        ].map(({ label, size, has }) => (
          <div key={label} className={`flex items-center gap-3 ${has ? "" : "opacity-30"}`}>
            {has ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <XCircle className="w-3 h-3 text-muted-foreground" />}
            <span className="text-[10px] text-foreground flex-1">{label}</span>
            <span className="text-[10px] font-mono font-bold text-muted-foreground">+{size}</span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2 mt-1 border-t border-border">
          <span className="text-[10px] font-bold text-foreground">{t("entropy.totalPool")}</span>
          <span className="text-sm font-black font-mono text-blue-500">{result.charsetSize}</span>
        </div>
      </div>
    </div>
  )
}