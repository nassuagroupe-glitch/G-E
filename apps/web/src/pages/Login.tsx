import { useState, type FormEvent } from "react";
import { useAuth } from "../auth/AuthProvider";
import loginBackground from "../assets/login-background.jpg";

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(email, password);
    } catch {
      setError("Adresse e-mail ou mot de passe incorrect.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: 360,
          padding: "40px 36px",
          background: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: 34,
              letterSpacing: "-0.02em",
            }}
          >
            G&amp;E
          </span>
          <p className="muted" style={{ marginTop: 4 }}>
            Pièces &amp; consommables auto
          </p>
        </div>

        <label className="field-label">Adresse e-mail</label>
        <input
          className="input"
          style={{ marginBottom: 14 }}
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="field-label">Mot de passe</label>
        <input
          className="input"
          style={{ marginBottom: 20 }}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {busy ? "Connexion…" : "Se connecter"}
        </button>

        {error && <div className="flash-msg" style={{ textAlign: "center" }}>{error}</div>}
      </form>
    </div>
  );
}
