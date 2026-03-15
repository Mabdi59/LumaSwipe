import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppPreferencesProvider } from './src/context/AppPreferencesContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { TripPlannerProvider } from './src/context/TripPlannerContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppPreferencesProvider>
          <TripPlannerProvider>
            <FavoritesProvider>
              <AppNavigator />
            </FavoritesProvider>
          </TripPlannerProvider>
        </AppPreferencesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
