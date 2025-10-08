// roles.js – Gestion complète des rôles, redirections et permissions

// 🌐 Page d'accueil par rôle
export const roleRedirects = {
  admin: "accueil-admin.html",
  prefet: "accueil-admin.html",
  directeur_etudes: "dashboard.html",
  directeur_discipline: "dashboard.html",
  secretaire: "dashboard.html",
  econome: "finance.html",
  enseignant: "accueil-enseignant.html",
  eleve: "accueil-utilisateur.html",
  parent: "accueil-utilisateur.html",
};

// ⚙️ Attributions et permissions de chaque rôle
export const rolePermissions = {
  // ================================
  // 👑 ADMIN / PRÉFET → Accès complet
  // ================================
  admin: {
    permissions: ["*"], // accès total
    access: ["*"], // toutes les pages
    description: "Accès complet au système — peut tout gérer (utilisateurs, données, paramètres).",
  },
  prefet: {
    permissions: ["*"],
    access: ["*"],
    description: "Accès complet comme l’Admin — gestion du personnel et des élèves.",
  },

  // ====================================
  // 🎓 DIRECTEUR DES ÉTUDES
  // ====================================
  directeur_etudes: {
    permissions: [
      "creer-enseignants",
      "stocker-dossiers-enseignants",
      "etablir-horaires",
      "assigner-profs",
      "voir-mentions-disciplinaires",
      "voir-tous-eleves",
    ],
    access: [
      "dashboard.html",
      "ajouter-enseignants.html",
      "assignation-cours.html",
      "planning-classes.html",
      "liste-eleves.html",
      "liste-enseignants.html",
      "profil-utilisateur.html",
    ],
    description: "Gère les enseignants, les horaires et le suivi pédagogique global.",
  },

  // ====================================
  // ⚖️ DIRECTEUR DE DISCIPLINE
  // ====================================
  directeur_discipline: {
    permissions: [
      "donner-sanctions",
      "voir-eleves",
      "rapport-annuel-discipline",
    ],
    access: [
      "dashboard.html",
      "eleves.html",
      "publier-message.html",
      "liste-eleves.html",
      "profil-utilisateur.html",
    ],
    description: "Supervise la discipline des élèves et gère les sanctions.",
  },

  // ====================================
  // 🗂️ SECRÉTAIRE
  // ====================================
  secretaire: {
    permissions: [
      "enregistrer-eleves",
      "crud-eleves",
      "generer-bulletins",
      "publier-communiques",
    ],
    access: [
      "dashboard.html",
      "ajouter-eleves.html",
      "liste-eleves.html",
      "generer-bulletins.html",
      "bulletins.html",
      "publier-message.html",
      "profil-utilisateur.html",
    ],
    description: "Gère les inscriptions, les bulletins et la communication.",
  },

  // ====================================
  // 🧑‍🏫 ENSEIGNANT
  // ====================================
  enseignant: {
    permissions: [
      "voir-horaire",
      "voir-assignation",
      "voir-classe",
      "voir-eleves-classe",
      "voir-mentions-discipline",
      "saisir-notes",
    ],
    access: [
      "accueil-enseignant.html",
      "dashboard-enseignants.html",
      "voir-planning.html",
      "saisie-notes.html",
      "liste-eleves.html",
      "voir-bulletin.html",
      "voir-messages.html",
      "profil-utilisateur.html",
    ],
    description: "Accède à sa classe, son horaire, ses élèves et ses notes.",
  },

  // ====================================
  // 💰 ÉCONOME
  // ====================================
  econome: {
    permissions: [
      "percevoir-argent",
      "generer-recu",
      "voir-ordre-paiement",
      "rapports-financiers",
      "voir-tous-eleves",
    ],
    access: [
      "finance.html",
      "dashboard.html",
      "liste-paiements.html",
      "historique-paiements.html",
      "enregistrer-paiement.html",
      "profil-utilisateur.html",
    ],
    description: "Gère les paiements, reçus et rapports financiers mensuels/annuels.",
  },

  // ====================================
  // 🎒 ÉLÈVE
  // ====================================
  eleve: {
    permissions: [
      "voir-bulletin",
      "voir-planning",
      "voir-messages",
      "voir-profil",
    ],
    access: [
      "accueil-utilisateur.html",
      "voir-bulletin.html",
      "voir-planning.html",
      "voir-messages.html",
      "profil-utilisateur.html",
    ],
    description: "Consulte ses notes, son horaire et ses messages.",
  },

  // ====================================
  // 👪 PARENT
  // ====================================
  parent: {
    permissions: [
      "voir-bulletin-enfant",
      "voir-rapport-financier",
      "voir-messages",
    ],
    access: [
      "accueil-utilisateur.html",
      "voir-bulletin.html",
      "voir-paiement.html",
      "voir-messages.html",
      "profil-utilisateur.html",
    ],
    description: "Accède au bulletin et à la situation financière de son enfant.",
  },
};
