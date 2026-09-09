import { useMemo } from "react";
import { DOC_TABS, docTotals, formatCFA, montantEnLettres, type DocEtat } from "@ge/shared";
import { useAppStore } from "../store/appStore";
import { useFirestoreData } from "../store/firestoreData";

const TAG_CLASS: Record<DocEtat, string> = {
  "Payée": "tag tag-accent",
  "Impayée": "tag tag-accent-2",
  "En attente": "tag tag-outline",
  "Livré": "tag tag-neutral",
  "Validé": "tag tag-neutral",
  "Brouillon": "tag tag-neutral",
};

export default function Facturation() {
  const tab = useAppStore((s) => s.tab);
  const setTab = useAppStore((s) => s.setTab);
  const selNo = useAppStore((s) => s.selNo);
  const selectDoc = useAppStore((s) => s.selectDoc);
  const factMsg = useAppStore((s) => s.factMsg);
  const convertDoc = useAppStore((s) => s.convertDoc);
  const print80 = useAppStore((s) => s.print80);
  const avoir = useAppStore((s) => s.avoir);
  const allDocs = useFirestoreData((s) => s.docs);

  const docs = useMemo(
    () => allDocs.filter((d) => tab === "Tous" || d.type === tab),
    [allDocs, tab]
  );
  const doc = useMemo(() => allDocs.find((d) => d.no === selNo) ?? allDocs[0], [allDocs, selNo]);

  if (!doc) {
    return (
      <>
        <h1 className="page-title">Facturation</h1>
        <p className="page-subtitle">Aucun document pour l'instant.</p>
      </>
    );
  }

  const totals = docTotals(doc);
  const convertLabel = doc.type === "Devis" ? "Convertir en facture" : "Dupliquer";

  return (
    <>
      <h1 className="page-title">Facturation</h1>
      <p className="page-subtitle">Devis, factures normalisées, bons de livraison et avoirs</p>

      <div className="tabs-row">
        {DOC_TABS.map((t) => (
          <button
            key={t}
            className={"pill" + (tab === t ? " pill-active" : "")}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="fact-grid grid-split-7-5">
        <table className="table">
          <thead>
            <tr>
              <th>Pièce</th>
              <th>Client</th>
              <th style={{ textAlign: "right" }}>TTC</th>
              <th>État</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => {
              const t = docTotals(d);
              return (
                <tr key={d.no} className="doc-row" onClick={() => selectDoc(d.no)}>
                  <td className="num">
                    {d.no}
                    <div className="small muted">
                      {d.date} · {d.type}
                    </div>
                  </td>
                  <td>
                    {d.client}
                    <div className="small muted">{d.depot}</div>
                  </td>
                  <td className="num price" style={{ textAlign: "right" }}>
                    {formatCFA(t.ttc)}
                  </td>
                  <td>
                    <span className={TAG_CLASS[d.etat]}>{d.etat}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div>
          <div className="field-label">Aperçu — {doc.no}</div>
          <div className="doc-preview">
            <div className="doc-preview__head">
              <span className="doc-preview__brand">G&amp;E</span>
              <span className="doc-preview__legal">
                Abidjan · RCCM CI-ABJ-2024-B-0000
                <br />
                Régime réel · TVA 18 %
              </span>
            </div>
            <div className="doc-preview__meta">
              <span>
                <b>
                  {doc.type} {doc.no}
                </b>
                <br />
                {doc.date}
                <br />
                {doc.depot}
              </span>
              <span className="doc-preview__meta-right">
                <b>{doc.client}</b>
                <br />
                {doc.clientInfo}
              </span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Désignation</th>
                  <th>Qté</th>
                  <th>P.U.</th>
                  <th>Montant</th>
                </tr>
              </thead>
              <tbody>
                {doc.lignes.map((l) => (
                  <tr key={l.ref}>
                    <td>
                      {l.nom}
                      <div style={{ fontSize: 11 }} className="muted">
                        {l.ref}
                      </div>
                    </td>
                    <td className="num">{l.qte}</td>
                    <td className="num">{formatCFA(l.pu)}</td>
                    <td className="num">{formatCFA(l.qte * l.pu)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="doc-preview__totals num">
              <span>Total HT</span>
              <span style={{ textAlign: "right" }}>{formatCFA(totals.ht)}</span>
              <span>TVA 18 %</span>
              <span style={{ textAlign: "right" }}>{formatCFA(totals.tva)}</span>
              <span className="doc-preview__totals-net">Net à payer</span>
              <span className="doc-preview__totals-net price" style={{ textAlign: "right" }}>
                {formatCFA(totals.ttc)}
              </span>
            </div>
            <div className="doc-preview__lettres">
              Arrêtée la présente facture à la somme de {montantEnLettres(totals.ttc)}.
            </div>
          </div>
          <div className="action-row">
            <button className="btn btn-primary" style={{ fontSize: 14 }} onClick={convertDoc}>
              {convertLabel}
            </button>
            <button className="btn btn-secondary" style={{ fontSize: 14 }} onClick={print80}>
              Ticket 80 mm
            </button>
            <button className="btn btn-ghost" style={{ fontSize: 14 }} onClick={avoir}>
              Avoir
            </button>
          </div>
          <div className="flash-msg">{factMsg}</div>
        </div>
      </div>
    </>
  );
}
