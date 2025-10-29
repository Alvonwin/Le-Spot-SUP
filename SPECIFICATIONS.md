# Spécifications Techniques - Le Spot SUP

## 📋 Vue d'ensemble

Le Spot SUP est une plateforme web moderne construite avec Next.js 14, TypeScript et Tailwind CSS, offrant une expérience complète pour les amateurs de stand-up paddle.

## 🎯 Objectifs du Projet

1. **Centraliser** l'information sur les spots de SUP au Québec et dans le monde
2. **Faciliter** la découverte de nouveaux spots avec l'IA
3. **Améliorer** la sécurité avec un guide complet
4. **Connecter** la communauté SUP mondiale
5. **Suivre** les performances personnelles

## 🏗️ Architecture Technique

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **Icônes**: Lucide React
- **Thèmes**: next-themes

### Backend (À implémenter)
- **Base de données**: Supabase (recommandé) ou Firebase
- **Authentification**: NextAuth.js ou Supabase Auth
- **Storage**: Cloudinary ou AWS S3 pour images
- **API Météo**: Weatherbit API

### Hébergement (Recommandé)
- **Frontend**: Vercel (optimisé pour Next.js)
- **Base de données**: Supabase Cloud
- **CDN**: Cloudflare ou Vercel Edge

## 📊 Modèle de Données

### Spot
```typescript
interface Spot {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    province: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  description: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  type: 'Lac Calme' | 'Rivière' | 'Océan' | 'Canal';
  amenities: {
    parking: boolean;
    toilets: boolean;
    rentals: boolean;
    dogs: boolean;
  };
  images: string[];
  rating: number;
  reviewCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
}
```

### Session
```typescript
interface Session {
  id: string;
  userId: string;
  spotId: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  distance?: number; // km
  weather?: {
    temp: number;
    wind: number;
    conditions: string;
  };
  notes?: string;
  photos?: string[];
  createdAt: Date;
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  location?: {
    city: string;
    province: string;
  };
  preferences: {
    language: 'fr' | 'en';
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
  stats: {
    totalSessions: number;
    totalDistance: number;
    totalTime: number;
    spotsVisited: number;
  };
  createdAt: Date;
}
```

## 🔌 Intégrations API

### Weatherbit API
**Endpoint**: `https://api.weatherbit.io/v2.0/current`

**Utilisation**:
- Conditions actuelles pour chaque spot
- Recommandations de paddle basées sur météo
- Prévisions 7 jours

**Données nécessaires**:
- Température
- Vitesse du vent
- Direction du vent
- Conditions (nuageux, ensoleillé, etc.)
- Vagues (si disponible)

### Mapbox/Leaflet
**Utilisation**:
- Affichage de la carte interactive
- Marqueurs pour chaque spot
- Clustering pour performance
- Calcul de distance depuis position utilisateur

## 🎨 Design System

### Couleurs
```css
--ocean-light: #A8DADC
--ocean: #457B9D
--ocean-dark: #1D3557
--primary: #FF8C42
--primary-dark: #E67A35
```

### Typographie
- **Font**: Inter (Google Fonts)
- **Sizes**:
  - Heading 1: 3rem (48px)
  - Heading 2: 2.25rem (36px)
  - Body: 1rem (16px)

### Composants Réutilisables
- Cards avec hover effects
- Buttons avec états (default, hover, active, disabled)
- Modals/Dialogs
- Form inputs avec validation
- Loading states
- Error states

## 🔒 Sécurité

### Authentification
- Email/Password avec vérification
- OAuth (Google, Facebook optionnel)
- Tokens JWT
- Sessions sécurisées

### Validation
- Validation côté client (React Hook Form + Zod)
- Validation côté serveur
- Sanitization des inputs
- Protection CSRF

### Données Privées
- Sessions personnelles (privées par défaut)
- Profil public/privé
- Modération des commentaires
- Signalement de contenu inapproprié

## 📱 Features Mobile

### Responsive Design
- Breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### PWA (Progressive Web App)
- Manifest.json
- Service Workers
- Offline mode (cache des spots visités)
- Installation sur écran d'accueil

### Géolocalisation
- Demande de permission utilisateur
- Spots à proximité
- Calcul de distance
- Navigation vers spot

## 🚀 Performance

### Optimisations
- Image optimization (next/image)
- Lazy loading des composants
- Code splitting automatique (Next.js)
- Caching stratégique
- Compression gzip

### Métriques Cibles
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## 📈 Analytics & Monitoring

### Métriques à Suivre
- Utilisateurs actifs
- Spots les plus consultés
- Sessions enregistrées
- Taux de conversion (signup)
- Performance des pages

### Outils Recommandés
- Google Analytics 4
- Vercel Analytics
- Sentry (error tracking)
- Hotjar (user behavior)

## 🌐 Internationalisation

### Langues Supportées
- Français (principal)
- Anglais
- Extensible pour d'autres langues

### Gestion des Traductions
- Fichiers JSON par langue
- Context API pour state
- Détection automatique de langue
- Sélecteur de langue dans header

## 🧪 Tests

### Types de Tests (À implémenter)
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Cypress
- **E2E Tests**: Playwright
- **Performance Tests**: Lighthouse CI

### Coverage Ciblé
- > 80% de code coverage
- Tests critiques sur authentification
- Tests sur formulaires
- Tests sur navigation

## 📦 Déploiement

### Environnements
1. **Development**: Local (localhost:3000)
2. **Staging**: Vercel preview deployments
3. **Production**: Vercel production

### CI/CD
- GitHub Actions
- Tests automatiques sur PR
- Déploiement automatique sur merge
- Rollback automatique si erreur

### Variables d'Environnement
```env
NEXT_PUBLIC_WEATHERBIT_API_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_URL=
```

## 📄 Documentation

### Pour Développeurs
- README.md (installation, usage)
- CONTRIBUTING.md (guidelines)
- API.md (endpoints documentation)
- CHANGELOG.md (versions)

### Pour Utilisateurs
- Guide d'utilisation intégré
- FAQ
- Tutoriels vidéo (futur)
- Blog (conseils SUP)

---

**Dernière mise à jour**: 2025-01-27
**Version**: 1.0.0
**Statut**: MVP en développement
