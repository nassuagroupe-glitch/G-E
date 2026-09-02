import type { StaffMember } from "@ge/shared";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
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
  /** `remember` picks the session's persistence: kept across browser
   * restarts (true) or cleared when the tab/browser closes (false). */
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [staffResolved, setStaffResolved] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (u) => {
    setUser(u);
    setAuthResolved(true);
    if (!u) {
      setStaff(null);
      setStaffResolved(true);
    }
  }), []);

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
    signIn: async (email, password, remember) => {
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
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
