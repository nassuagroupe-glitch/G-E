import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Catalogue from "./pages/Catalogue";
import Login from "./pages/Login";
import Pos from "./pages/Pos";
import Facturation from "./pages/Facturation";
import Stock from "./pages/Stock";
import Transferts from "./pages/Transferts";
import Achats from "./pages/Achats";
import Rh from "./pages/Rh";
import { subscribeFirestoreData, useFirestoreData } from "./store/firestoreData";

export default function App() {
  const { user, staff, loading, missingStaffDoc, signOut } = useAuth();
  const dataLoading = useFirestoreData((s) => s.loading);

  useEffect(() => {
    if (!user) return;
    return subscribeFirestoreData();
  }, [user]);

  if (loading) {
    return <div style={{ padding: 40 }}>Chargement…</div>;
  }

  if (!user) {
    return <Login />;
  }

  if (missingStaffDoc) {
    return (
      <div style={{ padding: 40, maxWidth: 480 }}>
        <h1 className="page-title">Compte non provisionné</h1>
        <p className="page-subtitle">
          Votre connexion a fonctionné, mais aucune fiche collaborateur
          n'existe pour <b>{user.email}</b>. Demandez à la direction de vous
          ajouter dans l'écran Personnel &amp; droits.
        </p>
        <button className="btn btn-secondary" onClick={() => signOut()}>
          Se déconnecter
        </button>
      </div>
    );
  }

  if (dataLoading) {
    return <div style={{ padding: 40 }}>Chargement des données…</div>;
  }

  return (
    <Routes>
      <Route element={<Layout staff={staff!} />}>
        <Route index element={<Dashboard />} />
        <Route path="catalogue" element={<Catalogue />} />
        <Route path="pos" element={<Pos />} />
        <Route path="facturation" element={<Facturation />} />
        <Route path="stock" element={<Stock />} />
        <Route path="transferts" element={<Transferts />} />
        <Route path="achats" element={<Achats />} />
        <Route path="rh" element={<Rh />} />
      </Route>
    </Routes>
  );
}
