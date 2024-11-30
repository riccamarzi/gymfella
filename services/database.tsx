import { Exercise } from "@/interfaces/Exercise";
import { SQLiteDatabase } from "expo-sqlite";

export const getExercisesByMuscleGroup = async (locale: string, db: SQLiteDatabase, group_id: number) => {
  const query = await db.prepareAsync("SELECT et.ex_translation AS exercise_name, et.exercise_id AS ex_id \
                  FROM exercise_translations et \
                  JOIN exercises e ON et.exercise_id = e.id \
                  JOIN muscle_groups mgt ON e.muscle_group_id = mgt.id \
                  WHERE et.locale = $locale AND mgt.id = $group_id");
  try {
    const result = await query.executeAsync({ $locale: locale, $group_id: group_id });
    const rows = await result.getAllAsync() as Exercise[];
    return rows;
  }
  finally {
    await query.finalizeAsync();
  }
}