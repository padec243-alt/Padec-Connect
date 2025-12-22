# 🔥 Firebase Configuration - Padec Connect

## 📋 Vue d'ensemble

Le projet est maintenant connecté à Firebase avec tous les services essentiels initialisés.

## 🏗️ Structure de configuration

```
config/
  └─ firebase.ts          # Configuration Firebase et initialisation des services

context/
  └─ AuthContext.tsx      # Contexte d'authentification global

hooks/
  └─ useAuth.ts           # Hook pour accéder aux informations d'authentification

services/
  ├─ FirestoreService.ts  # Service générique pour Firestore (CRUD)
  └─ StorageService.ts    # Service pour Firebase Storage (upload/delete)
```

## 🔐 Services Initialisés

### 1. **Firebase Auth** (`auth`)
- Authentification utilisateur
- Gestion des sessions
- Support: Email/Password, Google Sign-In, etc.

### 2. **Cloud Firestore** (`db`)
- Base de données NoSQL
- Collections: Users, Services, Products, Actors, Projects, etc.

### 3. **Firebase Storage** (`storage`)
- Stockage de fichiers
- Images de profils, documents, photos produits

## 🚀 Usage Guide

### Utiliser l'authentification dans un composant

```tsx
import { useAuthContext } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, loading, error } = useAuthContext();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenue, {user?.displayName || user?.email}</p>
      ) : (
        <p>Veuillez vous connecter</p>
      )}
    </div>
  );
}
```

### Lire un document Firestore

```tsx
import { FirestoreService } from '@/services/FirestoreService';

async function getUser(userId: string) {
  const user = await FirestoreService.getDocument('users', userId);
  console.log(user);
}
```

### Requête Firestore avec filtres

```tsx
import { FirestoreService } from '@/services/FirestoreService';
import { where } from 'firebase/firestore';

async function getServicesByCategory(category: string) {
  const services = await FirestoreService.queryCollection('services', [
    where('category', '==', category),
  ]);
  return services;
}
```

### Créer/Mettre à jour un document

```tsx
import { FirestoreService } from '@/services/FirestoreService';

async function updateUserProfile(userId: string, data: any) {
  await FirestoreService.updateDocument('users', userId, data);
}
```

### Upload un fichier vers Storage

```tsx
import { StorageService } from '@/services/StorageService';

async function uploadProfilePicture(userId: string, file: File) {
  const url = await StorageService.uploadFile(
    `profiles/${userId}/avatar.jpg`,
    file
  );
  return url;
}
```

## 📊 Structure des Collections (Exemples)

À créer dans Firestore:

### Users Collection
```json
{
  "id": "user123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "profilePictureUrl": "...",
  "location": "Kinshasa",
  "createdAt": "2025-12-21",
  "role": "customer" // ou "provider", "admin"
}
```

### Services Collection
```json
{
  "id": "service123",
  "title": "Démarches administratives",
  "category": "services",
  "description": "...",
  "icon": "...",
  "imageUrl": "..."
}
```

### Products Collection (Market Hub)
```json
{
  "id": "product123",
  "title": "Produit XYZ",
  "price": 10000,
  "seller_id": "user456",
  "image": "...",
  "createdAt": "2025-12-21"
}
```

## ⚠️ Règles de Sécurité (Firestore)

À configurer dans Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - Lecture personnelle, écriture personnelle
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // Services - Lecture publique
    match /services/{document=**} {
      allow read: if true;
      allow write: if false;
    }

    // Products - Lecture publique, écriture propriétaire
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.seller_id;
    }
  }
}
```

## 🔄 Prochaines étapes

1. **Configurer les règles de sécurité** dans Firebase Console
2. **Créer les collections** Firestore nécessaires
3. **Implémenter l'authentification** dans AuthScreen
4. **Intégrer les services** dans les écrans appropriés
5. **Ajouter Cloud Functions** pour la logique serveur sensible

## 📚 Ressources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Storage Rules](https://firebase.google.com/docs/storage/security)
