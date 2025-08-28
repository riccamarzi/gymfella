import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expoDb = openDatabaseSync('gymfella.db', { enableChangeListener: false });
export const db = drizzle(expoDb, { schema });

// Funzione per inizializzare il database con i dati esistenti
export const initializeDatabase = async () => {
  try {
    // Verifica se le tabelle esistono già (controllo se ci sono dati)
    const tables = await expoDb.getAllAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `) as Array<{ name: string }>;
    
    console.log('Existing tables:', tables);

    // Se non ci sono tabelle, crea le tabelle e popola con dati di base
    if (tables.length === 0) {
      console.log('Creating tables and populating with initial data...');
      await createInitialData();
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

const createInitialData = async () => {
  // Crea le tabelle manualmente per ora (in produzione useresti migrations)
  await expoDb.execAsync(`
    CREATE TABLE IF NOT EXISTS locales (
      id TEXT PRIMARY KEY
    );
    
    CREATE TABLE IF NOT EXISTS muscle_groups (
      id TEXT PRIMARY KEY
    );
    
    CREATE TABLE IF NOT EXISTS muscle_group_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      muscle_group_id TEXT NOT NULL REFERENCES muscle_groups(id),
      locale TEXT NOT NULL REFERENCES locales(id),
      muscle_translation TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      muscle_group_id TEXT NOT NULL REFERENCES muscle_groups(id)
    );
    
    CREATE TABLE IF NOT EXISTS exercise_translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id TEXT NOT NULL REFERENCES exercises(id),
      locale TEXT NOT NULL REFERENCES locales(id),
      ex_translation TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS workouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start TEXT NOT NULL,
      duration INTEGER NOT NULL,
      workout_name TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS workout_exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_id INTEGER NOT NULL REFERENCES workouts(id),
      exercise_id TEXT NOT NULL REFERENCES exercises(id),
      sets INTEGER NOT NULL,
      reps INTEGER NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS exercise_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id TEXT NOT NULL REFERENCES exercises(id),
      weight INTEGER NOT NULL,
      date INTEGER NOT NULL
    );
    
    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_muscle_group_locale ON muscle_group_translations(muscle_group_id, locale);
    CREATE INDEX IF NOT EXISTS idx_exercise_locale ON exercise_translations(exercise_id, locale);
    CREATE INDEX IF NOT EXISTS idx_workout_exercise ON workout_exercises(workout_id, exercise_id);
    CREATE INDEX IF NOT EXISTS idx_exercise_progress ON exercise_progress(exercise_id, date);
  `);
  
  // Popola con dati di base
  await expoDb.execAsync(`
    INSERT OR IGNORE INTO locales (id) VALUES 
    ('en'), ('it'), ('es'), ('fr'), ('de');
    
    INSERT OR IGNORE INTO muscle_groups (id) VALUES 
    ('chest'), ('back'), ('shoulders'), ('arms'), ('legs'), ('core');
    
    INSERT OR IGNORE INTO muscle_group_translations (muscle_group_id, locale, muscle_translation) VALUES
    ('chest', 'en', 'Chest'),
    ('chest', 'it', 'Petto'),
    ('back', 'en', 'Back'),
    ('back', 'it', 'Schiena'),
    ('shoulders', 'en', 'Shoulders'),
    ('shoulders', 'it', 'Spalle'),
    ('arms', 'en', 'Arms'),
    ('arms', 'it', 'Braccia'),
    ('legs', 'en', 'Legs'),
    ('legs', 'it', 'Gambe'),
    ('core', 'en', 'Core'),
    ('core', 'it', 'Addominali');
    
    INSERT OR IGNORE INTO exercises (id, muscle_group_id) VALUES
    ('pushup', 'chest'),
    ('squat', 'legs'),
    ('lunge', 'legs'),
    ('bicep_curl', 'arms'),
    ('pullup', 'back'),
    ('shoulder_press', 'shoulders'),
    ('rope_pushdown', 'arms');
    
    INSERT OR IGNORE INTO exercise_translations (exercise_id, locale, ex_translation) VALUES
    ('pushup', 'en', 'Push-up'),
    ('pushup', 'it', 'Piegamenti'),
    ('squat', 'en', 'Squat'),
    ('squat', 'it', 'Squat'),
    ('lunge', 'en', 'Lunge'),
    ('lunge', 'it', 'Affondi'),
    ('bicep_curl', 'en', 'Biceps curl'),
    ('bicep_curl', 'it', 'Curl bicipiti'),
    ('pullup', 'en', 'Pull up'),
    ('pullup', 'it', 'Trazioni'),
    ('shoulder_press', 'en', 'Shoulder press'),
    ('shoulder_press', 'it', 'Alzate laterali'),
    ('rope_pushdown', 'en', 'Rope push-down'),
    ('rope_pushdown', 'it', 'Push-down corda');
  `);
  
  console.log('Initial data created');
};

export default db;
