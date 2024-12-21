import React, { createContext, useState, useContext } from 'react';

interface Exercise {
  ex_id: number;
  exercise_name: string;
}

interface SelectedExercisesContextProps {
  selectedExercises: Exercise[];
  setSelectedExercises: (exercises: Exercise[]) => void;
}

const SelectedExercisesContext = createContext<SelectedExercisesContextProps | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const SelectedExercisesProvider: React.FC<Props> = ({ children }) => {
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  return (
    <SelectedExercisesContext.Provider value={{ selectedExercises, setSelectedExercises }}>
      {children}
    </SelectedExercisesContext.Provider>
  );
};

export const useSelectedExercises = () => {
  const context = useContext(SelectedExercisesContext);
  if (!context) {
    throw new Error('useSelectedExercises must be used within a SelectedExercisesProvider');
  }
  return context;
};