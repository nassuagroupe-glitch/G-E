import { useMemo } from "react";
import { MOYENS_PAIEMENT, cartTotals, depotById, filterParts, formatCFA } from "@ge/shared";
import { useAuth } from "../auth/AuthProvider";
import { useAppStore } from "../store/appStore";
import { useFirestoreData } from "../store/firestoreData";

export default function Pos() {
  const { staff } = useAuth();
  const depotId = useAppStore((s) => s.depotId);
  const q = useAppStore((s) => s.q);
  const marque = useAppStore((s) => s.marque);
  const cat = useAppStore((s) => s.cat);
  const setQ = useAppStore((s) => s.setQ);
  const addPart = useAppStore((s) => s.addPart);
  const cart = useAppStore((s) => s.cart);
  const bumpLine = useAppStore((s) => s.bumpLine);
  const pay = useAppStore((s) => s.pay);
  const setPay = useAppStore((s) => s.setPay);
  const posMsg = useAppStore((s) => s.posMsg);
  const ticketNo = useAppStore((s) => s.ticketNo);
  const encaisser = useAppStore((s) => s.encaisser);
  const editerDevis = useAppStore((s) => s.editerDevis);
  const allParts = useFirestoreData((s) => s.parts);

  const depot = depotById(depotId);
  const parts = useMemo(() => filterParts(allParts, { q, marque, cat }), [allParts, q, marque, cat]);
  const totals = cartTotals(cart);

  return (
    <>
      <h1 className="page-title">Vente comptoir</h1>
      <p className="page-subtitle">
        Ticket {ticketNo} · {depot.name} · caissier {staff?.nom}
      </p>

      <div className="pos-grid">
        <div>
          <input
            className="input pos-search"
            placeholder="Scanner ou saisir une référence…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {parts.map((p) => (
            <button key={p.ref} className="pos-part-btn" onClick={() => addPart(p)}>
              <span>
                <span className="pos-part-btn__name">{p.nom}</span>
                <span className="pos-part-btn__meta">
                  {p.ref} · {p.stock[depotId]} en rayon
                </span>
              </span>
              <span className="num">{formatCFA(p.pv)}</span>
            </button>
          ))}
        </div>

        <div>
          <h2 className="section-title">Ticket en cours</h2>
          {cart.length === 0 && (
            <p className="cart-empty">Aucun article. Scannez une pièce ou choisissez-la à gauche.</p>
          )}
          {cart.map((l) => (
            <div className="cart-line" key={l.ref}>
              <span>
                <span className="cart-line__name">{l.nom}</span>
                <span className="cart-line__meta">
                  {l.ref} · {formatCFA(l.pu)}
                </span>
              </span>
              <span className="cart-line__qty">
                <button className="btn btn-ghost cart-line__qty-btn" onClick={() => bumpLine(l.ref, -1)}>
                  −
                </button>
                <span className="cart-line__qty-val num">{l.qte}</span>
                <button className="btn btn-ghost cart-line__qty-btn" onClick={() => bumpLine(l.ref, 1)}>
                  +
                </button>
              </span>
              <span className="cart-line__total num">{formatCFA(l.pu * l.qte)}</span>
            </div>
          ))}

          <div className="totals-grid num">
            <span className="muted">Total HT</span>
            <span style={{ textAlign: "right" }}>{formatCFA(totals.ht)}</span>
            <span className="muted">TVA 18 %</span>
            <span style={{ textAlign: "right" }}>{formatCFA(totals.tva)}</span>
            <span className="totals-grid__net-label">Net à payer</span>
            <span className="totals-grid__net-value">{formatCFA(totals.ttc)}</span>
          </div>

          <div className="payment-row">
            {MOYENS_PAIEMENT.map((p) => (
              <button
                key={p}
                className={"pill" + (pay === p ? " pill-active" : "")}
                onClick={() => setPay(p)}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="action-row">
            <button className="btn btn-primary" style={{ fontSize: 15 }} onClick={encaisser}>
              Encaisser &amp; imprimer
            </button>
            <button className="btn btn-ghost" style={{ fontSize: 15 }} onClick={editerDevis}>
              Éditer un devis
            </button>
          </div>
          <div className="flash-msg">{posMsg}</div>
        </div>
      </div>
    </>
  );
}
