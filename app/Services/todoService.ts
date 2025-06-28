// Simple in-memory todo persistence service
// Usage: import { getTodos, addTodo, completeTodo, getCompleted } from './Services/todoService';

let todos: string[] = [];
let completed: string[] = [];

export function getTodos() {
  return todos;
}

export function addTodo(todo: string) {
  todos.push(todo);
}

export function completeTodo(index: number) {
  const todo = todos[index];
  if (todo !== undefined) {
    completed.push(todo);
    todos.splice(index, 1);
  }
}

export function getCompleted() {
  return completed;
}

export function clearAll() {
  todos = [];
  completed = [];
}

export function updateTodo(index: number, newValue: string) {
  if (todos[index] !== undefined) {
    todos[index] = newValue;
  }
}

export function deleteTodo(index: number) {
  if (todos[index] !== undefined) {
    todos.splice(index, 1);
  }
}

export function updateCompleted(index: number, newValue: string) {
  if (completed[index] !== undefined) {
    completed[index] = newValue;
  }
}

export function deleteCompleted(index: number) {
  if (completed[index] !== undefined) {
    completed.splice(index, 1);
  }
}

export function moveBackToTodos(index: number) {
  const todo = completed[index];
  if (todo !== undefined) {
    todos.push(todo);
    completed.splice(index, 1);
  }
}
