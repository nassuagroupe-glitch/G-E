// Deploys firebase/firestore.rules to the live project using the same
// service account key the seed script uses — no interactive `firebase
// login` needed, which matters since this often runs on someone else's
// behalf without their Google session available here.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { cert, initializeApp } from "firebase-admin/app";
import { getApp } from "firebase-admin/app";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keyPath = path.join(__dirname, "serviceAccountKey.json");
const rulesPath = path.join(__dirname, "..", "firestore.rules");

const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
const rulesSource = readFileSync(rulesPath, "utf8");
const projectId = serviceAccount.project_id;

initializeApp({ credential: cert(serviceAccount) });
const accessToken = await getApp().options.credential.getAccessToken();
const token = accessToken.access_token;

const authHeaders = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

console.log(`Création d'un jeu de règles pour ${projectId}…`);
const createRes = await fetch(
  `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
  {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      source: { files: [{ name: "firestore.rules", content: rulesSource }] },
    }),
  }
);
const created = await createRes.json();
if (!createRes.ok) {
  console.error("Échec de la création du ruleset :", JSON.stringify(created, null, 2));
  process.exit(1);
}
console.log("Ruleset créé :", created.name);

console.log("Publication sur cloud.firestore…");
const releaseRes = await fetch(
  `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud.firestore`,
  {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({
      release: { name: `projects/${projectId}/releases/cloud.firestore`, rulesetName: created.name },
    }),
  }
);
const released = await releaseRes.json();
if (!releaseRes.ok) {
  console.error("Échec de la publication :", JSON.stringify(released, null, 2));
  process.exit(1);
}
console.log("Règles Firestore publiées avec succès.");
