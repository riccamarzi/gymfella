import useTranslations from "@/hooks/useTranslations";
import { WorkoutExercise } from "@/interfaces/WorkoutExercise";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

interface WorkoutExercisesProps {
    selectedExercises: WorkoutExercise[];
    handleSetsChange: (index: number, text: string) => void;
    handleRepsChange: (index: number, text: string) => void;
}

export default function WorkoutExercises({ selectedExercises, handleSetsChange, handleRepsChange }: WorkoutExercisesProps) {
    const { t } = useTranslations();

    return (
        <View>
            {selectedExercises.length > 0 && (
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableCell}>{t('exerciseName')}</Text>
                        <Text style={styles.tableCell}>{t('sets')}</Text>
                        <Text style={styles.tableCell}>{t('reps')}</Text>
                    </View>
                    {selectedExercises.map((exercise, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{exercise.exercise_name}</Text>
                            <TextInput
                                style={styles.tableInput}
                                value={exercise.sets}
                                onChangeText={(text) => handleSetsChange(index, text)}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.tableInput}
                                value={exercise.reps}
                                onChangeText={(text) => handleRepsChange(index, text)}
                                keyboardType="numeric"
                            />
                        </View>
                    ))}
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    table: {
        marginTop: 16,
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
        flex: 1,
        color: '#333',
        textAlign: 'center',
    },
    tableInput: {
        flex: 1,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    }
});