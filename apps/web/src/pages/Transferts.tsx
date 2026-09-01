import { useAppStore } from "../store/appStore";
import { useFirestoreData } from "../store/firestoreData";
import type { TransferEtat } from "@ge/shared";

const TAG_CLASS: Record<TransferEtat, string> = {
  "Préparé": "tag tag-outline",
  "En route": "tag tag-accent",
  "Reçu": "tag tag-neutral",
};

const ACTION_LABEL: Record<TransferEtat, string> = {
  "Préparé": "Expédier",
  "En route": "Valider réception",
  "Reçu": "Clôturé",
};

export default function Transferts() {
  const transfers = useFirestoreData((s) => s.transfers);
  const advanceTransfer = useAppStore((s) => s.advanceTransfer);

  return (
    <>
      <h1 className="page-title">Transferts inter-dépôts</h1>
      <p className="page-subtitle">Bons de sortie du dépôt principal vers les secondaires</p>
      {transfers.map((t) => (
        <div className="transfer-row" key={t.no}>
          <div className="num">
            {t.no}
            <div className="small muted">{t.date}</div>
          </div>
          <div>
            <div className="transfer-row__route">Adjamé → {t.to}</div>
            <div className="transfer-row__detail">{t.detail}</div>
          </div>
          <div className="transfer-row__status">
            <span className={TAG_CLASS[t.etat]}>{t.etat}</span> · {t.qte} pièces
          </div>
          <div className="transfer-row__action">
            <button
              className={t.etat === "Reçu" ? "btn btn-ghost" : "btn btn-secondary"}
              style={{ fontSize: 13 }}
              disabled={t.etat === "Reçu"}
              onClick={() => advanceTransfer(t.no)}
            >
              {ACTION_LABEL[t.etat]}
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
