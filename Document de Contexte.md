# **Document de Contexte : Padec Connect (Plateforme Application)**

## **1\. Présentation du Projet**

**Padec Connect** est l'interface utilisateur centrale de l'écosystème PADEC. Elle permet la mise en relation fluide entre les prestataires, les bénéficiaires et les services, tout en assurant un suivi en temps réel. Ce document régit exclusivement la **plateforme applicative utilisateur** (Web et Mobile mais le projet se fait avec react à la fin on mettra des outils comme capacitor , cordova , ou pwabuilder pour avoir des apk et ios donc quaj dtu developpe n’oublie pas de mettre des fonctionnaité native ).

## **2\. Architecture des Modules et Services**

L'IA doit respecter cette hiérarchie stricte des services divisée en 3 catégories principales :

### **A. Les 3 Catégories Majeures**

1. **Services à la Demande :** Démarches administratives, voyages, entrepreneuriat, formations.  
2. **E-Services :** Co-working, soins de santé, visas, événementiel.  
3. **Market Hub :** E-commerce et Répertoire global des acteurs du réseau.

### **B. Services Rapides (Accès Direct)**

* **Démarches** | **Voyages** | **Entrepreneuriat**  
* **Formations** | **Hébergement** | **Soins**  
* **Visas** | **Événements**

### **C. Répertoire des Acteurs (Exemples de profils types)**

* **Entrepreneur Tech :** Localisation (ex: Kinshasa), secteur Technologie.  
* **Consultant Immobilier :** Localisation (ex: Lubumbashi), secteur Immobilier.  
* **Formateur Professionnel :** Secteur Formation.

### **D. Projets en Vedette**

* **Infrastructure :** Ex: Adduction d'Eau Potable (RDC).  
* **Immobilier :** Ex: Concession N'sele (Kinshasa).  
* **Événementiel :** Ex: Salon PME & PMI (Kinshasa-Chine).

## **3\. Spécifications Techniques (Backend Firebase)**

Le projet repose entièrement sur l'écosystème **Firebase**. L'IA doit impérativement utiliser les méthodes SDK appropriées :

* **Authentification :** Firebase Auth (Email/Password, Google Sign-In, etc.). Gestion des tokens et des états de connexion via onAuthStateChanged.  
* **Base de Données :** Cloud Firestore (NoSQL). Respect des structures de collections existantes.  
* **Stockage :** Firebase Storage pour les documents, images de profils et fichiers de messagerie.  
* **Logique Serveur :** Firebase Cloud Functions pour les traitements sensibles et les triggers.

## **4\. Instructions et Restrictions IA (Protocoles d'Exclusion)**

### **A. Interdiction de Modification Globale**

* **Statu Quo :** Ne jamais modifier le cœur d'une fonction opérationnelle.  
* **Sécurité Firebase :** Il est strictement interdit de modifier l'intégralité des firestore.rules ou storage.rules. Seule une règle spécifique à une nouvelle collection peut être proposée.  
* **Non-Redondance :** Ne pas recréer de hooks de récupération de données ou de contextes d'authentification s'ils existent déjà.

### **B. Fiabilité et Vérité (Anti-Hallucination)**

* **Exactitude :** Solutions réelles, vérifiées et définitives. Utilisation rigoureuse de la documentation Firebase officielle.  
* **Zéro Supposition :** Si le chemin d'une collection ou d'un document est inconnu, l'IA doit poser la question.  
* **Zéro Temporaire :** Pas de // TODO ou de données fictives.

### **C. Facteurs de Risque (Protection du Projet)**

* **Fuite de Sécurité :** Ne jamais proposer de code qui contourne les règles de sécurité Firebase (ex: lecture en mode public non sécurisé).  
* **Coûts & Performance :** Éviter les requêtes Firestore trop lourdes (N+1 queries) ou les abonnements onSnapshot inutiles qui pourraient augmenter la consommation.  
* **Dette Technique :** Respecter les Design Patterns (ex: Repository pattern ou Services) déjà en place pour les appels Firebase.

## **5\. Méthodologie d'Intervention**

1. **Exploration :** Analyse de l'implémentation Firebase.  
2. **Ciblage Chirurgical :** Modification précise du code ou de la règle de sécurité concernée.  
3. **Audit de Sortie :** Vérification que l'authentification et les accès aux données restent sécurisés.