import React, { useEffect } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Exercise } from '@/interfaces/Exercise';
import { Checkbox, List, useTheme } from 'react-native-paper';
import { useSelectedExercises } from '@/providers/selectedExercisesProvider';

interface ExerciseListProps {
  exercises: Exercise[];
  showCheckbox?: boolean;
  onExerciseSelection?: (exercise: Exercise) => void;
}

const ExerciseList = ({ exercises, showCheckbox = false, onExerciseSelection }: ExerciseListProps & { onHeightChange?: (height: number) => void }) => {  
  const theme = useTheme(); 
  const [checkedItems, setCheckedItems] = React.useState<{ [key: number]: boolean }>({});
  const { selectedExercises, setSelectedExercises } = useSelectedExercises() as { selectedExercises: Exercise[], setSelectedExercises: React.Dispatch<React.SetStateAction<Exercise[]>> };

  useEffect(() => {
    if (selectedExercises.length > 0) {
      const initialCheckedItems = selectedExercises.reduce<{ [key: number]: boolean }>((acc, exercise) => {
        acc[exercise.ex_id] = selectedExercises.some(e => e.ex_id === exercise.ex_id);
        return acc;
      }, {});
      setCheckedItems(initialCheckedItems);
    }
  }, [selectedExercises]);


  const handleExercisePress = (exercise: Exercise) => {
    if (!showCheckbox)
      return;
    setCheckedItems(prev => ({...prev, [exercise.ex_id]: !checkedItems[exercise.ex_id]}));
    if (onExerciseSelection)
      onExerciseSelection(exercise);
  };

  return (
    <View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.ex_id.toString()}
        horizontal={false}
        renderItem={({ item }) => (
          <Pressable style={{flexDirection: 'row', backgroundColor: theme.colors.secondaryContainer}} onPress={() => handleExercisePress(item)}>
            <ThemedText
                type='default'
                style={{paddingLeft: 40, paddingTop: 10, paddingBottom: 10, flex: 1}}
            >{item.exercise_name}</ThemedText>
            {showCheckbox && (
              <Checkbox status={checkedItems[item.ex_id] ? 'checked' : 'unchecked'} />
            )}
            
          </Pressable>
        )}
      />
    </View>
  );
};

export default ExerciseList;