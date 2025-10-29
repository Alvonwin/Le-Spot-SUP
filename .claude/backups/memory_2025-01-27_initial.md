# 🧠 Claude Memory - Le Spot SUP
**Journal de développement pour continuité entre sessions**

---

## 📌 CONTEXTE PROJET
**Nom**: Le Spot SUP
**Type**: Plateforme web Next.js 14 pour communauté SUP (Stand-Up Paddle)
**Stack**: Next.js 14, TypeScript, Tailwind CSS, React
**Propriétaire**: Alain (niwno)
**Statut**: MVP en développement actif

---

## 🎯 ÉTAT ACTUEL (2025-01-27)

### ✅ Fonctionnalités Complétées

#### 1. **Géolocalisation Automatique en Temps Réel** ⭐ RÉCENT
- **Fichiers modifiés**:
  - `components/LocationProvider.tsx` - Context avec suivi GPS automatique
  - `components/GeolocationPrompt.tsx` - Popup unique au premier lancement
  - `components/Header.tsx` - Indicateur visuel avec pulsation verte
  - `app/map/page.tsx` - Recalcul automatique des distances avec useMemo

- **Fonctionnement**:
  - Popup s'affiche UNE SEULE FOIS à la première visite
  - Si accepté → `localStorage.setItem("geolocation-answered", "true")`
  - `watchPosition()` démarre automatiquement pour suivi temps réel
  - Position se met à jour toutes les 30s ou au mouvement
  - Icône verte pulsante dans Header = tracking actif
  - Icône rouge = position non activée
  - Au prochain login → tracking démarre automatiquement (pas de re-popup)

- **État**: ✅ **COMPLÉTÉ ET TESTÉ**

#### 2. **Carte Interactive**
- `app/map/page.tsx` - Page carte avec liste spots
- `components/InteractiveMap.tsx` - Intégration MapLibre GL
- Calcul distances depuis position utilisateur
- Filtres et recherche de spots
- API Key MapTiler: `Y5cpHmk0y0XqDpVOcD41`

#### 3. **Système Multilingue**
- `components/LanguageProvider.tsx` - Context FR/EN
- `lib/translations.ts` - Fichier traductions
- Sélecteur dans Header

#### 4. **Thème Sombre/Clair**
- `next-themes` configuré
- Toggle dans Header
- Persistence localStorage

#### 5. **Architecture Pages**
- `/` - Page accueil avec Hero
- `/map` - Carte interactive + spots
- `/guide` - Guide sécurité SUP
- `/sessions` - Suivi performances
- `/community` - Communauté (à venir)

---

## 🚧 EN COURS / À FAIRE

### Priorité Haute
- [ ] **Intégration API Météo** (Weatherbit)
  - Fichier: `components/WeatherInfo.tsx` existe mais pas connecté
  - Besoin: Variable env `NEXT_PUBLIC_WEATHERBIT_API_KEY`
  - Afficher dans popup Header et sur page carte

- [ ] **Base de données réelle**
  - Actuellement: Données mockées dans `lib/spotsData.ts`
  - Recommandation: Supabase
  - Modèles définis dans SPECIFICATIONS.md

- [ ] **Authentification**
  - NextAuth.js ou Supabase Auth
  - Pages: `/login`, `/signup`, `/profile`

### Priorité Moyenne
- [ ] Ajouter spot (formulaire `/map` tab "add")
- [ ] Upload photos spots (Cloudinary)
- [ ] Système de reviews/ratings
- [ ] Page sessions avec statistiques
- [ ] PWA manifest + service workers

### Priorité Basse
- [ ] Tests unitaires (Jest)
- [ ] Tests E2E (Playwright)
- [ ] Analytics (GA4)
- [ ] SEO optimization

---

## 📁 STRUCTURE FICHIERS IMPORTANTE

```
E:\Le Spot SUP/
├── app/
│   ├── page.tsx              # Page accueil
│   ├── map/page.tsx          # Carte interactive ⭐ ACTIF
│   ├── guide/page.tsx        # Guide sécurité
│   └── sessions/page.tsx     # Suivi performances
├── components/
│   ├── Header.tsx            # Navigation + géoloc indicator ⭐
│   ├── LocationProvider.tsx  # GPS tracking automatique ⭐
│   ├── GeolocationPrompt.tsx # Popup permission ⭐
│   ├── InteractiveMap.tsx    # Carte MapLibre
│   ├── LanguageProvider.tsx  # Multilingue
│   └── WeatherInfo.tsx       # Widget météo (à connecter)
├── lib/
│   ├── spotsData.ts          # Data mockée spots Québec
│   └── translations.ts       # Traductions FR/EN
├── .claude/
│   └── settings.local.json   # Permissions Claude
├── SPECIFICATIONS.md         # Specs techniques complètes
├── CLAUDE_MEMORY.md          # ⭐ CE FICHIER
└── package.json              # Dependencies
```

---

## 🔧 COMMANDES UTILES

```bash
# Dev server (ports auto: 3000 ou 3001 si occupé)
npm run dev

# Build production
npm run build

# Tuer processus si port bloqué
taskkill /F /IM node.exe

# Voir processus Node actifs
tasklist | findstr node
```

---

## 💡 DÉCISIONS TECHNIQUES IMPORTANTES

### Géolocalisation
- **Choix**: `watchPosition()` au lieu de `getCurrentPosition()` répété
- **Raison**: Meilleure batterie, updates fluides, pas de spam serveur
- **Timeout**: 27s (évite erreurs trop rapides)
- **MaxAge**: 30s (cache acceptable pour SUP)

### Calcul Distances
- **Formule**: Haversine (fonction dans `app/map/page.tsx`)
- **Recalcul**: Via `useMemo([userLocation])` pour performance
- **Pourquoi pas lib externe**: Formule simple, pas de dépendance extra

### State Management
- **Choix**: React Context API (LanguageProvider, LocationProvider)
- **Pas de Redux/Zustand**: Projet taille MVP, contextes suffisent
- **Futur**: Si app grandit → considérer Zustand

---

## 🐛 BUGS CONNUS / WARNINGS

### Non-critiques
- Warnings MapLibre images manquantes (`doityourself`, `deli`, etc.)
  - **Impact**: Aucun, ce sont des POI de la carte de base
  - **Fix**: Ignorer ou ajouter sprite custom

- Webpack cache warnings (rare)
  - **Impact**: Aucun, juste ralentit Fast Refresh
  - **Fix**: Supprimer `.next` si persistant

### Critiques
- ❌ Aucun actuellement

---

## 🎨 DESIGN SYSTEM

### Couleurs Principales
```css
--ocean-light: #A8DADC  /* Accents clairs */
--ocean: #457B9D        /* Principal */
--ocean-dark: #1D3557   /* Header, foncé */
--primary: #FF8C42      /* CTA orange */
```

### Conventions de Code
- **Components**: PascalCase, un par fichier
- **Types**: Interfaces en haut de fichier ou types.ts dédié
- **Styling**: Tailwind classes (pas de CSS modules)
- **State**: useState pour local, Context pour global

---

## 📞 RESSOURCES EXTERNES

### APIs
- **MapTiler**: Maps + geocoding
  - Key: `Y5cpHmk0y0XqDpVOcD41`
  - Docs: https://docs.maptiler.com/

- **Weatherbit**: Météo (À configurer)
  - Endpoint: `https://api.weatherbit.io/v2.0/current`
  - Docs: https://www.weatherbit.io/api

### Assets
- **Screenshots**: `C:/Users/niwno/Desktop/LeSpotSUP Screenshots/`
- **Database backup**: `E:/Base de donnée/STOP - Le Spot SUP/`
- **Old site reference**: `C:/Users/niwno/Desktop/Site pas beau/`

---

## 📝 NOTES POUR PROCHAIN CLAUDE

### Quand l'utilisateur dit "continue" ou partage un fichier `.txt`:
1. ✅ Lire ce fichier `CLAUDE_MEMORY.md` EN PREMIER
2. ✅ Comprendre le contexte sans questions
3. ✅ Vérifier section "EN COURS / À FAIRE"
4. ✅ Mettre à jour ce fichier après chaque fonctionnalité complétée
5. ✅ Optimiser cet espace (supprimer anciennes notes si obsolètes)

### Style de travail préféré par Alain:
- ✅ Proactif mais demander avant gros changements
- ✅ Français comme langue principale
- ✅ Pas d'emojis sauf si demandé
- ✅ TodoList pour tracking (très important!)
- ✅ Code propre, commenté si complexe
- ✅ Tester avant de dire "c'est fini"

### Permissions Claude Auto-approuvées:
- Bash `npm run dev`, `npm run build`, `taskkill`
- Read: Screenshots, Downloads, Database backup folder
- Voir `.claude/settings.local.json` pour liste complète

---

## 💬 HISTORIQUE CONVERSATION (10 derniers échanges)
**⚠️ IMPORTANT**: Cette section se met à jour EN TEMPS RÉEL pendant la session actuelle
**Format optimisé**: Alain (demande courte) + Claude (réponse compressée) + Action (résultat)

### Échange #15 (2025-01-27)
**Alain**: "Tu es génial! Tu penses à autre chose qu'on pourrait faire pour optimiser ta mémoire?"
**Claude**: "Oui! Je suggère: 1) Fichier DECISIONS.md séparé pour décisions techniques importantes (évite répéter le 'pourquoi') 2) TODO.md auto-sync avec section EN COURS 3) CHANGELOG.md avec versions/features 4) Backup auto de CLAUDE_MEMORY.md 5) Metrics (lignes code, features complétées) 6) Quick-start commands pour tâches répétitives"
**Action**: En attente de validation pour implémenter

### Échange #14 (2025-01-27)
**Alain**: "Quand j'écris 'continue', Claude propose la prochaine étape car il sait tout. Même après redémarrage PC."
**Claude**: "EXACTEMENT! Mémoire persiste sur disque. Je lis et propose suite logique."
**Action**: ✅ Confirmation + Ajout proposition proactive dans instructions

### Échange #13 (2025-01-27)
**Alain**: "Tu enregistres ce que tu dis aussi?! De façon compressée/optimisée."
**Claude**: "OUI! Format: Alain (demande courte) + Claude (réponse compressée) + Action (résultat)"
**Action**: ✅ Reformatage historique complet avec 2 côtés optimisés

### Échange #12 (2025-01-27)
**Alain**: "Processus = 'claude' puis 'continue'?"
**Claude**: "✅ Exactement! Archive se met à jour en temps réel, contexte toujours présent"
**Action**: ✅ Confirmation système + Documentation processus complet

### Échange #11 (2025-01-27)
**Alain**: "Historique temps réel + comment continuer?"
**Claude**: "Ajout note temps réel + commande = `continue`"
**Action**: ✅ COMMENT_CONTINUER.md créé

### Échange #10 (2025-01-27)
**Alain**: "Je veux qu'il récite nos 10 derniers échanges au prochain login"
**Claude**: "Système de mémoire avec historique pour continuité totale"
**Action**: ✅ Section historique ajoutée à CLAUDE_MEMORY.md

### Échange #9 (2025-01-27)
**Alain**: "Auto-sauvegarde mémoire optimisée. Garde un journal pour futurs Claude"
**Claude**: "Création système complet avec CLAUDE_MEMORY.md, CLAUDE.md, commandes slash"
**Action**: ✅ Système mémoire persistante opérationnel

### Échange #8 (2025-01-27)
**Alain**: "Peux-tu voir la mémoire Claude dans ce dossier?"
**Claude**: "Lecture settings + SPECIFICATIONS.md, validation contexte"
**Action**: ✅ Review permissions et specs projet

### Échange #7 (2025-01-27)
**Alain**: Partage fichier "claude --continu.txt"
**Claude**: "Validation géolocalisation automatique complète (watchPosition, tracking temps réel, indicateur pulsant)"
**Action**: ✅ Résumé implémentation

### Échange #6 (2025-01-27)
**Alain**: "Automatise la géolocalisation en temps réel pour tout (carte, météo, etc.)"
**Claude**: "Implémentation watchPosition() dans LocationProvider, tracking auto après acceptation popup"
**Action**: ✅ LocationProvider.tsx modifié

### Échange #5 (Session précédente)
**Alain**: "Distances affichent 0 km"
**Claude**: "Problème: spots calculés une fois au mount. Solution: useMemo pour recalcul auto"
**Action**: ✅ app/map/page.tsx - ajout useMemo + déplacement calculateDistance

### Échange #4 (Session précédente)
**Alain**: "Popup météo dit 'Activez géolocalisation' même quand c'est actif"
**Claude**: "Amélioration condition dans Header pour afficher position GPS"
**Action**: ✅ Header.tsx modifié

### Échange #3 (Session précédente)
**Alain**: "Retire le badge Position active du menu carte"
**Claude**: "Suppression lignes 179-185 pour interface plus épurée, indicateur déjà dans Header"
**Action**: ✅ app/map/page.tsx nettoyé

### Échange #2 (Session précédente)
**Alain**: "Harmonise la géolocalisation"
**Claude**: "Indicateur unique Header (rouge/vert), calcul distances automatique"
**Action**: ✅ Système géolocalisation harmonisé

---

## 🔄 DERNIÈRE SESSION

**Date**: 2025-01-27 (Session actuelle)
**Durée**: ~2h30
**Travaux effectués**:
1. ✅ Review complète système géolocalisation automatique
2. ✅ Validation fonctionnement (LocationProvider, Header, Map)
3. ✅ Création système mémoire persistante complet
4. ✅ Configuration journal de développement
5. ✅ Ajout historique 10 derniers échanges (mise à jour temps réel)
6. ✅ Création commandes slash (/continue, /save-memory, /status)
7. ✅ Documentation CLAUDE.md pour instructions permanentes
8. ✅ Création COMMENT_CONTINUER.md (guide simple pour Alain)

**État mental du projet**:
- Géolocalisation automatique: ✅ TERMINÉE ET TESTÉE
- Système mémoire: ✅ OPÉRATIONNEL
- Prochaine priorité: API Météo OU Authentification

**Prochaine étape suggérée**:
- Connecter API Weatherbit pour météo temps réel
- OU implémenter authentification utilisateurs (NextAuth/Supabase)

---

## 📋 INSTRUCTIONS LECTURE RAPIDE POUR PROCHAIN CLAUDE

**Au démarrage (même après redémarrage PC), RÉCITER ceci à Alain:**
> "Je suis à jour sur Le Spot SUP. Dernière session: 2025-01-27. Géolocalisation automatique ✅ complétée (watchPosition, tracking temps réel, indicateur pulsant). Système mémoire ✅ opérationnel. Prochaines priorités: API météo ou authentification. Prêt à continuer - que souhaitez-vous faire?"

**Puis PROPOSER activement la suite logique:**
> "Je peux commencer par l'intégration de l'API météo Weatherbit dans WeatherInfo.tsx si vous voulez, ou on peut attaquer l'authentification avec Supabase. Quelle direction préférez-vous?"

**Si Alain demande l'historique:**
- Résumer les 10 derniers échanges ci-dessus
- Montrer compréhension du contexte actuel
- Être proactif, pas juste attendre

---

**🤖 Auto-sauvegardé le**: 2025-01-27
**📊 Taille optimisée**: ~11KB (lisible en 3 min)
