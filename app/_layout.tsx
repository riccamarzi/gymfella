import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider } from 'expo-sqlite';
import { Provider as PaperProvider, MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperDefaultTheme, adaptNavigationTheme } from 'react-native-paper';
import merge from 'deepmerge';
import { SelectedExercisesProvider } from '@/providers/selectedExercisesProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const customDarkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
  },
  fonts: {
    ...PaperDarkTheme.fonts,
    regular: { fontFamily: 'Roboto', fontWeight: '400' as '400', fontSize: 14 },
    medium: { fontFamily: 'Roboto', fontWeight: '500' as '500', fontSize: 14 },
    bold: { fontFamily: 'Roboto', fontWeight: '700' as '700', fontSize: 14 },
    heavy: { fontFamily: 'Roboto', fontWeight: '900' as '900', fontSize: 14 },
  },
};

const customDefaultTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
  },
  fonts: {
    ...PaperDefaultTheme.fonts,
    regular: { fontFamily: 'Roboto', fontWeight: '400' as "400", fontSize: 14 },
    medium: { fontFamily: 'Roboto', fontWeight: '500' as "500", fontSize: 14 },
    bold: { fontFamily: 'Roboto', fontWeight: '700' as "700", fontSize: 14 },
    heavy: { fontFamily: 'Roboto', fontWeight: '900' as "900", fontSize: 14 },
  },
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(LightTheme, customDefaultTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme: Theme = colorScheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme;
  

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={theme}>

        <SQLiteProvider databaseName="gym.db" assetSource={{ assetId: require("../assets/gymApp.db") }}>
          <SelectedExercisesProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SelectedExercisesProvider>
        </SQLiteProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"}/>
      </ThemeProvider>
    </PaperProvider>
  );
}