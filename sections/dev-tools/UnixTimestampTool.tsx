"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Clock,
  RefreshCw,
  Calendar,
  Globe,
  ArrowLeftRight,
  Hash,
  Zap,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { dateToTimestamp, Direction, NOTABLE, parseTimestamp, TIME_ZONES, TimestampUnit } from "@/funcs/dev-tools/UnixTimestampToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import LiveClock from "@/components/dev-tools/unix-timestamp/LiveClock";
import NumInput from "@/components/dev-tools/unix-timestamp/NumInput";
import CopyButton from "@/components/dev-tools/unix-timestamp/CopyButton";
import Collapsible from "@/components/dev-tools/unix-timestamp/Collapsible";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import LocalTimeDisplay from "@/components/dev-tools/unix-timestamp/LocalTimeDisplay";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function UnixTimestampTool() {
  const t = useT("dev-tools/UnixTimestampTool.json");

  const [direction, setDirection] = useState<Direction>("toDate");
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [tsInput, setTsInput] = useState("");

  // Date → Timestamp fields
  const [dtYear, setDtYear] = useState(new Date().getUTCFullYear());
  const [dtMonth, setDtMonth] = useState(new Date().getUTCMonth() + 1);
  const [dtDay, setDtDay] = useState(new Date().getUTCDate());
  const [dtHour, setDtHour] = useState(new Date().getUTCHours());
  const [dtMin, setDtMin] = useState(new Date().getUTCMinutes());
  const [dtSec, setDtSec] = useState(new Date().getUTCSeconds());
  const [dtMs, setDtMs] = useState(0);
  const [dtTz, setDtTz] = useState<"utc" | "local">("utc");

  // Parsed result (timestamp → date)
  const parsed = useMemo(
    () => (direction === "toDate" && tsInput.trim() ? parseTimestamp(tsInput, unit) : null),
    [tsInput, unit, direction]
  );

  // Date → Timestamp result
  const dtResult = useMemo(
    () => direction === "toTimestamp"
      ? dateToTimestamp(dtYear, dtMonth, dtDay, dtHour, dtMin, dtSec, dtMs, dtTz)
      : null,
    [direction, dtYear, dtMonth, dtDay, dtHour, dtMin, dtSec, dtMs, dtTz]
  );

  // Multi-timezone display for parsed date
  const tzRows = useMemo(() => {
    if (!parsed) return [];
    return TIME_ZONES.slice(0, 8).map(tz => {
      try {
        const str = new Date(parsed.unixMs).toLocaleString("en-US", {
          timeZone: tz,
          dateStyle: "medium",
          timeStyle: "long",
        });
        return { tz, str };
      } catch {
        return { tz, str: "—" };
      }
    });
  }, [parsed]);

  // Use current timestamp
  const useNow = useCallback(() => {
    const now = Date.now();
    if (direction === "toDate") {
      setTsInput(unit === "seconds" ? String(Math.floor(now / 1000)) : String(now));
    } else {
      const d = new Date(now);
      setDtYear(d.getUTCFullYear()); setDtMonth(d.getUTCMonth() + 1);
      setDtDay(d.getUTCDate()); setDtHour(d.getUTCHours());
      setDtMin(d.getUTCMinutes()); setDtSec(d.getUTCSeconds());
      setDtMs(d.getUTCMilliseconds());
    }
  }, [direction, unit]);

  const switchDirection = () => {
    if (direction === "toDate" && parsed) {
      setDtYear(parsed.components.year); setDtMonth(parsed.components.month);
      setDtDay(parsed.components.day); setDtHour(parsed.components.hour);
      setDtMin(parsed.components.minute); setDtSec(parsed.components.second);
      setDtMs(parsed.components.ms); setDtTz("utc");
    } else if (direction === "toTimestamp" && dtResult) {
      setTsInput(unit === "seconds" ? String(dtResult.seconds) : String(dtResult.milliseconds));
    }
    setDirection(d => d === "toDate" ? "toTimestamp" : "toDate");
  };

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/UnixTimestampTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/UnixTimestampTool.json" />

        {/* ── Live clock ── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-500" /> {t("currentTime")}
          </p>
          <LiveClock />
        </div>

        {/* ── Direction toggle ── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-1 p-1 rounded-2xl border border-border bg-card shadow-sm">
            {([
              { key: "toDate" as Direction, label: t("timestampToDate"), icon: Calendar },
              { key: "toTimestamp" as Direction, label: t("dateToTimestamp"), icon: Hash },
            ]).map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setDirection(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${direction === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          <button onClick={switchDirection}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all"
            title="Swap direction using current value">
            <ArrowLeftRight className="w-3.5 h-3.5" /> {t("swap")}
          </button>

          <button onClick={useNow}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-card hover:border-emerald-300 hover:text-emerald-600 text-xs font-medium transition-all ml-auto">
            <RefreshCw className="w-3.5 h-3.5" /> {t("useNow")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: input panel ── */}
          <div className="flex flex-col gap-5">

            {/* Timestamp → Date */}
            {direction === "toDate" && (
              <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("tabs.toDate")}</p>

                {/* Unit toggle */}
                <div className="flex gap-2">
                  {(["seconds", "milliseconds"] as TimestampUnit[]).map(u => (
                    <button key={u} onClick={() => setUnit(u)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${unit === u ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "border-border bg-muted/20 text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                        }`}>{u}</button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tsInput}
                    onChange={e => setTsInput(e.target.value.replace(/[^\d-]/g, ""))}
                    placeholder={unit === "seconds" ? "e.g. 1700000000" : "e.g. 1700000000000"}
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/50"
                    aria-label={t("tabs.toDate")}
                  />
                </div>

                {/* Quick notable timestamps */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("notableTimestamps")}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {NOTABLE.map(({ label, ts, desc }) => (
                      <button key={label}
                        onClick={() => { setTsInput(String(ts)); setUnit("seconds"); }}
                        className="flex flex-col items-start px-3 py-2 rounded-xl border border-border bg-muted/20 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group">
                        <span className="text-[10px] font-bold text-foreground group-hover:text-blue-500 transition-colors leading-tight">{label}</span>
                        <code className="text-[9px] font-mono text-blue-400 dark:text-blue-500">{ts.toLocaleString()}</code>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Date → Timestamp */}
            {direction === "toTimestamp" && (
              <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("dateAndTime")}</p>

                {/* Timezone for input */}
                <div className="flex gap-2">
                  {(["utc", "local"] as const).map(tz => (
                    <button key={tz} onClick={() => setDtTz(tz)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${dtTz === tz ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "border-border bg-muted/20 text-muted-foreground hover:border-blue-300 hover:text-blue-500"
                        }`}>{tz === "utc" ? t("date.utc") : t("date.local")}</button>
                  ))}
                </div>

                {/* Date fields */}
                <div className="grid grid-cols-3 gap-2">
                  <NumInput label={t("date.year")} value={dtYear} onChange={setDtYear} min={1970} max={9999} />
                  <NumInput label={t("date.month")} value={dtMonth} onChange={setDtMonth} min={1} max={12} />
                  <NumInput label={t("date.day")} value={dtDay} onChange={setDtDay} min={1} max={31} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <NumInput label={t("date.hour")} value={dtHour} onChange={setDtHour} min={0} max={23} />
                  <NumInput label={t("date.minute")} value={dtMin} onChange={setDtMin} min={0} max={59} />
                  <NumInput label={t("date.second")} value={dtSec} onChange={setDtSec} min={0} max={59} />
                  <NumInput label={t("ms")} value={dtMs} onChange={setDtMs} min={0} max={999} />
                </div>

                {/* Output */}
                {dtResult && (
                  <div className="flex flex-col gap-2 pt-2 border-t border-border">
                    {[
                      { label: t("unixSeconds"), value: String(dtResult.seconds) },
                      { label: t("unixMilliseconds"), value: String(dtResult.milliseconds) },
                      { label: t("iso8601"), value: new Date(dtResult.milliseconds).toISOString() },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-muted-foreground w-28 shrink-0">{label}</span>
                        <code className="flex-1 text-xs font-mono text-foreground truncate">{value}</code>
                        <CopyButton text={value} small />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notable timestamps info */}
            <Collapsible title={t("unixTimeMilestones")} defaultOpen={false}>
              <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
                {NOTABLE.map(({ label, ts, desc }) => (
                  <button key={label}
                    onClick={() => { setTsInput(String(ts)); setUnit("seconds"); setDirection("toDate"); }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left group">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground group-hover:text-blue-500 transition-colors">{label}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                    <code className="text-[10px] font-mono text-blue-400 shrink-0">{ts.toLocaleString()}</code>
                  </button>
                ))}
              </div>
            </Collapsible>
          </div>

          {/* ── Right: results ── */}
          <div className="flex flex-col gap-5">

            {/* Parsed date result */}
            {parsed && direction === "toDate" && (
              <>
                {/* Primary result card */}
                <div className="p-5 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-500/70 mb-1">{t("convertedResult")}</p>
                      <p className="text-xl font-bold text-foreground leading-tight">{parsed.dayOfWeek}</p>
                      <p className="text-base text-muted-foreground">{parsed.utc}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                      {parsed.relative}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: t("unixSeconds"), value: String(parsed.unixSeconds) },
                      { label: t("date.millisecond"), value: String(parsed.unixMs) },
                      { label: t("iso8601"), value: parsed.iso },
                      { label: t("date.utc"), value: parsed.utc },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col gap-0.5 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-white/60 dark:bg-black/10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">{label}</span>
                        <div className="flex items-center gap-1.5">
                          <code className="text-xs font-mono text-foreground flex-1 truncate">{value}</code>
                          <CopyButton text={value} small />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date components */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("dateComponents")}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: t("date.year"), value: parsed.components.year },
                      { label: t("date.month"), value: String(parsed.components.month).padStart(2, "0") },
                      { label: t("date.day"), value: String(parsed.components.day).padStart(2, "0") },
                      { label: t("date.hour"), value: String(parsed.components.hour).padStart(2, "0") },
                      { label: t("date.minute"), value: String(parsed.components.minute).padStart(2, "0") },
                      { label: t("date.second"), value: String(parsed.components.second).padStart(2, "0") },
                      { label: t("ms"), value: String(parsed.components.ms).padStart(3, "0") },
                      { label: t("week"), value: `W${parsed.weekNumber}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex flex-col items-center py-3 rounded-xl border border-border bg-muted/20">
                        <span className="text-base font-bold font-mono text-foreground tabular-nums">{value}</span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[
                      { label: t("dayOfYear", { n: parsed.dayOfYear }), accent: false },
                      { label: t("weekN", { n: parsed.weekNumber }), accent: false },
                      { label: parsed.leapYear ? t("leapYear") : t("nonLeapYear"), accent: parsed.leapYear },
                    ].map(({ label, accent }) => (
                      <span key={label} className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${accent ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "border-border bg-muted/30 text-muted-foreground"}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Multi-timezone */}
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/20">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("worldClocks")}</p>
                  </div>
                  <div className="divide-y divide-border max-h-80 overflow-y-auto">
                    {tzRows.map(({ tz, str }) => (
                      <div key={tz} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors group">
                        <span className="text-xs font-mono font-bold text-blue-500 dark:text-blue-400 w-36 shrink-0">{tz}</span>
                        <span className="text-xs text-foreground flex-1">{str}</span>
                        <CopyButton text={str} small />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Empty state */}
            {direction === "toDate" && !parsed && (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40 gap-3">
                <Clock className="w-10 h-10" />
                <p className="text-sm">{t("enterTimestamp")}</p>
              </div>
            )}

            {/* Date→Timestamp empty state */}
            {direction === "toTimestamp" && (
              <div className="flex flex-col gap-5">
                {/* Local time display */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("yourLocalTime")}</p>
                  <LocalTimeDisplay />
                </div>

                {/* Cheat sheet */}
                <Collapsible title={t("commonFormats")} defaultOpen>
                  <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
                    {[
                      { label: t("unixSecondsLabel"), example: "1700000000", note: t("standardApis") },
                      { label: t("unixMsLabel"), example: "1700000000000", note: t("jsDatenow") },
                      { label: t("iso8601Label"), example: "2023-11-14T22:13:20Z", note: t("webStandards") },
                      { label: t("rfc2822"), example: "Wed, 14 Nov 2023 22:13", note: t("emailHeaders") },
                      { label: t("humanReadable"), example: "November 14, 2023", note: t("displayOnly") },
                    ].map(({ label, example, note }) => (
                      <div key={label} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground">{label}</p>
                          <code className="text-[10px] font-mono text-blue-400">{example}</code>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0 text-right">{note}</span>
                      </div>
                    ))}
                  </div>
                </Collapsible>
              </div>
            )}
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/UnixTimestampTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/UnixTimestampTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/UnixTimestampTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}