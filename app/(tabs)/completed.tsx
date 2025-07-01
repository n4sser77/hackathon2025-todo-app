import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import { TodoItem } from "../../components/TodoItem";
import { useDatabaseService } from "../Services/DatabaseProvider";
import * as todoService from "../Services/todoService.cbl";

// The todo type for this UI
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function CompletedScreen() {
  const dbService = useDatabaseService();
  // State for the list of completed todos
  const [completed, setCompleted] = useState<Todo[]>([]);
  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch completed todos from the database
  const refreshCompleted = async () => {
    setLoading(true);
    if (!dbService.database) return;
    const data = await todoService.getCompleted(dbService.database);
    setCompleted(data);
    setLoading(false);
  };

  // Start editing a completed todo
  const startEdit = (id: string, value: string) => {
    setEditingId(id);
    setEditValue(value);
  };

  // Save the edited completed todo
  const saveEdit = async (id: string) => {
    if (editValue.trim() && dbService.database) {
      await todoService.updateCompleted(
        dbService.database,
        id,
        editValue.trim()
      );
      setEditingId(null);
      setEditValue("");
      await refreshCompleted();
    }
  };

  // Delete a completed todo
  const removeCompleted = async (id: string) => {
    if (!dbService.database) return;
    await todoService.deleteCompleted(dbService.database, id);
    await refreshCompleted();
  };

  // Move a completed todo back to active todos
  const moveBack = async (id: string) => {
    if (!dbService.database) return;
    await todoService.moveBackToTodos(dbService.database, id);
    await refreshCompleted();
  };

  // Load completed todos when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refreshCompleted();
    }, [dbService.database])
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={completed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            value={item.text}
            isEditing={editingId === item.id}
            editValue={editValue}
            isCompleted={true}
            onChangeEdit={setEditValue}
            onEdit={() => startEdit(item.id, item.text)}
            onSave={() => saveEdit(item.id)}
            onDelete={() => removeCompleted(item.id)}
            onComplete={() => {}}
            onMoveBack={() => moveBack(item.id)}
          />
        )}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>No completed todos yet!</ThemedText>
        }
        refreshing={loading}
        onRefresh={refreshCompleted}
      />
    </ThemedView>
  );
}

// ---
// EXPLANATION:
// 1. useState manages completed todos, editing state, and loading.
// 2. refreshCompleted loads completed todos from the database.
// 3. All handlers (edit, delete, move back) are async and update the database, then refresh the UI.
// 4. useFocusEffect ensures the list is refreshed when the screen is focused.
// 5. FlatList renders each completed todo using TodoItem, passing handlers and editing state.
// 6. We use IDs for todos, not array indices, since the database uses document IDs.

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { marginBottom: 16 },
  empty: { color: "#888", textAlign: "center", marginTop: 32 },
});
