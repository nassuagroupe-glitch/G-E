// One-off script: populates a fresh Firebase project with the same
// demonstration data the prototype used, so the app has something real to
// show instead of an empty database, and creates one Auth account per
// staff member so you can log in and test each role immediately.
//
// Usage:
//   1. Firebase console → Project settings → Service accounts →
//      "Generate new private key" → save as firebase/seed/serviceAccountKey.json
//      (already gitignored — never commit it).
//   2. From the repo root: npm run firebase:seed
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import {
  CA_PAR_DEPOT,
  DEPOTS,
  DOCS,
  PARTS,
  PURCHASE_ORDERS,
  STAFF,
  SUPPLIERS,
  TRANSFERS,
} from "@ge/shared";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.join(__dirname, "serviceAccountKey.json");

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
} catch {
  console.error(
    "Missing firebase/seed/serviceAccountKey.json — see the comment at the top of seed.mjs."
  );
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();
const auth = getAuth();

const TEMP_PASSWORD = "GeDemo2026!";
const slugify = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-");

async function seedCollection(name, rows, idOf) {
  const batch = db.batch();
  for (const row of rows) batch.set(db.collection(name).doc(idOf(row)), row);
  await batch.commit();
  console.log(`  ${name}: ${rows.length} documents`);
}

async function seedStaffAndAuth() {
  console.log("  staff + comptes Auth :");
  for (const member of STAFF) {
    let uid;
    try {
      const existing = await auth.getUserByEmail(member.email);
      uid = existing.uid;
      console.log(`    - ${member.email} (déjà existant)`);
    } catch {
      const created = await auth.createUser({
        email: member.email,
        password: TEMP_PASSWORD,
        displayName: member.nom,
      });
      uid = created.uid;
      console.log(`    - ${member.email} → mot de passe temporaire ${TEMP_PASSWORD}`);
    }
    await db.collection("staff").doc(uid).set(member);
  }
}

async function main() {
  console.log("Import des données de démonstration…");
  await seedCollection("depots", DEPOTS, (d) => d.id);
  await seedCollection("parts", PARTS, (p) => p.ref);
  await seedCollection("docs", DOCS, (d) => d.no);
  await seedCollection("transfers", TRANSFERS, (t) => t.no);
  await seedCollection("purchaseOrders", PURCHASE_ORDERS, (c) => c.no);
  await seedCollection("suppliers", SUPPLIERS, (s) => slugify(s.nom));
  await db.collection("meta").doc("dashboard").set({ caParDepot: CA_PAR_DEPOT });
  await seedStaffAndAuth();
  console.log("\nTerminé. Connectez-vous avec l'un des e-mails ci-dessus et le mot de passe :", TEMP_PASSWORD);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
