import React, { createContext, useState, useContext, ReactNode, FC, useEffect, useRef, useCallback } from 'react';
import { onIdTokenChanged, EmailAuthProvider, linkWithCredential, linkWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup, signInWithCredential, sendPasswordResetEmail, sendEmailVerification, reload, getIdTokenResult, type User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebaseAuth';
import { useTranslation } from '../i18n';
import { portalText } from './portalText';
import { sendDraftTransfer, type PendingDraftTransfer, type DraftTransferNotice } from './draftTransfer';
import { portalIdentity, createOrLinkAccount, type PortalUser, withPortalTimeout } from './portalIdentity';

interface AuthContextType {
  user: PortalUser | null;
  loading: boolean;
  error: string | null;
  warning: string | null;
  login: (email: string, pass: string) => Promise<PortalUser>;
  loginWithGoogle: () => Promise<PortalUser>;
  logout: () => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<PortalUser>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const { language } = useTranslation();
  const transferProof = useRef<PendingDraftTransfer | null>(null);
  const [transferNotice, setTransferNotice] = useState<DraftTransferNotice>(null);
  const [transferring, setTransferring] = useState(false);
  const captureGuest = async () => {
    await withPortalTimeout(auth.authStateReady());
    const guest = auth.currentUser;
    if (!guest?.isAnonymous) return null;
    try { return { uid: guest.uid, token: await withPortalTimeout(guest.getIdToken()) }; }
    catch { return { uid: guest.uid, token: null }; }
  };
  const retryDraftTransfer = async () => {
    const pending = transferProof.current, destination = auth.currentUser;
    if (!pending || !destination || transferring) return;
    setTransferring(true);
    try {
      const result = await sendDraftTransfer(pending, destination, import.meta.env?.VITE_API_URL || '');
      transferProof.current = result.pending;
      setTransferNotice(result.notice);
    } finally { setTransferring(false); }
  };
  const transferAfterLogin = async (proof: Awaited<ReturnType<typeof captureGuest>>, destination: FirebaseUser) => {
    if (!proof || proof.uid === destination.uid) return;
    if (!proof.token) { setTransferNotice('draftTransferManual'); return; }
    transferProof.current = { sourceUid: proof.uid, sourceIdToken: proof.token, destinationUid: destination.uid, moved: 0, skipped: 0 };
    await retryDraftTransfer();
  };
  const version = useRef(0);
  const mounted = useRef(true);
  const resolveAccount = useCallback(async (account: FirebaseUser): Promise<PortalUser> => {
    const token = await withPortalTimeout(getIdTokenResult(account));
    return portalIdentity(account, token.claims);
  }, []);
  useEffect(() => {
    mounted.current = true;
    const timeout = setTimeout(() => { if (mounted.current) { setError('auth/network-request-failed'); setLoading(false); } }, 12000);
    const unsubscribe = onIdTokenChanged(auth, async account => {
      const current = ++version.current;
      try {
        const next = account && !account.isAnonymous ? await resolveAccount(account) : null;
        if (mounted.current && current === version.current) { setUser(next); setError(null); }
      } catch (err: any) {
        if (mounted.current && current === version.current) { setUser(null); setError(err.code || 'auth/network-request-failed'); }
      } finally {
        clearTimeout(timeout);
        if (mounted.current && current === version.current) setLoading(false);
      }
    }, err => { clearTimeout(timeout); if (mounted.current) { setError((err as { code?: string }).code || 'auth/network-request-failed'); setLoading(false); } });
    return () => { mounted.current = false; version.current++; clearTimeout(timeout); unsubscribe(); };
  }, [resolveAccount]);
  const refreshUser = async () => {
    setLoading(true);
    try {
      const account = auth.currentUser;
      if (!account || account.isAnonymous) { setUser(null); return; }
      await withPortalTimeout(reload(account));
      await withPortalTimeout(account.getIdToken(true));
      setUser(await resolveAccount(account)); setError(null);
    } catch (err: any) { setError(err.code || 'auth/network-request-failed'); throw err; }
    finally { setLoading(false); }
  };
  const login = async (email: string, password: string) => {
    const guestProof = await captureGuest();
    const result = await withPortalTimeout(signInWithEmailAndPassword(auth, email.trim(), password));
    const next = await resolveAccount(result.user);
    setUser(next); setError(null); setWarning(null);
    await transferAfterLogin(guestProof, result.user);
    return next;
  };
  const register = async (name: string, email: string, password: string) => {
    await withPortalTimeout(auth.authStateReady());
    const guest = auth.currentUser;
    const result = await createOrLinkAccount(guest, () => linkWithCredential(guest!, EmailAuthProvider.credential(email.trim(), password)), () => createUserWithEmailAndPassword(auth, email.trim(), password));
    // Creation is committed: optional profile/email failures must not trigger a second signup.
    try { await withPortalTimeout(updateProfile(result.user, { displayName: name.trim() })); }
    catch { setWarning('profile-pending'); }
    try { await withPortalTimeout(sendEmailVerification(result.user)); }
    catch { setWarning('verification-pending'); }
    let next: PortalUser;
    try { next = await resolveAccount(result.user); }
    catch { next = portalIdentity(result.user); setWarning('token-pending'); }
    setUser(next); setError(null); return next;
  };
  const loginWithGoogle = async () => {
    await withPortalTimeout(auth.authStateReady());
    const guest = auth.currentUser;
    const guestProof = await captureGuest();
    const provider = new GoogleAuthProvider();
    let result;
    try { result = await createOrLinkAccount(guest, () => linkWithPopup(guest!, provider), () => signInWithPopup(auth, provider)); }
    catch (error: any) {
      const credential = ['auth/credential-already-in-use', 'auth/email-already-in-use'].includes(error?.code) ? GoogleAuthProvider.credentialFromError(error) : null;
      if (!credential) throw error;
      result = await withPortalTimeout(signInWithCredential(auth, credential));
    }
    const next = await resolveAccount(result.user);
    setUser(next); setError(null);
    await transferAfterLogin(guestProof, result.user);
    return next;
  };
  const logout = async () => {
    await signOut(auth); version.current++;
    transferProof.current = null; setTransferNotice(null);
    try {
      for (const key of Object.keys(localStorage)) {
        if (['kraken_consultation_data_v2', 'pending_booking', 'kraken_email_history', 'kraken_confirm_status', 'kraken_last_author'].includes(key) || /^kraken_(email_history_|confirm_status_|team_notes_)/.test(key)) localStorage.removeItem(key);
      }
    } catch { /* Storage may be unavailable; Firebase sign-out already completed. */ }
    setUser(null); setError(null); setWarning(null);
  };
  const resetPassword = async (email: string) => {
    try { await withPortalTimeout(sendPasswordResetEmail(auth, email.trim())); }
    catch (err: any) { if (err.code !== 'auth/user-not-found') throw err; }
  };
  const resendVerification = async () => {
    if (!auth.currentUser || auth.currentUser.isAnonymous) throw new Error('auth/requires-recent-login');
    if (!auth.currentUser.emailVerified) await withPortalTimeout(sendEmailVerification(auth.currentUser));
    setWarning(null);
  };
  return <AuthContext.Provider value={{ user, loading, error, warning, login, register, loginWithGoogle, logout, resetPassword, resendVerification, refreshUser }}>{children}
    {transferNotice && <aside role="status" className="fixed bottom-24 left-4 right-4 z-[90] mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-900 shadow-xl">
      <p>{portalText(language, transferNotice)}</p>
      <div className="mt-2 flex flex-wrap gap-3">
        {transferProof.current && <button type="button" disabled={transferring} onClick={() => { void retryDraftTransfer(); }} className="min-h-11 rounded-lg bg-blue-700 px-4 text-white disabled:opacity-60">{portalText(language, transferring ? 'loading' : 'retry')}</button>}
        {!transferProof.current && <button type="button" onClick={() => { window.location.reload(); }} className="min-h-11 rounded-lg border border-slate-400 px-4">{portalText(language, 'draftTransferReload')}</button>}
        {!transferProof.current && <button type="button" onClick={() => { setTransferNotice(null); }} className="min-h-11 rounded-lg px-3">{portalText(language, 'draftTransferHide')}</button>}
      </div>
    </aside>}
  </AuthContext.Provider>;
};
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
