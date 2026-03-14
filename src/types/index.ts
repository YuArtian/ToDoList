export interface Todo {
  id: number;
  title: string;
  completed: number;
  category_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
}
