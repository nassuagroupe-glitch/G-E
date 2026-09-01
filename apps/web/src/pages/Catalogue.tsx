import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DEPOTS,
  depotById,
  distinctCategories,
  distinctMarques,
  filterParts,
  formatCFA,
  totalStock,
} from "@ge/shared";
import CategoryIcon from "../components/CategoryIcon";
import { useAppStore } from "../store/appStore";
import { useFirestoreData } from "../store/firestoreData";

export default function Catalogue() {
  const navigate = useNavigate();
  const depotId = useAppStore((s) => s.depotId);
  const q = useAppStore((s) => s.q);
  const marque = useAppStore((s) => s.marque);
  const cat = useAppStore((s) => s.cat);
  const scanHint = useAppStore((s) => s.scanHint);
  const setQ = useAppStore((s) => s.setQ);
  const setMarque = useAppStore((s) => s.setMarque);
  const setCat = useAppStore((s) => s.setCat);
  const scan = useAppStore((s) => s.scan);
  const addPart = useAppStore((s) => s.addPart);

  const allParts = useFirestoreData((s) => s.parts);
  const depot = depotById(depotId);
  const marques = useMemo(() => distinctMarques(allParts), [allParts]);
  const cats = useMemo(() => distinctCategories(allParts), [allParts]);
  const parts = useMemo(() => filterParts(allParts, { q, marque, cat }), [allParts, q, marque, cat]);

  return (
    <>
      <h1 className="page-title">Catalogue</h1>
      <p className="page-subtitle">
        {parts.length} références · {depot.name}
      </p>

      <div className="filters-row">
        <div className="filters-row__search">
          <label className="field-label">Recherche libre, réf. OEM ou code-barres</label>
          <input
            className="input"
            placeholder="ex. 45022-SNA · plaquettes · 6001234500123"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Marque</label>
          <select className="input" style={{ minWidth: 150 }} value={marque} onChange={(e) => setMarque(e.target.value)}>
            {marques.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Catégorie</label>
          <select className="input" style={{ minWidth: 160 }} value={cat} onChange={(e) => setCat(e.target.value)}>
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-secondary" onClick={scan}>
          Scanner
        </button>
      </div>
      <div className="scan-hint">{scanHint}</div>

      <div className="product-grid">
        {parts.map((p) => {
          const enStock = p.stock[depotId] > 0;
          return (
            <div className="product-card" key={p.ref}>
              <span className="product-card__cat">{p.cat}</span>
              <div className="product-card__icon">
                <CategoryIcon category={p.cat} />
              </div>
              <div className="product-card__name">{p.nom}</div>
              <div className="product-card__meta">
                {p.ref} · OEM {p.oem}
              </div>
              <div className="product-card__meta">{p.compat}</div>
              <div>
                <span className={enStock ? "tag tag-neutral" : "tag tag-accent-2"}>
                  {enStock ? `${p.stock[depotId]} en stock — ${depot.name}` : "Rupture ici"}
                </span>
              </div>
              <div className="small muted">
                Total {totalStock(p)} · {DEPOTS.map((d) => d.short + " " + p.stock[d.id]).join(" · ")}
              </div>
              <div className="product-card__footer">
                <span className="price num product-card__price">{formatCFA(p.pv)}</span>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: 13, padding: "6px 14px" }}
                  onClick={() => {
                    addPart(p);
                    navigate("/pos");
                  }}
                >
                  Vendre
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
