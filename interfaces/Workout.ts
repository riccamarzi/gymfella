import { WorkoutExercise } from "./WorkoutExercise";

export interface Workout {
    id: string; // WatermelonDB usa ID come stringhe
    name: string;
    date: string;
}

export interface WorkoutDetail {
    id: string; // WatermelonDB usa ID come stringhe
    name: string;
    date: string;
    duration: string;
    exercises: WorkoutExercise[];
}