import { useSQLiteContext } from 'expo-sqlite';
import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { getExercisesByMuscleGroup } from '@/services/database';
import { Exercise } from '@/interfaces/Exercise';
import ExerciseList from './ExerciseList';
import { Collapsible } from '@/components/exercises/Collapsible';

interface MuscleGroupListProps {
  locale: string;
}

interface MuscleGroup {
    name: string;
    id: number;
}

const MuscleGroupList: React.FC<MuscleGroupListProps> = ({ locale }) => {
  const [muscleGroups, setMuscleGroups] = useState([] as MuscleGroup[]);
  const [exercises, setExercises] = useState<{ [key: number]: Exercise[] }>({});
  const db = useSQLiteContext();

  useEffect(() => {
    async function getMuscleGroups() {
        const query = await db.prepareAsync(
        'SELECT muscle_group_id AS id, muscle_translation AS name FROM muscle_group_translations WHERE locale = $locale');
        try {
            const result = await query.executeAsync({ $locale: locale });
            const rows = await result.getAllAsync() as MuscleGroup[];
            setMuscleGroups(rows);

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

  return (
    <View>
      <FlatList
        data={muscleGroups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <Collapsible title={item.name}  >
                <ExerciseList exercises={exercises[item.id] || []} />
            </Collapsible>
        )}
      />
    </View>
  );
};

export default MuscleGroupList;