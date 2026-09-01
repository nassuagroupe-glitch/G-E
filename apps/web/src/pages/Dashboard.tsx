import { useMemo } from "react";
import {
  CA_PAR_DEPOT,
  DEPOTS,
  PARTS,
  depotById,
  formatCFA,
  formatDateFR,
  lowStockAlerts,
} from "@ge/shared";
import { useAppStore } from "../store/appStore";

export default function Dashboard() {
  const depotId = useAppStore((s) => s.depotId);
  const depot = depotById(depotId);

  const alerts = useMemo(() => lowStockAlerts(PARTS, DEPOTS), []);
  const maxCa = CA_PAR_DEPOT[0]?.v ?? 1;

  const kpis = [
    { label: "CA du jour", value: "2 148 500 F", note: "37 tickets · +12 % vs hier" },
    { label: "Encours clients", value: "8,4 M F", note: "dont 1,9 M échu" },
    { label: "Valeur du stock", value: "312 M F", note: "5 dépôts · 1 284 références" },
    { label: "Sous le seuil", value: String(alerts.length), note: "lignes à réapprovisionner" },
  ];

  return (
    <>
      <h1 className="page-title">Tableau de bord</h1>
      <p className="page-subtitle">
        {formatDateFR()} · {depot.name}
      </p>

      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-note">{k.note}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div>
          <h2 className="section-title">Ventes par dépôt — 30 jours</h2>
          {CA_PAR_DEPOT.map((d) => (
            <div className="depot-row" key={d.name}>
              <span className="depot-row__name">{d.name}</span>
              <span className="depot-row__bar">
                <span
                  className="depot-row__bar-fill"
                  style={{ width: Math.round((d.v / maxCa) * 100) + "%" }}
                />
              </span>
              <span className="depot-row__ca num">{formatCFA(d.v)}</span>
            </div>
          ))}
        </div>
        <div>
          <h2 className="section-title">Alertes de réapprovisionnement</h2>
          {alerts.slice(0, 6).map((a, i) => (
            <div className="alert-row" key={a.ref + a.depot + i}>
              <div className="alert-row__top">
                <span className="alert-row__name">{a.nom}</span>
                <span className="tag tag-accent-2">{a.qte} en stock</span>
              </div>
              <div className="alert-row__meta">
                {a.ref} · seuil {a.seuil} · {a.depot}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
