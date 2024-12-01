import { Exercise } from "@/interfaces/Exercise";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
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