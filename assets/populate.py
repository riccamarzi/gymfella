import sqlite3

# Connessione al database SQLite
conn = sqlite3.connect('C:\\Users\\ricca\\Documents\\GymFella\\gymfella\\assets\\gymApp.db')
cursor = conn.cursor()

# Creazione delle tabelle
cursor.execute('''
CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    muscle_group_id INTEGER,
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS muscle_groups (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS exercise_translations (
    exercise_id INTEGER NOT NULL,
    locale TEXT NOT NULL,
    ex_translation TEXT NOT NULL,
    PRIMARY KEY (exercise_id, locale),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id),
    FOREIGN KEY (locale) REFERENCES locales(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS muscle_group_translations (
    muscle_group_id INTEGER NOT NULL,
    locale TEXT NOT NULL,
    muscle_translation TEXT NOT NULL,
    PRIMARY KEY (muscle_group_id, locale),
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id),
    FOREIGN KEY (locale) REFERENCES locales(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS locales (
    id TEXT NOT NULL PRIMARY KEY
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    start DATE NOT NULL,
    duration INTEGER NOT NULL,
    name TEXT NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS workout_exercises (
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    PRIMARY KEY (workout_id, exercise_id),
    FOREIGN KEY (workout_id) REFERENCES workouts(id),
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS exercise_progress (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    exercise_id INTEGER NOT NULL,
    weight FLOAT(3,2) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
)
''')

# Inserimento dei dati nella tabella exercises senza specificare l'ID
exercises = [
    (1,),
    (2,),
    (2,),
    (3,),
    (6,),
    (5,),
    (4,)
]

cursor.executemany('''
INSERT INTO exercises (muscle_group_id) VALUES (?)
''', exercises)

# Inserimento dei dati nella tabella muscle_groups
muscle_groups = [
    (1,), # Chest
    (2,), # Legs
    (3,), # Biceps
    (4,), # Triceps
    (5,), # Shoulders
    (6,), # Back
    (7,)  # Abs
]

cursor.executemany('''
INSERT INTO muscle_groups (id) VALUES (?)
''', muscle_groups)

# Inserimento dei dati nella tabella locales
locales = [
    ('en',),
    ('it',)
]

cursor.executemany('''
INSERT INTO locales (id) VALUES (?)
''', locales)

# Inserimento dei dati nella tabella exercise_translations
exercise_translations = [
    (1, 'en', 'Push-up'),
    (1, 'it', 'Piegamenti'),
    (2, 'en', 'Squat'),
    (2, 'it', 'Squat'),
    (3, 'en', 'Lunge'),
    (3, 'it', 'Affondi'),
    (4, 'en', 'Biceps curl'),
    (4, 'it', 'Curl bicipiti'),
    (5, 'en', 'Pull up'),
    (5, 'it', 'Trazioni'),
    (6, 'en', 'Shoulder press'),
    (6, 'it', 'Alzate laterali'),
    (7, 'en', 'Rope push-down'),
    (7, 'it', 'Push-down corda')
]

cursor.executemany('''
INSERT INTO exercise_translations (exercise_id, locale, ex_translation) VALUES (?, ?, ?)
''', exercise_translations)

# Inserimento dei dati nella tabella muscle_group_translations
muscle_group_translations = [
    (1, 'en', 'Chest'),
    (1, 'it', 'Petto'),
    (2, 'en', 'Legs'),
    (2, 'it', 'Gambe'),
    (3, 'en', 'Biceps'),
    (3, 'it', 'Bicipiti'),
    (4, 'en', 'Triceps'),
    (4, 'it', 'Tricipiti'),
    (5, 'en', 'Shoulders'),
    (5, 'it', 'Spalle'),
    (6, 'en', 'Back'),
    (6, 'it', 'Schiena'),
    (7, 'en', 'Abs'),
    (7, 'it', 'Addominali')
]

cursor.executemany('''
INSERT INTO muscle_group_translations (muscle_group_id, locale, muscle_translation) VALUES (?, ?, ?)
''', muscle_group_translations)

# Verifica delle tabelle create
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tabelle create:", tables)

# Verifica dei dati inseriti
cursor.execute("SELECT * FROM exercises;")
exercises = cursor.fetchall()
print("Dati nella tabella exercises:", exercises)

cursor.execute("SELECT * FROM muscle_groups;")
muscle_groups = cursor.fetchall()
print("Dati nella tabella muscle_groups:", muscle_groups)

cursor.execute("SELECT * FROM exercise_translations;")
exercise_translations = cursor.fetchall()
print("Dati nella tabella exercise_translations:", exercise_translations)

cursor.execute("SELECT * FROM muscle_group_translations;")
muscle_group_translations = cursor.fetchall()
print("Dati nella tabella muscle_group_translations:", muscle_group_translations)

cursor.execute("SELECT * FROM locales;")
locales = cursor.fetchall()
print("Dati nella tabella locales:", locales)

# Conferma delle modifiche e chiusura della connessione
conn.commit()
conn.close()

print("Database popolato con successo.")