export interface PortalUser {
  name: string;
  email: string;
  uid: string;
  emailVerified: boolean;
  isStaff: boolean;
}
export function portalIdentity(account: { uid: string; email?: string | null; displayName?: string | null; emailVerified?: boolean }, claims: Record<string, unknown> = {}): PortalUser {
  return {
    uid: account.uid,
    name: account.displayName || account.email || 'Client',
    email: account.email || '',
    emailVerified: account.emailVerified === true,
    isStaff: claims.staff === true && claims.email_verified === true && account.emailVerified === true,
  };
}
export async function finishRegistration<T>(options: {
  existingAccount?: T | null;
  createAccount: () => Promise<T>;
  saveProfile: (account: T) => Promise<void>;
  notify?: () => Promise<unknown>;
}): Promise<{ account: T; profileSaved: boolean; notificationSent: boolean; error?: unknown }> {
  const account = options.existingAccount || await options.createAccount();
  try { await options.saveProfile(account); }
  catch (error) { return { account, profileSaved: false, notificationSent: false, error }; }
  if (options.notify) {
    try { await options.notify(); }
    catch (error) { return { account, profileSaved: true, notificationSent: false, error }; }
  }
  return { account, profileSaved: true, notificationSent: Boolean(options.notify) };
}
export function withPortalTimeout<T>(operation: Promise<T>, ms = 12000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('portal/timeout')), ms);
    operation.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}

/** Linking preserves ownership; a failed link must never silently create a second account. */
export async function createOrLinkAccount<T>(guest: { isAnonymous?: boolean } | null, link: () => Promise<T>, create: () => Promise<T>): Promise<T> {
  return guest?.isAnonymous ? link() : create();
}
