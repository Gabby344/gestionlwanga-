// Remarque : Assurez-vous que l'initialisation de Firebase (incluant firestore)
// a été faite au préalable dans un fichier comme 'config.js' et que 'firebase' est disponible.
// Exemple : const firebase = require('firebase/app'); ... firebase.initializeApp(config);

// --- 1. INITIALISATION ET CONSTANTES ---

// Référence Firestore.
// L'utilisation de 'getFirestore()' est la meilleure pratique pour le SDK v9+ (modular).
// Si vous utilisez l'ancienne version, conservez : const db = firebase.firestore();
const db = firebase.firestore(); 
const BATCH_SIZE = 500; // Taille maximale des opérations par lots

/**
 * Rôles et permissions (Permissions basées sur les modules/fonctionnalités).
 * Utilisation de minuscules et snake_case pour les clés de BDD.
 */
const INITIAL_ROLES = {
    // 👑 Préfet (Direction Générale)
    prefet: {
        description: "Direction Générale et supervision de l'établissement.",
        permissions: [
            "gestion_globale_acces", "gestion_comptes_total", "rapports_suivi", 
            "configurations_systeme", "vue_structures"
        ]
    },
    // 📚 Directeur des Études
    directeur_etudes: {
        description: "Gestion académique, classes et corps professoral.",
        permissions: [
            "gestion_classes", "gestion_enseignants", "suivi_programmes", 
            "planification_academique", "bulletins_validation"
        ]
    },
    // 👮 Directeur de Discipline
    directeur_discipline: {
        description: "Gestion de la vie scolaire et disciplinaire.",
        permissions: [
            "suivi_disciplinaire", "gestion_sanctions", "rapport_comportement", 
            "coordination_surveillants", "vue_eleves"
        ]
    },
    // 📝 Secrétaire
    secretaire: {
        description: "Gestion administrative, inscriptions et documentation.",
        permissions: [
            "inscription_eleves", "gestion_documents", "planning_scolaire_vue", 
            "communication_interne", "fiche_eleve_creation"
        ]
    },
    // 💰 Econome
    econome: {
        description: "Gestion financière de l'établissement.",
        permissions: [
            "gestion_financiere", "suivi_paiements", "rapport_tresorerie", 
            "budget_depenses", "config_frais"
        ]
    }
};

/**
 * Utilisateurs administratifs initiaux (pour l'amorçage de la BDD).
 */
const INITIAL_ADMINS = [
    {
        uid: "user_gabby", // ID court et cohérent (potentiellement l'UID Firebase après création)
        nom: "Gabby Umba",
        email: "gabby@ecole.com",
        role: "prefet",
        statut: "actif"
    },
    {
        uid: "user_michel",
        nom: "Père Michel Lembe Sds",
        email: "prefet@ecole.com",
        role: "prefet",
        statut: "actif"
    },
    // ... Ajoutez les autres utilisateurs ici pour garder la liste complète
];

/**
 * Classes scolaires initiales.
 */
const INITIAL_CLASSES = [
    "7eme EB", "8eme EB",
    "1ere Scientifique", "2eme Scientifique", "3eme Scientifique", "4eme Scientifique",
    "1ere Commerciale et Gestion", "2eme Commerciale et Gestion", "3eme Commerciale et Gestion", "4eme Commerciale et Gestion",
    "1ere Agronomie", "2eme Agronomie", "3eme Agronomie", "4eme Agronomie",
    "1ere Pédagogie Générale", "2eme Pédagogie Générale", "3eme Pédagogie Générale", "4eme Pédagogie Générale"
];

// --- 2. FONCTION PRINCIPALE ---

/**
 * Exécute la configuration initiale de la base de données Firestore.
 * Utilise des transactions par lots pour une exécution atomique et plus rapide.
 */
async function configInitiale() {
    console.log("🟡 Début de la configuration initiale de Firestore...");
    const timestamp = firebase.firestore.FieldValue.serverTimestamp(); // Meilleure pratique : utiliser le timestamp du serveur

    try {
        // --- ÉTAPE 1 : CRÉATION DES RÔLES ET PERMISSIONS ---
        let batch = db.batch();
        let count = 0;
        
        for (const [role, data] of Object.entries(INITIAL_ROLES)) {
            const docRef = db.collection("roles").doc(role);
            batch.set(docRef, {
                ...data,
                createdAt: timestamp
            });
            count++;

            // Commit du lot si la limite est atteinte (pour les grandes configurations)
            if (count % BATCH_SIZE === 0) {
                await batch.commit();
                batch = db.batch();
                console.log(`... ${count} rôles écrits.`);
            }
        }
        
        // Commit des rôles restants
        await batch.commit();
        console.log("✅ Étape 1 : Rôles et Permissions créés.");

        // --- ÉTAPE 2 : CRÉATION DES UTILISATEURS ADMINISTRATIFS ---
        batch = db.batch();
        count = 0;

        for (const admin of INITIAL_ADMINS) {
            // Note importante : L'authentification Firebase (email/password) DOIT être gérée séparément
            // sur le backend (Cloud Functions/Node.js) pour des raisons de sécurité.
            // Ce code ajoute uniquement le profil dans la collection 'users'.
            const docRef = db.collection("users").doc(admin.uid); 
            batch.set(docRef, {
                nom: admin.nom,
                email: admin.email,
                role: admin.role,
                statut: admin.statut,
                createdAt: timestamp
            });
            count++;
             if (count % BATCH_SIZE === 0) {
                await batch.commit();
                batch = db.batch();
            }
        }

        // Commit des utilisateurs restants
        await batch.commit();
        console.log("✅ Étape 2 : Utilisateurs administratifs initialisés.");

        // --- ÉTAPE 3 : CRÉATION DES CLASSES ---
        batch = db.batch();
        count = 0;
        
        for (let i = 0; i < INITIAL_CLASSES.length; i++) {
            const nom = INITIAL_CLASSES[i];
            const [niveau, ...specialiteParts] = nom.split(" ");
            const specialite = specialiteParts.join(" ") || "Générale"; // Gère les classes sans spécialité
            
            // Utiliser des ID simples si possible, sinon un ID basé sur le nom est plus lisible
            const docId = nom.toLowerCase().replace(/[.\s]+/g, "_");

            const docRef = db.collection("classes").doc(docId);
            batch.set(docRef, {
                nom,
                niveau,
                specialite,
                effectif_eleves: 0, // Utiliser un champ de comptage
                enseignants_assignes: [],
                createdAt: timestamp
            });
            count++;
             if (count % BATCH_SIZE === 0) {
                await batch.commit();
                batch = db.batch();
            }
        }

        // Commit des classes restantes
        await batch.commit();
        console.log("✅ Étape 3 : Classes créées.");

        // --- ÉTAPE 4 : CRÉATION DES MÉTADONNÉES GLOBALES (Optionnel mais Propre) ---
        // Cette étape est facultative mais permet d'avoir des collections de référence bien définies.
        await db.collection("meta").doc("last_setup").set({
            timestamp: timestamp,
            version: "1.0.0"
        });
        
        console.log("🎉 Configuration Firestore terminée avec succès !");

    } catch (error) {
        console.error("❌ Erreur lors de la configuration initiale de Firestore:", error);
        // Vous pouvez ajouter ici une logique pour gérer la tentative de réexécution
    }
}

// Lancement de la fonction d'initialisation
configInitiale();
