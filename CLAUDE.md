# 🤖 Instructions pour Claude Code

## 🧠 Mémoire Persistante

**IMPORTANT**: Ce projet utilise un système de mémoire pour continuité TOTALE entre sessions.

### Au démarrage de CHAQUE session:
1. ✅ **TOUJOURS lire `CLAUDE_MEMORY.md` EN PREMIER** (obligatoire!)
2. ✅ **RÉCITER** le message de la section "INSTRUCTIONS LECTURE RAPIDE" à Alain
3. ✅ Lire la section "HISTORIQUE CONVERSATION" (10 derniers échanges)
4. ✅ Comprendre le contexte complet sans poser de questions
5. ✅ Vérifier "DERNIÈRE SESSION" et "EN COURS / À FAIRE"
6. ✅ **Être prêt à continuer immédiatement** - pas d'explications ni mise en contexte

### Avant de terminer une session:
1. ✅ Mettre à jour section "HISTORIQUE CONVERSATION" (ajouter nouveaux échanges, garder 10 max)
2. ✅ Mettre à jour "DERNIÈRE SESSION" avec travaux effectués
3. ✅ Mettre à jour "EN COURS / À FAIRE" si nécessaire
4. ✅ Supprimer anciens échanges (garder seulement 10 derniers)
5. ✅ Optimiser l'espace (garder ~10-12KB max)
6. ✅ Update timestamp "Auto-sauvegardé le"

## 📋 Commandes Rapides

Vous pouvez utiliser ces slash commands:
- `/continue` - Reprendre le développement où on l'a laissé
- `/save-memory` - Sauvegarder l'état actuel dans la mémoire
- `/status` - Voir l'état du projet

## 🎯 Philosophie du Projet

**Le Spot SUP** est une plateforme communautaire pour passionnés de SUP (Stand-Up Paddle).

### Stack Technique
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Context pour state management

### Principes de Code
- Code en français pour commentaires (utilisateur francophone)
- Messages de commit en français
- Code propre et bien commenté
- TodoList systématique pour tracking
- Tests avant validation

### Style de Travail
- Proactif mais demander confirmation pour gros changements
- Utiliser TodoWrite pour toutes tâches multi-étapes
- Mettre à jour la mémoire régulièrement
- Pas d'emojis sauf demande explicite

## 📁 Fichiers Clés

- `CLAUDE_MEMORY.md` - 🧠 **MÉMOIRE PRINCIPALE** (lire en premier!)
- `SPECIFICATIONS.md` - Specs techniques complètes
- `package.json` - Dependencies et scripts
- `.claude/settings.local.json` - Permissions

## 🔐 Permissions Auto-approuvées

Voir `.claude/settings.local.json` pour la liste complète.

Inclus:
- Commandes npm (dev, build, test)
- Bash (taskkill, dir, etc.)
- Lecture fichiers screenshots/downloads/database

---

**Créé le**: 2025-01-27
**Propriétaire**: Alain (niwno)
**Statut**: Actif ✅
