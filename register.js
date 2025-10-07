// register.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Formulaire d'inscription (à ajouter dans ton HTML)
const form = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const nom = document.getElementById("nom").value.trim();
  const postNom = document.getElementById("postNom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const role = document.getElementById("role").value.trim(); // ex: "admin" ou "prefet"

  try {
    // Création de l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Création automatique du document Firestore
    await setDoc(doc(db, "users", user.uid), {
      nom: nom,
      postNom: postNom,
      prenom: prenom,
      role: role
    });

    alert("✅ Utilisateur et profil créés avec succès !");
    form.reset();
  } catch (error) {
    errorMessage.textContent = "Erreur : " + error.message;
  }
});
