# 🎯 Décisions Techniques - Le Spot SUP

**Archive des choix techniques importants et leurs justifications**

---

## Géolocalisation

### watchPosition() vs getCurrentPosition()
**Décision**: Utiliser `navigator.geolocation.watchPosition()`
**Quand**: 2025-01-27
**Pourquoi**:
- ✅ Updates automatiques en temps réel (toutes les 30s ou au mouvement)
- ✅ Meilleure expérience utilisateur (pas de clic répété)
- ✅ Économie batterie vs polling manuel
- ✅ API native, pas de dépendance externe
**Alternative rejetée**: `getCurrentPosition()` appelé répétitivement (spam serveur, UX médiocre)
**Fichiers impactés**: `components/LocationProvider.tsx`

### Formule Haversine en Interne
**Décision**: Implémenter la formule Haversine directement
**Quand**: Session précédente (2025-01-26)
**Pourquoi**:
- ✅ Formule simple (~10 lignes)
- ✅ Pas de dépendance externe (bundle plus léger)
- ✅ Performance excellente pour nos besoins
- ✅ Pas de breaking changes de lib tierce
**Alternative rejetée**: Librairies comme `geolib` (overkill pour calcul simple)
**Fichiers impactés**: `app/map/page.tsx` (fonction calculateDistance)

### useMemo pour Recalcul Distances
**Décision**: Utiliser `useMemo([userLocation])` pour calculer spots avec distances
**Quand**: 2025-01-27
**Pourquoi**:
- ✅ Recalcul automatique uniquement quand position change
- ✅ Évite render inutiles de tous les spots
- ✅ Performance optimale (pas de calcul à chaque render)
- ✅ Pattern React recommandé
**Problème résolu**: Distances affichaient "0 km" car calculées une seule fois au mount
**Fichiers impactés**: `app/map/page.tsx`

---

## State Management

### React Context API vs Redux/Zustand
**Décision**: Utiliser React Context API
**Quand**: Début du projet
**Pourquoi**:
- ✅ Suffisant pour taille MVP
- ✅ Pas de dépendance externe
- ✅ Léger et simple à maintenir
- ✅ Intégré nativement dans React
**Considération future**: Si app grandit (>20 contexts), migrer vers Zustand
**Fichiers impactés**:
- `components/LocationProvider.tsx`
- `components/LanguageProvider.tsx`

---

## Styling

### Tailwind CSS vs CSS Modules
**Décision**: Tailwind CSS exclusivement
**Quand**: Début du projet
**Pourquoi**:
- ✅ Rapidité de développement
- ✅ Design system cohérent
- ✅ Purge automatique (CSS optimisé en prod)
- ✅ Responsive utilities built-in
- ✅ Dark mode simple
**Alternative rejetée**: CSS Modules (plus verbeux, fichiers séparés)

---

## Architecture

### Next.js App Router vs Pages Router
**Décision**: App Router (Next.js 14)
**Quand**: Début du projet
**Pourquoi**:
- ✅ Futur de Next.js
- ✅ Server Components par défaut
- ✅ Layouts imbriqués
- ✅ Meilleure performance
**Note**: Nécessite "use client" pour composants avec state

---

## Carte Interactive

### MapLibre GL vs Leaflet
**Décision**: MapLibre GL
**Quand**: Début du projet
**Pourquoi**:
- ✅ Performance supérieure (WebGL)
- ✅ Open source (fork de Mapbox GL)
- ✅ Gratuit sans restrictions
- ✅ Vector tiles modernes
**Alternative rejetée**: Leaflet (plus ancien, raster tiles, moins performant)
**Fichiers impactés**: `components/InteractiveMap.tsx`

---

## Mémoire Persistante

### Fichier Markdown vs Base de Données
**Décision**: Fichier `CLAUDE_MEMORY.md` en Markdown
**Quand**: 2025-01-27
**Pourquoi**:
- ✅ Humainement lisible (vous pouvez l'ouvrir et lire)
- ✅ Git-friendly (versionable)
- ✅ Pas de setup complexe
- ✅ Portable (fonctionne partout)
- ✅ Léger (<15KB)
**Alternative rejetée**: SQLite ou JSON (moins lisible, overkill)
**Fichiers impactés**: `CLAUDE_MEMORY.md`, `CLAUDE.md`

### Format Historique Optimisé
**Décision**: Format "Alain + Claude + Action"
**Quand**: 2025-01-27
**Pourquoi**:
- ✅ Contexte complet (les 2 côtés)
- ✅ Ultra compressé (essence du dialogue)
- ✅ Traçabilité (fichiers + actions)
- ✅ Lecture rapide
**Format**:
```
**Alain**: "Demande courte"
**Claude**: "Réponse compressée"
**Action**: ✅ Résultat concret
```

---

## 📝 Comment Ajouter une Décision

Quand une décision technique importante est prise, documenter:
1. **Quoi**: La décision exacte
2. **Quand**: Date
3. **Pourquoi**: Justification (pros/cons)
4. **Alternative rejetée**: Ce qu'on a PAS choisi et pourquoi
5. **Fichiers impactés**: Où c'est implémenté

---

**Dernière mise à jour**: 2025-01-27
**Décisions documentées**: 8
