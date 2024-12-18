import { Link, router, Stack } from "expo-router";
import React, { useState } from "react";
import { Text, Pressable, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { TextInput, useTheme } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import useTranslations from "@/hooks/useTranslations";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import WorkoutExercises from "@/components/exercises/WorkoutExercises";
import { WorkoutExercise } from "@/interfaces/WorkoutExercise";

export default function NewWorkout() {
    const themeColors = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
    const { t } = useTranslations();
    const theme = useTheme();
    
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [duration, setDuration] = useState("4");

    const [availableExercises, setAvailableExercises] = useState([] as WorkoutExercise[]);
    const [selectedExercises, setSelectedExercises] = useState([] as WorkoutExercise[]);

    const handleSave = () => {
        console.log('Save workout');
    }
    
    const onDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || startDate;
        setStartDate(currentDate);
    };

    const showMode = (currentMode: 'date' | 'time') => {
        DateTimePickerAndroid.open({
            value: startDate,
            onChange: onDateChange,
            mode: currentMode,
            is24Hour: true,
        })
    };

    const showDatePicker = () => {
        showMode('date');
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: themeColors.background, 
        },
        label: {
            fontSize: 16,
            marginBottom: 8,
        },
        input: {
            paddingHorizontal: 8,
            marginBottom: 16,
        },
        durationInput: {
            flex: 1,
        },
        link: {
            padding: 16,
            borderRadius: 8,
            backgroundColor: theme.colors.primary,
            width: '50%',
            justifyContent: 'center',
            textAlign: 'center',
        }
    });

    const inputTheme: ThemeProp = {
        dark: useColorScheme() === 'dark',
        version: 3
    };

    const handleSetsChange = (index: number, value: string) => {
        const newExercises = [...selectedExercises];
        newExercises[index].sets = value;
        setSelectedExercises(newExercises);
    }

    const handleRepsChange = (index: number, value: string) => {
        const newExercises = [...selectedExercises];
        newExercises[index].reps = value;
        setSelectedExercises(newExercises);
    }

    return (
        <ThemedView
            style={{
                flex: 1,
            }}
        >
            <Stack.Screen options={{ title: t('newWorkout') }} />
            <TextInput
                style={styles.input}
                value={name}
                mode="outlined"
                theme={inputTheme}
                onChangeText={setName}
                label={t('workoutNameLabel')}
                placeholder={t('workoutNamePlaceholder')}
            />
            <View style={{ flexDirection: 'row', gap: 16 }}>
                <TextInput
                    style={[styles.input, styles.durationInput]}
                    value={startDate.toLocaleDateString()}
                    mode="outlined"
                    label={t('startDateLabel')}
                    onFocus={() => showDatePicker()}
                    placeholder={t('startDateLabel')}
                />
                <TextInput
                    style={[styles.input, styles.durationInput]}
                    value={duration}
                    mode="outlined"
                    label={t('durationLabel')}
                    onChangeText={setDuration}
                    placeholder={t('durationLabel')}
                    keyboardType="numeric"
                />
            </View>
            <WorkoutExercises selectedExercises={selectedExercises} handleSetsChange={handleSetsChange} handleRepsChange={handleRepsChange} />
            {/* <Pressable style={{ backgroundColor: "red" }}> */}
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Link href="/(tabs)/workouts/select-exercise" style={styles.link}>
                    <Text>{t("addExercise")}</Text>
                </Link>
            </View>
            {/* </Pressable> */}
            <Pressable onPress={handleSave}>
                <Text>Salva</Text>
            </Pressable>
        </ThemedView>
    );
}
