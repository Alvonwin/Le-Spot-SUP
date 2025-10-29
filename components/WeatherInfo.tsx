"use client";

import { useState, useEffect } from "react";
import { Cloud, CloudRain, CloudSnow, Sun, Wind, Droplets, Eye } from "lucide-react";

interface WeatherInfoProps {
  latitude: number;
  longitude: number;
}

interface WeatherData {
  temperature: number;
  weathercode: number;
  windspeed: number;
  humidity: number;
  visibility: number;
}

// Weather code mapping from Open-Meteo
const getWeatherIcon = (code: number) => {
  if (code === 0) return { icon: Sun, label: "Ensoleillé", color: "text-yellow-500" };
  if (code <= 3) return { icon: Cloud, label: "Nuageux", color: "text-gray-400" };
  if (code <= 67) return { icon: CloudRain, label: "Pluie", color: "text-blue-400" };
  if (code <= 77) return { icon: CloudSnow, label: "Neige", color: "text-blue-200" };
  return { icon: Cloud, label: "Variable", color: "text-gray-400" };
};

export default function WeatherInfo({ latitude, longitude }: WeatherInfoProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Open-Meteo API - Free, no API key needed
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m&timezone=auto`
        );

        if (!response.ok) {
          throw new Error("Impossible de récupérer la météo");
        }

        const data = await response.json();

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weathercode: data.current.weathercode,
          windspeed: Math.round(data.current.windspeed_10m),
          humidity: data.current.relativehumidity_2m,
          visibility: 10, // Open-Meteo doesn't provide visibility, default to 10km
        });
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError("Météo indisponible");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span>Chargement météo...</span>
      </div>
    );
  }

  if (error || !weather) {
    return <p className="text-xs text-gray-500 dark:text-gray-400 italic">{error || "Météo indisponible"}</p>;
  }

  const weatherInfo = getWeatherIcon(weather.weathercode);
  const Icon = weatherInfo.icon;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={24} className={weatherInfo.color} />
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">{weather.temperature}°</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{weatherInfo.label}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Wind size={12} />
          <span>{weather.windspeed} km/h</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Droplets size={12} />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <Eye size={12} />
          <span>{weather.visibility} km</span>
        </div>
      </div>
    </div>
  );
}
