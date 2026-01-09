# Guide de Déploiement - PADEC Connect

## Prérequis

- Node.js 18+
- npm ou yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Compte Firebase avec un projet configuré

## Configuration Locale

### 1. Cloner le repository
```bash
git clone <your-repo-url>
cd padec-connect
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```

Remplir `.env.local` avec vos clés Firebase et Gemini API.

### 4. Tester localement
```bash
npm run dev
```

L'app sera disponible sur `http://localhost:3000`

## Déploiement sur Firebase Hosting

### Option 1 : Déploiement Manuel

```bash
# Build l'app
npm run build

# Déployer sur Firebase
firebase deploy
```

### Option 2 : Déploiement Automatique (GitHub Actions)

1. **Créer un service account Firebase** :
   - Aller sur Firebase Console → Project Settings → Service Accounts
   - Générer une nouvelle clé privée JSON
   - Encoder en base64 : `cat service-account.json | base64`

2. **Ajouter les secrets GitHub** :
   - Aller sur GitHub → Settings → Secrets and variables → Actions
   - Ajouter les secrets suivants :
     - `FIREBASE_SERVICE_ACCOUNT` (contenu base64 du JSON)
     - `FIREBASE_API_KEY`
     - `FIREBASE_AUTH_DOMAIN`
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`
     - `GEMINI_API_KEY`

3. **Push sur main** :
   - Le déploiement se fera automatiquement via GitHub Actions

## Vérifier le Déploiement

```bash
firebase hosting:sites:list
```

Votre app sera disponible sur : `https://padec-connect.web.app`

## Troubleshooting

### Erreur de build
```bash
npm run build
```

### Vérifier la configuration Firebase
```bash
firebase projects:list
firebase use <project-id>
```

### Logs de déploiement
```bash
firebase hosting:channel:list
```
