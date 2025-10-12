// config.js — Configuration centrale Firebase + redirections par rôle

// 🔌 Import des modules Firebase adaptés au navigateur
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔐 Configuration de ton projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAgv4TDYnR60TXnns-LISqbZTgcdLT31cc",
  authDomain: "gestionlwanga.firebaseapp.com",
  projectId: "gestionlwanga",
  storageBucket: "gestionlwanga.appspot.com", // ✅ corrigé ici
  messagingSenderId: "622604298611",
  appId: "1:622604298611:web:4ab4314ed3eec6826c3d06"
};

// 🚀 Initialisation de Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// 🧭 Redirections automatiques selon le rôle utilisateur
export const roleRedirects = {
  admin: "dashboard-admin.html",
  prefet: "dashboard-prefet.html",
  directeur_etudes: "dashboard-directeur-etudes.html",
  directeur_discipline: "dashboard-directeur-discipline.html",
  secretaire: "dashboard-secretaire.html",
  econome: "dashboard-econome.html",
  enseignant: "dashboard-enseignant.html",
  eleve: "dashboard-eleve.html",
  parent: "dashboard-eleve.html"
};
