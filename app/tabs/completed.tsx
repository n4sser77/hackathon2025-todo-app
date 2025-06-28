import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { TodoItem } from "../../components/TodoItem";
import { deleteCompleted, getCompleted, moveBackToTodos, updateCompleted } from "../Services/todoService";

export default function CompletedScreen() {
  const [completed, setCompleted] = useState<string[]>(getCompleted());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Refresh completed todos when screen is focused (optional improvement)
  useEffect(() => {
    const interval = setInterval(() => {
      setCompleted([...getCompleted()]);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const refreshCompleted = () => setCompleted([...getCompleted()]);

  const startEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const saveEdit = (index: number) => {
    if (editValue.trim()) {
      updateCompleted(index, editValue.trim());
      setEditingIndex(null);
      setEditValue("");
      refreshCompleted();
    }
  };

  const removeCompleted = (index: number) => {
    deleteCompleted(index);
    refreshCompleted();
  };

  return (
    <ThemedView style={styles.container}>
    
      <FlatList
        data={completed}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <TodoItem
            value={item}
            isEditing={editingIndex === index}
            editValue={editValue}
            isCompleted={true}
            onChangeEdit={setEditValue}
            onEdit={() => startEdit(index, item)}
            onSave={() => saveEdit(index)}
            onDelete={() => removeCompleted(index)}
            onComplete={() => {}}
            onMoveBack={() => moveBackToTodos(index)}
          />
        )}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>
            No completed todos yet!
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { marginBottom: 16 },
  empty: { color: "#888", textAlign: "center", marginTop: 32 },
});
