import { auth, db } from "./config.js";
import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  doc, setDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- Sélecteurs du DOM ---
const form = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// --- Fonction principale ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMessage.textContent = "";
  successMessage.textContent = "";

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const nom = document.getElementById("nom").value.trim();
  const postNom = document.getElementById("postNom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const role = document.getElementById("role").value.trim();

  // --- Validation minimale ---
  if (!email || !password || !nom || !postNom || !prenom || !role) {
    errorMessage.textContent = "⚠️ Veuillez remplir tous les champs.";
    return;
  }

  if (password.length < 6) {
    errorMessage.textContent = "⚠️ Le mot de passe doit contenir au moins 6 caractères.";
    return;
  }

  try {
    // --- Création de l'utilisateur Firebase Auth ---
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // --- Met à jour le profil Auth (nom complet) ---
    await updateProfile(user, {
      displayName: `${prenom} ${nom}`
    });

    // --- Création du document utilisateur dans Firestore ---
    await setDoc(doc(db, "users", user.uid), {
      nom,
      postNom,
      prenom,
      email,
      role,              // ex: "admin", "prefet", "enseignant", "eleve"
      createdAt: serverTimestamp()
    });

    // --- Message de succès ---
    successMessage.textContent = `✅ Compte créé avec succès pour ${prenom} (${role})`;
    form.reset();

  } catch (error) {
    console.error(error);
    let message = "❌ Une erreur est survenue.";
    
    // --- Gestion d’erreurs plus lisible ---
    switch (error.code) {
      case "auth/email-already-in-use":
        message = "⚠️ Cet email est déjà utilisé.";
        break;
      case "auth/invalid-email":
        message = "⚠️ Email invalide.";
        break;
      case "auth/weak-password":
        message = "⚠️ Mot de passe trop faible.";
        break;
      default:
        message = error.message;
    }

    errorMessage.textContent = message;
  }
});
