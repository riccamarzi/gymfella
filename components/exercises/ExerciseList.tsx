import React from 'react';
import { View, FlatList, Pressable, GestureResponderEvent } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Exercise } from '@/interfaces/Exercise';
import { ThemedView } from '../ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Checkbox, useTheme } from 'react-native-paper';

interface ExerciseListProps {
  exercises: Exercise[];
  showCheckbox?: boolean;
}

const ExerciseList = ({ exercises, showCheckbox = false, onHeightChange }: ExerciseListProps & { onHeightChange?: (height: number) => void }) => {  
  const theme = useTheme(); 
  const [checked, setChecked] = React.useState('unchecked' as 'checked' | 'unchecked');

  const handleExercisePress = () => {
    setChecked(checked === 'checked' ? 'unchecked' : 'checked');
  };

  return (
    <View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.ex_id.toString()}
        renderItem={({ item }) => (
          <Pressable style={{flexDirection: 'row', backgroundColor: theme.colors.secondaryContainer}} onPress={() => handleExercisePress()}>
            <ThemedText
                type='default'
                style={{paddingLeft: 40, paddingTop: 10, paddingBottom: 10, flex: 1}}
            >{item.exercise_name}</ThemedText>
            {showCheckbox && (
              <Checkbox status={checked} />
            )}
            
          </Pressable>
        )}
        onContentSizeChange={(width, height) => {
            console.log("Content size changed:", width, height); // Log per debug
            if (onHeightChange) onHeightChange(height);
        }}
      />
    </View>
  );
};

export default ExerciseList;