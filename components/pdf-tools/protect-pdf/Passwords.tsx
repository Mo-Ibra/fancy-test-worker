import { KeyRound, AlertTriangle } from "lucide-react";
import PasswordInput from "./PasswordInput";
import { useT } from "@/context/TranslationProvider";

type PasswordsProps = {
  t: ReturnType<typeof useT>;
  userPw: string;
  setUserPw: (value: string) => void;
  confirmPw: string;
  setConfirmPw: (value: string) => void;
  useOwner: boolean;
  setUseOwner: (value: boolean) => void;
  ownerPw: string;
  setOwnerPw: (value: string) => void;
  pwOk: boolean;
};

export default function Passwords({ t, userPw, setUserPw, confirmPw, setConfirmPw, useOwner, setUseOwner, ownerPw, setOwnerPw, pwOk }: PasswordsProps) {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <KeyRound className="w-3.5 h-3.5 text-red-400" /> {t('passwords.title')}
      </p>
      <PasswordInput id="upw" label={t('passwords.userPassword')} showStrength
        value={userPw} onChange={setUserPw} placeholder={t('passwords.userPasswordPlaceholder')} sub={t('passwords.userPasswordRequired')} />
      <PasswordInput id="cpw" label={t('passwords.confirm')}
        value={confirmPw} onChange={setConfirmPw} placeholder={t('passwords.confirmPlaceholder')} />
      {confirmPw && !pwOk && (
        <p className="text-xs text-red-500 flex items-center gap-1 -mt-2">
          <AlertTriangle className="w-3.5 h-3.5" /> {t('passwords.matchError')}
        </p>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
        <div>
          <p className="text-xs font-semibold text-foreground">{t('passwords.ownerAdmin')}</p>
          <p className="text-[10px] text-muted-foreground">{t('passwords.ownerAdminHint')}</p>
        </div>
        <button onClick={() => setUseOwner(!useOwner)}
          className={`relative shrink-0 rounded-full transition-colors ${useOwner ? 'bg-red-500' : 'bg-border'}`} style={{ width: 36, height: 20 }}>
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${useOwner ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {useOwner && (
        <PasswordInput id="opw" label={t('passwords.ownerPassword')}
          value={ownerPw} onChange={setOwnerPw} placeholder={t('passwords.ownerPasswordPlaceholder')} sub={t('passwords.ownerPasswordCanChange')} />
      )}
    </div>
  )
}