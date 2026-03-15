import { useEffect, useState } from 'react';
import type { Destination } from '../data/destinations';
import {
  fetchDestinationWeather,
  type DestinationWeatherSnapshot,
} from '../services/openMeteo';

const weatherCache = new Map<string, DestinationWeatherSnapshot>();

export function useDestinationWeather(destination: Destination | undefined) {
  const [data, setData] = useState<DestinationWeatherSnapshot | null>(() =>
    destination ? weatherCache.get(destination.id) ?? null : null
  );
  const [loading, setLoading] = useState<boolean>(() =>
    destination ? !weatherCache.has(destination.id) : false
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destination) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const cached = weatherCache.get(destination.id);
    if (cached) {
      setData(cached);
      setLoading(false);
      setError(null);
      return;
    }

    let isActive = true;

    const loadWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        const nextData = await fetchDestinationWeather(destination);

        if (!isActive) {
          return;
        }

        weatherCache.set(destination.id, nextData);
        setData(nextData);
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        console.warn('Failed to load destination weather:', loadError);
        setData(null);
        setError('Live weather is unavailable right now.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadWeather();

    return () => {
      isActive = false;
    };
  }, [destination]);

  return {
    data,
    loading,
    error,
  };
}
