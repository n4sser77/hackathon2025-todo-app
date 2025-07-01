// Simple in-memory todo persistence service
// Usage: import { getTodos, addTodo, completeTodo, getCompleted } from './Services/todoService';
import { TodoRepository } from "@/repository/TodoRepository";
import "react-native-get-random-values"; // Ensure UUIDs work in React Native
import { v4 as uuidv4 } from "uuid";

// All functions are now async and use the Couchbase Lite repository



export async function getTodos() {
  return await TodoRepository.getInstance().getTodos();
}

export async function addTodo(text: string) {
  const id = uuidv4();
  await TodoRepository.getInstance().addTodo({ id, text, completed: false });
}

export async function completeTodo(id: string) {
  await TodoRepository.getInstance().updateTodo(id, { completed: true });
}

export async function getCompleted() {
  return await TodoRepository.getInstance().getCompleted();
}

export async function clearAll() {
  // Not implemented: would require iterating and deleting all todos and completed
}

export async function updateTodo(id: string, newValue: string) {
  await TodoRepository.getInstance().updateTodo(id, { text: newValue });
}

export async function deleteTodo(id: string) {
  await TodoRepository.getInstance().deleteTodo(id);
}

export async function updateCompleted(id: string, newValue: string) {
  await TodoRepository.getInstance().updateTodo(id, { text: newValue });
}

export async function deleteCompleted(id: string) {
  await TodoRepository.getInstance().deleteTodo(id);
}

export async function moveBackToTodos(id: string) {
  await TodoRepository.getInstance().updateTodo(id, { completed: false });
}
