// authGuard.js
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { app } from "./config.js";
import { roleRedirects } from "./roles.js";

const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "connexion.html";
    return;
  }

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    alert("Utilisateur non reconnu. Contactez l’administrateur.");
    auth.signOut();
    window.location.href = "connexion.html";
    return;
  }

  const data = docSnap.data();
  const role = data.role;

  // Vérifie que la page actuelle correspond au rôle
  const currentPage = window.location.pathname.split("/").pop();
  const expectedPage = roleRedirects[role];

  if (expectedPage && currentPage !== expectedPage) {
    window.location.href = expectedPage;
  }
});
