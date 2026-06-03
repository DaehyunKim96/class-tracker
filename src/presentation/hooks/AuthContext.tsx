import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../infrastructure/firebase/client';
import { getUser } from '../../infrastructure/repositories/userRepository';
import type { User } from '../../application/domain';

type AuthState =
  | { status: 'loading' }
  | { status: 'unauthenticated' }
  | { status: 'needs-role'; firebaseUser: FirebaseUser }
  | { status: 'authenticated'; firebaseUser: FirebaseUser; user: User };

type AuthContextValue = {
  authState: AuthState;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setAuthState({ status: 'unauthenticated' });
        return;
      }

      try {
        const user = await getUser(firebaseUser.uid);
        if (!user) {
          setAuthState({ status: 'needs-role', firebaseUser });
        } else {
          setAuthState({ status: 'authenticated', firebaseUser, user });
        }
      } catch (err) {
        console.error('[AuthContext] Firestore 접근 실패 — 보안 규칙을 확인하세요:', err);
        // Firestore 권한 에러 시 needs-role로 fallback해서 검은 화면 방지
        setAuthState({ status: 'needs-role', firebaseUser });
      }
    });

    return unsub;
  }, []);

  function setUser(user: User) {
    setAuthState((prev) => {
      if (prev.status !== 'needs-role') return prev;
      return { status: 'authenticated', firebaseUser: prev.firebaseUser, user };
    });
  }

  return (
    <AuthContext.Provider value={{ authState, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
