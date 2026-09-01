export type DepotId = "P" | "Y" | "T" | "B" | "S";

export interface Depot {
  id: DepotId;
  short: string;
  label: string;
  name: string;
}

export interface Part {
  ref: string;
  oem: string;
  nom: string;
  cat: string;
  marque: string;
  compat: string;
  /** Prix de vente HT, in FCFA. */
  pv: number;
  /** Seuil de réapprovisionnement (total tous dépôts confondus). */
  seuil: number;
  /** Code-barres EAN/GTIN. */
  cb: string;
  /** Stock par dépôt. */
  stock: Record<DepotId, number>;
}

export interface CartLine {
  ref: string;
  nom: string;
  /** Prix unitaire HT, in FCFA. */
  pu: number;
  qte: number;
}

export type MoyenPaiement = "Espèces" | "Mobile money" | "Carte" | "Crédit client";

export type DocType = "Facture" | "Devis" | "Bon de livraison" | "Avoir";
export type DocEtat = "Payée" | "Impayée" | "En attente" | "Livré" | "Validé" | "Brouillon";

export interface DocLine {
  ref: string;
  nom: string;
  qte: number;
  pu: number;
}

export interface Doc {
  no: string;
  type: DocType;
  date: string;
  client: string;
  clientInfo: string;
  depot: string;
  etat: DocEtat;
  lignes: DocLine[];
}

export type TransferEtat = "Préparé" | "En route" | "Reçu";

export interface Transfer {
  no: string;
  date: string;
  to: string;
  detail: string;
  qte: number;
  etat: TransferEtat;
}

export type PurchaseOrderEtat = "En transit" | "Réceptionnée" | "Dédouanement";

export interface PurchaseOrder {
  no: string;
  fournisseur: string;
  date: string;
  lignes: number;
  montant: number;
  etat: PurchaseOrderEtat;
}

export interface Supplier {
  nom: string;
  pays: string;
  familles: string;
  /** Encours dû au fournisseur, in FCFA. 0 = soldé. */
  encours: number;
}

export type StaffRole =
  | "Directeur général"
  | "Caissière"
  | "Vendeur comptoir"
  | "Responsable de dépôt"
  | "Comptable";

export type StaffEtat = "Actif" | "Suspendu";

export interface StaffMember {
  nom: string;
  tel: string;
  /** Adresse e-mail — identifiant de connexion Firebase Auth. */
  email: string;
  role: StaffRole;
  depot: string;
  droits: string;
  etat: StaffEtat;
}

export interface StockAlert {
  nom: string;
  ref: string;
  seuil: number;
  depot: string;
  qte: number;
}
