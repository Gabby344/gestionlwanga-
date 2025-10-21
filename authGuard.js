// 🔒 authGuard.js — Sécurité, rôles et navigation intelligente

import { auth, db, roleRedirects } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- GLOBAL STATE ---
// Utilisé pour éviter les appels multiples lors du chargement de la page
let isGuardRunning = false;

/* ============================================================
    🧩 NOTIFICATION SYSTEM — Standardisation pour l'export
============================================================ */
// Note : Le système de notification doit être identique à celui de login.js
// pour une UI cohérente. Nous le gardons ici car il est exporté et réutilisable.

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
    🚪 DÉCONNEXION SÉCURISÉE
============================================================ */
export async function logoutUser() {
    try {
        await signOut(auth);
        showNotification("Déconnexion réussie ✅", "success");
        // Utilisation de la redirection immédiate
        window.location.href = "login.html";
    } catch (err) {
        console.error("Erreur lors de la déconnexion :", err.message);
        showNotification("Erreur lors de la déconnexion", "error");
    }
}


/* ============================================================
    🛡️ PROTECTION PAR RÔLE
============================================================ */

/**
 * Protège la page actuelle en vérifiant l'état d'authentification et le rôle de l'utilisateur.
 * @param {string[]} allowedRoles - Liste des rôles autorisés pour cette page.
 * @param {boolean} forceRedirect - Si true, force la redirection même si allowedRoles n'est pas fourni.
 */
export function protectPage(allowedRoles = [], forceRedirect = false) {
    if (isGuardRunning) return; // Empêche l'exécution multiple si l'événement se déclenche plusieurs fois
    isGuardRunning = true; 
    
    // Ajout d'une classe d'attente au body pour cacher le contenu non protégé
    document.body.style.display = 'none'; 

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        // Nettoyage immédiat de l'écouteur après la première vérification
        unsubscribe();
        isGuardRunning = false;
        
        // 1. UTILISATEUR NON CONNECTÉ
        if (!user) {
            console.warn("🚫 Aucun utilisateur connecté, redirection vers login.");
            window.location.href = "login.html";
            return;
        }

        try {
            // 2. RÉCUPÉRATION DU PROFIL UTILISATEUR
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);
            
            if (!snap.exists()) {
                console.error("Profil BDD introuvable. Déconnexion forcée.");
                showNotification("Profil utilisateur introuvable. Reconnexion requise.", "error");
                await signOut(auth);
                window.location.href = "login.html";
                return;
            }

            const data = snap.data();
            const role = (data.role || "inconnu").toLowerCase().trim();
            const nomComplet = [data.nom, data.postNom, data.prenom].filter(Boolean).join(" ") || data.email;
            
            // Si l'utilisateur est inactif, le déconnecter
            if (data.statut && data.statut === 'inactif') {
                 showNotification("Votre compte est désactivé. Contactez l'admin.", "error");
                 await signOut(auth);
                 window.location.href = "login.html";
                 return;
            }

            // 3. VÉRIFICATION DES AUTORISATIONS
            
            // Si des rôles spécifiques sont requis ET le rôle actuel n'est pas dans la liste
            if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
                showNotification(`⛔ Accès refusé. Rôle actuel : ${role}.`, "error");
                console.warn("⛔ Tentative d'accès non autorisé :", role);
                
                // Rediriger vers le dashboard par défaut du rôle, plutôt que de déconnecter
                const defaultRedirect = roleRedirects[role] || "index.html"; 
                setTimeout(() => (window.location.href = defaultRedirect), 1000); 
                return; // Stoppe l'exécution
            }

            // 4. VÉRIFICATION DE LA PAGE D'ACCUEIL (Redirection automatique)
            const currentPage = window.location.pathname.split("/").pop();
            const expectedPage = roleRedirects[role];
            
            // Cette logique sert à s'assurer qu'un utilisateur arrive bien sur *sa* page d'accueil
            // Ex: Le Préfet qui essaie d'accéder à dashboard-enseignant.html sans être autorisé.
            if (expectedPage && 
                currentPage !== expectedPage && 
                (allowedRoles.length === 0 || forceRedirect)) 
            {
                console.log(`🔁 Redirection forcée vers la page d'accueil attendue : ${expectedPage}`);
                window.location.href = expectedPage;
                return;
            }

            // 5. AFFICHAGE DE L'INTERFACE ET INJECTION D'INFOS
            
            // Ajout des données utilisateur à l'objet global (optionnel, mais utile)
            window.userData = { uid: user.uid, email: user.email, role: role, nom: nomComplet };
            
            const userInfo = document.getElementById("userInfo");
            const dashboardTitle = document.getElementById("dashboardTitle");
            
            if (userInfo) userInfo.textContent = `${nomComplet} (${role.toUpperCase()})`;
            if (dashboardTitle) dashboardTitle.textContent = `Tableau de bord — ${role.toUpperCase()}`;

            // Affichage de la page maintenant que l'utilisateur est validé
            document.body.style.display = ''; // Retire le 'none' initial
            
            console.groupCollapsed("✅ AUTH GUARD VALIDÉ");
            console.log("Utilisateur :", nomComplet);
            console.log("Rôle :", role);
            console.groupEnd();
            
        } catch (err) {
            console.error("⚠️ Erreur critique authGuard :", err.message, err);
            showNotification("Erreur critique de profil. Déconnexion forcée.", "error");
            await signOut(auth);
            window.location.href = "login.html";
        }
    });
}
