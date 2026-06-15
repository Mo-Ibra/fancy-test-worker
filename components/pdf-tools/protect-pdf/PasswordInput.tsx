import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { scorePassword } from "@/funcs/pdf-tools/ProtectPDFToolFuncs";

export default function PasswordInput({ value, onChange, placeholder, id, label, sub, showStrength = false }: {
  value: string; onChange: (v: string) => void; placeholder?: string; id: string;
  label: string; sub?: string; showStrength?: boolean;
}) {
  const [show, setShow] = useState(false);
  const st = showStrength ? scorePassword(value) : null;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
        {sub && <span className="text-[10px] text-muted-foreground/60">{sub}</span>}
      </div>
      <div className="relative">
        <input id={id} type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} autoComplete="new-password"
          className="w-full px-4 py-3 pr-10 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/40 transition-all placeholder:text-muted-foreground/30" />
        <button onClick={() => setShow(p => !p)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {showStrength && value && st && (
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">{[0, 1, 2, 3, 4].map(i => <div key={i} className={`flex-1 h-1 rounded-full ${i <= st.score ? st.bg : 'bg-border'}`} />)}</div>
          <p className={`text-[10px] font-bold ${st.color}`}>{st.label}</p>
        </div>
      )}
    </div>
  );
}