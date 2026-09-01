import { collection, doc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";
import type { Doc, Part, PurchaseOrder, StaffMember, Supplier, Transfer } from "@ge/shared";
import { db } from "../firebase";

interface CaParDepot {
  name: string;
  v: number;
}

interface DataState {
  parts: Part[];
  docs: Doc[];
  transfers: Transfer[];
  purchaseOrders: PurchaseOrder[];
  suppliers: Supplier[];
  staff: StaffMember[];
  caParDepot: CaParDepot[];
  loading: boolean;
}

export const useFirestoreData = create<DataState>(() => ({
  parts: [],
  docs: [],
  transfers: [],
  purchaseOrders: [],
  suppliers: [],
  staff: [],
  caParDepot: [],
  loading: true,
}));

const COLLECTIONS = ["parts", "docs", "transfers", "purchaseOrders", "suppliers", "staff"] as const;

/**
 * Starts the Firestore listeners this store reads from. Firestore's
 * onSnapshot doesn't retry a permission-denied error on its own, so this
 * must be called only once the caller has a signed-in user — never at
 * module load — and its returned cleanup called on sign-out.
 */
export function subscribeFirestoreData(): () => void {
  useFirestoreData.setState({ loading: true });
  const pending = new Set<string>([...COLLECTIONS, "meta/dashboard"]);
  const markLoaded = (key: string) => {
    pending.delete(key);
    if (pending.size === 0) useFirestoreData.setState({ loading: false });
  };

  const unsubs = COLLECTIONS.map((name) =>
    onSnapshot(
      collection(db, name),
      (snap) => {
        // Each document already carries its own id as a field (ref/no/…),
        // stored that way by the seed script — a plain data() cast is enough.
        useFirestoreData.setState({ [name]: snap.docs.map((d) => d.data()) } as Partial<DataState>);
        markLoaded(name);
      },
      (err) => {
        console.error(`Firestore listener failed for ${name}:`, err);
        markLoaded(name);
      }
    )
  );

  unsubs.push(
    onSnapshot(
      doc(db, "meta", "dashboard"),
      (snap) => {
        useFirestoreData.setState({ caParDepot: snap.data()?.caParDepot ?? [] });
        markLoaded("meta/dashboard");
      },
      (err) => {
        console.error("Firestore listener failed for meta/dashboard:", err);
        markLoaded("meta/dashboard");
      }
    )
  );

  return () => unsubs.forEach((u) => u());
}
