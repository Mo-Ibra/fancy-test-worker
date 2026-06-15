import { ShieldCheck } from "lucide-react";
import PermRow from "./PermRow";
import { useT } from "@/context/TranslationProvider";

type PermissionsProps = {
  t: ReturnType<typeof useT>;
  print: boolean;
  setPrint: (value: boolean) => void;
  printHQ: boolean;
  setPrintHQ: (value: boolean) => void;
  copy: boolean;
  setCopy: (value: boolean) => void;
  modify: boolean;
  setModify: (value: boolean) => void;
  annot: boolean;
  setAnnot: (value: boolean) => void;
  forms: boolean;
  setForms: (value: boolean) => void;
  assemble: boolean;
  setAssemble: (value: boolean) => void;
};

export default function Permissions({ t, print, setPrint, printHQ, setPrintHQ, copy, setCopy, modify, setModify, annot, setAnnot, forms, setForms, assemble, setAssemble }: PermissionsProps) {
  return (
    <div className="flex flex-col p-5 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> {t('permissions.title')}
      </p>
      <p className="text-[10px] text-muted-foreground mb-3">{t('permissions.whatUsersCanDo')}</p>
      <PermRow label={t('permissions.printLowQuality')} sub={t('permissions.printLowQualitySub')} checked={print} onChange={setPrint} />
      <PermRow label={t('permissions.printHighQuality')} sub={t('permissions.printHighQualitySub')} checked={printHQ} onChange={setPrintHQ} disabled={!print} />
      <PermRow label={t('permissions.copyTextImages')} sub={t('permissions.copyTextImagesSub')} checked={copy} onChange={setCopy} />
      <PermRow label={t('permissions.modifyContent')} sub={t('permissions.modifyContentSub')} checked={modify} onChange={setModify} />
      <PermRow label={t('permissions.addAnnotations')} sub={t('permissions.addAnnotationsSub')} checked={annot} onChange={setAnnot} />
      <PermRow label={t('permissions.fillFormFields')} sub={t('permissions.fillFormFieldsSub')} checked={forms} onChange={setForms} />
      <PermRow label={t('permissions.assembleDocument')} sub={t('permissions.assembleDocumentSub')} checked={assemble} onChange={setAssemble} />
    </div>
  )
}