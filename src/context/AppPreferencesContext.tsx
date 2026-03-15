import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  DarkColors,
  DarkGradients,
  LightColors,
  LightGradients,
  type ThemeColors,
  type ThemeGradients,
} from '../constants';

const PREFERENCES_KEY = '@lumaswipe_preferences';

type ThemeMode = 'dark' | 'light';

interface StoredPreferences {
  hasCompletedOnboarding: boolean;
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
}

interface AppPreferencesContextValue extends StoredPreferences {
  loading: boolean;
  colors: ThemeColors;
  gradients: ThemeGradients;
  statusBarStyle: 'light-content' | 'dark-content';
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  toggleTheme: () => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const defaultPreferences: StoredPreferences = {
  hasCompletedOnboarding: false,
  themeMode: 'dark',
  notificationsEnabled: true,
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | undefined>(undefined);

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<StoredPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
        if (!stored) {
          return;
        }

        const parsed = JSON.parse(stored) as Partial<StoredPreferences>;
        setPreferences({
          hasCompletedOnboarding: parsed.hasCompletedOnboarding ?? defaultPreferences.hasCompletedOnboarding,
          themeMode: parsed.themeMode === 'light' ? 'light' : 'dark',
          notificationsEnabled: parsed.notificationsEnabled ?? defaultPreferences.notificationsEnabled,
        });
      } catch (error) {
        console.warn('Failed to load app preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadPreferences();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const savePreferences = async () => {
      try {
        await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.warn('Failed to save app preferences:', error);
      }
    };

    void savePreferences();
  }, [loading, preferences]);

  const completeOnboarding = useCallback(() => {
    setPreferences((current) => ({ ...current, hasCompletedOnboarding: true }));
  }, []);

  const resetOnboarding = useCallback(() => {
    setPreferences((current) => ({ ...current, hasCompletedOnboarding: false }));
  }, []);

  const toggleTheme = useCallback(() => {
    setPreferences((current) => ({
      ...current,
      themeMode: current.themeMode === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    setPreferences((current) => ({ ...current, notificationsEnabled: enabled }));
  }, []);

  const value = useMemo<AppPreferencesContextValue>(() => {
    const colors = preferences.themeMode === 'dark' ? DarkColors : LightColors;
    const gradients = preferences.themeMode === 'dark' ? DarkGradients : LightGradients;

    return {
      ...preferences,
      loading,
      colors,
      gradients,
      statusBarStyle: preferences.themeMode === 'dark' ? 'light-content' : 'dark-content',
      completeOnboarding,
      resetOnboarding,
      toggleTheme,
      setNotificationsEnabled,
    };
  }, [completeOnboarding, loading, preferences, resetOnboarding, setNotificationsEnabled, toggleTheme]);

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);

  if (!context) {
    throw new Error('useAppPreferences must be used within an AppPreferencesProvider');
  }

  return context;
}
