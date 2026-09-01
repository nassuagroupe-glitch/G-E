import { DEPOTS, TAUX_TVA } from "./data";
import type { CartLine, Depot, DepotId, Doc, Part, StockAlert } from "./types";

/** Formatte un montant en francs CFA — ex. formatCFA(19500) === "19 500 F". */
export function formatCFA(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F";
}

export function totalStock(part: Part): number {
  return Object.values(part.stock).reduce((a, b) => a + b, 0);
}

export function depotById(id: DepotId, depots: Depot[] = DEPOTS): Depot {
  return depots.find((d) => d.id === id) ?? depots[0];
}

export interface CatalogueFilter {
  q?: string;
  marque?: string;
  cat?: string;
}

export function filterParts(parts: Part[], filter: CatalogueFilter): Part[] {
  const { q = "", marque = "Toutes", cat = "Toutes" } = filter;
  const s = q.trim().toLowerCase();
  return parts.filter((p) => {
    if (marque !== "Toutes" && p.marque !== marque) return false;
    if (cat !== "Toutes" && p.cat !== cat) return false;
    if (!s) return true;
    return [p.ref, p.oem, p.nom, p.cat, p.compat, p.cb].join(" ").toLowerCase().includes(s);
  });
}

export function distinctMarques(parts: Part[]): string[] {
  return ["Toutes", ...Array.from(new Set(parts.map((p) => p.marque)))];
}

export function distinctCategories(parts: Part[]): string[] {
  return ["Toutes", ...Array.from(new Set(parts.map((p) => p.cat)))];
}

export function addToCart(cart: CartLine[], part: Part): CartLine[] {
  const i = cart.findIndex((l) => l.ref === part.ref);
  if (i >= 0) {
    const next = cart.slice();
    next[i] = { ...next[i], qte: next[i].qte + 1 };
    return next;
  }
  return [...cart, { ref: part.ref, nom: part.nom, pu: part.pv, qte: 1 }];
}

export function bumpCartLine(cart: CartLine[], ref: string, delta: number): CartLine[] {
  return cart
    .map((l) => (l.ref === ref ? { ...l, qte: l.qte + delta } : l))
    .filter((l) => l.qte > 0);
}

export interface Totals {
  ht: number;
  tva: number;
  ttc: number;
}

export function cartTotals(cart: CartLine[]): Totals {
  const ht = cart.reduce((a, l) => a + l.pu * l.qte, 0);
  return { ht, tva: ht * TAUX_TVA, ttc: ht * (1 + TAUX_TVA) };
}

export function docTotals(doc: Doc): Totals {
  const ht = doc.lignes.reduce((a, l) => a + l.pu * l.qte, 0);
  return { ht, tva: ht * TAUX_TVA, ttc: ht * (1 + TAUX_TVA) };
}

export function montantEnLettres(ttc: number): string {
  return formatCFA(ttc).replace(" F", " francs CFA");
}

/**
 * Alertes de réapprovisionnement — un dépôt est en alerte pour une pièce
 * dès que son stock local descend au quart (arrondi) du seuil global.
 */
export function lowStockAlerts(parts: Part[], depots: Depot[] = DEPOTS): StockAlert[] {
  const alerts: StockAlert[] = [];
  for (const p of parts) {
    for (const d of depots) {
      const qte = p.stock[d.id] ?? 0;
      if (qte <= Math.round(p.seuil / 4)) {
        alerts.push({ nom: p.nom, ref: p.ref, seuil: p.seuil, depot: d.name, qte });
      }
    }
  }
  return alerts;
}

/** Formatte une date en français, avec "1er" pour le premier du mois. */
export function formatDateFR(date: Date = new Date()): string {
  const weekday = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(date);
  const month = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date);
  const day = date.getDate();
  const dayLabel = day === 1 ? "1er" : String(day);
  const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${capitalized} ${dayLabel} ${month} ${date.getFullYear()}`;
}

export function nextTransferEtat(etat: string): string | null {
  const flow: Record<string, string> = { "Préparé": "En route", "En route": "Reçu" };
  return flow[etat] ?? null;
}
