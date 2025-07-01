import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../components/ThemedText";
import { ThemedTextInput } from "../../components/ThemedTextInput";
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

export default function TodosScreen() {
  const dbService = useDatabaseService();
  // State for the list of todos
  const [todos, setTodos] = useState<Todo[]>([]);
  // State for the input field
  const [input, setInput] = useState("");
  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch todos from the database
  const refreshTodos = async () => {
    setLoading(true);
    if (!dbService.database) {
      setLoading(false);
      return;
    }
    try {
      const data = await todoService.getTodos(dbService.database);
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      setTodos([]);
    }
    setLoading(false);
  };

  // Add a new todo
  const addTodo = async () => {
    if (input.trim() && dbService.database) {
      await todoService.addTodo(dbService.database, input.trim());
      setInput("");
      await refreshTodos();
    }
  };

  // Mark a todo as completed
  const completeTodo = async (id: string) => {
    if (!id || !dbService.database) return;
    await todoService.updateTodo(dbService.database, id, { completed: true });
    await refreshTodos();
  };

  // Start editing a todo
  const startEdit = (id: string, value: string) => {
    setEditingId(id);
    setEditValue(value);
  };

  // Save the edited todo
  const saveEdit = async (id: string) => {
    if (editValue.trim() && dbService.database) {
      await todoService.updateTodo(dbService.database, id, { text: editValue.trim() });
      setEditingId(null);
      setEditValue("");
      await refreshTodos();
    }
  };

  // Delete a todo
  const removeTodo = async (id: string) => {
    if (!dbService.database) return;
    await todoService.deleteTodo(dbService.database, id);
    await refreshTodos();
  };

  // Load todos when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (dbService.database) {
        refreshTodos();
      }
    }, [dbService.database])
  );

  return (
    <ThemedView style={styles.container}>
      {/* Input row for adding todos */}
      <View style={styles.inputRow}>
        <ThemedTextInput
          style={styles.input}
          placeholder="Add a todo..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTodo}>
          <Ionicons name="add-circle" size={32} color="#0a7ea4" />
        </TouchableOpacity>
      </View>
      {/* List of todos */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            key={item.id}
            value={item.text}
            isEditing={editingId === item.id}
            editValue={editValue}
            onChangeEdit={setEditValue}
            onEdit={() => startEdit(item.id, item.text)}
            onSave={() => saveEdit(item.id)}
            onDelete={() => removeTodo(item.id)}
            onComplete={() => completeTodo(item.id)}
          />
        )}
        ListEmptyComponent={
          <ThemedText style={styles.empty}>No todos yet!</ThemedText>
        }
        refreshing={loading}
        onRefresh={refreshTodos}
      />
    </ThemedView>
  );
}

// ---
// EXPLANATION:
// 1. We use useState to manage todos, input, and editing state.
// 2. We use async/await to call the todoService, which now talks to Couchbase Lite.
// 3. useFocusEffect ensures the list is refreshed when the screen is focused.
// 4. FlatList renders each todo using the TodoItem component, passing handlers for edit, delete, and complete.
// 5. All actions (add, edit, delete, complete) update the database and then refresh the UI.
// 6. We use IDs for todos, not array indices, since the database uses document IDs.

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  inputRow: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  addBtn: { justifyContent: "center", alignItems: "center" },
  empty: { color: "#888", textAlign: "center", marginTop: 32 },
});
