import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import useTranslations from '@/hooks/useTranslations';
import { useTheme } from 'react-native-paper';
import TabBar from '@/components/ui/TabBar';
import TabsHeader from '@/components/ui/TabsHeader';

export default function TabLayout() {
  const theme = useTheme();
  const { t } = useTranslations();
  
  return (
    <Tabs
      
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: true,
        header: (props) => <TabsHeader navProps={props} children={undefined} />,
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
          title: t('home'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: t('workouts'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="calendar.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t('progress'),
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="autograph.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
