import { formatCFA, type PurchaseOrderEtat } from "@ge/shared";
import { useFirestoreData } from "../store/firestoreData";

const TAG_CLASS: Record<PurchaseOrderEtat, string> = {
  "Réceptionnée": "tag tag-neutral",
  "En transit": "tag tag-accent",
  "Dédouanement": "tag tag-outline",
};

export default function Achats() {
  const purchaseOrders = useFirestoreData((s) => s.purchaseOrders);
  const suppliers = useFirestoreData((s) => s.suppliers);
  return (
    <>
      <h1 className="page-title">Achats &amp; fournisseurs</h1>
      <p className="page-subtitle">Commandes en cours et encours fournisseurs</p>
      <div className="achats-grid grid-split-6-6">
        <div>
          <h2 className="section-title">Commandes fournisseurs</h2>
          {purchaseOrders.map((c) => (
            <div className="list-row" key={c.no}>
              <div className="list-row__top">
                <span className="list-row__name">{c.fournisseur}</span>
                <span className="num">{formatCFA(c.montant)}</span>
              </div>
              <div className="list-row__meta">
                {c.no} · {c.date} · {c.lignes} lignes ·{" "}
                <span className={TAG_CLASS[c.etat]}>{c.etat}</span>
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="section-title">Fournisseurs</h2>
          {suppliers.map((f) => (
            <div className="list-row" key={f.nom}>
              <div className="list-row__top">
                <span className="list-row__name">{f.nom}</span>
                <span className="num" style={{ color: "var(--color-neutral-700)" }}>
                  {f.encours ? formatCFA(f.encours) : "soldé"}
                </span>
              </div>
              <div className="list-row__meta">
                {f.pays} · {f.familles}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
