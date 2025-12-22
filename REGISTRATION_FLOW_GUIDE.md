# 📝 Guide d'Authentification et Configuration Profil

## 🎯 Flux d'Inscription Complet

```
[AuthScreen - Inscription]
  ↓ (Email + Mot de passe avec toggle voir/cacher)
[Register User] (Firebase Auth + Firestore)
  ↓
[ProfileSetupScreen - Étapes 1-4]
  1. Téléphone
  2. Pays/Ville
  3. Nationalité
  4. Photo de profil
  ↓
[HomeScreen]
```

## 🔐 Composants d'Authentification

### AuthScreen
- **Modes**: Login & Register
- **Formulaire d'inscription**:
  - Email (Input standard)
  - Nom complet (Input standard)
  - Mot de passe (PasswordInput avec toggle)
  - Connexion Google

### PasswordInput Component
Nouveau composant réutilisable avec:
- ✅ Icône voir/cacher le mot de passe
- ✅ Toggle interactif
- ✅ Support du disabled state
- ✅ Styles cohérents avec UI

```tsx
<PasswordInput 
  placeholder="Mot de passe"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

## 🏗️ ProfileSetupScreen - 4 Étapes

### Étape 1: Téléphone
- Input téléphone (+243...)
- Validation requise

### Étape 2: Localisation
- Sélection du **Pays** (RDC en premier)
- Sélection de la **Ville** (selon le pays)
- Format alphabétique après RDC

### Étape 3: Nationalité
- Dropdown avec toutes les nationalités
- RDC en priorité

### Étape 4: Photo de Profil
- Upload d'image (JPG, PNG, max 5MB)
- Preview en temps réel
- Bouton pour supprimer la sélection
- Upload optionnel

## 📊 Données Géographiques

Fichier: `data/geographicData.ts`

### Structure Pays
```typescript
{
  id: "cd",
  code: "CD",
  name: "République Démocratique du Congo (RDC)",
  cities: [
    { id: "kinshasa", name: "Kinshasa" },
    { id: "lubumbashi", name: "Lubumbashi" },
    ...
  ]
}
```

### Fonctions Utilitaires
```typescript
getCountriesList()                    // Tous les pays
getCountryById(id)                    // Pays par ID
getCitiesByCountry(countryId)         // Villes d'un pays
NATIONALITIES                         // Array de nationalités
```

## 💾 Document Utilisateur Mis à Jour

Après ProfileSetup, le document Firestore contient:
```json
{
  "uid": "user123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "phone": "+243812345678",
  "country": "cd",
  "city": "kinshasa",
  "nationality": "Congolaise (RDC)",
  "profilePictureUrl": "https://storage.googleapis.com/...",
  "profileSetupCompleted": true,
  "role": "customer",
  "createdAt": "2025-12-21T...",
  "updatedAt": "2025-12-21T..."
}
```

## 🎨 Progression Visuelle

### Barre de progression
- Affiche l'étape actuelle (1/4, 2/4, etc.)
- Barre animée dans les couleurs de la marque
- Mise à jour à chaque étape

### Couleurs par étape
- **Étape 1** (Téléphone): Cyan 🔵
- **Étape 2** (Location): Bleu 🔷
- **Étape 3** (Nationalité): Violet 🟣
- **Étape 4** (Photo): Vert 💚

## 🚀 Navigation Routing

Type `ScreenName` mis à jour:
```typescript
export type ScreenName = 
  | 'splash' 
  | 'onboarding' 
  | 'auth' 
  | 'profile-setup'  // ← NOUVEAU
  | 'home'
  | ...
```

Flux après inscription:
```
AuthScreen (register) 
  → handleRegister() 
  → AuthService.register() 
  → navigate('profile-setup')
  → ProfileSetupScreen
  → navigate('home')
```

## 📱 Upload Photo Profil

### Stockage Firebase
```
profiles/{userId}/avatar.jpg
```

### Gestion d'erreur
- Taille max: 5 MB
- Formats: JPG, PNG, GIF
- Preview en temps réel avec `FileReader`

### Suppression
- Bouton X pour annuler la sélection
- Réupload possible

## ✅ Validation

### AuthScreen
- ✓ Email requis et valide
- ✓ Mot de passe ≥ 6 caractères
- ✓ Nom complet requis

### ProfileSetupScreen
- ✓ Téléphone non vide
- ✓ Pays et ville sélectionnés
- ✓ Nationalité sélectionnée
- ✓ Photo optionnelle mais validée (5MB max)

## 🔄 États de Chargement

- `loading`: Indicateur Loader avec spinner pendant les opérations
- `error`: Messages d'erreur en rouge
- `success`: Confirmation avant redirection

## 📚 Fichiers Modifiés

```
screens/
  ├─ AuthScreen.tsx          (✅ Inscription améliorée)
  └─ ProfileSetupScreen.tsx  (✅ NOUVEAU - 4 étapes)

components/
  └─ PasswordInput.tsx        (✅ NOUVEAU - avec toggle)

data/
  └─ geographicData.ts        (✅ NOUVEAU - pays/villes/nationalités)

services/
  └─ AuthService.ts          (📦 Inchangé)

context/
  └─ AuthContext.tsx         (📦 Inchangé)

types.ts                       (✅ Ajout 'profile-setup')
App.tsx                        (✅ Route ajoutée)
```

## 🐛 Dépannage

### Photo ne s'upload pas?
1. Vérifier les règles Firebase Storage
2. Vérifier la taille du fichier (< 5MB)
3. Vérifier l'authentification utilisateur

### Nationalité/Pays n'apparaît pas?
1. Recharger la page
2. Vérifier que `geographicData.ts` est importé
3. Vérifier la console pour les erreurs

### Redirect vers HomeScreen ne fonctionne pas?
1. Vérifier que `profile-setup` est dans le type `ScreenName`
2. Vérifier que `ProfileSetupScreen` est importé dans `App.tsx`

## 🎯 Prochaines Étapes

1. **Validation supplémentaire**:
   - Vérification format téléphone par pays
   - Vérification email unique en Firestore

2. **UX Améliorée**:
   - Autofocus sur champs
   - Clavier numérique pour téléphone
   - Recherche ville par défilement

3. **Backend**:
   - Cloud Function pour valider téléphone
   - Archivage photos profil
   - Notifications post-inscription

## 📖 Ressources

- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
- [File Input Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms)
