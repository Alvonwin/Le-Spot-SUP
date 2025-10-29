"use client";

import { Cloud, Wind, Droplet, Eye, Gauge } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";

interface WeatherDisplayProps {
  latitude: number;
  longitude: number;
}

export default function WeatherDisplay({ latitude, longitude }: WeatherDisplayProps) {
  const { weather, loading, error } = useWeather(latitude, longitude);

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-400">Chargement des données météo...</p>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-red-500">
          {error || "Erreur lors de la récupération des conditions météo."}
        </p>
      </div>
    );
  }

  // Function to get wind direction text
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Function to determine if conditions are good for SUP
  const getRecommendation = () => {
    const isGoodTemp = weather.temperature >= 15 && weather.temperature <= 30;
    const isGoodWind = weather.windSpeed < 20;
    const isGoodVisibility = weather.visibility >= 5;

    if (isGoodTemp && isGoodWind && isGoodVisibility) {
      return {
        text: "Excellentes conditions pour le paddle!",
        color: "text-green-400",
        emoji: "✅"
      };
    } else if (weather.windSpeed > 30) {
      return {
        text: "Conditions venteuses - Prudence recommandée",
        color: "text-orange-400",
        emoji: "⚠️"
      };
    } else if (weather.temperature < 10) {
      return {
        text: "Température fraîche - Prévoyez une combinaison",
        color: "text-blue-400",
        emoji: "🥶"
      };
    } else {
      return {
        text: "Conditions correctes pour le paddle",
        color: "text-yellow-400",
        emoji: "👍"
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-4">
      {/* Current Conditions */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-3xl font-bold text-white">{weather.temperature}°C</p>
            <p className="text-sm text-gray-400">Ressenti {weather.feelsLike}°C</p>
          </div>
          <div className="text-right">
            <img
              src={`https://www.weatherbit.io/static/img/icons/${weather.icon}.png`}
              alt={weather.description}
              className="w-16 h-16"
            />
            <p className="text-sm text-gray-300 capitalize">{weather.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-ocean-light" />
            <div>
              <p className="text-xs text-gray-400">Vent</p>
              <p className="text-sm text-white font-semibold">
                {weather.windSpeed} km/h {getWindDirection(weather.windDirection)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-ocean-light" />
            <div>
              <p className="text-xs text-gray-400">Humidité</p>
              <p className="text-sm text-white font-semibold">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-ocean-light" />
            <div>
              <p className="text-xs text-gray-400">Visibilité</p>
              <p className="text-sm text-white font-semibold">{weather.visibility} km</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-ocean-light" />
            <div>
              <p className="text-xs text-gray-400">Pression</p>
              <p className="text-sm text-white font-semibold">{weather.pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="font-bold mb-2 text-white">Recommandé en ce moment...</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{recommendation.emoji}</span>
          <p className={`${recommendation.color} font-semibold`}>
            {recommendation.text}
          </p>
        </div>
      </div>
    </div>
  );
}
