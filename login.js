/**
 * Fichier : login.js
 * Gère la soumission du formulaire de connexion et l'authentification Firebase.
 *
 * REQUIERT : La variable 'auth' (référence à firebase.auth()) doit être initialisée
 * dans le fichier HTML avant l'inclusion de ce script.
 */

// Récupération des éléments du DOM
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('login-btn');
const errorMessageDiv = document.getElementById('error-message');

/**
 * Affiche un message d'erreur dans le div dédié.
 * @param {string} message - Le message d'erreur à afficher.
 */
function displayError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}

/**
 * Masque le message d'erreur.
 */
function hideError() {
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';
}

/**
 * Gère l'état du bouton (désactivation pendant le chargement).
 * @param {boolean} isLoading - Indique si une opération de connexion est en cours.
 */
function setLoading(isLoading) {
    if (isLoading) {
        loginButton.disabled = true;
        loginButton.textContent = 'Connexion...';
        loginButton.style.opacity = '0.8';
    } else {
        loginButton.disabled = false;
        loginButton.textContent = 'Se Connecter';
        loginButton.style.opacity = '1';
    }
}


// Événement de soumission du formulaire
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    hideError(); // Cache les erreurs précédentes
    setLoading(true); // Active l'état de chargement

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Tente de connecter l'utilisateur avec Firebase Authentication
        await auth.signInWithEmailAndPassword(email, password);

        // Connexion réussie : rediriger l'utilisateur
        // >>> MODIFIER 'dashboard.html' vers votre page principale <<<
        window.location.href = 'dashboard.html'; 

    } catch (error) {
        // Gère les erreurs de connexion
        let userMessage = "Une erreur est survenue lors de la connexion.";

        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                userMessage = "Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.";
                break;
            case 'auth/invalid-email':
                userMessage = "Format d'email invalide.";
                break;
            case 'auth/user-disabled':
                userMessage = "Votre compte a été désactivé.";
                break;
            default:
                console.error("Erreur Firebase:", error.code, error.message); 
                userMessage = "Erreur de connexion inattendue : " + error.code;
                break;
        }

        displayError(userMessage);

    } finally {
        setLoading(false); // Désactive l'état de chargement
    }
});

// Écouter si un utilisateur est déjà connecté (optionnel)
auth.onAuthStateChanged((user) => {
    if (user) {
        // Optionnel : Rediriger si l'utilisateur est déjà connecté et arrive sur cette page
        // window.location.href = 'dashboard.html'; 
    }
});
