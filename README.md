# 🏄‍♂️ Le Spot SUP

**La référence mondiale du stand-up paddle**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8)](https://tailwindcss.com/)

## 📖 À propos

Le Spot SUP est LA plateforme mondiale de référence pour le stand-up paddle. Découvrez, partagez et explorez les meilleurs spots SUP partout dans le monde, avec une couverture initiale exceptionnelle de 250+ spots au Québec.

### ✨ Fonctionnalités principales

- 🌍 **Couverture mondiale** : 250+ spots au Québec, expansion internationale en cours
- 🗺️ **Cartes interactives** avec géolocalisation précise et informations détaillées
- ⛅ **Météo en temps réel** avec recommandations de paddle (API Weatherbit)
- 📚 **Guide de sécurité** complet en français et anglais
- 🗓️ **Suivi de sessions** personnalisé avec statistiques
- 👥 **Communauté mondiale** et événements
- 🎨 **Thèmes** : Clair, Sombre, Système
- 🌐 **Multilingue** : Français & English (extensible)
- 📱 **Responsive** : Desktop, tablette, mobile

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/Alvonwin/Le-Spot-SUP.git

# Installer les dépendances
cd Le-Spot-SUP
npm install

# Configurer les variables d'environnement
cp .env.local.example .env.local
# Éditez .env.local avec vos clés API

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🔑 Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_WEATHERBIT_API_KEY=votre_clé_weatherbit
NEXT_PUBLIC_MAPTILER_API_KEY=votre_clé_maptiler
NEXT_PUBLIC_GEMINI_API_KEY=votre_clé_gemini
```

### Obtenir les clés API (gratuites)

- **Weatherbit** : [weatherbit.io/account/create](https://www.weatherbit.io/account/create) (500 appels/jour)
- **Maptiler** : [maptiler.com](https://www.maptiler.com/)
- **Gemini** : [makersuite.google.com](https://makersuite.google.com/)

## 🛠️ Technologies utilisées

### Frontend
- **Next.js 15.5.6** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript 5** - Typage statique
- **Tailwind CSS 3.4** - Styles utilitaires
- **Radix UI** - Composants accessibles

### Carte & Localisation
- **MapLibre GL** - Cartes interactives
- **Maptiler** - Tuiles de carte

### APIs & Services
- **Weatherbit** - Données météorologiques
- **localStorage** - Persistance des données

## 📦 Structure du projet

```
le-spot-sup/
├── src/
│   ├── app/              # Pages Next.js (App Router)
│   │   ├── page.tsx      # Page d'accueil
│   │   ├── map/          # Carte interactive
│   │   ├── weather/      # Météo & conditions
│   │   ├── guide/        # Guide de sécurité
│   │   ├── sessions/     # Suivi des sessions
│   │   ├── events/       # Événements communautaires
│   │   ├── community/    # Communauté
│   │   └── admin/        # Administration
│   ├── components/       # Composants réutilisables
│   ├── context/          # Contexts React (auth, language, theme)
│   ├── services/         # Services métier
│   ├── lib/              # Utilitaires et types
│   └── hooks/            # Hooks personnalisés
├── public/               # Assets statiques
└── scripts/              # Scripts utilitaires
```

## 🌐 Déploiement

### Vercel (recommandé)

```bash
npm run build
npx vercel deploy --prod
```

Ou connectez votre repository GitHub à Vercel pour un déploiement automatique.

### Variables d'environnement sur Vercel

N'oubliez pas d'ajouter vos variables d'environnement dans les paramètres du projet Vercel.

## 📝 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linter ESLint
```

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés.

## 👤 Auteur

**Alain Gagné**
- Email : [lespotsup@gmail.com](mailto:lespotsup@gmail.com)
- Site web : [https://lespotsup.freeddns.org](https://lespotsup.freeddns.org)

## 🙏 Remerciements

- Communauté mondiale du SUP
- Communauté pionnière du Québec
- [Weatherbit.io](https://www.weatherbit.io/) pour l'API météo
- [Maptiler](https://www.maptiler.com/) pour les cartes
- Tous les contributeurs qui partagent leurs spots favoris

---

**© 2025 Le Spot SUP - Alain Gagné. Tous droits réservés.**

Fait avec ❤️ pour la communauté mondiale du SUP
