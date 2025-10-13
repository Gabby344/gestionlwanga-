// Initialisation Firestore
const db = firebase.firestore();

// Fonction principale
async function configInitiale() {
  const timestamp = new Date().toISOString();

  // 🔐 Définir les rôles et leurs modules
  const roles = {
    prefet: {
      modules: [
        "accès total",
        "suivi des rapports",
        "gestion des comptes",
        "contrôle des modules",
        "vue sur toutes les structures"
      ]
    },
    directeur_etudes: {
      modules: [
        "gestion des classes",
        "gestion des enseignants",
        "suivi des programmes",
        "planification académique"
      ]
    },
    directeur_discipline: {
      modules: [
        "suivi disciplinaire",
        "gestion des sanctions",
        "rapport de comportement",
        "coordination des surveillants"
      ]
    },
    secretaire: {
      modules: [
        "inscription des élèves",
        "gestion des documents",
        "planning scolaire",
        "communication interne"
      ]
    },
    econome: {
      modules: [
        "gestion financière",
        "suivi des paiements",
        "rapport de trésorerie",
        "budget et dépenses"
      ]
    }
  };

  // 📌 Créer les rôles dans Firestore
  for (const [role, data] of Object.entries(roles)) {
    await db.collection("roles").doc(role).set({
      ...data,
      createdAt: timestamp
    });
  }

  // 👥 Créer les administrateurs
  const admins = [
    {
      id: "gabby_umba",
      nom: "Gabby Umba",
      role: "prefet",
      email: "gabby@ecole.com"
    },
    {
      id: "michel_lembe",
      nom: "Père Michel Lembe Sds",
      role: "prefet",
      email: "prefet@ecole.com"
    },
    {
      id: "delphin_kagunge",
      nom: "Mr Delphin Kagunge",
      role: "directeur_etudes",
      email: "etudes@ecole.com"
    },
    {
      id: "modeste_makong",
      nom: "Mr Modeste Makong",
      role: "directeur_discipline",
      email: "discipline@ecole.com"
    },
    {
      id: "secretaire",
      nom: "Secrétaire Général",
      role: "secretaire",
      email: "secretariat@ecole.com"
    },
    {
      id: "gabin_sds",
      nom: "Père Gabin Sds",
      role: "econome",
      email: "finance@ecole.com"
    }
  ];

  for (const admin of admins) {
    await db.collection("users").doc(admin.id).set({
      ...admin,
      createdAt: timestamp
    });
  }

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

  for (let i = 0; i < classes.length; i++) {
    const nom = classes[i];
    await db.collection("classes").doc(`classe_${i + 1}`).set({
      nom,
      niveau: nom.split(" ")[0],
      spécialité: nom.split(" ").slice(1).join(" "),
      liste_eleves: [],
      createdAt: timestamp
    });
  }

  // 📦 Préparer les collections pour utilisateurs
  await db.collection("utilisateurs").doc("enseignants").set({
    description: "Tous les enseignants inscrits",
    liste: [],
    createdAt: timestamp
  });

  await db.collection("utilisateurs").doc("eleves").set({
    description: "Tous les élèves inscrits",
    liste: [],
    createdAt: timestamp
  });

  // 📁 Modules centralisés (optionnel)
  await db.collection("modules").doc("structure").set({
    modules: Object.values(roles).flatMap(r => r.modules),
    createdAt: timestamp
  });

  console.log("✅ Configuration Firestore terminée.");
}

// Appeler la fonction une seule fois
configInitiale();
