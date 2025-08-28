import useTranslations from "@/hooks/useTranslations";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { WorkoutExercise } from "@/interfaces/WorkoutExercise";
import { Workout } from "@/interfaces/Workout";
import { getExFromWorkoutID } from "@/services/database";
import { View } from "react-native";
import * as Localization from "expo-localization";

export default function getWorkoutFromID() {
    const { id } = useLocalSearchParams() as unknown as { id: string };
    const [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || 'en');
    const [workout, setWorkout] = useState<Workout | null>(null);
    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
    const { t } = useTranslations();

    useEffect(() => {
        getExFromWorkoutID(id, locale).then((result) => {
            console.log(result);
        });
    }, []);

    return (
        <View>
            <Stack.Screen options={{ title: `${t('selectExercise')} ${id}` }} />
        </View>
    )
}