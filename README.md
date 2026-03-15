# LumaSwipe

LumaSwipe is a travel discovery app built with React Native and Expo. It combines cinematic destination browsing with practical trip planning, live weather, persistent favorites, and a polished mobile-first interface.

## Author

Mohamed Abdi

## What It Does

- Animated onboarding experience with a full-screen travel hero
- Discover screen with category filters and immersive destination cards
- Destination details with hero imagery, highlights, gallery, and live weather
- Trip planner with trip stages, notes, and checklist tracking
- Favorites synced across the app with AsyncStorage persistence
- Search by name, country, vibe, or category
- Profile and preferences for theme mode, notifications, and onboarding reset
- Expo Go support for iPhone and Android, plus web support for local preview

## Current Feature Set

- Onboarding flow with persisted completion state
- Light and dark themes with shared design tokens
- Bottom tab navigation plus typed stack routes
- 12 curated starter destinations
- Live weather snapshots powered by Open-Meteo
- Trip statuses: Dreaming, Planning, Booked, Visited
- Trip notes and custom checklist items per destination
- Favorites persistence with global synced state
- Search and filtered discovery flows

## Tech Stack

| Technology | Purpose |
| --- | --- |
| React Native | Cross-platform UI |
| Expo | App runtime and developer workflow |
| TypeScript | Static typing |
| React Navigation | Stack and bottom tab navigation |
| AsyncStorage | Persisted favorites, preferences, and trip plans |
| expo-linear-gradient | Gradients and visual polish |
| Ionicons | Iconography |
| Open-Meteo API | Live destination weather |
| react-native-gesture-handler | Gesture support |
| react-native-reanimated | Native animations |

## Project Structure

```text
LumaSwipe/
|-- App.tsx
|-- app.json
|-- babel.config.js
|-- index.ts
|-- src/
|   |-- components/
|   |-- constants/
|   |-- context/
|   |   |-- AppPreferencesContext.tsx
|   |   |-- FavoritesContext.tsx
|   |   `-- TripPlannerContext.tsx
|   |-- data/
|   |   `-- destinations.ts
|   |-- hooks/
|   |   |-- useBlurActiveElementOnBlur.ts
|   |   |-- useDestinationWeather.ts
|   |   |-- useFavorites.ts
|   |   `-- useSearch.ts
|   |-- navigation/
|   |   |-- AppNavigator.tsx
|   |   `-- types.ts
|   |-- screens/
|   |   |-- DetailsScreen.tsx
|   |   |-- FavoritesScreen.tsx
|   |   |-- HomeScreen.tsx
|   |   |-- OnboardingScreen.tsx
|   |   |-- ProfileScreen.tsx
|   |   `-- SearchScreen.tsx
|   |-- services/
|   |   `-- openMeteo.ts
|   `-- utils/
|       |-- destinationUtils.ts
|       |-- tripPlanner.ts
|       `-- web.ts
`-- assets/
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- Expo Go on iPhone or Android if you want to test on device

### Install

```bash
git clone https://github.com/Mabdi59/LumaSwipe.git
cd LumaSwipe
npm install
```

### Run the App

```bash
npx expo start
```

### Common Targets

```bash
npx expo start --ios
npx expo start --android
npx expo start --web
```

## Device Testing

1. Start the Expo server with `npx expo start`.
2. Open Expo Go on your phone.
3. Scan the QR code or enter the Expo URL manually.

## Data and APIs

- The app ships with 12 seeded destinations for the discovery experience.
- Live weather uses the public Open-Meteo API, so no API key is required.
- Favorites, trip plans, checklists, onboarding state, and preferences persist locally with AsyncStorage.

## Destinations Included

- Santorini, Greece
- Kyoto, Japan
- Bali, Indonesia
- Machu Picchu, Peru
- Amalfi Coast, Italy
- Iceland
- Dubai, UAE
- Maldives
- Patagonia, Argentina and Chile
- Marrakech, Morocco
- New Zealand
- Tuscany, Italy

## Design Direction

- Cinematic image-led cards
- Glassmorphism surfaces and soft borders
- High-contrast travel editorial layout
- Gradient-led accent system
- Mobile-first interaction with polished transitions

## Notes

- The app is designed primarily for Expo Go and local development builds.
- Web support is included for previewing flows and UI quickly during development.

## License

This repository includes a `LICENSE` file at the project root.
