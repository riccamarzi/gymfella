import useTranslations from "@/hooks/useTranslations";
import { Stack } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import * as Localization from "expo-localization";
import MuscleGroupList from "@/components/exercises/MuscleGroupList";

interface MuscleGroupListProps {
    locale: string;
}

interface MuscleGroup {
    name: string;
    id: number;
}

export default function SelectExercise() {
    const { t } = useTranslations();
    const [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || 'en');

    return (
        <View>
            <Stack.Screen options={{ title: t('selectExercise') }} />
            <MuscleGroupList locale={locale} showCheckbox={true} />
        </View>
    )
}