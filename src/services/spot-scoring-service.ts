/**
 * Service d'Algorithme de Sélection Optimale de Spots de Planche à Pagaie
 *
 * Basé sur les facteurs de sécurité nautique et les conditions météorologiques
 * conformément à la réglementation de Transports Canada pour les embarcations
 * à propulsion humaine.
 *
 * @reference Transports Canada - Embarcations de plaisance
 */

import type { PaddleSpot } from '@/lib/types';
import { getCurrentWeather, type WeatherCondition } from './weather-service';

// ========== PHASE 0: Données et Types ==========

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type LocationType = 'lake' | 'river' | 'ocean' | 'calm';
export type WindDirection = 'onshore' | 'offshore' | 'crosswind';

export interface SpotStaticData {
  spot: PaddleSpot;
  type: LocationType;
  hasRapids: boolean;
  rapidsClass?: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6'; // R3+ = danger
  hasDam: boolean;
  fetchPotential: 'low' | 'medium' | 'high'; // Surface ouverte au vent
}

export interface SpotDynamicData {
  weather: WeatherCondition | null;
  distanceKm: number;
}

export interface ScoredSpot {
  spot: PaddleSpot;
  score: number;
  breakdown: ScoreBreakdown;
  eliminated: boolean;
  eliminationReasons: string[];
  safetyWarnings: string[];
}

export interface ScoreBreakdown {
  safetyScore: number;      // 0-100, poids 50%
  accessibilityScore: number; // 0-100, poids 30%
  experienceScore: number;   // 0-100, poids 20%
  finalScore: number;        // 0-100
}

// ========== PHASE 1: Filtration des Risques (Élimination) ==========

/**
 * Élimine les spots présentant des risques inacceptables
 * @returns true si le spot doit être éliminé
 */
function shouldEliminateSpot(
  staticData: SpotStaticData,
  dynamicData: SpotDynamicData,
  skillLevel: SkillLevel
): { eliminate: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const weather = dynamicData.weather;

  if (!weather) {
    return { eliminate: false, reasons: [] };
  }

  // Critère 1: Vent excessif pour débutant/intermédiaire (> 12 nœuds / 22 km/h)
  const windSpeedKmh = weather.windSpeed;
  const windSpeedKnots = windSpeedKmh * 0.539957; // Conversion km/h -> nœuds

  if ((skillLevel === 'beginner' || skillLevel === 'intermediate') && windSpeedKnots > 12) {
    reasons.push(
      `Vent de ${windSpeedKnots.toFixed(1)} nœuds (${windSpeedKmh.toFixed(0)} km/h) trop fort pour votre niveau. ` +
      `Limite recommandée: 12 nœuds (22 km/h).`
    );
  }

  // Critère 2: Vent extrême même pour experts (> 20 nœuds / 37 km/h)
  if (windSpeedKnots > 20) {
    reasons.push(
      `Vent extrême de ${windSpeedKnots.toFixed(1)} nœuds (${windSpeedKmh.toFixed(0)} km/h). ` +
      `Dangereux même pour les experts. Limite absolue: 20 nœuds.`
    );
  }

  // Critère 3: Orage/Foudre imminent
  if (weather.conditions === 'orageux') {
    reasons.push(
      'Alerte orage/foudre imminente. Danger mortel: l\'eau peut transmettre la foudre de loin. ' +
      'Sortez IMMÉDIATEMENT de l\'eau dès le premier éclair ou coup de tonnerre.'
    );
  }

  // Critère 4: Rapides de classe III ou plus
  if (staticData.hasRapids && staticData.rapidsClass) {
    const rapidsLevel = parseInt(staticData.rapidsClass.substring(1));
    if (rapidsLevel >= 3) {
      reasons.push(
        `Rapides de classe ${staticData.rapidsClass} (négociation difficile ou plus). ` +
        `Dangereux sauf pour les pratiquants d'eau vive très expérimentés.`
      );
    }
  }

  // Critère 5: Barrage à faible hauteur
  if (staticData.hasDam) {
    reasons.push(
      'Présence d\'un barrage à faible hauteur - "machine à noyer". ' +
      'Le rouleau à rappel piège les objets flottants. Extrêmement dangereux.'
    );
  }

  return {
    eliminate: reasons.length > 0,
    reasons,
  };
}

// ========== PHASE 2: Évaluation et Notation ==========

/**
 * Calcule le score de sécurité (50% du score total)
 */
function calculateSafetyScore(
  staticData: SpotStaticData,
  dynamicData: SpotDynamicData,
  skillLevel: SkillLevel
): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  const weather = dynamicData.weather;

  if (!weather) {
    return { score: 50, warnings: ['Données météo non disponibles'] };
  }

  let windScore = 100;
  let windDirectionBonus = 0;
  let temperatureScore = 100;
  let waterTypeScore = 100;

  // A. Critère de Vent (Poids 20% du total, soit 40% des 50% sécurité)
  const windSpeedKmh = weather.windSpeed;
  const windSpeedKnots = windSpeedKmh * 0.539957;

  if (windSpeedKnots < 5) {
    windScore = 100; // Optimal, eau plate
  } else if (windSpeedKnots < 7) {
    windScore = 85; // Très bon
    warnings.push(`Vent léger de ${windSpeedKnots.toFixed(1)} nœuds. Conditions agréables.`);
  } else if (windSpeedKnots < 12) {
    windScore = 50; // Demande de l'expérience
    warnings.push(
      `Vent modéré de ${windSpeedKnots.toFixed(1)} nœuds. Demande de l'expérience et de l'effort.`
    );
  } else {
    windScore = 25; // Difficile (si non éliminé par Phase 1)
    warnings.push(`Vent fort de ${windSpeedKnots.toFixed(1)} nœuds. Conditions difficiles.`);
  }

  // B. Direction du Vent (Poids 5% du total, soit 10% des 50% sécurité)
  // Note: Nous ne connaissons pas la direction actuelle, donc on utilise un bonus neutre
  // Dans une implémentation complète, il faudrait calculer la direction du vent par rapport au spot
  windDirectionBonus = 0; // Neutre par défaut

  // C. Température de l'Eau (Poids 15% du total, soit 30% des 50% sécurité)
  // Estimation basée sur la température de l'air (simplifié)
  const estimatedWaterTemp = weather.temperature - 5; // L'eau est généralement plus froide

  if (estimatedWaterTemp >= 15) {
    temperatureScore = 100; // Risque d'hypothermie réduit
  } else {
    temperatureScore = 40; // Nécessite wetsuit ou équipement thermique
    warnings.push(
      `Température de l'eau estimée à ${estimatedWaterTemp.toFixed(0)}°C (<15°C). ` +
      `Wetsuit ou équipement thermique FORTEMENT recommandé pour prévenir l'hypothermie.`
    );
  }

  // D. Type de Plan d'Eau (Poids 10% du total, soit 20% des 50% sécurité)
  switch (staticData.type) {
    case 'lake':
    case 'calm':
      waterTypeScore = 100; // Moins de dangers
      break;
    case 'river':
      waterTypeScore = 80; // Nécessite plus d'expérience
      if (staticData.hasRapids) {
        waterTypeScore = 70;
        warnings.push('Rivière avec courant modéré. Nécessite de l\'expérience.');
      }
      break;
    case 'ocean':
      waterTypeScore = 60; // Plus difficile
      warnings.push('Plan d\'eau océanique. Attention aux marées et aux vagues.');
      break;
  }

  // Calcul final du score de sécurité (sur 100)
  const safetyScore =
    windScore * 0.4 +           // 40% (20% du total / 50% sécurité)
    windDirectionBonus * 0.1 +  // 10% (5% du total / 50% sécurité)
    temperatureScore * 0.3 +    // 30% (15% du total / 50% sécurité)
    waterTypeScore * 0.2;       // 20% (10% du total / 50% sécurité)

  return { score: safetyScore, warnings };
}

/**
 * Calcule le score d'accessibilité (30% du score total)
 */
function calculateAccessibilityScore(
  dynamicData: SpotDynamicData
): number {
  const distanceKm = dynamicData.distanceKm;

  // Score basé sur la distance (plus proche = meilleur)
  // Distance optimale: < 10 km = 100
  // Distance acceptable: 10-50 km = décroissance linéaire
  // Distance lointaine: > 50 km = pénalité

  if (distanceKm <= 10) {
    return 100;
  } else if (distanceKm <= 50) {
    // Décroissance linéaire de 100 à 50
    return 100 - ((distanceKm - 10) / 40) * 50;
  } else if (distanceKm <= 100) {
    // Décroissance de 50 à 20
    return 50 - ((distanceKm - 50) / 50) * 30;
  } else {
    // Très loin
    return Math.max(10, 20 - (distanceKm - 100) / 10);
  }
}

/**
 * Calcule le score d'ajustement par expérience (20% du score total)
 */
function calculateExperienceScore(
  staticData: SpotStaticData,
  dynamicData: SpotDynamicData,
  skillLevel: SkillLevel
): number {
  const weather = dynamicData.weather;
  if (!weather) return 50;

  const windSpeedKnots = weather.windSpeed * 0.539957;
  const isCalm = windSpeedKnots < 7 && (staticData.type === 'lake' || staticData.type === 'calm');
  const isModerate =
    (windSpeedKnots >= 7 && windSpeedKnots < 12) ||
    (staticData.type === 'river' && staticData.hasRapids);
  const isChallenging = windSpeedKnots >= 12 || staticData.type === 'ocean';

  // Correspondance entre niveau et difficulté du spot
  if (skillLevel === 'beginner') {
    if (isCalm) return 100; // Parfait pour débutant
    if (isModerate) return 30; // Trop difficile
    if (isChallenging) return 10; // Dangereux
  }

  if (skillLevel === 'intermediate') {
    if (isCalm) return 90; // Bon mais pas challengeant
    if (isModerate) return 100; // Parfait pour intermédiaire
    if (isChallenging) return 50; // Possible mais difficile
  }

  if (skillLevel === 'advanced' || skillLevel === 'expert') {
    if (isCalm) return 70; // Trop facile, moins intéressant
    if (isModerate) return 90; // Bon
    if (isChallenging) return 100; // Parfait pour avancé/expert
  }

  return 50; // Défaut
}

/**
 * Calcule le score final d'un spot (0-100)
 */
function calculateFinalScore(
  staticData: SpotStaticData,
  dynamicData: SpotDynamicData,
  skillLevel: SkillLevel
): ScoreBreakdown {
  const { score: safetyScore } = calculateSafetyScore(staticData, dynamicData, skillLevel);
  const accessibilityScore = calculateAccessibilityScore(dynamicData);
  const experienceScore = calculateExperienceScore(staticData, dynamicData, skillLevel);

  const finalScore =
    safetyScore * 0.5 +         // 50%
    accessibilityScore * 0.3 +  // 30%
    experienceScore * 0.2;      // 20%

  return {
    safetyScore,
    accessibilityScore,
    experienceScore,
    finalScore,
  };
}

// ========== Fonctions Utilitaires ==========

/**
 * Calcule la distance entre deux points GPS (formule Haversine)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Détermine le type de plan d'eau d'un spot basé sur son type ou description
 */
function determineLocationType(spot: PaddleSpot, preferredType?: string): LocationType {
  if (preferredType) {
    if (preferredType === 'lake' || preferredType === 'calm') return 'lake';
    if (preferredType === 'river') return 'river';
    if (preferredType === 'ocean') return 'ocean';
  }

  const name = (spot.name || '').toLowerCase();
  const desc = (spot.description || '').toLowerCase();
  const type = (spot.type || '').toLowerCase();
  const combined = `${name} ${desc} ${type}`;

  if (combined.includes('lac') || combined.includes('lake')) return 'lake';
  if (combined.includes('rivière') || combined.includes('river')) return 'river';
  if (combined.includes('mer') || combined.includes('ocean') || combined.includes('fleuve'))
    return 'ocean';

  return 'lake'; // Par défaut
}

/**
 * Génère les avertissements de sécurité obligatoires (Transports Canada)
 */
function generateMandatorySafetyWarnings(): string[] {
  return [
    '⚠️ VFI OBLIGATOIRE: Vous devez avoir un Vêtement de Flottaison Individuel (VFI) de taille appropriée. Il est FORTEMENT recommandé de le porter en permanence.',
    '⚠️ SIFFLET REQUIS: Un dispositif de signalisation sonore (sifflet) doit être attaché à votre VFI.',
    '⚠️ LAISSE RECOMMANDÉE: Une laisse de cheville (leash SUP) est recommandée pour rester attaché à votre planche.',
    '⚠️ NE PARTEZ JAMAIS SEUL: Avertissez un proche de votre itinéraire et heure de retour prévue.',
    '⚠️ AUCUN ALCOOL: La consommation d\'alcool est à proscrire avant et pendant la navigation.',
  ];
}

// ========== API Principale ==========

export interface RecommendationResult {
  scoredSpots: ScoredSpot[];
  topRecommendations: ScoredSpot[];
  mandatorySafetyWarnings: string[];
}

/**
 * Recommande les meilleurs spots SUP basés sur l'algorithme scientifique
 *
 * @param spots - Liste de tous les spots disponibles
 * @param userLocation - Position GPS de l'utilisateur
 * @param skillLevel - Niveau d'expérience de l'utilisateur
 * @param preferredType - Type de plan d'eau préféré (optionnel)
 * @param maxDistance - Distance maximale en km (optionnel, défaut: 100 km)
 * @returns Résultats triés avec les meilleurs spots
 */
export async function recommendSpots(
  spots: PaddleSpot[],
  userLocation: UserLocation,
  skillLevel: SkillLevel,
  preferredType?: string,
  maxDistance: number = 100
): Promise<RecommendationResult> {
  const scoredSpots: ScoredSpot[] = [];

  // Pour chaque spot, collecter les données et calculer le score
  for (const spot of spots) {
    // Phase 0: Collecte des données
    const distanceKm = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      spot.latitude,
      spot.longitude
    );

    // Filtre par distance maximale
    if (distanceKm > maxDistance) {
      continue;
    }

    const locationType = determineLocationType(spot, preferredType);

    const staticData: SpotStaticData = {
      spot,
      type: locationType,
      hasRapids: false, // TODO: Ajouter ces données aux spots
      rapidsClass: undefined,
      hasDam: false,
      fetchPotential: 'low',
    };

    // Obtenir les conditions météo actuelles
    const weather = await getCurrentWeather(spot.latitude, spot.longitude);

    const dynamicData: SpotDynamicData = {
      weather,
      distanceKm,
    };

    // Phase 1: Filtration des risques
    const elimination = shouldEliminateSpot(staticData, dynamicData, skillLevel);

    if (elimination.eliminate) {
      scoredSpots.push({
        spot,
        score: 0,
        breakdown: {
          safetyScore: 0,
          accessibilityScore: 0,
          experienceScore: 0,
          finalScore: 0,
        },
        eliminated: true,
        eliminationReasons: elimination.reasons,
        safetyWarnings: [],
      });
      continue;
    }

    // Phase 2: Évaluation et notation
    const breakdown = calculateFinalScore(staticData, dynamicData, skillLevel);
    const { warnings } = calculateSafetyScore(staticData, dynamicData, skillLevel);

    scoredSpots.push({
      spot,
      score: breakdown.finalScore,
      breakdown,
      eliminated: false,
      eliminationReasons: [],
      safetyWarnings: warnings,
    });
  }

  // Trier par score décroissant
  const sortedSpots = scoredSpots.sort((a, b) => b.score - a.score);

  // Top 5 recommandations (non éliminées)
  const topRecommendations = sortedSpots.filter((s) => !s.eliminated).slice(0, 5);

  return {
    scoredSpots: sortedSpots,
    topRecommendations,
    mandatorySafetyWarnings: generateMandatorySafetyWarnings(),
  };
}
