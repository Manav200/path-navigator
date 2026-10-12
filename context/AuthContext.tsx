"use client";

// context/AuthContext.tsx
// Provides Firebase auth state globally across the Next.js App Router.
// On first sign-in: migrates any existing localStorage data to Firestore.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnonymouslyUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser && !firebaseUser.isAnonymous) {
        const migrationKey = "pn_migrated_" + firebaseUser.uid;
        if (typeof window !== "undefined" && !localStorage.getItem(migrationKey)) {
          try {
            const { migrateLocalToFirestore } = await import("@/lib/db");
            await migrateLocalToFirestore(firebaseUser.uid);
            localStorage.setItem(migrationKey, "1");
          } catch (e) {
            console.warn("[Auth] Migration failed:", e);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
  }, []);

  const signInAnonymouslyUser = useCallback(async () => {
    await signInAnonymously(auth);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    if (typeof window !== "undefined") {
      localStorage.removeItem("pn_onboarding");
      localStorage.removeItem("pn_assessment");
      localStorage.removeItem("pn_dag_progress");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInAnonymouslyUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}