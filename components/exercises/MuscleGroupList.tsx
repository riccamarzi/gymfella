import React, { useState, useEffect } from 'react';
import { View, FlatList, Pressable, Text, StyleSheet } from 'react-native';
import { getExercisesByMuscleGroup } from '@/services/database';
import { db } from '@/database/drizzle-index';
import { eq } from 'drizzle-orm';
import { muscleGroupTable, muscleGroupTranslationsTable } from '@/database/schema';
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
    id: string; // WatermelonDB usa string per gli ID
}

const MuscleGroupList: React.FC<MuscleGroupListProps> = ({ locale, showCheckbox = false, onExerciseSelection }) => {
  const [muscleGroups, setMuscleGroups] = useState([] as MuscleGroup[]);
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | null>(null);
  const [exercises, setExercises] = useState<{ [key: string]: Exercise[] }>({});
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
        // Ottieni i gruppi muscolari con traduzioni da Drizzle
        const muscleGroupTranslations = await db
          .select({
            id: muscleGroupTable.id,
            name: muscleGroupTranslationsTable.muscle_translation
          })
          .from(muscleGroupTable)
          .innerJoin(
            muscleGroupTranslationsTable,
            eq(muscleGroupTable.id, muscleGroupTranslationsTable.muscle_group_id)
          )
          .where(eq(muscleGroupTranslationsTable.locale, locale));
        
        const groups: MuscleGroup[] = muscleGroupTranslations.map(translation => ({
          id: translation.id,
          name: translation.name
        }));
        
        setMuscleGroups(groups);
        if (groups.length > 0) {
          setSelectedGroup(groups[0]);
        }

        // Ottieni gli esercizi per ogni gruppo
        const exercisesPromises = groups.map(async (group) => {
          const exercises = await getExercisesByMuscleGroup(locale, group.id);
          return {
            groupId: group.id,
            exercises: exercises
          };
        });

        const exercisesResults = await Promise.all(exercisesPromises);
        const exercisesMap = exercisesResults.reduce((acc: { [key: string]: Exercise[] }, { groupId, exercises }) => {
            acc[groupId] = exercises;
            return acc;
        }, {});

        setExercises(exercisesMap);
    }
    getMuscleGroups();
  }, [locale]);

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