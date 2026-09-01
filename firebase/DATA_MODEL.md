# Modèle de données Firestore — G&E

Collections racine. Les identifiants de document reprennent les références
métier déjà utilisées dans `packages/shared` (réf. pièce, numéro de
dépôt, numéro de document…) pour que la migration depuis les données
factices soit directe.

## `depots/{depotId}`
`depotId` ∈ `P | Y | T | B | S` (voir `packages/shared/src/data.ts`).
```
{ short: string, label: string, name: string }
```

## `parts/{ref}`
```
{
  oem: string, nom: string, cat: string, marque: string, compat: string,
  pv: number,        // prix de vente HT
  seuil: number,     // seuil de réappro, tous dépôts confondus
  cb: string,        // code-barres
  stock: { P: number, Y: number, T: number, B: number, S: number }
}
```
Le stock reste sur le document pièce (pas de sous-collection) : les
mouvements de stock sont rares comparés aux lectures du catalogue, et une
mise à jour se fait par transaction Firestore pour rester atomique avec
la vente qui la déclenche.

## `sales/{ticketNo}` — nouveauté vs. le prototype
Le prototype n'enregistrait pas les ventes (juste un message flash). En
réel, chaque encaissement crée un document :
```
{
  depotId: string, cashierUid: string, pay: string,
  lignes: [{ ref: string, nom: string, pu: number, qte: number }],
  totalHT: number, totalTVA: number, totalTTC: number,
  createdAt: Timestamp
}
```
Créé et le stock décrémenté dans la **même transaction côté client**
(voir tâche suivante) — pas encore de Cloud Function de validation.

## `docs/{no}`
Devis / Factures / Bons de livraison / Avoirs (`type` distingue les 4).
```
{
  type: "Facture" | "Devis" | "Bon de livraison" | "Avoir",
  date: string, client: string, clientInfo: string, depot: string,
  etat: string,
  lignes: [{ ref: string, nom: string, qte: number, pu: number }]
}
```

## `transfers/{no}`
```
{ date: string, to: string, detail: string, qte: number, etat: "Préparé" | "En route" | "Reçu" }
```

## `purchaseOrders/{no}`
```
{ fournisseur: string, date: string, lignes: number, montant: number, etat: string }
```

## `suppliers/{id}`
```
{ nom: string, pays: string, familles: string, encours: number }
```

## `staff/{uid}`
`uid` = l'UID Firebase Auth de la personne (créé à la première connexion,
ou provisionné à l'avance par la Direction). C'est ce document qui donne
son rôle et son dépôt à un utilisateur connecté — l'app le lit juste
après le login pour savoir quoi afficher/autoriser.
```
{
  nom: string, tel: string, email: string,
  role: "Directeur général" | "Caissière" | "Vendeur comptoir"
      | "Responsable de dépôt" | "Comptable",
  depot: string,      // nom du dépôt, ou "Tous dépôts"
  droits: string,     // texte libre affiché dans l'écran Personnel
  etat: "Actif" | "Suspendu"
}
```

## Rôles → permissions (résumé, détail dans `firestore.rules`)

| Rôle                  | Catalogue/Stock | Vente (sales) | Facturation (docs) | Transferts | Personnel |
|------------------------|:---:|:---:|:---:|:---:|:---:|
| Directeur général       | RW  | RW  | RW  | RW  | RW  |
| Responsable de dépôt    | R (son dépôt: W stock) | R | R | RW (son dépôt) | R |
| Caissière               | R   | RW  | R (+ créer un Devis) | —   | R (soi-même) |
| Vendeur comptoir        | R   | RW  | R (+ créer un Devis) | —   | R (soi-même) |
| Comptable               | R   | R   | RW  | R   | R |

Un compte `etat: "Suspendu"` perd tous les droits d'écriture (vérifié par
une fonction commune dans les règles).

Note sur la colonne Facturation : un caissier/vendeur comptoir ne peut créer
qu'un nouveau *Devis* (bouton « Éditer un devis » de l'écran Vente
comptoir) — convertir un devis en facture, dupliquer ou créditer un
document reste réservé à Comptable/Direction (écran Facturation).
