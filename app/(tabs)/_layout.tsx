import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { translations } from '@/services/localization';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  let [locale, setLocale] = React.useState(Localization.getLocales()[0].languageCode);
  const i18n = new I18n(translations);
  if (locale !== null)
    i18n.locale = locale;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t('home'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: i18n.t('workouts'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="calendar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: i18n.t('exercises'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="dumbbell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: i18n.t('progress'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="autograph.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
