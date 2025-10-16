// login.js — Version professionnelle améliorée (intégrée à config.js)

import { auth, db, roleRedirects, getRedirectForRole } from './config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🧩 Sélecteurs DOM
const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// 📢 Zone de notifications dynamiques
let notificationArea = document.getElementById("notification-area");
if (!notificationArea) {
  notificationArea = document.createElement("div");
  notificationArea.id = "notification-area";
  document.body.appendChild(notificationArea);
}

// ✅ Fonction de notification visuelle
function showNotification(msg, type = "success") {
  const notif = document.createElement("div");
  notif.textContent = msg;

  Object.assign(notif.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    marginBottom: "10px",
    fontWeight: "500",
    color: "white",
    backgroundColor: type === "error" ? "#ef4444" : "#10b981",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    opacity: "0",
    transform: "translateX(100%)",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    zIndex: 1000
  });

  notificationArea.appendChild(notif);

  // Animation d’apparition
  requestAnimationFrame(() => {
    notif.style.opacity = "1";
    notif.style.transform = "translateX(0)";
  });

  // Disparition après délai
  setTimeout(() => {
    notif.style.opacity = "0";
    notif.style.transform = "translateX(100%)";
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

// 🧠 Validation basique avant envoi
function validateForm(email, password) {
  if (!email || !password) {
    throw new Error("Veuillez remplir tous les champs.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Adresse e-mail invalide.");
  }
  if (password.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
  }
}

// ✅ Gestion de la soumission du formulaire
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.textContent = "";
  successMessage.textContent = "";

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;

  try {
    validateForm(email, password);

    // 🔐 Authentification Firebase
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    // 🔍 Lecture du rôle utilisateur
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("Profil utilisateur introuvable dans la base.");

    const role = (userSnap.data().role || "inconnu").toLowerCase();
    const redirectURL = getRedirectForRole(role);

    if (!redirectURL) throw new Error(`Rôle utilisateur non reconnu : ${role}`);

    // ✅ Succès
    showNotification(`Connexion réussie ! Redirection vers ${redirectURL}…`, "success");
    successMessage.textContent = "Connexion réussie !";

    // ⏩ Redirection vers le tableau de bord correspondant
    setTimeout(() => {
      window.location.href = redirectURL;
    }, 1000);

  } catch (err) {
    console.error("Erreur de connexion :", err);
    errorMessage.textContent = "❌ " + err.message;
    showNotification(err.message, "error");
  }
});
