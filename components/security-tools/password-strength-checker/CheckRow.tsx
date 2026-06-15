import { CheckItem } from "@/funcs/security-tools/PasswordStrengthCheckerToolFuncs";
import { CheckCircle2, XCircle } from "lucide-react";

export default function CheckRow({ label, ok, note }: CheckItem) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      {ok
        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        : <XCircle className="w-4 h-4 text-muted-foreground/30 shrink-0" />}
      <span className={`text-xs flex-1 ${ok ? "text-foreground" : "text-muted-foreground/60"}`}>{label}</span>
      {note && <span className={`text-[10px] ${ok ? "text-emerald-500" : "text-muted-foreground/50"}`}>{note}</span>}
    </div>
  );
}