import { NavLink, Outlet } from "react-router-dom";
import { depotOptions, useAppStore } from "../store/appStore";
import type { DepotId } from "@ge/shared";

const NAV = [
  { to: "/", label: "Tableau de bord" },
  { to: "/catalogue", label: "Catalogue" },
  { to: "/pos", label: "Vente comptoir" },
  { to: "/facturation", label: "Facturation" },
  { to: "/stock", label: "Stock multi-dépôts" },
  { to: "/transferts", label: "Transferts" },
  { to: "/achats", label: "Achats & fournisseurs" },
  { to: "/rh", label: "Personnel & droits" },
];

export default function Layout() {
  const depotId = useAppStore((s) => s.depotId);
  const setDepot = useAppStore((s) => s.setDepot);

  return (
    <div style={{ minHeight: "100vh" }}>
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__brand-mark">G&amp;E</span>
          <span className="app-header__brand-tag">Pièces &amp; consommables auto</span>
        </div>
        <div className="app-header__spacer" />
        <div className="app-header__depot">
          <span className="app-header__depot-label">Dépôt</span>
          <select
            className="input"
            value={depotId}
            onChange={(e) => setDepot(e.target.value as DepotId)}
          >
            {depotOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <div className="app-header__user">
          <div className="app-header__user-name">K. Assamoi</div>
          <div className="app-header__user-role">Direction · tous dépôts</div>
        </div>
      </header>

      <div className="app-shell">
        <nav className="app-nav">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                "app-nav__link" + (isActive ? " app-nav__link--active" : "")
              }
            >
              {n.label}
            </NavLink>
          ))}
          <div className="app-nav__sync">
            Firebase · synchro
            <br />
            <span className="app-nav__sync-status">à jour — 08:41</span>
          </div>
        </nav>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
