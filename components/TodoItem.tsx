import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export interface TodoItemProps {
  value: string;
  isEditing: boolean;
  editValue: string;
  isCompleted?: boolean;
  onChangeEdit: (text: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onMoveBack?: () => void;
}

export function TodoItem({
  value,
  isEditing,
  editValue,
  isCompleted = false,
  onChangeEdit,
  onEdit,
  onSave,
  onDelete,
  onComplete,
  onMoveBack,
}: TodoItemProps) {
  const inputBg = useThemeColor({}, "background");
  const inputText = useThemeColor({}, "text");
  const inputBorder = useThemeColor({}, "tint");

  return (
    <ThemedView style={styles.card}>
      <View style={styles.row}>
        {isEditing ? (
          <TextInput
            style={[
              styles.editInput,
              {
                backgroundColor: inputBg,
                color: inputText,
                borderColor: inputBorder,
              },
            ]}
            value={editValue}
            onChangeText={onChangeEdit}
            onSubmitEditing={onSave}
            autoFocus
            placeholderTextColor={inputText + "99"}
          />
        ) : (
          <ThemedText style={styles.text}>{value}</ThemedText>
        )}
        <View style={styles.actions}>
          {isEditing ? (
            <TouchableOpacity
              onPress={onSave}
              style={styles.iconBtn}
              accessibilityLabel="Save"
            >
              <Ionicons name="checkmark" size={22} color="#22c55e" />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                onPress={onEdit}
                style={styles.iconBtn}
                accessibilityLabel="Edit"
              >
                <Ionicons name="pencil" size={20} color="#007AFF" />
              </TouchableOpacity>
              {isCompleted ? (
                <TouchableOpacity
                  onPress={onMoveBack}
                  style={styles.iconBtn}
                  accessibilityLabel="Move back to todos"
                >
                  <Ionicons name="arrow-undo" size={22} color="#007AFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={onComplete}
                  style={styles.iconBtn}
                  accessibilityLabel="Complete"
                >
                  <Ionicons name="checkmark-done" size={22} color="#22c55e" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onDelete}
                style={styles.iconBtn}
                accessibilityLabel="Delete"
              >
                <Ionicons name="trash" size={20} color="#d11a2a" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center" },
  text: { flex: 1, fontSize: 18 },
  editInput: {
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 8,
    padding: 6,
    marginRight: 8,
  },
  actions: { flexDirection: "row", gap: 8 },
  iconBtn: { marginLeft: 4, padding: 4 },
});
