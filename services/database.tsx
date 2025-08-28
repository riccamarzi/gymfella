import { WorkoutExercise } from "@/interfaces/WorkoutExercise";
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { eq, and, desc } from 'drizzle-orm';
import { 
  exerciseTable, 
  exerciseTranslationsTable, 
  muscleGroupTranslationsTable,
  workoutTable,
  workoutExercisesTable 
} from '@/database/schema';

// Inizializza il database
const expoDb = openDatabaseSync('gymfella.db', { enableChangeListener: false });
const db = drizzle(expoDb);

export const getExercisesByMuscleGroup = async (locale: string, group_id: string) => {
  const result = await db
    .select({
      ex_id: exerciseTable.id,
      exercise_name: exerciseTranslationsTable.ex_translation,
    })
    .from(exerciseTable)
    .innerJoin(
      exerciseTranslationsTable,
      eq(exerciseTable.id, exerciseTranslationsTable.exercise_id)
    )
    .where(
      and(
        eq(exerciseTable.muscle_group_id, group_id),
        eq(exerciseTranslationsTable.locale, locale)
      )
    );

  return result;
}

export const addNewWorkout = async (name: string, start: Date, duration: string) => {
  const result = await db
    .insert(workoutTable)
    .values({
      workout_name: name,
      start: start.toISOString(),
      duration: parseInt(duration),
    })
    .returning({ id: workoutTable.id });

  return result[0].id;
}

export const getLastWorkout = async () => {
  const result = await db
    .select({ id: workoutTable.id })
    .from(workoutTable)
    .orderBy(desc(workoutTable.id))
    .limit(1);
  
  return result.length > 0 ? result : [{ id: 0 }];
}

export const addWorkoutExercise = async (workout_id: string, workoutExercise: WorkoutExercise) => {
  console.log('Adding workout exercise:', workoutExercise);
  console.log('Workout ID:', workout_id);

  await db
    .insert(workoutExercisesTable)
    .values({
      workout_id: parseInt(workout_id),
      exercise_id: workoutExercise.ex_id,
      sets: parseInt(workoutExercise.sets),
      reps: parseInt(workoutExercise.reps),
    })
    .returning();
}

export const getExFromWorkoutID = async (workout_id: string, locale: string) => {
  const result = await db
    .select({
      workout_id: workoutTable.id,
      start: workoutTable.start,
      duration: workoutTable.duration,
      workout_name: workoutTable.workout_name,
      exercise_id: exerciseTable.id,
      exercise_name: exerciseTranslationsTable.ex_translation,
    })
    .from(workoutTable)
    .innerJoin(workoutExercisesTable, eq(workoutTable.id, workoutExercisesTable.workout_id))
    .innerJoin(exerciseTable, eq(workoutExercisesTable.exercise_id, exerciseTable.id))
    .leftJoin(
      exerciseTranslationsTable,
      and(
        eq(exerciseTable.id, exerciseTranslationsTable.exercise_id),
        eq(exerciseTranslationsTable.locale, locale)
      )
    )
    .where(eq(workoutTable.id, parseInt(workout_id)));

  return result.map(row => ({
    ...row,
    start: new Date(row.start),
  }));
}