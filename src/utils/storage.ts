import type { Todo } from "../types/Todo";

export const getSavedTodos = (): Todo[] => {
  const savedTodos = localStorage.getItem("todos");

  if (!savedTodos) return [];

  try {
    return JSON.parse(savedTodos);
  } catch {
    return [];
  }
};

export const saveTodos = (todos: Todo[]) => {
  localStorage.setItem("todos", JSON.stringify(todos));
};