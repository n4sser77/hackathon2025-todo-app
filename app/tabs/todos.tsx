import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedTextInput } from '../../components/ThemedTextInput';
import { ThemedView } from '../../components/ThemedView';
import { TodoItem } from '../../components/TodoItem';
import { addTodo as addTodoService, completeTodo as completeTodoService, deleteTodo, getTodos, updateTodo } from '../Services/todoService';

export default function TodosScreen() {
  const [todos, setTodos] = useState<string[]>(getTodos());
  const [input, setInput] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const refreshTodos = () => setTodos([...getTodos()]);

  const addTodo = () => {
    if (input.trim()) {
      addTodoService(input.trim());
      setInput('');
      refreshTodos();
    }
  };

  const completeTodo = (index: number) => {
    completeTodoService(index);
    refreshTodos();
  };

  const startEdit = (index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  const saveEdit = (index: number) => {
    if (editValue.trim()) {
      updateTodo(index, editValue.trim());
      setEditingIndex(null);
      setEditValue('');
      refreshTodos();
    }
  };

  const removeTodo = (index: number) => {
    deleteTodo(index);
    refreshTodos();
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshTodos();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      {/* Removed ThemedText title, now handled by header */}
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
      <FlatList
        data={todos}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item, index }) => (
          <TodoItem
            value={item}
            isEditing={editingIndex === index}
            editValue={editValue}
            onChangeEdit={setEditValue}
            onEdit={() => startEdit(index, item)}
            onSave={() => saveEdit(index)}
            onDelete={() => removeTodo(index)}
            onComplete={() => completeTodo(index)}
          />
        )
        }
        ListEmptyComponent={<ThemedText style={styles.empty}>No todos yet!</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  inputRow: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8 },
  addBtn: { justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#888', textAlign: 'center', marginTop: 32 },
});
