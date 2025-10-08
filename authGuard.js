// authGuard.js
import { auth, db, roleRedirects } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function showNotification(msg,type="success"){
  let area = document.getElementById("notification-area");
  if(!area){
    area = document.createElement("div");
    area.id="notification-area";
    area.style.position="fixed";
    area.style.top="20px";
    area.style.right="20px";
    area.style.zIndex="9999";
    document.body.appendChild(area);
  }
  const n = document.createElement("div");
  n.textContent = msg;
  n.style.backgroundColor = type==="error"?"#ef4444":"#10b981";
  n.style.color="white";
  n.style.padding="12px";
  n.style.marginTop="10px";
  n.style.borderRadius="6px";
  n.style.fontWeight="600";
  area.appendChild(n);
  setTimeout(()=>n.remove(),4000);
}

export function protectPage(allowedRoles=[]){
  onAuthStateChanged(auth, async(user)=>{
    if(!user){ window.location.href="login.html"; return; }
    try{
      const snap = await getDoc(doc(db,"users",user.uid));
      if(!snap.exists()) throw new Error("Profil introuvable");
      const data = snap.data();
      const role = (data.role || "inconnu").toLowerCase();
      const nom = [data.nom,data.postNom,data.prenom].filter(Boolean).join(" ")||"Utilisateur";

      const userInfo = document.getElementById("userInfo");
      const dashboardTitle = document.getElementById("dashboardTitle");
      if(userInfo) userInfo.textContent = `${nom} (${role})`;
      if(dashboardTitle) dashboardTitle.textContent = `Tableau de bord · ${role.toUpperCase()} · ISC Lwanga`;

      if(allowedRoles.length && !allowedRoles.includes(role)){
        showNotification("⛔ Accès refusé","error");
        await signOut(auth);
        window.location.href="login.html";
      } else {
        const currentPage = window.location.pathname.split("/").pop();
        if(roleRedirects[role] && currentPage!==roleRedirects[role] && allowedRoles.length===0){
          window.location.href=roleRedirects[role];
        }
      }
    }catch(err){
      console.error(err);
      showNotification(err.message,"error");
      await signOut(auth);
      window.location.href="login.html";
    }
  });
}

export async function logoutUser(){
  try{ await signOut(auth); window.location.href="login.html"; }
  catch(err){ console.error(err); showNotification("Erreur déconnexion","error"); }
}
