import { Exercise } from "@/interfaces/Exercise";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function ExercisesScreen() {
    const db = useSQLiteContext();
    const [exercises, setExercises] = useState([] as Exercise[]);
    useEffect(() => {
        async function getExercises() {
            const result = await db.getAllAsync<Exercise[]>('SELECT * FROM exercises');
            setExercises(result.flat());
            
        }
        getExercises();
    }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        {exercises.map((exercise) => (
            <Text 
                key={exercise.id}
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "red"
                  }}
                >{exercise.name}</Text>
        ))}
    </View>
  );
}