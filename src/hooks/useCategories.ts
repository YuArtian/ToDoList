import { useState, useEffect, useCallback } from "react";
import type { Category } from "../types";
import { fetchCategories, createCategory, deleteCategory } from "../lib/commands";

export function useCategories(refreshKey: number) {
  const [categories, setCategories] = useState<Category[]>([]);

  const load = useCallback(async () => {
    const data = await fetchCategories();
    setCategories(data);
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const addCategory = async (name: string) => {
    await createCategory(name);
    await load();
  };

  const removeCategory = async (id: number) => {
    await deleteCategory(id);
    await load();
  };

  return { categories, addCategory, removeCategory };
}
