import { useState, useEffect, useCallback } from "react";
import type { Todo } from "../types";
import {
  fetchTodos,
  createTodo,
  updateTodoTitle,
  toggleTodo,
  deleteTodo,
  reorderTodos,
} from "../lib/commands";

export function useTodos(categoryId: number | null, refreshKey: number) {
  const [todos, setTodos] = useState<Todo[]>([]);

  const load = useCallback(async () => {
    const data = await fetchTodos(categoryId);
    setTodos(data);
  }, [categoryId]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const addTodo = async (title: string) => {
    await createTodo(title, categoryId);
    await load();
  };

  const editTodo = async (id: number, title: string) => {
    await updateTodoTitle(id, title);
    await load();
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

  return { todos, addTodo, editTodo, toggle, removeTodo, reorder, completedCount };
}
