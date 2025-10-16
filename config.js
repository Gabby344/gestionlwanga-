// config.js — Configuration centrale Firebase + redirections par rôle

// 🔌 Import des modules Firebase adaptés au navigateur
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔐 Configuration de ton projet Firebase
// 💡 Conseil : pour plus de sécurité, ces clés peuvent aussi être chargées depuis un fichier .env 
// lors du déploiement (si tu passes plus tard sur un build Node/Vite).
const firebaseConfig = {
  apiKey: "AIzaSyAgv4TDYnR60TXnns-LISqbZTgcdLT31cc",
  authDomain: "gestionlwanga.firebaseapp.com",
  projectId: "gestionlwanga",
  storageBucket: "gestionlwanga.appspot.com", // ✅ corrigé
  messagingSenderId: "622604298611",
  appId: "1:622604298611:web:4ab4314ed3eec6826c3d06"
};

// 🚀 Initialisation sécurisée de Firebase
// 🔎 On vérifie que Firebase n’a pas déjà été initialisé (utile si ce script est importé plusieurs fois)
const app = (() => {
  const existingApp = firebase?.apps?.length ? firebase.apps[0] : null;
  return existingApp || initializeApp(firebaseConfig);
})();

// 🔐 Export des modules Firebase pour usage global
export const auth = getAuth(app);
export const db = getFirestore(app);

// 🧭 Redirections automatiques selon le rôle utilisateur
// ℹ️ Centralisation unique : toutes les pages peuvent importer ce mapping
export const roleRedirects = Object.freeze({
  admin: "dashboard-admin.html",
  prefet: "dashboard-prefet.html",
  directeur_etudes: "dashboard-directeur-etudes.html",
  directeur_discipline: "dashboard-directeur-discipline.html",
  secretaire: "dashboard-secretaire.html",
  econome: "dashboard-econome.html",
  enseignant: "dashboard-enseignant.html",
  eleve: "dashboard-eleve.html",
  parent: "dashboard-eleve.html"
});

// 🧩 Fonction utilitaire : obtenir la page d’accueil par rôle
export function getRedirectForRole(role) {
  return roleRedirects[role] || "accueil-utilisateur.html";
}
