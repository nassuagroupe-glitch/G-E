import type { StaffMember } from "@ge/shared";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";

interface AuthContextValue {
  user: User | null;
  staff: StaffMember | null;
  /** true while we don't yet know the auth/staff state. */
  loading: boolean;
  /** set once we have a signed-in user but no matching staff/{uid} doc. */
  missingStaffDoc: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [staffResolved, setStaffResolved] = useState(false);

  // AsyncStorage-backed auth persistence is always on for RN Firebase, but a
  // login is mandatory on every app launch (each cashier signs in fresh —
  // the cashierUid on a sale must match whoever is actually at the till),
  // so any restored session is dropped before it ever reaches the UI.
  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      await firebaseSignOut(auth);
      if (cancelled) return;
      unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setAuthResolved(true);
        if (!u) {
          setStaff(null);
          setStaffResolved(true);
        }
      });
    })();
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    setStaffResolved(false);
    return onSnapshot(doc(db, "staff", user.uid), (snap) => {
      setStaff(snap.exists() ? (snap.data() as StaffMember) : null);
      setStaffResolved(true);
    });
  }, [user]);

  const value: AuthContextValue = {
    user,
    staff,
    loading: !authResolved || (!!user && !staffResolved),
    missingStaffDoc: !!user && staffResolved && !staff,
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    signOut: () => firebaseSignOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
