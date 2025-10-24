// 🔌 Import des modules Firebase (SDK Modular v10.x)
// Nous utilisons des imports directs pour la compatibilité maximale
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- 1. CONFIGURATION ET INITIALISATION ROBUSTE ---

// 🚨 MANDATORY: Récupération des configurations fournies par l'environnement Canvas
// Si ces variables ne sont pas définies (hors Canvas), nous utilisons des valeurs par défaut sécurisées.
const APP_ID = typeof __app_id !== 'undefined' ? __app_id : 'default-canvas-app-id';
const INITIAL_AUTH_TOKEN = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let FIREBASE_CONFIG = {};
try {
    // La configuration est fournie sous forme de chaîne JSON
    FIREBASE_CONFIG = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
} catch (e) {
    console.error("Erreur lors de l'analyse de la configuration Firebase :", e);
}


/**
 * Initialise Firebase de manière idempotente (une seule fois).
 * @returns {object} L'instance de l'application Firebase.
 */
function initializeFirebaseApp() {
    // Tente de récupérer l'application par défaut si elle existe déjà.
    if (getApps().length) {
        return getApp();
    }

    // Sinon, l'initialiser avec la configuration fournie.
    if (Object.keys(FIREBASE_CONFIG).length > 0) {
        const app = initializeApp(FIREBASE_CONFIG, APP_ID);
        // Activer le mode debug pour voir les logs Firestore
        setLogLevel('debug'); 
        return app;
    } else {
        console.error("ERREUR FATALE: Configuration Firebase (FIREBASE_CONFIG) manquante.");
        throw new Error("Impossible d'initialiser Firebase. Veuillez vérifier la configuration.");
    }
}

// Initialiser l'application Firebase
const app = initializeFirebaseApp();

// Initialiser les services
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- 2. FONCTION D'AUTHENTIFICATION OBLIGATOIRE ---

/**
 * Authentifie l'utilisateur en utilisant le token Canvas ou de manière anonyme si aucun token n'est fourni.
 * Cette fonction DOIT être appelée au début de votre script principal.
 */
export async function ensureAuth() {
    try {
        if (INITIAL_AUTH_TOKEN) {
            // Utilise le token custom fourni par l'environnement
            await signInWithCustomToken(auth, INITIAL_AUTH_TOKEN);
            console.log("Authentification réussie via Custom Token.");
        } else {
            // Si le token n'est pas fourni, authentification anonyme (pour les invités)
            await signInAnonymously(auth);
            console.warn("Authentification anonyme utilisée (Token non trouvé).");
        }
    } catch (error) {
        console.error("Erreur d'authentification Firebase :", error);
        // Gérer l'échec d'authentification (ex: rediriger vers une page d'erreur)
    }
}


// --- 3. GESTION DES REDIRECTIONS ET ACCÈS (votre logique originale) ---

// 🧭 Mapping des pages d'accueil par rôle utilisateur.
export const ROLE_REDIRECTS = Object.freeze({
    // Administration & Direction
    'prefet': "dashboard-prefet.html",
    'directeur_etudes': "dashboard-directeur-etudes.html",
    'directeur_discipline': "dashboard-directeur-discipline.html",
    'secretaire': "gestion-eleves.html", 
    'econome': "dashboard-econome.html",
    // Personnel Pédagogique
    'enseignant': "dashboard-enseignant.html",
    // Utilisateurs Extérieurs
    'eleve': "dashboard-eleve.html",
    'parent': "dashboard-eleve.html", 
    // Cas par défaut pour rôles inconnus
    'default': "connexion.html" 
});

/**
 * Récupère l'URL de redirection basée sur le rôle.
 * @param {string} role - Le rôle de l'utilisateur (ex: 'Prefet' ou 'enseignant').
 * @returns {string} L'URL de la page de tableau de bord.
 */
export function getRedirectForRole(role) {
    const normalizedRole = String(role).toLowerCase().trim();
    if (ROLE_REDIRECTS.hasOwnProperty(normalizedRole)) {
        return ROLE_REDIRECTS[normalizedRole];
    }
    return ROLE_REDIRECTS['default'];
}

// L'App ID peut être utile pour construire les chemins de données Firestore.
export { APP_ID };
