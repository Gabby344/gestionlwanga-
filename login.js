// login.js

// Importation de l'objet auth (pour l'authentification)
import { auth } from './firebase-config.js'; 
import { signInWithEmailAndPassword } from "[https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js](https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js)";


document.addEventListener('DOMContentLoaded', () => {
    // 1. Cible les éléments HTML (ids vérifiés et validés)
    const loginForm = document.getElementById('loginForm'); 
    const errorMessageElement = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Réinitialise le message d'erreur avant chaque tentative
            errorMessageElement.textContent = ''; 

            try {
                // 2. Tentative de connexion avec Firebase Auth
                await signInWithEmailAndPassword(auth, email, password);
                
                // 3. Connexion réussie : Redirection
                console.log("Connexion réussie ! Redirection...");
                // NOTE: Assurez-vous que le fichier dashboard.html existe
                window.location.href = './dashboard.html'; 
                
            } catch (error) {
                // 4. Gestion des erreurs
                let userMessage = "Échec de la connexion. Veuillez vérifier les identifiants.";

                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    userMessage = "Email ou mot de passe incorrect.";
                } else if (error.code === 'auth/invalid-email') {
                    userMessage = "Format d'email invalide.";
                }
                
                // Affiche l'erreur à l'utilisateur
                errorMessageElement.textContent = userMessage;
                console.error("Erreur d'authentification:", error.code, error.message);
            }
        });
    } else {
        console.error("L'élément 'loginForm' est introuvable. Veuillez vérifier connexion.html.");
    }
});


