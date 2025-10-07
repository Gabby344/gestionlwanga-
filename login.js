// Ciblage des éléments du DOM
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessageDiv = document.getElementById('error-message');

// Fonction utilitaire pour afficher les messages d'erreur
function displayError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}

// Fonction pour cacher les messages d'erreur
function hideError() {
    errorMessageDiv.style.display = 'none';
}

// Gestion de la soumission du formulaire
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page par défaut
    hideError(); // Cacher toute erreur précédente

    const email = emailInput.value;
    const password = passwordInput.value;
    
    // 1. Tenter l'authentification Firebase
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log("Authentification réussie pour :", user.email);

        // 2. Récupérer le rôle de l'utilisateur dans Firestore
        // ATTENTION : L'email n'est pas un ID de document par défaut dans Firestore.
        // Dans votre capture, l'ID du document est 'test-user' et l'email est un champ.
        // Pour que ce code fonctionne AVEC votre structure actuelle (montrée dans l'image),
        // nous devons parcourir la collection ou utiliser un ID pré-défini.
        
        // Méthode adaptée à votre structure où le champ 'email' est à l'intérieur du document:
        
        // Tenter de trouver le document par email (requiert un index Firestore)
        const snapshot = await db.collection(USERS_COLLECTION)
                                 .where('email', '==', email)
                                 .limit(1)
                                 .get();

        if (snapshot.empty) {
            displayError("Erreur : Profil utilisateur introuvable dans la base de données.");
            // OPTIONNEL : Vous pourriez déconnecter l'utilisateur ici si l'auth réussit mais le profil manque.
            // auth.signOut(); 
            return;
        }

        // 3. Lire le rôle et rediriger
        const userData = snapshot.docs[0].data();
        const role = userData.role;

        if (role === 'admin') {
            alert(`Connexion réussie ! Bienvenue, ${userData.prenom}.`);
            // Redirection vers le tableau de bord principal
            window.location.href = 'dashboard.html'; 
        } else {
            // Gérer les autres rôles (enseignant, élève, etc.)
            alert(`Connexion réussie, mais votre rôle (${role}) n'a pas d'accès au tableau de bord Admin.`);
            // Redirection vers une autre page spécifique au rôle
            window.location.href = 'role-specific-page.html'; 
        }

    } catch (error) {
        // 4. Gérer les erreurs de connexion (mot de passe incorrect, utilisateur non trouvé, etc.)
        let friendlyMessage = "Une erreur est survenue lors de la connexion.";
        
        switch (error.code) {
            case 'auth/wrong-password':
                friendlyMessage = "Mot de passe incorrect.";
                break;
            case 'auth/user-not-found':
                friendlyMessage = "Aucun utilisateur trouvé avec cet email.";
                break;
            case 'auth/invalid-email':
                friendlyMessage = "Format d'email invalide.";
                break;
            default:
                console.error("Erreur Firebase:", error.message);
                friendlyMessage = "Échec de la connexion. Veuillez vérifier vos identifiants.";
        }
        
        displayError(friendlyMessage);
    }
});
