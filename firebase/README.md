# Firebase — G&E

Ce dossier contient tout ce qui concerne le backend Firebase du projet :
- `DATA_MODEL.md` — les collections Firestore et à quoi elles servent.
- `firestore.rules` — les règles de sécurité (qui a le droit de lire/écrire quoi).
- `seed/` — un script pour remplir un projet Firebase tout neuf avec les
  données de démonstration et un compte par membre du personnel.

## Déployer les règles de sécurité

Avec la [CLI Firebase](https://firebase.google.com/docs/cli) installée :
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules --project VOTRE_PROJECT_ID
```
(ou copiez-collez le contenu de `firestore.rules` dans la console Firebase
→ Firestore Database → Règles → Publier.)

## Importer les données de démonstration

1. Console Firebase → ⚙️ Paramètres du projet → Comptes de service →
   « Générer une nouvelle clé privée » → enregistrez le fichier téléchargé
   sous `firebase/seed/serviceAccountKey.json` (déjà ignoré par git, ne le
   committez jamais).
2. Depuis la racine du dépôt :
   ```bash
   npm install
   npm run firebase:seed
   ```
3. Le script affiche les e-mails créés et le mot de passe temporaire
   (`GeDemo2026!`) — connectez-vous avec l'un d'eux dans l'app pour tester
   chaque rôle (ex. `k.assamoi@ge.ci` = Direction, accès complet).

## Configurer l'app web

Copiez `apps/web/.env.example` en `apps/web/.env.local` et remplissez les
valeurs depuis Console Firebase → Paramètres du projet → Vos applications
→ application Web → « Configuration du SDK ».
