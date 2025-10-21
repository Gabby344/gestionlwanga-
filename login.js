// login.js - Version professionnelle affinée

import { auth, db, getRedirectForRole } from './config.js'; // Simplifié : suppression de roleRedirects inutilisé ici
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🧩 Sélecteurs DOM
const form = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const submitButton = form?.querySelector('button[type="submit"]'); // Sélectionne le bouton de soumission
const errorMessageDisplay = document.getElementById("errorMessage"); // Renommé pour clarté

// Configuration de la zone de notification (Votre code était déjà excellent ici)
const notificationArea = document.getElementById("notification-area") || (() => {
    const div = document.createElement("div");
    div.id = "notification-area";
    document.body.appendChild(div);
    return div;
})();

// ✅ Fonction de notification visuelle (Pas de changement, elle est parfaite)
function showNotification(msg, type = "success") {
    // ... votre implémentation de showNotification ...
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

    requestAnimationFrame(() => {
        notif.style.opacity = "1";
        notif.style.transform = "translateX(0)";
    });

    setTimeout(() => {
        notif.style.opacity = "0";
        notif.style.transform = "translateX(100%)";
        setTimeout(() => notif.remove(), 300);
    }, 4000);
}


// 🧠 Validation basique avant envoi (Ajout de la gestion des erreurs Firebase)
function validateForm(email, password) {
    if (!email || !password) {
        throw new Error("Veuillez remplir tous les champs.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Adresse e-mail invalide.");
    }
    // La validation de la longueur est généralement mieux gérée par Firebase Auth,
    // mais on la garde pour le feedback instantané :
    if (password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
    }
}

// 🌐 Traduction des erreurs Firebase
function translateFirebaseError(code) {
    switch (code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential': // Erreur moderne pour login/password
            return "Identifiants invalides (E-mail ou mot de passe incorrect).";
        case 'auth/invalid-email':
            return "Format d'adresse e-mail invalide.";
        case 'auth/user-disabled':
            return "Ce compte utilisateur a été désactivé.";
        default:
            return "Une erreur de connexion inattendue est survenue.";
    }
}


// ✅ Gestion de la soumission du formulaire
form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔄 Gestion de l'état de chargement
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Connexion en cours...';
    }
    errorMessageDisplay.textContent = "";

    const email = emailInput?.value.trim();
    const password = passwordInput?.value;

    try {
        validateForm(email, password);

        // 🔐 Authentification Firebase
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        // 🔍 Lecture du rôle utilisateur
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // Optionnel : Déconnecter l'utilisateur si son profil BDD manque, pour forcer le nettoyage
            // await auth.signOut();
            throw new Error("❌ Profil utilisateur introuvable. Veuillez contacter l'administrateur.");
        }

        const userData = userSnap.data();
        const role = (userData.role || "inconnu").toLowerCase();
        
        // S'assurer que le compte n'est pas "désactivé" ou en "attente"
        if (userData.statut && userData.statut === 'inactif') {
             // await auth.signOut(); // Déconnexion recommandée ici
             throw new Error("Votre compte est actuellement inactif. Contactez l'administration.");
        }

        const redirectURL = getRedirectForRole(role);

        if (!redirectURL) {
            throw new Error(`Rôle utilisateur "${role}" non configuré pour la redirection.`);
        }

        // ✅ Succès
        showNotification(`Connexion réussie ! Bienvenue, ${userData.nom.split(' ')[0]}.`, "success");

        // ⏩ Redirection immédiate pour un UX plus rapide
        window.location.href = redirectURL;

    } catch (err) {
        let displayMessage;

        if (err.code && err.code.startsWith('auth/')) {
            // Erreur Firebase Authentification (e.g., mot de passe incorrect)
            displayMessage = translateFirebaseError(err.code);
        } else {
            // Erreur de validation (e.g., champs vides) ou BDD
            displayMessage = err.message || "Erreur de traitement inconnue.";
        }

        console.error("Erreur de connexion :", err);
        errorMessageDisplay.textContent = "❗ " + displayMessage;
        showNotification(displayMessage, "error");
        
    } finally {
        // 🗑️ Réinitialisation de l'état du bouton et du formulaire en cas d'échec
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Se connecter';
        }
    }
});
