import { Stack } from "expo-router";
import React, { useState } from "react";
import { Text, Pressable } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { TextInput } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker, { AndroidNativeProps } from '@react-native-community/datetimepicker';
import useTranslations from "@/hooks/useTranslations";
import { ThemeProp } from "react-native-paper/lib/typescript/types";


export default function NewWorkout() {
    const themeColors = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
    const { t } = useTranslations();
    
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [duration, setDuration] = useState("4");

    const handleSave = () => {
        console.log('Save workout');
    }
    
    const onDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || startDate;
        setStartDate(currentDate);
    };

    const showMode = (currentMode) => {
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
    });

    const inputTheme: ThemeProp = {
        dark: useColorScheme() === 'dark',
        version: 3
    };

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
            <TextInput
                style={styles.input}
                value={startDate.toLocaleDateString()}
                mode="outlined"
                label={t('startDateLabel')}
                onFocus={() => showDatePicker()}
                placeholder={t('startDateLabel')}
            />
            <TextInput
                style={styles.input}
                value={duration}
                mode="outlined"
                label={t('durationLabel')}
                onChangeText={setDuration}
                placeholder={t('durationLabel')}
                keyboardType="numeric"
            />
            <Pressable onPress={handleSave}>
                <Text>Salva</Text>
            </Pressable>
        </ThemedView>
    );
}



