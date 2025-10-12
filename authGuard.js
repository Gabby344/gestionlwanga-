// authGuard.js — Sécurité et redirection selon le rôle

import { auth, db, roleRedirects } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Notification stylée
export function showNotification(msg, type = "success") {
  let area = document.getElementById("notification-area");
  if (!area) {
    area = document.createElement("div");
    area.id = "notification-area";
    area.style.position = "fixed";
    area.style.top = "20px";
    area.style.right = "20px";
    area.style.zIndex = "9999";
    document.body.appendChild(area);
  }

  const n = document.createElement("div");
  n.textContent = msg;
  Object.assign(n.style, {
    backgroundColor: type === "error" ? "#ef4444" : "#10b981",
    color: "white",
    padding: "12px 16px",
    marginTop: "10px",
    borderRadius: "8px",
    fontWeight: "600",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    opacity: "0",
    transform: "translateX(100%)",
    transition: "opacity 0.3s, transform 0.3s"
  });

  area.appendChild(n);
  setTimeout(() => {
    n.style.opacity = "1";
    n.style.transform = "translateX(0)";
  }, 10);

  setTimeout(() => {
    n.style.opacity = "0";
    n.style.transform = "translateX(100%)";
    setTimeout(() => area.removeChild(n), 300);
  }, 4000);
}

// ✅ Protection de page selon rôle
export function protectPage(allowedRoles = []) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) throw new Error("Profil introuvable");

      const data = snap.data();
      const role = (data.role || "inconnu").toLowerCase();
      const nomComplet = [data.nom, data.postNom, data.prenom].filter(Boolean).join(" ") || "Utilisateur";

      // ✅ Affichage dans l’interface
      const userInfo = document.getElementById("userInfo");
      const dashboardTitle = document.getElementById("dashboardTitle");
      if (userInfo) userInfo.textContent = `${nomComplet} (${role})`;
      if (dashboardTitle) dashboardTitle.textContent = `Tableau de bord · ${role.toUpperCase()} · ISC Lwanga`;

      // ✅ Vérification du rôle
      if (allowedRoles.length && !allowedRoles.includes(role)) {
        showNotification("⛔ Accès refusé", "error");
        await signOut(auth);
        window.location.href = "login.html";
        return;
      }

      // ✅ Redirection automatique si rôle autorisé mais mauvaise page
      const currentPage = window.location.pathname.split("/").pop();
      const expectedPage = roleRedirects[role];
      if (expectedPage && currentPage !== expectedPage && allowedRoles.length === 0) {
        window.location.href = expectedPage;
      }

    } catch (err) {
      console.error(err);
      showNotification(err.message, "error");
      await signOut(auth);
      window.location.href = "login.html";
    }
  });
}

// ✅ Déconnexion propre
export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (err) {
    console.error(err);
    showNotification("Erreur déconnexion", "error");
  }
}
