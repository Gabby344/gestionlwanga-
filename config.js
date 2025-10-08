// login.js - Version ultra-pro
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAgv4TDYnR60TXnns-LISqbZTgcdLT31cc",
  authDomain: "gestionlwanga.firebaseapp.com",
  projectId: "gestionlwanga",
  storageBucket: "gestionlwanga.firebasestorage.app",
  messagingSenderId: "622604298611",
  appId: "1:622604298611:web:4ab4314ed3eec6826c3d06"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Mapping rôle → dashboard
const roleRedirects = {
  admin: "dashboard_admin.html",
  prefet: "dashboard_prefet.html",
  directeur_etudes: "dashboard_directeur_etudes.html",
  directeur_discipline: "dashboard_directeur_discipline.html",
  secretaire: "dashboard_secretaire.html",
  econome: "dashboard_econome.html",
  enseignant: "dashboard_enseignant.html",
  eleve: "dashboard_eleve.html"
};

// 🔹 DOM Elements
const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");
const notificationArea = document.getElementById("notification-area");

// 🔹 Fonction de notification
function showNotification(msg, type = "success") {
  const notif = document.createElement("div");
  notif.className = `notification ${type}`;
  notif.textContent = msg;
  notificationArea.appendChild(notif);

  // Animation d'apparition
  setTimeout(() => notif.classList.add("show"), 10);
  // Disparition après 4s
  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notificationArea.removeChild(notif), 300);
  }, 4000);
}

// 🔹 Gestion du formulaire
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.textContent = "";
  successMessage.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // 🔐 Connexion Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 📄 Vérification du rôle dans Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) throw new Error("Profil utilisateur introuvable.");

    const role = (userDoc.data().role || "inconnu").toLowerCase();
    if (!roleRedirects[role]) throw new Error("Rôle utilisateur inconnu : " + role);

    // ✅ Message de succès
    successMessage.textContent = `Connexion réussie ! Redirection vers le dashboard ${role}…`;
    showNotification(`Connexion réussie ! Redirection vers le dashboard ${role}…`, "success");

    // 🚀 Redirection après 1 seconde
    setTimeout(() => {
      window.location.href = roleRedirects[role];
    }, 1000);

  } catch (err) {
    console.error(err);
    errorMessage.textContent = "❌ " + err.message;
    showNotification(err.message, "error");
  }
});
