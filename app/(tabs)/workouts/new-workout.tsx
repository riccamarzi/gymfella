import { Stack } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker, { AndroidNativeProps } from '@react-native-community/datetimepicker';
import useTranslations from "@/hooks/useTranslations";


export default function NewWorkout() {
    const { t } = useTranslations();
    
    const themeColors = useColorScheme() === 'dark' ? Colors.dark : Colors.light;
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [duration, setDuration] = useState("0");


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

    return (
        <ThemedView
            style={{
                flex: 1,
            }}
        >
            <Stack.Screen options={{ title: t('newWorkout') }} />
            <ThemedText 
                style={styles.label}
                darkColor={themeColors.text}    
            >{t('workoutNameLabel')}</ThemedText>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={t('workoutNamePlaceholder')}
            />
            <ThemedText style={styles.label}>{t('startDateLabel')}</ThemedText>
            <TextInput
                style={styles.input}
                value={startDate.toLocaleDateString()}
                onFocus={() => showDatePicker()}
                placeholder={t('startDateLabel')}
            />
            <ThemedText style={styles.label}>{t('durationLabel')}</ThemedText>
            <TextInput
                style={styles.input}
                value={duration}
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: themeColors.background, // O Colors.dark.background a seconda del tema
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: themeColors.icon, // O Colors.dark.icon a seconda del tema
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
        backgroundColor: themeColors.lighterBackground, // O Colors.dark.lighterBackground a seconda del tema
    },
});
