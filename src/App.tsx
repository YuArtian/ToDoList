import { useState } from "react";
import { Header } from "./components/Header";
import { TodoList } from "./components/TodoList";
import { TodoForm } from "./components/TodoForm";
import { useTodos } from "./hooks/useTodos";
import "./App.css";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [allNotesExpanded, setAllNotesExpanded] = useState(false);
  const [expandSignal, setExpandSignal] = useState(0);

  const refresh = () => setRefreshKey((k) => k + 1);

  const {
    todos,
    addTodo,
    editTodo,
    editNotes,
    toggle,
    removeTodo,
    reorder,
    completedCount,
  } = useTodos(refreshKey);

  const handleToggleAllNotes = () => {
    setAllNotesExpanded((v) => !v);
    setExpandSignal((s) => s + 1);
  };

  return (
    <div className="app">
      <Header
        totalCount={todos.length}
        completedCount={completedCount}
        collapsed={collapsed}
        allNotesExpanded={allNotesExpanded}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onToggleAllNotes={handleToggleAllNotes}
      />
      {!collapsed && (
        <main className="main">
          <div className="content">
            <TodoList
              todos={todos}
              forceExpandedSignal={expandSignal}
              forceExpanded={allNotesExpanded}
              onToggle={async (id, completed) => {
                await toggle(id, completed);
                refresh();
              }}
              onEdit={async (id, title) => {
                await editTodo(id, title);
                refresh();
              }}
              onEditNotes={async (id, notes) => {
                console.log("[App] onEditNotes called", { id, notes });
                try {
                  await editNotes(id, notes);
                  console.log("[App] editNotes resolved", { id });
                  refresh();
                } catch (err) {
                  console.error("[App] editNotes failed", err);
                }
              }}
              onDelete={async (id) => {
                await removeTodo(id);
                refresh();
              }}
              onReorder={async (ids) => {
                await reorder(ids);
                refresh();
              }}
            />
            <TodoForm
              onAdd={async (title) => {
                await addTodo(title);
                refresh();
              }}
            />
          </div>
        </main>
      )}
    </div>
  );
}

export default App;
