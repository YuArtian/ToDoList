import { useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import gsap from "gsap";
import type { Todo } from "../types";
import { TodoItem } from "./TodoItem";
import { SleepingCat } from "../decorations/SleepingCat";
import { EASE_ENTER, DURATION } from "../animations/gsapConfig";
import "./TodoList.css";

interface TodoListProps {
  todos: Todo[];
  forceExpandedSignal?: number;
  forceExpanded?: boolean;
  onToggle: (id: number, completed: number) => void;
  onEdit: (id: number, title: string) => void;
  onEditNotes: (id: number, notes: string) => void;
  onDelete: (id: number) => void;
  onReorder: (ids: number[]) => void;
}

export function TodoList({
  todos,
  forceExpandedSignal,
  forceExpanded,
  onToggle,
  onEdit,
  onEditNotes,
  onDelete,
  onReorder,
}: TodoListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const prevIdsRef = useRef<Set<number>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Stagger animation on first load
  useEffect(() => {
    if (hasAnimated.current || !listRef.current || todos.length === 0) return;
    hasAnimated.current = true;

    const items = listRef.current.querySelectorAll(".todo-item");
    gsap.fromTo(
      items,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: DURATION.normal, ease: EASE_ENTER, stagger: 0.05 }
    );
  }, [todos.length]);

  // Track which IDs are new (just added)
  const currentIds = new Set(todos.map((t) => t.id));
  const newIds = new Set(
    todos
      .filter((t) => !prevIdsRef.current.has(t.id))
      .map((t) => t.id)
  );

  useEffect(() => {
    prevIdsRef.current = currentIds;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(todos, oldIndex, newIndex);
    onReorder(reordered.map((t) => t.id));
  };

  if (todos.length === 0) {
    return (
      <div className="todo-empty">
        <SleepingCat />
        <p>暂无待办事项</p>
        <p className="todo-empty-hint">享受休息时光吧</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={todos.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="todo-list" ref={listRef}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isNew={hasAnimated.current && newIds.has(todo.id)}
              forceExpandedSignal={forceExpandedSignal}
              forceExpanded={forceExpanded}
              onToggle={onToggle}
              onEdit={onEdit}
              onEditNotes={onEditNotes}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
