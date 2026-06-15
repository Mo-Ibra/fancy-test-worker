import { RobotRule } from "@/funcs/seo-tools/RobotsTxtGeneratorToolFuncs";
import { useState } from "react";
import { ChevronDown, Trash2, Plus } from "lucide-react";
import PathRow from "./PathRow";
import { COMMON_PATHS, KNOWN_BOTS } from "@/funcs/seo-tools/RobotsTxtGeneratorToolFuncs";

export default function RuleCard({
  rule, index, total, onChange, onRemove, t,
}: {
  rule: RobotRule; index: number; total: number;
  onChange: (r: RobotRule) => void; onRemove: () => void; t: any;
}) {
  const [open, setOpen] = useState(true);

  const setUA = (ua: string) => onChange({ ...rule, userAgent: ua });
  const addAllow = () => onChange({ ...rule, allows: [...rule.allows, ""] });
  const addDisallow = () => onChange({ ...rule, disallows: [...rule.disallows, ""] });
  const setAllow = (i: number, v: string) => onChange({ ...rule, allows: rule.allows.map((a, j) => j === i ? v : a) });
  const setDisallow = (i: number, v: string) => onChange({ ...rule, disallows: rule.disallows.map((d, j) => j === i ? v : d) });
  const rmAllow = (i: number) => onChange({ ...rule, allows: rule.allows.filter((_, j) => j !== i) });
  const rmDisallow = (i: number) => onChange({ ...rule, disallows: rule.disallows.filter((_, j) => j !== i) });

  const bot = KNOWN_BOTS.find(b => b.name === rule.userAgent);

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-muted/20 border-b border-border">
        <span className="text-lg">{bot?.icon ?? "🤖"}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-foreground">{rule.userAgent || t("rules.newRule")}</p>
          <p className="text-[10px] text-muted-foreground">
            {rule.disallows.filter(Boolean).length} {t("rules.disallowCount")} · {rule.allows.filter(Boolean).length} {t("rules.allowCount")}
          </p>
        </div>
        <button onClick={() => setOpen(p => !p)}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted/40 transition-all">
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <button onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {open && (
        <div className="p-4 flex flex-col gap-4">
          {/* User-Agent */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              {t("rules.userAgent")}
            </label>
            <div className="flex gap-2">
              <input value={rule.userAgent} onChange={e => setUA(e.target.value)}
                placeholder={t("rules.userAgentPlaceholder")} aria-label={t("rules.userAgent")}
                className="flex-1 px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all" />
            </div>
            {/* Bot picker */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {KNOWN_BOTS.slice(0, 8).map(b => (
                <button key={b.name} onClick={() => setUA(b.name)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-bold transition-all ${rule.userAgent === b.name
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "border-border bg-card text-muted-foreground hover:border-blue-200"
                    }`}>
                  {b.icon} {b.name}
                </button>
              ))}
              {/* More bots */}
              <select onChange={e => { if (e.target.value) setUA(e.target.value); e.target.value = ""; }}
                className="px-2 py-1 rounded-lg border border-border bg-card text-[10px] text-muted-foreground focus:outline-none cursor-pointer">
                <option value="">{t("rules.moreBots")}</option>                {KNOWN_BOTS.slice(8).map(b => (
                  <option key={b.name} value={b.name}>{b.icon} {b.name} — {b.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Disallow */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-red-500 dark:text-red-400">
                {t("rules.disallow")}
              </label>
              <button onClick={addDisallow}
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 text-[10px] font-bold transition-all">
                <Plus className="w-3 h-3" /> {t("rules.add")}
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {rule.disallows.map((d, i) => (
                <PathRow key={i} value={d} onChange={v => setDisallow(i, v)}
                  onRemove={() => rmDisallow(i)} placeholder={t("rules.disallowPlaceholder")} />
              ))}
              {rule.disallows.length === 0 && (
                <p className="text-[10px] text-muted-foreground/50 italic px-1">{t("rules.noBlocked")}</p>
              )}
            </div>
            {/* Common path quick-add */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {COMMON_PATHS.slice(0, 8).map(p => (
                <button key={p} onClick={() => onChange({ ...rule, disallows: [...rule.disallows, p] })}
                  className="px-2 py-1 rounded-lg border border-border bg-muted/20 hover:border-red-300 hover:text-red-500 text-[9px] font-mono transition-all">
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Allow */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t("rules.allow")}
              </label>
              <button onClick={addAllow}
                className="flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-card hover:border-emerald-300 hover:text-emerald-600 text-[10px] font-bold transition-all">
                <Plus className="w-3 h-3" /> {t("rules.add")}
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              {rule.allows.map((a, i) => (
                <PathRow key={i} value={a} onChange={v => setAllow(i, v)}
                  onRemove={() => rmAllow(i)} placeholder={t("rules.allowPlaceholder")} />
              ))}
              {rule.allows.length === 0 && (
                <p className="text-[10px] text-muted-foreground/50 italic px-1">{t("rules.noAllows")}</p>
              )}
            </div>
          </div>

          {/* Crawl delay */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              {t("rules.crawlDelay")}
            </label>
            <div className="flex items-center gap-2">
              <input type="number" min={0} max={60} value={rule.crawlDelay}
                onChange={e => onChange({ ...rule, crawlDelay: e.target.value })}
                placeholder={t("rules.crawlDelayPlaceholder")} aria-label={t("rules.crawlDelay")}
                className="w-28 px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40" />
              <p className="text-[10px] text-muted-foreground">{t("rules.crawlDelayNote")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}