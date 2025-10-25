'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/language-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cloud, Wind, Droplets, Eye, Waves, AlertTriangle, Sun, CloudRain, CloudSnow, Loader2 } from 'lucide-react';
import { localSpots } from '@/lib/local-storage';
import { PaddleSpot } from '@/lib/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import weatherService, { WeatherCondition, DayForecast } from '@/services/weather-service';

const WEATHER_ICONS = {
  ensoleillé: Sun,
  nuageux: Cloud,
  pluvieux: CloudRain,
  orageux: AlertTriangle,
  neigeux: CloudSnow,
};

const RECOMMENDATION_COLORS = {
  excellent: 'bg-green-500',
  bon: 'bg-blue-500',
  moyen: 'bg-yellow-500',
  difficile: 'bg-orange-500',
  dangereux: 'bg-red-500',
};

const RECOMMENDATION_LABELS = {
  excellent: 'Excellent',
  bon: 'Bon',
  moyen: 'Moyen',
  difficile: 'Difficile',
  dangereux: 'Dangereux',
};

export default function WeatherPage() {
  const { t } = useTranslation();
  const [spots, setSpots] = useState<PaddleSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<string>('');
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [currentWeather, setCurrentWeather] = useState<WeatherCondition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const spotsData = localSpots.getAll();
    setSpots(spotsData);
    if (spotsData.length > 0 && !selectedSpot) {
      setSelectedSpot(spotsData[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedSpot) {
      loadWeatherData(selectedSpot);
    }
  }, [selectedSpot]);

  const loadWeatherData = async (spotId: string) => {
    const spot = spots.find(s => s.id === spotId);
    if (!spot) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const current = await weatherService.getCurrentWeather(spot.latitude, spot.longitude);
      if (current) {
        setCurrentWeather(current);
      } else {
        setError('Impossible de charger les données météo actuelles');
      }

      // Fetch forecast
      const forecastData = await weatherService.getForecast(spot.latitude, spot.longitude);
      if (forecastData && forecastData.length > 0) {
        setForecast(forecastData);
      } else {
        setError('Impossible de charger les prévisions météo');
      }
    } catch (err) {
      console.error('Error loading weather data:', err);
      setError('Erreur lors du chargement des données météo');
    } finally {
      setLoading(false);
    }
  };

  const selectedSpotData = spots.find(s => s.id === selectedSpot);

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Cloud className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Météo & Conditions</h1>
        </div>
        <p className="text-muted-foreground">
          Consultez les prévisions météo et les conditions de paddle pour chaque spot
        </p>
      </div>

      {/* Spot Selector */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sélectionner un spot</CardTitle>
          <CardDescription>Choisissez un spot pour voir ses prévisions météo</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedSpot} onValueChange={setSelectedSpot} disabled={loading}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un spot" />
            </SelectTrigger>
            <SelectContent>
              {spots.map((spot) => (
                <SelectItem key={spot.id} value={spot.id}>
                  {spot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="mb-8">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-muted-foreground">Chargement des données météo...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="mb-8 border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentWeather && selectedSpotData && (
        <>
          {/* Current Weather */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Conditions actuelles - {selectedSpotData.name}</span>
                <Badge className={RECOMMENDATION_COLORS[currentWeather.recommendation]}>
                  {RECOMMENDATION_LABELS[currentWeather.recommendation]}
                </Badge>
              </CardTitle>
              <CardDescription>Mis à jour maintenant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-4">
                  {React.createElement(WEATHER_ICONS[currentWeather.conditions], {
                    className: "h-12 w-12 text-primary"
                  })}
                  <div>
                    <p className="text-3xl font-bold">{Math.round(currentWeather.temperature)}°C</p>
                    <p className="text-sm text-muted-foreground">
                      Ressenti {Math.round(currentWeather.feelsLike)}°C
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Wind className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold">{Math.round(currentWeather.windSpeed)} km/h</p>
                    <p className="text-sm text-muted-foreground">Vent {currentWeather.windDirection}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Waves className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold">{currentWeather.waveHeight.toFixed(1)} m</p>
                    <p className="text-sm text-muted-foreground">Hauteur vagues</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Droplets className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold">{Math.round(currentWeather.humidity)}%</p>
                    <p className="text-sm text-muted-foreground">Humidité</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Recommandations
                </h3>
                <p className="text-sm">
                  {currentWeather.recommendation === 'excellent' &&
                    "Conditions parfaites pour le paddle ! Profitez-en."}
                  {currentWeather.recommendation === 'bon' &&
                    "Bonnes conditions pour paddler. Surveillez le vent."}
                  {currentWeather.recommendation === 'moyen' &&
                    "Conditions moyennes. Recommandé pour paddlers expérimentés."}
                  {currentWeather.recommendation === 'difficile' &&
                    "Conditions difficiles. Restez proche du rivage."}
                  {currentWeather.recommendation === 'dangereux' &&
                    "⚠️ Conditions dangereuses. Paddle déconseillé."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 5-Day Forecast */}
          <Card>
            <CardHeader>
              <CardTitle>Prévisions 5 jours</CardTitle>
              <CardDescription>Planifiez vos sessions à l'avance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                {forecast.map((day) => {
                  const WeatherIcon = WEATHER_ICONS[day.weather.conditions];
                  return (
                    <Card key={day.date.toISOString()} className="text-center">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          {format(day.date, 'EEE d MMM', { locale: fr })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <WeatherIcon className="h-10 w-10 mx-auto text-primary" />
                        <p className="text-2xl font-bold">
                          {Math.round(day.weather.temperature)}°C
                        </p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center justify-center gap-1">
                            <Wind className="h-3 w-3" />
                            {Math.round(day.weather.windSpeed)} km/h
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <Waves className="h-3 w-3" />
                            {day.weather.waveHeight.toFixed(1)} m
                          </div>
                        </div>
                        <Badge
                          className={`${RECOMMENDATION_COLORS[day.weather.recommendation]} text-xs w-full`}
                        >
                          {RECOMMENDATION_LABELS[day.weather.recommendation]}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Informations complémentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Visibilité</p>
                    <p className="text-sm text-muted-foreground">
                      {currentWeather.visibility.toFixed(1)} km
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Indice UV</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(currentWeather.uvIndex)}/10
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Conditions</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {currentWeather.conditions}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> {currentWeather.description?.includes('simulé') ? (
                    <>
                      ⚠️ Données météo simulées (clé API Weatherbit non configurée).
                      Pour obtenir des données réelles gratuites (500 appels/jour), créez un compte sur{' '}
                      <a href="https://www.weatherbit.io/account/create" target="_blank" rel="noopener noreferrer" className="underline">
                        weatherbit.io
                      </a> et ajoutez la clé dans .env.local
                    </>
                  ) : (
                    <>
                      Données météo fournies par Weatherbit API.
                      Les recommandations de paddle sont calculées en fonction de la vitesse du vent, de la hauteur des vagues estimée et des conditions météorologiques.
                    </>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {spots.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Aucun spot disponible. Ajoutez des spots depuis la carte pour voir leurs prévisions météo.
            </p>
            <Button onClick={() => window.location.href = '/map'}>
              Aller à la carte
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
