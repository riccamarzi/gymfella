import { Stack } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import * as Localization from 'expo-localization';
import { translations } from "@/services/localization";
import { I18n } from "i18n-js";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker, { AndroidNativeProps } from '@react-native-community/datetimepicker';


export default function NewWorkout() {
    const [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || 'en');
    const i18n = new I18n(translations);
    if (locale !== null)
        i18n.locale = locale;

    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [duration, setDuration] = useState("0");

    const themeColors = useColorScheme() === 'dark' ? Colors.dark : Colors.light;

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
            <Stack.Screen options={{ title: i18n.t('newWorkout') }} />
            <ThemedText 
                style={styles.label}
                darkColor={Colors.dark.text}    
            >{i18n.t('workoutNameLabel')}</ThemedText>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={i18n.t('workoutNamePlaceholder')}
            />
            <ThemedText style={styles.label}>{i18n.t('startDateLabel')}</ThemedText>
            <TextInput
                style={styles.input}
                value={startDate.toLocaleDateString()}
                onFocus={() => showDatePicker()}
                placeholder={i18n.t('startDateLabel')}
            />
            <ThemedText style={styles.label}>{i18n.t('durationLabel')}</ThemedText>
            <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder={i18n.t('durationLabel')}
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
        backgroundColor: Colors.light.background, // O Colors.dark.background a seconda del tema
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: Colors.light.icon, // O Colors.dark.icon a seconda del tema
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
        backgroundColor: Colors.light.darkerBackground, // O Colors.dark.lighterBackground a seconda del tema
    },
});
