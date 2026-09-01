import { STAFF } from "@ge/shared";

export default function Rh() {
  return (
    <>
      <h1 className="page-title">Personnel &amp; droits</h1>
      <p className="page-subtitle">
        {STAFF.length} collaborateurs · rôles Firebase appliqués à la connexion
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Collaborateur</th>
            <th>Rôle</th>
            <th>Dépôt</th>
            <th>Droits</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {STAFF.map((s) => (
            <tr key={s.tel}>
              <td style={{ fontWeight: 600 }}>
                {s.nom}
                <div className="small muted" style={{ fontWeight: 400 }}>
                  {s.tel}
                </div>
              </td>
              <td>{s.role}</td>
              <td>{s.depot}</td>
              <td style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>{s.droits}</td>
              <td>
                <span className={s.etat === "Actif" ? "tag tag-neutral" : "tag tag-accent-2"}>
                  {s.etat}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
