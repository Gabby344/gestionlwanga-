// Initialisation Firestore
const db = firebase.firestore();

// Fonction principale
async function configInitiale() {
  const timestamp = new Date().toISOString();

  // 🔐 Définir les rôles et leurs modules
  const roles = {
    prefet: [
      "accès total",
      "suivi des rapports",
      "gestion des comptes",
      "contrôle des modules",
      "vue sur toutes les structures"
    ],
    directeur_etudes: [
      "gestion des classes",
      "gestion des enseignants",
      "suivi des programmes",
      "planification académique"
    ],
    directeur_discipline: [
      "suivi disciplinaire",
      "gestion des sanctions",
      "rapport de comportement",
      "coordination des surveillants"
    ],
    secretaire: [
      "inscription des élèves",
      "gestion des documents",
      "planning scolaire",
      "communication interne"
    ],
    econome: [
      "gestion financière",
      "suivi des paiements",
      "rapport de trésorerie",
      "budget et dépenses"
    ]
  };

  // 📌 Créer les rôles dans Firestore
  for (const [role, modules] of Object.entries(roles)) {
    await db.collection("roles").doc(role).set({
      modules,
      createdAt: timestamp
    });
  }

  // 👥 Créer les utilisateurs administratifs
  const admins = [
    {
      uid: "gabby_umba",
      nom: "Gabby Umba",
      email: "gabby@ecole.com",
      role: "prefet"
    },
    {
      uid: "michel_lembe",
      nom: "Père Michel Lembe Sds",
      email: "prefet@ecole.com",
      role: "prefet"
    },
    {
      uid: "delphin_kagunge",
      nom: "Mr Delphin Kagunge",
      email: "etudes@ecole.com",
      role: "directeur_etudes"
    },
    {
      uid: "modeste_makong",
      nom: "Mr Modeste Makong",
      email: "discipline@ecole.com",
      role: "directeur_discipline"
    },
    {
      uid: "secretaire",
      nom: "Secrétaire Général",
      email: "secretariat@ecole.com",
      role: "secretaire"
    },
    {
      uid: "gabin_sds",
      nom: "Père Gabin Sds",
      email: "finance@ecole.com",
      role: "econome"
    }
  ];

  for (const admin of admins) {
    await db.collection("users").doc(admin.uid).set({
      nom: admin.nom,
      email: admin.email,
      role: admin.role,
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
    const niveau = nom.split(" ")[0];
    const spécialité = nom.split(" ").slice(1).join(" ");
    await db.collection("classes").doc(`classe_${i + 1}`).set({
      nom,
      niveau,
      spécialité,
      liste_eleves: [],
      createdAt: timestamp
    });
  }

  // 📦 Préparer les modules Firestore pour chaque rôle
  const modulesGlobal = new Set(Object.values(roles).flat());
  for (const module of modulesGlobal) {
    const id = module.toLowerCase().replace(/\s+/g, "_");
    await db.collection("modules").doc(id).set({
      nom: module,
      description: `Module initialisé pour ${id}`,
      createdAt: timestamp
    });
  }

  // 👨‍🏫 Préparer les collections utilisateurs
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

  console.log("✅ Configuration Firestore terminée.");
}

// Appeler la fonction une seule fois
configInitiale();
