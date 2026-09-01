import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Catalogue from "./pages/Catalogue";
import Pos from "./pages/Pos";
import Facturation from "./pages/Facturation";
import Stock from "./pages/Stock";
import Transferts from "./pages/Transferts";
import Achats from "./pages/Achats";
import Rh from "./pages/Rh";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
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
