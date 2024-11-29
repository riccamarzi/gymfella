import * as SQLite from 'expo-sqlite';

export const openDatabase = async () => {
  console.log('Opening database');
  return await SQLite.openDatabaseAsync('gymApp.db');
};

export const createTables = async () => {
  const db = await openDatabase();
  console.log('Creating tables');
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        type TEXT
      );`,
      [],
      () => console.log('Table created successfully'),
      (_, error) => console.log('Error creating table:', error)
    );
  });
  console.log('Tables created');
};

export const insertExercise = async (name, description, type) => {
  const db = await openDatabase();
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO exercises (name, description, type) VALUES (?, ?, ?);`,
      [name, description, type]
    );
  });
};

export const getExercises = async (callback) => {
  const db = await openDatabase();
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM exercises;`,
      [],
      (_, { rows: { _array } }) => {
        callback(_array);
      }
    );
  });
};
