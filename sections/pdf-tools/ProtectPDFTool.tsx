"use client";

import { useState, useRef, useCallback } from "react";
import {
  FileText, RefreshCw,
  CheckCircle2, AlertCircle, X, Lock, ShieldCheck,
  KeyRound, AlertTriangle, Info,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import RelatedTools from "@/components/pdf-tools/RelatedTools";
import { fmtSize, protectPDF, scorePassword } from "@/funcs/pdf-tools/ProtectPDFToolFuncs";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import Passwords from "@/components/pdf-tools/protect-pdf/Passwords";
import Permissions from "@/components/pdf-tools/protect-pdf/Permissions";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function ProtectPDFTool() {
  const t = useT("pdf-tools/ProtectPDFTool.json");
  const [pdfFile, setFile] = useState<File | null>(null);
  const [userPw, setUserPw] = useState('');
  const [ownerPw, setOwnerPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [useOwner, setUseOwner] = useState(false);
  const [print, setPrint] = useState(true);
  const [printHQ, setPrintHQ] = useState(true);
  const [modify, setModify] = useState(false);
  const [copy, setCopy] = useState(true);
  const [annot, setAnnot] = useState(true);
  const [forms, setForms] = useState(true);
  const [assemble, setAssemble] = useState(false);
  const [busy, setBusy] = useState(false);
  const [prog, setProg] = useState(0);
  const [resultKb, setResultKb] = useState<number | null>(null);
  const [err, setErr] = useState('');
  const [outName, setOutName] = useState('');
  const bufRef = useRef<ArrayBuffer | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const pwOk = !userPw || confirmPw === userPw;
  const canGo = !!pdfFile && userPw.length >= 1 && pwOk && !busy;
  const strength = scorePassword(userPw);

  const loadFile = useCallback(async (f: File) => {
    setFile(f); setOutName(f.name.replace(/\.pdf$/i, '') + '_protected');
    setResultKb(null); setErr('');
    bufRef.current = await f.arrayBuffer();
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = Array.from(e.dataTransfer.files).find(f => f.name.endsWith('.pdf') || f.type === 'application/pdf');
    if (f) loadFile(f);
  };

  const protect = useCallback(async () => {
    if (!canGo || !bufRef.current) return;
    setBusy(true); setErr(''); setResultKb(null); setProg(20);
    try {
      const src = new Uint8Array(bufRef.current);
      setProg(40);
      const encrypted = await protectPDF(
        src, userPw, useOwner && ownerPw.trim() ? ownerPw : userPw,
        { print, printHQ, modify, copy, annot, forms, assemble }
      );
      setProg(100);
      setResultKb(encrypted.length / 1024);
      const blob = new Blob([encrypted as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${outName || 'protected'}.pdf`;
      a.click(); URL.revokeObjectURL(url);
    } catch (e: any) { setErr(e.message ?? t('errors.encryptionFailed')); }
    finally { setBusy(false); }
  }, [canGo, userPw, ownerPw, useOwner, print, printHQ, modify, copy, annot, forms, assemble, outName]);

  const reset = () => {
    setFile(null); setResultKb(null); setErr(''); bufRef.current = null;
    setUserPw(''); setOwnerPw(''); setConfirmPw('');
  };

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="pdf-tools/ProtectPDFTool.json" href="/pdf-tools" />

        {/* Header */}
        <Header tKey="pdf-tools/ProtectPDFTool.json" />

        {/* Privacy */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10 mb-6">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400">
            <strong>{t('privacy.notice').split('.')[0]}.</strong> {t('privacy.notice').split('. ').slice(1).join('. ')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left ── */}
          <div className="flex flex-col gap-5">

            {pdfFile && (
              <div className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{pdfFile.name}</p>
                  <p className="text-[10px] text-muted-foreground">{fmtSize(pdfFile.size / 1024)}</p>
                </div>
                <button onClick={reset} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-card hover:border-red-300 hover:text-red-500 transition-all">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Passwords */}
            <Passwords
              t={t}
              userPw={userPw}
              setUserPw={setUserPw}
              confirmPw={confirmPw}
              setConfirmPw={setConfirmPw}
              useOwner={useOwner}
              setUseOwner={setUseOwner}
              ownerPw={ownerPw}
              setOwnerPw={setOwnerPw}
              pwOk={pwOk}
            />

            {/* Permissions */}
            <Permissions
              t={t}
              print={print}
              setPrint={setPrint}
              printHQ={printHQ}
              setPrintHQ={setPrintHQ}
              copy={copy}
              setCopy={setCopy}
              modify={modify}
              setModify={setModify}
              annot={annot}
              setAnnot={setAnnot}
              forms={forms}
              setForms={setForms}
              assemble={assemble}
              setAssemble={setAssemble}
            />
          </div>

          {/* ── Right ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {!pdfFile && (
              <div onDragOver={e => e.preventDefault()} onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 p-12 rounded-2xl border-2 border-dashed border-border bg-muted/10 hover:border-red-300 hover:bg-red-50/30 dark:hover:bg-red-900/10 cursor-pointer transition-all">
                <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" aria-label="Upload file"
                  onChange={e => { const f = e.target.files?.[0]; if (f) { loadFile(f); e.target.value = ''; } }} />
                <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">{t('dropzone.dropHere')}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t('dropzone.orClick')}</p>
                </div>
              </div>
            )}

            {pdfFile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400">{t('encryption.title')}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{t('encryption.description')}</p>
                </div>
                <div className={`p-4 rounded-2xl border flex flex-col gap-2 ${userPw ? strength.score >= 3 ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10' : 'border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10' : 'border-border bg-card'}`}>
                  <div className="flex items-center gap-2">
                    <KeyRound className={`w-5 h-5 ${userPw ? strength.color : 'text-muted-foreground/40'}`} />
                    <p className={`text-xs font-bold ${userPw ? strength.color : 'text-muted-foreground/40'}`}>
                      {userPw ? t('strength.passwordLabel', { label: strength.label }) : t('strength.noPassword')}
                    </p>
                  </div>
                  {userPw && <div className="flex gap-1">{[0, 1, 2, 3, 4].map(i => <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= strength.score ? strength.bg : 'bg-border'}`} />)}</div>}
                </div>
              </div>
            )}

            {pdfFile && (
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t('permissions.title')} Summary</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {[
                    { label: t('permissions.printing'), ok: print },
                    { label: t('permissions.printHighRes'), ok: print && printHQ },
                    { label: t('permissions.copyContent'), ok: copy },
                    { label: t('permissions.modify'), ok: modify },
                    { label: t('permissions.annotations'), ok: annot },
                    { label: t('permissions.fillForms'), ok: forms },
                    { label: t('permissions.assembling'), ok: assemble },
                  ].map(({ label, ok }) => (
                    <div key={label} className="flex items-center gap-2">
                      {ok ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        : <X className="w-3.5 h-3.5 text-red-400 shrink-0" />}
                      <span className={`text-xs ${ok ? 'text-foreground' : 'text-muted-foreground/50'}`}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pdfFile && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">{t('outputFilename')}</p>
                <div className="flex items-center">
                  <input value={outName} onChange={e => setOutName(e.target.value)} placeholder={t('placeholder.outputFilename')}
                    className="flex-1 px-4 py-3 rounded-l-xl border border-border bg-card text-foreground text-sm font-mono focus:outline-none focus:border-red-400 transition-all placeholder:text-muted-foreground/40"
                    aria-label={t('outputFilename')} />
                  <span className="px-3 py-3 rounded-r-xl border border-l-0 border-border bg-muted/40 text-muted-foreground text-sm font-mono">.pdf</span>
                </div>
              </div>
            )}

            {busy && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> {t('button.protecting')}</span>
                  <span className="font-bold text-red-500">{prog}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${prog}%` }} />
                </div>
              </div>
            )}

            {err && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="text-xs text-red-600 dark:text-red-400">{err}</span>
              </div>
            )}

            {resultKb !== null && !busy && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-900/10">
                <Lock className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t('result.success')}</p>
                  <p className="text-xs text-muted-foreground">{outName || 'protected'}.pdf · {fmtSize(resultKb)}</p>
                </div>
              </div>
            )}

            {pdfFile && (
              <button onClick={protect} disabled={!canGo}
                className="flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold shadow-sm transition-all active:scale-[0.98]">
                {busy ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t('button.protecting')}</>
                  : !userPw ? <><Lock className="w-4 h-4" /> {t('passwords.userPasswordHint')}</>
                    : !pwOk ? <><AlertTriangle className="w-4 h-4" /> {t('passwords.matchError')}</>
                      : <><Lock className="w-5 h-5" /> {t('button.protect')}</>}
              </button>
            )}

            <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                <strong>{t('passwordReminder.title')}</strong> {t('passwordReminder.description')}
              </p>
            </div>

            {!pdfFile && (
              <div className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-400" /> {t('howItWorks.title')}
                </p>
                <div className="flex flex-col gap-2 text-xs text-muted-foreground leading-relaxed">
                  <p><strong className="text-foreground">{t('howItWorks.userPassword')}</strong> — {t('howItWorks.userPasswordDesc')}</p>
                  <p><strong className="text-foreground">{t('howItWorks.ownerPassword')}</strong> — {t('howItWorks.ownerPasswordDesc')}</p>
                  <p><strong className="text-foreground">{t('howItWorks.permissions')}</strong> — {t('howItWorks.permissionsDesc')}</p>
                  <p><strong className="text-foreground">{t('howItWorks.compatibility')}</strong> — {t('howItWorks.compatibilityDesc')}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <HowToUse tKey="pdf-tools/ProtectPDFTool.json" count={4} />
        <FAQ tKey="pdf-tools/ProtectPDFTool.json" />
        <Examples tKey="pdf-tools/ProtectPDFTool.json" />

        {/* Related tools */}
        <RelatedTools />

      </div>
    </section>
  );
}

