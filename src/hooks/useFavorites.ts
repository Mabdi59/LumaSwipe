import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@lumaswipe_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load favorites:', e);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (ids: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('Failed to save favorites:', e);
    }
  };

  const toggleFavorite = useCallback(
    async (id: string) => {
      const updated = favorites.includes(id)
        ? favorites.filter((fid) => fid !== id)
        : [...favorites, id];
      setFavorites(updated);
      await saveFavorites(updated);
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const clearFavorites = useCallback(async () => {
    setFavorites([]);
    await saveFavorites([]);
  }, []);

  return { favorites, loading, toggleFavorite, isFavorite, clearFavorites };
}
