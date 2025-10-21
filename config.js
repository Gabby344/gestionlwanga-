// config.js - Configuration centrale Firebase + redirections par rôle

// 🔌 Import des modules Firebase (SDK Modular v10.x)
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- 1. CONFIGURATION DU PROJET (À REMPLACER PAR VOTRE CONFIG DYNAMIQUE EN PROD) ---

// ⚠️ ATTENTION : Ces clés sont exposées. En production réelle, utilisez un mécanisme
// côté serveur ou des variables d'environnement.
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAgv4TDYnR60TXnns-LISqbZTgcdLT31cc",
    authDomain: "gestionlwanga.firebaseapp.com",
    projectId: "gestionlwanga",
    storageBucket: "gestionlwanga.appspot.com",
    messagingSenderId: "622604298611",
    appId: "1:622604298611:web:4ab43144d3eec6826c3d06" // Corrigé l'appId pour qu'il ne soit pas identique à l'ID du message (ajusté la fin)
};

// --- 2. INITIALISATION ROBUSTE ---

/**
 * Initialise Firebase de manière idempotente.
 * @returns {object} L'instance de l'application Firebase.
 */
function initializeFirebaseApp() {
    // Tente de récupérer l'application par défaut si elle existe déjà.
    try {
        return getApp(); 
    } catch (e) {
        // Si l'application par défaut n'existe pas, l'initialiser.
        if (FIREBASE_CONFIG.projectId) {
            return initializeApp(FIREBASE_CONFIG);
        } else {
            console.error("ERREUR FATALE: Configuration Firebase manquante ou incomplète.");
            throw new Error("Impossible d'initialiser Firebase. Vérifiez FIREBASE_CONFIG.");
        }
    }
}

const app = initializeFirebaseApp();

// Optionnel: Connexion à l'émulateur (décommenter si vous testez en local)
const USE_EMULATOR = true; // Bascule pour activer ou désactiver l'émulateur
if (USE_EMULATOR && window.location.hostname === "localhost") {
    // Nous devons d'abord obtenir l'instance db pour la connecter
    const firestoreInstance = getFirestore(app);
    connectFirestoreEmulator(firestoreInstance, '127.0.0.1', 8080);
    console.warn("⚠️ Connexion à l'émulateur Firestore.");
}

// --- 3. EXPORT DES SERVICES ---

// 🔐 Export des modules Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- 4. GESTION DES REDIRECTIONS ET ACCÈS ---

// 🧭 Mapping des pages d'accueil par rôle utilisateur.
// Tous les rôles sont stockés en minuscules pour garantir la cohérence.
export const ROLE_REDIRECTS = Object.freeze({
    // Administration & Direction
    'prefet': "dashboard-prefet.html",
    'directeur_etudes': "dashboard-directeur-etudes.html",
    'directeur_discipline': "dashboard-directeur-discipline.html",
    'secretaire': "gestion-eleves.html", // Redirection vers la gestion directe des élèves
    'econome': "dashboard-econome.html",
    
    // Personnel Pédagogique
    'enseignant': "dashboard-enseignant.html",
    
    // Utilisateurs Extérieurs
    'eleve': "dashboard-eleve.html",
    'parent': "dashboard-eleve.html", 
    
    // Cas par défaut pour rôles inconnus ou erreurs
    'default': "connexion.html" // Rediriger l'utilisateur à se reconnecter s'il n'a pas de rôle valide
});

/**
 * Récupère l'URL de redirection basée sur le rôle.
 * @param {string} role - Le rôle de l'utilisateur (ex: 'Prefet' ou 'enseignant').
 * @returns {string} L'URL de la page de tableau de bord.
 */
export function getRedirectForRole(role) {
    // Normaliser le rôle en minuscules et supprimer les espaces
    const normalizedRole = String(role).toLowerCase().trim();
    
    // Vérification de l'existence du rôle
    if (ROLE_REDIRECTS.hasOwnProperty(normalizedRole)) {
        return ROLE_REDIRECTS[normalizedRole];
    }
    
    // Renvoyer l'URL par défaut
    return ROLE_REDIRECTS['default'];
}
