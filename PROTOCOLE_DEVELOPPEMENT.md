# 📋 Protocole de Développement - Le Spot SUP

**Créé par**: Alain Gagné & Claude
**Date**: 2025-01-29
**Philosophie**: Zéro erreur en production - Test avant déploiement

---

## 🎯 Règles d'Or

1. **JAMAIS de changement sans backup**
2. **TOUJOURS tester avant de commit**
3. **UN changement à la fois**
4. **Tester sur PC ET mobile**
5. **Build doit réussir à 100%**

---

## 🔄 Workflow Standard

### Avant TOUT changement:

```bash
# 1. Créer backup
./test-and-deploy.sh

# 2. Créer branche de test
git checkout -b test/ma-modification

# 3. Faire le changement (UN SEUL)

# 4. Tester
npm run dev
# → Tester visuellement sur PC
# → Tester sur mobile (responsive)

# 5. Re-tester build
./test-and-deploy.sh

# 6. Si OK → commit
git add .
git commit -m "Description claire du changement"

# 7. Merge vers main-clean
git checkout main-clean
git merge test/ma-modification

# 8. Push
git push origin main-clean:main --force
```

---

## ✅ Checklist Pré-Déploiement

- [ ] Backup créé automatiquement
- [ ] TypeScript compile sans erreur
- [ ] Build production réussit
- [ ] Tous fichiers critiques présents
- [ ] Test visuel PC: Header, Footer, Pages
- [ ] Test visuel Mobile: Responsive OK
- [ ] Pas de console.error dans navigateur
- [ ] Géolocalisation fonctionne
- [ ] Carte affiche correctement
- [ ] Liste spots affiche ~200 items

---

## 🚨 En Cas d'Erreur

### Si test échoue:

```bash
# 1. NE PAS COMMIT
# 2. Voir les erreurs
npm run build 2>&1 | tee build-error.log

# 3. Corriger le problème

# 4. Re-tester
./test-and-deploy.sh

# 5. Répéter jusqu'à succès
```

### Si production cassée:

```bash
# 1. Restaurer dernier backup fonctionnel
cd "E:/Backups/Le_Spot_SUP"
ls -lt  # Voir backups disponibles

# 2. Extraire backup
tar -xzf backup_YYYYMMDD_HHMMSS_COMMIT.tar.gz -C /tmp/restore

# 3. Copier fichiers
cp -r /tmp/restore/* "E:/Le Spot SUP/"

# 4. Re-tester
./test-and-deploy.sh

# 5. Push version stable
git push origin main-clean:main --force
```

---

## 📊 Métriques de Qualité

### Build doit respecter:
- **Taille totale**: < 150 MB
- **First Load JS**: < 120 KB par page
- **Build time**: < 60 secondes
- **TypeScript**: 0 erreur

### Performance:
- **Lighthouse Score**: > 90
- **Mobile responsive**: 100%
- **Compatibilité navigateurs**: Chrome, Firefox, Safari, Edge

---

## 🛠️ Outils Disponibles

### Scripts automatisés:

```bash
# Test complet + backup
./test-and-deploy.sh

# Build seulement
npm run build

# Dev server
npm run dev

# TypeScript check
npx tsc --noEmit
```

### Backups:

- **Location**: `E:/Backups/Le_Spot_SUP/`
- **Format**: `backup_YYYYMMDD_HHMMSS_COMMIT.tar.gz`
- **Rétention**: Tous les backups conservés
- **Fréquence**: Avant CHAQUE modification

---

## 📝 Commits

### Format message:

```
Type: Description courte

Détails du changement
- Point 1
- Point 2

Build vérifié: ✅ Compiled successfully

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Types:
- **Fix**: Correction bug
- **Feat**: Nouvelle fonctionnalité
- **Style**: Changement visuel/CSS
- **Refactor**: Réorganisation code
- **Docs**: Documentation
- **Test**: Ajout tests

---

## 🎓 Leçons Apprises

### ❌ Ne JAMAIS:
- Modifier plusieurs fichiers en même temps
- Commit sans tester le build
- Push vers production sans backup
- Utiliser `sm:` classes sans tester desktop
- Ignorer les erreurs TypeScript

### ✅ TOUJOURS:
- Un changement à la fois
- Backup avant modification
- Tester PC ET mobile
- Vérifier build production
- Lire les logs d'erreur

---

**Version**: 1.0
**Dernière mise à jour**: 2025-01-29 23:12
