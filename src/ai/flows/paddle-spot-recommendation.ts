/**
 * Service de Recommandation de Spots SUP
 *
 * Utilise l'algorithme scientifique de sélection optimale basé sur:
 * - Sécurité nautique (50%)
 * - Accessibilité et distance (30%)
 * - Adéquation niveau/expérience (20%)
 */

import { localSpots } from '@/lib/local-storage';
import {
  recommendSpots,
  type SkillLevel,
  type ScoredSpot,
} from '@/services/spot-scoring-service';

export interface SpotRecommendation {
  spotId: string;
  score: number;
  reasons: string[];
  safetyWarnings?: string[];
  scoreBreakdown?: {
    safety: number;
    accessibility: number;
    experience: number;
  };
}

export interface PaddleSpotRecommendationOutput {
  recommendations: SpotRecommendation[];
  timestamp: string;
  recommendedSpot?: string;
  reasoning?: string;
  safetyConsiderations?: string;
}

/**
 * Convertit un ScoredSpot en SpotRecommendation
 */
function convertToRecommendation(scoredSpot: ScoredSpot): SpotRecommendation {
  const reasons: string[] = [];

  if (scoredSpot.eliminated) {
    reasons.push('❌ SPOT ÉLIMINÉ POUR RAISONS DE SÉCURITÉ');
    reasons.push(...scoredSpot.eliminationReasons);
  } else {
    // Expliquer pourquoi ce spot est recommandé
    const { safetyScore, accessibilityScore, experienceScore, finalScore } =
      scoredSpot.breakdown;

    if (finalScore >= 80) {
      reasons.push('✅ Excellent choix pour vos conditions actuelles');
    } else if (finalScore >= 60) {
      reasons.push('✅ Bon choix avec quelques considérations');
    } else {
      reasons.push('⚠️ Acceptable mais pas optimal');
    }

    if (safetyScore >= 80) {
      reasons.push(`🛡️ Sécurité excellente (${safetyScore.toFixed(0)}/100)`);
    } else if (safetyScore >= 60) {
      reasons.push(`🛡️ Sécurité acceptable (${safetyScore.toFixed(0)}/100)`);
    } else {
      reasons.push(`⚠️ Sécurité limitée (${safetyScore.toFixed(0)}/100) - soyez prudent`);
    }

    if (accessibilityScore >= 80) {
      reasons.push(`📍 Très proche de votre position`);
    } else if (accessibilityScore >= 50) {
      reasons.push(`📍 Distance raisonnable`);
    } else {
      reasons.push(`📍 Assez éloigné de votre position`);
    }

    if (experienceScore >= 80) {
      reasons.push(`🎯 Parfaitement adapté à votre niveau d'expérience`);
    } else if (experienceScore >= 60) {
      reasons.push(`🎯 Bien adapté à votre niveau`);
    } else {
      reasons.push(`⚠️ Niveau de difficulté non optimal pour vous`);
    }
  }

  return {
    spotId: scoredSpot.spot.id,
    score: scoredSpot.score,
    reasons,
    safetyWarnings: scoredSpot.safetyWarnings,
    scoreBreakdown: {
      safety: scoredSpot.breakdown.safetyScore,
      accessibility: scoredSpot.breakdown.accessibilityScore,
      experience: scoredSpot.breakdown.experienceScore,
    },
  };
}

/**
 * Génère des recommandations de spots SUP basées sur l'algorithme scientifique
 *
 * @param userLevel - Niveau de l'utilisateur: 'beginner', 'intermediate', 'advanced', 'expert'
 * @param preferences - Préférences [type de lieu, autres préférences]
 * @param currentLocation - Position GPS de l'utilisateur
 * @returns Liste de recommandations triées par score
 */
export async function generatePaddleSpotRecommendation(
  userLevel: string,
  preferences: string[],
  currentLocation?: { latitude: number; longitude: number }
): Promise<SpotRecommendation[]> {
  // Obtenir tous les spots disponibles
  const allSpots = localSpots.getAll();

  if (allSpots.length === 0) {
    console.warn('Aucun spot disponible pour la recommandation');
    return [];
  }

  // Utiliser la position par défaut si non fournie (Montréal, QC)
  const userLoc = currentLocation || {
    latitude: 45.5017,
    longitude: -73.5673,
  };

  // Convertir le niveau utilisateur
  const skillLevel: SkillLevel = (() => {
    switch (userLevel.toLowerCase()) {
      case 'beginner':
        return 'beginner';
      case 'intermediate':
        return 'intermediate';
      case 'advanced':
        return 'advanced';
      case 'expert':
        return 'expert';
      default:
        return 'intermediate';
    }
  })();

  // Type de lieu préféré (premier élément des préférences)
  const preferredType = preferences[0] || undefined;

  // Distance maximale (par défaut 100 km)
  const maxDistance = 100;

  try {
    // Appeler l'algorithme de recommandation
    const result = await recommendSpots(allSpots, userLoc, skillLevel, preferredType, maxDistance);

    // Convertir les résultats
    const recommendations = result.topRecommendations.map(convertToRecommendation);

    console.log(
      `✅ Généré ${recommendations.length} recommandations pour niveau ${skillLevel} à ${preferredType || 'tous types'}`
    );

    return recommendations;
  } catch (error) {
    console.error('Erreur lors de la génération des recommandations:', error);
    return [];
  }
}

// Default export for backward compatibility
export const paddleSpotRecommendation = generatePaddleSpotRecommendation;
