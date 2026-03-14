import Database from "@tauri-apps/plugin-sql";
import type { Todo, Category } from "../types";

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await Database.load("sqlite:todolist.db");
  }
  return db;
}

// Categories
export async function fetchCategories(): Promise<Category[]> {
  const d = await getDb();
  return await d.select<Category[]>("SELECT * FROM categories ORDER BY id");
}

export async function createCategory(name: string): Promise<void> {
  const d = await getDb();
  await d.execute("INSERT INTO categories (name) VALUES (?)", [name]);
}

export async function deleteCategory(id: number): Promise<void> {
  const d = await getDb();
  await d.execute("DELETE FROM categories WHERE id = ?", [id]);
}

// Todos
export async function fetchTodos(categoryId?: number | null): Promise<Todo[]> {
  const d = await getDb();
  if (categoryId != null) {
    return await d.select<Todo[]>(
      "SELECT * FROM todos WHERE category_id = ? ORDER BY completed ASC, created_at DESC",
      [categoryId]
    );
  }
  return await d.select<Todo[]>(
    "SELECT * FROM todos ORDER BY completed ASC, created_at DESC"
  );
}

export async function createTodo(
  title: string,
  categoryId: number | null
): Promise<void> {
  const d = await getDb();
  await d.execute(
    "INSERT INTO todos (title, category_id) VALUES (?, ?)",
    [title, categoryId]
  );
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
