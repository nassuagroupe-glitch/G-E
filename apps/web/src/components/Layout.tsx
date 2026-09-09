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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="21" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {open ? (
        <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      )}
    </svg>
  );
}

export default function Layout({ staff }: { staff: StaffMember }) {
  const navigate = useNavigate();
  const depotId = useAppStore((s) => s.depotId);
  const setDepot = useAppStore((s) => s.setDepot);
  const setQ = useAppStore((s) => s.setQ);
  const cart = useAppStore((s) => s.cart);
  const { signOut } = useAuth();
  const [searchDraft, setSearchDraft] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const cartCount = cart.reduce((a, l) => a + l.qte, 0);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    setQ(searchDraft);
    navigate("/catalogue");
    setNavOpen(false);
  };

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>

      <div className="app-topbar">
        <span>Téléphone : (225) 07 08 41 22 (WhatsApp) · info@ge.ci</span>
        <div className="app-topbar__spacer" />
        <span>
          Bienvenue, {staff.nom} ({staff.role}) ·{" "}
          <button onClick={() => signOut()}>Déconnexion</button>
        </span>
      </div>

      <header className="app-header">
        <NavLink to="/" className="app-logo" aria-label="G&E — Accueil">
          <span className="app-logo__dark">G&amp;</span>
          <span className="app-logo__light">E</span>
        </NavLink>

        <button
          type="button"
          className="app-navbar-toggle"
          aria-expanded={navOpen}
          aria-controls="app-navbar"
          aria-label={navOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setNavOpen((v) => !v)}
        >
          <MenuIcon open={navOpen} />
        </button>

        <form className="app-search" onSubmit={onSearch} role="search">
          <label htmlFor="app-search-input" className="sr-only">
            Rechercher une pièce ou une référence
          </label>
          <input
            id="app-search-input"
            placeholder="Rechercher une pièce, une référence…"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
          />
          <button type="submit" aria-label="Rechercher">
            <SearchIcon />
          </button>
        </form>

        <div className="app-header__depot">
          <label htmlFor="app-depot-select" className="app-header__depot-label">
            Dépôt
          </label>
          <select
            id="app-depot-select"
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
          <CartIcon />
          Ticket en cours
          <span className="app-cart-badge__count" aria-label={`${cartCount} article(s) au panier`}>
            {cartCount}
          </span>
        </button>
      </header>

      <nav
        id="app-navbar"
        className={"app-navbar" + (navOpen ? " app-navbar--open" : "")}
        aria-label="Navigation principale"
      >
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === "/"}
            className={({ isActive }) =>
              "app-nav__link" + (isActive ? " app-nav__link--active" : "")
            }
            onClick={() => setNavOpen(false)}
          >
            {n.label}
          </NavLink>
        ))}
      </nav>

      <main id="main-content" className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
