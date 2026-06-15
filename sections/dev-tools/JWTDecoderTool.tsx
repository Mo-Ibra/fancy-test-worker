"use client";

import { useState, useMemo } from "react";
import {
  ShieldCheck,
  Trash2,
  ClipboardPaste,
  AlertCircle,
  CheckCircle2,
  Key,
  FileCode,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Hash,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { buildClaimInfo, CLAIM_META, decodeJWT, EXAMPLES, formatTimestamp } from "@/funcs/dev-tools/JWTDecoderToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import AlgBadge from "@/components/dev-tools/jwt-decoder/AlgBadge";
import Section from "@/components/dev-tools/jwt-decoder/Section";
import TokenVisual from "@/components/dev-tools/jwt-decoder/TokenVisual";
import JsonValue from "@/components/dev-tools/jwt-decoder/JsonValue";
import CopyButton from "@/components/dev-tools/jwt-decoder/CopyButton";
import RelatedTools from "@/components/dev-tools/RelatedTools";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function JWTDecoderTool() {
  const t = useT("dev-tools/JWTDecoderTool.json");

  const [input, setInput] = useState("");
  const [showRaw, setShowRaw] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [activeTab, setActiveTab] = useState<"decoded" | "raw">("decoded");

  const { decoded, error } = useMemo(() => decodeJWT(input), [input]);

  const claims = useMemo(() => decoded ? buildClaimInfo(decoded.payload) : [], [decoded]);
  const expClaim = useMemo(() => decoded?.payload.exp, [decoded]);
  const expInfo = useMemo(() => expClaim ? formatTimestamp(expClaim) : null, [expClaim]);

  const isExpired = expInfo?.expired ?? false;

  const prettyHeader = decoded ? JSON.stringify(decoded.header, null, 2) : "";
  const prettyPayload = decoded ? JSON.stringify(decoded.payload, null, 2) : "";

  const TABS = [
    { key: "decoded" as const, label: t("tabs.decoded") },
    { key: "raw" as const, label: t("tabs.raw") },
  ];

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="dev-tools/JWTDecoderTool.json" href="/dev-tools" />

        {/* Header */}
        <Header tKey="dev-tools/JWTDecoderTool.json" />

        {/* ── Privacy notice ── */}
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20 mb-6">
          <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            <strong>{t("clientSide")}</strong> {t("privacyNotice")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Left: input (2 cols) ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Token input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("jwtToken")}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigator.clipboard.readText().then(setInput).catch(() => { })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 transition-all">
                    <ClipboardPaste className="w-3.5 h-3.5" /> {t("paste")}
                  </button>
                  <button onClick={() => setInput("")} disabled={!input}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 disabled:opacity-40 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value.trim())}
                placeholder={t("input.placeholder")}
                className="h-44 px-5 py-4 rounded-2xl border border-border bg-card text-foreground text-xs leading-relaxed font-mono resize-none focus:outline-none focus:border-blue-400 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all duration-200 shadow-sm placeholder:text-muted-foreground/50"
              />

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
                </div>
              )}

              {/* Status */}
              {decoded && !error && (
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${isExpired
                  ? "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20"
                  : "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/20"
                  }`}>
                  {isExpired
                    ? <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  <span className={`text-xs font-semibold ${isExpired ? "text-red-600 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                    {isExpired ? t("tokenExpired", { relative: expInfo?.relative }) : expInfo ? t("tokenValid", { relative: expInfo.relative }) : t("decodedSuccessfully")}
                  </span>
                </div>
              )}
            </div>

            {/* Algorithm info */}
            {decoded && (
              <div className="flex flex-col gap-3 p-4 rounded-2xl border border-border bg-card">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("algorithm")}</p>
                <AlgBadge alg={decoded.header.alg} />
                {decoded.header.alg?.toLowerCase() === "none" && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-red-600 dark:text-red-400 leading-snug">
                      <strong>{t("securityRisk")}</strong> {t("noneAlgorithm")}
                    </p>
                  </div>
                )}
                {decoded.header.alg?.startsWith("HS") && (
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {t("hmacNote")}
                  </p>
                )}
              </div>
            )}

            {/* Secret input (for display only) */}
            {decoded && (
              <div className="flex flex-col gap-2 p-4 rounded-2xl border border-border bg-card">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Key className="w-3.5 h-3.5" /> {t("secretKey")}
                  </p>
                  <span className="text-[10px] text-muted-foreground/60 italic">{t("displayOnly")}</span>
                </div>
                <div className="relative">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={secretInput}
                    onChange={e => setSecretInput(e.target.value)}
                    placeholder={t("pasteSecret")}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border bg-background text-foreground text-xs font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/50"
                    aria-label={t("secretKey")}
                  />
                  <button onClick={() => setShowSecret(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-start gap-1.5">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                  {t("signatureNote")}
                </p>
              </div>
            )}

            {/* Examples */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("exampleTokens")}</p>
              <div className="flex flex-col gap-1.5">
                {EXAMPLES.map(({ label, token }) => (
                  <button key={label} onClick={() => setInput(token)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500 text-xs font-medium text-foreground text-left transition-all">
                    <FileCode className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: decoded output (3 cols) ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {decoded ? (
              <>
                {/* Tab bar */}
                <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                  {TABS.map(({ key, label }) => (
                    <button key={key} onClick={() => setActiveTab(key)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}>{label}</button>
                  ))}
                </div>

                {/* Token visual */}
                <Section title={t("jwtStructure")} icon={Hash}>
                  <TokenVisual parts={decoded.parts} />
                </Section>

                {/* ── Decoded tab ── */}
                {activeTab === "decoded" && (
                  <>
                    {/* Header */}
                    <Section title={t("sections.header")} icon={ShieldCheck}
                      badge={<AlgBadge alg={decoded.header.alg} />}
                    >
                      <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
                        {Object.entries(decoded.header).map(([key, value]) => {
                          const meta = CLAIM_META[key];
                          return (
                            <div key={key} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 group transition-colors">
                              <div className="w-24 shrink-0">
                                <code className="text-xs font-mono font-bold text-blue-500 dark:text-blue-400">{key}</code>
                                {meta && <p className="text-[9px] text-muted-foreground/60 mt-0.5">{meta.label}</p>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <code className="text-xs font-mono text-foreground break-all">
                                  <JsonValue value={value} />
                                </code>
                                {meta && <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{meta.desc}</p>}
                              </div>
                              <CopyButton text={String(value)} small />
                            </div>
                          );
                        })}
                      </div>
                    </Section>

                    {/* Payload */}
                    <Section title={t("payloadClaims")} icon={FileCode}
                      badge={
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {t("claimCount", { n: claims.length })}
                        </span>
                      }
                    >
                      <div className="flex flex-col divide-y divide-border rounded-xl border border-border overflow-hidden">
                        {claims.map(({ key, value, label, desc, type }) => {
                          const tsInfo = type === "timestamp" ? formatTimestamp(value as number) : null;
                          return (
                            <div key={key} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 group transition-colors">
                              <div className="w-28 shrink-0">
                                <code className="text-xs font-mono font-bold text-purple-500 dark:text-purple-400">{key}</code>
                                <p className="text-[9px] text-muted-foreground/70 mt-0.5">{label}</p>
                              </div>
                              <div className="flex-1 min-w-0">
                                {type === "timestamp" && tsInfo ? (
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <code className="text-xs font-mono text-amber-500">{String(value)}</code>
                                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${key === "exp" && tsInfo.expired
                                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                        : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                        }`}>{tsInfo.relative}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-0.5">{tsInfo.utc}</p>
                                  </div>
                                ) : (
                                  <div>
                                    <code className="text-xs font-mono text-foreground break-all">
                                      <JsonValue value={value} />
                                    </code>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{desc}</p>
                                  </div>
                                )}
                              </div>
                              <CopyButton text={Array.isArray(value) ? value.join(", ") : String(value)} small />
                            </div>
                          );
                        })}
                      </div>
                    </Section>

                    {/* Signature */}
                    <Section title={t("sections.signature")} icon={Lock}>
                      <div className="flex flex-col gap-3">
                        <div className="px-4 py-3 rounded-xl border border-border bg-muted/20 overflow-x-auto">
                          <code className="text-xs font-mono text-blue-500 dark:text-blue-400 break-all">{decoded.signature}</code>
                        </div>
                        <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/20">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-snug">
                            {t("cannotVerify")}
                          </p>
                        </div>
                        <CopyButton text={decoded.signature} label={t("copySignature")} />
                      </div>
                    </Section>
                  </>
                )}

                {/* ── Raw JSON tab ── */}
                {activeTab === "raw" && (
                  <>
                    {/* Header JSON */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-red-400" /> {t("headerJson")}
                        </span>
                        <CopyButton text={prettyHeader} />
                      </div>
                      <div className="px-5 py-4 rounded-2xl border border-border bg-muted/20 shadow-sm">
                        <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                          {prettyHeader}
                        </pre>
                      </div>
                    </div>

                    {/* Payload JSON */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-400" /> {t("payloadJson")}
                        </span>
                        <CopyButton text={prettyPayload} />
                      </div>
                      <div className="px-5 py-4 rounded-2xl border border-border bg-muted/20 shadow-sm">
                        <pre className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                          {prettyPayload}
                        </pre>
                      </div>
                    </div>

                    {/* Copy all */}
                    <CopyButton
                      text={JSON.stringify({ header: decoded.header, payload: decoded.payload, signature: decoded.signature }, null, 2)}
                      label={t("copyFullJson")}
                      full
                    />
                  </>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/40 gap-3">
                <ShieldCheck className="w-12 h-12" />
                <p className="text-sm font-medium">{t("pasteJwt")}</p>
                <p className="text-xs text-center max-w-xs">
                  {t("jwtFormat")}
                </p>
              </div>
            )}

            {/* JWT structure reference */}
            {!decoded && (
              <div className="p-5 rounded-2xl border border-border bg-card">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">{t("jwtStructure")}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { part: t("headerPart"), color: "text-red-500 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/40", desc: t("algoType"), example: '{ "alg": "HS256", "typ": "JWT" }' },
                    { part: t("payloadPart"), color: "text-purple-500 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/40", desc: t("claimsData"), example: '{ "sub": "1234", "exp": 1700000000 }' },
                    { part: t("signaturePart"), color: "text-blue-500 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/40", desc: t("integrity"), example: "HMAC(base64(header) + '.' + base64(payload), secret)" },
                  ].map(({ part, color, bg, desc, example }) => (
                    <div key={part} className={`flex flex-col gap-1.5 p-3 rounded-xl border ${bg}`}>
                      <p className={`text-xs font-bold ${color}`}>{part}</p>
                      <p className="text-[10px] text-muted-foreground leading-snug">{desc}</p>
                      <code className="text-[9px] font-mono text-muted-foreground/60 leading-snug mt-1 break-all">{example}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── How to Use ── */}
        <HowToUse tKey="dev-tools/JWTDecoderTool.json" count={4} />

        {/* ── FAQ ── */}
        <FAQ tKey="dev-tools/JWTDecoderTool.json" />

        {/* ── Examples ── */}
        <Examples tKey="dev-tools/JWTDecoderTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}