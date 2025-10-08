// authGuard.js - Version ultra-pro
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
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

// 🔹 Mapping rôle → page par défaut
export const roleRedirects = {
  admin: "dashboard_admin.html",
  prefet: "dashboard_prefet.html",
  directeur_etudes: "dashboard_directeur_etudes.html",
  directeur_discipline: "dashboard_directeur_discipline.html",
  secretaire: "dashboard_secretaire.html",
  econome: "dashboard_econome.html",
  enseignant: "dashboard_enseignant.html",
  eleve: "dashboard_eleve.html"
};

// 🔹 Notifications
export function showNotification(msg, type = "success") {
  let area = document.getElementById("notification-area");
  if(!area){
    area = document.createElement("div");
    area.id = "notification-area";
    document.body.appendChild(area);
  }
  const notif = document.createElement("div");
  notif.className = `notification ${type}`;
  notif.textContent = msg;
  area.appendChild(notif);
  setTimeout(()=>notif.classList.add("show"),10);
  setTimeout(()=>{
    notif.classList.remove("show");
    setTimeout(()=>area.removeChild(notif),300);
  },4000);
}

// 🔹 Fonction principale pour protéger une page
export async function protectPage(allowedRoles = []) {
  onAuthStateChanged(auth, async (user)=>{
    if(!user){
      showNotification("🔒 Veuillez vous connecter.", "error");
      return window.location.href="login.html";
    }

    try {
      const snap = await getDoc(doc(db,"users",user.uid));
      if(!snap.exists()) throw new Error("Profil introuvable dans Firestore.");

      const data = snap.data();
      const role = (data.role || "inconnu").toLowerCase();
      const nom = [data.nom, data.postNom, data.prenom].filter(Boolean).join(" ") || "Utilisateur";

      // Affichage utilisateur
      const userInfo = document.getElementById("userInfo");
      const dashboardTitle = document.getElementById("dashboardTitle");
      if(userInfo) userInfo.textContent = `${nom} (${role})`;
      if(dashboardTitle) dashboardTitle.textContent = `Dashboard · ${role.toUpperCase()} · ISC Lwanga`;

      // Vérification rôle autorisé pour la page
      if(allowedRoles.length && !allowedRoles.includes(role)){
        showNotification("⛔ Accès refusé pour votre rôle.", "error");
        await signOut(auth);
        return window.location.href="login.html";
      }

      // Si page spécifique pour rôle
      const currentPage = window.location.pathname.split("/").pop();
      const redirectPage = roleRedirects[role];
      if(redirectPage && currentPage !== redirectPage && allowedRoles.length===0){
        window.location.href = redirectPage;
      }

    } catch(err){
      console.error(err);
      showNotification(err.message, "error");
      await signOut(auth);
      window.location.href="login.html";
    }
  });
}

// 🔹 Déconnexion centralisée
export async function logoutUser() {
  try{
    await signOut(auth);
    showNotification("✅ Déconnexion réussie !");
    setTimeout(()=>window.location.href="login.html",500);
  }catch(err){
    console.error(err);
    showNotification("Erreur lors de la déconnexion","error");
  }
}
