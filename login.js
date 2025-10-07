// Importation des modules Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAgy4TDYnR6f8TXnns-LtSgbTZgcdL31cc",
  authDomain: "gestionlwanga.firebaseapp.com",
  projectId: "gestionlwanga",
  storageBucket: "gestionlwanga.appspot.com",
  messagingSenderId: "622624961281",
  appId: "1:622624961281:web:4ab4314ed3ec6c3e3d6c36"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Gestion du formulaire de connexion
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("errorMessage");

  try {
    // Connexion avec Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Lecture du rôle depuis Firestore
    const docRef = doc(db, "utilisateurs", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      errorMessage.textContent = "⛔ Profil introuvable dans la base de données.";
      return;
    }

    const role = docSnap.data().role;

    // Redirection selon le rôle
    switch (role) {
      case "admin":
      case "prefet":
        window.location.href = "dashboard.html";
        break;
      case "directeur_etudes":
        window.location.href = "bulletins.html";
        break;
      case "directeur_discipline":
        window.location.href = "sanctions.html";
        break;
      case "secretaire":
        window.location.href = "documents.html";
        break;
      case "econome":
        window.location.href = "paiements.html";
        break;
      case "enseignant":
        window.location.href = "enseignant.html";
        break;
      case "eleve":
        window.location.href = "eleve.html";
        break;
      case "parent":
        window.location.href = "parent.html";
        break;
      default:
        errorMessage.textContent = "⛔ Rôle inconnu ou non autorisé.";
    }
  } catch (error) {
    console.error(error);
    errorMessage.textContent = "⛔ Identifiants incorrects ou erreur de connexion.";
  }
});
