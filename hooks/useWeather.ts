import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
}

export function useWeather(latitude: number, longitude: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = process.env.NEXT_PUBLIC_WEATHERBIT_API_KEY;

        if (!apiKey) {
          throw new Error('Clé API Weatherbit manquante');
        }

        const response = await fetch(
          `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}&lang=fr&units=M`
        );

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données météo');
        }

        const result = await response.json();
        const data = result.data[0];

        setWeather({
          temperature: Math.round(data.temp),
          feelsLike: Math.round(data.app_temp),
          description: data.weather.description,
          icon: data.weather.icon,
          humidity: data.rh,
          windSpeed: Math.round(data.wind_spd * 3.6), // Convert m/s to km/h
          windDirection: data.wind_dir,
          pressure: data.pres,
          visibility: Math.round(data.vis), // Already in km
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  return { weather, loading, error };
}
