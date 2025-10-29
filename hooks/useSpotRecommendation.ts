import { useMemo } from 'react';
import { useWeather } from './useWeather';

interface Spot {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  description?: string;
  notes?: string;
  rating?: string;
}

interface SpotScore {
  spot: Spot;
  score: number;
  factors: {
    wind: number;
    temperature: number;
    waterType: number;
    distance: number;
    experience: number;
  };
  warnings: string[];
  isEliminated: boolean;
  eliminationReason?: string;
}

export function useSpotRecommendation(
  spots: Spot[],
  userLocation: { latitude: number; longitude: number } | null,
  userExperience: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert'
) {
  // Calculate distance between two GPS coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const recommendations = useMemo(() => {
    if (!userLocation || spots.length === 0) return [];

    const scored: SpotScore[] = spots.map(spot => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      );

      // Simulated weather data (in production, fetch real data)
      const windSpeed = Math.random() * 25; // km/h
      const windDirection = Math.random() * 360; // degrees
      const waterTemp = 15 + Math.random() * 10; // 15-25°C

      const warnings: string[] = [];
      let isEliminated = false;
      let eliminationReason = '';

      // PHASE 1: ELIMINATION (Safety filters)

      // Wind check (Beginners: > 22 km/h, Experts: > 37 km/h)
      if (userExperience === 'Débutant' && windSpeed > 22) {
        isEliminated = true;
        eliminationReason = `Vent trop fort pour débutants (${Math.round(windSpeed)} km/h)`;
      } else if (windSpeed > 37) {
        isEliminated = true;
        eliminationReason = `Vent dangereux pour tous niveaux (${Math.round(windSpeed)} km/h)`;
      }

      // Water temperature check
      if (waterTemp < 15) {
        warnings.push('⚠️ Eau froide (<15°C) - Combinaison recommandée');
      }

      // PHASE 2: SCORING (if not eliminated)
      let scoreA = 0; // Safety & Conditions (50%)
      let scoreB = 0; // Accessibility (30%)
      let scoreC = 0; // Experience adjustment (20%)

      // A. Safety & Conditions (50%)

      // A1. Wind speed (20%)
      let windScore = 100;
      if (windSpeed < 8) {
        windScore = 100; // Optimal
      } else if (windSpeed < 13) {
        windScore = 75 + (13 - windSpeed) * 5; // 75-100
      } else if (windSpeed < 22) {
        windScore = 25 + (22 - windSpeed) * 5.5; // 25-75
      } else {
        windScore = Math.max(0, 25 - (windSpeed - 22) * 2);
      }

      // A2. Wind direction (5%) - Simplified
      const windDirectionScore = 100; // Neutral for now

      // A3. Water temperature (15%)
      let tempScore = 100;
      if (waterTemp >= 15) {
        tempScore = 100;
      } else {
        tempScore = Math.max(0, 100 - (15 - waterTemp) * 10);
      }

      // A4. Water type (10%) - Based on spot type
      let waterTypeScore = 100;
      const spotType = spot.description?.toLowerCase() || '';
      if (spotType.includes('lac')) {
        waterTypeScore = 100;
      } else if (spotType.includes('rivière')) {
        waterTypeScore = 80;
      } else if (spotType.includes('fleuve')) {
        waterTypeScore = 70;
      }

      scoreA = (windScore * 0.4 + windDirectionScore * 0.1 + tempScore * 0.3 + waterTypeScore * 0.2);

      // B. Accessibility (30%)

      // B1. Distance (25%)
      const maxDistance = 100; // km
      const distanceScore = Math.max(0, 100 - (distance / maxDistance) * 100);

      scoreB = distanceScore;

      // C. Experience Adjustment (20%)

      let experienceScore = 100;
      if (userExperience === 'Débutant') {
        if (windSpeed > 13 || spotType.includes('rivière')) {
          experienceScore = 50; // Penalty
          warnings.push('⚠️ Conditions exigeantes pour votre niveau');
        }
      } else if (userExperience === 'Intermédiaire') {
        if (windSpeed > 13 && windSpeed < 22) {
          experienceScore = 110; // Bonus - corresponds to skill level
        }
      } else if (userExperience === 'Avancé' || userExperience === 'Expert') {
        if (windSpeed > 15 || spotType.includes('rivière')) {
          experienceScore = 120; // Bonus - challenging conditions match skill
        }
      }

      scoreC = experienceScore;

      // Final Score
      const finalScore = isEliminated ? 0 : (
        scoreA * 0.5 + scoreB * 0.3 + scoreC * 0.2
      );

      // Add mandatory safety warnings
      if (!warnings.includes('⚠️ Eau froide (<15°C) - Combinaison recommandée')) {
        if (windSpeed > 15) {
          warnings.push('🌬️ Vent modéré - Pagayez près des rives');
        }
      }

      // Always add VFI reminder for top recommendations
      if (finalScore > 70) {
        warnings.push('🦺 Portez votre VFI en permanence');
      }

      return {
        spot,
        score: Math.min(100, Math.round(finalScore)),
        factors: {
          wind: Math.round(windScore),
          temperature: Math.round(tempScore),
          waterType: Math.round(waterTypeScore),
          distance: Math.round(distanceScore),
          experience: Math.round(experienceScore),
        },
        warnings,
        isEliminated,
        eliminationReason,
      };
    });

    // Sort by score (highest first) and return top 5
    return scored
      .filter(s => !s.isEliminated)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [spots, userLocation, userExperience]);

  return recommendations;
}
