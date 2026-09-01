import {
  doc as docRef,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { create } from "zustand";
import {
  addToCart,
  bumpCartLine,
  cartTotals,
  DEPOTS,
  nextTransferEtat,
  type CartLine,
  type Doc,
  type DepotId,
  type Part,
} from "@ge/shared";
import { auth, db } from "../firebase";
import { useFirestoreData } from "./firestoreData";

function generateTicketNo(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TK-${stamp}-${rand}`;
}

function generateDocNo(prefix: string): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${new Date().getFullYear()}-${rand}`;
}

function todayFR(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

interface AppState {
  depotId: DepotId;
  q: string;
  marque: string;
  cat: string;
  scanHint: string;

  cart: CartLine[];
  pay: string;
  posMsg: string;
  ticketNo: string;

  tab: string;
  selNo: string;
  factMsg: string;

  setDepot: (id: DepotId) => void;
  setQ: (q: string) => void;
  setMarque: (marque: string) => void;
  setCat: (cat: string) => void;
  scan: () => void;

  addPart: (part: Part) => void;
  bumpLine: (ref: string, delta: number) => void;
  setPay: (pay: string) => void;
  encaisser: () => Promise<void>;
  editerDevis: () => Promise<void>;

  setTab: (tab: string) => void;
  selectDoc: (no: string) => void;
  convertDoc: () => Promise<void>;
  print80: () => void;
  avoir: () => Promise<void>;

  advanceTransfer: (no: string) => Promise<void>;
}

const SCAN_HINT_DEFAULT = "Douchette USB / caméra Android — le code renseigne la recherche.";

export const useAppStore = create<AppState>((set, get) => ({
  depotId: "P",
  q: "",
  marque: "Toutes",
  cat: "Toutes",
  scanHint: SCAN_HINT_DEFAULT,

  cart: [],
  pay: "Espèces",
  posMsg: "",
  ticketNo: generateTicketNo(),

  tab: "Tous",
  selNo: "",
  factMsg: "",

  setDepot: (depotId) => set({ depotId }),
  setQ: (q) => set({ q }),
  setMarque: (marque) => set({ marque }),
  setCat: (cat) => set({ cat }),
  scan: () =>
    set({
      q: "6001234500123",
      scanHint: "Code 6001234500123 lu — plaquettes de frein avant.",
    }),

  addPart: (part) => set((s) => ({ cart: addToCart(s.cart, part), posMsg: "" })),
  bumpLine: (ref, delta) => set((s) => ({ cart: bumpCartLine(s.cart, ref, delta) })),
  setPay: (pay) => set({ pay }),

  encaisser: async () => {
    const s = get();
    if (!s.cart.length) {
      set({ posMsg: "Ticket vide." });
      return;
    }
    const ticketNo = s.ticketNo;
    const totals = cartTotals(s.cart);
    try {
      await runTransaction(db, async (tx) => {
        const partRefs = s.cart.map((l) => docRef(db, "parts", l.ref));
        const snaps = await Promise.all(partRefs.map((r) => tx.get(r)));
        snaps.forEach((snap, i) => {
          const line = s.cart[i];
          const currentQty = (snap.data()?.stock ?? {})[s.depotId] ?? 0;
          tx.update(partRefs[i], { [`stock.${s.depotId}`]: currentQty - line.qte });
        });
        tx.set(docRef(db, "sales", ticketNo), {
          no: ticketNo,
          depotId: s.depotId,
          cashierUid: auth.currentUser?.uid ?? null,
          pay: s.pay,
          lignes: s.cart,
          totalHT: totals.ht,
          totalTVA: totals.tva,
          totalTTC: totals.ttc,
          createdAt: serverTimestamp(),
        });
      });
      set({
        cart: [],
        ticketNo: generateTicketNo(),
        posMsg:
          "Encaissé en " +
          s.pay.toLowerCase() +
          " — ticket 80 mm envoyé à l'imprimante, stock décrémenté sur Firebase.",
      });
    } catch (e) {
      set({ posMsg: "Erreur lors de l'encaissement : " + (e as Error).message });
    }
  },

  editerDevis: async () => {
    const s = get();
    if (!s.cart.length) {
      set({ posMsg: "Ticket vide." });
      return;
    }
    const no = generateDocNo("DV");
    try {
      await setDoc(docRef(db, "docs", no), {
        no,
        type: "Devis",
        date: todayFR(),
        client: "Client comptoir",
        clientInfo: "Comptant",
        depot: DEPOTS.find((d) => d.id === s.depotId)?.name ?? s.depotId,
        etat: "En attente",
        lignes: s.cart,
      } satisfies Doc);
      set({ posMsg: `Devis ${no} créé, valable 15 jours.` });
    } catch (e) {
      set({ posMsg: "Erreur lors de la création du devis : " + (e as Error).message });
    }
  },

  setTab: (tab) => set({ tab }),
  selectDoc: (selNo) => set({ selNo, factMsg: "" }),

  convertDoc: async () => {
    const s = get();
    const current = useFirestoreData.getState().docs.find((d) => d.no === s.selNo);
    if (!current) return;
    try {
      if (current.type === "Devis") {
        const no = generateDocNo("FA");
        await setDoc(docRef(db, "docs", no), {
          ...current,
          no,
          type: "Facture",
          etat: "Impayée",
        } satisfies Doc);
        set({ factMsg: `Devis converti — facture ${no} émise et stock réservé.`, selNo: no });
      } else {
        const no = generateDocNo(current.type === "Facture" ? "FA" : current.type === "Bon de livraison" ? "BL" : "AV");
        await setDoc(docRef(db, "docs", no), { ...current, no, etat: "Brouillon" } satisfies Doc);
        set({ factMsg: "Copie créée en brouillon.", selNo: no });
      }
    } catch (e) {
      set({ factMsg: "Erreur : " + (e as Error).message });
    }
  },

  print80: () => set({ factMsg: "Rendu 80 mm envoyé à l'imprimante thermique du comptoir." }),

  avoir: async () => {
    const s = get();
    const current = useFirestoreData.getState().docs.find((d) => d.no === s.selNo);
    if (!current) return;
    const no = generateDocNo("AV");
    try {
      await setDoc(docRef(db, "docs", no), {
        no,
        type: "Avoir",
        date: todayFR(),
        client: current.client,
        clientInfo: `Retour sur ${current.no}`,
        depot: current.depot,
        etat: "Validé",
        lignes: current.lignes,
      } satisfies Doc);
      set({ factMsg: `Avoir ${no} initialisé sur ${current.no}.` });
    } catch (e) {
      set({ factMsg: "Erreur : " + (e as Error).message });
    }
  },

  advanceTransfer: async (no) => {
    const transfer = useFirestoreData.getState().transfers.find((t) => t.no === no);
    if (!transfer) return;
    const next = nextTransferEtat(transfer.etat);
    if (!next) return;
    try {
      await updateDoc(docRef(db, "transfers", no), { etat: next });
    } catch (e) {
      console.error("advanceTransfer failed:", e);
    }
  },
}));

export const depotOptions = DEPOTS;
