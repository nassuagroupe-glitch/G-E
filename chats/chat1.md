# G&E application multiplateforme

_Started 2026-09-01 13:43 UTC_

---

## User

faire une application web , windows et Android de  vente de piéces detachées de vehicules , d'accessoires et consommables de vehicules , de gestion du stock, de facturation, gestion du personnel, gestion des plusieurs depos rattaché a une principale herger sur firebase et nommé : G&E

## Assistant



## Assistant

_[tool: ask_user]_

J'attends vos réponses au formulaire pour cadrer les modules, les plateformes et le niveau de finition avant de commencer les écrans.

## User

Answered — scope_first: Catalogue & recherche de pièces, Vente / caisse (POS), Facturation & devis, Stock multi-dépôts, Transferts entre dépôts, Achats & fournisseurs, Personnel & droits d'accès, Tableau de bord direction; platform: Les deux; users: Vendeur comptoir, Caissier, Responsable de dépôt, Direction; parts_search: Par véhicule (marque / modèle / année), Par référence OEM / équivalence, Par code-barres / scan, Par catégorie (freinage, filtration…), Recherche texte libre; invoicing: Facture normalisée / TVA, Devis puis conversion en facture, Bon de livraison, Comptes clients à crédit,…

## Assistant

_[tool: github_get_tree]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: grep]_

_[tool: dc_write]_

_[tool: write_file]_

_[tool: ready_for_verification]_

Prototype G&E en ligne : 8 modules interactifs (recherche multi-critères + scan, ticket de caisse avec TVA 18 % et modes de paiement, aperçu de facture normalisée, matrice de stock 5 dépôts, transferts avec changement d'état, achats, personnel) plus deux écrans Android. Données de démonstration en FCFA.

Deux points : le dépôt GitHub `nassuagroupe-glitch/G-E` est vide — rien à reprendre, j'ai bâti à partir du brief. Et le hors-ligne n'est évoqué que par un indicateur ; dites-moi si vous voulez le traiter vraiment (file d'attente, résolution de conflits).

