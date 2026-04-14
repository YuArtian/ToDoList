import { useEffect, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Todo } from "../types";
import { NotesEditor } from "./NotesEditor";
import { useTodoAnimations } from "../animations/useTodoAnimations";
import { useSparkle } from "../decorations/Sparkle";
import "./TodoItem.css";

interface TodoItemProps {
  todo: Todo;
  isNew?: boolean;
  forceExpandedSignal?: number;
  forceExpanded?: boolean;
  onToggle: (id: number, completed: number) => void;
  onEdit: (id: number, title: string) => void;
  onEditNotes: (id: number, notes: string) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({
  todo,
  isNew,
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

  const itemRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const { animateAdd, animateRemove, animateComplete } = useTodoAnimations();
  const emitSparkle = useSparkle();

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

  // Animate new items on mount
  useEffect(() => {
    if (isNew && itemRef.current) {
      animateAdd(itemRef.current);
    }
  }, [isNew, animateAdd]);

  // Global "expand all / collapse all" signal
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

  const handleToggle = () => {
    if (editing) return;
    if (!todo.completed && checkboxRef.current) {
      animateComplete(checkboxRef.current);
      emitSparkle(checkboxRef.current);
    }
    onToggle(todo.id, todo.completed ? 0 : 1);
  };

  const handleDelete = async () => {
    if (itemRef.current) {
      await animateRemove(itemRef.current);
    }
    onDelete(todo.id);
  };

  const setRefs = (node: HTMLElement | null) => {
    setNodeRef(node);
    (itemRef as React.MutableRefObject<HTMLDivElement | null>).current =
      node as HTMLDivElement | null;
  };

  const notes = todo.notes ?? "";
  const hasNotes = notes.trim() !== "" && notes !== "<p></p>";

  return (
    <div
      ref={setRefs}
      style={style}
      className={`todo-item ${todo.completed ? "completed" : ""} ${isDragging ? "dragging" : ""}`}
    >
      <div className="todo-row" onClick={handleToggle}>
        <div className="drag-handle" {...attributes} {...listeners}>
          ⠿
        </div>

        <button
          ref={checkboxRef}
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
            onClick={handleDelete}
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
            if (html !== notes) {
              onEditNotes(todo.id, html);
            }
          }}
        />
      )}
    </div>
  );
}
