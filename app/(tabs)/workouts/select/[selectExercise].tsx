import useTranslations from "@/hooks/useTranslations";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import * as Localization from "expo-localization";
import MuscleGroupList from "@/components/exercises/MuscleGroupList";
import { Exercise } from "@/interfaces/Exercise";
import { useSelectedExercises } from "@/providers/selectedExercisesProvider";

export default function SelectExercise() {
    const { selectExercise: workoutName } = useLocalSearchParams();
    
    const { t } = useTranslations();
    const [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || 'en');
    const { selectedExercises, setSelectedExercises } = useSelectedExercises() as { selectedExercises: Exercise[], setSelectedExercises: React.Dispatch<React.SetStateAction<Exercise[]>> };

    const handleExerciseSelection = (exercise: Exercise) => {
        setSelectedExercises((prevSelected: Exercise[]) => {
          if (prevSelected.some(e => e.ex_id === exercise.ex_id)) {
            return prevSelected.filter(e => e.ex_id !== exercise.ex_id);
          }
          
          return [...prevSelected, exercise];
        })
      }

    return (
        <View>
            <Stack.Screen options={{ title: `${t('selectExercise')} (${workoutName})` }} />
            <MuscleGroupList locale={locale} showCheckbox={true} onExerciseSelection={handleExerciseSelection} />
        </View>
    )
}