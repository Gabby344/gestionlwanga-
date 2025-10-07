// js/config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔥 Configuration de ton projet Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAgv4TDYnR60TXnns-LISqbZTgcdLT31cc",
  authDomain: "gestionlwanga.firebaseapp.com",
  projectId: "gestionlwanga",
  storageBucket: "gestionlwanga.firebasestorage.app",
  messagingSenderId: "622604298611",
  appId: "1:622604298611:web:4ab4314ed3eec6826c3d06"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Exports pour les autres fichiers JS
export const db = getFirestore(app);
export const auth = getAuth(app);
