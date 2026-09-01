import { create } from "zustand";
import {
  addToCart,
  bumpCartLine,
  DEPOTS,
  DOCS,
  nextTransferEtat,
  TRANSFERS,
  type CartLine,
  type DepotId,
  type Part,
  type Transfer,
} from "@ge/shared";

interface AppState {
  depotId: DepotId;
  q: string;
  marque: string;
  cat: string;
  scanHint: string;

  cart: CartLine[];
  pay: string;
  posMsg: string;

  tab: string;
  selNo: string;
  factMsg: string;

  transfers: Transfer[];

  setDepot: (id: DepotId) => void;
  setQ: (q: string) => void;
  setMarque: (marque: string) => void;
  setCat: (cat: string) => void;
  scan: () => void;

  addPart: (part: Part) => void;
  bumpLine: (ref: string, delta: number) => void;
  setPay: (pay: string) => void;
  encaisser: () => void;
  editerDevis: () => void;
  clearPosMsg: () => void;

  setTab: (tab: string) => void;
  selectDoc: (no: string) => void;
  convertDoc: () => void;
  print80: () => void;
  avoir: () => void;

  advanceTransfer: (no: string) => void;
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

  tab: "Tous",
  selNo: DOCS[0]?.no ?? "",
  factMsg: "",

  transfers: TRANSFERS.map((t) => ({ ...t })),

  setDepot: (depotId) => set({ depotId }),
  setQ: (q) => set({ q }),
  setMarque: (marque) => set({ marque }),
  setCat: (cat) => set({ cat }),
  scan: () =>
    set({
      q: "6001234500123",
      scanHint: "Code 6001234500123 lu — plaquettes de frein avant.",
    }),

  addPart: (part) =>
    set((s) => ({ cart: addToCart(s.cart, part), posMsg: "" })),
  bumpLine: (ref, delta) =>
    set((s) => ({ cart: bumpCartLine(s.cart, ref, delta) })),
  setPay: (pay) => set({ pay }),
  encaisser: () =>
    set((s) =>
      s.cart.length
        ? {
            cart: [],
            posMsg:
              "Encaissé en " +
              s.pay.toLowerCase() +
              " — ticket 80 mm envoyé à l'imprimante, stock décrémenté sur Firebase.",
          }
        : { posMsg: "Ticket vide." }
    ),
  editerDevis: () =>
    set((s) => ({
      posMsg: s.cart.length ? "Devis DV-2026-0208 créé, valable 15 jours." : "Ticket vide.",
    })),
  clearPosMsg: () => set({ posMsg: "" }),

  setTab: (tab) => set({ tab }),
  selectDoc: (selNo) => set({ selNo, factMsg: "" }),
  convertDoc: () => {
    const doc = DOCS.find((d) => d.no === get().selNo) ?? DOCS[0];
    set({
      factMsg:
        doc.type === "Devis"
          ? "Devis converti — facture FA-2026-0419 émise et stock réservé."
          : "Copie créée en brouillon.",
    });
  },
  print80: () => set({ factMsg: "Rendu 80 mm envoyé à l'imprimante thermique du comptoir." }),
  avoir: () => {
    const doc = DOCS.find((d) => d.no === get().selNo) ?? DOCS[0];
    set({ factMsg: "Avoir AV-2026-0022 initialisé sur " + doc.no + "." });
  },

  advanceTransfer: (no) =>
    set((s) => ({
      transfers: s.transfers.map((t) => {
        if (t.no !== no) return t;
        const next = nextTransferEtat(t.etat);
        return next ? { ...t, etat: next as Transfer["etat"] } : t;
      }),
    })),
}));

export const depotOptions = DEPOTS;
