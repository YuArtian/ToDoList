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
import type { Todo } from "../types";
import { TodoItem } from "./TodoItem";
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
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

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
        <p>暂无待办事项</p>
        <p className="todo-empty-hint">点击下方「+ 添加任务」开始</p>
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
        <div className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
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
