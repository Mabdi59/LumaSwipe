import type { Destination } from '../data/destinations';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

interface WeatherPoint {
  locationLabel: string;
  latitude: number;
  longitude: number;
  search: string;
}

const WEATHER_POINTS_BY_DESTINATION: Record<string, WeatherPoint> = {
  '1': { locationLabel: 'Fira, Greece', latitude: 36.4167, longitude: 25.4333, search: 'Fira Greece' },
  '2': { locationLabel: 'Kyoto, Japan', latitude: 35.0116, longitude: 135.7681, search: 'Kyoto Japan' },
  '3': { locationLabel: 'Denpasar, Indonesia', latitude: -8.6705, longitude: 115.2126, search: 'Denpasar Indonesia' },
  '4': { locationLabel: 'Machu Picchu, Peru', latitude: -13.1631, longitude: -72.545, search: 'Machu Picchu Peru' },
  '5': { locationLabel: 'Amalfi, Italy', latitude: 40.634, longitude: 14.6027, search: 'Amalfi Italy' },
  '6': { locationLabel: 'Reykjavik, Iceland', latitude: 64.1466, longitude: -21.9426, search: 'Reykjavik Iceland' },
  '7': { locationLabel: 'Dubai, UAE', latitude: 25.2048, longitude: 55.2708, search: 'Dubai United Arab Emirates' },
  '8': { locationLabel: 'Male, Maldives', latitude: 4.1755, longitude: 73.5093, search: 'Male Maldives' },
  '9': { locationLabel: 'El Calafate, Patagonia', latitude: -50.3379, longitude: -72.2648, search: 'El Calafate Argentina' },
  '10': { locationLabel: 'Marrakech, Morocco', latitude: 31.6295, longitude: -7.9811, search: 'Marrakesh Morocco' },
  '11': { locationLabel: 'Queenstown, New Zealand', latitude: -45.0312, longitude: 168.6626, search: 'Queenstown New Zealand' },
  '12': { locationLabel: 'Florence, Italy', latitude: 43.7696, longitude: 11.2558, search: 'Florence Italy' },
};

interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  timezone?: string;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface ForecastResponse {
  timezone?: string;
  timezone_abbreviation?: string;
  current?: {
    time?: string;
    temperature_2m?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
}

export interface DestinationWeatherSnapshot {
  locationLabel: string;
  timezoneLabel: string;
  observedAt: string | null;
  temperatureC: number | null;
  highTemperatureC: number | null;
  lowTemperatureC: number | null;
  windSpeedKmh: number | null;
  weatherCode: number | null;
  weatherSummary: string;
}

function getWeatherSearch(destination: Destination): string {
  return WEATHER_POINTS_BY_DESTINATION[destination.id]?.search ?? `${destination.name} ${destination.country}`;
}

function getLocationLabel(result: GeocodingResult): string {
  if (result.country && result.country !== result.name) {
    return `${result.name}, ${result.country}`;
  }

  return result.name;
}

function getWeatherSummary(weatherCode: number | null | undefined): string {
  switch (weatherCode) {
    case 0:
      return 'Clear skies';
    case 1:
    case 2:
      return 'Mostly clear';
    case 3:
      return 'Cloudy';
    case 45:
    case 48:
      return 'Foggy';
    case 51:
    case 53:
    case 55:
      return 'Light drizzle';
    case 56:
    case 57:
      return 'Freezing drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rain';
    case 66:
    case 67:
      return 'Freezing rain';
    case 71:
    case 73:
    case 75:
      return 'Snow';
    case 77:
      return 'Snow grains';
    case 80:
    case 81:
    case 82:
      return 'Rain showers';
    case 85:
    case 86:
      return 'Snow showers';
    case 95:
      return 'Thunderstorm';
    case 96:
    case 99:
      return 'Thunderstorm with hail';
    default:
      return 'Conditions unavailable';
  }
}

async function requestJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchDestinationWeather(
  destination: Destination
): Promise<DestinationWeatherSnapshot> {
  const presetLocation = WEATHER_POINTS_BY_DESTINATION[destination.id];
  let locationLabel = presetLocation?.locationLabel ?? destination.name;
  let latitude = presetLocation?.latitude;
  let longitude = presetLocation?.longitude;
  let locationTimezone: string | undefined;

  if (latitude == null || longitude == null) {
    const geocodingParams = new URLSearchParams({
      name: getWeatherSearch(destination),
      count: '1',
      language: 'en',
      format: 'json',
    });

    const geocoding = await requestJson<GeocodingResponse>(
      `${GEOCODING_URL}?${geocodingParams.toString()}`
    );

    const location = geocoding.results?.[0];
    if (!location) {
      throw new Error('No weather location match was found.');
    }

    latitude = location.latitude;
    longitude = location.longitude;
    locationLabel = getLocationLabel(location);
    locationTimezone = location.timezone;
  }

  const forecastParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '1',
  });

  const forecast = await requestJson<ForecastResponse>(
    `${FORECAST_URL}?${forecastParams.toString()}`
  );

  return {
    locationLabel,
    timezoneLabel: forecast.timezone_abbreviation ?? forecast.timezone ?? locationTimezone ?? 'Local time',
    observedAt: forecast.current?.time ?? null,
    temperatureC: forecast.current?.temperature_2m ?? null,
    highTemperatureC: forecast.daily?.temperature_2m_max?.[0] ?? null,
    lowTemperatureC: forecast.daily?.temperature_2m_min?.[0] ?? null,
    windSpeedKmh: forecast.current?.wind_speed_10m ?? null,
    weatherCode: forecast.current?.weather_code ?? null,
    weatherSummary: getWeatherSummary(forecast.current?.weather_code ?? null),
  };
}
