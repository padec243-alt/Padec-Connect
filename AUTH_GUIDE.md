# 🔐 Guide d'Authentification - Padec Connect

## Vue d'ensemble

L'authentification est entièrement intégrée avec Firebase Auth. Les utilisateurs peuvent:
- ✅ Se connecter avec email/mot de passe
- ✅ Créer un compte
- ✅ Se connecter avec Google
- ✅ Gestion sécurisée des profils

## 📁 Structure

```
services/
  └─ AuthService.ts         # Service d'authentification Firebase

screens/
  └─ AuthScreen.tsx         # Page de connexion/inscription

context/
  └─ AuthContext.tsx        # Contexte global d'authentification

hooks/
  └─ useAuth.ts            # Hook pour accéder à l'utilisateur
```

## 🚀 Utilisation dans les Composants

### Vérifier si l'utilisateur est connecté

```tsx
import { useAuthContext } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, loading } = useAuthContext();

  if (loading) return <div>Chargement...</div>;

  if (isAuthenticated) {
    return <p>Bienvenue, {user?.displayName}</p>;
  }

  return <p>Veuillez vous connecter</p>;
}
```

### Se déconnecter

```tsx
import { AuthService } from '@/services/AuthService';

async function logout() {
  try {
    await AuthService.logout();
    // Redirection automatique via le contexte
  } catch (error) {
    console.error('Erreur:', error);
  }
}
```

## 📊 Structure du Document Utilisateur (Firestore)

Chaque utilisateur a un document dans la collection `users`:

```json
{
  "uid": "user123",                    // ID Firebase (auto)
  "email": "user@example.com",
  "displayName": "John Doe",
  "phone": "+243812345678",
  "profilePictureUrl": null,
  "location": "Kinshasa",
  "role": "customer",                  // customer | provider | admin
  "createdAt": "2025-12-21T...",
  "updatedAt": "2025-12-21T..."
}
```

## ⚠️ Règles de Sécurité (Firestore)

Ajouter à votre `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authentification requise pour tous
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // Users - Accès personnel
    match /users/{userId} {
      allow read: if request.auth.uid == userId || request.auth.uid != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## 🔄 Flux d'Authentification

```
[Login/Register] → [Firebase Auth] → [Create User Doc] → [Firestore]
                                           ↓
                                    [AuthContext Update]
                                           ↓
                                    [Navigate Home]
```

## 🛡️ Gestion des Erreurs

Le service `AuthService` retourne des messages d'erreur localisés:

| Code Firebase | Message FR |
|---|---|
| `email-already-in-use` | Cet email est déjà utilisé |
| `weak-password` | Le mot de passe doit contenir au moins 6 caractères |
| `invalid-email` | Format d'email invalide |
| `user-not-found` | Aucun compte trouvé avec cet email |
| `wrong-password` | Mot de passe incorrect |
| `too-many-requests` | Trop de tentatives. Essayez plus tard |

## 🔐 Sécurité des Mots de Passe

- ✅ Minimum 6 caractères (validé côté client)
- ✅ Stockage sécurisé avec Firebase Auth (hash)
- ✅ Pas d'accès direct aux mots de passe
- ✅ Support des tokens JWT automatiques

## 📱 Intégration Mobile (Futur)

Avec Capacitor/Cordova:
- Utiliser les APIs natives de sécurité biométrique
- Stocker les tokens de manière sécurisée
- Implémenter la reconnexion automatique

## 🎯 Prochaines Étapes

1. **Configurer les règles Firestore** dans Firebase Console
2. **Ajouter "Mot de passe oublié"** avec Firebase Reset Email
3. **Implémenter la vérification d'email** post-inscription
4. **Ajouter des profils sociaux** (LinkedIn, GitHub, etc.)
5. **Configurer Cloud Functions** pour nettoyage des données

## 📚 Ressources

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security)
- [Best Practices](https://firebase.google.com/docs/auth/manage-users)
