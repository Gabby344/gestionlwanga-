/**
 * roles.js – Gestion complète des rôles, redirections et permissions
 * Note: Les chemins de redirection ont été ajustés pour correspondre à vos fichiers existants.
 */

// 🌐 Page d'accueil par rôle
export const roleRedirects = {
  admin: "accueil-admin.html",
  prefet: "accueil-prefet.html",
  // Correction: accueil-directeur.html -> accueil-directeur-etudes.html pour plus de cohérence
  directeur_etudes: "accueil-directeur-etudes.html", 
  // Correction de la faute de frappe: displine -> discipline
  directeur_discipline: "accueil-directeur-discipline.html", 
  secretaire: "accueil-secretaire.html",
  econome: "finance.html",
  enseignant: "accueil-enseignant.html",
  eleve: "accueil-utilisateur.html", // Page de destination par défaut pour élève/parent
  parent: "accueil-utilisateur.html", 
};

// ⚙️ Attributions et permissions de chaque rôle
export const rolePermissions = {
  // 👑 ADMIN
  admin: {
    permissions: ["*"],
    access: ["*"],
    description: "Accès complet au système — peut tout gérer (utilisateurs, données, paramètres)."
  },

  // 👑 PRÉFET
  prefet: {
    permissions: ["*"],
    access: ["*"],
    description: "Accès complet comme l’Admin — gestion du personnel et des élèves."
  },

  // 🎓 DIRECTEUR DES ÉTUDES
  directeur_etudes: {
    permissions: [
      "creer-enseignants",
      "stocker-dossiers-enseignants",
      "etablir-horaires",
      "assigner-profs",
      "voir-mentions-disciplinaires",
      "voir-tous-eleves"
    ],
    access: [
      "accueil-admin.html",
      "ajouter-enseignants.html",
      "assignation-cours.html",
      "planning-classes.html",
      "liste-eleves.html",
      "liste-enseignants.html",
      "profil-utilisateur.html"
    ],
    description: "Gère les enseignants, les horaires et le suivi pédagogique global."
  },

  // ⚖️ DIRECTEUR DE DISCIPLINE
  directeur_discipline: {
    permissions: [
      "donner-sanctions",
      "voir-eleves",
      "rapport-annuel-discipline"
    ],
    access: [
      "accueil-admin.html",
      "eleves.html",
      "publier-message.html",
      "liste-eleves.html",
      "profil-utilisateur.html"
    ],
    description: "Supervise la discipline des élèves et gère les sanctions."
  },

  // 🗂️ SECRÉTAIRE
  secretaire: {
    permissions: [
      "enregistrer-eleves",
      "crud-eleves",
      "generer-bulletins",
      "publier-communiques"
    ],
    access: [
      "accueil-admin.html",
      "ajouter-eleves.html",
      "liste-eleves.html",
      "generer-bulletins.html",
      "bulletins.html",
      "publier-message.html",
      "profil-utilisateur.html"
    ],
    description: "Gère les inscriptions, les bulletins et la communication."
  },

  // 💰 ÉCONOME
  econome: {
    permissions: [
      "percevoir-argent",
      "generer-recu",
      "voir-ordre-paiement",
      "rapports-financiers",
      "voir-tous-eleves"
    ],
    access: [
      "finance.html",
      "liste-paiements.html",
      "historique-paiements.html",
      "enregistrer-paiement.html",
      "profil-utilisateur.html"
    ],
    description: "Gère les paiements, reçus et rapports financiers mensuels/annuels."
  },

  // 🧑‍🏫 ENSEIGNANT
  enseignant: {
    permissions: [
      "voir-horaire",
      "voir-assignation",
      "voir-classe",
      "voir-eleves-classe",
      "voir-mentions-discipline",
      "saisir-notes"
    ],
    access: [
      "accueil-enseignant.html",
      "dashboard-enseignants.html",
      "voir-planning.html",
      "saisie-notes.html",
      "liste-eleves.html",
      "voir-bulletin.html",
      "voir-messages.html",
      "profil-utilisateur.html"
    ],
    description: "Accède à sa classe, son horaire, ses élèves et ses notes."
  },

  // 🎒 ÉLÈVE
  eleve: {
    permissions: [
      "voir-bulletin",
      "voir-planning",
      "voir-messages",
      "voir-profil"
    ],
    access: [
      "accueil-utilisateur.html",
      "voir-bulletin.html",
      "voir-planning.html",
      "voir-messages.html",
      "profil-utilisateur.html"
    ],
    description: "Consulte ses notes, son horaire et ses messages."
  },

  // 👪 PARENT
  parent: {
    permissions: [
      "voir-bulletin-enfant",
      "voir-rapport-financier",
      "voir-messages"
    ],
    access: [
      "accueil-utilisateur.html",
      "voir-bulletin.html",
      "voir-paiement.html",
      "voir-messages.html",
      "profil-utilisateur.html"
    ],
    description: "Accède au bulletin et à la situation financière de son enfant."
  }
};
