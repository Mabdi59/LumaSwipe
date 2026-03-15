# LumaSwipe

A visually immersive travel discovery mobile app built with React Native and Expo. Discover beautiful destinations through cinematic swipeable cards, smooth animations, and an elegant dark UI.

## Author

**Mohamed Abdi**

## Screenshots

The app features:
- 🌍 Onboarding screen with animated hero background
- 🗺️ Discover screen with swipeable destination cards
- 📍 Detailed destination pages with gallery
- ❤️ Favorites management
- 🔍 Search by name, country, or vibe
- 👤 Profile & settings page

## Built With

| Technology | Purpose |
|---|---|
| React Native + Expo | Mobile framework |
| TypeScript | Type safety |
| React Navigation | Navigation (Stack + Bottom Tabs) |
| expo-linear-gradient | Beautiful gradients |
| @expo/vector-icons | Icon set (Ionicons) |
| @react-native-async-storage | Favorites persistence |
| react-native-reanimated | Smooth animations |
| react-native-gesture-handler | Swipe gestures |

## Features

- ✅ **Onboarding** – Elegant intro with animations
- ✅ **Discover** – Full-screen swipeable destination cards with category filters
- ✅ **Details** – Hero image, stats, highlights, gallery
- ✅ **Favorites** – Save/remove with AsyncStorage persistence
- ✅ **Search** – Search by name, country, vibe, or category
- ✅ **Profile** – Settings page with clear favorites
- ✅ **12 Destinations** – Santorini, Kyoto, Bali, Machu Picchu, Amalfi Coast, Iceland, Dubai, Maldives, Patagonia, Marrakech, New Zealand, Tuscany
- ✅ **Dark premium UI** – Glassmorphism, gradients, rounded cards
- ✅ **Animated transitions** – Spring & fade animations

## Folder Structure

```
LumaSwipe/
├── App.tsx                    # Root component
├── app.json                   # Expo config
├── babel.config.js            # Babel (reanimated plugin)
├── src/
│   ├── screens/
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── DetailsScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── components/
│   │   ├── DestinationCard.tsx
│   │   ├── GlassCard.tsx
│   │   ├── PrimaryButton.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── TagPill.tsx
│   │   └── index.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   ├── data/
│   │   └── destinations.ts    # 12 mock destinations
│   ├── hooks/
│   │   ├── useFavorites.ts    # AsyncStorage favorites
│   │   └── useSearch.ts       # Search logic
│   ├── utils/
│   │   └── destinationUtils.ts
│   └── constants/
│       ├── colors.ts
│       ├── layout.ts
│       └── index.ts
└── assets/
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- [Expo Go](https://expo.dev/client) app on your phone (iOS or Android)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Mabdi59/LumaSwipe.git
cd LumaSwipe

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npx expo start
```

### Running on Device

1. Install **Expo Go** from the App Store (iOS) or Google Play (Android)
2. Run `npx expo start`
3. Scan the QR code with Expo Go (Android) or the Camera app (iOS)

### Running on Simulator

```bash
# iOS (requires macOS + Xcode)
npx expo start --ios

# Android (requires Android Studio + AVD)
npx expo start --android

# Web
npx expo start --web
```

## Destination Data

The app includes 12 pre-loaded travel destinations:

1. 🏛️ **Santorini** – Greece
2. 🌸 **Kyoto** – Japan
3. 🌴 **Bali** – Indonesia
4. 🏔️ **Machu Picchu** – Peru
5. 🌊 **Amalfi Coast** – Italy
6. 🌌 **Iceland** – Iceland
7. 🏙️ **Dubai** – UAE
8. 🏝️ **Maldives** – Maldives
9. 🦅 **Patagonia** – Argentina & Chile
10. 🕌 **Marrakech** – Morocco
11. 🐑 **New Zealand** – New Zealand
12. 🍷 **Tuscany** – Italy

## Design System

- **Colors**: Dark navy background (`#0D0D1A`) with purple (`#6C63FF`) and pink (`#EC4899`) accents
- **Typography**: Bold headlines with light body text
- **Cards**: Full-bleed images with gradient overlays
- **Glassmorphism**: Semi-transparent cards with border highlights
- **Animations**: Spring-based transitions

---

*LumaSwipe – Designed & Developed by Mohamed Abdi*
