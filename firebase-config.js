// Remplacez ces valeurs par vos propres clés de projet Firebase
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "VOTRE_ID_PROJET.firebaseapp.com",
    projectId: "VOTRE-ID-PROJET",
    storageBucket: "VOTRE_ID_PROJET.appspot.com",
    messagingSenderId: "VOTRE_SENDER_ID",
    appId: "VOTRE_APP_ID"
    // databaseURL: "https://votre-id-projet.firebaseio.com" // Si vous utilisez Realtime Database
};

// Initialiser Firebase (à faire une seule fois)
const app = firebase.initializeApp(firebaseConfig);

// Références aux services que nous utiliserons
const auth = firebase.auth();
const db = firebase.firestore();

// IMPORTANT : Si vous utilisez votre base de données telle que configurée dans l'image
// vous devrez peut-être ajuster le nom de la collection.
// Dans l'image, vous avez 'test-user'. Assurons-nous que cette variable est utilisée.
const USERS_COLLECTION = 'test-user'; 

console.log("Firebase initialisé !");
