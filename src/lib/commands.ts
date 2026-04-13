import Database from "@tauri-apps/plugin-sql";
import type { Todo } from "../types";

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load("sqlite:todolist.db");
  }
  return db;
}

// Todos
export async function fetchTodos(): Promise<Todo[]> {
  const d = await getDb();
  return await d.select<Todo[]>(
    "SELECT * FROM todos ORDER BY sort_order ASC, id ASC"
  );
}

export async function createTodo(title: string): Promise<void> {
  const d = await getDb();
  await d.execute("INSERT INTO todos (title) VALUES (?)", [title]);
}

export async function updateTodoTitle(
  id: number,
  title: string
): Promise<void> {
  const d = await getDb();
  await d.execute(
    "UPDATE todos SET title = ?, updated_at = datetime('now') WHERE id = ?",
    [title, id]
  );
}

export async function updateTodoNotes(
  id: number,
  notes: string
): Promise<void> {
  console.log("[commands] updateTodoNotes SQL", { id, notes });
  const d = await getDb();
  const result = await d.execute(
    "UPDATE todos SET notes = ?, updated_at = datetime('now') WHERE id = ?",
    [notes, id]
  );
  console.log("[commands] updateTodoNotes result", result);
}

export async function fetchTodosDebug(): Promise<void> {
  const d = await getDb();
  const rows = await d.select("SELECT id, title, notes FROM todos");
  console.log("[commands] fetchTodosDebug", rows);
}

export async function toggleTodo(id: number, completed: number): Promise<void> {
  const d = await getDb();
  await d.execute(
    "UPDATE todos SET completed = ?, updated_at = datetime('now') WHERE id = ?",
    [completed, id]
  );
}

export async function deleteTodo(id: number): Promise<void> {
  const d = await getDb();
  await d.execute("DELETE FROM todos WHERE id = ?", [id]);
}

export async function reorderTodos(ids: number[]): Promise<void> {
  const d = await getDb();
  for (let i = 0; i < ids.length; i++) {
    await d.execute("UPDATE todos SET sort_order = ? WHERE id = ?", [i, ids[i]]);
  }
}
