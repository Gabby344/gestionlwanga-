<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SNG - Setup et Tableau de Bord Principal</title>
    <!-- Chargement de Tailwind CSS pour un design responsive et moderne -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f4f8;
        }
        .card {
            box-shadow: 0 5px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border-radius: 0.75rem;
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
        }
        .setup-card {
            border: 2px solid #ef4444; /* red-500 */
        }
    </style>
</head>
<body class="p-4 md:p-10">

    <div id="app" class="max-w-7xl mx-auto">
        <header class="mb-10">
            <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                <span id="welcome-user">Système de Gestion Scolaire (SNG)</span>
            </h1>
            <p id="user-role-display" class="text-xl text-gray-600">Initialisation du Tableau de Bord Administratif...</p>
        </header>

        <!-- Section de configuration initiale (Setup) -->
        <section id="setup-section" class="mb-12 p-8 bg-white card setup-card">
            <h2 class="text-2xl font-bold text-red-700 mb-4">Initialisation de la Base de Données (Setup 8 Collections)</h2>
            <p class="text-gray-700 mb-6">
                Le script va amorcer les collections essentielles basées sur la structure de votre projet (Rôles, Utilisateurs, Enseignants, Élèves, Classes, Matières, Années & Frais).
            </p>
            <button id="run-setup-btn" 
                    class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-150 ease-in-out disabled:opacity-50 text-lg"
                    disabled>
                Lancer le Setup Complet de la BDD
            </button>
            <p id="setup-status" class="mt-4 text-sm font-medium text-gray-500"></p>
        </section>

        <!-- Tableau de Bord (Dashboard) -->
        <section>
            <h2 class="text-3xl font-bold text-gray-800 mb-6">Statistiques du Système SNG (Temps Réel)</h2>
            <div id="dashboard-stats" class="grid grid-cols-2 lg:grid-cols-4 gap-6">
                
                <!-- Stat Card: Utilisateurs Admins -->
                <div class="bg-purple-600 text-white p-6 card">
                    <div class="text-sm font-medium opacity-90">Comptes Administratifs</div>
                    <div id="users-count" class="text-4xl font-extrabold mt-1">0</div>
                    <div class="text-xs opacity-80 mt-1">Personnel de Direction/Admin</div>
                </div>

                <!-- Stat Card: Enseignants -->
                <div class="bg-pink-600 text-white p-6 card">
                    <div class="text-sm font-medium opacity-90">Corps Enseignant</div>
                    <div id="teachers-count" class="text-4xl font-extrabold mt-1">0</div>
                    <div class="text-xs opacity-80 mt-1">Fiches enregistrées</div>
                </div>

                <!-- Stat Card: Élèves -->
                <div class="bg-indigo-600 text-white p-6 card">
                    <div class="text-sm font-medium opacity-90">Effectif Élèves</div>
                    <div id="students-count" class="text-4xl font-extrabold mt-1">0</div>
                    <div class="text-xs opacity-80 mt-1">Inscriptions totales (Seed)</div>
                </div>

                <!-- Stat Card: Classes -->
                <div class="bg-blue-600 text-white p-6 card">
                    <div class="text-sm font-medium opacity-90">Classes Offertes</div>
                    <div id="classes-count" class="text-4xl font-extrabold mt-1">0</div>
                    <div class="text-xs opacity-80 mt-1">Niveaux et Filières</div>
                </div>

                <!-- Stat Card: Matières -->
                <div class="bg-green-600 text-white p-6 card">
                    <div class="text-sm font-medium opacity-90">Matières (Cours)</div>
                    <div id="subjects-count" class="text-4xl font-extrabold mt-1">0</div>
                    <div class="text-xs opacity-80 mt-1">Catalogue académique</div>
                </div>

                <!-- Stat Card: Rôles -->
                <div class="bg-yellow-600 text-white p-6 card">
                    <div class="text-sm font-medium opacity-90">Rôles Système</div>
                    <div id="roles-count" class="text-4xl font-extrabold mt-1">0</div>
                    <div class="text-xs opacity-80 mt-1">Permissions définies</div>
                </div>
                
                <!-- Stat Card: Frais Config -->
                <div class="bg-orange-600 text-white p-6 card">
                    <div class="text-sm font-medium opacity-90">Config. Frais</div>
                    <div id="fees-config-status" class="text-2xl font-extrabold mt-2">N/A</div>
                    <div class="text-xs opacity-80 mt-1">Structure des frais (par défaut)</div>
                </div>

                <!-- Stat Card: Année Académique -->
                <div class="bg-teal-600 text-white p-6 card">
                    <div class="text-sm font-medium opacity-90">Année Académique</div>
                    <div id="current-year" class="text-2xl font-extrabold mt-2">N/A</div>
                    <div class="text-xs opacity-80 mt-1">Année en cours</div>
                </div>
            </div>
        </section>
        
        <!-- Aperçu des Classes -->
        <section class="mt-12 p-8 bg-white card">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">Aperçu des Classes & Filières</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID BDD</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom de la Classe</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spécialité</th>
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effectif Élèves</th>
                        </tr>
                    </thead>
                    <tbody id="classes-list" class="bg-white divide-y divide-gray-200">
                        <!-- Les données des classes seront injectées ici -->
                        <tr><td colspan="4" class="px-4 py-4 text-center text-gray-500">Chargement des données...</td></tr>
                    </tbody>
                </table>
            </div>
        </section>

    </div>

    <script type="module">
        // Importations du SDK Firebase v9 (Modular)
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInWithCustomToken, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, collection, setDoc, writeBatch, serverTimestamp, onSnapshot, query, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        // --- 1. INITIALISATION DES VARIABLES GLOBALES ET DE SÉCURITÉ ---
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        // Constantes et état
        const BATCH_SIZE = 500;
        let db;
        let auth;
        let currentUserId = null;
        let currentUserName = "Utilisateur SNG";
        let currentUserRole = "Anonyme";

        // --- 2. DÉFINITIONS DES DONNÉES INITIALES (RÉFLÉCHISSANT LES MODULES DU PROJET) ---

        const INITIAL_ROLES = {
            prefet: { description: "Direction Générale", permissions: ["gestion_globale", "rapports_finance"] },
            directeur_etudes: { description: "Gestion Académique", permissions: ["gestion_classes", "gestion_bulletins", "planification_cours"] },
            directeur_discipline: { description: "Gestion de la Discipline", permissions: ["suivi_disciplinaire", "gestion_sanctions"] },
            econome: { description: "Gestion Financière", permissions: ["gestion_paiements", "config_frais_gestion", "rapports_tresorerie"] },
            secretaire: { description: "Gestion Administrative", permissions: ["inscription_eleves_crud", "gestion_dossiers"] },
            pedagogue: { description: "Pédagogie et Orientation", permissions: ["suivi_eleve_individuel", "gestion_sondages"] },
            enseignant: { description: "Enseignant", permissions: ["saisie_notes_acces", "vue_classes_assignees"] },
            
        };

        const INITIAL_ADMINS = [
            { uid: "admin_prefet", nom: "Gabby Umba (Préfet)", email: "prefet@sng.com", role: "prefet", statut: "actif" },
            { uid: "admin_etudes", nom: "Directeur Académique", email: "etudes@sng.com", role: "directeur_etudes", statut: "actif" },
            { uid: "admin_econome", nom: "Econome Principal", email: "econome@sng.com", role: "econome", statut: "actif" },
            { uid: "admin_secretaire", nom: "Secrétaire Principale", email: "secretaire@sng.com", role: "secretaire", statut: "actif" },
        ];

        const INITIAL_CLASSES = [
            "7eme EB", "8eme EB", "1ere Scientifique", "2eme Scientifique", 
            "3eme Commerciale et Gestion", "4eme Pédagogie Générale",
        ];

        const INITIAL_TEACHERS = [
            { uid: "TCH001", nom: "Mme. Marie Dubois", email: "m.dubois@sng.com", specialite: "Mathématiques", statut: "actif", classes: ["7eme_eb", "1ere_scientifique"] },
            { uid: "TCH002", nom: "Mr. Jean Dupont", email: "j.dupont@sng.com", specialite: "Français", statut: "actif", classes: ["7eme_eb"] },
            { uid: "TCH003", nom: "Mlle. Sylvie Kasa", email: "s.kasa@sng.com", specialite: "Sciences", statut: "actif", classes: ["2eme_scientifique"] },
        ];

        const INITIAL_SUBJECTS = [
            { id: "MATH", nom: "Mathématiques", coef: 4, niveau_min: "7eme EB", filiere: "Générale" },
            { id: "FRAN", nom: "Français", coef: 3, niveau_min: "7eme EB", filiere: "Générale" },
            { id: "PHY", nom: "Physique", coef: 3, niveau_min: "1ere Scientifique", filiere: "Scientifique" },
            { id: "COM", nom: "Comptabilité", coef: 5, niveau_min: "3eme Commerciale", filiere: "Commerciale et Gestion" },
        ];

        const INITIAL_STUDENTS = [
            { nom: "Kambale John", date_naissance: "2008-01-15", classe_id: "7eme_eb", statut: "Inscrit", matricule: "SNG001" },
            { nom: "Mwamba Sarah", date_naissance: "2007-09-20", classe_id: "7eme_eb", statut: "Inscrit", matricule: "SNG002" },
            { nom: "Ilunga Pascal", date_naissance: "2006-03-01", classe_id: "1ere_scientifique", statut: "Inscrit", matricule: "SNG003" },
            { nom: "Kabulo Grâce", date_naissance: "2007-11-11", classe_id: "7eme_eb", statut: "Inscrit", matricule: "SNG004" },
            { nom: "Mutombo Fiston", date_naissance: "2006-05-25", classe_id: "2eme_scientifique", statut: "Inscrit", matricule: "SNG005" },
        ];
        
        const INITIAL_ACADEMIC_YEARS = [
            { id: "2024_2025", nom: "2024-2025", start_date: "2024-09-01", end_date: "2025-06-30", is_current: true, statut: "Ouvert" },
        ];

        const DEFAULT_FEES_CONFIG = {
            id: "config_2024_2025",
            annee_academique: "2024-2025",
            frais_scolaires: 200, // Montant en devise locale (ex: USD)
            frais_inscription: 50,
            par_classes: {
                "7eme_eb": { total: 250, details: "Base" },
                "1ere_scientifique": { total: 300, details: "Sci." }
            },
            statut: "actif"
        };


        // --- 3. FONCTIONS UTILITAIRES ET D'INITIALISATION ---

        /** Met à jour l'interface utilisateur pour l'utilisateur actuellement authentifié. */
        function updateUI(roleDescription) {
            document.getElementById('welcome-user').textContent = `SNG: Connecté en tant que ${currentUserName}`;
            document.getElementById('user-role-display').textContent = `Rôle: ${roleDescription.toUpperCase()}`;
        }

        /** Fonction d'aide pour commiter les lots de Firestore. */
        async function commitBatch(currentBatch, count, collectionName, statusEl) {
            await currentBatch.commit();
            statusEl.textContent = `... ${count} documents (${collectionName}) écrits.`;
            return writeBatch(db); // Créer un nouveau lot
        }

        /** Exécute l'amorçage complet de la base de données. */
        async function configInitiale() {
            const btn = document.getElementById('run-setup-btn');
            const statusEl = document.getElementById('setup-status');
            
            btn.disabled = true;
            statusEl.textContent = "🟡 Début du Setup Complet de Firestore (8 collections)...";

            if (!db) { statusEl.textContent = "❌ Erreur: Firestore non initialisé."; btn.disabled = false; return; }

            const timestamp = serverTimestamp(); 
            const basePath = ['artifacts', appId, 'public', 'data'];
            let batch = writeBatch(db);
            let count = 0;

            try {
                // --- 1. RÔLES ET PERMISSIONS ---
                for (const [role, data] of Object.entries(INITIAL_ROLES)) {
                    batch.set(doc(db, ...basePath, 'roles', role), { ...data, createdAt: timestamp });
                    count++;
                }
                batch = await commitBatch(batch, count, "rôles", statusEl);
                count = 0;

                // --- 2. UTILISATEURS ADMINISTRATIFS (USERS) ---
                for (const admin of INITIAL_ADMINS) {
                    batch.set(doc(db, ...basePath, 'users', admin.uid), { ...admin, createdAt: timestamp });
                    count++;
                }
                batch = await commitBatch(batch, count, "utilisateurs admin", statusEl);
                count = 0;
                
                // --- 3. ENSEIGNANTS (TEACHERS) ---
                for (const teacher of INITIAL_TEACHERS) {
                    batch.set(doc(db, ...basePath, 'teachers', teacher.uid), { ...teacher, createdAt: timestamp });
                    count++;
                }
                batch = await commitBatch(batch, count, "enseignants", statusEl);
                count = 0;

                // --- 4. MATIÈRES (SUBJECTS/COURS) ---
                for (const subject of INITIAL_SUBJECTS) {
                    batch.set(doc(db, ...basePath, 'subjects', subject.id), { ...subject, createdAt: timestamp });
                    count++;
                }
                batch = await commitBatch(batch, count, "matières (cours)", statusEl);
                count = 0;
                
                // --- 5. CLASSES ---
                const classUpdates = {};
                for (const nom of INITIAL_CLASSES) {
                    const [niveau, ...specialiteParts] = nom.split(" ");
                    const specialite = specialiteParts.join(" ") || "Générale";
                    const docId = nom.toLowerCase().replace(/[.\s]+/g, "_");
                    classUpdates[docId] = 0; // Initialize counter
                    
                    batch.set(doc(db, ...basePath, 'classes', docId), {
                        nom, niveau, specialite, docId,
                        effectif_eleves: 0,
                        enseignants_assignes: [],
                        createdAt: timestamp
                    });
                    count++;
                }
                batch = await commitBatch(batch, count, "classes", statusEl);
                
                // --- 6. ÉLÈVES (STUDENTS) ---
                count = 0;
                for (let i = 0; i < INITIAL_STUDENTS.length; i++) {
                    const student = INITIAL_STUDENTS[i];
                    const studentId = student.matricule;
                    batch.set(doc(db, ...basePath, 'students', studentId), { ...student, createdAt: timestamp });
                    count++;

                    // Compter les élèves par classe pour la mise à jour
                    classUpdates[student.classe_id] = (classUpdates[student.classe_id] || 0) + 1;
                }
                batch = await commitBatch(batch, count, "élèves", statusEl);
                
                // --- 7. ANNÉES ACADÉMIQUES (ACADEMIC_YEARS) ---
                count = 0;
                for (const year of INITIAL_ACADEMIC_YEARS) {
                    batch.set(doc(db, ...basePath, 'academic_years', year.id), { ...year, createdAt: timestamp });
                    count++;
                }
                batch = await commitBatch(batch, count, "années académiques", statusEl);

                // --- 8. CONFIGURATION DES FRAIS (FEES_CONFIG) ---
                count = 0;
                batch.set(doc(db, ...basePath, 'fees_config', DEFAULT_FEES_CONFIG.id), { ...DEFAULT_FEES_CONFIG, createdAt: timestamp });
                count++;
                batch = await commitBatch(batch, count, "config des frais", statusEl);


                // --- 9. MISE À JOUR DES COMPTEURS D'ÉLÈVES DANS LES CLASSES ---
                batch = writeBatch(db);
                for (const classId in classUpdates) {
                    const classRef = doc(db, ...basePath, 'classes', classId);
                    batch.update(classRef, { effectif_eleves: classUpdates[classId] });
                }
                await batch.commit();

                statusEl.textContent = "🎉 Setup SNG terminé ! 8 collections amorcées avec succès. Le tableau de bord se met à jour en temps réel.";
                btn.disabled = true;

            } catch (error) {
                console.error("❌ Erreur critique lors de la configuration:", error);
                statusEl.textContent = `❌ Erreur lors de la configuration: ${error.message}`;
                btn.disabled = false;
            }
        }

        /** Écoute en temps réel les collections et met à jour les statistiques. */
        function listenToData() {
            if (!db) return;
            
            const basePath = ['artifacts', appId, 'public', 'data'];
            
            // Écoute des Collections Clés (Mise à jour des cartes de statistiques)
            const collections = {
                'roles': 'roles-count', 'users': 'users-count', 'teachers': 'teachers-count', 
                'subjects': 'subjects-count', 'students': 'students-count', 'classes': 'classes-count'
            };

            for (const coll in collections) {
                onSnapshot(query(collection(db, ...basePath, coll)), (snapshot) => {
                    document.getElementById(collections[coll]).textContent = snapshot.size;
                });
            }

            // Écoute spécifique de l'Année Académique
            onSnapshot(query(collection(db, ...basePath, 'academic_years')), (snapshot) => {
                const currentYearDoc = snapshot.docs.find(doc => doc.data().is_current);
                document.getElementById('current-year').textContent = currentYearDoc ? currentYearDoc.data().nom : 'N/A';
            });

            // Écoute spécifique de la Configuration des Frais
            const feesDocRef = doc(db, ...basePath, 'fees_config', DEFAULT_FEES_CONFIG.id);
            onSnapshot(feesDocRef, (docSnap) => {
                document.getElementById('fees-config-status').textContent = docSnap.exists() ? 'Config. OK' : 'Manquante';
            }, (error) => {
                document.getElementById('fees-config-status').textContent = 'Erreur';
            });


            // Écoute des Classes (avec affichage détaillé en bas)
            const classesCollectionRef = collection(db, ...basePath, 'classes');
            onSnapshot(query(classesCollectionRef), (snapshot) => {
                const classesListEl = document.getElementById('classes-list');
                classesListEl.innerHTML = '';

                if (snapshot.empty) {
                    classesListEl.innerHTML = '<tr><td colspan="4" class="px-4 py-4 text-center text-gray-500">Aucune classe configurée. Exécutez le Setup.</td></tr>';
                    return;
                }

                snapshot.forEach(doc => {
                    const data = doc.data();
                    const row = `
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-3 whitespace-nowrap text-xs font-mono text-gray-500">${data.docId}</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${data.nom}</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700">${data.specialite}</td>
                            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">${data.effectif_eleves}</td>
                        </tr>
                    `;
                    classesListEl.innerHTML += row;
                });
            });
        }


        // --- 4. INITIALISATION GLOBALE DE L'APPLICATION ---

        window.onload = async function() {
            try {
                // Initialisation de Firebase
                const app = initializeApp(firebaseConfig);
                db = getFirestore(app);
                auth = getAuth(app);
                
                // 1. Authentification et détermination de l'utilisateur
                let roleDescription = "Anonyme";
                if (initialAuthToken) {
                    const userCredential = await signInWithCustomToken(auth, initialAuthToken);
                    currentUserId = userCredential.user.uid;
                } else {
                    const userCredential = await signInAnonymously(auth);
                    currentUserId = userCredential.user.uid;
                }

                // 2. Tente de récupérer les infos utilisateur depuis la BDD (si l'UID correspond à un admin seedé)
                const adminDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', currentUserId);
                const adminDoc = await getDoc(adminDocRef);

                if (adminDoc.exists()) {
                    const data = adminDoc.data();
                    currentUserName = data.nom;
                    const roleKey = data.role;
                    roleDescription = INITIAL_ROLES[roleKey] ? INITIAL_ROLES[roleKey].description : "Rôle Inconnu";
                }
                
                // 3. Mise à jour UI et activation
                updateUI(roleDescription);
                document.getElementById('run-setup-btn').disabled = false;
                document.getElementById('setup-status').textContent = "Prêt à lancer le Setup de votre projet SNG.";

                // 4. Lancement des écouteurs de données
                listenToData();

                // 5. Attachement de l'événement au bouton Setup
                document.getElementById('run-setup-btn').addEventListener('click', configInitiale);
                
            } catch (error) {
                console.error("Erreur lors de l'initialisation de l'application:", error);
                document.getElementById('setup-status').textContent = `❌ Erreur critique d'initialisation: ${error.message}`;
            }
        };

    </script>
</body>
</html>
