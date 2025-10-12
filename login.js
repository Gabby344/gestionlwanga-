// login.js — Version professionnelle adaptée à config.js

import { auth, db, roleRedirects } from './config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM Elements
const form = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");
let notificationArea = document.getElementById("notification-area");
if (!notificationArea) {
  notificationArea = document.createElement("div");
  notificationArea.id = "notification-area";
  document.body.appendChild(notificationArea);
}

// ✅ Notification stylée
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
    opacity: "0",
    transform: "translateX(100%)",
    transition: "opacity 0.3s, transform 0.3s",
    zIndex: 1000
  });
  notificationArea.appendChild(notif);
  setTimeout(() => {
    notif.style.opacity = "1";
    notif.style.transform = "translateX(0)";
  }, 10);
  setTimeout(() => {
    notif.style.opacity = "0";
    notif.style.transform = "translateX(100%)";
    setTimeout(() => notificationArea.removeChild(notif), 300);
  }, 4000);
}

// ✅ Soumission du formulaire
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.textContent = "";
  successMessage.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    // 🔐 Connexion Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔍 Récupération du rôle depuis Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) throw new Error("Profil utilisateur introuvable.");

    const role = (userDoc.data().role || "inconnu").toLowerCase();
    if (!roleRedirects[role]) throw new Error("Rôle utilisateur inconnu : " + role);

    showNotification(`Connexion réussie ! Redirection vers ${roleRedirects[role]}…`, "success");

    // ⏩ Redirection vers le dashboard correspondant
    setTimeout(() => {
      window.location.href = roleRedirects[role];
    }, 1000);

  } catch (err) {
    console.error(err);
    errorMessage.textContent = "❌ " + err.message;
    showNotification(err.message, "error");
  }
});
