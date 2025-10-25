// Weather service using Weatherbit API
const API_KEY = process.env.NEXT_PUBLIC_WEATHERBIT_API_KEY;
const BASE_URL = 'https://api.weatherbit.io/v2.0';

export interface WeatherCondition {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  waveHeight: number;
  conditions: 'ensoleillé' | 'nuageux' | 'pluvieux' | 'orageux' | 'neigeux';
  uvIndex: number;
  recommendation: 'excellent' | 'bon' | 'moyen' | 'difficile' | 'dangereux';
  description: string;
}

export interface DayForecast {
  date: Date;
  weather: WeatherCondition;
}

// Map Weatherbit condition codes to our simplified conditions
const mapWeatherCondition = (code: number): WeatherCondition['conditions'] => {
  if (code >= 200 && code < 300) return 'orageux'; // Thunderstorm
  if (code >= 300 && code < 600) return 'pluvieux'; // Drizzle/Rain
  if (code >= 600 && code < 700) return 'neigeux'; // Snow
  if (code >= 800 && code <= 801) return 'ensoleillé'; // Clear/Few clouds
  return 'nuageux'; // Cloudy
};

// Calculate paddle recommendation based on conditions
const calculateRecommendation = (
  windSpeed: number,
  waveHeight: number,
  weatherCode: number
): WeatherCondition['recommendation'] => {
  // Dangerous conditions
  if (windSpeed > 25 || waveHeight > 1.5 || (weatherCode >= 200 && weatherCode < 300)) {
    return 'dangereux';
  }

  // Difficult conditions
  if (windSpeed > 20 || waveHeight > 1 || (weatherCode >= 500 && weatherCode < 600)) {
    return 'difficile';
  }

  // Medium conditions
  if (windSpeed > 15 || waveHeight > 0.7 || (weatherCode >= 300 && weatherCode < 500)) {
    return 'moyen';
  }

  // Good conditions
  if (windSpeed > 10 || (weatherCode >= 802 && weatherCode <= 804)) {
    return 'bon';
  }

  // Excellent conditions
  return 'excellent';
};

// Generate simulated weather data as fallback
const generateSimulatedWeather = (latitude: number, longitude: number): WeatherCondition => {
  const seed = latitude + longitude;
  const random = (min: number, max: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return min + ((x - Math.floor(x)) * (max - min));
  };

  const temp = random(15, 28);
  const windSpeed = random(5, 30);
  const waveHeight = Math.min(windSpeed / 20, 2.5);

  return {
    temperature: temp,
    feelsLike: temp + random(-2, 2),
    humidity: random(40, 80),
    windSpeed,
    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(random(0, 8))],
    visibility: random(8, 15),
    waveHeight,
    conditions: windSpeed > 20 ? 'nuageux' : temp > 22 ? 'ensoleillé' : 'nuageux',
    uvIndex: random(3, 9),
    description: 'Conditions simulées',
    recommendation: calculateRecommendation(windSpeed, waveHeight, 800),
  };
};

// Fetch current weather for a location
export const getCurrentWeather = async (
  latitude: number,
  longitude: number
): Promise<WeatherCondition | null> => {
  // Check if API key is available
  if (!API_KEY || API_KEY === 'undefined') {
    console.warn('⚠️ Weatherbit API key not configured. Using simulated data.');
    return generateSimulatedWeather(latitude, longitude);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/current?lat=${latitude}&lon=${longitude}&key=${API_KEY}&lang=fr`
    );

    if (!response.ok) {
      console.warn(`⚠️ Weather API error: ${response.status}. Using simulated data.`);
      return generateSimulatedWeather(latitude, longitude);
    }

    const data = await response.json();

    // Check if API returned an error
    if (data.error) {
      console.warn(`⚠️ Weather API error: ${data.error}. Using simulated data.`);
      return generateSimulatedWeather(latitude, longitude);
    }
    const current = data.data[0];

    // Estimate wave height based on wind speed (simplified formula)
    const waveHeight = Math.min((current.wind_spd * 3.6) / 20, 2.5);

    const weather: WeatherCondition = {
      temperature: current.temp,
      feelsLike: current.app_temp,
      humidity: current.rh,
      windSpeed: current.wind_spd * 3.6, // Convert m/s to km/h
      windDirection: current.wind_cdir,
      visibility: current.vis,
      waveHeight: waveHeight,
      conditions: mapWeatherCondition(current.weather.code),
      uvIndex: current.uv || 0,
      description: current.weather.description,
      recommendation: calculateRecommendation(
        current.wind_spd * 3.6,
        waveHeight,
        current.weather.code
      ),
    };

    return weather;
  } catch (error) {
    console.error('Failed to fetch current weather:', error);
    return null;
  }
};

// Generate simulated 5-day forecast
const generateSimulatedForecast = (latitude: number, longitude: number): DayForecast[] => {
  const forecast: DayForecast[] = [];
  const today = new Date();

  for (let i = 1; i <= 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const seed = latitude + longitude + i;
    const random = (min: number, max: number) => {
      const x = Math.sin(seed * 9999) * 10000;
      return min + ((x - Math.floor(x)) * (max - min));
    };

    const temp = random(15, 28);
    const windSpeed = random(5, 30);
    const waveHeight = Math.min(windSpeed / 20, 2.5);

    forecast.push({
      date,
      weather: {
        temperature: temp,
        feelsLike: temp + random(-2, 2),
        humidity: random(40, 80),
        windSpeed,
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(random(0, 8))],
        visibility: random(8, 15),
        waveHeight,
        conditions: windSpeed > 20 ? 'nuageux' : temp > 22 ? 'ensoleillé' : 'nuageux',
        uvIndex: random(3, 9),
        description: 'Prévisions simulées',
        recommendation: calculateRecommendation(windSpeed, waveHeight, 800),
      },
    });
  }

  return forecast;
};

// Fetch 5-day forecast for a location
export const getForecast = async (
  latitude: number,
  longitude: number
): Promise<DayForecast[]> => {
  // Check if API key is available
  if (!API_KEY || API_KEY === 'undefined') {
    console.warn('⚠️ Weatherbit API key not configured. Using simulated forecast.');
    return generateSimulatedForecast(latitude, longitude);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast/daily?lat=${latitude}&lon=${longitude}&days=5&key=${API_KEY}&lang=fr`
    );

    if (!response.ok) {
      console.warn(`⚠️ Forecast API error: ${response.status}. Using simulated data.`);
      return generateSimulatedForecast(latitude, longitude);
    }

    const data = await response.json();

    // Check if API returned an error
    if (data.error) {
      console.warn(`⚠️ Forecast API error: ${data.error}. Using simulated data.`);
      return generateSimulatedForecast(latitude, longitude);
    }

    const forecast: DayForecast[] = data.data.map((day: any) => {
      const waveHeight = Math.min((day.wind_spd * 3.6) / 20, 2.5);

      return {
        date: new Date(day.datetime),
        weather: {
          temperature: day.temp,
          feelsLike: day.app_max_temp,
          humidity: day.rh,
          windSpeed: day.wind_spd * 3.6, // Convert m/s to km/h
          windDirection: day.wind_cdir,
          visibility: day.vis || 10,
          waveHeight: waveHeight,
          conditions: mapWeatherCondition(day.weather.code),
          uvIndex: day.uv || 0,
          description: day.weather.description,
          recommendation: calculateRecommendation(
            day.wind_spd * 3.6,
            waveHeight,
            day.weather.code
          ),
        },
      };
    });

    return forecast;
  } catch (error) {
    console.error('Failed to fetch forecast:', error);
    return [];
  }
};

export const weatherService = {
  getCurrentWeather,
  getForecast,
};

export default weatherService;
