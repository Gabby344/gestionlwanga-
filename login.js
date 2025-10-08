// login.js - Version professionnelle
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
const notificationArea = document.createElement("div");
notificationArea.id = "notification-area";
document.body.appendChild(notificationArea);

// 🔹 Notification function
function showNotification(msg, type = "success") {
  const notif = document.createElement("div");
  notif.className = `notification ${type}`;
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
  setTimeout(() => { notif.style.opacity = "1"; notif.style.transform = "translateX(0)"; }, 10);
  setTimeout(() => {
    notif.style.opacity = "0";
    notif.style.transform = "translateX(100%)";
    setTimeout(() => notificationArea.removeChild(notif), 300);
  }, 4000);
}

// 🔹 Form submit
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
    showNotification(`Connexion réussie ! Redirection vers le dashboard ${role}…`, "success");

    // 🚀 Redirection après une petite pause pour voir la notif
    setTimeout(() => {
      window.location.href = roleRedirects[role];
    }, 1000);

  } catch (err) {
    console.error(err);
    errorMessage.textContent = "❌ " + err.message;
    showNotification(err.message, "error");
  }
});
