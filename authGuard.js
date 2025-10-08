// authGuard.js - Version finale, stable et centralisée
import { auth, db, roleRedirects } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔔 Notifications élégantes
export function showNotification(msg, type = "success") {
  let area = document.getElementById("notification-area");
  if (!area) {
    area = document.createElement("div");
    area.id = "notification-area";
    area.style.position = "fixed";
    area.style.top = "20px";
    area.style.right = "20px";
    area.style.zIndex = "9999";
    area.style.display = "flex";
    area.style.flexDirection = "column";
    area.style.gap = "10px";
    document.body.appendChild(area);
  }

  const notif = document.createElement("div");
  notif.textContent = msg;
  notif.style.padding = "12px 18px";
  notif.style.borderRadius = "8px";
  notif.style.fontSize = "14px";
  notif.style.fontWeight = "600";
  notif.style.color = "#fff";
  notif.style.boxShadow = "0 3px 8px rgba(0,0,0,0.2)";
  notif.style.transition = "all 0.3s ease";
  notif.style.opacity = "0";
  notif.style.transform = "translateY(-10px)";
  notif.style.backgroundColor = type === "error" ? "#e74c3c" : "#2ecc71";

  area.appendChild(notif);
  setTimeout(() => {
    notif.style.opacity = "1";
    notif.style.transform = "translateY(0)";
  }, 50);
  setTimeout(() => {
    notif.style.opacity = "0";
    notif.style.transform = "translateY(-10px)";
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

// 🧭 Protection des pages selon le rôle
export async function protectPage(allowedRoles = []) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      showNotification("🔒 Veuillez vous connecter.", "error");
      return (window.location.href = "login.html");
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) throw new Error("Profil introuvable dans Firestore.");

      const data = userDoc.data();
      const role = (data.role || "inconnu").toLowerCase();
      const nom = [data.nom, data.postNom, data.prenom].filter(Boolean).join(" ") || "Utilisateur";

      // 🔹 Affichage infos utilisateur (si éléments HTML existent)
      const userInfo = document.getElementById("userInfo");
      const dashboardTitle = document.getElementById("dashboardTitle");
      if (userInfo) userInfo.textContent = `${nom} (${role})`;
      if (dashboardTitle) dashboardTitle.textContent = `Tableau de bord · ${role.toUpperCase()} · ISC Lwanga`;

      // 🔹 Redirection automatique vers sa page d’accueil si page vide
      const currentPage = window.location.pathname.split("/").pop();
      const redirectPage = roleRedirects[role];

      if (redirectPage && currentPage !== redirectPage && allowedRoles.length === 0) {
        console.log(`Redirection automatique de ${role} vers ${redirectPage}`);
        return (window.location.href = redirectPage);
      }

      // 🔹 Vérification d’accès si la page est restreinte
      if (allowedRoles.length && !allowedRoles.includes(role)) {
        showNotification("⛔ Accès refusé : rôle non autorisé.", "error");
        await signOut(auth);
        return (window.location.href = "login.html");
      }

      console.log(`✅ Accès autorisé pour : ${role}`);
    } catch (err) {
      console.error("Erreur authGuard:", err);
      showNotification(err.message, "error");
      await signOut(auth);
      window.location.href = "login.html";
    }
  });
}

// 🚪 Déconnexion centralisée
export async function logoutUser() {
  try {
    await signOut(auth);
    showNotification("✅ Déconnexion réussie !");
    setTimeout(() => (window.location.href = "login.html"), 800);
  } catch (err) {
    console.error("Erreur de déconnexion:", err);
    showNotification("Erreur lors de la déconnexion.", "error");
  }
}
