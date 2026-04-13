import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Todo } from "../types";
import { NotesEditor } from "./NotesEditor";
import "./TodoItem.css";

interface TodoItemProps {
  todo: Todo;
  forceExpandedSignal?: number;
  forceExpanded?: boolean;
  onToggle: (id: number, completed: number) => void;
  onEdit: (id: number, title: string) => void;
  onEditNotes: (id: number, notes: string) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({
  todo,
  forceExpandedSignal,
  forceExpanded,
  onToggle,
  onEdit,
  onEditNotes,
  onDelete,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [showNotes, setShowNotes] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Global "expand all / collapse all" signal: resets this item's local state
  // whenever the signal changes. User is still free to toggle afterwards.
  useEffect(() => {
    if (forceExpandedSignal === undefined) return;
    setShowNotes(!!forceExpanded);
  }, [forceExpandedSignal, forceExpanded]);

  const handleSave = () => {
    const title = editTitle.trim();
    if (title && title !== todo.title) {
      onEdit(todo.id, title);
    }
    setEditing(false);
  };

  const notes = todo.notes ?? "";
  const hasNotes = notes.trim() !== "" && notes !== "<p></p>";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`todo-item ${todo.completed ? "completed" : ""} ${isDragging ? "dragging" : ""}`}
    >
      <div
        className="todo-row"
        onClick={() => !editing && onToggle(todo.id, todo.completed ? 0 : 1)}
      >
        <div className="drag-handle" {...attributes} {...listeners}>
          ⠿
        </div>

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
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <span className="todo-title">{todo.title}</span>
        )}

        <div className="todo-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`todo-action-btn notes ${hasNotes ? "has-notes" : ""} ${showNotes ? "active" : ""}`}
            onClick={() => setShowNotes((v) => !v)}
            title={showNotes ? "隐藏备注" : "显示备注"}
          >
            &#128221;
          </button>
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

      {showNotes && (
        <NotesEditor
          initialHtml={notes}
          onSave={(html) => {
            console.log("[TodoItem] onSave received", {
              id: todo.id,
              html,
              prevNotes: notes,
              changed: html !== notes,
            });
            if (html !== notes) {
              onEditNotes(todo.id, html);
            }
          }}
        />
      )}
    </div>
  );
}
