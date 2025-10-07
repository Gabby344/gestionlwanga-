// js/login.js
import { auth, db } from "./config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Réinitialiser les messages
    errorMessage.textContent = "";
    successMessage.textContent = "";

    if (!email || !password) {
      errorMessage.textContent = "⚠️ Veuillez remplir tous les champs.";
      return;
    }

    try {
      // 🔐 Connexion à Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔎 Récupération du profil dans Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) throw new Error("Profil utilisateur introuvable.");

      const data = userDoc.data();
      const role = data.role?.toLowerCase() || "inconnu";

      successMessage.textContent = "✅ Connexion réussie ! Redirection en cours...";

      // 🧭 Redirection selon le rôle
      switch (role) {
        case "admin":
          window.location.href = "accueil-admin.html";
          break;
        case "prefet":
          window.location.href = "dashboard.html";
          break;
        case "enseignant":
          window.location.href = "accueil-enseignant.html";
          break;
        case "eleve":
          window.location.href = "accueil-utilisateur.html";
          break;
        default:
          alert("⛔ Rôle inconnu. Contactez l’administrateur.");
          break;
      }

    } catch (error) {
      console.error("Erreur de connexion :", error.message);
      errorMessage.textContent = "❌ " + error.message;
    }
  });
});
