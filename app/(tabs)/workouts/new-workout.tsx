import { Link, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, Pressable, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { TextInput, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DateTimePickerAndroid, DateTimePickerEvent } from '@react-native-community/datetimepicker';
import useTranslations from "@/hooks/useTranslations";
import { ThemeProp } from "react-native-paper/lib/typescript/types";
import WorkoutExercises from "@/components/exercises/WorkoutExercises";
import { WorkoutExercise } from "@/interfaces/WorkoutExercise";
import { useSelectedExercises } from "@/providers/selectedExercisesProvider";

export default function NewWorkout() {
    const { t } = useTranslations();
    const theme = useTheme();
    
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [duration, setDuration] = useState("4");
  
    const { selectedExercises, setSelectedExercises } = useSelectedExercises();
    const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  
    useEffect(() => {
      setSelectedExercises([]);
    }, []);
  
    useEffect(() => {
      const newWorkoutExercises: WorkoutExercise[] = selectedExercises.map((exercise) => ({
        ...exercise,
        sets: '0',
        reps: '0',
      }));
      setWorkoutExercises(newWorkoutExercises);
    }, [selectedExercises]);
  
    const handleSave = () => {
      console.log(workoutExercises);
    };
    
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
      });
    };
  
    const showDatePicker = () => {
      showMode('date');
    };
  
    const handleSetsChange = (index: number, value: string) => {
      const newExercises = [...workoutExercises];
      newExercises[index].sets = value;
      setWorkoutExercises(newExercises);
    };
  
    const handleRepsChange = (index: number, value: string) => {
      const newExercises = [...workoutExercises];
      newExercises[index].reps = value;
      setWorkoutExercises(newExercises);
    };
  
    const handleDeletePress = (exercise: WorkoutExercise) => {
      const updatedExercises = workoutExercises.filter(e => e.ex_id !== exercise.ex_id);
      setWorkoutExercises(updatedExercises);
      setSelectedExercises(updatedExercises);
    };
  
    const styles = StyleSheet.create({
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
  
    return (
      <ThemedView style={{ flex: 1 }}>
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
            onFocus={showDatePicker}
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
        <WorkoutExercises
          workoutExercises={workoutExercises}
          handleSetsChange={handleSetsChange}
          handleRepsChange={handleRepsChange}
          handleDeletePress={handleDeletePress}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Link
            href={{
              pathname: '/(tabs)/workouts/select/[selectExercise]',
              params: { selectExercise: name }
            }}
            style={styles.link}
          >
            <Text>{t("addExercise")}</Text>
          </Link>
        </View>
        <Pressable onPress={handleSave}>
          <Text>Salva</Text>
        </Pressable>
      </ThemedView>
    );
  }
  