import { Exercise } from "@/interfaces/Exercise";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Localization from 'expo-localization';
import MuscleGroupList from "@/components/exercises/MuscleGroupList";

export default function ExercisesScreen() {
    const db = useSQLiteContext();
    const [exercises, setExercises] = useState([] as Exercise[]);
    const [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || 'en');
    
    useEffect(() => {
        async function getExercises() {
            const query = await db.prepareAsync("SELECT et.ex_translation AS exercise_name, mgt.muscle_translation AS muscle_group_name, \
            et.exercise_id AS ex_id \
            FROM exercise_translations et \
            JOIN exercises e ON et.exercise_id = e.id \
            JOIN muscle_group_translations mgt ON e.muscle_group_id = mgt.muscle_group_id \
            WHERE et.locale = $locale AND mgt.locale = $locale");
            
            try {
              const result = await query.executeAsync({ $locale: locale });
              
              const rows = await result.getAllAsync();
              setExercises(rows as Exercise[]);
            }
            finally{
              await query.finalizeAsync();
            }
        }
        // getExercises();
    }, []);

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