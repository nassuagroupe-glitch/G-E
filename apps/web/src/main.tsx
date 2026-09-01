import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./styles/tokens.css";
import "./styles/app.css";

// HashRouter — the same build is loaded from a static web host and from
// Electron's file:// origin, where a plain history-API router can't resolve
// deep links without server rewrite rules.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
