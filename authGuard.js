// 🔒 authGuard.js — Sécurité, rôles et navigation intelligente
// Version professionnelle : performance, clarté et UX renforcée

import { auth, db, roleRedirects } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ============================================================
   🧩 NOTIFICATION SYSTEM — moderne et réutilisable
============================================================ */
export function showNotification(message, type = "success") {
  let container = document.getElementById("notification-area");

  if (!container) {
    container = document.createElement("div");
    container.id = "notification-area";
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      maxWidth: "350px"
    });
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.textContent = message;

  const colors = {
    success: "#10b981",
    info: "#3b82f6",
    warning: "#f59e0b",
    error: "#ef4444"
  };

  Object.assign(toast.style, {
    backgroundColor: colors[type] || "#3b82f6",
    color: "white",
    padding: "14px 18px",
    borderRadius: "10px",
    fontWeight: "600",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    opacity: "0",
    transform: "translateX(100%)",
    transition: "all 0.3s ease-in-out",
  });

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ============================================================
   🛡️ PROTECTION PAR RÔLE
============================================================ */
export function protectPage(allowedRoles = []) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.warn("🚫 Aucun utilisateur connecté, redirection vers login.");
      window.location.href = "login.html";
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) throw new Error("Profil utilisateur introuvable.");

      const data = snap.data();
      const role = (data.role || "inconnu").toLowerCase().trim();
      const nomComplet = [data.nom, data.postNom, data.prenom].filter(Boolean).join(" ") || "Utilisateur";

      // 🧠 Infos dans la console (utile pour dev)
      console.groupCollapsed("✅ AUTH GUARD INFO");
      console.log("Utilisateur :", nomComplet);
      console.log("Rôle :", role);
      console.log("Page actuelle :", window.location.pathname.split("/").pop());
      console.groupEnd();

      // 👤 Injection des infos dans l'interface
      const userInfo = document.getElementById("userInfo");
      const dashboardTitle = document.getElementById("dashboardTitle");
      if (userInfo) userInfo.textContent = `${nomComplet} (${role})`;
      if (dashboardTitle) dashboardTitle.textContent = `Tableau de bord — ${role.toUpperCase()} · ISC Lwanga`;

      // 🚷 Vérifie les autorisations
      if (allowedRoles.length && !allowedRoles.includes(role)) {
        showNotification("⛔ Accès refusé — rôle non autorisé.", "error");
        console.warn("⛔ Tentative d'accès non autorisé :", role);
        await signOut(auth);
        setTimeout(() => (window.location.href = "login.html"), 1000);
        return;
      }

      // 🔄 Redirection automatique vers la bonne page
      const currentPage = window.location.pathname.split("/").pop();
      const expectedPage = roleRedirects[role];
      if (expectedPage && currentPage !== expectedPage && allowedRoles.length === 0) {
        console.log(`🔁 Redirection automatique vers ${expectedPage}`);
        window.location.href = expectedPage;
      }
    } catch (err) {
      console.error("⚠️ Erreur authGuard :", err.message);
      showNotification(err.message || "Erreur d'authentification", "error");
      await signOut(auth);
      setTimeout(() => (window.location.href = "login.html"), 1000);
    }
  });
}

/* ============================================================
   🚪 DÉCONNEXION SÉCURISÉE
============================================================ */
export async function logoutUser() {
  try {
    await signOut(auth);
    showNotification("Déconnexion réussie ✅", "success");
    setTimeout(() => (window.location.href = "login.html"), 800);
  } catch (err) {
    console.error("Erreur lors de la déconnexion :", err.message);
    showNotification("Erreur lors de la déconnexion", "error");
  }
}
