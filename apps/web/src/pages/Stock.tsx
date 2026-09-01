import { DEPOTS, totalStock } from "@ge/shared";
import { useFirestoreData } from "../store/firestoreData";

export default function Stock() {
  const parts = useFirestoreData((s) => s.parts);
  return (
    <>
      <h1 className="page-title">Stock multi-dépôts</h1>
      <p className="page-subtitle">
        Le dépôt principal d'Adjamé approvisionne les quatre dépôts secondaires
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Référence</th>
            {DEPOTS.map((d) => (
              <th key={d.id} style={{ textAlign: "right" }}>
                {d.short}
              </th>
            ))}
            <th style={{ textAlign: "right" }}>Total</th>
            <th style={{ textAlign: "right" }}>Seuil</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          {parts.map((p) => {
            const total = totalStock(p);
            const bas = total < p.seuil;
            return (
              <tr key={p.ref}>
                <td style={{ fontWeight: 600 }}>
                  {p.nom}
                  <div className="small muted" style={{ fontWeight: 400 }}>
                    {p.ref}
                  </div>
                </td>
                {DEPOTS.map((d) => {
                  const q = p.stock[d.id];
                  return (
                    <td
                      key={d.id}
                      className={"num" + (q === 0 ? " stock-cell--empty" : "")}
                      style={{ textAlign: "right" }}
                    >
                      {q}
                    </td>
                  );
                })}
                <td className="num" style={{ textAlign: "right", fontWeight: 600 }}>
                  {total}
                </td>
                <td className="num muted" style={{ textAlign: "right" }}>
                  {p.seuil}
                </td>
                <td>
                  <span className={bas ? "tag tag-accent-2" : "tag tag-neutral"}>
                    {bas ? "À réapprovisionner" : "Suffisant"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
