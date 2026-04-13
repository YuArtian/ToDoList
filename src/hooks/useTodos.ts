import { useState, useEffect, useCallback } from "react";
import type { Todo } from "../types";
import {
  fetchTodos,
  createTodo,
  updateTodoTitle,
  updateTodoNotes,
  toggleTodo,
  deleteTodo,
  reorderTodos,
} from "../lib/commands";

export function useTodos(refreshKey: number) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const load = useCallback(async () => {
    const data = await fetchTodos();
    const sorted = [...data].sort((a, b) => a.completed - b.completed);
    setTodos(sorted);
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const addTodo = async (title: string) => {
    await createTodo(title);
    await load();
  };

  const editTodo = async (id: number, title: string) => {
    await updateTodoTitle(id, title);
    await load();
  };

  const editNotes = async (id: number, notes: string) => {
    console.log("[useTodos] editNotes -> updateTodoNotes", { id, notes });
    await updateTodoNotes(id, notes);
    console.log("[useTodos] updateTodoNotes done, reloading");
    await load();
    console.log("[useTodos] load done");
  };

  const toggle = async (id: number, completed: number) => {
    await toggleTodo(id, completed);
    await load();
  };

  const removeTodo = async (id: number) => {
    await deleteTodo(id);
    await load();
  };

  const reorder = async (ids: number[]) => {
    await reorderTodos(ids);
    await load();
  };

  const completedCount = todos.filter((t) => t.completed === 1).length;

  return {
    todos,
    addTodo,
    editTodo,
    editNotes,
    toggle,
    removeTodo,
    reorder,
    completedCount,
  };
}
