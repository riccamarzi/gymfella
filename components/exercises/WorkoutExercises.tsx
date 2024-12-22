import useTranslations from "@/hooks/useTranslations";
import { WorkoutExercise } from "@/interfaces/WorkoutExercise";
import { View, StyleSheet } from "react-native";
import { DataTable, IconButton, TextInput } from "react-native-paper";

interface WorkoutExercisesProps {
    workoutExercises: WorkoutExercise[];
    handleSetsChange: (index: number, text: string) => void;
    handleRepsChange: (index: number, text: string) => void;
    handleDeletePress: (exercise: WorkoutExercise) => void;
}

export default function WorkoutExercises({ workoutExercises, handleSetsChange, handleRepsChange, handleDeletePress }: WorkoutExercisesProps) {
    const { t } = useTranslations();
  
    return (
      <View>
        {workoutExercises.length > 0 && (
          <DataTable style={styles.table}>
            <DataTable.Header>
              <DataTable.Title>{t('exercises')}</DataTable.Title>
              <DataTable.Title numeric>{t('sets')}</DataTable.Title>
              <DataTable.Title numeric>{t('reps')}</DataTable.Title>
              <DataTable.Title numeric>{t('tableAction')}</DataTable.Title>
            </DataTable.Header>
            {workoutExercises.map((exercise, index) => (
              <DataTable.Row key={exercise.ex_id}>
                <DataTable.Cell>{exercise.exercise_name}</DataTable.Cell>
                <DataTable.Cell style={styles.tableCell}>
                  <TextInput
                    value={exercise.sets}
                    style={styles.tableInput}
                    onChangeText={text => handleSetsChange(index, text)}
                  />
                </DataTable.Cell>
                <DataTable.Cell style={styles.tableCell}>
                  <TextInput
                    value={exercise.reps}
                    style={styles.tableInput}
                    underlineStyle={{ borderRadius: 40, borderColor: 'transparent' }}
                    onChangeText={text => handleRepsChange(index, text)}
                  />
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="delete"
                    mode={"contained"}
                    onPress={() => handleDeletePress(exercise)}
                    style={styles.tableButton}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        )}
      </View>
    );
  }

const styles = StyleSheet.create({
    table: {
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        backgroundColor: '#f0f0f0',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tableCell: {
        marginTop: 3,
        marginBottom: 3,
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
        height: 40,
    },
    tableInput: {
        padding: 0,
        textAlign: 'right',
        fontSize: 16,
        flexGrow: 0,
        height: 30
    },
    tableButton: {
        justifyContent: 'flex-end',
        margin: 0,
    }
});