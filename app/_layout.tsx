import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteDatabase, SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const db = openDatabaseSync("gymApp.db");

export default function RootLayout() {
  useDrizzleStudio(db);
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

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName='gymApp.db' assetSource={{ assetId: require("@/assets/gymApp.db") }} onInit={migrateDbIfNeeded}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SQLiteProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentDbVersion = result ? result.user_version : 0;
  console.log(`Migrating database from version ${currentDbVersion} to ${DATABASE_VERSION}`);
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  
  if (currentDbVersion === 0) {
    await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    CREATE TABLE exercises (
      id INTEGER NOT NULL, 
      name TEXT NOT NULL,
      description TEXT,
      muscle_group TEXT NOT NULL,
      PRIMARY KEY (id)
    );
    `);
    await db.runAsync('INSERT INTO exercises (name, muscle_group) VALUES (?, ?)', 'Chest Flies', "Chest");
    await db.runAsync('INSERT INTO exercises (name, muscle_group) VALUES (?, ?)', 'Chest Press', "Chest");
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}