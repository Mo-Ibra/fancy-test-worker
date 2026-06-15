"use client";

import { useState, useRef, useCallback } from "react";
import {
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  LockOpen,
  Lock,
  ShieldOff,
  KeyRound,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { EncryptInfo, fmtSize, parseEncryptInfo, tryVerifyPassword, unlockPDF } from "@/funcs/pdf-tools/UnlockPDFToolFuncs";
import RelatedTools from "@/components/pdf-tools/RelatedTools";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import PasswordInput from "@/components/pdf-tools/unlock-pdf/PasswordInput";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function UnlockPDFTool() {
  const t = useT("pdf-tools/UnlockPDFTool.json");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultKb, setResultKb] = useState<number | null>(null);
  const [unlockErr, setUnlockErr] = useState("");
  const [outputName, setOutputName] = useState("");
  const [encInfo, setEncInfo] = useState<EncryptInfo | null>(null);
  const [pwVerified, setPwVerified] = useState<boolean | null>(null);

  const bufRef = useRef<ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canUnlock = !!pdfFile && !unlocking;

  const handleFile = useCallback(async (file: File) => {
    setPdfFile(file);
    setOutputName(file.name.replace(/\.pdf$/i, "") + "_unlocked");
    setResultKb(null); setUnlockErr(""); setPassword(""); setPwVerified(null);
    const buf = await file.arrayBuffer();
    bufRef.current = buf;

    // Detect encryption — read the ENTIRE file decoded as latin1
    try {
      const dec = new TextDecoder("latin1");
      const pdfStr = dec.decode(buf);
      const info = parseEncryptInfo(pdfStr);
      setEncInfo(info);
    } catch {
      setEncInfo({ isEncrypted: false, v: 0, r: 0, keyLen: 16, oHex: "", uHex: "", perms: 0, fileIdHex: "", isOwnerOnly: false });
    }
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files).find(f => f.name.endsWith(".pdf") || f.type === "application/pdf");
    if (f) handleFile(f);
  };

  // Live password verification
  const checkPw = useCallback((pw: string) => {
    setPassword(pw);
    if (!encInfo?.isEncrypted || !pw || !encInfo.uHex || !encInfo.fileIdHex) {
      setPwVerified(null);
      return;
    }
    try {
      const ok = tryVerifyPassword(pw, encInfo);
      setPwVerified(ok);
    } catch {
      setPwVerified(null);
    }
  }, [encInfo]);

  const unlock = useCallback(async () => {
    if (!canUnlock || !bufRef.current) return;
    setUnlocking(true); setUnlockErr(""); setResultKb(null); setProgress(20);

    try {
      setProgress(50);
      const { bytes, wasEncrypted } = await unlockPDF(bufRef.current, password);
      setProgress(100);
      setResultKb(bytes.length / 1024);

      const blob = new Blob([bytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${outputName || "unlocked"}.pdf`;
      a.click(); URL.revokeObjectURL(url);
    } catch (e: any) {
      setUnlockErr(e.message ?? "Could not unlock PDF");
    } finally {
      setUnlocking(false);
    }
  }, [canUnlock, password, outputName]);

  const reset = () => {
    setPdfFile(null); setResultKb(null); setUnlockErr(""); setEncInfo(null);
    setPassword(""); setPwVerified(null); bufRef.current = null;
  };

  const isProtected = encInfo?.isEncrypted === true;
  const isUnprotected = encInfo?.isEncrypted === false;

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">
      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="pdf-tools/UnlockPDFTool.json" href="/pdf-tools" />

        {/* Header */}
        <Header tKey="pdf-tools/UnlockPDFTool.json" />

        {/* Legal notice */}
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400" dangerouslySetInnerHTML={{ __html: t.raw("legal.notice") }} />
        </div>

        {/* Privacy */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 mb-6">
          <ShieldOff className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400" dangerouslySetInnerHTML={{ __html: t.raw("privacy.notice") }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Info + instructions ── */}
          <div className="flex flex-col gap-5">

            {/* File info */}
            {pdfFile && (
              <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-sm ${isProtected ? "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10"
                : isUnprotected ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10"
                  : "border-border bg-card"
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isProtected ? "bg-amber-100 dark:bg-amber-900/30"
                  : isUnprotected ? "bg-emerald-100 dark:bg-emerald-900/30"
                    : "bg-red-50 dark:bg-red-900/20"
                  }`}>
                  {isProtected ? <Lock className="w-5 h-5 text-amber-500" />
                    : isUnprotected ? <LockOpen className="w-5 h-5 text-emerald-500" />
                      : <FileText className="w-5 h-5 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{pdfFile.name}</p>
                  <p className="text-[10px] text-muted-foreground">{fmtSize(pdfFile.size / 1024)}</p>
                  {isProtected && (
                    <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> {t("fileInfo.protected")} · {encInfo?.v === 2 ? "RC4-128" : encInfo?.v === 4 ? "AES-128" : encInfo?.v === 5 ? "AES-256" : `V${encInfo?.v}`}
                    </p>
                  )}
                  {isUnprotected && (
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {t("fileInfo.noEncryption")}
                    </p>
                  )}
                </div>
                <button onClick={reset} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Encryption details */}
            {isProtected && encInfo && (
              <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("encryptionDetails.title")}</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: t("encryptionDetails.algorithm"), value: encInfo.v === 1 ? "RC4-40" : encInfo.v === 2 ? "RC4-128" : encInfo.v === 4 ? "AES-128" : encInfo.v === 5 ? "AES-256" : `V${encInfo.v}` },
                    { label: t("encryptionDetails.revision"), value: `R${encInfo.r}` },
                    { label: t("encryptionDetails.keyLength"), value: `${encInfo.keyLen * 8} bits` },
                    { label: t("encryptionDetails.fileId"), value: encInfo.fileIdHex ? encInfo.fileIdHex.slice(0, 16) + "…" : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <code className="font-mono font-bold text-foreground">{value}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Password field */}
            {pdfFile && (
              <div className="flex flex-col gap-3 p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" /> {t("password.label")}
                </p>

                {isUnprotected ? (
                  <div className="flex items-center gap-2 py-2 text-xs text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t("password.notNeeded")}</span>
                  </div>
                ) : (
                  <>
                    <PasswordInput id="unlock-pw" label=""
                      value={password} onChange={checkPw} onEnter={unlock}
                      placeholder={t("password.placeholder")} />

                    {/* Live password verification badge */}
                    {password && pwVerified !== null && (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${pwVerified
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-50 dark:bg-red-900/20 text-red-500"
                        }`}>
                        {pwVerified
                          ? <><CheckCircle2 className="w-3.5 h-3.5" /> {t("password.correct")}</>
                          : <><AlertCircle className="w-3.5 h-3.5" /> {t("password.incorrect")}</>}
                      </div>
                    )}

                    {password && pwVerified === null && (
                      <p className="text-[10px] text-muted-foreground/60">
                        {t("password.liveVerificationUnavailable")}
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Output filename */}
            {pdfFile && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t("output.filename")}</p>
                <div className="flex items-center gap-0">
                  <input value={outputName} onChange={e => setOutputName(e.target.value)} placeholder={t("output.placeholder")}
                    className="flex-1 px-4 py-3 rounded-l-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-blue-400 transition-all placeholder:text-muted-foreground/40"
                    aria-label={t("output.filename")} />
                  <span className="px-3 py-3 rounded-r-xl border border-l-0 border-border bg-muted/40 text-muted-foreground text-sm font-mono">{t("output.extension")}</span>
                </div>
              </div>
            )}

            {/* How it works */}
            {!pdfFile && (
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-400" /> {t("howItWorks.title")}
                </p>
                <div className="flex flex-col gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  {[
                    { step: "1", text: t("howItWorks.step1") },
                    { step: "2", text: t("howItWorks.step2") },
                    { step: "3", text: t("howItWorks.step3") },
                    { step: "4", text: t("howItWorks.step4") },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{step}</span>
                      <p>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Drop zone + Action ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Drop zone */}
            {!pdfFile && (
              <div onDragOver={e => e.preventDefault()} onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-14 rounded-2xl border-2 border-dashed border-border bg-muted/10 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-all">
                <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" className="hidden" aria-label="Upload file"
                  onChange={e => { const f = e.target.files?.[0]; if (f) { handleFile(f); e.target.value = ""; } }} />
                <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center">
                  <LockOpen className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{t("dropzone.dropProtected")}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("dropzone.orClick")}</p>
                </div>
                <span className="text-[10px] font-bold px-3 py-1 rounded-full border border-border bg-card text-muted-foreground">{t("dropzone.pdfOnly")}</span>
              </div>
            )}

            {/* Status panel */}
            {pdfFile && (
              <div className="flex flex-col gap-4">

                {/* Encryption status card */}
                <div className={`p-5 rounded-2xl border shadow-sm ${isProtected ? "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10"
                  : isUnprotected ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10"
                    : "border-border bg-card"
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {isProtected
                      ? <Lock className="w-6 h-6 text-amber-500 shrink-0" />
                      : <LockOpen className="w-6 h-6 text-emerald-500 shrink-0" />}
                    <div>
                      <p className={`text-sm font-bold ${isProtected ? "text-amber-700 dark:text-amber-400" : "text-emerald-700 dark:text-emerald-400"}`}>
                        {isProtected ? t("status.protected") : t("status.notProtected")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isProtected
                          ? t("status.protectedDesc")
                          : t("status.notProtectedDesc")}
                      </p>
                    </div>
                  </div>

                  {isProtected && (
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: t("status.rc4"), ok: true },
                        { label: t("status.aes"), ok: true },
                        { label: t("status.liveVerify"), ok: encInfo?.v === 2 },
                        { label: t("status.noServer"), ok: true },
                      ].map(({ label, ok }) => (
                        <div key={label} className="flex items-center gap-2 text-xs">
                          {ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            : <AlertCircle className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />}
                          <span className={ok ? "text-foreground" : "text-muted-foreground/50"}>{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                {unlocking && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t("progress.decrypting")}
                      </span>
                      <span className="font-bold text-blue-500">{progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Error */}
                {unlockErr && (
                  <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">{t("errors.unlockFailed")}</p>
                      <p className="text-[10px] text-red-500/80 mt-0.5">{unlockErr}</p>
                      {isProtected && (
                        <p className="text-[10px] text-muted-foreground mt-1">{t("errors.checkPassword")}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Success */}
                {resultKb !== null && !unlocking && (
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10">
                    <LockOpen className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t("result.success")}</p>
                      <p className="text-xs text-muted-foreground">
                        {outputName || "unlocked"}.pdf · {fmtSize(resultKb)} · {t("result.noPasswordRequired")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Unlock button */}
                <button onClick={unlock} disabled={!canUnlock}
                  className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm transition-all active:scale-[0.98]">
                  {unlocking
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t("button.unlocking")}</>
                    : <><LockOpen className="w-5 h-5" /> {t("button.unlock")}</>}
                </button>

                {resultKb !== null && !unlocking && (
                  <button onClick={unlock}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card hover:border-blue-300 hover:text-blue-500 text-xs font-medium transition-all">
                    <Download className="w-3.5 h-3.5" /> {t("result.downloadAgain")}
                  </button>
                )}
              </div>
            )}

            {/* Supported formats info */}
            {!pdfFile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: t("capabilities.title"),
                    icon: CheckCircle2,
                    color: "text-emerald-500",
                    bg: "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10",
                    items: [
                      t("capabilities.removePassword"),
                      t("capabilities.stripPermissions"),
                      t("capabilities.rc4"),
                      t("capabilities.aes"),
                      t("capabilities.ownerOnly"),
                    ],
                  },
                  {
                    title: t("limitations.title"),
                    icon: X,
                    color: "text-red-400",
                    bg: "border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10",
                    items: [
                      t("limitations.crack"),
                      t("limitations.unknownOwner"),
                      t("limitations.recover"),
                      t("limitations.bruteForce"),
                    ],
                  },
                ].map(({ title, icon: Icon, color, bg, items }) => (
                  <div key={title} className={`p-4 rounded-2xl border ${bg} flex flex-col gap-2`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <p className="text-xs font-bold text-foreground">{title}</p>
                    </div>
                    {items.map(item => (
                      <div key={item} className="flex items-start gap-2">
                        <Icon className={`w-3 h-3 ${color} shrink-0 mt-0.5`} />
                        <p className="text-[10px] text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <HowToUse tKey="pdf-tools/UnlockPDFTool.json" count={4} />
        <FAQ tKey="pdf-tools/UnlockPDFTool.json" />
        <Examples tKey="pdf-tools/UnlockPDFTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}