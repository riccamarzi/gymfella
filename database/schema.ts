import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const localesTable = sqliteTable('locales', {
  id: text().primaryKey()
});

export const muscleGroupTable = sqliteTable('muscle_groups', {
  id: text().primaryKey(),
});

export const muscleGroupTranslationsTable = sqliteTable('muscle_group_translations', {
  id: int().primaryKey({ autoIncrement: true }),
  muscle_group_id: text().notNull().references(() => muscleGroupTable.id),
  locale: text().notNull().references(() => localesTable.id),
  muscle_translation: text().notNull(),
}, (t) => [
  index('idx_muscle_group_locale').on(t.muscle_group_id, t.locale)
]);

export const exerciseTable = sqliteTable('exercises', {
  id: text().primaryKey(),
  muscle_group_id: text().notNull().references(() => muscleGroupTable.id)
});

export const exerciseTranslationsTable = sqliteTable('exercise_translations', {
  id: int().primaryKey({ autoIncrement: true }),
  exercise_id: text().notNull().references(() => exerciseTable.id),
  locale: text().notNull().references(() => localesTable.id),
  ex_translation: text().notNull(),
}, (t) => [
  index('idx_exercise_locale').on(t.exercise_id, t.locale)
]);

export const workoutTable = sqliteTable('workouts', {
  id: int().primaryKey({ autoIncrement: true }),
  start: text().notNull(), // ISO string date
  duration: int().notNull(),
  workout_name: text().notNull(),
});

export const workoutExercisesTable = sqliteTable('workout_exercises', {
  id: int().primaryKey({ autoIncrement: true }),
  workout_id: int().notNull().references(() => workoutTable.id),
  exercise_id: text().notNull().references(() => exerciseTable.id),
  sets: int().notNull(),
  reps: int().notNull(),
}, (t) => [
  index('idx_workout_exercise').on(t.workout_id, t.exercise_id)
]);

export const exerciseProgressTable = sqliteTable('exercise_progress', {
  id: int().primaryKey({ autoIncrement: true }),
  exercise_id: text().notNull().references(() => exerciseTable.id),
  weight: int().notNull(),
  date: int().notNull(),
}, (t) => [
  index('idx_exercise_progress').on(t.exercise_id, t.date)
]);