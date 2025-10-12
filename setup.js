// Initialisation Firestore
const db = firebase.firestore();

// Fonction principale
function configInitiale() {
  // 🔐 Définir les rôles et leurs attributions
  const roles = {
    prefet: {
      accès: [
        "accès total",
        "suivi des rapports",
        "gestion des comptes",
        "contrôle des modules",
        "vue sur toutes les structures"
      ]
    },
    directeur_etudes: {
      accès: [
        "gestion des classes",
        "gestion des enseignants",
        "suivi des programmes",
        "planification académique"
      ]
    },
    directeur_discipline: {
      accès: [
        "suivi disciplinaire",
        "gestion des sanctions",
        "rapport de comportement",
        "coordination des surveillants"
      ]
    },
    secretaire: {
      accès: [
        "inscription des élèves",
        "gestion des documents",
        "planning scolaire",
        "communication interne"
      ]
    },
    econome: {
      accès: [
        "gestion financière",
        "suivi des paiements",
        "rapport de trésorerie",
        "budget et dépenses"
      ]
    }
  };

  // 📌 Créer les rôles dans Firestore
  Object.entries(roles).forEach(([role, data]) => {
    db.collection("roles").doc(role).set(data);
  });

  // 👥 Créer les administrateurs
  const admins = [
    {
      id: "gabby_umba",
      nom: "Gabby Umba",
      rôle: "prefet",
      email: "gabby@ecole.com"
    },
    {
      id: "michel_lembe",
      nom: "Père Michel Lembe Sds",
      rôle: "prefet",
      email: "prefet@ecole.com"
    },
    {
      id: "delphin_kagunge",
      nom: "Mr Delphin Kagunge",
      rôle: "directeur_etudes",
      email: "etudes@ecole.com"
    },
    {
      id: "modeste_makong",
      nom: "Mr Modeste Makong",
      rôle: "directeur_discipline",
      email: "discipline@ecole.com"
    },
    {
      id: "secretaire",
      nom: "Secrétaire Général",
      rôle: "secretaire",
      email: "secretariat@ecole.com"
    },
    {
      id: "gabin_sds",
      nom: "Père Gabin Sds",
      rôle: "econome",
      email: "finance@ecole.com"
    }
  ];

  admins.forEach(admin => {
    db.collection("administrateurs").doc(admin.id).set(admin);
  });

  // 🏫 Créer les classes
  const classes = [
    "7eme EB",
    "8eme EB",
    "1ere Scientifique",
    "2eme Scientifique",
    "3eme Scientifique",
    "4eme Scientifique",
    "1ere Commerciale et Gestion",
    "2eme Commerciale et Gestion",
    "3eme Commerciale et Gestion",
    "4eme Commerciale et Gestion",
    "1ere Agronomie",
    "2eme Agronomie",
    "3eme Agronomie",
    "4eme Agronomie",
    "1ere Pédagogie Générale",
    "2eme Pédagogie Générale",
    "3eme Pédagogie Générale",
    "4eme Pédagogie Générale"
  ];

  classes.forEach((classe, index) => {
    db.collection("classes").doc(`classe_${index + 1}`).set({
      nom: classe,
      niveau: classe.split(" ")[0],
      spécialité: classe.split(" ").slice(1).join(" "),
      liste_eleves: []
    });
  });

  // 👨‍🏫 Préparer les collections pour enseignants et élèves
  db.collection("utilisateurs").doc("enseignants").set({
    description: "Tous les enseignants inscrits",
    liste: []
  });

  db.collection("utilisateurs").doc("eleves").set({
    description: "Tous les élèves inscrits",
    liste: []
  });

  console.log("✅ Configuration Firestore terminée.");
}

// Appeler la fonction une seule fois
configInitiale();
