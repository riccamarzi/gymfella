import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GestureHandlerRootView, Pressable, TouchableOpacity } from "react-native-gesture-handler";
import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import * as Localization from 'expo-localization';
import { useSQLiteContext } from "expo-sqlite";
import { translations } from "@/services/localization";
import { I18n } from "i18n-js";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Link, Stack } from "expo-router";

interface Workout {
    id: number;
    name: string;
    date: string;
}

export default function WorkoutsScreen() {
    const [workouts, setWorkouts] = useState([] as Workout[]);
    const [locale, setLocale] = useState<string>(Localization.getLocales()[0].languageCode || 'en');
    const i18n = new I18n(translations);
    if (locale !== null)
        i18n.locale = locale;
    const db = useSQLiteContext();
    const theme = useColorScheme() ?? 'dark';

    useEffect(() => {
        async function getWorkouts() {
            const query = await db.prepareAsync('SELECT workouts.id as id, workouts.name as name, workouts.start as date FROM workouts');
            try {
                const result = await query.executeAsync();
                
                const rows = await result.getAllAsync() as Workout[];
                setWorkouts(rows);
                
            } finally {
                await query.finalizeAsync();
            }
        }
        getWorkouts();
    }, []);

    return (
        <>
            <Stack.Screen options={{ headerShown: false, title: i18n.t('workouts') }} />
            <GestureHandlerRootView>
                <ThemedView style={styles.container}>
                {workouts.length > 0 ? (
                    <View style={styles.workouts}>
                        {workouts.map((workout) => (
                            <ThemedView key={workout.id}>
                                <ThemedText>{workout.name}</ThemedText>
                            </ThemedView>
                        ))}
                    </View>
                ) : (
                    <ThemedView style={styles.workouts}>
                        <ThemedText
                            style={{
                                textAlign: 'center',
                            }}
                            type="subtitle"
                        >{i18n.t('emptyWorkouts')}</ThemedText>
                    </ThemedView>
                )}
                        <Pressable onPress={() => console.log('pressed')} 
                            style={[styles.link, {backgroundColor: theme === 'dark' ? Colors.dark.tint : Colors.light.tint}]}
                        >
                    <Link href="/workouts/new-workout" style={styles.fab}>
                            <IconSymbol
                                name="calendar.plus"
                                size={32}
                                weight="medium"
                                color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                            />
                        </Link>
                        </Pressable>
                </ThemedView>
            </GestureHandlerRootView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    workouts: {
        flex: 1,
    },
    link: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5, // Aggiunge ombra su Android
        shadowColor: '#000', // Aggiunge ombra su iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    fab: {
        borderRadius: 30, // Assicura che il Pressable sia circolare
    },
    fabText: {
        color: 'red',
        fontSize: 24,
    },
});