import type {
  Depot,
  Doc,
  Part,
  PurchaseOrder,
  StaffMember,
  Supplier,
  Transfer,
} from "./types";

export const DEPOTS: Depot[] = [
  { id: "P", short: "ADJ", label: "Adjamé — principal", name: "Adjamé (principal)" },
  { id: "Y", short: "YOP", label: "Yopougon", name: "Yopougon" },
  { id: "T", short: "TRE", label: "Treichville", name: "Treichville" },
  { id: "B", short: "BKE", label: "Bouaké", name: "Bouaké" },
  { id: "S", short: "SPD", label: "San-Pédro", name: "San-Pédro" },
];

export const PARTS: Part[] = [
  { ref: "BRK-1042", oem: "45022-SNA-A00", nom: "Plaquettes de frein avant", cat: "Freinage", marque: "Toyota", compat: "Corolla / Yaris 2014-2021", pv: 19500, seuil: 20, cb: "6001234500123", stock: { P: 42, Y: 8, T: 14, B: 0, S: 5 } },
  { ref: "BRK-2210", oem: "43512-02280", nom: "Disque de frein ventilé Ø275", cat: "Freinage", marque: "Toyota", compat: "Corolla 2013-2019", pv: 34000, seuil: 12, cb: "6001234500147", stock: { P: 26, Y: 4, T: 6, B: 3, S: 2 } },
  { ref: "FIL-0301", oem: "15208-65F0A", nom: "Filtre à huile", cat: "Filtration", marque: "Nissan", compat: "Qashqai / X-Trail 2012-2020", pv: 4500, seuil: 60, cb: "6001234500231", stock: { P: 180, Y: 42, T: 55, B: 18, S: 24 } },
  { ref: "FIL-0455", oem: "17801-0H080", nom: "Filtre à air moteur", cat: "Filtration", marque: "Toyota", compat: "Hilux 2016-2023", pv: 9800, seuil: 40, cb: "6001234500248", stock: { P: 96, Y: 12, T: 20, B: 7, S: 11 } },
  { ref: "SUS-7712", oem: "48510-09L60", nom: "Amortisseur avant gauche", cat: "Suspension", marque: "Toyota", compat: "Hilux Vigo 2011-2018", pv: 62000, seuil: 8, cb: "6001234500330", stock: { P: 18, Y: 2, T: 3, B: 1, S: 0 } },
  { ref: "SUS-7745", oem: "54560-3TA0A", nom: "Biellette de barre stabilisatrice", cat: "Suspension", marque: "Nissan", compat: "Almera / Sunny 2012-2019", pv: 11500, seuil: 24, cb: "6001234500354", stock: { P: 51, Y: 9, T: 12, B: 6, S: 4 } },
  { ref: "ELE-3120", oem: "28800-0T010", nom: "Batterie 12 V 70 Ah", cat: "Électricité", marque: "Universel", compat: "Berlines et 4×4 essence", pv: 78000, seuil: 15, cb: "6001234500422", stock: { P: 34, Y: 11, T: 9, B: 5, S: 6 } },
  { ref: "ELE-3355", oem: "90919-01253", nom: "Bougie d'allumage iridium", cat: "Électricité", marque: "Toyota", compat: "Corolla / RAV4 essence", pv: 6800, seuil: 80, cb: "6001234500446", stock: { P: 220, Y: 48, T: 62, B: 30, S: 26 } },
  { ref: "MOT-5090", oem: "13568-39016", nom: "Kit distribution courroie", cat: "Moteur", marque: "Toyota", compat: "Hilux 2.5 D-4D", pv: 96000, seuil: 6, cb: "6001234500514", stock: { P: 12, Y: 1, T: 2, B: 0, S: 1 } },
  { ref: "CON-9001", oem: "—", nom: "Huile moteur 5W-40 · bidon 5 L", cat: "Consommables", marque: "Total", compat: "Diesel et essence", pv: 27500, seuil: 100, cb: "6001234500606", stock: { P: 260, Y: 64, T: 78, B: 32, S: 40 } },
  { ref: "CON-9042", oem: "—", nom: "Liquide de refroidissement 5 L", cat: "Consommables", marque: "Total", compat: "Tous véhicules", pv: 13500, seuil: 60, cb: "6001234500620", stock: { P: 140, Y: 22, T: 31, B: 14, S: 9 } },
  { ref: "ACC-4410", oem: "—", nom: "Tapis de sol caoutchouc — jeu de 4", cat: "Accessoires", marque: "Universel", compat: "Berlines", pv: 16500, seuil: 30, cb: "6001234500712", stock: { P: 74, Y: 18, T: 26, B: 12, S: 15 } },
  { ref: "ACC-4488", oem: "—", nom: "Housse de siège simili — jeu complet", cat: "Accessoires", marque: "Universel", compat: "Berlines et SUV", pv: 45000, seuil: 12, cb: "6001234500736", stock: { P: 22, Y: 5, T: 8, B: 2, S: 3 } },
];

export const DOCS: Doc[] = [
  { no: "FA-2026-0418", type: "Facture", date: "01/09/2026", client: "Garage Sotra Auto", clientInfo: "Cpte 0142 · crédit 30 j · CC 1802742T", depot: "Adjamé", etat: "Payée", lignes: [
    { ref: "BRK-1042", nom: "Plaquettes de frein avant", qte: 12, pu: 19500 },
    { ref: "FIL-0301", nom: "Filtre à huile", qte: 40, pu: 4500 },
    { ref: "CON-9001", nom: "Huile 5W-40 5 L", qte: 15, pu: 27500 },
  ] },
  { no: "DV-2026-0207", type: "Devis", date: "01/09/2026", client: "Transports Kouassi & Fils", clientInfo: "Cpte 0311 · comptant", depot: "Yopougon", etat: "En attente", lignes: [
    { ref: "SUS-7712", nom: "Amortisseur avant gauche", qte: 4, pu: 62000 },
    { ref: "MOT-5090", nom: "Kit distribution courroie", qte: 2, pu: 96000 },
  ] },
  { no: "FA-2026-0417", type: "Facture", date: "31/08/2026", client: "Auto Service Treichville", clientInfo: "Cpte 0088 · crédit 15 j", depot: "Treichville", etat: "Impayée", lignes: [
    { ref: "ELE-3120", nom: "Batterie 12 V 70 Ah", qte: 6, pu: 78000 },
    { ref: "ELE-3355", nom: "Bougie iridium", qte: 24, pu: 6800 },
  ] },
  { no: "BL-2026-0166", type: "Bon de livraison", date: "31/08/2026", client: "Flotte SODECI Bouaké", clientInfo: "Marché cadre 2026-14", depot: "Bouaké", etat: "Livré", lignes: [
    { ref: "FIL-0455", nom: "Filtre à air moteur", qte: 30, pu: 9800 },
    { ref: "CON-9042", nom: "Liquide de refroidissement", qte: 20, pu: 13500 },
  ] },
  { no: "AV-2026-0021", type: "Avoir", date: "29/08/2026", client: "Garage Sotra Auto", clientInfo: "Retour réf. BRK-2210", depot: "Adjamé", etat: "Validé", lignes: [
    { ref: "BRK-2210", nom: "Disque de frein ventilé", qte: 2, pu: 34000 },
  ] },
  { no: "FA-2026-0415", type: "Facture", date: "28/08/2026", client: "Taxi-compagnie Wôrô", clientInfo: "Cpte 0245 · comptant", depot: "San-Pédro", etat: "Payée", lignes: [
    { ref: "ACC-4410", nom: "Tapis de sol", qte: 10, pu: 16500 },
    { ref: "ACC-4488", nom: "Housse de siège", qte: 4, pu: 45000 },
  ] },
];

export const TRANSFERS: Transfer[] = [
  { no: "TR-0912", date: "01/09/2026", to: "Yopougon", detail: "Freinage, filtration — 6 références", qte: 148, etat: "Préparé" },
  { no: "TR-0911", date: "01/09/2026", to: "Bouaké", detail: "Consommables, batteries — 4 références", qte: 92, etat: "En route" },
  { no: "TR-0908", date: "30/08/2026", to: "San-Pédro", detail: "Suspension, moteur — 5 références", qte: 37, etat: "Reçu" },
  { no: "TR-0907", date: "29/08/2026", to: "Treichville", detail: "Accessoires — 3 références", qte: 64, etat: "Reçu" },
];

export const PURCHASE_ORDERS: PurchaseOrder[] = [
  { no: "CF-2026-0074", fournisseur: "Denso Middle East FZE", date: "28/08/2026", lignes: 18, montant: 14250000, etat: "En transit" },
  { no: "CF-2026-0073", fournisseur: "Bosch Automotive Maroc", date: "22/08/2026", lignes: 26, montant: 9840000, etat: "Réceptionnée" },
  { no: "CF-2026-0072", fournisseur: "Total Énergies CI", date: "18/08/2026", lignes: 6, montant: 6120000, etat: "Réceptionnée" },
  { no: "CF-2026-0071", fournisseur: "Sino Parts Trading Ltd", date: "10/08/2026", lignes: 41, montant: 21500000, etat: "Dédouanement" },
];

export const SUPPLIERS: Supplier[] = [
  { nom: "Denso Middle East FZE", pays: "Émirats arabes unis", familles: "Électricité, filtration", encours: 14250000 },
  { nom: "Bosch Automotive Maroc", pays: "Maroc", familles: "Freinage, allumage", encours: 3200000 },
  { nom: "Total Énergies CI", pays: "Côte d'Ivoire", familles: "Consommables", encours: 0 },
  { nom: "Sino Parts Trading Ltd", pays: "Chine", familles: "Suspension, accessoires", encours: 21500000 },
  { nom: "Ivoire Pneus & Accessoires", pays: "Côte d'Ivoire", familles: "Accessoires", encours: 780000 },
];

export const STAFF: StaffMember[] = [
  { nom: "Kouadio Assamoi", tel: "+225 07 08 41 22", email: "k.assamoi@ge.ci", role: "Directeur général", depot: "Tous dépôts", droits: "Accès complet, clôture de caisse, remises", etat: "Actif" },
  { nom: "Mariam Koné", tel: "+225 05 74 10 03", email: "m.kone@ge.ci", role: "Caissière", depot: "Adjamé", droits: "Vente, encaissement, ticket 80 mm", etat: "Actif" },
  { nom: "Yao N'Guessan", tel: "+225 01 42 88 76", email: "y.nguessan@ge.ci", role: "Vendeur comptoir", depot: "Adjamé", droits: "Vente, devis, consultation stock", etat: "Actif" },
  { nom: "Aïcha Traoré", tel: "+225 07 91 30 55", email: "a.traore@ge.ci", role: "Responsable de dépôt", depot: "Yopougon", droits: "Réception, transferts, inventaire", etat: "Actif" },
  { nom: "Chantal Kouassi", tel: "+225 07 65 20 14", email: "c.kouassi@ge.ci", role: "Caissière", depot: "Yopougon", droits: "Vente, encaissement, ticket 80 mm", etat: "Actif" },
  { nom: "Serge Bamba", tel: "+225 05 12 66 09", email: "s.bamba@ge.ci", role: "Responsable de dépôt", depot: "Bouaké", droits: "Réception, transferts, inventaire", etat: "Actif" },
  { nom: "Fatou Diarra", tel: "+225 01 77 45 18", email: "f.diarra@ge.ci", role: "Comptable", depot: "Tous dépôts", droits: "Facturation, avoirs, encours clients", etat: "Actif" },
  { nom: "Ibrahim Cissé", tel: "+225 07 22 91 40", email: "i.cisse@ge.ci", role: "Vendeur comptoir", depot: "San-Pédro", droits: "Vente, consultation stock", etat: "Suspendu" },
];

/** Chiffre d'affaires 30 jours par dépôt, pour le tableau de bord. */
export const CA_PAR_DEPOT: { name: string; v: number }[] = [
  { name: "Adjamé (principal)", v: 48200000 },
  { name: "Yopougon", v: 19400000 },
  { name: "Treichville", v: 16100000 },
  { name: "Bouaké", v: 9700000 },
  { name: "San-Pédro", v: 7300000 },
];

export const TAUX_TVA = 0.18;
export const MOYENS_PAIEMENT = ["Espèces", "Mobile money", "Carte", "Crédit client"] as const;
export const DOC_TABS = ["Tous", "Devis", "Facture", "Bon de livraison", "Avoir"] as const;
