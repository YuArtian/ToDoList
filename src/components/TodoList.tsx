import { useRef, useState } from "react";
import type { Todo } from "../types";
import { TodoItem } from "./TodoItem";
import "./TodoList.css";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number, completed: number) => void;
  onEdit: (id: number, title: string) => void;
  onDelete: (id: number) => void;
  onReorder: (ids: number[]) => void;
}

export function TodoList({ todos, onToggle, onEdit, onDelete, onReorder }: TodoListProps) {
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    const from = dragIndex.current;
    const to = dragOverIndex;
    dragIndex.current = null;
    setDragOverIndex(null);

    if (from === null || to === null || from === to) return;

    const newTodos = [...todos];
    const [moved] = newTodos.splice(from, 1);
    newTodos.splice(to, 0, moved);
    onReorder(newTodos.map((t) => t.id));
  };

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
      {todos.map((todo, index) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          index={index}
          isDragging={dragIndex.current === index}
          isDragOver={dragOverIndex === index && dragIndex.current !== index}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
}
