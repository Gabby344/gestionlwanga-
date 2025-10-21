// config.js - Configuration centrale Firebase + redirections par rôle

// 🔌 Import des modules Firebase (SDK Modular v9+)
// Note : Le SDK v10.x que vous utilisez suit déjà la structure modulaire (getAuth, getFirestore).
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- 1. CONFIGURATION DU PROJET ---

// 💡 Conseil Pro: Pour le développement local, utilisez un fichier .env ou un autre mécanisme
// pour isoler la configuration de production. Ici, nous l'embarquons directement.
const firebaseConfig = {
    apiKey: "AIzaSyAgv4TDYnR60TXnns-LISqbZTgcdLT31cc",
    authDomain: "gestionlwanga.firebaseapp.com",
    projectId: "gestionlwanga",
    storageBucket: "gestionlwanga.appspot.com",
    messagingSenderId: "622604298611",
    appId: "1:622604298611:web:4ab4314ed3eec6826c3d06"
};

// --- 2. INITIALISATION SECURISÉE ---

/**
 * Initialise Firebase de manière idempotente (une seule fois).
 * Utilise getApps() pour vérifier si une instance existe déjà.
 * @returns {object} L'instance de l'application Firebase.
 */
function initializeFirebaseApp() {
    // Si une application existe déjà, la renvoyer.
    if (getApps().length > 0) {
        return getApps()[0];
    }
    // Sinon, initialiser une nouvelle application.
    return initializeApp(firebaseConfig);
}

const app = initializeFirebaseApp();

// Optionnel: Connexion à l'émulateur (décommenter si vous testez en local)
// const USE_EMULATOR = false;
// if (USE_EMULATOR && window.location.hostname === "localhost") {
//     connectFirestoreEmulator(getFirestore(app), '127.0.0.1', 8080);
//     console.warn("⚠️ Connexion à l'émulateur Firestore.");
// }

// --- 3. EXPORT DES SERVICES ---

// 🔐 Export des modules Firebase pour un usage facile dans d'autres fichiers
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- 4. GESTION DES REDIRECTIONS ET ACCÈS ---

// 🧭 Mapping des pages d'accueil par rôle utilisateur.
export const roleRedirects = Object.freeze({
    // Administration
    prefet: "dashboard-prefet.html",
    directeur_etudes: "dashboard-directeur-etudes.html",
    directeur_discipline: "dashboard-directeur-discipline.html",
    secretaire: "dashboard-secretaire.html",
    econome: "dashboard-econome.html",
    
    // Utilisateurs standard (Note : l'ID 'admin' est souvent utilisé pour une super-admin ou le 'prefet')
    enseignant: "dashboard-enseignant.html",
    eleve: "dashboard-eleve.html",
    parent: "dashboard-eleve.html", // Les parents accèdent au même tableau de bord que l'élève
    
    // Cas par défaut ou rôle non reconnu
    inconnu: "index.html"
});

/**
 * Récupère l'URL de redirection basée sur le rôle.
 * @param {string} role - Le rôle de l'utilisateur (ex: 'prefet').
 * @returns {string} L'URL de la page de tableau de bord.
 */
export function getRedirectForRole(role) {
    // Utilisation de .hasOwnProperty() pour une vérification plus sûre que le simple roleRedirects[role]
    if (roleRedirects.hasOwnProperty(role)) {
        return roleRedirects[role];
    }
    // Redirection vers l'accueil général ou la page de connexion si le rôle est non configuré
    return roleRedirects.inconnu;
}
