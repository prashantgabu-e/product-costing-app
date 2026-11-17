import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, authorizedEmail, firebaseConfigured } from './config'

export type AuthState = { user: User | null; status: 'loading' | 'signed-out' | 'authorized' | 'restricted'; error?: string }
export const isAuthorized = (user: User | null) => Boolean(user && user.email === authorizedEmail && user.emailVerified)
export function observeAuth(onChange: (state: AuthState) => void) {
  if (!auth) { onChange({ user: null, status: 'signed-out' }); return () => undefined }
  return onAuthStateChanged(auth, (user) => onChange({ user, status: isAuthorized(user) ? 'authorized' : user ? 'restricted' : 'signed-out' }), (error) => onChange({ user: null, status: 'signed-out', error: error.message }))
}
export async function signIn() {
  if (!auth || !firebaseConfigured) throw new Error('Firebase is not configured. Add values to your .env file.')
  const result = await signInWithPopup(auth, new GoogleAuthProvider())
  if (!isAuthorized(result.user)) { await signOut(auth); throw new Error('Access Restricted. This account is not authorized.') }
}
export async function signOutUser() { if (auth) await signOut(auth) }
