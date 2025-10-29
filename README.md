# Le Spot SUP 🏄‍♂️

LA plateforme mondiale de référence pour le stand-up paddle. Découvrez, partagez et explorez les meilleurs spots SUP partout dans le monde, avec une couverture initiale exceptionnelle de 250+ spots au Québec.

## 📖 À propos

Le Spot SUP est une plateforme complète qui combine technologie moderne et passion pour le SUP. Que vous soyez débutant ou expert, trouvez les meilleurs spots, suivez vos performances et rejoignez une communauté mondiale de passionnés.

## ✨ Fonctionnalités principales

- 🌍 **Couverture mondiale** : 250+ spots au Québec, expansion internationale en cours
- 🗺️ **Cartes interactives** avec géolocalisation précise et informations détaillées
- ⛅ **Météo en temps réel** avec recommandations de paddle (API Weatherbit)
- 📚 **Guide de sécurité complet** en français et anglais
- 🗓️ **Suivi de sessions personnalisé** avec statistiques
- 👥 **Communauté mondiale** et événements
- 🎨 **Thèmes** : Clair, Sombre, Système
- 🌐 **Multilingue** : Français & English (extensible)
- 📱 **Responsive** : Desktop, tablette, mobile

## Pages du Site

- **Page d'accueil** (`/`) - Hero section et présentation des fonctionnalités
- **Carte** (`/map`) - Carte interactive avec recherche, détails des spots, recommandations IA, et ajout de nouveaux spots
- **Le Guide** (`/guide`) - Guide complet de sécurité pour le SUP
- **Mes Sessions** (`/sessions`) - Enregistrez et gérez vos sorties
- **Connexion** (`/login`) - Page de connexion
- **Inscription** (`/signup`) - Page d'inscription

## Installation

1. Installez les dépendances :
```bash
npm install
```

2. Configurez les variables d'environnement :
```bash
# Copiez le fichier d'exemple
cp .env.example .env.local

# Les clés API sont déjà configurées dans .env.local
# IMPORTANT: Ne commitez JAMAIS le fichier .env.local (déjà dans .gitignore)
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

4. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 🔑 API Keys Configurées

Le projet utilise les API suivantes (clés déjà configurées dans `.env.local`):

- **Google Gemini AI** - Recommandations intelligentes de spots
- **Google Maps / MapTiler** - Cartes interactives
- **Weatherbit** - Météo en temps réel
- **OpenAI / Anthropic** - Fonctionnalités IA avancées

> ⚠️ **Sécurité**: Le fichier `.env.local` contient vos clés API et ne doit jamais être partagé ou commité dans Git.

## Technologies Utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icônes
- **next-themes** - Gestion du thème clair/sombre

## Structure du Projet

```
E:\Le Spot SUP\
├── app/
│   ├── guide/          # Page Guide du SUP
│   ├── login/          # Page de connexion
│   ├── map/            # Page Carte interactive
│   ├── sessions/       # Page Mes Sessions
│   ├── signup/         # Page d'inscription
│   ├── globals.css     # Styles globaux
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Page d'accueil
├── components/
│   ├── Header.tsx           # Navigation et header
│   ├── LanguageProvider.tsx # Contexte multilingue
│   └── ThemeProvider.tsx    # Gestion du thème
├── lib/
│   └── translations.ts      # Traductions FR/EN
└── package.json
```

## 🚀 État d'Avancement

### ✅ Fonctionnalités Implémentées

- [x] Interface utilisateur complète et responsive
- [x] Système de thèmes (Clair/Sombre/Système)
- [x] Support multilingue (FR/EN)
- [x] Navigation avec menu hamburger
- [x] Page d'accueil avec hero section
- [x] Guide de sécurité SUP complet et visuellement captivant
- [x] Page de suivi de sessions avec modal d'ajout
- [x] Page carte avec 4 vues (Liste, Détails, IA, Ajouter)
- [x] Pages d'authentification (Connexion/Inscription)
- [x] Design moderne avec Tailwind CSS
- [x] Icône et logo personnalisés

### 🔄 En Développement

- [ ] Intégration API Weatherbit pour météo en temps réel
- [ ] Backend avec base de données (250+ spots au Québec)
- [ ] Authentification fonctionnelle
- [ ] Intégration carte interactive (Mapbox/Leaflet)
- [ ] Géolocalisation de l'utilisateur
- [ ] Upload d'images pour les spots
- [ ] Système de notation et commentaires
- [ ] Page d'événements communautaires
- [ ] Notifications push
- [ ] Statistiques avancées des sessions

## 🛠️ Prochaines Étapes Recommandées

### Phase 1 : Backend & Données
1. Configurer une base de données (Supabase/Firebase)
2. Importer les 250+ spots du Québec
3. Créer les API endpoints pour CRUD des spots
4. Implémenter l'authentification réelle

### Phase 2 : Intégrations
1. Intégrer l'API Weatherbit pour la météo
2. Ajouter une carte interactive (Mapbox recommandé)
3. Implémenter la géolocalisation
4. Système d'upload d'images (Cloudinary/S3)

### Phase 3 : Communauté
1. Système de commentaires et notation
2. Page d'événements
3. Profils utilisateurs complets
4. Notifications en temps réel

### Phase 4 : Optimisation
1. SEO et métadonnées
2. Performance (lazy loading, optimisation images)
3. PWA (Progressive Web App)
4. Analytics et suivi utilisateur

## Licence

© 2025 Le Spot SUP. Tous droits réservés.
