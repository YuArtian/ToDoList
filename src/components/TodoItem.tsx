import { useState } from "react";
import type { Todo } from "../types";
import "./TodoItem.css";

interface TodoItemProps {
  todo: Todo;
  index: number;
  isDragging: boolean;
  isDragOver: boolean;
  onToggle: (id: number, completed: number) => void;
  onEdit: (id: number, title: string) => void;
  onDelete: (id: number) => void;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
}

export function TodoItem({
  todo,
  index,
  isDragging,
  isDragOver,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    const title = editTitle.trim();
    if (title && title !== todo.title) {
      onEdit(todo.id, title);
    }
    setEditing(false);
  };

  const classNames = [
    "todo-item",
    todo.completed ? "completed" : "",
    isDragging ? "dragging" : "",
    isDragOver ? "drag-over" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classNames}
      draggable
      onClick={() => !editing && onToggle(todo.id, todo.completed ? 0 : 1)}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(index);
      }}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={onDragEnd}
    >
      <button
        className={`todo-checkbox ${todo.completed ? "checked" : ""}`}
        onClick={(e) => e.stopPropagation()}
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
        <span className="todo-title">{todo.title}</span>
      )}

      <div className="todo-actions" onClick={(e) => e.stopPropagation()}>
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
