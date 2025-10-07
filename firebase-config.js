// firebase-config.js

// Importation des fonctions de base
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


// Votre web app's Firebase configuration
// REMARQUE : Cette configuration est exposée dans le front-end, c'est normal.
const firebaseConfig = {
  apiKey: "AIzaSyAgv4TDYnR60TXnns-LISqbZTgcdLT31cc",
  authDomain: "gestionlwanga.firebaseapp.com",
  projectId: "gestionlwanga",
  storageBucket: "gestionlwanga.firebasestorage.app",
  messagingSenderId: "622604298611",
  appId: "1:622604298611:web:4ab4314ed3eec6826c3d06"
};

// Initialisation de l'application Firebase
const app = initializeApp(firebaseConfig);

// Initialisation et exportation des services
export const auth = getAuth(app); // Service d'authentification
export const db = getFirestore(app); // Service de base de données Firestore

// Utile pour le débogage si nécessaire (peut être retiré après)
console.log("Firebase App et services 'auth'/'db' initialisés.");


