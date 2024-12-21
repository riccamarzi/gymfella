import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect } from 'react';
import { View, FlatList, Pressable, Text, StyleSheet } from 'react-native';
import { getExercisesByMuscleGroup } from '@/services/database';
import { Exercise } from '@/interfaces/Exercise';
import ExerciseList from './ExerciseList';
import { Collapsible } from '@/components/exercises/Collapsible';
import { List, useTheme } from 'react-native-paper';

interface MuscleGroupListProps {
  locale: string;
  showCheckbox?: boolean;
  onExerciseSelection?: (exercise: Exercise) => void;
}

interface MuscleGroup {
    name: string;
    id: number;
}

const MuscleGroupList: React.FC<MuscleGroupListProps> = ({ locale, showCheckbox = false, onExerciseSelection }) => {
  const [muscleGroups, setMuscleGroups] = useState([] as MuscleGroup[]);
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
  const [exercises, setExercises] = useState<{ [key: number]: Exercise[] }>({});
  const db = useSQLiteContext();
  const theme = useTheme();

  const styles = StyleSheet.create({
    muscleGroupList: {
      paddingBottom: 5,
    },
    muscleGroupItem: {
      padding: 16,
      borderRadius: 0,
      borderLeftColor: theme.colors.surface,
      borderLeftWidth: 1,

      backgroundColor: theme.colors.secondaryContainer,
    },
    selectedMuscleGroupItem: {
      backgroundColor: theme.colors.primaryContainer,
    },
    muscleGroupText: {
      color: theme.colors.secondary,
    },
  })

  useEffect(() => {
    async function getMuscleGroups() {
        const query = await db.prepareAsync(
        'SELECT muscle_group_id AS id, muscle_translation AS name FROM muscle_group_translations WHERE locale = $locale');
        try {
            const result = await query.executeAsync({ $locale: locale });
            const rows = await result.getAllAsync() as MuscleGroup[];
            setMuscleGroups(rows);
            setSelectedGroup(rows[0]);

            const exercisesPromises = rows.map((group) =>
                getExercisesByMuscleGroup(locale, db, group.id).then((rows) => ({
                    groupId: group.id,
                    exercises: rows
                }))
            );

            const exercisesResults = await Promise.all(exercisesPromises);
            const exercisesMap = exercisesResults.reduce((acc: { [key: number]: Exercise[] }, { groupId, exercises }) => {
                acc[groupId] = exercises;
                return acc;
            }, {});

            setExercises(exercisesMap);
        } finally {
            await query.finalizeAsync();
        }
    }
    getMuscleGroups();
  }, [locale, db]);

  const handleExercisePress = (item: MuscleGroup) => {
    setSelectedGroup(item);
  }

  return (
    <View>
      <FlatList
        data={muscleGroups}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        renderItem={({ item }) => (
          <Pressable style={[styles.muscleGroupItem, selectedGroup?.id === item.id && styles.selectedMuscleGroupItem]} onPress={() => handleExercisePress(item)}>
            <Text style={[styles.muscleGroupText]}>{item.name}</Text>
          </Pressable>
        )}
        style={{...styles.muscleGroupList}}
        // renderItem={({ item }) => (
        //     <Collapsible title={item.name}  >
        //         <ExerciseList exercises={exercises[item.id] || []} showCheckbox={showCheckbox} onExerciseSelection={onExerciseSelection} />
        //     </Collapsible>
        // )}

      />
      {/* {muscleGroups.map((group) => (
        <List.Accordion title={group.name} key={group.id}>
          <ExerciseList exercises={exercises[group.id] || []} showCheckbox={showCheckbox} onExerciseSelection={onExerciseSelection} />
        </List.Accordion>
      ))} */}
      {selectedGroup && (
        <ExerciseList exercises={exercises[selectedGroup.id] || []} showCheckbox={showCheckbox} onExerciseSelection={onExerciseSelection} />
      )}

    </View>
  );
};



export default MuscleGroupList;