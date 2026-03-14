import { useState } from "react";
import type { Todo } from "../types";
import "./TodoItem.css";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number, completed: number) => void;
  onEdit: (id: number, title: string) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    const title = editTitle.trim();
    if (title && title !== todo.title) {
      onEdit(todo.id, title);
    }
    setEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <button
        className={`todo-checkbox ${todo.completed ? "checked" : ""}`}
        onClick={() => onToggle(todo.id, todo.completed ? 0 : 1)}
        aria-label={todo.completed ? "标记为未完成" : "标记为已完成"}
      />

      {editing ? (
        <input
          className="todo-edit-input"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setEditTitle(todo.title);
              setEditing(false);
            }
          }}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span
          className="todo-title"
          onDoubleClick={() => {
            setEditTitle(todo.title);
            setEditing(true);
          }}
        >
          {todo.title}
        </span>
      )}

      <div className="todo-actions">
        <button
          className="todo-action-btn"
          onClick={() => {
            setEditTitle(todo.title);
            setEditing(true);
          }}
          title="编辑"
        >
          &#9998;
        </button>
        <button
          className="todo-action-btn delete"
          onClick={() => onDelete(todo.id)}
          title="删除"
        >
          &#128465;
        </button>
      </div>
    </div>
  );
}
