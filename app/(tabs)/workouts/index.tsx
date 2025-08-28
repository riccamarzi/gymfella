import React from 'react';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import { db } from "@/database/drizzle-index";
import { desc } from 'drizzle-orm';
import { Link, Stack, useRouter } from "expo-router";
import useTranslations from "@/hooks/useTranslations";
import { FAB, Icon, useTheme } from 'react-native-paper';
import { Workout } from "@/interfaces/Workout";
import { workoutTable } from '@/database/schema';


export default function WorkoutsScreen() {
    const [workouts, setWorkouts] = useState([] as Workout[]);
    const { t } = useTranslations();
    const theme = useTheme();
    const router = useRouter();

    const handleCalendarPress = () => {
        router.push(`/(tabs)/workouts/new-workout`);
    }

    useEffect(() => {
        async function getWorkouts() {
            try {
                const workouts = await db.select().from(workoutTable).orderBy(desc(workoutTable.start));
                
                const workoutData: Workout[] = workouts.map((record: any) => ({
                    id: record.id,
                    name: record.workout_name,
                    date: new Date(record.start).toISOString() // Converti timestamp in string ISO
                }));
                console.log(workoutData);
                
                setWorkouts(workoutData);
                
            } catch (error) {
                console.error('Errore nel caricamento dei workouts:', error);
            }
        }
        getWorkouts();
    }, []);

    return (
        <>
            <Stack.Screen options={{ headerShown: false, title: t('workouts') }} />
            <GestureHandlerRootView>
                <ThemedView style={styles.container}>
                {workouts.length > 0 ? (
                    <View style={styles.workouts}>
                         {workouts.map((workout) => (
                    //         <ThemedView key={workout.id}>
                    //             <ThemedText>{workout.name}</ThemedText>
                    //         </ThemedView>
                            <Link
                                href={{
                                    pathname: "/(tabs)/workouts/get/[id]",
                                    params: { id: workout.id }
                                }}
                                key={workout.id}
                            >
                                <ThemedText>{workout.name}</ThemedText>
                            </Link>
                        ))}
                    </View>
                ) : (
                    <ThemedView style={styles.workouts}>
                        <ThemedText
                            style={{
                                textAlign: 'center',
                            }}
                            type="subtitle"
                        >{t('emptyWorkouts')}</ThemedText>
                    </ThemedView>
                )}
                    {/* <Pressable onPress={() => console.log('pressed')} 
                        style={[styles.link, {backgroundColor: theme.tint}]}
                    >
                        <Link href="/workouts/new-workout" style={styles.fab}>
                            <IconSymbol
                                name="calendar.plus"
                                size={32}
                                weight="medium"
                                color={theme.colors.}
                            />
                        </Link>
                    </Pressable> */}
                    <FAB
                        icon="calendar-plus"
                        style={[styles.link]}
                        animated={false} 
                        variant='primary'
                        theme={theme}
                        rippleColor={theme.colors.primary}
                        onPress={handleCalendarPress}
                    >
                    </FAB>
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    fab: {
        borderRadius: 30,
    },
    fabText: {
        fontSize: 24,
    },
});