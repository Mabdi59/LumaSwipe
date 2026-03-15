import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainTabParamList = {
  Discover: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  Details: { destinationId: string };
};

type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;
export type DiscoverScreenProps = MainTabScreenProps<'Discover'>;
export type SearchScreenProps = MainTabScreenProps<'Search'>;
export type FavoritesScreenProps = MainTabScreenProps<'Favorites'>;
export type ProfileScreenProps = MainTabScreenProps<'Profile'>;
export type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;
