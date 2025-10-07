// js/login.js
import { auth } from "./config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert("Connexion réussie ✅ Bienvenue !");
      console.log("Utilisateur connecté :", userCredential.user);
      window.location.href = "admin.html"; // redirige vers le tableau de bord admin
    } catch (error) {
      console.error("Erreur de connexion :", error.message);
      alert("❌ Connexion échouée : " + error.message);
    }
  });
});
