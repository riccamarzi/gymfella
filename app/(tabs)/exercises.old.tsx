import { useState } from "react";
import { View } from "react-native";
import * as Localization from 'expo-localization';
import MuscleGroupList from "@/components/exercises/MuscleGroupList";

export default function ExercisesScreen() {
  const [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || 'en');

  return (
    <View
      style={{
        flex: 1,
      }}
    >
        <MuscleGroupList locale={locale} />
    </View>
  );
}