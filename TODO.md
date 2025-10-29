# ✅ TODO - Le Spot SUP

**Synchronisé automatiquement avec CLAUDE_MEMORY.md**

---

## 🔥 Priorité Haute

- [ ] **Intégration API Météo** (Weatherbit)
  - Fichier: `components/WeatherInfo.tsx` existe mais pas connecté
  - Besoin: Variable env `NEXT_PUBLIC_WEATHERBIT_API_KEY`
  - Afficher dans popup Header et sur page carte
  - Endpoint: `https://api.weatherbit.io/v2.0/current`

- [ ] **Base de données réelle**
  - Actuellement: Données mockées dans `lib/spotsData.ts`
  - Recommandation: Supabase
  - Modèles définis dans SPECIFICATIONS.md
  - Setup: Créer projet Supabase + tables + migrations

- [ ] **Authentification**
  - NextAuth.js ou Supabase Auth
  - Pages: `/login`, `/signup`, `/profile`
  - Gestion sessions utilisateurs
  - Protection routes privées

---

## 🟡 Priorité Moyenne

- [ ] **Ajouter spot** (formulaire `/map` tab "add")
  - Form avec validation (nom, coordonnées, type, etc.)
  - Upload position depuis géolocalisation actuelle
  - Preview sur carte avant soumission

- [ ] **Upload photos spots** (Cloudinary)
  - Intégration Cloudinary API
  - Compression automatique
  - Multiple uploads par spot
  - Gallery dans détails spot

- [ ] **Système de reviews/ratings**
  - Notation étoiles (1-5)
  - Commentaires texte
  - Modération contenu
  - Average rating par spot

- [ ] **Page sessions avec statistiques**
  - Dashboard personnel
  - Graphiques (distance, temps, fréquence)
  - Historique complet
  - Export données (CSV/PDF)

- [ ] **PWA manifest + service workers**
  - Installable sur mobile
  - Mode offline pour spots visités
  - Notifications push
  - App icon + splash screen

---

## 🟢 Priorité Basse

- [ ] **Tests unitaires** (Jest)
  - Setup Jest + React Testing Library
  - Tests components critiques
  - Coverage > 80%

- [ ] **Tests E2E** (Playwright)
  - Scénarios utilisateur complets
  - Tests authentification
  - Tests ajout spot
  - Tests recherche/filtres

- [ ] **Analytics** (GA4)
  - Intégration Google Analytics 4
  - Tracking events personnalisés
  - Funnel conversion
  - Heatmaps (Hotjar?)

- [ ] **SEO optimization**
  - Meta tags dynamiques
  - Open Graph pour partage
  - Sitemap.xml
  - robots.txt
  - Schema.org structured data

---

## ✅ Complété Récemment

- [x] **Géolocalisation automatique en temps réel** (2025-01-27)
  - watchPosition() implémenté
  - Tracking automatique après acceptation popup
  - Indicateur visuel pulsant dans Header
  - Recalcul distances automatique (useMemo)

- [x] **Système mémoire persistante** (2025-01-27)
  - CLAUDE_MEMORY.md avec historique 10 échanges
  - CLAUDE.md instructions permanentes
  - Commandes slash (/continue, /status, /save-memory)
  - DECISIONS.md pour choix techniques
  - TODO.md auto-sync
  - CHANGELOG.md avec versions

---

## 📋 Notes

- **Mise à jour**: Ce fichier se synchronise automatiquement avec la section "EN COURS / À FAIRE" de CLAUDE_MEMORY.md
- **Format**: GitHub-flavored markdown avec checkboxes
- **Ajout rapide**: Ajouter ici puis Claude synchro dans CLAUDE_MEMORY.md

---

**Dernière synchronisation**: 2025-01-27
**Tasks total**: 18 (3 haute priorité, 6 moyenne, 4 basse, 5 complétées)
