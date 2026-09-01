import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DEPOTS,
  PARTS,
  depotById,
  distinctCategories,
  distinctMarques,
  filterParts,
  formatCFA,
  totalStock,
} from "@ge/shared";
import { useAppStore } from "../store/appStore";

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

  const depot = depotById(depotId);
  const marques = useMemo(() => distinctMarques(PARTS), []);
  const cats = useMemo(() => distinctCategories(PARTS), []);
  const parts = useMemo(() => filterParts(PARTS, { q, marque, cat }), [q, marque, cat]);

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

      <table className="table">
        <thead>
          <tr>
            <th>Référence</th>
            <th>Désignation</th>
            <th>Compatibilité</th>
            <th style={{ textAlign: "right" }}>Stock total</th>
            <th style={{ textAlign: "right" }}>P.V. HT</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p) => (
            <tr key={p.ref}>
              <td className="num">
                {p.ref}
                <div className="small muted">OEM {p.oem}</div>
              </td>
              <td style={{ fontWeight: 600 }}>
                {p.nom}
                <div className="small muted" style={{ fontWeight: 400 }}>
                  {p.cat}
                </div>
              </td>
              <td style={{ fontSize: 13 }}>{p.compat}</td>
              <td className="num" style={{ textAlign: "right" }}>
                {totalStock(p)}
                <div className="small muted">
                  {DEPOTS.map((d) => d.short + " " + p.stock[d.id]).join(" · ")}
                </div>
              </td>
              <td className="num" style={{ textAlign: "right" }}>
                {formatCFA(p.pv)}
              </td>
              <td style={{ textAlign: "right" }}>
                <button
                  className="btn btn-ghost"
                  style={{ fontSize: 13, padding: "3px 10px" }}
                  onClick={() => {
                    addPart(p);
                    navigate("/pos");
                  }}
                >
                  Vendre
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
