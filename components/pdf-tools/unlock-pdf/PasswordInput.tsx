import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ value, onChange, onEnter, placeholder, id, label }: {
  value: string; onChange: (v: string) => void; onEnter?: () => void;
  placeholder?: string; id: string; label: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="relative">
        <input id={id} type={show ? "text" : "password"} value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onEnter?.()}
          placeholder={placeholder} autoComplete="current-password"
          className="w-full px-4 py-3.5 pr-10 rounded-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all placeholder:text-muted-foreground/30" />
        <button onClick={() => setShow(p => !p)} type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}