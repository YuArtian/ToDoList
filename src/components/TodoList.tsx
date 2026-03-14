import type { Todo } from "../types";
import { TodoItem } from "./TodoItem";
import "./TodoList.css";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, completed: number) => void;
  onEdit: (id: number, title: string) => void;
  onDelete: (id: number) => void;
}

export function TodoList({ todos, onToggle, onEdit, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="todo-empty">
        <p>暂无待办事项</p>
        <p className="todo-empty-hint">点击下方「+ 添加任务」开始</p>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
