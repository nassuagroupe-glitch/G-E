import { type FormEvent, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { depotOptions, useAppStore } from "../store/appStore";
import type { DepotId, StaffMember } from "@ge/shared";

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

export default function Layout({ staff }: { staff: StaffMember }) {
  const navigate = useNavigate();
  const depotId = useAppStore((s) => s.depotId);
  const setDepot = useAppStore((s) => s.setDepot);
  const setQ = useAppStore((s) => s.setQ);
  const cart = useAppStore((s) => s.cart);
  const { signOut } = useAuth();
  const [searchDraft, setSearchDraft] = useState("");

  const cartCount = cart.reduce((a, l) => a + l.qte, 0);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setQ(searchDraft);
    navigate("/catalogue");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <div className="app-topbar">
        <span>Téléphone : (225) 07 08 41 22 (WhatsApp) · info@ge.ci</span>
        <div className="app-topbar__spacer" />
        <span>
          Bienvenue, {staff.nom} ({staff.role}) ·{" "}
          <button onClick={() => signOut()}>Déconnexion</button>
        </span>
      </div>

      <header className="app-header">
        <NavLink to="/" className="app-logo">
          <span className="app-logo__dark">G&amp;</span>
          <span className="app-logo__light">E</span>
        </NavLink>

        <form className="app-search" onSubmit={onSearch}>
          <input
            placeholder="Rechercher une pièce, une référence…"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
          />
          <button type="submit" aria-label="Rechercher">
            🔍
          </button>
        </form>

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

        <button className="app-cart-badge" onClick={() => navigate("/pos")}>
          🛒 Ticket en cours
          <span className="app-cart-badge__count">{cartCount}</span>
        </button>
      </header>

      <nav className="app-navbar">
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
      </nav>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
