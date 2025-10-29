#!/bin/bash
# Système de Test et Déploiement Automatisé - Le Spot SUP
# Créé par: Alain Gagné & Claude
# Date: 2025-01-29

set -e  # Arrêter si erreur

# Couleurs pour output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "🔍 SYSTÈME DE TEST AUTOMATISÉ"
echo "========================================"
echo ""

# 1. BACKUP AUTOMATIQUE
echo -e "${YELLOW}[1/6] Création backup...${NC}"
BACKUP_DIR="E:/Backups/Le_Spot_SUP"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CURRENT_COMMIT=$(git rev-parse --short HEAD)
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}_${CURRENT_COMMIT}.tar.gz"

git archive --format=tar.gz --output="$BACKUP_FILE" HEAD
echo -e "${GREEN}✓ Backup créé: $BACKUP_FILE${NC}"
echo ""

# 2. VÉRIFICATION SYNTAXE TYPESCRIPT
echo -e "${YELLOW}[2/6] Vérification TypeScript...${NC}"
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ TypeScript OK${NC}"
else
    echo -e "${RED}✗ Erreurs TypeScript détectées${NC}"
    exit 1
fi
echo ""

# 3. BUILD TEST
echo -e "${YELLOW}[3/6] Test du build production...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build réussi${NC}"
else
    echo -e "${RED}✗ Build échoué${NC}"
    exit 1
fi
echo ""

# 4. VÉRIFICATION FICHIERS CRITIQUES
echo -e "${YELLOW}[4/6] Vérification fichiers critiques...${NC}"
CRITICAL_FILES=(
    "app/page.tsx"
    "app/map/page.tsx"
    "components/Header.tsx"
    "components/SplashScreen.tsx"
    "components/LocationProvider.tsx"
    "lib/spots-data.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗ MANQUANT:${NC} $file"
        exit 1
    fi
done
echo ""

# 5. VÉRIFICATION TAILLE BUILD
echo -e "${YELLOW}[5/6] Analyse taille build...${NC}"
BUILD_SIZE=$(du -sh .next 2>/dev/null | cut -f1)
echo "Taille build: $BUILD_SIZE"
echo ""

# 6. COMMIT ET PUSH (si tout OK)
echo -e "${YELLOW}[6/6] Préparation déploiement...${NC}"
echo "Commit actuel: $CURRENT_COMMIT"
echo ""

echo -e "${GREEN}========================================"
echo "✓ TOUS LES TESTS RÉUSSIS"
echo "========================================${NC}"
echo ""
echo "Le code est prêt pour déploiement."
echo "Backup disponible: $BACKUP_FILE"
echo ""
echo "Pour déployer vers production:"
echo "  git push origin main-clean:main --force"
echo ""
