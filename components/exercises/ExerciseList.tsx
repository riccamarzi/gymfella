import React from 'react';
import { View, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Exercise } from '@/interfaces/Exercise';
import { ThemedView } from '../ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface ExerciseListProps {
  exercises: Exercise[];
}

const ExerciseList = ({ exercises, onHeightChange }: ExerciseListProps & { onHeightChange?: (height: number) => void }) => {  
    const theme = useColorScheme() ?? 'dark'; 
  return (
    <View>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.ex_id.toString()}
        renderItem={({ item }) => (
          <ThemedView style={{backgroundColor: theme === "dark" ? Colors.dark.lighterBackground : Colors.light.darkerBackground}}>
            <ThemedText
                type='default'
                style={{paddingLeft: 40, paddingTop: 10, paddingBottom: 10}}
            >{item.exercise_name}</ThemedText>
          </ThemedView>
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