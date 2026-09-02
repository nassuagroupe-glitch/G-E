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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../firebase";

// AsyncStorage-backed auth persistence is always on for RN Firebase — there's
// no per-sign-in "session vs local" toggle like on web. So "remember me"
// unchecked is implemented as: sign the restored session back out on the
// next cold start, forcing a fresh login.
const REMEMBER_KEY = "@ge/rememberMe";

interface AuthContextValue {
  user: User | null;
  staff: StaffMember | null;
  /** true while we don't yet know the auth/staff state. */
  loading: boolean;
  /** set once we have a signed-in user but no matching staff/{uid} doc. */
  missingStaffDoc: boolean;
  signIn: (email: string, password: string, remember: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [staffResolved, setStaffResolved] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        if (u && (await AsyncStorage.getItem(REMEMBER_KEY)) === "false") {
          await firebaseSignOut(auth);
          return; // onAuthStateChanged fires again with null
        }
        setUser(u);
        setAuthResolved(true);
        if (!u) {
          setStaff(null);
          setStaffResolved(true);
        }
      }),
    []
  );

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
      await AsyncStorage.setItem(REMEMBER_KEY, remember ? "true" : "false");
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
