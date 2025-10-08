// config.js - version centralisée pour tous les modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgv4TDYnR60TXnns-LISqbZTgcdLT31cc",
  authDomain: "gestionlwanga.firebaseapp.com",
  projectId: "gestionlwanga",
  storageBucket: "gestionlwanga.firebasestorage.app",
  messagingSenderId: "622604298611",
  appId: "1:622604298611:web:4ab4314ed3eec6826c3d06"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔹 Mapping rôle → dashboard (centralisé ici aussi si tu veux)
export const roleRedirects = {
  admin: "dashboard-admin.html",
  prefet: "dashboard-prefet.html",
  directeur_etudes: "dashboard-directeur-etudes.html",
  directeur_discipline: "dashboard-directeur-discipline.html",
  secretaire: "dashboard-secretaire.html",
  econome: "dashboard-econome.html",
  enseignant: "dashboard-enseignant.html",
  eleve: "dashboard-eleve.html"
};
